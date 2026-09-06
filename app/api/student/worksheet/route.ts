import { env } from "cloudflare:workers";
import { now, requireSession } from "@/lib/session";

export async function GET(request:Request){
  const s=await requireSession(request);if(!s)return Response.json({error:"Sesi berakhir"},{status:401});
  const row=await env.DB.prepare(`SELECT answers,completed,updated_at,submitted_at FROM worksheet_responses WHERE student_id=?`).bind(s.student_id).first();
  return Response.json({worksheet:row||null});
}
export async function POST(request:Request){
  const s=await requireSession(request);if(!s)return Response.json({error:"Sesi berakhir"},{status:401});
  const body=await request.json() as {answers?:unknown;submitted?:boolean;stage?:string;progress?:number};
  const raw=JSON.stringify(body.answers||{});if(raw.length>20000)return Response.json({error:"Jawaban terlalu panjang"},{status:400});
  const at=now(),submitted=!!body.submitted,stage=String(body.stage||"LKPD").slice(0,80),progress=Math.max(0,Math.min(100,Number(body.progress)||0));
  await env.DB.batch([
    env.DB.prepare(`INSERT INTO worksheet_responses(student_id,answers,completed,updated_at,submitted_at) VALUES(?,?,?,?,?) ON CONFLICT(student_id) DO UPDATE SET answers=excluded.answers,completed=excluded.completed,updated_at=excluded.updated_at,submitted_at=COALESCE(excluded.submitted_at,worksheet_responses.submitted_at)`).bind(s.student_id,raw,submitted?1:0,at,submitted?at:null),
    env.DB.prepare(`UPDATE sessions SET last_active_at=?,current_page=?,progress=? WHERE id=?`).bind(at,stage,progress,s.session_id),
    env.DB.prepare(`INSERT INTO activities(student_id,session_id,event_type,page,detail,created_at) VALUES(?,?,?,?,?,?)`).bind(s.student_id,s.session_id,submitted?"lkpd_submitted":"lkpd_saved",stage,`Progres ${progress}%`,at)
  ]);
  return Response.json({ok:true,updatedAt:at,submitted});
}
