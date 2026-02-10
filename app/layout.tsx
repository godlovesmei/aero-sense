import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AeroSense",
  description: "IoT Air Quality Monitor",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={cn(inter.className, "min-h-screen bg-[#EAF7FF] text-slate-900")}>
        {children}
      </body>
    </html>
  );
}
