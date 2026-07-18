import { NextResponse } from "next/server";
export function GET() { const provider=process.env.CHAT_STORAGE_PROVIDER??"postgres";return NextResponse.json({status:"ok",storageProvider:provider,storageConfigured:provider==="sheets"?Boolean(process.env.GOOGLE_SHEETS_WEBHOOK_URL&&process.env.GOOGLE_SHEETS_WEBHOOK_SECRET):Boolean(process.env.DATABASE_URL),timestamp:new Date().toISOString()}); }
