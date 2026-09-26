"use client";
/** Animated hero — left copy (all text admin-editable), right visual with floating stat cards */
import Link from "next/link";
import { motion } from "framer-motion";

const fadeUp = (d: number) => ({
  initial: { opacity: 0, y: 26 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay: d, ease: [0.21, 0.65, 0.35, 1] as const },
});

export default function Hero({ settings }: { settings: Record<string, string> }) {
  const points = String(settings.hero_points || "").split("|").map((s) => s.trim()).filter(Boolean);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-cream to-cream2">
      <i className="absolute -right-32 -top-36 h-[480px] w-[480px] rounded-full bg-pinksoft/50 blur-3xl" />
      <i className="absolute -bottom-32 -left-28 h-[340px] w-[340px] rounded-full bg-blush2/60 blur-3xl" />
      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-14 px-6 pb-[70px] pt-[76px] lg:grid-cols-[1.05fr_.95fr]">
        <div>
          <motion.span {...fadeUp(0)}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-line2 bg-white px-4.5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-pink shadow-card">
            <i className="h-[7px] w-[7px] animate-pulse rounded-full bg-pink" /><span>{settings.hero_badge}</span>
          </motion.span>
          <motion.h1 {...fadeUp(0.1)} className="font-display text-[clamp(38px,4.6vw,60px)] font-extrabold leading-[1.13] text-choco">
            {settings.hero_title_1}
            <br /> for Your <span className="font-script inline-block -rotate-2 text-[1.16em] text-pink">{settings.hero_title_2}</span>
          </motion.h1>
          <motion.p {...fadeUp(0.2)} className="mt-5 max-w-[520px] text-md text-mut">
            {settings.hero_sub}
          </motion.p>
          <motion.div {...fadeUp(0.3)} className="mt-7 flex flex-wrap items-center gap-5">
            <Link href="/gallery"
              className="rounded-full bg-pink px-8 py-4 text-base font-semibold text-white shadow-[0_8px_22px_rgba(230,60,100,.32)] transition hover:-translate-y-0.5 hover:bg-pink2 hover:shadow-[0_12px_28px_rgba(230,60,100,.4)]">
              View Our Gallery →
            </Link>
            <div>
              <div className="text-base tracking-[2px] text-[#f5b73d]">★★★★★</div>
              <small className="text-xs font-medium text-mut"><b className="text-choco">5.0 rated</b> · 500+ happy customers</small>
            </div>
          </motion.div>
          <motion.ul {...fadeUp(0.4)} className="mt-9 flex flex-wrap gap-6 text-sm font-medium text-choco">
            {points.map((t) => (
              <li key={t} className="flex items-center gap-2"><span className="text-pink">✔</span> {t}</li>
            ))}
          </motion.ul>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.25 }}
          className="relative mx-auto w-full max-w-[480px]">
          <div className="relative aspect-[0.92] -rotate-2 overflow-hidden rounded-[46%_46%_46%_46%/42%_42%_44%_44%] border-10 border-white shadow-pop">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/hero-cake.jpg" alt="Custom celebration cake by Cake Delight Sahiwal" fetchPriority="high" decoding="async" className="h-full w-full object-cover" />
          </div>
          <i className="absolute -left-11 -bottom-4 -z-10 h-[150px] w-[150px] opacity-30"
            style={{ backgroundImage: "radial-gradient(#e63c64 2.4px, transparent 2.4px)", backgroundSize: "22px 22px" }} />
          <motion.div animate={{ y: [0, -11, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-3.5 top-6 flex items-center gap-3 rounded-2xl bg-white p-3.5 px-5 shadow-pop">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-pinkfaint text-xl text-pink">❤</span>
            <span><b className="block font-display text-[22px] leading-tight text-choco">500+</b>
              <small className="block text-xs font-medium leading-tight text-mut">Happy Customers<br />in Sahiwal</small></span>
          </motion.div>
          <motion.div animate={{ y: [0, -11, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 2.2 }}
            className="absolute -left-6 bottom-7 flex items-center gap-3 rounded-2xl bg-white p-3.5 px-5 shadow-pop">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-pinkfaint text-xl text-pink">🚚</span>
            <span><b className="block font-display text-[22px] leading-tight text-choco">Same-Day</b>
              <small className="block text-xs font-medium leading-tight text-mut">Delivery Available<br />Fresh at your doorstep</small></span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
