# Tickets — Asterra Studio

Breakdown task development per tiket, diturunkan dari [`../FEATURES.md`](../FEATURES.md) dan
[`../DATABASE.md`](../DATABASE.md). Urutan tiket mengikuti Fase 1–5 di `CLAUDE.md` §10.

## Cara pakai

1. Kerjakan tiket **berurutan** sesuai penomoran (dependency sudah dirancang searah).
2. Sebelum mulai, baca `Dependency` tiket — pastikan tiket prasyarat sudah selesai.
3. Patuhi `Definition of Done` tiap tiket + checklist global di [`../RULES.md`](../RULES.md) §9.
4. **Setelah selesai**, tulis dokumen implementasi di [`../implementations/`](../implementations/)
   (satu file per tiket, nama sama dengan tiket). Lihat `../implementations/README.md`.
5. Update status di [`INDEX.md`](INDEX.md).

## Konvensi penamaan tiket

```
docs/tickets/<FASE>-<NN>-<slug>.md      mis. P2-03-katalog-grid.md
```

- `<FASE>` = `P1`..`P5` (mengikuti Fase 1–5 roadmap).
- `<NN>` = urutan dalam fase (01, 02, ...).
- `<slug>` = ringkas, kebab-case.

## Template tiket

Setiap tiket memakai struktur berikut:

```markdown
# <FASE>-<NN> — <Judul>

- **Fase:** <n>
- **Fitur terkait (FEATURES.md):** <huruf / —>
- **Prioritas:** <P0 | P1 | P2>
- **Dependency:** <daftar tiket prasyarat / —>
- **Status:** ⬜ Todo | 🔄 In progress | ✅ Done

## Tujuan
<1–2 kalimat: apa yang dicapai tiket ini.>

## Scope
- Yang dikerjakan …

## Di luar scope
- Yang TIDAK dikerjakan di tiket ini …

## Layer yang disentuh
| Layer | File |
|-------|------|
| Repository | … |
| Service | … |
| Controller | … |
| Komponen | … |
| Validasi | … |

## Langkah kerja
1. …

## Definition of Done
- [ ] …
```
