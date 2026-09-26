/** About page */
import Link from "next/link";
import { Reveal, SectionHead } from "@/components/ui";

export default function AboutPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-blush to-cream py-16 text-center">
        <div className="mx-auto max-w-2xl px-6">
          <nav className="mb-4 text-sm text-mut"><Link href="/" className="hover:text-pink">Home</Link> › <span>About</span></nav>
          <h1 className="font-display text-4xl font-extrabold text-choco sm:text-5xl">Our <span className="font-script text-pink">Story</span></h1>
          <p className="mt-3 text-mut">From a home kitchen in Sahiwal to your happiest moments</p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 lg:grid-cols-2">
          <Reveal className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/hero-cake.png" alt="Custom cake by Cake Delight" className="aspect-[1/0.95] w-full rounded-3xl border-10 border-white object-cover shadow-pop" />
            <div className="absolute -right-3.5 -top-4 grid h-[120px] w-[120px] rotate-6 place-items-center rounded-full bg-pink text-center text-white shadow-pop">
              <span><b className="block font-display text-3xl leading-none">7+</b><small className="text-2xs uppercase tracking-wider">Years of baking</small></span>
            </div>
            <div className="absolute -left-5 bottom-6 flex items-center gap-3 rounded-2xl bg-white p-3.5 px-5 shadow-pop">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-pinkfaint text-xl text-pink">💖</span>
              <span><b className="block font-display text-[22px] leading-tight text-choco">500+</b><small className="block text-xs font-medium leading-tight text-mut">Happy Customers<br />in Sahiwal</small></span>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <span className="mb-3 inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.22em] text-pink"><i className="h-px w-7 bg-pink/60" /> About Cake Delight <i className="h-px w-7 bg-pink/60" /></span>
            <h2 className="font-display text-3xl font-bold text-choco sm:text-[38px]">Baking Happiness Into Every <span className="font-script text-pink">Celebration</span></h2>
            <p className="mt-5 text-mut">Cake Delight began as a small home bakery with one simple belief — every celebration deserves a cake that tastes as beautiful as it looks. Today, we&apos;re proud to be one of Sahiwal&apos;s most-loved custom cake shops, crafting 500+ cakes a year for birthdays, weddings, anniversaries and every happy moment in between.</p>
            <p className="mt-4 text-mut">Every cake is baked fresh to order with premium ingredients — Belgian chocolate, fresh dairy butter and farm eggs. No shortcuts, no compromises. Just handcrafted goodness, delivered with a smile.</p>
            <div className="mt-7 flex flex-wrap gap-3.5">
              <Link href="/gallery" className="rounded-full bg-pink px-7 py-3 font-semibold text-white shadow-[0_8px_22px_rgba(230,60,100,.32)] transition hover:-translate-y-0.5 hover:bg-pink2">View Our Cakes</Link>
              <Link href="/contact" className="rounded-full border-2 border-pink px-7 py-3 font-semibold text-pink transition hover:bg-pink hover:text-white">Get in Touch</Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-blush py-16">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHead eyebrow="Why Choose Us" title="The Cake Delight Promise" />
          <div className="grid gap-5 md:grid-cols-3">
            {[
              ["🎨", "100% Custom Designs", "Every cake is designed around your idea, theme and colors — no two cakes are ever the same."],
              ["⭐", "Premium Ingredients", "Belgian chocolate, fresh dairy and natural flavorings — quality you can taste in every bite."],
              ["🚚", "Same-Day Delivery", "Fresh cakes at your doorstep — on time and in perfect condition, anywhere in Sahiwal."],
            ].map(([e, t, d], i) => (
              <Reveal key={t} delay={i * 0.1}>
                <div className="h-full rounded-3xl border border-line bg-white p-8 text-center shadow-card transition hover:-translate-y-1.5 hover:shadow-soft">
                  <span className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-pinkfaint to-pinksoft text-3xl">{e}</span>
                  <h3 className="font-display text-xl font-bold text-choco">{t}</h3>
                  <p className="mt-2 text-sm text-mut">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <SectionHead eyebrow="Milestones" title="Sweet Numbers" />
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[["500+", "Happy Customers"], ["100+", "Custom Designs"], ["12", "Delicious Flavors"], ["4.9★", "Average Rating"]].map(([b, s], i) => (
              <Reveal key={b} delay={i * 0.08}>
                <div className="rounded-2xl border border-line bg-white p-6 shadow-card">
                  <b className="block font-display text-3xl text-pink">{b}</b>
                  <small className="text-xs font-medium text-mut">{s}</small>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
