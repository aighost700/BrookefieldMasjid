"use client";


import { useEffect, useState } from "react";


type Timetable = {
  fajr: string;
  shurooq?: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;

  fajr_athan?: string;
  dhuhr_athan?: string;
  asr_athan?: string;
  maghrib_athan?: string;
  isha_athan?: string;
};

function splitTime(time: string) {
  const [t, meridiem] = time.split(" ");
  return { t, meridiem };
}

export default function PrayerTimes() {
  const [times, setTimes] = useState<Timetable | null>(null);

  useEffect(() => {
    fetch("/api/prayer-times")
      .then((r) => r.json())
      .then(setTimes);
  }, []);

  if (!times) return <p>Loading prayer times…</p>;

  const cards = [
    {
      label: "FAJR",
      time: times.fajr,
      athan: times.fajr_athan,
    },
    {
      label: "SHUROOQ",
      time: times.shurooq ?? "—",
    },
    {
      label: "DHUHR",
      time: times.dhuhr,
      athan: times.dhuhr_athan,
    },
    {
      label: "ASR",
      time: times.asr,
      athan: times.asr_athan,
    },
    {
      label: "MAGHRIB",
      time: times.maghrib,
      athan: times.maghrib_athan,
    },
    {
      label: "ISHA",
      time: times.isha,
      athan: times.isha_athan,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {cards.map((c) => {
        const { t, meridiem } = c.time.includes(" ")
          ? splitTime(c.time)
          : { t: c.time, meridiem: "" };

        return (
          <div
            key={c.label}
            className="rounded-xl bg-gray-50 p-4 text-center shadow-sm"
          >
            <div className="text-sm font-semibold tracking-wide text-gray-700">
              {c.label}
            </div>

            <div className="mt-2 text-3xl font-bold text-gray-900">
              {t}
              {meridiem && (
                <span className="ml-1 align-top text-sm font-semibold">
                  {meridiem}
                </span>
              )}
            </div>

            {c.athan && (
              <div className="mt-1 text-xs text-gray-500">
                ATHAN {c.athan}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
