"use client";

import React from "react";
import {
  ActivityIcon,
  AlertCircle,
  BarChart3,
  BellIcon,
  CheckCircle2,
  CircuitBoardIcon,
  WindIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

/* ── SENSOR CARD ─────────────────────────────── */
function SensorCard({
  name,
  description,
  details,
  gradient,
  emoji,
}: {
  name: string;
  description: string;
  details: string;
  gradient: string;
  emoji: string;
}) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className={cn("relative flex items-end justify-between px-6 py-5", gradient)}>
        <div>
          <div className="text-2xl font-bold tracking-tight text-white">{name}</div>
          <div className="mt-0.5 text-xs font-medium text-white/80">{description}</div>
        </div>
        <span className="text-3xl leading-none">{emoji}</span>
      </div>
      <div className="px-6 py-4">
        <p className="text-sm leading-relaxed text-slate-500">{details}</p>
      </div>
    </div>
  );
}

/* ── FEATURE ITEM ────────────────────────────── */
function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-white/20 bg-white/10 px-5 py-4 backdrop-blur-sm">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/20 text-white">
        {icon}
      </div>
      <div>
        <div className="text-sm font-semibold text-white">{title}</div>
        <div className="mt-0.5 text-xs leading-relaxed text-white/70">{description}</div>
      </div>
    </div>
  );
}

/* ── MAIN ───────────────────────────────────── */
export default function AboutSection() {
  const sensors = [
    {
      name: "MQ-7",
      description: "Carbon Monoxide (CO) Sensor",
      details:
        "Mendeteksi gas karbon monoksida yang berbahaya dengan rentang 20–2000 ppm. Sangat sensitif terhadap CO, penting untuk keselamatan penghuni ruangan.",
      gradient: "bg-gradient-to-br from-red-500 to-orange-500",
      emoji: "🔥",
    },
    {
      name: "MQ-131",
      description: "Ozone (O₃) Sensor",
      details:
        "Mengukur konsentrasi ozon dalam rentang 10 ppb–2 ppm. Penting untuk memantau paparan ozon yang berlebihan di lingkungan dalam ruangan.",
      gradient: "bg-gradient-to-br from-blue-500 to-cyan-500",
      emoji: "☁️",
    },
    {
      name: "MQ-135",
      description: "Air Quality Sensor",
      details:
        "Mendeteksi berbagai gas seperti NH₃, NOx, alkohol, benzena, asap, dan CO₂. Ideal untuk monitoring kualitas udara yang komprehensif.",
      gradient: "bg-gradient-to-br from-green-500 to-emerald-500",
      emoji: "🌿",
    },
    {
      name: "DHT-22",
      description: "Temperature & Humidity Sensor",
      details:
        "Sensor digital akurasi tinggi untuk suhu (−40°C hingga 80°C) dan kelembaban (0–100% RH). Fondasi pengukuran kenyamanan termal ruangan.",
      gradient: "bg-gradient-to-br from-sky-500 to-blue-500",
      emoji: "🌡️",
    },
  ];

  const features = [
    {
      icon: <ActivityIcon className="h-5 w-5" />,
      title: "Monitoring Real-time",
      description: "Update data setiap detik langsung dari perangkat IoT.",
    },
    {
      icon: <CircuitBoardIcon className="h-5 w-5" />,
      title: "Multi-sensor",
      description: "4 sensor berbeda untuk cakupan deteksi yang menyeluruh.",
    },
    {
      icon: <BellIcon className="h-5 w-5" />,
      title: "Notifikasi Otomatis",
      description: "Peringatan saat kualitas udara mencapai level berbahaya.",
    },
    {
      icon: <BarChart3 className="h-5 w-5" />,
      title: "Data Historis",
      description: "Riwayat lengkap untuk analisis tren jangka panjang.",
    },
  ];

  const highlights = [
    { icon: <CheckCircle2 className="h-4 w-4" />, label: "Real-time dashboard" },
    { icon: <AlertCircle className="h-4 w-4" />, label: "Alert otomatis" },
    { icon: <BarChart3 className="h-4 w-4" />, label: "Analisis historis" },
  ];

  return (
    <div className="space-y-12">

      {/* ── HERO BANNER ── */}
      <section>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-700 to-sky-600 px-8 py-9 shadow-[0_18px_45px_rgba(0,0,0,0.16)]">
          <div className="pointer-events-none absolute -right-14 -top-14 h-60 w-60 rounded-full bg-white/[0.06]" />
          <div className="flex items-center gap-5">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <WindIcon className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-white">
                Tentang AeroSense
              </h1>
              <p className="mt-1 text-sm text-white/75">
                Sistem monitoring kualitas udara berbasis IoT
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── TENTANG SISTEM ── */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <CircuitBoardIcon className="h-5 w-5 text-sky-600" />
          <h2 className="text-xl font-semibold tracking-tight">Tentang Sistem</h2>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white px-7 py-6 shadow-sm">
          <div className="space-y-3 text-sm leading-relaxed text-slate-600">
            <p>
              AeroSense adalah sistem monitoring kualitas udara dalam ruangan berbasis
              Internet of Things (IoT) yang dirancang untuk memantau berbagai parameter
              kualitas udara secara real-time menggunakan jaringan sensor terintegrasi.
            </p>
            <Separator />
            <p>
              Dashboard interaktif menampilkan data langsung, grafik historis, dan notifikasi
              otomatis ketika kualitas udara melampaui ambang batas aman — membantu penghuni
              dan pengelola gedung membuat keputusan yang tepat.
            </p>
            <Separator />
            <p>
              Data yang dikumpulkan mendukung analisis tren jangka panjang, evaluasi efektivitas
              ventilasi, serta perencanaan tindakan pencegahan untuk menjaga kondisi udara optimal
              bagi produktivitas dan kesehatan penghuni.
            </p>
          </div>
        </div>
      </section>

      {/* ── SENSOR YANG DIGUNAKAN ── */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <WindIcon className="h-5 w-5 text-sky-600" />
          <h2 className="text-xl font-semibold tracking-tight">Sensor yang Digunakan</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {sensors.map((s) => (
            <SensorCard key={s.name} {...s} />
          ))}
        </div>
      </section>

      {/* ── KEUNGGULAN ── */}
      <section>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-700 to-sky-600 p-8 shadow-[0_18px_45px_rgba(0,0,0,0.14)]">
          <div className="pointer-events-none absolute -left-10 -top-10 h-52 w-52 rounded-full bg-white/[0.05]" />

          <div className="relative space-y-6">
            <h2 className="text-xl font-semibold text-white">Keunggulan AeroSense</h2>

            <div className="grid gap-3 md:grid-cols-2">
              {features.map((f) => (
                <FeatureItem key={f.title} {...f} />
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-xs text-white/80">
              {highlights.map((h, i) => (
                <React.Fragment key={h.label}>
                  <span className="flex items-center gap-1.5">
                    {h.icon}
                    {h.label}
                  </span>
                  {i < highlights.length - 1 && (
                    <span className="h-3 w-px bg-white/30" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}