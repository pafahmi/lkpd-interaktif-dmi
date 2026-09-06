import { env } from "cloudflare:workers";
import { hashToken, maskPhone, now } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const body=await request.json() as {studentName?:string;className?:string;classCode?:string;phone?:string;consent?:boolean};
    const studentName=String(body.studentName||"").trim().replace(/\s+/g," ");
    const allowedClasses=["12 DKV 1","12 DKV 2","12 DKV 3"];
    if(studentName.length<3||studentName.length>80||/\d/.test(studentName)) return Response.json({error:"Masukkan nama lengkap yang valid"},{status:400});
    if(!allowedClasses.includes(String(body.className))) return Response.json({error:"Pilih kelas yang tersedia"},{status:400});
    if(body.classCode!==String(env.CLASS_CODE||"")) return Response.json({error:"Kode kelas salah"},{status:401});
    if(body.phone&&!body.consent) return Response.json({error:"Persetujuan diperlukan untuk nomor HP"},{status:400});
    const phoneMasked=body.phone?maskPhone(body.phone):null, at=now();
    const identity=`${body.className}|${studentName.toLocaleLowerCase("id-ID")}`;
    await env.DB.prepare(`INSERT INTO students(nis,student_name,class_name,phone_masked,phone_consent_at,created_at) VALUES(?,?,?,?,?,?) ON CONFLICT(nis) DO UPDATE SET student_name=excluded.student_name,class_name=excluded.class_name,phone_masked=excluded.phone_masked,phone_consent_at=excluded.phone_consent_at`).bind(identity,studentName,body.className,phoneMasked,phoneMasked?at:null,at).run();
    const student=await env.DB.prepare(`SELECT id FROM students WHERE nis=?`).bind(identity).first<{id:number}>();
    if(!student) throw new Error("Gagal membuat profil siswa");
    const token=crypto.randomUUID()+crypto.randomUUID(), hash=await hashToken(token);
    const result=await env.DB.prepare(`INSERT INTO sessions(student_id,token_hash,login_at,last_active_at,current_page,progress) VALUES(?,?,?,?,?,0)`).bind(student.id,hash,at,at,"Beranda").run();
    await env.DB.prepare(`INSERT INTO activities(student_id,session_id,event_type,page,detail,created_at) VALUES(?,?,?,?,?,?)`).bind(student.id,result.meta.last_row_id,"login","Beranda",null,at).run();
    return Response.json({ok:true,studentName,className:body.className},{headers:{"Set-Cookie":`dmi_session=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=28800`}});
  } catch(e) { return Response.json({error:e instanceof Error?e.message:"Gagal masuk"},{status:400}); }
}
