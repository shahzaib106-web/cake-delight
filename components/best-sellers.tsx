"use client";
/** Best sellers — filter pills + animated product grid */
import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { ProductCard, SectionHead } from "./ui";
import { CATS, type Product } from "@/lib/types";

export default function BestSellers({ products }: { products: Product[] }) {
  const [cat, setCat] = useState("all");
  const cats = ["all", "birthday", "wedding", "kids", "anniversary", "cupcakes"];
  const list = cat === "all" ? products.filter((p) => p.bestseller) : products.filter((p) => p.category === cat);

  return (
    <section className="py-12 sm:py-14 lg:py-16">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHead eyebrow="Customer Favorites" title={<>Our <span className="font-script text-pink">Best Sellers</span></>} sub="The most-loved cakes across Sahiwal — freshly baked every day" />
        <div className="mb-10 flex flex-wrap justify-center gap-2.5">
          {cats.map((c) => (
            <button key={c} onClick={() => setCat(c)}
              className={`relative rounded-full px-5 py-2.5 text-sm font-medium transition ${
                cat === c ? "text-white" : "border-[1.5px] border-line2 bg-white text-ink hover:border-pink hover:text-pink"}`}>
              {cat === c && (
                <motion.span layoutId="pill" className="absolute inset-0 rounded-full bg-pink shadow-[0_6px_16px_rgba(230,60,100,.3)]" transition={{ type: "spring", stiffness: 400, damping: 32 }} />
              )}
              <span className="relative z-10">{CATS[c]}</span>
            </button>
          ))}
        </div>
        <motion.div layout className="grid grid-cols-[repeat(auto-fill,minmax(228px,1fr))] gap-6">
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => <ProductCard key={p.id} p={p} index={i} />)}
          </AnimatePresence>
        </motion.div>
        <div className="mt-11 text-center">
          <Link href="/gallery"
            className="inline-flex items-center gap-2 rounded-full border-2 border-pink px-8 py-3.5 text-base font-semibold text-pink transition hover:bg-pink hover:text-white">
            View All Cakes <ArrowForwardRoundedIcon sx={{ fontSize: 18 }} />
          </Link>
        </div>
      </div>
    </section>
  );
}
