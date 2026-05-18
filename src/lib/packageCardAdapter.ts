import type { PackageData } from "../components/paket/PackageCard";

type DbPackage = {
  id: string;
  type: "self_photo" | "pas_foto" | "jasa_fotografer";
  title: string;
  description: string | null;
  includes: string | null;
  duration_minutes: number | null;
  min_people: number | null;
  max_people: number | null;
  base_price_idr: number;
};

function formatIDR(n: number) {
  return "Rp " + new Intl.NumberFormat("id-ID").format(n);
}

function getGroupKey(p: DbPackage): string {
  const desc = (p.description ?? "").toLowerCase();

  if (p.type === "pas_foto") return "Pas Foto";

  if (p.type === "jasa_fotografer") {
    if (desc.includes("studio 2")) return "Jasa Fotografer";
    return "Jasa Fotografer";
  }

  if (p.type === "self_photo") {
    if (desc.includes("studio 1")) return "Studio 1";
    if (desc.includes("studio 2") && desc.includes("molding")) return "Studio 2 (Molding)";
    if (desc.includes("studio 2")) return "Studio 2";
    return "Studio 1";
  }

  return p.title;
}

function defaultImagesByGroup(groupKey: string) {
  if (groupKey === "Studio 1") return {
    image: "/images/foto6.webp",
    galleryImages: ["/images/foto1.webp", "/images/foto2.webp", "/images/foto3.webp", "/images/foto4.webp", "/images/foto5.webp", "/images/foto6.webp"],
  };
  if (groupKey === "Studio 2 (Molding)") return {
    image: "/images/molding.webp",
    galleryImages: ["/images/foto7.webp", "/images/foto8.webp", "/images/foto9.webp", "/images/foto10.webp"],
  };
  if (groupKey === "Studio 2") return {
    image: "/images/foto7.webp",
    galleryImages: ["/images/foto7.webp", "/images/foto8.webp", "/images/foto9.webp", "/images/foto10.webp"],
  };
  if (groupKey === "Pas Foto") return {
    image: "/images/pasfoto1.webp",
    galleryImages: ["/images/foto11.webp", "/images/foto12.webp", "/images/foto1.webp", "/images/foto3.webp"],
  };
  return {
    image: "/images/foto11.webp",
    galleryImages: ["/images/foto11.webp", "/images/foto12.webp", "/images/foto1.webp", "/images/foto3.webp"],
  };
}

function getSubtitle(type: DbPackage["type"]) {
  if (type === "self_photo") return "Self Photo Studio";
  if (type === "pas_foto") return "Pas Foto";
  return "Jasa Fotografer";
}

function getDescription(pkg: DbPackage): string {
  if (pkg.description) return pkg.description;
  if (pkg.type === "self_photo") return "Studio foto self-service dengan pencahayaan profesional. Kamu bisa foto sendiri atau bersama teman tanpa tekanan. Pilih variant sesuai kebutuhanmu.";
  if (pkg.type === "pas_foto") return "Layanan pas foto dengan edit rapi dan hasil natural. Cocok untuk dokumen resmi, CV, atau keperluan profesional lainnya.";
  return "Layanan fotografi profesional dengan fotografer berpengalaman. Hasil foto estetik dengan arah pose yang tepat untuk berbagai kebutuhan.";
}

export function groupPackagesToCards(rows: DbPackage[]): PackageData[] {
  const groupMap = new Map<string, DbPackage[]>();

  for (const row of rows) {
    const key = getGroupKey(row);
    if (!groupMap.has(key)) groupMap.set(key, []);
    groupMap.get(key)!.push(row);
  }

  const result: PackageData[] = [];

  for (const [groupKey, items] of groupMap) {
    items.sort((a, b) => a.base_price_idr - b.base_price_idr);
    const first = items[0];
    const { image, galleryImages } = defaultImagesByGroup(groupKey);

    const subPackages = items.map((p) => {
      const people =
        p.min_people && p.max_people ? `${p.min_people}-${p.max_people} orang`
        : p.max_people ? `Maks ${p.max_people} orang`
        : "";
      const dur = p.duration_minutes ? `${p.duration_minutes} menit` : "";

      // Ambil nama varian: bagian setelah "—" di title
      const variantName = p.title.includes("—")
        ? p.title.split("—").pop()?.trim() ?? p.title
        : p.title
            .replace(/studio \d+/gi, "")
            .replace(/\(.*?\)/gi, "")
            .trim() || p.title;

      return {
        name: variantName,
        description: [people, dur].filter(Boolean).join(" • "),
        price: formatIDR(p.base_price_idr),
      };
    });

    result.push({
      id: groupKey.toLowerCase().replace(/\s+/g, "-").replace(/[()]/g, ""),
      packageId: first.id,
      title: groupKey,
      subtitle: getSubtitle(first.type),
      description: getDescription(first),
      image,
      galleryImages,
      subPackages,
      additionals: undefined,
      ctaLabel: "Booking Sekarang",
      ctaLink: `/checkout?packageId=${encodeURIComponent(first.id)}`,
      accent: "maroon",
    });
  }

  return result;
}
