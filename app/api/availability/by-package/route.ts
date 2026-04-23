import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60_000);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const packageId = searchParams.get("packageId");
    const date = searchParams.get("date");
    const stepStr = searchParams.get("step");

    if (!packageId || !date) {
      return NextResponse.json(
        { message: "packageId and date are required" },
        { status: 400 }
      );
    }

    const step = stepStr ? Number(stepStr) : 15;
    const openTime = "09:30";
    const closeTime = "21:00";

    const supabase = await createSupabaseServerClient();

    const { data: pkg, error: pkgErr } = await supabase
      .from("packages")
      .select("id,title,duration_minutes")
      .eq("id", packageId)
      .single();

    if (pkgErr || !pkg) {
      return NextResponse.json(
        { message: pkgErr?.message ?? "package not found" },
        { status: 404 }
      );
    }

    const duration = pkg.duration_minutes ?? 0;
    if (duration <= 0) {
      return NextResponse.json({
        packageId,
        packageTitle: pkg.title,
        duration,
        date,
        available: [],
      });
    }

    const { data: pr, error: prErr } = await supabase
      .from("package_resources")
      .select("resource_id")
      .eq("package_id", packageId)
      .limit(1)
      .maybeSingle();

    if (prErr) {
      return NextResponse.json({ message: prErr.message }, { status: 500 });
    }
    if (!pr?.resource_id) {
      return NextResponse.json(
        { message: "resource mapping not found for this package" },
        { status: 400 }
      );
    }

    const resourceId = pr.resource_id;

    const dayStart = new Date(`${date}T00:00:00+07:00`);
    const dayEnd = new Date(`${date}T23:59:59+07:00`);

    // Ambil bookings yang sudah terisi
    const { data: bookings, error: bErr } = await supabase
      .from("bookings")
      .select("start_at,end_at")
      .eq("resource_id", resourceId)
      .gte("start_at", dayStart.toISOString())
      .lte("start_at", dayEnd.toISOString());

    if (bErr) {
      return NextResponse.json({ message: bErr.message }, { status: 500 });
    }

    const intervals = (bookings ?? []).map((b) => ({
      start: new Date(b.start_at),
      end: new Date(b.end_at),
    }));

    const startBoundary = new Date(`${date}T${openTime}:00+07:00`);
    const endBoundary = new Date(`${date}T${closeTime}:00+07:00`);

    const overlaps = (aStart: Date, aEnd: Date) =>
      intervals.some((itv) => aStart < itv.end && aEnd > itv.start);

    // Generate slot otomatis dari kode, return string jam saja
    const available: string[] = [];
    for (let t = new Date(startBoundary); t < endBoundary; t = addMinutes(t, step)) {
      const tEnd = addMinutes(t, duration);
      if (tEnd > endBoundary) break;
      if (!overlaps(t, tEnd)) {
        const hh = String(t.getHours()).padStart(2, "0");
        const mm = String(t.getMinutes()).padStart(2, "0");
        available.push(`${hh}:${mm}`);
      }
    }

    return NextResponse.json({
      packageId,
      packageTitle: pkg.title,
      duration,
      date,
      step,
      openTime,
      closeTime,
      available,
    });
  } catch (e: any) {
    console.error("[availability] crashed:", e);
    return NextResponse.json(
      { message: "Availability route crashed", error: String(e?.message ?? e) },
      { status: 500 }
    );
  }
}