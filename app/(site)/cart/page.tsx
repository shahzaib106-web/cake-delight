"use client";
/** Cart page */
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import Button from "@mui/material/Button";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import ShoppingBagRoundedIcon from "@mui/icons-material/ShoppingBagRounded";
import { useCart } from "@/components/cart";
import { rs } from "@/lib/types";

export default function CartPage() {
  const cart = useCart();

  return (
    <>
      <section className="bg-gradient-to-b from-blush to-cream py-12 sm:py-14 text-center">
        <div className="mx-auto max-w-2xl px-6">
          <nav className="mb-4 text-sm text-mut"><Link href="/" className="hover:text-pink">Home</Link> › <span>Cart</span></nav>
          <h1 className="font-display text-4xl font-extrabold text-choco">Your <span className="font-script text-pink">Cart</span></h1>
        </div>
      </section>

      <section className="py-10 sm:py-12">
        <div className="mx-auto max-w-6xl px-6">
          {!cart.ready ? (
            <div className="py-16 text-center text-mut">Loading your cart…</div>
          ) : cart.items.length === 0 ? (
            <div className="py-16 text-center">
              <span className="mb-3 block text-6xl">🛒</span>
              <h2 className="font-display text-2xl text-choco">Your cart is empty</h2>
              <p className="mt-1.5 text-mut">Let&apos;s fix that — delicious cakes are waiting!</p>
              <Link href="/gallery" className="mt-5 inline-flex rounded-full bg-pink px-7 py-3 font-semibold text-white shadow-[0_8px_22px_rgba(230,60,100,.3)] transition hover:bg-pink2">Browse Cakes</Link>
            </div>
          ) : (
            <div className="grid items-start gap-8 lg:grid-cols-[1.6fr_.9fr]">
              <div className="space-y-4">
                <AnimatePresence>
                  {cart.items.map((i) => (
                    <motion.div key={i.key} layout initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -60 }}
                      className="grid grid-cols-[72px_1fr] items-center gap-4 rounded-2xl border border-line bg-white p-4 shadow-card sm:grid-cols-[96px_1fr_auto]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={i.image} alt={i.name} className="h-[88px] w-full rounded-xl object-cover sm:w-24" />
                      <div>
                        <div className="font-display text-lg font-bold text-choco">{i.name}</div>
                        <div className="mt-1 mb-2 flex flex-wrap gap-2 text-xs text-mut">
                          <span className="rounded-full bg-cream2 px-2.5 py-0.5">{i.size}</span>
                          {i.flavor && <span className="rounded-full bg-cream2 px-2.5 py-0.5">{i.flavor}</span>}
                          {i.message && <span className="rounded-full bg-cream2 px-2.5 py-0.5">“{i.message}”</span>}
                        </div>
                        <div className="inline-flex items-center overflow-hidden rounded-full border-[1.5px] border-line2">
                          <button className="grid h-9 w-9 place-items-center text-choco transition hover:bg-pinkfaint hover:text-pink" onClick={() => cart.updateQty(i.key, i.qty - 1)}>−</button>
                          <b className="min-w-9 text-center text-sm">{i.qty}</b>
                          <button className="grid h-9 w-9 place-items-center text-choco transition hover:bg-pinkfaint hover:text-pink" onClick={() => cart.updateQty(i.key, i.qty + 1)}>+</button>
                        </div>
                      </div>
                      <div className="col-span-2 flex flex-row items-center justify-between sm:col-span-1 sm:flex-col sm:items-end">
                        <span className="font-display text-lg font-extrabold text-choco">{rs(i.price * i.qty)}</span>
                        <button onClick={() => cart.remove(i.key)} className="inline-flex items-center gap-1.5 text-xs text-mut transition hover:text-[#e05252]">
                          <DeleteOutlineRoundedIcon sx={{ fontSize: 15 }} /> Remove
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <aside className="sticky top-24 rounded-3xl border border-line bg-white p-7 shadow-soft">
                <h3 className="mb-5 font-display text-xl font-bold text-choco">Order Summary</h3>
                {cart.subtotal < 3000 ? (
                  <div className="mb-4 rounded-xl bg-pinkfaint px-3.5 py-2.5 text-center text-xs font-semibold text-pink">🚚 Add {rs(3000 - cart.subtotal)} more for FREE delivery!</div>
                ) : (
                  <div className="mb-4 rounded-xl bg-[#e3f9ec] px-3.5 py-2.5 text-center text-xs font-semibold text-[#229954]">🎉 You&apos;ve unlocked FREE delivery!</div>
                )}
                <div className="mb-3 flex justify-between text-sm text-mut"><span>Subtotal</span><b className="text-choco">{rs(cart.subtotal)}</b></div>
                <div className="mb-3 flex justify-between text-sm text-mut"><span>Delivery</span><b className="text-choco">{cart.deliveryFee === 0 ? "FREE" : rs(cart.deliveryFee)}</b></div>
                <div className="mt-4 flex items-center justify-between border-t-[1.5px] border-dashed border-line2 pt-4">
                  <span className="text-base font-semibold text-choco">Total</span>
                  <b className="font-display text-2xl font-extrabold tnum text-pink">{rs(cart.total)}</b>
                </div>
                <Button component={Link} href="/checkout" variant="contained" fullWidth size="large" endIcon={<ShoppingBagRoundedIcon />}
                  sx={{ mt: 4, py: 1.7, fontSize: 15, boxShadow: "0 8px 22px rgba(230,60,100,.32)" }}>Proceed to Checkout</Button>
                <Button component={Link} href="/gallery" variant="text" fullWidth sx={{ mt: 1.5, color: "#7d6a63" }}>Continue Shopping</Button>
              </aside>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
