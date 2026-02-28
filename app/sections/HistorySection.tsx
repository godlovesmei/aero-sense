"use client";

import * as React from "react";
import {
  Activity,
  CalendarDays,
  Download,
  Droplets,
  RefreshCw,
  Thermometer,
  Wind,
  XCircle,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Measurement = {
  timestamp: string;
  pm25: number;
  temperature: number;
  humidity: number;
  co2: number;
};

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function toDateInputValue(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function parseDateInputToRangeStart(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d, 0, 0, 0, 0);
}

function parseDateInputToRangeEnd(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d, 23, 59, 59, 999);
}

function formatDateTimeID(iso: string) {
  return new Date(iso).toLocaleString("id-ID", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

/* ── LINE CHART ─────────────────────────────── */
function LineChart({
  data,
  valueKey,
  height = 160,
  color = "text-sky-500",
}: {
  data: Measurement[];
  valueKey: keyof Pick<Measurement, "pm25" | "temperature" | "humidity" | "co2">;
  height?: number;
  color?: string;
}) {
  const W = 720;

  const values = React.useMemo(() => data.map((d) => Number(d[valueKey])), [data, valueKey]);

  const { minV, maxV } = React.useMemo(() => {
    if (values.length === 0) return { minV: 0, maxV: 1 };
    let lo = values[0], hi = values[0];
    for (const v of values) { if (v < lo) lo = v; if (v > hi) hi = v; }
    const pad = (hi - lo) * 0.14 || 1;
    return { minV: lo - pad, maxV: hi + pad };
  }, [values]);

  const pts = React.useMemo(() => {
    if (data.length === 0) return [];
    const n = data.length;
    const l = 16, r = W - 10, t = 8, b = height - 16;
    return values.map((v, i) => ({
      x: n === 1 ? (l + r) / 2 : l + (i * (r - l)) / (n - 1),
      y: b - ((v - minV) / (maxV - minV || 1)) * (b - t),
    }));
  }, [data.length, values, minV, maxV, height]);

  const pathD = React.useMemo(() => {
    if (pts.length === 0) return "";
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const p = pts[i - 1], c = pts[i];
      const mx = (p.x + c.x) / 2, my = (p.y + c.y) / 2;
      d += ` Q ${p.x} ${p.y} ${mx} ${my}`;
    }
    const last = pts[pts.length - 1];
    d += ` T ${last.x} ${last.y}`;
    return d;
  }, [pts]);

  const areaD = React.useMemo(() => {
    if (!pathD || pts.length === 0) return "";
    const b = height - 16;
    return `${pathD} L ${pts[pts.length - 1].x} ${b} L ${pts[0].x} ${b} Z`;
  }, [pathD, pts, height]);

  if (data.length === 0) {
    return (
      <div className="grid h-40 place-items-center rounded-xl bg-slate-50 text-sm text-slate-400">
        Tidak ada data pada range tanggal ini.
      </div>
    );
  }

  return (
    <svg
      viewBox={`0 0 ${W} ${height}`}
      className={cn("w-full", color)}
      style={{ height }}
      role="img"
      aria-label="Line chart"
    >
      <defs>
        <linearGradient id={`g-${valueKey}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.18" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g className="text-slate-200">
        {[0.2, 0.4, 0.6, 0.8].map((r, i) => (
          <line key={i} x1="0" y1={height * r} x2={W} y2={height * r}
            stroke="currentColor" strokeWidth="1" />
        ))}
      </g>
      <path d={areaD} fill={`url(#g-${valueKey})`} />
      <path d={pathD} fill="none" stroke="currentColor" strokeWidth="2.5"
        strokeLinejoin="round" strokeLinecap="round" />
      {pts.length > 0 && (
        <circle cx={pts[pts.length - 1].x} cy={pts[pts.length - 1].y}
          r="5" fill="currentColor" opacity="0.9" />
      )}
    </svg>
  );
}

/* ── PM2.5 STATUS ───────────────────────────── */
function Pm25Badge({ pm25 }: { pm25: number }) {
  if (pm25 <= 12)
    return <Badge className="rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Baik</Badge>;
  if (pm25 <= 35.4)
    return <Badge className="rounded-full bg-amber-100 text-amber-700 hover:bg-amber-100">Sedang</Badge>;
  return <Badge className="rounded-full bg-rose-100 text-rose-700 hover:bg-rose-100">Buruk</Badge>;
}

/* ── CSV EXPORT ─────────────────────────────── */
function csvEscape(v: unknown) {
  const s = String(v ?? "");
  const safe = /^[=+\-@]/.test(s) ? `'${s}` : s;
  return /[",\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
}

function downloadCsv(filename: string, rows: (string | number)[][]) {
  const csv = rows.map((r) => r.map(csvEscape).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
  const a = Object.assign(document.createElement("a"), { href: url, download: filename });
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/* ── MOCK DATA ──────────────────────────────── */
function generateMockMeasurements(): Measurement[] {
  let seed = 42;
  const rand = () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };

  const now = Date.now();
  const start = now - 7 * 864e5;
  const step = 30 * 60e3;
  const pts: Measurement[] = [];

  for (let t = start; t <= now; t += step) {
    const h = new Date(t).getHours() + new Date(t).getMinutes() / 60;
    const w1 = Math.sin((2 * Math.PI * h) / 24);
    const w2 = Math.cos((2 * Math.PI * h) / 24);
    pts.push({
      timestamp: new Date(t).toISOString(),
      pm25: Number(clamp(10 + Math.max(0, w1) * 10 + (rand() - 0.5) * 4, 2, 60).toFixed(1)),
      temperature: Number(clamp(24 + w1 * 1.2 + (rand() - 0.5) * 0.8, 20, 30).toFixed(1)),
      humidity: Math.round(clamp(58 + w2 * 6 + (rand() - 0.5) * 3, 35, 80)),
      co2: Math.round(clamp(420 + Math.max(0, w1) * 80 + (rand() - 0.5) * 40, 380, 1200)),
    });
  }
  return pts;
}

/* ── CHART CARD ─────────────────────────────── */
function ChartCard({
  icon, iconBox, title, sub, data, valueKey, color, latest,
}: {
  icon: React.ReactNode;
  iconBox: string;
  title: string;
  sub: string;
  data: Measurement[];
  valueKey: keyof Pick<Measurement, "pm25" | "temperature" | "humidity" | "co2">;
  color: string;
  latest: React.ReactNode;
}) {
  return (
    <Card className="rounded-2xl border border-slate-100 bg-white shadow-sm">
      <CardHeader className="flex-row items-center gap-3 space-y-0 pb-0">
        <div className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-xl", iconBox)}>
          {icon}
        </div>
        <div>
          <CardTitle className="text-base font-semibold">{title}</CardTitle>
          <p className="text-xs text-slate-400">{sub}</p>
        </div>
      </CardHeader>
      <CardContent className="pt-3 pb-4 px-5">
        <LineChart data={data} valueKey={valueKey} color={color} />
        <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
          <span>
            Terbaru:{" "}
            <span className="font-semibold text-slate-800">{latest}</span>
          </span>
          {valueKey === "pm25" && data.length > 0 && (
            <Pm25Badge pm25={data[data.length - 1]?.pm25 ?? 0} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/* ── MAIN ───────────────────────────────────── */
export default function HistorySection() {
  const allData = React.useMemo(() => generateMockMeasurements(), []);

  const defaultEnd = React.useMemo(() => new Date(), []);
  const defaultStart = React.useMemo(() => new Date(Date.now() - 2 * 864e5), []);

  const [startDate, setStartDate] = React.useState(toDateInputValue(defaultStart));
  const [endDate, setEndDate] = React.useState(toDateInputValue(defaultEnd));

  const startRange = React.useMemo(() => (startDate ? parseDateInputToRangeStart(startDate) : null), [startDate]);
  const endRange = React.useMemo(() => (endDate ? parseDateInputToRangeEnd(endDate) : null), [endDate]);

  const rangeInvalid = React.useMemo(() =>
    !!(startRange && endRange && endRange < startRange), [startRange, endRange]);

  const filtered = React.useMemo(() => {
    if (!startRange || !endRange) return allData;
    if (rangeInvalid) return [];
    const s = startRange.getTime(), e = endRange.getTime();
    return allData.filter((d) => { const t = new Date(d.timestamp).getTime(); return t >= s && t <= e; });
  }, [allData, startRange, endRange, rangeInvalid]);

  const recent = React.useMemo(() =>
    [...filtered].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 12),
    [filtered]);

  const summary = React.useMemo(() => {
    if (!filtered.length) return { pm25: 0, temp: 0, hum: 0, co2: 0 };
    const sum = filtered.reduce((a, d) => ({ pm25: a.pm25 + d.pm25, temp: a.temp + d.temperature, hum: a.hum + d.humidity, co2: a.co2 + d.co2 }), { pm25: 0, temp: 0, hum: 0, co2: 0 });
    const n = filtered.length;
    return { pm25: sum.pm25 / n, temp: sum.temp / n, hum: sum.hum / n, co2: sum.co2 / n };
  }, [filtered]);

  return (
    <div className="space-y-12">

      {/* ── HEADER ── */}
      <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Data History</h1>
          <p className="mt-1 text-sm text-slate-500">
            Filter data berdasarkan tanggal, lihat tren sensor, dan export CSV.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={() => { setStartDate(toDateInputValue(defaultStart)); setEndDate(toDateInputValue(defaultEnd)); }}
          >
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
            Reset
          </Button>
          <Button
            size="sm"
            className="rounded-full bg-sky-600 text-white hover:bg-sky-700"
            onClick={() => downloadCsv(`aerosense_${startDate}_to_${endDate}.csv`, [
              ["Timestamp", "PM2.5 (µg/m³)", "Temperature (°C)", "Humidity (%)", "CO2 (ppm)"],
              ...filtered.map((d) => [formatDateTimeID(d.timestamp), d.pm25, d.temperature, d.humidity, d.co2]),
            ])}
            disabled={!filtered.length || rangeInvalid}
          >
            <Download className="mr-1.5 h-3.5 w-3.5" />
            Export CSV
          </Button>
        </div>
      </section>

      {/* ── FILTER ── */}
      <Card className="rounded-2xl border border-slate-100 bg-white shadow-sm">
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <CalendarDays className="h-4 w-4 text-sky-600" />
            Filter Tanggal
          </CardTitle>
          <Badge variant="secondary" className="rounded-full text-xs">
            {filtered.length} data
          </Badge>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="startDate" className="text-xs text-slate-500">Dari</Label>
              <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="endDate" className="text-xs text-slate-500">Sampai</Label>
              <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="rounded-xl" />
            </div>

            {/* Summary */}
            <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Rata-rata periode
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-slate-700">
                {[
                  ["PM2.5", filtered.length ? `${summary.pm25.toFixed(1)} µg/m³` : "—"],
                  ["Suhu", filtered.length ? `${summary.temp.toFixed(1)} °C` : "—"],
                  ["Kelembaban", filtered.length ? `${summary.hum.toFixed(0)}%` : "—"],
                  ["CO2", filtered.length ? `${summary.co2.toFixed(0)} ppm` : "—"],
                ].map(([k, v]) => (
                  <React.Fragment key={k}>
                    <span className="text-xs text-slate-500">{k}</span>
                    <span className="text-right text-xs font-medium">{v}</span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {rangeInvalid && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
              Range tanggal tidak valid — <b>Sampai</b> lebih kecil dari <b>Dari</b>.
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── CHARTS ── */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Charts</h2>
        <div className="grid gap-5 lg:grid-cols-2">
          <ChartCard
            icon={<Wind className="h-5 w-5" />}
            iconBox="bg-cyan-100 text-cyan-700"
            title="PM2.5 Levels"
            sub="µg/m³ — filtered range"
            data={filtered}
            valueKey="pm25"
            color="text-cyan-500"
            latest={`${recent[0]?.pm25 ?? "—"} µg/m³`}
          />
          <ChartCard
            icon={<Thermometer className="h-5 w-5" />}
            iconBox="bg-sky-100 text-sky-700"
            title="Temperature"
            sub="Nilai dalam °C"
            data={filtered}
            valueKey="temperature"
            color="text-sky-500"
            latest={`${recent[0]?.temperature ?? "—"} °C`}
          />
          <ChartCard
            icon={<Droplets className="h-5 w-5" />}
            iconBox="bg-blue-100 text-blue-700"
            title="Humidity"
            sub="Relative Humidity (%)"
            data={filtered}
            valueKey="humidity"
            color="text-blue-500"
            latest={`${recent[0]?.humidity ?? "—"}%`}
          />
          <ChartCard
            icon={<Activity className="h-5 w-5" />}
            iconBox="bg-emerald-100 text-emerald-700"
            title="CO2 Levels"
            sub="Nilai dalam ppm"
            data={filtered}
            valueKey="co2"
            color="text-emerald-500"
            latest={`${recent[0]?.co2 ?? "—"} ppm`}
          />
        </div>
      </section>

      {/* ── TABLE ── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">Recent Measurements</h2>
          <Badge variant="secondary" className="rounded-full text-xs">
            {recent.length} terakhir
          </Badge>
        </div>

        <Card className="rounded-2xl border border-slate-100 bg-white shadow-sm">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-100 bg-slate-50/70 hover:bg-slate-50/70">
                    <TableHead className="rounded-tl-2xl pl-6 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Waktu
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-500">PM2.5</TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-500">Suhu</TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-500">Kelembaban</TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-500">CO2</TableHead>
                    <TableHead className="rounded-tr-2xl pr-6 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recent.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="py-12 text-center text-sm text-slate-400">
                        Tidak ada data untuk ditampilkan.
                      </TableCell>
                    </TableRow>
                  ) : (
                    recent.map((d) => (
                      <TableRow key={d.timestamp} className="border-slate-50 hover:bg-slate-50/60">
                        <TableCell className="pl-6 text-sm font-medium text-slate-700">
                          {formatDateTimeID(d.timestamp)}
                        </TableCell>
                        <TableCell className="text-sm tabular-nums">{d.pm25} µg/m³</TableCell>
                        <TableCell className="text-sm tabular-nums">{d.temperature} °C</TableCell>
                        <TableCell className="text-sm tabular-nums">{d.humidity}%</TableCell>
                        <TableCell className="text-sm tabular-nums">{d.co2} ppm</TableCell>
                        <TableCell className="pr-6">
                          <Pm25Badge pm25={d.pm25} />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}