"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Info, History, Wind } from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "home" | "history" | "about";
const TABS: Tab[] = ["home", "history", "about"];

function useActiveSection(ids: Tab[]) {
  const [active, setActive] = React.useState<Tab>("home");

  // initial: if user opens /#about etc.
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
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];

        if (visible?.target?.id) {
          const id = visible.target.id as Tab;
          setActive(id);

          // keep URL hash synced (optional, but feels like GitHub)
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

  const activeBtn = "rounded-full bg-white/95 px-4 text-sky-700 hover:bg-white";
  const ghostBtn =
    "rounded-full px-4 text-white hover:bg-white/10 hover:text-white";

  const NavBtn = ({
    id,
    label,
    icon,
  }: {
    id: Tab;
    label: string;
    icon: React.ReactNode;
  }) => (
    <Button asChild size="sm" className={cn(activeTab === id ? activeBtn : ghostBtn)}>
      <a href={`#${id}`} className="flex items-center gap-2">
        {icon}
        {label}
      </a>
    </Button>
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-cyan-600 to-sky-600 text-white shadow">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-white/95 shadow-sm">
            <Image
              src="/images/AERO_SENSEE.jpg"
              alt="AeroSense Logo"
              fill
              className="object-contain"
              priority
            />
          </div>

          <div className="leading-tight">
            <div className="text-xl font-semibold tracking-tight">AeroSense</div>
            <div className="text-xs text-white/80">IoT Air Quality Monitor</div>
          </div>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-2">
          <NavBtn id="home" label="Home" icon={<Wind className="h-4 w-4" />} />
          <NavBtn
            id="history"
            label="Data History"
            icon={<History className="h-4 w-4" />}
          />
          <NavBtn
            id="about"
            label="About Us"
            icon={<Info className="h-4 w-4" />}
          />
        </nav>
      </div>
    </header>
  );
}
