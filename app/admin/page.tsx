import { env } from "cloudflare:workers";
import { requireChatGPTUser, chatGPTSignOutPath } from "@/app/chatgpt-auth";
import AdminDashboard from "./dashboard";
export const dynamic="force-dynamic";
export default async function AdminPage(){const user=await requireChatGPTUser("/admin");if(user.email.toLowerCase()!==String(env.ADMIN_EMAIL||"").toLowerCase())return <main className="center"><section className="login-card"><span className="pill danger">AKSES DITOLAK</span><h1>Akun bukan guru/admin</h1><p>Dashboard hanya tersedia untuk akun yang telah ditetapkan sebagai administrator.</p><a className="button dark" href={chatGPTSignOutPath("/admin")}>Ganti akun</a></section></main>;return <AdminDashboard name={user.displayName}/>}
