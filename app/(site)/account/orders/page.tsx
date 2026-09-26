"use client";
/** Customer — my orders & custom cake requests */
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Button from "@mui/material/Button";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import { useCustomer } from "@/components/customer";
import { rs, type Order, type CustomOrder } from "@/lib/types";

type Data = { email: string; orders: Order[]; custom_orders: CustomOrder[] };

export default function MyOrdersPage() {
  const { customer, ready, signOut } = useCustomer();
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!customer) return;
    fetch("/api/account/orders", { headers: { Authorization: `Bearer ${customer.token}` } })
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw new Error(d.error || "Failed to load orders");
        setData(d);
      })
      .catch((e) => setError(e.message));
  }, [customer]);

  if (ready && !customer) {
    return (
      <section className="py-20">
        <div className="mx-auto max-w-md px-6 text-center">
          <span className="block text-6xl">🔐</span>
          <h1 className="mt-4 font-display text-3xl font-extrabold text-choco">Sign in to view your orders</h1>
          <p className="mt-3 text-mut">Track your cake orders and custom requests in one place.</p>
          <Link href="/account/signin" className="mt-6 inline-flex rounded-full bg-pink px-7 py-3.5 font-semibold text-white shadow-[0_8px_22px_rgba(230,60,100,.3)] transition hover:bg-pink2">
            Sign In / Create Account →
          </Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="bg-gradient-to-b from-blush to-cream py-16 text-center">
        <div className="mx-auto max-w-2xl px-6">
          <nav className="mb-4 text-sm text-mut"><Link href="/" className="hover:text-pink">Home</Link> › <span>My Orders</span></nav>
          <h1 className="font-display text-4xl font-extrabold text-choco sm:text-5xl">My <span className="font-script text-pink">Orders</span></h1>
          <p className="mt-3 text-mut">
            {customer ? <>Signed in as <b className="text-ink">{customer.email}</b></> : "Loading…"}
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-3xl space-y-9 px-6">
          {error && <p className="rounded-xl bg-[#fdeaea] px-4 py-3 text-sm text-[#c0392b]">⚠ {error}
            <button onClick={signOut} className="ml-2 underline">Sign out &amp; try again</button></p>}

          {/* orders */}
          <div>
            <h2 className="mb-4 font-display text-2xl font-bold text-choco">🍰 Cake Orders</h2>
            {!data ? (
              <p className="rounded-2xl border border-line bg-white p-8 text-center text-mut shadow-card">Loading your orders…</p>
            ) : data.orders.length === 0 ? (
              <p className="rounded-2xl border border-line bg-white p-8 text-center text-mut shadow-card">
                No cake orders yet — <Link href="/gallery" className="font-semibold text-pink hover:underline">browse our gallery</Link> and treat yourself! 🎂
              </p>
            ) : (
              <div className="grid gap-4">
                {data.orders.map((o, i) => (
                  <motion.div key={o.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                    className="rounded-2xl border border-line bg-white p-5 shadow-card">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <b className="tnum font-display text-lg text-choco">{o.order_no}</b>
                        <p className="mt-0.5 text-xs text-mut">Placed {String(o.created_at).slice(0, 10)} · Delivery {o.delivery_date}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`st-${o.status} inline-flex items-center rounded-full px-3 py-1 text-2xs font-semibold capitalize`}>{o.status.replace(/-/g, " ")}</span>
                        <b className="tnum font-display text-lg text-pink">{rs(o.total)}</b>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2 border-t border-line pt-3">
                      {(o.order_items || []).map((it: any, k: number) => (
                        <span key={k} className="rounded-full bg-cream2 px-2.5 py-1 text-xs text-choco">
                          {it.name} · {it.size} × {it.qty}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* custom requests */}
          <div>
            <h2 className="mb-4 font-display text-2xl font-bold text-choco">🎨 Custom Cake Requests</h2>
            {!data ? (
              <p className="rounded-2xl border border-line bg-white p-8 text-center text-mut shadow-card">Loading…</p>
            ) : data.custom_orders.length === 0 ? (
              <p className="rounded-2xl border border-line bg-white p-8 text-center text-mut shadow-card">
                No custom requests yet — <Link href="/custom" className="font-semibold text-pink hover:underline">design your dream cake</Link>! ✨
              </p>
            ) : (
              <div className="grid gap-4">
                {data.custom_orders.map((c, i) => (
                  <motion.div key={c.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                    className="rounded-2xl border border-line bg-white p-5 shadow-card">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <b className="tnum font-display text-lg text-choco">{c.ref_no}</b>
                        <p className="mt-0.5 text-xs text-mut">{c.occasion} · {c.flavor} · {c.size}</p>
                      </div>
                      <span className={`st-${c.status} inline-flex items-center rounded-full px-3 py-1 text-2xs font-semibold capitalize`}>{c.status.replace(/-/g, " ")}</span>
                    </div>
                    <p className="mt-3 line-clamp-2 border-t border-line pt-3 text-sm text-mut">{c.design}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {customer && (
            <div className="text-center">
              <Button onClick={signOut} variant="outlined" sx={{ borderColor: "#e63c64", color: "#e63c64", borderRadius: 99, px: 4 }} startIcon={<LoginRoundedIcon sx={{ transform: "rotate(180deg)" }} />}>
                Sign Out
              </Button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
