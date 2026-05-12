import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/supabase-server";

export async function GET() {
  const supabase = await createSupabaseServerClient();

  const { data: orderCounts, error: countError } = await supabase
    .from("orders")
    .select("package_id")
    .in("status", ["pending", "awaiting_payment", "paid", "scheduled", "in_progress", "done"]);

  if (countError) {
    return NextResponse.json({ message: countError.message }, { status: 500 });
  }

  const packageOrderCount = new Map<string, number>();
  for (const order of orderCounts ?? []) {
    const current = packageOrderCount.get(order.package_id) ?? 0;
    packageOrderCount.set(order.package_id, current + 1);
  }

  const sortedPackageIds = [...packageOrderCount.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([id]) => id);

  let packages: any[] = [];
  if (sortedPackageIds.length > 0) {
    const { data, error } = await supabase
      .from("packages")
      .select("id, type, title, description, includes, duration_minutes, min_people, max_people, base_price_idr")
      .eq("is_active", true)
      .in("id", sortedPackageIds);

    if (!error && data) {
      const orderMap = new Map(sortedPackageIds.map((id, idx) => [id, idx]));
      packages = [...data].sort((a, b) => (orderMap.get(a.id) ?? 999) - (orderMap.get(b.id) ?? 999));
    }
  }

  if (packages.length === 0) {
    const { data, error } = await supabase
      .from("packages")
      .select("id, type, title, description, includes, duration_minutes, min_people, max_people, base_price_idr")
      .eq("is_active", true)
      .order("base_price_idr", { ascending: true })
      .limit(3);

    if (error) return NextResponse.json({ message: error.message }, { status: 500 });
    packages = data ?? [];
  }

  const groupedPackages = groupPackagesByStudio(packages);

  const top3 = groupedPackages.slice(0, 3);

  return NextResponse.json({ packages: top3 });
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
    "Self Photo Studio 1": "/images/foto6.jpg",
    "Self Photo Studio 2": "/images/foto7.jpg",
    "Studio 2 (Molding)": "/images/molding.jpeg",
    "Pas Foto": "/images/pasfoto1.jpg",
    "Jasa Fotografer": "/images/foto11.jpg",
  };
  return images[key] || "/images/foto1.jpg";
}

function formatIDR(n: number): string {
  return "Rp " + new Intl.NumberFormat("id-ID").format(n);
}
