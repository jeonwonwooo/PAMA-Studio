import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/supabase-server";

function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60_000);
}

function parseSlotStart(date: string, time: string) {
  const match = time.match(/^(\d{2})\.(\d{2})-(\d{2})\.(\d{2})$/);
  if (!match) return null;

  const startTime = `${match[1]}:${match[2]}`;
  const startAt = new Date(`${date}T${startTime}:00+07:00`);
  return Number.isNaN(startAt.getTime()) ? null : startAt;
}

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();

  try {
    // 1. Validasi Auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 2. Parsing Body
    const body = await request.json().catch(() => ({}));
    const { packageId, date, time, notes, addons = [] } = body;

    const sanitizedNotes = notes
      ? notes.replace(/<[^>]*>/g, "").trim().slice(0, 500)
      : null;

    if (!packageId) {
      return NextResponse.json({ message: "packageId required" }, { status: 400 });
    }

    // 3. Ambil data package
    const { data: pkg, error: pkgErr } = await supabase
      .from("packages")
      .select("id, type, duration_minutes, base_price_idr, title")
      .eq("id", packageId)
      .single();

    if (pkgErr || !pkg) {
      return NextResponse.json({ message: "Package not found" }, { status: 404 });
    }

    const duration = pkg.duration_minutes ?? 0;

    // 4. Validasi tanggal & jam
    if (duration > 0) {
      if (!date || !time) {
        return NextResponse.json({ message: "Date and time required" }, { status: 400 });
      }

      const startAt = parseSlotStart(date, time);
      if (!startAt) {
        return NextResponse.json({ message: "Format tanggal/waktu tidak valid" }, { status: 400 });
      }

      // Cek duplikasi order
      const { data: existingOrder, error: duplicateErr } = await supabase
        .from("orders")
        .select("id")
        .eq("package_id", packageId)
        .eq("scheduled_at", startAt.toISOString())
        .in("status", ["pending", "awaiting_payment", "paid", "scheduled", "in_progress"])
        .maybeSingle();

      if (duplicateErr) {
        return NextResponse.json({ message: "Gagal memeriksa booking ganda" }, { status: 500 });
      }

      if (existingOrder?.id) {
        return NextResponse.json({ ok: true, orderId: existingOrder.id, duplicate: true });
      }
    }

    // 5. Buat Order
    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        package_id: packageId,
        status: "pending",
        notes: sanitizedNotes,
        base_price_idr: pkg.base_price_idr,
        addons_price_idr: 0,
        total_price_idr: pkg.base_price_idr,
      })
      .select("id")
      .single();

    if (orderErr || !order) {
      return NextResponse.json({ message: "Failed to create order: " + orderErr?.message }, { status: 500 });
    }

    // --- PROSES LANJUTAN ---
    try {
      let addonsTotal = 0;

      // 6. Handle Addons
      if (addons.length > 0) {
        const parsedAddons = addons
          .map((a: any) => ({
            addonId: String(a?.addonId ?? "").trim(),
            qty: Number(a?.qty ?? 1),
          }))
          .filter((a: any) => a.addonId);

        if (parsedAddons.some((a: any) => !Number.isInteger(a.qty) || a.qty < 1 || a.qty > 10)) {
          return NextResponse.json({ message: "Qty addon harus antara 1 sampai 10" }, { status: 400 });
        }

        const addonIds = parsedAddons.map((a: any) => a.addonId);
        const { data: addonRows, error: addonErr } = await supabase
          .from("addons")
          .select("id, price_idr")
          .in("id", addonIds);

        if (addonErr) throw new Error("Addon error: " + addonErr.message);

        const priceMap = new Map(addonRows?.map((r) => [r.id, r.price_idr]) ?? []);
        const rows = parsedAddons.map((a: any) => {
          const price = priceMap.get(a.addonId);
          if (price === undefined) throw new Error(`Invalid addonId: ${a.addonId}`);
          addonsTotal += price * a.qty;
          return {
            order_id: order.id,
            addon_id: a.addonId,
            qty: a.qty,
            price_idr: price,
          };
        });

        const { error: oaErr } = await supabase.from("order_addons").insert(rows);
        if (oaErr) throw oaErr;
      }

      // 7. Update Total Harga
      const total = pkg.base_price_idr + addonsTotal;
      const { error: updErr } = await supabase
        .from("orders")
        .update({ addons_price_idr: addonsTotal, total_price_idr: total })
        .eq("id", order.id);

      if (updErr) throw updErr;

      // Simpan jadwal langsung di order
      if (duration > 0) {
        const startAt = parseSlotStart(date, time);
        if (!startAt) throw new Error("Format tanggal/waktu tidak valid");

        const { error: scheduleErr } = await supabase
          .from("orders")
          .update({ scheduled_at: startAt.toISOString() })
          .eq("id", order.id);

        if (scheduleErr) throw new Error("Gagal simpan jadwal: " + scheduleErr.message);
      }

      return NextResponse.json({ ok: true, orderId: order.id });

    } catch (innerError: any) {
      await supabase.from("orders").delete().eq("id", order.id);
      throw innerError;
    }

  } catch (e: any) {
    console.error("Booking Error:", e);
    return NextResponse.json(
      { ok: false, message: e?.message ?? "Terjadi kesalahan internal" },
      { status: 500 }
    );
  }
}