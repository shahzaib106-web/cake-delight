"use client";
/** Gallery — live search, category filters, sorting */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import MenuItem from "@mui/material/MenuItem";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCard, SectionHead } from "@/components/ui";
import { CATS, type Product } from "@/lib/types";

function GalleryInner() {
  const params = useSearchParams();
  const [cat, setCat] = useState(params.get("category") || "all");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("popular");
  const [products, setProducts] = useState<Product[] | null>(null);
  const debRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(async (c: string, s: string, query: string) => {
    const qs = new URLSearchParams();
    if (c !== "all") qs.set("category", c);
    if (query) qs.set("q", query);
    if (s !== "popular") qs.set("sort", s);
    const r = await fetch(`/api/products?${qs}`);
    setProducts(await r.json());
  }, []);

  useEffect(() => { load(cat, sort, q); }, [cat, sort, load]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (debRef.current) clearTimeout(debRef.current);
    debRef.current = setTimeout(() => load(cat, sort, q), 300);
  }, [q]); // eslint-disable-line react-hooks/exhaustive-deps

  const cats = useMemo(() => Object.keys(CATS), []);

  return (
    <>
      <section className="bg-gradient-to-b from-blush to-cream py-16 text-center">
        <div className="mx-auto max-w-2xl px-6">
          <nav className="mb-4 text-sm text-mut"><a href="/" className="hover:text-pink">Home</a> › <span>Gallery</span></nav>
          <h1 className="font-display text-4xl font-extrabold text-choco sm:text-5xl">Our Cake <span className="font-script text-pink">Gallery</span></h1>
          <p className="mx-auto mt-3 max-w-[560px] text-mut">Beautifully designed, deliciously made — browse all our cakes and find the one made for your moment.</p>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-9 flex flex-wrap items-center gap-3.5">
            <TextField
              placeholder="Search cakes… e.g. chocolate, unicorn"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              sx={{ flex: "1 1 230px", maxWidth: 380, "& .MuiOutlinedInput-root": { borderRadius: 99, background: "#fff" } }}
              slotProps={{ input: { startAdornment: (<InputAdornment position="start"><SearchRoundedIcon sx={{ color: "#7d6a63" }} /></InputAdornment>) } }}
            />
            <span className="text-sm font-medium text-mut">{products ? `${products.length} cake${products.length === 1 ? "" : "s"} found` : ""}</span>
            <TextField select label="Sort" value={sort} onChange={(e) => setSort(e.target.value)} sx={{ maxWidth: 210, "& .MuiOutlinedInput-root": { borderRadius: 99, background: "#fff" } }}>
              <MenuItem value="popular">Most Popular</MenuItem>
              <MenuItem value="rating">Top Rated</MenuItem>
              <MenuItem value="price-asc">Price: Low to High</MenuItem>
              <MenuItem value="price-desc">Price: High to Low</MenuItem>
            </TextField>
          </div>
          <div className="mb-8 flex flex-wrap gap-2.5">
            {cats.map((c) => (
              <button key={c} onClick={() => setCat(c)}
                className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${cat === c ? "bg-pink text-white shadow-[0_6px_16px_rgba(230,60,100,.3)]" : "border-[1.5px] border-line2 bg-white text-ink hover:border-pink hover:text-pink"}`}>
                {CATS[c]}
              </button>
            ))}
          </div>

          {products === null ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(228px,1fr))] gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-3xl border border-line bg-white">
                  <div className="aspect-[1/0.9] rounded-t-3xl bg-cream2" />
                  <div className="space-y-2.5 p-5"><div className="h-3.5 w-2/3 rounded bg-cream2" /><div className="h-3 w-1/2 rounded bg-cream2" /><div className="h-9 w-full rounded-full bg-cream2" /></div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="py-16 text-center">
              <span className="mb-3 block text-6xl">🔍</span>
              <h3 className="font-display text-2xl text-choco">No cakes found</h3>
              <p className="mt-1.5 text-mut">Try a different search or category</p>
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-[repeat(auto-fill,minmax(228px,1fr))] gap-6">
              <AnimatePresence mode="popLayout">
                {products.map((p, i) => <ProductCard key={p.id} p={p} index={i} />)}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}

export default function GalleryPage() {
  return <Suspense><GalleryInner /></Suspense>;
}
