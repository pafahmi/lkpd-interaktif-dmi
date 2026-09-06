import type { Metadata } from "next";
import "./globals.css";
import "./worksheet.css";
import "./identity.css";

export const metadata: Metadata = {
  title: "LKPD Interaktif DMI • XII DKV",
  description: "LKPD interaktif 80 menit Desain Media Interaktif kelas XII DKV dengan penyimpanan jawaban dan log aktivitas.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased">{children}</body>
    </html>
  );
}
