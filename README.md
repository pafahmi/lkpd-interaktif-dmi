# LKPD Interaktif Desain Media Interaktif

LKPD interaktif berdurasi 80 menit untuk siswa kelas XII DKV SMK Tri Dharma 2 Bogor. Materi berfokus pada pengoperasian dan pengolahan multimedia interaktif berbasis halaman web.

## Fitur

- Login nama lengkap dan pilihan kelas 12 DKV 1–3
- Tujuh tahap kegiatan dengan timer 80 menit
- Penyimpanan jawaban dan progres
- Log aktivitas siswa
- Dashboard guru serta ekspor CSV
- Tampilan responsif untuk ponsel, tablet, dan desktop
- Nomor HP opsional dan hanya disimpan dalam bentuk tersamar
- Tidak membaca alamat IP atau lokasi

## Menjalankan lokal

1. Gunakan Node.js 22.13 atau lebih baru.
2. Jalankan `npm install`.
3. Jalankan `npm run dev`.

Aplikasi menggunakan Cloudflare D1 dengan binding `DB`. Variabel runtime yang diperlukan adalah `CLASS_CODE` dan `ADMIN_EMAIL`. Jangan menyimpan nilai rahasia tersebut di repositori.

## Versi online

Versi aktif dikelola melalui ChatGPT Sites/Cloudflare Workers karena GitHub Pages tidak menyediakan runtime database D1.
