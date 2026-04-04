<div align="center">

# 📸 **PAMA Studio**
### *Sistem Booking, Manajemen & AI WhatsApp Bot untuk Studio Foto*

> **"From manual chaos to automated excellence — digitizing the future of photo studios."**

![Next.js](https://img.shields.io/badge/Next.js_14-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI_gpt--4o--mini-412991?style=for-the-badge&logo=openai&logoColor=white)
![WhatsApp](https://img.shields.io/badge/WhatsApp_Cloud_API-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Google Drive](https://img.shields.io/badge/Google_Drive_API-4285F4?style=for-the-badge&logo=googledrive&logoColor=white)

</div>

---

## 🏢 Project Overview

**PAMA Studio** adalah proyek unggulan dari **Digital Talent Program (DTP)** — sebuah simulasi magang lintas peminatan yang menggabungkan keahlian **UI/UX Design**, **Frontend Engineering**, **Backend Engineering**, dan **AI Integration** dalam satu ekosistem kolaboratif.

> Proyek ini dirancang untuk mendigitalisasi workflow operasional studio foto secara menyeluruh, mulai dari **reservasi sesi pemotretan** hingga **pengiriman aset digital** ke klien, menggantikan proses manual yang fragmentatif dengan sistem terintegrasi berbasis cloud.

### 🎯 Problem Statement

Studio foto konvensional menghadapi tantangan operasional yang signifikan:

- 📋 Pengelolaan jadwal manual → rentan *double booking* dan konflik sesi
- 💬 Respon klien lambat → kehilangan prospek dan penurunan kepuasan pelanggan
- 📦 Distribusi hasil foto tidak terstruktur → pengalaman pasca-sesi yang buruk
- 📊 Tidak ada visibilitas real-time → keputusan bisnis berdasarkan data yang sudah usang

**PAMA Studio hadir sebagai solusi** dengan mengotomatisasi seluruh rantai operasional, meningkatkan efisiensi bisnis hingga **70%**.

---

## ⚙️ Technical Key Features

### 🌐 Dynamic Landing Page
- Portofolio studio yang **responsif dan performant** dibangun di atas **Next.js 14 App Router**
- Optimasi gambar otomatis via `next/image`, lazy loading, dan static generation untuk Core Web Vitals terbaik
- Styling atomik menggunakan **Tailwind CSS** dengan design system yang konsisten

### 🔒 Atomic Booking System
- Mekanisme **anti-double booking** menggunakan **database transactions** di PostgreSQL via Prisma ORM
- Setiap permintaan reservasi dieksekusi dalam transaksi atomik (`BEGIN → SELECT FOR UPDATE → INSERT → COMMIT`) untuk menjamin integritas jadwal
- Validasi ketersediaan slot dilakukan di level database, bukan di level aplikasi, untuk mencegah **race conditions** pada permintaan konkuren

### 🤖 AI Hybrid WhatsApp Bot
- **Chatbot terintegrasi** yang mampu menangani alur booking end-to-end secara otomatis melalui **WhatsApp Cloud API** & **Fonnte**
- **Smart Fallback via GPT-4o mini**: Ketika pertanyaan tidak cocok dengan template FAQ yang tersedia, bot meneruskan ke **OpenAI API** untuk menghasilkan respons kontekstual yang cerdas
- **Auto-Nudge System**: Fitur reminder otomatis yang dipicu oleh **Cron Jobs** untuk mengikuti-up klien yang tidak merespons (*ghosting*), menjaga konversi tetap optimal

### 🖥️ Admin Command Center
- Dashboard manajemen order terpusat dengan **state machine** yang jelas:
  ```
  PENDING → CONFIRMED → DONE
  ```
- Kontrol penuh atas jadwal, pembayaran, dan status sesi melalui antarmuka admin yang intuitif
- Real-time data refresh dengan integrasi **Supabase Realtime**

### 🚀 Auto-Distribution
- Integrasi **Google Drive API** untuk mengunggah dan mengorganisir hasil foto secara otomatis ke folder klien yang terstruktur
- Pengiriman link unduhan langsung melalui **WhatsApp / Email** segera setelah sesi selesai diproses
- Zero manual intervention dalam proses delivery aset digital

---

## 🏗️ System Architecture

Sistem PAMA Studio dibangun di atas arsitektur **3-layer** yang terpisah dengan jelas:

| Layer | Teknologi | Tanggung Jawab |
|---|---|---|
| **🎨 Frontend (Presentation)** | Next.js 14, Tailwind CSS | Rendering UI, routing berbasis App Router, optimasi performa client-side |
| **⚡ API / Logic (Application)** | Next.js API Routes, Prisma ORM, OpenAI SDK | Business logic, validasi transaksi booking, orchestrasi AI bot, integrasi external API |
| **🗄️ Backend (Data & Infra)** | Supabase (PostgreSQL), Google Drive API, Vercel Cron | Persistensi data, Row Level Security, penjadwalan tugas otomatis, penyimpanan aset |

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (Browser / WA)                 │
└────────────────────┬────────────────────────────────────┘
                     │ HTTPS / WA Cloud API
┌────────────────────▼────────────────────────────────────┐
│              NEXT.JS 14 (Vercel Edge)                    │
│   ┌──────────────┐   ┌──────────────────────────────┐   │
│   │  App Router  │   │     API Routes / Webhooks     │   │
│   │  (Pages/UI)  │   │  (Booking, Bot, Cron, Auth)  │   │
│   └──────────────┘   └───────────┬──────────────────┘   │
└───────────────────────────────── │ ───────────────────── ┘
                     │             │
          ┌──────────▼──┐   ┌──────▼──────────────────┐
          │  Supabase   │   │   External Services      │
          │ PostgreSQL  │   │  ┌─────────────────────┐ │
          │ (+ RLS)     │   │  │ OpenAI GPT-4o mini  │ │
          │ Prisma ORM  │   │  ├─────────────────────┤ │
          └─────────────┘   │  │ WhatsApp Cloud API  │ │
                            │  ├─────────────────────┤ │
                            │  │ Fonnte (WA Gateway) │ │
                            │  ├─────────────────────┤ │
                            │  │  Google Drive API   │ │
                            │  └─────────────────────┘ │
                            └──────────────────────────┘
```

---

## 🛡️ Security & Reliability

### 🔐 Row Level Security (RLS) — Supabase
Seluruh tabel di database dilindungi oleh **Row Level Security** yang dikonfigurasi langsung di PostgreSQL level. Kebijakan RLS memastikan bahwa:
- Klien hanya dapat mengakses data miliknya sendiri berdasarkan `user_id` yang terautentikasi
- Operasi `INSERT`, `UPDATE`, dan `DELETE` pada tabel kritis hanya diizinkan dengan policy yang eksplisit
- Akses antar-tenant secara otomatis diblokir di level database, bukan hanya di level aplikasi

```sql
-- Contoh RLS Policy untuk tabel bookings
CREATE POLICY "Users can only view their own bookings"
  ON bookings FOR SELECT
  USING (auth.uid() = user_id);
```

### 🔑 Authentication — JWT & Bcrypt
- Sesi admin dikelola menggunakan **JSON Web Tokens (JWT)** yang di-sign dengan secret key dan memiliki expiry time yang ketat
- Password admin di-hash menggunakan **Bcrypt** dengan salt rounds yang cukup untuk mencegah brute-force attack
- Token disimpan dengan aman dan divalidasi pada setiap request ke endpoint yang dilindungi

### ⚡ Race Condition Prevention
Salah satu tantangan terbesar sistem booking adalah **permintaan konkuren** untuk slot yang sama. PAMA Studio mengatasi ini dengan:

1. **Pessimistic Locking**: Query `SELECT ... FOR UPDATE` mengunci baris yang relevan saat transaksi booking diproses, memblokir transaksi lain untuk memodifikasi slot yang sedang diperiksa
2. **Atomic Transactions**: Seluruh logika cek-ketersediaan dan insert-booking dieksekusi dalam satu transaksi database yang tidak bisa dipecah
3. **Database-Level Constraints**: Unique constraint dan check constraints di PostgreSQL sebagai lapisan pertahanan terakhir

---

## 🚀 Quick Installation

### Prerequisites

- Node.js `>=18.x`
- npm `>=9.x` atau pnpm
- Akun Supabase, Vercel, OpenAI, dan WhatsApp Business

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/jeonwonwooo/PAMA-Studio.git
cd PAMA-Studio
npm install
```

### 2. Configure Environment Variables

Buat file `.env.local` di root project dan isi dengan variabel berikut:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
DATABASE_URL=your_postgresql_connection_string

# Authentication
JWT_SECRET=your_strong_jwt_secret_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# WhatsApp
WHATSAPP_PHONE_NUMBER_ID=your_wa_phone_number_id
WHATSAPP_ACCESS_TOKEN=your_wa_cloud_api_token
FONNTE_TOKEN=your_fonnte_token

# Google Drive
GOOGLE_DRIVE_CLIENT_ID=your_google_client_id
GOOGLE_DRIVE_CLIENT_SECRET=your_google_client_secret
GOOGLE_DRIVE_REFRESH_TOKEN=your_google_refresh_token
GOOGLE_DRIVE_FOLDER_ID=your_target_folder_id
```

### 3. Setup Database & ORM

```bash
# Generate Prisma client
npx prisma generate

# Push schema ke Supabase (development)
npx prisma db push

# Atau jalankan migrasi (production)
npx prisma migrate deploy
```

### 4. Run Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

### 5. Build for Production

```bash
npm run build
npm run start
```

---

## 📁 Project Structure

```
PAMA-Studio/
├── app/                    # Next.js 14 App Router
│   ├── (public)/           # Public-facing pages (landing, booking)
│   ├── admin/              # Admin Command Center (protected routes)
│   ├── api/                # API Routes
│   │   ├── booking/        # Booking logic & atomic transactions
│   │   ├── whatsapp/       # WA Cloud API webhook handler
│   │   ├── ai/             # OpenAI Smart Fallback integration
│   │   └── cron/           # Auto-Nudge scheduled jobs
│   └── layout.tsx
├── components/             # Reusable UI components
├── lib/                    # Utility functions & SDK clients
│   ├── supabase.ts
│   ├── prisma.ts
│   ├── openai.ts
│   └── google-drive.ts
├── prisma/
│   └── schema.prisma       # Database schema
└── public/                 # Static assets
```

---

## 🤝 DTP Credits

Proyek **PAMA Studio** merupakan hasil kolaborasi lintas grup peminatan dalam rangka **Digital Talent Program (DTP)** — sebuah program akademik yang mensimulasikan lingkungan kerja profesional di industri teknologi.

| Divisi | Kontribusi |
|---|---|
| 🎨 **UI/UX Design** | User research, wireframing, prototyping, design system |
| 💻 **Frontend Engineering** | Implementasi Next.js, integrasi komponen, performa UI |
| ⚙️ **Backend Engineering** | API design, database schema, business logic, security |
| 🧠 **AI Integration** | Bot flow design, OpenAI integrasi, Auto-Nudge system |

> Program ini mensimulasikan siklus pengembangan produk nyata — dari discovery hingga deployment — sebagai persiapan mahasiswa untuk terjun ke dunia industri teknologi profesional.

---

<div align="center">

**Built with ❤️ by DTP PAMA Studio Team**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

</div>