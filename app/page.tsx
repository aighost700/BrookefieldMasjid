import PrayerTimes from "./components/PrayerTimes";
import NextPrayerCountdown from "./components/NextPrayerCountdown";

export default function Home() {
  return (
    <div className="relative min-h-[75vh] overflow-hidden">
      {/* FULL PAGE BACKGROUND (100% visible) */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "url('/mosque-bg.jpg')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      />

      {/* FOREGROUND CONTENT */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-black bg-white/40 backdrop-blur-md">
          <div className="mx-auto max-w-4xl px-4 py-6">
            <div className="flex flex-col items-center text-center">
              <h1 className="text-5xl font-extrabold tracking-tight text-emerald-800">
                Brookfield Masjid TEST
              </h1>

              <p
                className="mt-2 text-xl font-semibold text-emerald-700"
                dir="rtl"
                style={{
                  fontFamily:
                    "Arial, 'Noto Naskh Arabic', 'Segoe UI', sans-serif",
                }}
              >
                بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
              </p>

              <p className="mt-1 text-sm text-gray-700">
                Prayer timetable
              </p>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="mx-auto max-w-full px-4 py-5 text-center">
          {/* MAIN WHITE BOX (TRANSPARENT) */}
<div className="rounded-2xl bg-white/35 backdrop-blur-md p-4 shadow-lg">
            <h2 className="mb-4 text-xl font-bold text-gray-900">
              Today’s Prayer Times
            </h2>

            <NextPrayerCountdown />

            <div className="mt-6">
              <PrayerTimes />
            </div>
          </div>

          <footer className="mt-4 text-center text-xs text-gray-800">
            © {new Date().getFullYear()} Brookfield Masjid
          </footer>
        </main>
      </div>
    </div>
  );
}
