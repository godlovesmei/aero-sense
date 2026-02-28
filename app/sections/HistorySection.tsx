"use client";

import * as React from "react";
import {
  CalendarDays,
  Download,
  Droplets,
  Loader2,
  RefreshCw,
  Thermometer,
  WifiOff,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  useRealtimeSensor,
  type SensorReading,
} from "@/hooks/useRealtimeSensor";

/* ─────────────────────────────────────────────────────────────
   Date helpers
───────────────────────────────────────────────────────────── */
function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function toDateInputValue(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function parseDateInputToRangeStart(dateStr: string): Date | null {
  const [y, m, d] = dateStr.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d, 0, 0, 0, 0);
}

function parseDateInputToRangeEnd(dateStr: string): Date | null {
  const [y, m, d] = dateStr.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d, 23, 59, 59, 999);
}

function formatDateTimeID(ts: string | number) {
  const d = typeof ts === "number" ? new Date(ts) : new Date(ts);
  return d.toLocaleString("id-ID", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatTimeShort(ts: string | number) {
  const d = typeof ts === "number" ? new Date(ts) : new Date(ts);
  return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

/* ─────────────────────────────────────────────────────────────
   CSV Export
───────────────────────────────────────────────────────────── */
function csvEscape(v: unknown) {
  const s = String(v ?? "");
  const safe = /^[=+\-@]/.test(s) ? `'${s}` : s;
  return /[",\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
}

function downloadCsv(filename: string, rows: (string | number)[][]) {
  const csv = rows.map((r) => r.map(csvEscape).join(",")).join("\n");
  const url = URL.createObjectURL(
    new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" }),
  );
  const a = Object.assign(document.createElement("a"), {
    href: url,
    download: filename,
  });
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/* ─────────────────────────────────────────────────────────────
   Chart Card
───────────────────────────────────────────────────────────── */
interface ChartCardProps {
  icon: React.ReactNode;
  iconBox: string;
  title: string;
  sub: string;
  data: { time: string; value: number }[];
  color: string;
  gradientId: string;
  unit: string;
  loading: boolean;
  domain?: [
    number | "auto" | "dataMin" | "dataMax",
    number | "auto" | "dataMin" | "dataMax",
  ];
}

function ChartCard({
  icon,
  iconBox,
  title,
  sub,
  data,
  color,
  gradientId,
  unit,
  loading,
  domain = ["auto", "auto"],
}: ChartCardProps) {
  return (
    <Card className="rounded-2xl border border-slate-100 bg-white shadow-sm">
      <CardHeader className="flex-row items-center gap-3 space-y-0 pb-0">
        <div
          className={cn(
            "grid h-10 w-10 shrink-0 place-items-center rounded-xl",
            iconBox,
          )}
        >
          {icon}
        </div>
        <div>
          <CardTitle className="text-base font-semibold">{title}</CardTitle>
          <p className="text-xs text-slate-400">{sub}</p>
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-4 pt-3">
        {loading ? (
          <div className="grid h-44 place-items-center">
            <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
          </div>
        ) : data.length === 0 ? (
          <div className="grid h-44 place-items-center rounded-xl bg-slate-50 text-sm text-slate-400">
            Tidak ada data pada range tanggal ini.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={176}>
            <AreaChart
              data={data}
              margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
            >
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.18} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 10, fill: "#94a3b8" }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#94a3b8" }}
                tickLine={false}
                axisLine={false}
                domain={domain}
                tickFormatter={(v) => `${v}`}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                  fontSize: "12px",
                  padding: "8px 12px",
                }}
                formatter={(value: number) => [`${value} ${unit}`, title]}
                labelStyle={{ color: "#64748b", marginBottom: "2px" }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2.5}
                fill={`url(#${gradientId})`}
                dot={false}
                activeDot={{ r: 5, fill: color, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}

        {data.length > 0 && (
          <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
            <span>
              Terbaru:{" "}
              <span className="font-semibold text-slate-800">
                {data[data.length - 1]?.value} {unit}
              </span>
            </span>
            <span className="text-slate-400">{data.length} titik data</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main Component
───────────────────────────────────────────────────────────── */
export default function HistorySection() {
  const { history, loading, error } = useRealtimeSensor(200);

  /* Date filter state */
  const defaultEnd = React.useMemo(() => new Date(), []);
  const defaultStart = React.useMemo(
    () => new Date(Date.now() - 2 * 86_400_000),
    [],
  );

  const [startDate, setStartDate] = React.useState(
    toDateInputValue(defaultStart),
  );
  const [endDate, setEndDate] = React.useState(toDateInputValue(defaultEnd));

  const startRange = React.useMemo(
    () => (startDate ? parseDateInputToRangeStart(startDate) : null),
    [startDate],
  );
  const endRange = React.useMemo(
    () => (endDate ? parseDateInputToRangeEnd(endDate) : null),
    [endDate],
  );

  const rangeInvalid = React.useMemo(
    () => !!(startRange && endRange && endRange < startRange),
    [startRange, endRange],
  );

  /* Filter history by date range */
  const filtered = React.useMemo<SensorReading[]>(() => {
    if (!startRange || !endRange || rangeInvalid) return [];
    const s = startRange.getTime();
    const e = endRange.getTime();
    return history.filter((d) => {
      const t =
        typeof d.timestamp === "number"
          ? d.timestamp
          : new Date(d.timestamp).getTime();
      return t >= s && t <= e;
    });
  }, [history, startRange, endRange, rangeInvalid]);

  /* Most-recent 12 rows for the table */
  const recent = React.useMemo(
    () =>
      [...filtered]
        .sort((a, b) => {
          const ta =
            typeof a.timestamp === "number"
              ? a.timestamp
              : new Date(a.timestamp).getTime();
          const tb =
            typeof b.timestamp === "number"
              ? b.timestamp
              : new Date(b.timestamp).getTime();
          return tb - ta;
        })
        .slice(0, 12),
    [filtered],
  );

  /* Summary averages */
  const summary = React.useMemo(() => {
    if (!filtered.length) return null;
    const n = filtered.length;
    return {
      suhu: filtered.reduce((a, d) => a + d.suhu, 0) / n,
      kelembaban: filtered.reduce((a, d) => a + d.kelembaban, 0) / n,
    };
  }, [filtered]);

  /* Chart data */
  const suhuChartData = React.useMemo(
    () =>
      filtered.map((d) => ({
        time: formatTimeShort(d.timestamp),
        value: d.suhu,
      })),
    [filtered],
  );

  const kelembabanChartData = React.useMemo(
    () =>
      filtered.map((d) => ({
        time: formatTimeShort(d.timestamp),
        value: d.kelembaban,
      })),
    [filtered],
  );

  /* ── Render ── */
  return (
    <div className="space-y-12">
      {/* ── HEADER ── */}
      <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Data History
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Filter data berdasarkan tanggal, lihat tren sensor, dan export CSV.
            {loading && (
              <span className="ml-2 inline-flex items-center gap-1 text-sky-500">
                <Loader2 className="h-3 w-3 animate-spin" />
                Memuat data Firebase…
              </span>
            )}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={() => {
              setStartDate(toDateInputValue(defaultStart));
              setEndDate(toDateInputValue(defaultEnd));
            }}
          >
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
            Reset
          </Button>
          <Button
            size="sm"
            className="rounded-full bg-sky-600 text-white hover:bg-sky-700"
            disabled={!filtered.length || rangeInvalid}
            onClick={() =>
              downloadCsv(`aerosense_${startDate}_to_${endDate}.csv`, [
                ["Timestamp", "Suhu (°C)", "Kelembaban (%)"],
                ...filtered.map((d) => [
                  formatDateTimeID(d.timestamp),
                  d.suhu,
                  d.kelembaban,
                ]),
              ])
            }
          >
            <Download className="mr-1.5 h-3.5 w-3.5" />
            Export CSV
          </Button>
        </div>
      </section>

      {/* ── ERROR BANNER ── */}
      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
          <WifiOff className="h-5 w-5 shrink-0 text-rose-500" />
          <div>
            <span className="font-semibold">Gagal memuat data: </span>
            {error}
          </div>
        </div>
      )}

      {/* ── DATE FILTER ── */}
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
            {/* From */}
            <div className="space-y-1.5">
              <Label htmlFor="startDate" className="text-xs text-slate-500">
                Dari
              </Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="rounded-xl"
              />
            </div>

            {/* To */}
            <div className="space-y-1.5">
              <Label htmlFor="endDate" className="text-xs text-slate-500">
                Sampai
              </Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="rounded-xl"
              />
            </div>

            {/* Summary */}
            <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Rata-rata periode
              </div>
              {loading ? (
                <div className="flex items-center gap-2 text-slate-400">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-xs">Memuat…</span>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-slate-700">
                  {[
                    ["Suhu", summary ? `${summary.suhu.toFixed(1)} °C` : "—"],
                    [
                      "Kelembaban",
                      summary ? `${summary.kelembaban.toFixed(0)}%` : "—",
                    ],
                    [
                      "Total Data",
                      filtered.length ? `${filtered.length} titik` : "—",
                    ],
                    [
                      "Sensor",
                      <span
                        key="live"
                        className="inline-flex items-center gap-1 text-emerald-600"
                      >
                        <span className="h-1 w-1 animate-pulse rounded-full bg-emerald-500" />
                        DHT-22 Live
                      </span>,
                    ],
                  ].map(([k, v]) => (
                    <React.Fragment key={String(k)}>
                      <span className="text-xs text-slate-500">{k}</span>
                      <span className="text-right text-xs font-medium">
                        {v}
                      </span>
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
          </div>

          {rangeInvalid && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
              Range tanggal tidak valid — <b>Sampai</b> lebih kecil dari{" "}
              <b>Dari</b>.
            </div>
          )}

          {!loading && history.length === 0 && !error && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
              Belum ada data history di Firebase. Pastikan ESP32 sudah menulis
              ke{" "}
              <code className="font-mono font-semibold">/sensor/history</code>.
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── CHARTS ── */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Charts</h2>
        <div className="grid gap-5 lg:grid-cols-2">
          <ChartCard
            icon={<Thermometer className="h-5 w-5" />}
            iconBox="bg-sky-100 text-sky-700"
            title="Suhu"
            sub="Nilai dalam °C"
            data={suhuChartData}
            color="#0ea5e9"
            gradientId="grad-suhu"
            unit="°C"
            loading={loading}
            domain={[15, 35]}
          />
          <ChartCard
            icon={<Droplets className="h-5 w-5" />}
            iconBox="bg-blue-100 text-blue-700"
            title="Kelembaban"
            sub="Relative Humidity (%)"
            data={kelembabanChartData}
            color="#3b82f6"
            gradientId="grad-kelembaban"
            unit="%"
            loading={loading}
            domain={[0, 100]}
          />
        </div>
      </section>

      {/* ── TABLE ── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">
            Recent Measurements
          </h2>
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
                    {[
                      "Waktu",
                      "Suhu (°C)",
                      "Kelembaban (%)",
                      "Status Suhu",
                    ].map((h, i, arr) => (
                      <TableHead
                        key={h}
                        className={cn(
                          "text-xs font-semibold uppercase tracking-wide text-slate-500",
                          i === 0 && "pl-6",
                          i === arr.length - 1 && "pr-6",
                        )}
                      >
                        {h}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="py-12 text-center text-sm text-slate-400"
                      >
                        <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin text-slate-300" />
                        Memuat data dari Firebase…
                      </TableCell>
                    </TableRow>
                  ) : recent.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="py-12 text-center text-sm text-slate-400"
                      >
                        Tidak ada data untuk ditampilkan.
                      </TableCell>
                    </TableRow>
                  ) : (
                    recent.map((d) => {
                      const suhuOk = d.suhu >= 18 && d.suhu <= 28;
                      const kelOk = d.kelembaban >= 30 && d.kelembaban <= 70;
                      const isOk = suhuOk && kelOk;

                      return (
                        <TableRow
                          key={String(d.timestamp)}
                          className="border-slate-50 hover:bg-slate-50/60"
                        >
                          <TableCell className="pl-6 text-sm font-medium text-slate-700">
                            {formatDateTimeID(d.timestamp)}
                          </TableCell>
                          <TableCell className="text-sm tabular-nums">
                            {d.suhu.toFixed(1)} °C
                          </TableCell>
                          <TableCell className="text-sm tabular-nums">
                            {d.kelembaban.toFixed(0)}%
                          </TableCell>
                          <TableCell className="pr-6">
                            <Badge
                              className={cn(
                                "rounded-full",
                                isOk
                                  ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                                  : "bg-amber-100 text-amber-700 hover:bg-amber-100",
                              )}
                            >
                              {isOk ? "Normal" : "Perhatian"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })
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
