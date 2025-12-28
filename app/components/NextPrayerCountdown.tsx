"use client";

import { useEffect, useMemo, useState } from "react";

type Timetable = {
  fajr: string;   // e.g. "05:10" or "5:10 AM"
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
};

// --- helpers ---
function parseTimeToToday(timeStr: string, baseDate: Date) {
  // Supports "HH:MM" (24h) OR "H:MM AM/PM"
  const s = timeStr.trim().toUpperCase();
  let hours = 0;
  let minutes = 0;

  const ampmMatch = s.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/);
  if (ampmMatch) {
    hours = parseInt(ampmMatch[1], 10);
    minutes = parseInt(ampmMatch[2], 10);
    const ampm = ampmMatch[3];
    if (ampm === "PM" && hours !== 12) hours += 12;
    if (ampm === "AM" && hours === 12) hours = 0;
  } else {
    // assume "HH:MM" 24-hour
    const hm = s.match(/^(\d{1,2}):(\d{2})$/);
    if (!hm) return null;
    hours = parseInt(hm[1], 10);
    minutes = parseInt(hm[2], 10);
  }

  const d = new Date(baseDate);
  d.setHours(hours, minutes, 0, 0);
  return d;
}

function formatDuration(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  const hh = String(h).padStart(2, "0");
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

export default function NextPrayerCountdown() {
  const [times, setTimes] = useState<Timetable | null>(null);
  const [now, setNow] = useState<Date>(new Date());

  // tick every second
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // load timetable once
  useEffect(() => {
    fetch("/api/prayer-times")
      .then((r) => r.json())
      .then((data) => setTimes(data))
      .catch(() => setTimes(null));
  }, []);

  const next = useMemo(() => {
    if (!times) return null;

    const today = new Date(now);
    const prayers = [
      { name: "Fajr", time: times.fajr },
      { name: "Dhuhr", time: times.dhuhr },
      { name: "Asr", time: times.asr },
      { name: "Maghrib", time: times.maghrib },
      { name: "Isha", time: times.isha },
    ];

    // Build today’s prayer Date objects
    const todaySlots = prayers
      .map((p) => {
        const dt = parseTimeToToday(p.time, today);
        return dt ? { ...p, dt } : null;
      })
      .filter(Boolean) as { name: string; time: string; dt: Date }[];

    // Find next prayer today
    const upcoming = todaySlots.find((p) => p.dt.getTime() > now.getTime());
    if (upcoming) return upcoming;

    // Otherwise next is tomorrow Fajr
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const fajrTomorrow = parseTimeToToday(times.fajr, tomorrow);
    if (!fajrTomorrow) return null;

    return { name: "Fajr", time: times.fajr, dt: fajrTomorrow };
  }, [times, now]);

  if (!times) {
    return (
      <div className="rounded-xl border bg-white/80 backdrop-blur p-4 text-sm text-gray-700">
        Loading next prayer…
      </div>
    );
  }

  if (!next) {
    return (
      <div className="rounded-xl border bg-white/80 backdrop-blur p-4 text-sm text-gray-700">
        Could not calculate next prayer.
      </div>
    );
  }

  const remainingMs = next.dt.getTime() - now.getTime();

  return (
    <div className="rounded-xl border bg-white/80 backdrop-blur p-4 text-center shadow-sm">
      <div className="text-xs font-semibold tracking-widest text-gray-600">
        NEXT PRAYER
      </div>
      <div className="mt-1 text-lg font-bold text-gray-900">{next.name}</div>
      <div className="mt-2 text-4xl font-extrabold tabular-nums text-emerald-800">
        {formatDuration(remainingMs)}
      </div>
      <div className="mt-2 text-xs text-gray-500">
        Counting down to {next.name} time ({next.time})
      </div>
    </div>
  );
}
