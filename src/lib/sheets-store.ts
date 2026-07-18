import type { ChatState } from "@/db/schema";

type SheetConversation={conversationId:string;leadId:string;publicCode:string;state:ChatState;context:Record<string,string>;consentAccepted:boolean};
type CommitInput={conversationId:string;leadId:string;expectedState:ChatState;nextState:ChatState;context:Record<string,string>;consentAccepted:boolean;inbound:string;outbound:string;leadField?:string;leadValue?:string;priority?:string;completed?:boolean};

async function callSheets<T>(payload:Record<string,unknown>):Promise<T>{const url=process.env.GOOGLE_SHEETS_WEBHOOK_URL,secret=process.env.GOOGLE_SHEETS_WEBHOOK_SECRET;if(!url||!secret)throw new Error("SHEETS_NOT_CONFIGURED");const response=await fetch(url,{method:"POST",headers:{"content-type":"text/plain;charset=utf-8"},body:JSON.stringify({...payload,secret}),redirect:"follow",cache:"no-store",signal:AbortSignal.timeout(12_000)});if(!response.ok)throw new Error("SHEETS_REQUEST_FAILED");const data=await response.json() as T&{ok?:boolean;error?:string};if(data.ok===false)throw new Error(data.error??"SHEETS_OPERATION_FAILED");return data}
export function sheetsConfigured(){return Boolean(process.env.GOOGLE_SHEETS_WEBHOOK_URL&&process.env.GOOGLE_SHEETS_WEBHOOK_SECRET)}
export async function createSheetConversation(input:{conversationId:string;leadId:string;publicCode:string;greeting:string}){await callSheets({action:"create",...input})}
export async function getSheetConversation(conversationId:string){return callSheets<SheetConversation&{ok:true}>({action:"get",conversationId})}
export async function commitSheetTurn(input:CommitInput){return callSheets<{ok:true}>({action:"commit",...input})}
