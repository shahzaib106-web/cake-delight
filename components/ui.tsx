"use client";
/** Shared UI: logo, motion primitives, section headings, product card */
import Link from "next/link";
import { motion } from "framer-motion";
import AddShoppingCartRoundedIcon from "@mui/icons-material/AddShoppingCartRounded";
import { useCart } from "./cart";
import { useToast } from "./toast";
import { rs, stars, CATS, type Product } from "@/lib/types";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <svg className="h-11 w-11 shrink-0" viewBox="0 0 64 64" fill="none" aria-hidden>
        <rect x="2" y="2" width="60" height="60" rx="18" fill="#e63c64" />
        <path d="M18 44v-9a2.5 2.5 0 0 1 2.5-2.5h23A2.5 2.5 0 0 1 46 35v9" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
        <path d="M16 44c0-1.4 1.6-2.5 3.5-2.5S23 42.6 23 44s1.6 2.5 3.5 2.5S30 45.4 30 44s1.6-2.5 3.5-2.5S37 42.6 37 44s1.6 2.5 3.5 2.5S44 45.4 44 44" stroke="#ffd9e2" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M25 28.5v-6M32 26.5v-6M39 28.5v-6" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
        <circle cx="25" cy="12.5" r="1.4" fill="#ffd9e2" /><circle cx="32" cy="10.5" r="1.4" fill="#ffd9e2" /><circle cx="39" cy="12.5" r="1.4" fill="#ffd9e2" />
      </svg>
      <span className="leading-none">
        <span className={`font-display text-[25px] font-extrabold tracking-tight ${light ? "text-white" : "text-choco"}`}>
          Cake<span className="text-pink">Delight</span>
        </span>
        <span className={`mt-0.5 block pl-[3px] text-2xs font-semibold uppercase tracking-[0.34em] ${light ? "text-white/50" : "text-mut"}`}>Sahiwal</span>
      </span>
    </span>
  );
}

export function Reveal({ children, delay = 0, className = "", y = 28 }: { children: React.ReactNode; delay?: number; className?: string; y?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.62, ease: [0.21, 0.65, 0.35, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHead({ eyebrow, title, sub }: { eyebrow: string; title: React.ReactNode; sub?: string }) {
  return (
    <Reveal className="mx-auto mb-12 max-w-2xl text-center">
      <span className="mb-3 inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.22em] text-pink">
        <i className="h-px w-7 bg-pink/60" /> {eyebrow} <i className="h-px w-7 bg-pink/60" />
      </span>
      <h2 className="font-display text-3xl font-bold text-choco sm:text-4xl">{title}</h2>
      {sub && <p className="mt-3 text-base text-mut">{sub}</p>}
    </Reveal>
  );
}

export function Script({ children }: { children: React.ReactNode }) {
  return <span className="font-script text-[1.16em] text-pink">{children}</span>;
}

export function ProductCard({ p, index = 0 }: { p: Product; index?: number }) {
  const cart = useCart();
  const toast = useToast();
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.06, 0.4) }}
      whileHover={{ y: -7 }}
      className="group flex flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-card transition-shadow hover:shadow-soft"
    >
      <Link href={`/product/${p.id}`} className="relative block aspect-[1/0.9] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]" />
        {p.badge ? (
          <span className={`absolute left-3.5 top-3.5 rounded-full px-3 py-1 text-2xs font-semibold uppercase tracking-wider text-white ${p.badge === "Premium" ? "bg-gold" : "bg-pink"}`}>{p.badge}</span>
        ) : null}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-5 pb-5">
        <div className="flex items-center justify-between text-xs text-mut">
          <span className="rounded-full bg-pinkfaint px-2.5 py-0.5 text-2xs font-semibold uppercase tracking-wider text-pink">{CATS[p.category] || p.category}</span>
          <span className="tracking-wider text-[#f5b73d]">{stars(p.rating)} <span className="text-mut">({p.reviews})</span></span>
        </div>
        <h3 className="font-display text-lg font-bold leading-snug text-choco transition-colors group-hover:text-pink">
          <Link href={`/product/${p.id}`}>{p.name}</Link>
        </h3>
        <div className="mt-auto flex items-center justify-between pt-2.5">
          <span className="font-display text-xl font-extrabold tnum text-choco">{rs(p.price)}<span className="font-body text-2xs font-medium text-mut"> /2lb</span></span>
          <button
            onClick={() => { cart.add({ product_id: p.id, name: p.name, image: p.image, price: p.price, qty: 1, size: "2 lb", flavor: "", message: "" }); toast.show(`${p.name} added to cart!`); }}
            className="inline-flex items-center gap-1.5 rounded-full bg-pinkfaint px-4 py-2 text-xs font-semibold text-pink transition hover:bg-pink hover:text-white"
          >
            <AddShoppingCartRoundedIcon sx={{ fontSize: 15 }} /> Add
          </button>
        </div>
      </div>
    </motion.article>
  );
}
