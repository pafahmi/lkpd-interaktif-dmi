import { env } from "cloudflare:workers";
import { isAdmin } from "@/lib/session";

export async function GET(request:Request){
  if(!isAdmin(request))return Response.json({error:"Akses guru diperlukan"},{status:403});
  const rows=await env.DB.prepare(`SELECT st.id student_id,st.student_name,st.class_name,st.phone_masked,s.login_at,s.logout_at,s.last_active_at,s.current_page,s.progress,(SELECT COUNT(*) FROM quiz_answers q WHERE q.student_id=st.id) answer_count,(SELECT SUM(CASE WHEN q.is_correct=1 THEN 1 ELSE 0 END) FROM quiz_answers q WHERE q.student_id=st.id) correct_count FROM students st LEFT JOIN sessions s ON s.id=(SELECT id FROM sessions s2 WHERE s2.student_id=st.id ORDER BY s2.id DESC LIMIT 1) ORDER BY st.class_name,s.last_active_at DESC`).all();
  const cutoff=Date.now()-45000;
  return Response.json({students:rows.results.map((r:any)=>({...r,online:!r.logout_at&&new Date(r.last_active_at).getTime()>cutoff})),generatedAt:new Date().toISOString()});
}
export async function DELETE(request:Request){
  if(!isAdmin(request))return Response.json({error:"Akses guru diperlukan"},{status:403});
  const {studentId}=await request.json() as {studentId?:number};
  if(!Number.isInteger(studentId))return Response.json({error:"Siswa tidak valid"},{status:400});
  await env.DB.batch([env.DB.prepare(`DELETE FROM quiz_answers WHERE student_id=?`).bind(studentId),env.DB.prepare(`DELETE FROM activities WHERE student_id=?`).bind(studentId),env.DB.prepare(`DELETE FROM sessions WHERE student_id=?`).bind(studentId),env.DB.prepare(`DELETE FROM students WHERE id=?`).bind(studentId)]);
  return Response.json({ok:true});
}
