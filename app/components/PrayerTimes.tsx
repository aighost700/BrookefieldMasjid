"use client";

import { useEffect, useState } from "react";

type Timetable = {
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
};

function splitAmPm(value: string) {
  // works for "6:50 AM" format (recommended)
  const parts = value.trim().split(/\s+/);
  if (parts.length >= 2) return { time: parts[0], ampm: parts[1] };
  return { time: value, ampm: "" };
}

function Card({
  label,
  value,
  subLabel,
}: {
  label: string;
  value: string;
  subLabel?: string;
}) {
  const { time, ampm } = splitAmPm(value);

  return (
    <div className="rounded-xl bg-gray-50 p-3 text-center shadow-sm">
      <div className="text-sm font-semibold tracking-widest text-gray-800">
        {label}
      </div>

      <div className="mt-2 flex items-start justify-center gap-1">
        <div className="text-4xl font-bold leading-none text-gray-900">
          {time}
        </div>
        {ampm && (
          <div className="pt-1 text-sm font-bold text-gray-900">{ampm}</div>
        )}
      </div>

      {subLabel && (
        <div className="mt-2 text-xs font-medium tracking-wide text-gray-500">
          {subLabel}
        </div>
      )}
    </div>
  );
}

export default function PrayerTimes() {
  const [times, setTimes] = useState<Timetable | null>(null);

  useEffect(() => {
    fetch("/api/prayer-times")
      .then((r) => r.json())
      .then((data) => setTimes(data))
      .catch(() => setTimes(null));
  }, []);

  if (!times) return <p className="text-sm text-gray-600">Loading…</p>;

  // If you don't have ATHAN values in your database, you can remove subLabel lines completely.
  // For now, this shows only the main times.
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      <Card label="FAJR" value={times.fajr} />
      <Card label="DHUHR" value={times.dhuhr} />
      <Card label="ASR" value={times.asr} />
      <Card label="MAGHRIB" value={times.maghrib} />
      <Card label="ISHA" value={times.isha} />
    </div>
  );
}
