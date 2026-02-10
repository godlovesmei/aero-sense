"use client";

import Image from "next/image";
import * as React from "react";
import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import {
  Activity,
  AlertTriangle,
  Cloud,
  Droplets,
  Flame,
  HeartPulse,
  Thermometer,
  Wind,
} from "lucide-react";

function LiveClock() {
  const [mounted, setMounted] = React.useState(false);
  const [now, setNow] = React.useState<Date | null>(null);

  React.useEffect(() => {
    setMounted(true);
    setNow(new Date());

    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const dateText = React.useMemo(() => {
    if (!now) return "—";
    const s = now.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return s.charAt(0).toUpperCase() + s.slice(1);
  }, [now]);

  const timeText = React.useMemo(() => {
    if (!now) return "--:--:--";
    return now.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  }, [now]);

  return (
    <div className="rounded-2xl bg-white/15 px-6 py-4 text-white shadow-sm backdrop-blur">
      <div className="text-sm font-medium text-white/90">
        {mounted ? dateText : "—"}
      </div>
      <div className="mt-1 text-4xl font-semibold tracking-tight">
        {mounted ? timeText : "--:--:--"}
      </div>
    </div>
  );
}

function SummaryCard({
  icon,
  iconBoxClassName,
  label,
  value,
}: {
  icon: React.ReactNode;
  iconBoxClassName: string;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <Card className="rounded-2xl border-0 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
      <CardContent className="p-6">
        <div
          className={cn(
            "grid h-12 w-12 place-items-center rounded-xl",
            iconBoxClassName
          )}
        >
          {icon}
        </div>

        <div className="mt-6">
          <div className="text-sm text-slate-600">{label}</div>
          <div className="mt-2 text-4xl font-semibold leading-none">{value}</div>
        </div>
      </CardContent>
    </Card>
  );
}

type MetricCardProps = {
  title: string;
  value: string;
  unit: React.ReactNode;
  status?: string;
  icon: React.ReactNode;
  iconBoxClassName: string;
};

function MetricCard({
  title,
  value,
  unit,
  status = "Baik",
  icon,
  iconBoxClassName,
}: MetricCardProps) {
  return (
    <Card className="rounded-2xl border-0 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "grid h-14 w-14 shrink-0 place-items-center rounded-xl",
              iconBoxClassName
            )}
          >
            {icon}
          </div>

          <div className="min-w-0">
            <div className="text-base font-medium text-slate-700">{title}</div>
            <div className="mt-2 text-4xl font-semibold leading-none">
              {value}
            </div>
            <div className="mt-2 text-sm text-slate-600">{unit}</div>
          </div>
        </div>

        <Separator className="my-5" />

        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-600">Status</div>
          <Badge className="rounded-full bg-emerald-100 px-4 py-1 text-emerald-700 hover:bg-emerald-100">
            {status}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

function MockChart() {
  return (
    <div className="mt-2 rounded-xl border border-dashed border-slate-200 bg-white/60 p-4">
      <svg viewBox="0 0 480 180" className="h-44 w-full text-sky-600">
        <g opacity="0.25" className="text-slate-400">
          {Array.from({ length: 5 }).map((_, i) => (
            <line
              key={i}
              x1="0"
              y1={30 + i * 30}
              x2="480"
              y2={30 + i * 30}
              stroke="currentColor"
              strokeWidth="1"
            />
          ))}
          {Array.from({ length: 6 }).map((_, i) => (
            <line
              key={i}
              x1={i * 96}
              y1="0"
              x2={i * 96}
              y2="180"
              stroke="currentColor"
              strokeWidth="1"
            />
          ))}
        </g>

        <path
          d="M0 120 C 60 40, 120 30, 180 90 S 300 150, 360 80 S 420 40, 480 70"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <path
          d="M0 120 C 60 40, 120 30, 180 90 S 300 150, 360 80 S 420 40, 480 70 L480 180 L0 180 Z"
          fill="currentColor"
          opacity="0.12"
        />
      </svg>
    </div>
  );
}

export default function HomeSection() {
  const metrics: MetricCardProps[] = [
    {
      title: "Suhu",
      value: "24.5",
      unit: "°C",
      icon: <Thermometer className="h-7 w-7" />,
      iconBoxClassName: "bg-sky-100 text-sky-700",
    },
    {
      title: "Kelembaban",
      value: "58",
      unit: "%",
      icon: <Droplets className="h-7 w-7" />,
      iconBoxClassName: "bg-blue-100 text-blue-700",
    },
    {
      title: "Karbon Dioksida",
      value: "450",
      unit: (
        <>
          ppm CO<sub>2</sub>
        </>
      ),
      icon: <Activity className="h-7 w-7" />,
      iconBoxClassName: "bg-emerald-100 text-emerald-700",
    },
    {
      title: "Karbon Monoksida",
      value: "2",
      unit: "ppm CO",
      icon: <Flame className="h-7 w-7" />,
      iconBoxClassName: "bg-rose-100 text-rose-700",
    },
    {
      title: "Ozon",
      value: "0.05",
      unit: (
        <>
          ppm O<sub>3</sub>
        </>
      ),
      icon: <Cloud className="h-7 w-7" />,
      iconBoxClassName: "bg-indigo-100 text-indigo-700",
    },
    {
      title: "Nitrogen Dioksida",
      value: "0.03",
      unit: (
        <>
          ppm NO<sub>2</sub>
        </>
      ),
      icon: <AlertTriangle className="h-7 w-7" />,
      iconBoxClassName: "bg-amber-100 text-amber-700",
    },
  ];

  return (
    <div className="space-y-12">
      {/* HERO */}
      <section>
        <div className="rounded-3xl bg-linear-to-r from-cyan-700 to-sky-600 p-8 shadow-[0_18px_45px_rgba(0,0,0,0.18)]">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
            <div className="relative h-16 w-16 overflow-hidden rounded-2xl bg-white/95 shadow-md">
            <Image
                src="/images/AERO_SENSEE.jpg"
                alt="AeroSense Logo"
                fill
                className="object-contain p-1"
                priority
            />
            </div>
              <div>
                <h1 className="text-4xl font-semibold tracking-tight text-white">
                  Welcome to AeroSense <span className="ml-1">👋</span>
                </h1>
                <p className="mt-2 max-w-xl text-sm text-white/85">
                  Sistem Monitoring Kualitas Udara dalam Ruangan Berbasis IoT
                </p>
              </div>
            </div>

            <LiveClock />
          </div>
        </div>
      </section>

      {/* STATUS UMUM */}
      <section className="space-y-5">
        <h2 className="text-2xl font-semibold tracking-tight">Status Umum</h2>

        <div className="grid gap-6 md:grid-cols-2">
          <SummaryCard
            icon={<HeartPulse className="h-7 w-7" />}
            iconBoxClassName="bg-emerald-100 text-emerald-700"
            label="Status Kualitas Udara"
            value="Baik"
          />

          <SummaryCard
            icon={<Wind className="h-7 w-7" />}
            iconBoxClassName="bg-cyan-100 text-cyan-700"
            label="PM2.5 Level"
            value={
              <span className="inline-flex items-end gap-2">
                <span>12</span>
                <span className="text-2xl font-semibold text-slate-900/90">
                  µg/m³
                </span>
              </span>
            }
          />
        </div>
      </section>

      {/* DATA SENSOR REAL-TIME */}
      <section className="space-y-5">
        <h2 className="text-2xl font-semibold tracking-tight">
          Data Sensor Real-time
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {metrics.map((m) => (
            <MetricCard key={m.title} {...m} />
          ))}
        </div>
      </section>

      {/* GRAFIK MONITORING */}
      <section className="space-y-5">
        <h2 className="text-2xl font-semibold tracking-tight">
          Grafik Monitoring
        </h2>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="rounded-2xl border-0 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
            <CardHeader className="flex-row items-center gap-3 space-y-0">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-cyan-100 text-cyan-700">
                <Wind className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl font-semibold">
                PM2.5 Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MockChart />
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-0 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
            <CardHeader className="flex-row items-center gap-3 space-y-0">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-sky-100 text-sky-700">
                <Thermometer className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl font-semibold">
                Suhu &amp; Kelembaban
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MockChart />
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
