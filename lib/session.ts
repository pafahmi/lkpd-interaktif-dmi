import { env } from "cloudflare:workers";

export const now = () => new Date().toISOString();
export function maskPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length < 8 || digits.length > 15) throw new Error("Nomor HP tidak valid");
  return `${digits.slice(0,2)}•••••${digits.slice(-4)}`;
}
export async function hashToken(token: string) {
  const bytes = new TextEncoder().encode(token);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map(b=>b.toString(16).padStart(2,"0")).join("");
}
export function cookieValue(request: Request, name: string) {
  const cookie=request.headers.get("cookie")||"";
  return cookie.split(";").map(v=>v.trim()).find(v=>v.startsWith(name+"="))?.slice(name.length+1)||null;
}
export async function requireSession(request: Request) {
  const token=cookieValue(request,"dmi_session");
  if(!token) return null;
  const hash=await hashToken(token);
  return env.DB.prepare(`SELECT s.id session_id,s.student_id,st.student_name,st.class_name FROM sessions s JOIN students st ON st.id=s.student_id WHERE s.token_hash=? AND s.logout_at IS NULL`).bind(hash).first<{session_id:number;student_id:number;student_name:string;class_name:string}>();
}
export function isAdmin(request: Request) {
  const email=request.headers.get("oai-authenticated-user-email")?.toLowerCase();
  return !!email && email===String(env.ADMIN_EMAIL||"").toLowerCase();
}
