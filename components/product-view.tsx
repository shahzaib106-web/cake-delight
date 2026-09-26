"use client";
/** Product detail — size pricing, flavor, message, qty, add to cart */
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import AddShoppingCartRoundedIcon from "@mui/icons-material/AddShoppingCartRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import { useCart } from "./cart";
import { useToast } from "./toast";
import { ProductCard, Reveal } from "./ui";
import { rs, stars, CATS, type Product, type Flavor } from "@/lib/types";

export default function ProductView({ detail, flavors }: { detail: { product: Product; sizes: { size: string; price: number }[]; related: Product[] }; flavors: Flavor[] }) {
  const { product: p, sizes, related } = detail;
  const [size, setSize] = useState("2 lb");
  const [flavor, setFlavor] = useState("");
  const [msg, setMsg] = useState("");
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("desc");
  const cart = useCart();
  const toast = useToast();
  const router = useRouter();
  const price = sizes.find((s) => s.size === size)?.price ?? p.price;

  const addToCart = () => {
    cart.add({ product_id: p.id, name: p.name, image: p.image, price, qty, size, flavor, message: msg.trim() });
    toast.show(`${p.name} added to cart!`);
  };

  return (
    <section className="py-10">
      <div className="mx-auto max-w-6xl px-6">
        <nav className="mb-7 text-sm text-mut"><Link href="/" className="hover:text-pink">Home</Link> › <Link href="/gallery" className="hover:text-pink">Gallery</Link> › <span>{p.name}</span></nav>

        <div className="grid items-start gap-12 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
            className="sticky top-24 overflow-hidden rounded-3xl border-8 border-white shadow-soft">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.image} alt={p.name} className="aspect-[1/0.94] w-full object-cover" />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <span className="mb-3.5 inline-block rounded-full bg-pinkfaint px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-pink">{CATS[p.category] || p.category}</span>
            <h1 className="font-display text-3xl font-extrabold text-choco sm:text-[38px]">{p.name}</h1>
            <div className="mt-3 flex items-center gap-2.5 text-sm text-mut">
              <span className="tracking-wider text-[#f5b73d]">{stars(p.rating)}</span> <b className="text-ink">{Number(p.rating).toFixed(1)}</b> · {p.reviews} reviews · <span className="text-[#3fae6a]">In Stock</span>
            </div>
            <div className="mt-4 font-display text-4xl font-extrabold text-choco">
              {rs(price)} <span className="font-body text-sm font-medium text-mut">incl. box &amp; candles</span>
            </div>
            <p className="mt-3.5 text-base text-mut">{p.description}</p>

            <div className="mt-7">
              <label className="mb-2.5 block text-sm font-semibold text-choco">Size / Servings</label>
              <div className="flex flex-wrap gap-2.5">
                {sizes.map((s) => (
                  <button key={s.size} onClick={() => setSize(s.size)}
                    className={`rounded-2xl border-[1.5px] px-4.5 py-2.5 text-center transition ${size === s.size ? "border-pink bg-pinkfaint shadow-[0_0_0_3px_#fdeef2]" : "border-line2 bg-white hover:border-pink"}`}>
                    <b className={`block text-sm ${size === s.size ? "text-pink" : "text-choco"}`}>{s.size}</b>
                    <small className="text-xs text-mut">{rs(s.price)}</small>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2.5 block text-sm font-semibold text-choco">Flavor</label>
                <TextField select label="Select a flavor" value={flavor} onChange={(e) => setFlavor(e.target.value)}>
                  {flavors.map((f) => <MenuItem key={f.id} value={f.name}>{f.name}</MenuItem>)}
                </TextField>
              </div>
              <div>
                <label className="mb-2.5 block text-sm font-semibold text-choco">Message on cake <span className="font-normal text-mut">(optional)</span></label>
                <TextField value={msg} onChange={(e) => setMsg(e.target.value)} slotProps={{ htmlInput: { maxLength: 40 } }} placeholder="e.g. Happy Birthday Ayesha! 🎂" />
              </div>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3.5">
              <div className="flex items-center overflow-hidden rounded-full border-[1.5px] border-line2 bg-white">
                <button className="grid h-11 w-11 place-items-center text-lg text-choco transition hover:bg-pinkfaint hover:text-pink" onClick={() => setQty((v) => Math.max(1, v - 1))}>−</button>
                <b className="min-w-10 text-center text-base">{qty}</b>
                <button className="grid h-11 w-11 place-items-center text-lg text-choco transition hover:bg-pinkfaint hover:text-pink" onClick={() => setQty((v) => Math.min(20, v + 1))}>+</button>
              </div>
              <Button variant="contained" size="large" startIcon={<AddShoppingCartRoundedIcon />} onClick={addToCart}
                sx={{ py: 1.7, px: 3.5, fontSize: 15, boxShadow: "0 8px 22px rgba(230,60,100,.32)" }}>Add to Cart</Button>
              <Button variant="outlined" size="large" startIcon={<BoltRoundedIcon />} onClick={() => { addToCart(); setTimeout(() => router.push("/checkout"), 400); }}
                sx={{ py: 1.7, px: 3, fontSize: 15, borderColor: "#e63c64", color: "#e63c64" }}>Buy Now</Button>
            </div>

            <ul className="mt-7 grid gap-2.5 sm:grid-cols-2">
              {[["🚚", "Same-day delivery in Sahiwal"], ["⭐", "Premium fresh ingredients"], ["🎁", "Free message & candles"], ["💵", "Cash on delivery"]].map(([e, t]) => (
                <li key={t} className="flex items-center gap-2.5 rounded-xl bg-pinkfaint px-3.5 py-3 text-xs font-medium text-choco">{e} {t}</li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* tabs — equal thirds so they never overflow on small phones */}
        <div className="mt-16">
          <div className="grid grid-cols-3 border-b-[1.5px] border-line">
            {[["desc", "Description"], ["ing", "Ingredients"], ["del", "Delivery & Care"]].map(([k, t]) => (
              <button key={k} onClick={() => setTab(k)}
                className={`-mb-[1.5px] border-b-[2.5px] px-1 py-3 text-center text-xs font-semibold transition sm:px-5 sm:text-sm ${tab === k ? "border-pink text-pink" : "border-transparent text-mut hover:text-choco"}`}>
                {t}
              </button>
            ))}
          </div>
          <div className="py-6 text-base leading-relaxed text-mut">
            {tab === "desc" && <p>{p.long_description || p.description}</p>}
            {tab === "ing" && <p>Premium flour, fresh dairy butter, farm eggs, Belgian chocolate &amp; natural flavorings. Please inform us of any allergies while ordering — we offer eggless options on request.</p>}
            {tab === "del" && <p>We deliver fresh across Sahiwal, usually within 4–6 hours for standard cakes (same-day cutoff 2 PM). Custom cakes need 24–48 hours notice. Keep refrigerated and enjoy within 48 hours for the best taste. Cash on delivery available.</p>}
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-10">
            <Reveal className="mb-10 text-center">
              <span className="mb-3 inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.22em] text-pink"><i className="h-px w-7 bg-pink/60" /> You may also love <i className="h-px w-7 bg-pink/60" /></span>
              <h2 className="font-display text-3xl font-bold text-choco">Related Cakes</h2>
            </Reveal>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(228px,1fr))] gap-6">
              {related.map((r, i) => <ProductCard key={r.id} p={r} index={i} />)}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
