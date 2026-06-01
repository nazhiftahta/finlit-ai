# **FinLit AI: Your Financial Learning Assistant**

Finlit AI adalah aplikasi literasi keuangan berbasis web untuk membantu pengguna memahami topik keuangan pribadi, investasi, budgeting, dan mengecek risiko awal suatu platform atau produk investasi.

Project ini berisi frontend React, backend tRPC/Express, integrasi LLM lewat GitHub Models, dan fitur pengecekan risiko investasi berbasis OJK Invest API dengan fallback data lokal.

**Live demo:** https://finlit-ai.vercel.app/

## Fitur Utama

- Chatbot literasi keuangan berbahasa Indonesia.
- Risk checker untuk mengecek risiko awal nama investasi, aplikasi, atau platform.
- Sumber pengecekan dari OJK Invest API.
- Fallback data OJK lokal untuk beberapa entri populer jika API live tidak dapat diakses.
- Referensi katalog API lokal Indonesia dari folder `api/DAFTAR-API-LOKAL-INDONESIA-master`.
- UI responsive dengan navigasi bawah untuk Beranda, Risiko, Panduan, dan Chat.

## Struktur Project

```text
.
+-- api/
|   +-- DAFTAR-API-LOKAL-INDONESIA-master/
|   +-- public-apis-master/
+-- finlit-ai-v2/
    +-- api/
    +-- client/
    +-- server/
    +-- shared/
    +-- package.json
    +-- vercel.json
    +-- vite.config.ts
```

Folder aplikasi utama berada di `finlit-ai-v2`.

## Teknologi

- React 19
- Vite
- TypeScript
- Tailwind CSS
- tRPC
- Express
- GitHub Models API
- OJK Invest API
- Vercel Serverless Function

## Menjalankan Lokal

Masuk ke folder aplikasi:

```bash
cd finlit-ai-v2
```

Install dependency:

```bash
corepack enable
pnpm install
```

Buat file `.env` di dalam `finlit-ai-v2`:

```env
NODE_ENV=development
GITHUB_MODELS_API_KEY=isi_token_github_models
GITHUB_MODELS_MODEL=openai/gpt-4o
OJK_INVEST_API_URL=https://ojk-invest-api.namchee.dev
```

Jalankan aplikasi:

```bash
pnpm dev
```

## Build dan Check

```bash
cd finlit-ai-v2
pnpm check
pnpm build
```

Build menghasilkan:

- `dist/public` untuk frontend.
- `dist/index.js` untuk server Node lokal.
- `dist/api.js` untuk serverless API di Vercel.

## Deploy ke Vercel

Gunakan konfigurasi berikut di Vercel:

- Framework Preset: `Other`
- Root Directory: `finlit-ai-v2`
- Install Command: `corepack enable && pnpm install --frozen-lockfile --prod=false`
- Build Command: `pnpm build`
- Output Directory: `dist/public`

Environment Variables di Vercel:

```env
NODE_ENV=production
GITHUB_MODELS_API_KEY=isi_token_github_models
GITHUB_MODELS_MODEL=openai/gpt-4o
OJK_INVEST_API_URL=https://ojk-invest-api.namchee.dev
```

Setelah push ke GitHub, lakukan redeploy di Vercel. Jika perubahan backend belum terbaca, gunakan opsi `Redeploy without cache`.

## Sumber Data Risk Checker

Risk checker memakai beberapa lapisan pengecekan:

1. OJK Invest API live untuk data ilegal, aplikasi legal, dan produk legal.
2. Fallback data OJK lokal untuk menjaga hasil tetap informatif saat API live gagal.
3. Katalog API lokal Indonesia sebagai referensi sumber data tambahan.
4. Heuristik lokal untuk memberi peringatan awal jika tidak ada kecocokan data.

Contoh hasil untuk `Bibit` dapat menampilkan entri clone warning ilegal sekaligus aplikasi legal yang berkaitan, sehingga pengguna tetap diberi konteks bahwa ada entri ilegal yang menduplikasi nama resmi.

## Catatan Keamanan

- Jangan commit file `.env`.
- Jangan menaruh token GitHub atau API key di kode frontend.
- Jika token pernah terlihat publik, segera revoke token lama dan buat token baru.
- Simpan secret hanya di Environment Variables Vercel atau `.env` lokal.

## Script Penting

```bash
pnpm dev      # menjalankan app lokal
pnpm check    # cek TypeScript
pnpm build    # build frontend dan backend
pnpm start    # menjalankan hasil build server lokal
pnpm test     # menjalankan test
```

## Status Deploy

Aplikasi disiapkan untuk deploy gratis di Vercel dengan frontend statis dan API serverless melalui route `/api/trpc`.
