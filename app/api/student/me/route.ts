import { requireSession } from "@/lib/session";
export async function GET(request:Request){const s=await requireSession(request);return s?Response.json({student:s}):Response.json({student:null},{status:401})}
