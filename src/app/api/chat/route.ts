import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { conversations, leads, messages } from "@/db/schema";
import { advance, initialMessage } from "@/lib/chat-engine";
import { getDb } from "@/lib/db";
import { commitSheetTurn, createSheetConversation, getSheetConversation, sheetsConfigured } from "@/lib/sheets-store";

export const runtime = "nodejs";
const inputSchema = z.object({ conversationId: z.uuid().optional(), message: z.string().trim().min(1).max(2000).optional() });
const code = () => `EJX-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;

export async function POST(request: Request) {
  try {
    const input = inputSchema.parse(await request.json());
    if(process.env.CHAT_STORAGE_PROVIDER==="sheets")return handleSheets(input);
    const db = getDb();
    if (!input.conversationId) {
      const [lead] = await db.insert(leads).values({ publicCode: code() }).returning();
      const [conversation] = await db.insert(conversations).values({ leadId: lead.id }).returning();
      const greeting = initialMessage();
      await db.insert(messages).values({ conversationId: conversation.id, direction: "OUTBOUND", text: greeting });
      return NextResponse.json({ conversationId: conversation.id, message: greeting });
    }
    if (!input.message) return NextResponse.json({ error: "Mensaje requerido" }, { status: 400 });
    const [conversation] = await db.select().from(conversations).where(eq(conversations.id, input.conversationId)).limit(1);
    if (!conversation) return NextResponse.json({ error: "Conversación no encontrada" }, { status: 404 });
    await db.insert(messages).values({ conversationId: conversation.id, direction: "INBOUND", text: input.message });
    const reply = advance(conversation.state, input.message); const context = { ...conversation.context };
    if (reply.field && reply.value) context[reply.field] = reply.value;
    await db.update(conversations).set({ state: reply.next, context, consentAccepted: conversation.consentAccepted || conversation.state === "CONSENT_REQUIRED" && reply.next === "ASK_FULL_NAME", updatedAt: new Date() }).where(and(eq(conversations.id, conversation.id), eq(conversations.state, conversation.state)));
    const leadUpdate: Record<string, string | Date> = { updatedAt: new Date() };
    if (reply.field && reply.value) leadUpdate[reply.field] = reply.value === "Omitir" ? "" : reply.value;
    if (reply.priority) leadUpdate.priority = reply.priority;
    if (reply.completed) leadUpdate.status = "PENDING_REVIEW";
    await db.update(leads).set(leadUpdate).where(eq(leads.id, conversation.leadId));
    await db.insert(messages).values({ conversationId: conversation.id, direction: "OUTBOUND", text: reply.completed ? `${reply.message} Número: ${(await db.select({ code: leads.publicCode }).from(leads).where(eq(leads.id, conversation.leadId)).limit(1))[0].code}` : reply.message });
    return NextResponse.json({ conversationId: conversation.id, message: reply.message, state: reply.next, completed: reply.completed });
  } catch (error) {
    const missingDb = error instanceof Error && error.message === "DATABASE_URL_NOT_CONFIGURED";
    return NextResponse.json({ error: missingDb ? "El chat estará disponible al conectar la base de datos." : "No pudimos procesar el mensaje." }, { status: missingDb ? 503 : 400 });
  }
}

async function handleSheets(input:z.infer<typeof inputSchema>){
  if(!sheetsConfigured())return NextResponse.json({error:"El almacenamiento de consultas no está configurado."},{status:503});
  if(!input.conversationId){const conversationId=crypto.randomUUID(),leadId=crypto.randomUUID(),publicCode=code(),greeting=initialMessage();await createSheetConversation({conversationId,leadId,publicCode,greeting});return NextResponse.json({conversationId,message:greeting})}
  if(!input.message)return NextResponse.json({error:"Mensaje requerido"},{status:400});
  const conversation=await getSheetConversation(input.conversationId);const reply=advance(conversation.state,input.message);const context={...conversation.context};if(reply.field&&reply.value)context[reply.field]=reply.value;
  const outbound=reply.completed?`${reply.message} Número: ${conversation.publicCode}`:reply.message;
  await commitSheetTurn({conversationId:conversation.conversationId,leadId:conversation.leadId,expectedState:conversation.state,nextState:reply.next,context,consentAccepted:conversation.consentAccepted||conversation.state==="CONSENT_REQUIRED"&&reply.next==="ASK_FULL_NAME",inbound:input.message,outbound,leadField:reply.field,leadValue:reply.value==="Omitir"?"":reply.value,priority:reply.priority,completed:reply.completed});
  return NextResponse.json({conversationId:conversation.conversationId,message:outbound,state:reply.next,completed:reply.completed})
}
