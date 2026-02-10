"use client";

import * as React from "react";
import {
  Activity,
  CalendarDays,
  Download,
  Droplets,
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
  timestamp: string; // ISO string
  pm25: number; // µg/m³
  temperature: number; // °C
  humidity: number; // %
  co2: number; // ppm
};

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

/** Convert Date -> "YYYY-MM-DD" (for <input type="date" />) */
function toDateInputValue(d: Date) {
  const y = d.getFullYear();
  const m = pad2(d.getMonth() + 1);
  const day = pad2(d.getDate());
  return `${y}-${m}-${day}`;
}

function parseDateInputToRangeStart(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map((x) => Number(x));
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d, 0, 0, 0, 0);
}

function parseDateInputToRangeEnd(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map((x) => Number(x));
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d, 23, 59, 59, 999);
}

function formatDateTimeID(iso: string) {
  const dt = new Date(iso);
  return dt.toLocaleString("id-ID", {
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

/** Simple, dependency-free SVG line chart */
function LineChart({
  data,
  valueKey,
  height = 190,
  className,
}: {
  data: Measurement[];
  valueKey: keyof Pick<Measurement, "pm25" | "temperature" | "humidity" | "co2">;
  height?: number;
  className?: string;
}) {
  const width = 720;

  const values = React.useMemo(() => data.map((d) => Number(d[valueKey])), [data, valueKey]);

  const { minV, maxV } = React.useMemo(() => {
    if (values.length === 0) return { minV: 0, maxV: 1 };
    let minV = values[0];
    let maxV = values[0];
    for (const v of values) {
      if (v < minV) minV = v;
      if (v > maxV) maxV = v;
    }
    const pad = (maxV - minV) * 0.12 || 1;
    return { minV: minV - pad, maxV: maxV + pad };
  }, [values]);

  const points = React.useMemo(() => {
    if (data.length === 0) return [];
    const n = data.length;
    const left = 24;
    const right = width - 14;
    const top = 10;
    const bottom = height - 22;

    return values.map((v, i) => {
      const x = n === 1 ? (left + right) / 2 : left + (i * (right - left)) / (n - 1);
      const t = (v - minV) / (maxV - minV || 1);
      const y = bottom - t * (bottom - top);
      return { x, y };
    });
  }, [data.length, values, minV, maxV, height]);

  const pathD = React.useMemo(() => {
    if (points.length === 0) return "";
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const cur = points[i];
      const midX = (prev.x + cur.x) / 2;
      const midY = (prev.y + cur.y) / 2;
      d += ` Q ${prev.x} ${prev.y} ${midX} ${midY}`;
    }
    const last = points[points.length - 1];
    d += ` T ${last.x} ${last.y}`;
    return d;
  }, [points]);

  const areaD = React.useMemo(() => {
    if (!pathD || points.length === 0) return "";
    const bottom = height - 22;
    const first = points[0];
    const last = points[points.length - 1];
    return `${pathD} L ${last.x} ${bottom} L ${first.x} ${bottom} Z`;
  }, [pathD, points, height]);

  const empty = data.length === 0;

  return (
    <div className={cn("mt-2 rounded-xl border border-slate-100 bg-white/60 p-4", className)}>
      {empty ? (
        <div className="grid h-47.5 place-items-center text-sm text-slate-500">
          Tidak ada data pada range tanggal ini.
        </div>
      ) : (
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-47.5 w-full text-sky-600"
          role="img"
          aria-label="Line chart"
        >
          <g opacity="0.25" className="text-slate-400">
            {Array.from({ length: 5 }).map((_, i) => {
              const y = 22 + i * 34;
              return (
                <line
                  key={i}
                  x1="0"
                  y1={y}
                  x2={width}
                  y2={y}
                  stroke="currentColor"
                  strokeWidth="1"
                />
              );
            })}
            {Array.from({ length: 6 }).map((_, i) => {
              const x = i * (width / 6);
              return (
                <line
                  key={i}
                  x1={x}
                  y1="0"
                  x2={x}
                  y2={height}
                  stroke="currentColor"
                  strokeWidth="1"
                />
              );
            })}
          </g>

          <path d={areaD} fill="currentColor" opacity="0.12" />
          <path
            d={pathD}
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {points.length > 0 && (
            <circle
              cx={points[points.length - 1].x}
              cy={points[points.length - 1].y}
              r="6"
              fill="currentColor"
              opacity="0.9"
            />
          )}
        </svg>
      )}
    </div>
  );
}

function statusBadgeForPM25(pm25: number) {
  if (pm25 <= 12) {
    return (
      <Badge className="rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
        Baik
      </Badge>
    );
  }
  if (pm25 <= 35.4) {
    return (
      <Badge className="rounded-full bg-amber-100 text-amber-700 hover:bg-amber-100">
        Sedang
      </Badge>
    );
  }
  return (
    <Badge className="rounded-full bg-rose-100 text-rose-700 hover:bg-rose-100">
      Buruk
    </Badge>
  );
}

function csvEscape(value: unknown) {
  const s = String(value ?? "");
  const safe =
    s.startsWith("=") || s.startsWith("+") || s.startsWith("-") || s.startsWith("@")
      ? `'${s}`
      : s;
  if (/[",\n]/.test(safe)) return `"${safe.replace(/"/g, '""')}"`;
  return safe;
}

function downloadCsv(filename: string, rows: (string | number)[][]) {
  const csv = rows.map((r) => r.map(csvEscape).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
}

function generateMockMeasurements(): Measurement[] {
  const now = new Date();
  const end = new Date(now.getTime());
  const start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const points: Measurement[] = [];
  const stepMs = 30 * 60 * 1000;

  let seed = 42;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  for (let t = start.getTime(); t <= end.getTime(); t += stepMs) {
    const dt = new Date(t);
    const hour = dt.getHours() + dt.getMinutes() / 60;

    const dailyWave = Math.sin((2 * Math.PI * hour) / 24);
    const dailyWave2 = Math.cos((2 * Math.PI * hour) / 24);

    const temperature = clamp(24 + dailyWave * 1.2 + (rand() - 0.5) * 0.8, 20, 30);
    const humidity = clamp(58 + dailyWave2 * 6 + (rand() - 0.5) * 3, 35, 80);
    const pm25 = clamp(10 + Math.max(0, dailyWave) * 10 + (rand() - 0.5) * 4, 2, 60);
    const co2 = clamp(420 + Math.max(0, dailyWave) * 80 + (rand() - 0.5) * 40, 380, 1200);

    points.push({
      timestamp: new Date(t).toISOString(),
      pm25: Number(pm25.toFixed(1)),
      temperature: Number(temperature.toFixed(1)),
      humidity: Math.round(humidity),
      co2: Math.round(co2),
    });
  }

  return points;
}

export default function HistorySection() {
  const allData = React.useMemo(() => generateMockMeasurements(), []);

  const defaultEnd = React.useMemo(() => new Date(), []);
  const defaultStart = React.useMemo(() => new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), []);

  const [startDate, setStartDate] = React.useState<string>(toDateInputValue(defaultStart));
  const [endDate, setEndDate] = React.useState<string>(toDateInputValue(defaultEnd));

  const startRange = React.useMemo(
    () => (startDate ? parseDateInputToRangeStart(startDate) : null),
    [startDate]
  );
  const endRange = React.useMemo(
    () => (endDate ? parseDateInputToRangeEnd(endDate) : null),
    [endDate]
  );

  const rangeInvalid = React.useMemo(() => {
    if (!startRange || !endRange) return false;
    return endRange.getTime() < startRange.getTime();
  }, [startRange, endRange]);

  const filtered = React.useMemo(() => {
    if (!startRange || !endRange) return allData;
    if (endRange.getTime() < startRange.getTime()) return [];
    const s = startRange.getTime();
    const e = endRange.getTime();

    return allData.filter((d) => {
      const t = new Date(d.timestamp).getTime();
      return t >= s && t <= e;
    });
  }, [allData, startRange, endRange]);

  const recent = React.useMemo(() => {
    const sorted = [...filtered].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    return sorted.slice(0, 12);
  }, [filtered]);

  const summary = React.useMemo(() => {
    if (filtered.length === 0) return { pm25Avg: 0, tempAvg: 0, humAvg: 0, co2Avg: 0 };
    let pm = 0,
      te = 0,
      hu = 0,
      co = 0;
    for (const d of filtered) {
      pm += d.pm25;
      te += d.temperature;
      hu += d.humidity;
      co += d.co2;
    }
    return {
      pm25Avg: pm / filtered.length,
      tempAvg: te / filtered.length,
      humAvg: hu / filtered.length,
      co2Avg: co / filtered.length,
    };
  }, [filtered]);

  const onResetRange = () => {
    setStartDate(toDateInputValue(defaultStart));
    setEndDate(toDateInputValue(defaultEnd));
  };

  const onExport = () => {
    const rows: (string | number)[][] = [
      ["Timestamp", "PM2.5 (µg/m³)", "Temperature (°C)", "Humidity (%)", "CO2 (ppm)"],
      ...filtered.map((d) => [
        formatDateTimeID(d.timestamp),
        d.pm25,
        d.temperature,
        d.humidity,
        d.co2,
      ]),
    ];

    const name = `aerosense_data_${startDate}_to_${endDate}.csv`;
    downloadCsv(name, rows);
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <section className="space-y-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Data History</h1>
            <p className="text-sm text-slate-600">
              Filter data berdasarkan tanggal, lihat tren sensor, dan export CSV.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" className="rounded-full" onClick={onResetRange} type="button">
              <XCircle className="mr-2 h-4 w-4" />
              Reset
            </Button>

            <Button
              className="rounded-full bg-sky-600 text-white hover:bg-sky-700"
              onClick={onExport}
              type="button"
              disabled={filtered.length === 0 || rangeInvalid}
            >
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>
      </section>

      {/* Filters */}
      <Card className="rounded-2xl border-0 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="flex items-center gap-2 text-xl">
            <CalendarDays className="h-5 w-5 text-sky-700" />
            Filter Tanggal
          </CardTitle>
          <Badge variant="secondary" className="rounded-full">
            {filtered.length} data
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="startDate">Dari</Label>
              <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">Sampai</Label>
              <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>

            <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
              <div className="font-medium">Rangkuman (avg)</div>
              <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
                <div>PM2.5</div>
                <div className="text-right">{filtered.length ? summary.pm25Avg.toFixed(1) : "—"} µg/m³</div>

                <div>Suhu</div>
                <div className="text-right">{filtered.length ? summary.tempAvg.toFixed(1) : "—"} °C</div>

                <div>Kelembaban</div>
                <div className="text-right">{filtered.length ? summary.humAvg.toFixed(0) : "—"}%</div>

                <div>CO2</div>
                <div className="text-right">{filtered.length ? summary.co2Avg.toFixed(0) : "—"} ppm</div>
              </div>
            </div>
          </div>

          {rangeInvalid && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
              Range tanggal tidak valid: <b>Sampai</b> lebih kecil dari <b>Dari</b>.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Charts */}
      <section className="space-y-5">
        <h2 className="text-2xl font-semibold tracking-tight">Charts</h2>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="rounded-2xl border-0 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
            <CardHeader className="flex-row items-center gap-3 space-y-0">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-cyan-100 text-cyan-700">
                <Wind className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <CardTitle className="text-xl font-semibold">PM2.5 Levels Over Time</CardTitle>
                <div className="mt-1 text-sm text-slate-600">Nilai dalam µg/m³ (filtered range)</div>
              </div>
            </CardHeader>
            <CardContent>
              <LineChart data={filtered} valueKey="pm25" />
              <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
                <span>
                  Latest:{" "}
                  <span className="font-medium text-slate-900">
                    {recent[0]?.pm25 ?? "—"} µg/m³
                  </span>
                </span>
                <span>{recent[0] ? statusBadgeForPM25(recent[0].pm25) : null}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-0 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
            <CardHeader className="flex-row items-center gap-3 space-y-0">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-sky-100 text-sky-700">
                <Thermometer className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <CardTitle className="text-xl font-semibold">Temperature Over Time</CardTitle>
                <div className="mt-1 text-sm text-slate-600">Nilai dalam °C</div>
              </div>
            </CardHeader>
            <CardContent>
              <LineChart data={filtered} valueKey="temperature" />
              <div className="mt-3 text-sm text-slate-600">
                Latest:{" "}
                <span className="font-medium text-slate-900">
                  {recent[0]?.temperature ?? "—"} °C
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-0 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
            <CardHeader className="flex-row items-center gap-3 space-y-0">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-100 text-blue-700">
                <Droplets className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <CardTitle className="text-xl font-semibold">Humidity Over Time</CardTitle>
                <div className="mt-1 text-sm text-slate-600">Nilai dalam %</div>
              </div>
            </CardHeader>
            <CardContent>
              <LineChart data={filtered} valueKey="humidity" />
              <div className="mt-3 text-sm text-slate-600">
                Latest:{" "}
                <span className="font-medium text-slate-900">
                  {recent[0]?.humidity ?? "—"}%
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-0 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
            <CardHeader className="flex-row items-center gap-3 space-y-0">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
                <Activity className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <CardTitle className="text-xl font-semibold">CO2 Levels Over Time</CardTitle>
                <div className="mt-1 text-sm text-slate-600">Nilai dalam ppm</div>
              </div>
            </CardHeader>
            <CardContent>
              <LineChart data={filtered} valueKey="co2" />
              <div className="mt-3 text-sm text-slate-600">
                Latest:{" "}
                <span className="font-medium text-slate-900">
                  {recent[0]?.co2 ?? "—"} ppm
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Recent Measurements */}
      <section className="space-y-5">
        <h2 className="text-2xl font-semibold tracking-tight">Recent Measurements</h2>

        <Card className="rounded-2xl border-0 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xl font-semibold">Tabel Data Terbaru</CardTitle>
            <Badge variant="secondary" className="rounded-full">
              {recent.length} terakhir
            </Badge>
          </CardHeader>

          <CardContent>
            <Separator className="mb-4" />
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-42.5">Waktu</TableHead>
                    <TableHead>PM2.5</TableHead>
                    <TableHead>Suhu</TableHead>
                    <TableHead>Kelembaban</TableHead>
                    <TableHead>CO2</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {recent.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="py-10 text-center text-slate-500">
                        Tidak ada data untuk ditampilkan.
                      </TableCell>
                    </TableRow>
                  ) : (
                    recent.map((d) => (
                      <TableRow key={d.timestamp}>
                        <TableCell className="font-medium">{formatDateTimeID(d.timestamp)}</TableCell>
                        <TableCell>{d.pm25} µg/m³</TableCell>
                        <TableCell>{d.temperature} °C</TableCell>
                        <TableCell>{d.humidity}%</TableCell>
                        <TableCell>{d.co2} ppm</TableCell>
                        <TableCell>{statusBadgeForPM25(d.pm25)}</TableCell>
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
