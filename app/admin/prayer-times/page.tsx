"use client";

import { useEffect, useState } from "react";

type Timetable = {
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  jummah?: string;
};

export default function AdminPrayerTimesPage() {
  const [times, setTimes] = useState<Timetable>({
    fajr: "",
    dhuhr: "",
    asr: "",
    maghrib: "",
    isha: "",
    jummah: "",
  });

  const [status, setStatus] = useState<string>("");

  async function load() {
    setStatus("Loading...");
    try {
      const res = await fetch("/api/prayer-times", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to load");

      setTimes({
        fajr: data.fajr ?? "",
        dhuhr: data.dhuhr ?? "",
        asr: data.asr ?? "",
        maghrib: data.maghrib ?? "",
        isha: data.isha ?? "",
        jummah: data.jummah ?? "",
      });

      setStatus("");
    } catch (e: any) {
      setStatus(e.message || "Could not load timetable");
    }
  }

  async function save() {
    setStatus("Saving...");
    try {
      const res = await fetch("/api/admin/prayer-times", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(times),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Save failed");

      setStatus("Saved ✅ (Homepage will update)");
    } catch (e: any) {
      setStatus(e.message || "Save failed");
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-xl rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-xl font-bold">Admin – Prayer Times</h1>
        <p className="mt-1 text-sm text-gray-600">
          These times stay on the homepage until you update them again.
        </p>

        <div className="mt-6 grid gap-4">
          {(["fajr", "dhuhr", "asr", "maghrib", "isha", "jummah"] as const).map(
            (k) => (
              <label key={k} className="grid gap-1">
                <span className="text-sm font-semibold capitalize">{k}</span>
                <input
                  className="rounded-xl border px-3 py-2"
                  value={(times[k] ?? "") as string}
                  onChange={(e) => setTimes({ ...times, [k]: e.target.value })}
                  placeholder="e.g. 05:10 or 5:10 AM"
                />
              </label>
            )
          )}
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={save}
            className="flex-1 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            Save / Update
          </button>
          <button
            onClick={load}
            className="flex-1 rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-gray-50"
          >
            Reload
          </button>
        </div>

        {status && <p className="mt-4 text-sm text-gray-700">{status}</p>}
      </div>
    </div>
  );
}
