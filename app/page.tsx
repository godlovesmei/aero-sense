import TopNav from "@/components/TopNav";

import HomeSection from "./sections/HomeSection";
import HistorySection from "./sections/HistorySection";
import AboutSection from "./sections/AboutSection";

export default function Page() {
  return (
    <>
      <TopNav />

      {/*
        HomeSection renders OUTSIDE the max-width container so the hero
        can stretch full-bleed to the viewport edges. HomeSection manages
        its own inner max-width for the content below the hero.
      */}
      <section id="home" className="scroll-mt-24">
        <HomeSection />
      </section>

      {/* History & About stay inside the constrained container */}
      <main className="mx-auto w-full max-w-6xl px-4 pb-16">
        <div className="space-y-16">
          <section id="history" className="scroll-mt-24">
            <HistorySection />
          </section>

          <section id="about" className="scroll-mt-24">
            <AboutSection />
          </section>
        </div>
      </main>
    </>
  );
}