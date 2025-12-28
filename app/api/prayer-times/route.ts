import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = supabaseAdmin();

    const { data, error } = await supabase
      .from("prayer_times_single")
      .select("fajr,dhuhr,asr,maghrib,isha,jummah,updated_at")
      .eq("id", 1)
      .single();

    if (error) {
      return NextResponse.json(
        {
          error: "Supabase error",
          details: error.message,
          hint: error.hint ?? null,
        },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "No data returned from prayer_times_single (id=1 missing?)" },
        { status: 500 }
      );
    }

    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: "Server crash in /api/prayer-times", details: e?.message ?? String(e) },
      { status: 500 }
    );
  }
}
