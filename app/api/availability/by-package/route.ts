import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/supabase-server";

const OPEN_HOUR = 9;
const OPEN_MINUTE = 30;
const CLOSE_HOUR = 21;
const CLOSE_MINUTE = 0;

const BOOKED_STATUSES = ["pending", "awaiting_payment", "paid", "scheduled", "in_progress"];

function getIntervalMinutes(type: string, title: string): number {
  const t = title.toLowerCase();
  if (t.includes("studio 1")) return 30;
  return 60;
}

function generateAllSlots(durationMinutes: number, stepMinutes: number): string[] {
  const slots: string[] = [];
  let current = OPEN_HOUR * 60 + OPEN_MINUTE;
  const closeTotal = CLOSE_HOUR * 60 + CLOSE_MINUTE;

  while (current + durationMinutes <= closeTotal) {
    const startH = Math.floor(current / 60);
    const startM = current % 60;
    const endMin = current + durationMinutes;
    const endH = Math.floor(endMin / 60);
    const endM = endMin % 60;

    const label = `${String(startH).padStart(2, "0")}.${String(startM).padStart(2, "0")}-${String(endH).padStart(2, "0")}.${String(endM).padStart(2, "0")}`;
    slots.push(label);

    current += stepMinutes;
  }

  return slots;
}

function slotToMinutes(slot: string): { start: number; end: number } | null {
  const match = slot.match(/^(\d{2})\.(\d{2})-(\d{2})\.(\d{2})$/);
  if (!match) return null;
  const start = parseInt(match[1]) * 60 + parseInt(match[2]);
  const end = parseInt(match[3]) * 60 + parseInt(match[4]);
  return { start, end };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const packageId = searchParams.get("packageId");
    const date = searchParams.get("date");

    if (!packageId || !date) {
      return NextResponse.json({ message: "packageId dan date wajib diisi" }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();

    const { data: pkg, error: pkgErr } = await supabase
      .from("packages")
      .select("id, type, title, duration_minutes")
      .eq("id", packageId)
      .single();

    if (pkgErr || !pkg) {
      return NextResponse.json({ message: "Paket tidak ditemukan" }, { status: 404 });
    }

    const durationMinutes: number = pkg.duration_minutes ?? 0;
    if (durationMinutes <= 0) {
      return NextResponse.json({ slots: [] });
    }

    const intervalMinutes = getIntervalMinutes(pkg.type ?? "", pkg.title ?? "");
    const allSlots = generateAllSlots(durationMinutes, intervalMinutes);

    const dayStart = `${date}T00:00:00.000Z`;
    const dayEnd = `${date}T23:59:59.999Z`;

    const { data: bookedOrders, error: ordersErr } = await supabase
      .from("orders")
      .select("scheduled_at, package_id")
      .gte("scheduled_at", dayStart)
      .lte("scheduled_at", dayEnd)
      .in("status", BOOKED_STATUSES);

    if (ordersErr) {
      return NextResponse.json({ message: ordersErr.message }, { status: 500 });
    }

    const packageIds = [...new Set((bookedOrders ?? []).map((o: any) => o.package_id))];

    let packageDurations: Record<string, number> = {};
    if (packageIds.length > 0) {
      const { data: pkgDurations } = await supabase
        .from("packages")
        .select("id, duration_minutes")
        .in("id", packageIds);

      for (const p of pkgDurations ?? []) {
        packageDurations[p.id] = p.duration_minutes ?? 0;
      }
    }

    const bookedRanges: { start: number; end: number }[] = [];
    for (const order of bookedOrders ?? []) {
      const scheduledAt = new Date(order.scheduled_at);
      const wibOffset = 7 * 60;
      const localMinutes = scheduledAt.getUTCHours() * 60 + scheduledAt.getUTCMinutes() + wibOffset;
      const orderDuration = packageDurations[order.package_id] ?? durationMinutes;
      bookedRanges.push({
        start: localMinutes % (24 * 60),
        end: (localMinutes + orderDuration) % (24 * 60),
      });
    }

    const slots = allSlots.map((slotLabel) => {
      const range = slotToMinutes(slotLabel);
      if (!range) return { time: slotLabel, available: false };

      const isBooked = bookedRanges.some(
        (booked) => range.start < booked.end && range.end > booked.start
      );

      return {
        time: slotLabel,
        available: !isBooked,
      };
    });

    return NextResponse.json({ slots, interval: intervalMinutes });
  } catch (e: any) {
    return NextResponse.json({ message: e?.message ?? "Server error" }, { status: 500 });
  }
}
