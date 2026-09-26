"use client";
/** Flavors page */
import { useEffect, useState } from "react";
import Link from "next/link";
import { Reveal, SectionHead } from "@/components/ui";
import type { Flavor } from "@/lib/types";

const EMOJI: Record<string, string> = { classic: "🍫", premium: "👑", fruity: "🍓" };

export default function FlavorsPage() {
  const [flavors, setFlavors] = useState<Flavor[] | null>(null);
  useEffect(() => { fetch("/api/flavors").then((r) => r.json()).then(setFlavors).catch(() => setFlavors([])); }, []);

  return (
    <>
      <section className="bg-gradient-to-b from-blush to-cream py-16 text-center">
        <div className="mx-auto max-w-2xl px-6">
          <nav className="mb-4 text-sm text-mut"><Link href="/" className="hover:text-pink">Home</Link> › <span>Flavors</span></nav>
          <h1 className="font-display text-4xl font-extrabold text-choco sm:text-5xl">Pick a <span className="font-script text-pink">Flavor</span></h1>
          <p className="mt-3 text-mut">Explore our delicious flavors — handcrafted fresh with premium ingredients</p>
        </div>
      </section>
      <section className="py-14">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(255px,1fr))] gap-5">
            {(flavors || []).map((f, i) => (
              <Reveal key={f.id} delay={Math.min(i * 0.05, 0.4)}>
                <div className="group relative h-full overflow-hidden rounded-3xl border border-line bg-white p-6 shadow-card transition hover:-translate-y-1.5 hover:shadow-soft">
                  <i className="absolute -right-10 -top-10 h-[110px] w-[110px] rounded-full bg-pinkfaint transition-transform duration-500 group-hover:scale-160" />
                  <span className="relative grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-pink to-[#f0899f] text-2xl shadow-[0_8px_18px_rgba(230,60,100,.3)]">{EMOJI[f.tag] || "🍰"}</span>
                  <h3 className="relative mt-4 font-display text-xl font-bold text-choco">{f.name}</h3>
                  <p className="relative mt-1.5 text-sm text-mut">{f.description}</p>
                  <span className="relative mt-3 inline-block rounded-full bg-pinkfaint px-3 py-1 text-2xs font-semibold uppercase tracking-wider text-pink">{f.tag} flavor</span>
                </div>
              </Reveal>
            ))}
          </div>
          {flavors && flavors.length === 0 && <p className="py-16 text-center text-mut">No flavors available right now.</p>}
          <div className="mt-14 text-center">
            <SectionHead eyebrow="" title={<>Found your favorite? <span className="font-script text-pink">Let&apos;s bake it!</span></>} />
            <Link href="/custom" className="rounded-full bg-pink px-8 py-4 font-semibold text-white shadow-[0_8px_22px_rgba(230,60,100,.32)] transition hover:-translate-y-0.5 hover:bg-pink2">Build Custom Cake →</Link>
          </div>
        </div>
      </section>
    </>
  );
}
