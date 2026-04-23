import type { PackageData } from "@/components/paket/PackageCard";

type DbPackage = {
  id: string;
  type: "self_photo" | "pas_foto" | "photographer";
  title: string;
  description: string | null;
  includes: string | null;
  duration_minutes: number | null;
  min_people: number | null;
  max_people: number | null;
  base_price_idr: number;
};

function formatIDR(n: number) {
  // hasil mirip yang kamu pakai di file statis: "Rp 40.000"
  return "Rp " + new Intl.NumberFormat("id-ID").format(n);
}

function defaultImagesByType(type: DbPackage["type"]) {
  // pakai aset yang SUDAH ADA di repo kamu (sesuai app/paket/page.tsx yang sekarang)
  // self_photo: foto6/foto7/molding
  // pas_foto: pasfoto1
  // photographer: fallback ke foto11/foto12 (kamu bisa ganti belakangan)
  if (type === "pas_foto") {
    return {
      image: "/images/pasfoto1.jpg",
      galleryImages: ["/images/foto11.jpg", "/images/foto12.jpg", "/images/foto1.jpg", "/images/foto3.jpg"],
    };
  }
  if (type === "photographer") {
    return {
      image: "/images/foto11.jpg",
      galleryImages: ["/images/foto11.jpg", "/images/foto12.jpg", "/images/foto1.jpg", "/images/foto3.jpg"],
    };
  }
  return {
    image: "/images/foto6.jpg",
    galleryImages: ["/images/foto1.jpg", "/images/foto2.jpg", "/images/foto3.jpg", "/images/foto4.jpg", "/images/foto5.jpg", "/images/foto6.jpg"],
  };
}

export function toPackageCardDataFromDb(p: DbPackage): PackageData {
  const { image, galleryImages } = defaultImagesByType(p.type);

  const people =
    p.min_people && p.max_people
      ? `${p.min_people}-${p.max_people} orang`
      : p.max_people
        ? `Maks ${p.max_people} orang`
        : "—";

  const dur = p.duration_minutes ? `${p.duration_minutes} menit` : "Jadwal menyesuaikan admin";

  // supPackages: supaya "Pilihan Paket" tetap kepakai, kita isi 1 row yang meaningful:
  // (Nanti kalau kamu mau persis seperti pricelist per kategori, kita bisa bikin view/grouping.)
  const subPackages = [
    {
      name: "Booking",
      description: `${people} • ${dur}`,
      price: formatIDR(p.base_price_idr),
    },
  ];

  // additional: sementara kita tampilkan kosong (atau bisa isi dari table addons nanti per tipe)
  const additionals = undefined;

  const subtitle =
    p.type === "self_photo" ? "Self Photo Studio" : p.type === "pas_foto" ? "Pas Foto" : "Jasa Fotografer";

  return {
    id: p.id, // penting: sekarang id = uuid dari DB
    title: p.title,
    subtitle,
    description: p.includes ?? p.description ?? "",
    image,
    galleryImages,
    subPackages,
    additionals,
    ctaLabel: "Booking Sekarang",
    ctaLink: `/checkout?packageId=${encodeURIComponent(p.id)}`,
    accent: "maroon",
  };
}