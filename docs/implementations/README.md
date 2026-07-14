# Implementations — Asterra Studio

Dokumen implementasi pengerjaan. **Setiap tiket** di [`../tickets/`](../tickets/) yang selesai
**wajib** punya satu dokumen implementasi di sini — catatan apa yang benar-benar dikerjakan,
keputusan yang diambil, dan cara verifikasinya.

## Cara pakai

- Nama file **sama** dengan tiketnya: tiket `P2-03-katalog-grid.md` → implementasi
  `docs/implementations/P2-03-katalog-grid.md`.
- Tulis **saat/segera setelah** mengerjakan tiket, selagi konteks masih segar.
- Fokus pada **yang nyata terjadi** (file dibuat, keputusan, kendala), bukan menyalin ulang tiket.
- Kalau implementasi menyimpang dari tiket, catat **kenapa** di bagian "Catatan / penyimpangan".

## Template dokumen implementasi

```markdown
# Implementasi <FASE>-<NN> — <Judul>

- **Tiket:** [`../tickets/<FASE>-<NN>-<slug>.md`](../tickets/<FASE>-<NN>-<slug>.md)
- **Tanggal:** YYYY-MM-DD
- **Status:** ✅ Selesai

## Ringkasan
<Apa yang dikerjakan, 1–3 kalimat.>

## File yang dibuat / diubah
| File | Perubahan |
|------|-----------|
| `lib/…` | dibuat: … |

## Keputusan penting
- <Keputusan + alasan singkat.>

## Cara verifikasi
- <Perintah / langkah manual untuk membuktikan fitur jalan.>
- Hasil: <lint/build lolos? screenshot? output?>

## Catatan / penyimpangan
- <Beda dari tiket, hal yang ditunda, TODO menyusul. "—" bila tidak ada.>
```
