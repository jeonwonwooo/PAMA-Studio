import type { Metadata } from "next";
import { Inter_Tight, Fraunces } from "next/font/google";
import "./globals.css"; // Pastikan path ini sesuai dengan file CSS Tailwind kamu

// Konfigurasi Google Fonts
const interTight = Inter_Tight({ 
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({ 
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PAMA Studio | Self Photo Studio",
  description: "Abadikan versi terbaikmu dengan mudah di PAMA Studio.",
};

// WAJIB: Export default function yang menerima { children }
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      {/* Memasukkan class font ke dalam body */}
      <body className={`${interTight.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}