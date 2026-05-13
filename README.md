This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Supabase Auth Notes

- Autentikasi utama hanya memakai **Supabase Auth** (`auth.users`) lewat `supabase.auth.signUp`, `signInWithPassword`, dan `signOut`.
- Tabel `public.profiles` hanya dipakai untuk data tambahan user. Sinkronisasi otomatis disiapkan lewat migration `supabase/migrations/20260513043000_sync_profiles_with_auth_users.sql`.
- Frontend auth berjalan lewat browser client Supabase (`createSupabaseBrowserClient`) agar session/token tetap persisten di browser dan ikut tersinkron ke request SSR.

## Auth Debug Checklist

Kalau login/register masih bermasalah, cek urutan berikut:

1. Salin `.env.example` ke `.env.local`, lalu isi `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, dan `NEXT_PUBLIC_SITE_URL` dengan project/app URL yang benar.
2. Jalankan migration Supabase terbaru agar trigger sinkronisasi `profiles` aktif.
3. Di Supabase Dashboard, cek **Authentication → Users** untuk memastikan user benar-benar dibuat di `auth.users`.
4. Setelah login di browser, cek cookie/session Supabase (`sb-...`) di DevTools dan pastikan request ke `/api/profile` mengembalikan user + profile.
5. Jika register butuh verifikasi email, pastikan **Site URL / Redirect URL** Supabase mengizinkan callback ke `/api/auth/callback`.
6. Bila build lokal gagal saat `next build`, verifikasi koneksi ke Google Fonts karena repo ini masih memakai font eksternal di `app/layout.tsx`.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
