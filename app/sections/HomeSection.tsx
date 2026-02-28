"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Cloud,
  Droplets,
  Flame,
  HeartPulse,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Thermometer,
  WifiOff,
  Wind,
  Wifi,
} from "lucide-react";
import { useRealtimeSensor } from "@/hooks/useRealtimeSensor";

/* ─────────────────────────────────────────────────────────────
   Sub-component Types
───────────────────────────────────────────────────────────── */
interface FeatureCardProps {
  icon: React.ReactNode;
  iconBoxClassName: string;
  title: string;
  description: string;
}

interface StatusPillProps {
  label: string;
  value: React.ReactNode;
  sub?: string;
  accent: string;
}

interface SensorRowProps {
  icon: React.ReactNode;
  iconBoxClassName: string;
  label: string;
  value: string;
  unit: React.ReactNode;
  isLast?: boolean;
  isLive?: boolean;
}

interface Sensor {
  label: string;
  value: string;
  unit: React.ReactNode;
  icon: React.ReactNode;
  iconBoxClassName: string;
  isLive?: boolean;
}

interface Feature {
  icon: React.ReactNode;
  iconBoxClassName: string;
  title: string;
  description: string;
}

/* ─────────────────────────────────────────────────────────────
   Static Feature Data
───────────────────────────────────────────────────────────── */
const FEATURES: Feature[] = [
  {
    icon: <Wifi className="h-5 w-5" />,
    iconBoxClassName: "bg-sky-100 text-sky-600",
    title: "Monitoring Real-time",
    description:
      "Sensor IoT membaca kualitas udara setiap detik dan mengirimkan data langsung ke dashboard tanpa jeda.",
  },
  {
    icon: <ShieldCheck className="h-5 w-5" />,
    iconBoxClassName: "bg-emerald-100 text-emerald-600",
    title: "Jaga Kesehatan Penghuni",
    description:
      "Deteksi dini polutan berbahaya seperti CO, CO₂, dan NO₂ agar lingkungan dalam ruangan tetap aman.",
  },
  {
    icon: <BarChart3 className="h-5 w-5" />,
    iconBoxClassName: "bg-violet-100 text-violet-600",
    title: "Data Akurat & Terstruktur",
    description:
      "Setiap pengukuran disimpan dengan timestamp presisi untuk analisis tren dan pengambilan keputusan.",
  },
];

/* ─────────────────────────────────────────────────────────────
   Reusable Sub-components
───────────────────────────────────────────────────────────── */
const FeatureCard = ({
  icon,
  iconBoxClassName,
  title,
  description,
}: FeatureCardProps) => (
  <div className="group flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-200 hover:border-sky-100 hover:shadow-md">
    <div
      className={cn(
        "grid h-11 w-11 shrink-0 place-items-center rounded-xl transition-transform duration-200 group-hover:scale-105",
        iconBoxClassName,
      )}
    >
      {icon}
    </div>
    <div>
      <div className="text-sm font-semibold text-slate-800">{title}</div>
      <div className="mt-1 text-xs leading-relaxed text-slate-500">
        {description}
      </div>
    </div>
  </div>
);

const StatusPill = ({ label, value, sub, accent }: StatusPillProps) => (
  <div className={cn("flex flex-col gap-1 rounded-2xl border p-5", accent)}>
    <div className="text-xs font-medium uppercase tracking-widest opacity-60">
      {label}
    </div>
    <div className="text-3xl font-semibold leading-none tracking-tight">
      {value}
    </div>
    {sub && <div className="mt-1 text-xs opacity-50">{sub}</div>}
  </div>
);

const SensorRow = ({
  icon,
  iconBoxClassName,
  label,
  value,
  unit,
  isLast = false,
  isLive = false,
}: SensorRowProps) => (
  <>
    <div className="flex items-center gap-4 py-3.5">
      <div
        className={cn(
          "grid h-9 w-9 shrink-0 place-items-center rounded-lg",
          iconBoxClassName,
        )}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium text-slate-700">{label}</div>
        <div className="mt-0.5 text-xs text-slate-400">{unit}</div>
      </div>
      <div className="text-right">
        <div className="text-xl font-semibold tabular-nums text-slate-900">
          {value}
        </div>
        <div
          className={cn(
            "mt-0.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium",
            isLive
              ? "bg-emerald-50 text-emerald-600"
              : "bg-slate-100 text-slate-400",
          )}
        >
          <span
            className={cn(
              "h-1 w-1 rounded-full",
              isLive ? "bg-emerald-500 animate-pulse" : "bg-slate-300",
            )}
          />
          {isLive ? "Live" : "Statik"}
        </div>
      </div>
    </div>
    {!isLast && <Separator />}
  </>
);

/* ─────────────────────────────────────────────────────────────
   Mock Chart (visual decoration only)
───────────────────────────────────────────────────────────── */
const MockChart = ({ color = "text-sky-500" }: { color?: string }) => (
  <svg viewBox="0 0 480 140" className={cn("h-36 w-full", color)}>
    <defs>
      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.18" />
        <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
      </linearGradient>
    </defs>
    <g className="text-slate-200">
      {[28, 56, 84, 112].map((y) => (
        <line
          key={y}
          x1="0"
          y1={y}
          x2="480"
          y2={y}
          stroke="currentColor"
          strokeWidth="1"
        />
      ))}
    </g>
    <path
      d="M0 90 C 60 30, 120 20, 180 65 S 300 115, 360 55 S 420 25, 480 45"
      fill="url(#chartGradient)"
    />
    <path
      d="M0 90 C 60 30, 120 20, 180 65 S 300 115, 360 55 S 420 25, 480 45"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
    <circle cx="480" cy="45" r="4" fill="currentColor" />
  </svg>
);

/* ─────────────────────────────────────────────────────────────
   Loading Skeleton
───────────────────────────────────────────────────────────── */
const SkeletonValue = () => (
  <div className="h-7 w-16 animate-pulse rounded-lg bg-slate-200" />
);

/* ─────────────────────────────────────────────────────────────
   Sections
───────────────────────────────────────────────────────────── */
const HeroSection = () => (
  <section className="relative w-full overflow-hidden bg-gradient-to-br from-cyan-600 via-sky-500 to-blue-600 px-6 py-24 text-center md:py-32 lg:py-36">
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-cyan-400/30 blur-3xl" />
      <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-blue-700/40 blur-3xl" />
      <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-300/20 blur-2xl" />
    </div>

    <div className="relative mx-auto max-w-4xl space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-5 py-2 text-sm font-medium text-white backdrop-blur-sm">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" />
          Sistem IoT Cerdas
        </div>
      </div>

      <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-white md:text-6xl lg:text-7xl">
        Sistem Monitoring
        <br />
        <span className="bg-gradient-to-r from-amber-200 to-yellow-300 bg-clip-text text-transparent">
          Kualitas Udara
        </span>
        <br />
        Berbasis IoT
      </h1>

      <p className="mx-auto max-w-2xl text-lg leading-relaxed text-white/80 md:text-xl">
        Pantau kondisi udara dalam ruangan secara real-time dari mana saja.
        Lindungi kesehatan penghuni dengan data sensor yang akurat dan
        notifikasi otomatis berbasis teknologi IoT terdepan.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
        <a
          href="#history"
          className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-semibold text-sky-700 shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-100"
        >
          Lihat Data History
          <ArrowRight className="h-5 w-5" />
        </a>
        <a
          href="#about"
          className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/25"
        >
          Pelajari Lebih Lanjut
        </a>
      </div>
    </div>
  </section>
);

const AboutSection = () => (
  <section className="space-y-6">
    <div className="text-center md:text-left">
      <h2 className="text-3xl font-semibold tracking-tight text-slate-800 md:text-4xl">
        Tentang Sistem
      </h2>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-500 md:text-lg">
        AeroSense menggabungkan sensor IoT multi-parameter dengan dashboard
        real-time untuk memberikan gambaran menyeluruh kondisi udara — mulai
        dari suhu &amp; kelembaban, hingga kadar gas berbahaya — sehingga
        penghuni dapat bertindak sebelum masalah berkembang.
      </p>
    </div>
    <div className="grid gap-4 sm:grid-cols-3">
      {FEATURES.map((feature) => (
        <FeatureCard key={feature.title} {...feature} />
      ))}
    </div>
  </section>
);

/* ─────────────────────────────────────────────────────────────
   Status Section — uses live Firebase data
───────────────────────────────────────────────────────────── */
function StatusSection({
  suhu,
  kelembaban,
  loading,
  lastUpdated,
}: {
  suhu: number | null;
  kelembaban: number | null;
  loading: boolean;
  lastUpdated: string | null;
}) {
  // Simple comfort assessment based on temperature + humidity
  const isComfortable =
    suhu !== null &&
    kelembaban !== null &&
    suhu >= 18 &&
    suhu <= 28 &&
    kelembaban >= 30 &&
    kelembaban <= 70;

  const statusLabel = loading
    ? "Memuat…"
    : suhu === null
      ? "Tidak Ada Data"
      : isComfortable
        ? "Baik"
        : "Perhatian";

  const statusColor = loading
    ? "text-slate-400"
    : suhu === null
      ? "text-slate-400"
      : isComfortable
        ? "text-emerald-600"
        : "text-amber-500";

  const accentClass = loading
    ? "border-slate-100 bg-slate-50/60 text-slate-800"
    : suhu === null
      ? "border-slate-100 bg-slate-50/60 text-slate-800"
      : isComfortable
        ? "border-emerald-100 bg-emerald-50/60 text-slate-800"
        : "border-amber-100 bg-amber-50/60 text-slate-800";

  const subText = lastUpdated
    ? `Diperbarui ${new Date(lastUpdated).toLocaleTimeString("id-ID")}`
    : "Menunggu data dari sensor…";

  return (
    <section className="space-y-6">
      <h2 className="text-3xl font-semibold tracking-tight text-slate-800 md:text-4xl">
        Status Umum
      </h2>
      <div className="grid gap-5 sm:grid-cols-2">
        <StatusPill
          label="Status Kualitas Udara"
          value={
            loading ? (
              <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
            ) : (
              <span className="flex items-center gap-2">
                <HeartPulse className={cn("h-8 w-8", statusColor)} />
                <span className={statusColor}>{statusLabel}</span>
              </span>
            )
          }
          sub={subText}
          accent={accentClass}
        />
        <StatusPill
          label="Kelembaban Relatif"
          value={
            loading ? (
              <SkeletonValue />
            ) : kelembaban !== null ? (
              <span className="flex items-baseline gap-1.5">
                <span>{kelembaban.toFixed(1)}</span>
                <span className="text-xl font-medium text-slate-400">%</span>
              </span>
            ) : (
              <span className="text-slate-400 text-2xl">—</span>
            )
          }
          sub={
            kelembaban !== null
              ? kelembaban >= 30 && kelembaban <= 70
                ? "Dalam rentang nyaman (30–70%)"
                : "Di luar rentang nyaman"
              : "Menunggu data sensor"
          }
          accent="border-sky-100 bg-sky-50/60 text-slate-800"
        />
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   Sensor Data Section — blends live + static sensors
───────────────────────────────────────────────────────────── */
function SensorDataSection({
  suhu,
  kelembaban,
  loading,
}: {
  suhu: number | null;
  kelembaban: number | null;
  loading: boolean;
}) {
  // Two live sensors from DHT22 + four static placeholder sensors
  const liveSensors: Sensor[] = [
    {
      label: "Suhu",
      value: loading ? "…" : suhu !== null ? `${suhu.toFixed(1)}` : "—",
      unit: "Celcius (°C)",
      icon: <Thermometer className="h-5 w-5" />,
      iconBoxClassName: "bg-sky-100 text-sky-600",
      isLive: true,
    },
    {
      label: "Kelembaban",
      value: loading
        ? "…"
        : kelembaban !== null
          ? `${kelembaban.toFixed(0)}%`
          : "—",
      unit: "Relative Humidity",
      icon: <Droplets className="h-5 w-5" />,
      iconBoxClassName: "bg-blue-100 text-blue-600",
      isLive: true,
    },
    {
      label: "Karbon Dioksida",
      value: "450",
      unit: (
        <>
          ppm CO<sub>2</sub>
        </>
      ),
      icon: <Activity className="h-5 w-5" />,
      iconBoxClassName: "bg-emerald-100 text-emerald-600",
      isLive: false,
    },
  ];

  const staticSensors: Sensor[] = [
    {
      label: "Karbon Monoksida",
      value: "2",
      unit: "ppm CO",
      icon: <Flame className="h-5 w-5" />,
      iconBoxClassName: "bg-rose-100 text-rose-600",
      isLive: false,
    },
    {
      label: "Ozon",
      value: "0.05",
      unit: (
        <>
          ppm O<sub>3</sub>
        </>
      ),
      icon: <Cloud className="h-5 w-5" />,
      iconBoxClassName: "bg-indigo-100 text-indigo-600",
      isLive: false,
    },
    {
      label: "Nitrogen Dioksida",
      value: "0.03",
      unit: (
        <>
          ppm NO<sub>2</sub>
        </>
      ),
      icon: <AlertTriangle className="h-5 w-5" />,
      iconBoxClassName: "bg-amber-100 text-amber-600",
      isLive: false,
    },
  ];

  const renderGroup = (sensors: Sensor[]) => (
    <Card className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-shadow hover:shadow-md">
      <CardContent className="px-6 py-2">
        {sensors.map((sensor, index) => (
          <SensorRow
            key={sensor.label}
            {...sensor}
            isLast={index === sensors.length - 1}
          />
        ))}
      </CardContent>
    </Card>
  );

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight text-slate-800 md:text-4xl">
          Data Sensor Real-time
        </h2>
        <p className="mt-2 text-base text-slate-500">
          Pembacaan langsung dari seluruh sensor yang terpasang di ruangan.
          <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            Live: DHT-22
          </span>
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {renderGroup(liveSensors)}
        {renderGroup(staticSensors)}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   Chart Section (decorative — see HistorySection for real charts)
───────────────────────────────────────────────────────────── */
const ChartSection = () => (
  <section className="space-y-6">
    <div>
      <h2 className="text-3xl font-semibold tracking-tight text-slate-800 md:text-4xl">
        Grafik Monitoring
      </h2>
      <p className="mt-2 text-base text-slate-500">
        Visualisasi tren data sensor — lihat{" "}
        <a
          href="#history"
          className="font-medium text-sky-600 underline underline-offset-2"
        >
          Data History
        </a>{" "}
        untuk grafik interaktif berbasis data nyata.
      </p>
    </div>
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-shadow hover:shadow-md">
        <CardHeader className="flex-row items-center gap-3 space-y-0 pb-0">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-cyan-100 text-cyan-700">
            <Wind className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">
              PM2.5 Monitoring
            </CardTitle>
            <p className="text-sm text-slate-400">Partikel halus µg/m³</p>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <MockChart color="text-cyan-500" />
        </CardContent>
      </Card>

      <Card className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-shadow hover:shadow-md">
        <CardHeader className="flex-row items-center gap-3 space-y-0 pb-0">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-sky-100 text-sky-700">
            <Thermometer className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">
              Suhu & Kelembaban
            </CardTitle>
            <p className="text-sm text-slate-400">°C dan % RH</p>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <MockChart color="text-sky-500" />
        </CardContent>
      </Card>
    </div>
  </section>
);

/* ─────────────────────────────────────────────────────────────
   Error Banner
───────────────────────────────────────────────────────────── */
function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
      <WifiOff className="h-5 w-5 shrink-0 text-rose-500" />
      <div>
        <span className="font-semibold">Gagal terhubung ke sensor: </span>
        {message}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Root Export
───────────────────────────────────────────────────────────── */
export default function HomeSection() {
  const { current, loading, error, lastUpdated } = useRealtimeSensor();

  const suhu = current?.suhu ?? null;
  const kelembaban = current?.kelembaban ?? null;

  return (
    <div>
      <HeroSection />

      <div className="mx-auto w-full max-w-6xl space-y-16 px-4 pb-8 pt-16 md:pt-20 lg:pt-24">
        {/* Connection error banner */}
        {error && <ErrorBanner message={error} />}

        <AboutSection />

        <StatusSection
          suhu={suhu}
          kelembaban={kelembaban}
          loading={loading}
          lastUpdated={lastUpdated}
        />

        <SensorDataSection
          suhu={suhu}
          kelembaban={kelembaban}
          loading={loading}
        />

        <ChartSection />
      </div>
    </div>
  );
}
