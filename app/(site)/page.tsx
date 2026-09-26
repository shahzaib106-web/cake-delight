/** Home page — server component, data fetched from the store */
import Link from "next/link";
import Hero from "@/components/hero";
import BestSellers from "@/components/best-sellers";
import { Reveal, SectionHead, Script } from "@/components/ui";
import { listProducts, listTestimonials, getSettings } from "@/lib/store";

const CATS_META = [
  ["birthday", "Birthday Cakes", "Make birthdays extra special"],
  ["wedding", "Wedding Cakes", "Elegant cakes for your big day"],
  ["kids", "Kids Cakes", "Fun designs for little ones"],
  ["anniversary", "Anniversary Cakes", "Celebrate love with sweetness"],
  ["cupcakes", "Cupcakes", "Little treats, big happiness"],
] as const;

const TRUST = [
  ["🎨", "100% Custom Designs", "Your ideas, handcrafted to perfection"],
  ["⭐", "Premium Ingredients", "Belgian chocolate & fresh dairy"],
  ["🚚", "Same-Day Delivery", "Order by 2 PM in Sahiwal"],
  ["💖", "Loved by 500+ Customers", "5-star rated across Sahiwal"],
];

export default async function Home() {
  const [products, testimonials, settings] = await Promise.all([listProducts({}), listTestimonials(), getSettings()]);

  return (
    <>
      <Hero settings={settings} />

      {/* trust strip */}
      <section className="relative z-20 -mt-9">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal className="grid grid-cols-1 overflow-hidden rounded-3xl bg-white shadow-soft sm:grid-cols-2 lg:grid-cols-4">
            {TRUST.map(([em, b, s], i) => (
              <div key={b} className={`flex items-center gap-3.5 px-6 py-6 ${i > 0 ? "relative before:absolute before:inset-y-[26%] before:left-0 before:w-px before:bg-line max-sm:before:hidden sm:before:block" : ""}`}>
                <span className="grid h-[52px] w-[52px] shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-pinkfaint to-pinksoft text-2xl">{em}</span>
                <span><b className="block text-base font-semibold text-choco">{b}</b><small className="text-xs text-mut">{s}</small></span>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* categories */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHead eyebrow="Our Specialties" title={<>Explore Our Cake <Script>Categories</Script></>} sub="Little treats, big happiness — discover cakes for every celebration" />
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-5">
            {CATS_META.map(([key, title, desc], i) => (
              <Reveal key={key} delay={i * 0.07}>
                <Link href={`/gallery?category=${key}`}
                  className="group block overflow-hidden rounded-3xl border border-line bg-white shadow-card transition hover:-translate-y-2 hover:shadow-soft">
                  <div className="relative aspect-[1/0.92] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/img/cat-${key}.jpg`} alt={title} loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.07]" />
                  </div>
                  <div className="p-4 pb-5 text-center">
                    <h3 className="font-display text-lg font-bold text-choco">{title}</h3>
                    <p className="mb-3 mt-1.5 text-xs leading-snug text-mut">{desc}</p>
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-pink">
                      Explore <span className="transition-transform group-hover:translate-x-1">→</span>
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* build custom cake */}
      <section className="bg-blush py-20">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHead eyebrow="How It Works" title={<>Build Your <Script>Custom Cake</Script></>} sub="Create a cake that's uniquely yours in just a few steps" />
          <div className="grid gap-7 md:grid-cols-3">
            {[
              [1, "🎨", "Select Design", "Choose a theme or share your own idea"],
              [2, "🍰", "Pick a Flavor", "Explore our delicious flavors"],
              [3, "✉️", "Add Message & Date", "Personalize with a special message and choose delivery date"],
            ].map(([n, em, t, d], i) => (
              <Reveal key={n as number} delay={i * 0.12}>
                <div className="relative h-full rounded-3xl border border-line bg-white p-8 pt-10 text-center shadow-card transition hover:-translate-y-1.5 hover:shadow-soft">
                  <span className="absolute -top-[18px] left-1/2 grid h-[38px] w-[38px] -translate-x-1/2 place-items-center rounded-full border-[3px] border-blush bg-pink font-bold text-white shadow-[0_6px_16px_rgba(230,60,100,.4)]">{n}</span>
                  <div className="mx-auto mb-4 mt-2 grid h-[74px] w-[74px] place-items-center rounded-full bg-gradient-to-br from-pinkfaint to-pinksoft text-4xl">{em}</div>
                  <h3 className="font-display text-xl font-bold text-choco">{t}</h3>
                  <p className="mt-2 text-sm text-mut">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-11 text-center" delay={0.2}>
            <Link href="/custom" className="rounded-full bg-pink px-8 py-4 text-base font-semibold text-white shadow-[0_8px_22px_rgba(230,60,100,.32)] transition hover:-translate-y-0.5 hover:bg-pink2">
              Start Building Your Cake →
            </Link>
          </Reveal>
        </div>
      </section>

      {/* best sellers */}
      <BestSellers products={products} />

      {/* event band */}
      <section className="bg-cream py-20">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <div className="relative grid gap-12 overflow-hidden rounded-[32px] bg-gradient-to-br from-choco to-choco2 px-8 py-14 text-[#f4e3dc] md:px-14 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
              <i className="absolute -right-24 -top-24 h-[300px] w-[300px] rounded-full border-[34px] border-pink/[0.16]" />
              <i className="absolute -bottom-28 -left-16 h-[260px] w-[260px] rounded-full bg-pink/[0.09]" />
              <div className="relative z-10">
                <span className="mb-3 inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.22em] text-[#f7a8bd]">
                  <i className="h-px w-7 bg-[#f7a8bd]/60" /> Custom Orders <i className="h-px w-7 bg-[#f7a8bd]/60" />
                </span>
                <h2 className="font-display text-3xl font-bold text-white sm:text-[38px]">
                  Custom Orders for <span className="font-script text-[1.16em] text-[#f7a8bd]">Every Occasion</span>
                </h2>
                <p className="mt-3.5 max-w-[430px] text-base text-[#e8cdc4]">
                  Birthdays, weddings, anniversaries, aqeeqah, corporate events &amp; more — we craft cakes that make your big day unforgettable with our bespoke cake designs.
                </p>
                <ul className="mt-6 grid gap-3.5">
                  <li className="flex items-start gap-3.5 text-sm text-[#f0d9d2]">
                    <span className="grid h-[38px] w-[38px] shrink-0 place-items-center rounded-xl bg-pink/20 text-lg">🎂</span>
                    <span><b className="font-semibold text-white">Event Cakes in Sahiwal</b><br />Grand multi-tier cakes designed around your theme &amp; colors</span>
                  </li>
                  <li className="flex items-start gap-3.5 text-sm text-[#f0d9d2]">
                    <span className="grid h-[38px] w-[38px] shrink-0 place-items-center rounded-xl bg-pink/20 text-lg">🚚</span>
                    <span><b className="font-semibold text-white">Local Delivery in Sahiwal</b><br />Fresh cakes delivered on time and in perfect condition</span>
                  </li>
                </ul>
                <Link href="/custom" className="mt-7 inline-flex rounded-full bg-pink px-7 py-3.5 text-base font-semibold text-white shadow-[0_8px_22px_rgba(230,60,100,.4)] transition hover:-translate-y-0.5 hover:bg-pink2">
                  Order a Custom Cake →
                </Link>
              </div>
              <div className="relative z-10 grid grid-cols-2 gap-4">
                {[["500+", "Happy Customers in Sahiwal"], ["4.9★", "Average Rating"], ["100+", "Custom Designs Made"], ["Same-Day", "Delivery Available"]].map(([b, s], i) => (
                  <Reveal key={b} delay={i * 0.1}>
                    <div className="rounded-2xl border border-white/[0.13] bg-white/[0.07] p-5 text-center backdrop-blur transition hover:-translate-y-1 hover:bg-white/[0.12]">
                      <b className="block font-display text-3xl text-white">{b}</b>
                      <small className="text-xs font-medium text-[#e8cdc4]">{s}</small>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* testimonials */}
      <section className="bg-blush py-20">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHead eyebrow="Testimonials" title={<>What Our <Script>Customers Say</Script></>} sub="Real words from real celebrations across Sahiwal" />
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.slice(0, 3).map((t, i) => (
              <Reveal key={t.id} delay={i * 0.1}>
                <div className="relative h-full rounded-3xl border border-line bg-white p-8 shadow-card transition hover:-translate-y-1.5 hover:shadow-soft">
                  <span className="absolute right-6 top-5 font-display text-[74px] leading-[0.6] text-pinksoft">”</span>
                  <span className="mb-3.5 block text-sm tracking-[1.5px] text-[#f5b73d]">{"★".repeat(t.rating)}</span>
                  <p className="mb-6 min-h-[66px] text-base text-ink/85">{t.text}</p>
                  <div className="flex items-center gap-3.5">
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-pink to-[#f0899f] font-display text-base font-bold text-white">
                      {t.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                    </span>
                    <span><b className="block text-base text-choco">{t.name}</b><small className="text-xs text-mut">📍 {t.location}</small></span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-16 text-center">
        <Reveal>
          <h2 className="font-display text-3xl font-bold text-choco sm:text-4xl">Ready to order your <Script>dream cake?</Script></h2>
          <p className="mt-2.5 text-mut">Call us, WhatsApp us, or build your custom cake online in minutes.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3.5">
            <Link href="/custom" className="rounded-full bg-pink px-8 py-4 font-semibold text-white shadow-[0_8px_22px_rgba(230,60,100,.32)] transition hover:-translate-y-0.5 hover:bg-pink2">Build Custom Cake</Link>
            <a href={`https://wa.me/${settings.whatsapp_number}`} className="rounded-full bg-choco px-8 py-4 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#2b1a16]">💬 WhatsApp {settings.contact_phone}</a>
          </div>
        </Reveal>
      </section>
    </>
  );
}
