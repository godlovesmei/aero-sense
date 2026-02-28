"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Info, History, Wind } from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "home" | "history" | "about";
const TABS: Tab[] = ["home", "history", "about"];

function useActiveSection(ids: Tab[]) {
  const [active, setActive] = React.useState<Tab>("home");

  React.useEffect(() => {
    const hash = window.location.hash.replace("#", "") as Tab;
    if (ids.includes(hash)) setActive(hash);
  }, [ids]);

  React.useEffect(() => {
    const els = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (els.length === 0) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0)
          )[0];

        if (visible?.target?.id) {
          const id = visible.target.id as Tab;
          setActive(id);
          history.replaceState(null, "", `#${id}`);
        }
      },
      {
        root: null,
        threshold: [0.2, 0.35, 0.5, 0.7],
      }
    );

    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [ids]);

  return active;
}

export default function TopNav() {
  const activeTab = useActiveSection(TABS);

  const NAV_ITEMS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "home", label: "Home", icon: <Wind className="h-4 w-4" /> },
    {
      id: "history",
      label: "Data History",
      icon: <History className="h-4 w-4" />,
    },
    { id: "about", label: "About Us", icon: <Info className="h-4 w-4" /> },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-gradient-to-r from-cyan-700 to-sky-600 shadow-[0_2px_16px_rgba(0,0,0,0.15)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2.5">

        {/* ── Brand ── */}
        <Link
          href="/"
          className="group flex items-center gap-3 rounded-xl px-1 py-1 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        >
          <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-white/95 shadow-sm ring-1 ring-white/20 transition-transform group-hover:scale-105">
            <Image
              src="/images/AERO_SENSEE.jpg"
              alt="AeroSense Logo"
              fill
              className="object-contain"
              priority
            />
          </div>

          <div className="leading-tight">
            <div className="text-[1.05rem] font-semibold tracking-tight text-white">
              AeroSense
            </div>
            <div className="text-[0.7rem] font-medium text-white/70">
              IoT Air Quality Monitor
            </div>
          </div>
        </Link>

        {/* ── Nav ── */}
        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map(({ id, label, icon }) => (
            <a
              key={id}
              href={`#${id}`}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60",
                activeTab === id
                  ? "bg-white/95 text-sky-700 shadow-sm"
                  : "text-white/90 hover:bg-white/15 hover:text-white"
              )}
            >
              {icon}
              <span className="hidden sm:inline">{label}</span>
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}