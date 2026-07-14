# Panduan Deploy — Asterra Studio (Vercel + MySQL serverless)

Langkah go-live. Kode sudah production-ready; yang tersisa butuh akun & aksi manual dari kamu.
Gambar tetap di **Cloudinary** (tak berubah).

Arsitektur produksi:
- **App Next.js** → Vercel
- **Database MySQL** → penyedia serverless (Railway / Aiven / PlanetScale)
- **Gambar** → Cloudinary (sudah jalan)

---

## 1. Siapkan database produksi (MySQL serverless)

Pilih salah satu penyedia (semua punya free/murah tier). Rekomendasi **Railway** (paling gampang, MySQL asli):

### Railway
1. Daftar di https://railway.app → **New Project** → **Provision MySQL**.
2. Buka service MySQL → tab **Variables** / **Connect** → salin **connection URL** (bentuk
   `mysql://user:pass@host:port/railway`).
3. **Batasi koneksi** (penting untuk serverless): tambahkan query param di akhir URL →
   `...?connectionLimit=3`. Contoh final:
   ```
   mysql://user:pass@host:port/railway?connectionLimit=3
   ```

> Aiven / PlanetScale juga bisa. Untuk **PlanetScale**, FK fisik tak didukung → tambahkan
> `relationMode = "prisma"` di `datasource` schema, `@@index` FK sudah ada. Railway/Aiven tak perlu ini.

---

## 2. Push kode ke GitHub

Repo sudah di-`git init` + commit awal. Buat repo GitHub lalu push:
```bash
# buat repo kosong di github.com dulu (tanpa README), lalu:
git remote add origin https://github.com/<user>/asterra-studio.git
git branch -M main
git push -u origin main
```

---

## 3. Deploy ke Vercel

1. Daftar di https://vercel.com (login pakai GitHub).
2. **Add New → Project** → import repo `asterra-studio`.
3. Framework auto-terdeteksi **Next.js**. Jangan ubah build settings.
4. **Environment Variables** — tambahkan semua ini (Settings → Environment Variables):

   | Key | Value |
   |-----|-------|
   | `DATABASE_URL` | connection URL dari langkah 1 (**dengan** `?connectionLimit=3`) |
   | `AUTH_SECRET` | string acak kuat — generate: `openssl rand -base64 32` |
   | `NEXTAUTH_URL` | URL produksi Vercel (mis. `https://asterra-studio.vercel.app`) — isi setelah tahu domainnya |
   | `CLOUDINARY_CLOUD_NAME` | dari .env.local |
   | `CLOUDINARY_API_KEY` | dari .env.local |
   | `CLOUDINARY_API_SECRET` | dari .env.local |
   | `SEED_ADMIN_EMAIL` | email admin produksi |
   | `SEED_ADMIN_PASSWORD` | password admin **kuat** (bukan yang dev) |

5. Klik **Deploy**. Tunggu build selesai.

> Catatan `NEXTAUTH_URL`: kalau belum tahu domainnya, deploy dulu, lihat domain yang diberikan Vercel,
> lalu isi env ini & redeploy.

---

## 4. Migrasi + seed database produksi

DB produksi masih kosong. Jalankan migrasi + seed **dari komputermu** (menunjuk ke DB produksi):

```bash
# set DATABASE_URL produksi sementara (jangan simpan di .env.local):
# Windows PowerShell:
$env:DATABASE_URL="mysql://...railway...?connectionLimit=3"
# atau bash:
export DATABASE_URL="mysql://...railway...?connectionLimit=3"

# terapkan struktur tabel:
npm run db:deploy      # = prisma migrate deploy

# isi data awal (kategori, admin, setting):
#   pastikan SEED_ADMIN_EMAIL & SEED_ADMIN_PASSWORD juga di-set di shell
npm run db:seed
```

> Alternatif: sebagian orang menaruh `prisma migrate deploy` di build command Vercel. Kami **tidak**
> lakukan itu agar build tak gagal karena DB — migrasi manual lebih aman & terkontrol.

---

## 5. Verifikasi produksi

- Buka domain Vercel → katalog tampil.
- `/admin/login` → login dengan `SEED_ADMIN_EMAIL`/`SEED_ADMIN_PASSWORD` produksi.
- Tambah produk + **upload gambar** (cek muncul di Cloudinary Media Library folder `asterra`).
- Tambah ke keranjang → checkout WhatsApp → link `wa.me` benar.
- Atur nomor WA asli di **/admin/pengaturan**.

---

## 6. Setelah live (opsional tapi disarankan)

- **Domain kustom**: Vercel → Settings → Domains (bisa domain sendiri).
- **Ganti kredensial**: pastikan `AUTH_SECRET` & password admin produksi kuat & berbeda dari dev.
- **Regenerate Cloudinary API Secret** bila secret pernah bocor.
- **Batas upload Vercel**: serverless function limit body ~4.5 MB. `imageService` sudah batasi 5 MB/foto;
  bila perlu, turunkan ke 4 MB di `lib/services/imageService.ts` (`MAX_BYTES`).

---

## Ringkasan env produksi (checklist)

- [ ] `DATABASE_URL` (+`?connectionLimit=3`)
- [ ] `AUTH_SECRET` (acak kuat)
- [ ] `NEXTAUTH_URL` (domain produksi)
- [ ] `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET`
- [ ] `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`
- [ ] `npm run db:deploy` sudah dijalankan
- [ ] `npm run db:seed` sudah dijalankan
