import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const body = await req.json();
  const supabase = supabaseAdmin();

  const { error } = await supabase
    .from("prayer_times_single")
    .upsert(
      {
        id: 1,
        fajr: body.fajr,
        dhuhr: body.dhuhr,
        asr: body.asr,
        maghrib: body.maghrib,
        isha: body.isha,
        jummah: body.jummah ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
