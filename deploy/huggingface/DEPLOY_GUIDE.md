# 🚀 Panduan Lengkap Deploy Tranvas $0/Bulan Selamanya
*(100% Gratis Tanpa Kartu Kredit)*

Panduan ini memindahkan seluruh backend dan frontend Tranvas agar berjalan 100% gratis selamanya:
- **Backend Go API**: Berjalan di **Hugging Face Spaces** (2 vCPU, 16 GB RAM, port 7860).
- **Frontend Next.js**: Berjalan di **Vercel** (Hobby Tier gratis, custom domain `tranvas.com` + auto SSL).
- **Database**: Tetap di **Supabase** (Postgres Free Tier).

---

## BAGIAN 1: Deploy Backend Go ke Hugging Face Spaces

### Langkah 1: Buat Akun & Buat Space Baru
1. Buka [https://huggingface.co/join](https://huggingface.co/join) (Daftar gratis menggunakan email atau akun GitHub lo, **tanpa kartu kredit**).
2. Setelah login, buat Space baru di: **[https://huggingface.co/new-space](https://huggingface.co/new-space)**
3. Isi form sebagai berikut:
   - **Space name**: `tranvas-api`
   - **License**: `mit` (atau bebas)
   - **Select the Space SDK**: Pilih **Docker**
   - **Choose a Docker template**: Pilih **Blank**
   - **Space Hardware**: Pilih **CPU basic • 2 vCPU • 16 GB RAM • Free** (default)
   - **Privacy**: Pilih **Public**
4. Klik **Create Space**.

---

### Langkah 2: Masukkan Environment Variables (Secrets)
Agar credential database aman dan terenkripsi:
1. Di halaman Space lo, klik tab **Settings**.
2. Scroll ke bagian **Variables and secrets**.
3. Di bagian **New secret**, tambahkan:
   - **Name**: `DATABASE_URL`  
     **Value**: `postgresql://postgres:[PASSWORD]@db.esahuobozjxkyjvpxslu.supabase.co:5432/postgres` (atau connection string Supabase lo)
   - **Name**: `SUPABASE_JWT_SECRET`  
     **Value**: Masukkan JWT secret dari Supabase Dashboard (Settings -> API -> JWT Secret)
4. (Opsional) Di bagian **New variable**, pastikan:
   - **Name**: `PORT`
   - **Value**: `7860`

---

### Langkah 3: Push Kode Backend ke Hugging Face Spaces
Lo punya 2 cara mudah:

#### Opsi A: Menggunakan Script Otomatis (Rekomendasi)
Buka PowerShell di folder project Tranvas dan jalankan:
```powershell
.\deploy\huggingface\sync-hf.ps1 -SpaceUrl "https://huggingface.co/spaces/<USERNAME_LO>/tranvas-api"
```
*(Saat diminta password git, masukkan **Hugging Face User Access Token** dengan permission `write` yang bisa lo buat di [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)).*

#### Opsi B: Git Remote Manual
```bash
git remote add hf https://huggingface.co/spaces/<USERNAME_LO>/tranvas-api
git push hf main --force
```

Setelah di-push, Hugging Face akan otomatis men-trigger proses build Docker. Dalam ~1-2 menit statusnya akan berubah menjadi **Running** (warna hijau).

URL backend lo sekarang aktif di:  
👉 **`https://<USERNAME_LO>-tranvas-api.hf.space`**

Tes dengan membuka endpoint health check di browser:  
`https://<USERNAME_LO>-tranvas-api.hf.space/health` (Harus menampilkan teks `OK`).

---

### Langkah 4: Pasang Trik Anti-Sleep (Agar 24/7 Selamanya)
Agar Hugging Face Space tidak pernah tidur setelah 48 jam:
1. Buka [https://uptimerobot.com](https://uptimerobot.com) (Daftar gratis).
2. Klik **Add New Monitor**:
   - **Monitor Type**: `HTTP(s)`
   - **Friendly Name**: `Tranvas API Health`
   - **URL (or IP)**: `https://<USERNAME_LO>-tranvas-api.hf.space/health`
   - **Monitoring Interval**: `Every 10 minutes`
3. Klik **Create Monitor**.
*Selesai! UptimeRobot akan me-reset timer idle Hugging Face setiap 10 menit sehingga server Go lo tetap aktif 24/7 nonstop.*

---

## BAGIAN 2: Deploy Frontend Next.js ke Vercel

1. Buka [https://vercel.com](https://vercel.com) dan login menggunakan akun GitHub lo.
2. Klik **Add New...** -> **Project**.
3. Pilih repository **Tranvas** dari daftar repository GitHub lo.
4. Di bagian **Environment Variables**, tambahkan:
   - `NEXT_PUBLIC_API_URL` = `https://<USERNAME_LO>-tranvas-api.hf.space/api`
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://esahuobozjxkyjvpxslu.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - `SUPABASE_JWT_SECRET` = *(Secret JWT Supabase lo)*
5. Klik **Deploy**.
6. Setelah selesai, masuk ke **Settings** -> **Domains**, lalu tambahkan domain **`tranvas.com`**.
7. Vercel akan memberikan petunjuk DNS (A record atau CNAME) untuk dimasukkan ke domain provider / Cloudflare lo.

---

## 🎯 SELESAI & STOP TAGIHAN VPS!
Setelah domain `tranvas.com` aktif mengarah ke Vercel dan memanggil backend Hugging Face Spaces:
1. Cek semua modul Tranvas (Planner, Habits, Finance, Journal, Goals, Jobs, Study, Calendar).
2. Jika semua lancar, login ke provider VPS lama lo dan **CANCEL / TERMINATE SERVER**.
3. **Mulai hari ini, biaya operasional Tranvas adalah Rp 0 / $0 selamanya!**
