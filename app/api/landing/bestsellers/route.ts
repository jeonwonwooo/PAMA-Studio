import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/supabase-server";

export async function GET() {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("packages")
    .select("id, type, title, description, includes, duration_minutes, min_people, max_people, base_price_idr")
    .eq("is_active", true);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  const allPackages = data ?? [];
  const shuffled = [...allPackages].sort(() => Math.random() - 0.5);
  const top3 = shuffled.slice(0, 3);

  const groupedPackages = groupPackagesByStudio(top3);

  return NextResponse.json({ packages: groupedPackages });
}

function groupPackagesByStudio(packages: any[]) {
  const groups = new Map<string, any[]>();

  for (const pkg of packages) {
    const key = getStudioKey(pkg);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(pkg);
  }

  const result = [];
  for (const [key, items] of groups) {
    const featured = key.includes("Studio 2") && !key.includes("Molding");
    result.push({
      id: items[0].id,
      studio: key,
      type: items[0].type,
      price: items[0].base_price_idr,
      priceFormatted: formatIDR(items[0].base_price_idr),
      features: parseIncludes(items[0].includes),
      image: getDefaultImage(key),
      featured,
      tag: getTag(key, featured),
    });
  }

  return result;
}

function getStudioKey(pkg: any): string {
  const title = pkg.title.toLowerCase();
  if (title.includes("studio 1")) return "Self Photo Studio 1";
  if (title.includes("studio 2") && title.includes("molding")) return "Studio 2 (Molding)";
  if (title.includes("studio 2")) return "Self Photo Studio 2";
  if (pkg.type === "pas_foto") return "Pas Foto";
  if (pkg.type === "photographer") return "Jasa Fotografer";
  return pkg.title;
}

function getTag(key: string, featured: boolean): string {
  if (featured) return "Favorit Couple";
  if (key.includes("Pas Foto")) return "Paling Populer";
  if (key.includes("Studio 1")) return "Terlaris Grup";
  return "Pilihan Kami";
}

function parseIncludes(includes: string | null): string[] {
  if (!includes) return [];
  return includes.split(",").map(s => s.trim()).filter(Boolean);
}

function getDefaultImage(key: string): string {
  const images: Record<string, string> = {
    "Self Photo Studio 1": "/images/foto6.webp",
    "Self Photo Studio 2": "/images/foto7.webp",
    "Studio 2 (Molding)": "/images/molding.webp",
    "Pas Foto": "/images/pasfoto1.webp",
    "Jasa Fotografer": "/images/foto11.webp",
  };
  return images[key] || "/images/foto1.webp";
}

function formatIDR(n: number): string {
  return "Rp " + new Intl.NumberFormat("id-ID").format(n);
}
