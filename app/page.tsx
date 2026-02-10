import TopNav from "@/components/TopNav";

import HomeSection from "./sections/HomeSection";
import HistorySection from "./sections/HistorySection";
import AboutSection from "./sections/AboutSection";

export default function Page() {
  return (
    <>
      <TopNav />

      <main className="mx-auto w-full max-w-6xl px-4 py-8">
        <div className="space-y-16">
          <section id="home" className="scroll-mt-24">
            <HomeSection />
          </section>

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
