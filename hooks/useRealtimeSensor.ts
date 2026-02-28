"use client";

import { useEffect, useRef, useState } from "react";
import {
  ref,
  onValue,
  query,
  orderByChild,
  limitToLast,
} from "firebase/database";
import { database } from "@/lib/firebase";

/* ─────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────── */
export interface SensorReading {
  suhu: number;
  kelembaban: number;
  timestamp: string | number;
  unit_suhu?: string;
}

export interface RealtimeSensorState {
  /** Latest reading from /sensor/data_terbaru */
  current: SensorReading | null;
  /** Historical readings from /sensor/history (up to `historyLimit`) */
  history: SensorReading[];
  loading: boolean;
  error: string | null;
  /** ISO string of last successful update */
  lastUpdated: string | null;
}

/* ─────────────────────────────────────────────────────────────
   Hook
───────────────────────────────────────────────────────────── */
/**
 * useRealtimeSensor
 *
 * Subscribes to two Firebase paths:
 *  - /sensor/data_terbaru  → real-time current reading
 *  - /sensor/history       → ordered list of past readings
 *
 * Falls back gracefully when paths don't exist yet.
 *
 * @param historyLimit  Max entries to fetch from /sensor/history (default 100)
 */
export function useRealtimeSensor(historyLimit = 100): RealtimeSensorState {
  const [current, setCurrent] = useState<SensorReading | null>(null);
  const [history, setHistory] = useState<SensorReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // Track in-flight subscriptions so we can unsub on unmount
  const unsubCurrentRef = useRef<(() => void) | null>(null);
  const unsubHistoryRef = useRef<(() => void) | null>(null);

  /* ── Current reading ── */
  useEffect(() => {
    const currentRef = ref(database, "sensor/data_terbaru");

    const unsub = onValue(
      currentRef,
      (snapshot) => {
        const val = snapshot.val() as SensorReading | null;
        if (val) {
          setCurrent(val);
          setLastUpdated(new Date().toISOString());
          setError(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error("[useRealtimeSensor] current:", err);
        setError(err.message ?? "Gagal membaca data sensor.");
        setLoading(false);
      },
    );

    unsubCurrentRef.current = unsub;
    return () => unsub();
  }, []);

  /* ── History ── */
  useEffect(() => {
    // Order by the 'timestamp' child key and grab the last N entries.
    // If your ESP32 writes numeric epoch timestamps, orderByChild works perfectly.
    const historyRef = query(
      ref(database, "sensor/history"),
      orderByChild("timestamp"),
      limitToLast(historyLimit),
    );

    const unsub = onValue(
      historyRef,
      (snapshot) => {
        const val = snapshot.val() as Record<string, SensorReading> | null;
        if (!val) {
          // Path doesn't exist yet — no error, just empty
          setHistory([]);
          return;
        }

        // Firebase returns an object keyed by push-id; convert to sorted array
        const entries = Object.values(val).sort((a, b) => {
          const ta =
            typeof a.timestamp === "number"
              ? a.timestamp
              : new Date(a.timestamp).getTime();
          const tb =
            typeof b.timestamp === "number"
              ? b.timestamp
              : new Date(b.timestamp).getTime();
          return ta - tb;
        });

        setHistory(entries);
      },
      (err) => {
        // History is optional — log but don't surface as a blocking error
        console.warn("[useRealtimeSensor] history:", err);
      },
    );

    unsubHistoryRef.current = unsub;
    return () => unsub();
  }, [historyLimit]);

  return { current, history, loading, error, lastUpdated };
}
