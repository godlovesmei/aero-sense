"use client";

import Image from "next/image";
import * as React from "react";
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
  ShieldCheck,
  Thermometer,
  Wifi,
  Wind,
} from "lucide-react";

/* ── FEATURE CARD ───────────────────────────── */
function FeatureCard({
  icon,
  iconBoxClassName,
  title,
  description,
}: {
  icon: React.ReactNode;
  iconBoxClassName: string;
  title: string;
  description: string;
}) {
  return (
    <div className="group flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-200 hover:border-sky-100 hover:shadow-md">
      <div
        className={cn(
          "grid h-11 w-11 shrink-0 place-items-center rounded-xl transition-transform duration-200 group-hover:scale-105",
          iconBoxClassName
        )}
      >
        {icon}
      </div>
      <div>
        <div className="text-sm font-semibold text-slate-800">{title}</div>
        <div className="mt-1 text-xs leading-relaxed text-slate-500">{description}</div>
      </div>
    </div>
  );
}

/* ── STATUS PILL ────────────────────────────── */
function StatusPill({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: React.ReactNode;
  sub?: string;
  accent: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1 rounded-2xl border p-5", accent)}>
      <div className="text-xs font-medium uppercase tracking-widest opacity-60">{label}</div>
      <div className="text-3xl font-semibold leading-none tracking-tight">{value}</div>
      {sub && <div className="mt-1 text-xs opacity-50">{sub}</div>}
    </div>
  );
}

/* ── SENSOR ROW ─────────────────────────────── */
function SensorRow({
  icon,
  iconBoxClassName,
  label,
  value,
  unit,
  isLast = false,
}: {
  icon: React.ReactNode;
  iconBoxClassName: string;
  label: string;
  value: string;
  unit: React.ReactNode;
  isLast?: boolean;
}) {
  return (
    <>
      <div className="flex items-center gap-4 py-3.5">
        <div className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-lg", iconBoxClassName)}>
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium text-slate-700">{label}</div>
          <div className="mt-0.5 text-xs text-slate-400">{unit}</div>
        </div>
        <div className="text-right">
          <div className="text-xl font-semibold tabular-nums text-slate-900">{value}</div>
          <div className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-600">
            <span className="h-1 w-1 rounded-full bg-emerald-500" />
            Baik
          </div>
        </div>
      </div>
      {!isLast && <Separator />}
    </>
  );
}

/* ── MOCK CHART ─────────────────────────────── */
function MockChart({ color = "text-sky-500" }: { color?: string }) {
  return (
    <svg viewBox="0 0 480 140" className={cn("h-36 w-full", color)}>
      <defs>
        <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.18" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g className="text-slate-200">
        {[28, 56, 84, 112].map((y, i) => (
          <line key={i} x1="0" y1={y} x2="480" y2={y} stroke="currentColor" strokeWidth="1" />
        ))}
      </g>
      <path
        d="M0 90 C 60 30, 120 20, 180 65 S 300 115, 360 55 S 420 25, 480 45"
        fill="url(#cg)"
        stroke="none"
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
}

/* ── MAIN ───────────────────────────────────── */
export default function HomeSection() {
  const sensors = [
    {
      label: "Suhu",
      value: "24.5",
      unit: "Celcius (°C)",
      icon: <Thermometer className="h-5 w-5" />,
      iconBoxClassName: "bg-sky-100 text-sky-600",
    },
    {
      label: "Kelembaban",
      value: "58%",
      unit: "Relative Humidity",
      icon: <Droplets className="h-5 w-5" />,
      iconBoxClassName: "bg-blue-100 text-blue-600",
    },
    {
      label: "Karbon Dioksida",
      value: "450",
      unit: (<>ppm CO<sub>2</sub></>),
      icon: <Activity className="h-5 w-5" />,
      iconBoxClassName: "bg-emerald-100 text-emerald-600",
    },
    {
      label: "Karbon Monoksida",
      value: "2",
      unit: "ppm CO",
      icon: <Flame className="h-5 w-5" />,
      iconBoxClassName: "bg-rose-100 text-rose-600",
    },
    {
      label: "Ozon",
      value: "0.05",
      unit: (<>ppm O<sub>3</sub></>),
      icon: <Cloud className="h-5 w-5" />,
      iconBoxClassName: "bg-indigo-100 text-indigo-600",
    },
    {
      label: "Nitrogen Dioksida",
      value: "0.03",
      unit: (<>ppm NO<sub>2</sub></>),
      icon: <AlertTriangle className="h-5 w-5" />,
      iconBoxClassName: "bg-amber-100 text-amber-600",
    },
  ];

  const features = [
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

  return (
    <div>
      {/* HERO — full bleed dengan latar gradien yang lebih modern */}
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-cyan-600 via-sky-500 to-blue-600 px-6 py-24 text-center md:py-32 lg:py-36">
        {/* Elemen dekoratif: lingkaran kabur */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-cyan-400/30 blur-3xl" />
          <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-blue-700/40 blur-3xl" />
          <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-300/20 blur-2xl" />
        </div>

        {/* Konten hero dengan lebar maksimum */}
        <div className="relative mx-auto max-w-4xl space-y-8">
          {/* Lencana aktif */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-5 py-2 text-sm font-medium text-white backdrop-blur-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" />
              Sistem IoT Cerdas
            </div>
          </div>

          {/* Judul utama — lebih besar dan lebih menonjol */}
          <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-white md:text-6xl lg:text-7xl">
            Sistem Monitoring
            <br />
            <span className="bg-gradient-to-r from-amber-200 to-yellow-300 bg-clip-text text-transparent">
              Kualitas Udara
            </span>
            <br />
            Berbasis IoT
          </h1>

          {/* Deskripsi */}
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-white/80 md:text-xl">
            Pantau kondisi udara dalam ruangan secara real-time dari mana saja.
            Lindungi kesehatan penghuni dengan data sensor yang akurat dan notifikasi
            otomatis berbasis teknologi IoT terdepan.
          </p>

          {/* Tombol CTA */}
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

          {/* Logo, jam, dan statistik telah dihapus sesuai permintaan */}
        </div>
      </section>

      {/* KONTEN UTAMA — dalam wadah max-width */}
      <div className="mx-auto w-full max-w-6xl space-y-16 px-4 pt-16 pb-8 md:pt-20 lg:pt-24">
        {/* TENTANG SISTEM */}
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
            {features.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </section>

        {/* STATUS UMUM */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-800 md:text-4xl">
            Status Umum
          </h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <StatusPill
              label="Status Kualitas Udara"
              value={
                <span className="flex items-center gap-2">
                  <HeartPulse className="h-8 w-8 text-emerald-500" />
                  <span className="text-emerald-600">Baik</span>
                </span>
              }
              sub="Semua parameter dalam batas aman"
              accent="border-emerald-100 bg-emerald-50/60 text-slate-800"
            />
            <StatusPill
              label="PM2.5 Level"
              value={
                <span className="flex items-baseline gap-1.5">
                  <span>12</span>
                  <span className="text-xl font-medium text-slate-400">µg/m³</span>
                </span>
              }
              sub="Di bawah ambang batas WHO (15 µg/m³)"
              accent="border-sky-100 bg-sky-50/60 text-slate-800"
            />
          </div>
        </section>

        {/* DATA SENSOR REAL-TIME */}
        <section className="space-y-6">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-800 md:text-4xl">
              Data Sensor Real-time
            </h2>
            <p className="mt-2 text-base text-slate-500">
              Pembacaan langsung dari seluruh sensor yang terpasang di ruangan.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-shadow hover:shadow-md">
              <CardContent className="px-6 py-2">
                {sensors.slice(0, 3).map((s, i) => (
                  <SensorRow key={s.label} {...s} isLast={i === 2} />
                ))}
              </CardContent>
            </Card>
            <Card className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-shadow hover:shadow-md">
              <CardContent className="px-6 py-2">
                {sensors.slice(3).map((s, i) => (
                  <SensorRow key={s.label} {...s} isLast={i === 2} />
                ))}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* GRAFIK MONITORING */}
        <section className="space-y-6">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-800 md:text-4xl">
              Grafik Monitoring
            </h2>
            <p className="mt-2 text-base text-slate-500">
              Visualisasi tren data sensor dalam periode waktu tertentu.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-shadow hover:shadow-md">
              <CardHeader className="flex-row items-center gap-3 space-y-0 pb-0">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-cyan-100 text-cyan-700">
                  <Wind className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">PM2.5 Monitoring</CardTitle>
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
                  <CardTitle className="text-lg font-semibold">Suhu &amp; Kelembaban</CardTitle>
                  <p className="text-sm text-slate-400">°C dan % RH</p>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <MockChart color="text-sky-500" />
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}