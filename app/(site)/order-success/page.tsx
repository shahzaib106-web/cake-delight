"use client";
/** Order success — confirmation + details */
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { rs } from "@/lib/types";

interface TrackOrder {
  order_no: string; customer_name: string; status: string; subtotal: number; delivery_fee: number; total: number;
  delivery_date: string; delivery_slot: string; created_at: string;
  items: { name: string; qty: number; unit_price: number; size: string; flavor?: string }[];
}

function Inner() {
  const params = useSearchParams();
  const no = params.get("order");
  const [order, setOrder] = useState<TrackOrder | null | "error">(null);

  useEffect(() => {
    if (!no) return;
    fetch(`/api/orders/track/${encodeURIComponent(no)}`).then(async (r) => (r.ok ? setOrder(await r.json()) : setOrder("error"))).catch(() => setOrder("error"));
  }, [no]);

  return (
    <section className="py-16">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
          className="mx-auto mb-5 grid h-[100px] w-[100px] place-items-center rounded-full bg-gradient-to-br from-[#3fae6a] to-[#7ed9a0] text-5xl text-white">✓</motion.span>
        <h1 className="font-display text-4xl font-extrabold text-choco">Order <span className="font-script text-pink">Confirmed!</span></h1>
        <p className="mt-2.5 text-mut">Thank you! Your cake will be freshly baked and delivered on time. 🎂</p>
        {order && order !== "error" && <div className="my-4 inline-block rounded-full bg-pinkfaint px-7 py-3 font-display text-lg font-bold tracking-wide text-pink">{order.order_no}</div>}

        <div className="mt-6 rounded-3xl border border-line bg-white p-7 text-left shadow-card">
          {order === null && <p className="text-center text-mut">Loading your order details…</p>}
          {order === "error" && <p className="text-center text-[#e05252]">Couldn&apos;t load order details — please check your order number.</p>}
          {order && order !== "error" && (
            <>
              <div className="mb-5 flex flex-wrap items-center justify-between gap-2.5 text-sm">
                <div><b className="text-choco">Status:</b> <span className={`st-${order.status} ml-1.5 inline-flex rounded-full px-3.5 py-1 text-xs font-semibold capitalize`}>{order.status.replace(/-/g, " ")}</span></div>
                <div className="text-mut"><b className="text-choco">Customer:</b> {order.customer_name}</div>
              </div>
              <div className="mb-5 flex flex-wrap justify-between gap-2.5 text-sm text-mut">
                <div><b className="text-choco">Delivery:</b> {order.delivery_date || "As soon as possible"} ({order.delivery_slot})</div>
              </div>
              <h3 className="mb-2.5 font-display text-lg font-bold text-choco">Items</h3>
              {order.items.map((i, idx) => (
                <div key={idx} className="mb-2.5 flex justify-between gap-3 text-sm">
                  <span className="text-mut">{i.name} × {i.qty} <small className="text-xs">({i.size}{i.flavor ? " · " + i.flavor : ""})</small></span>
                  <b className="text-choco">{rs(i.unit_price * i.qty)}</b>
                </div>
              ))}
              <div className="mt-4 flex justify-between text-sm text-mut"><span>Delivery</span><b className="text-choco">{order.delivery_fee === 0 ? "FREE" : rs(order.delivery_fee)}</b></div>
              <div className="mt-3 flex items-center justify-between border-t-[1.5px] border-dashed border-line2 pt-3.5">
                <span className="font-semibold text-choco">Total (COD)</span>
                <b className="font-display text-2xl font-extrabold text-pink">{rs(order.total)}</b>
              </div>
            </>
          )}
        </div>

        <div className="mt-7 flex flex-wrap justify-center gap-3.5">
          <Link href="/" className="rounded-full bg-pink px-7 py-3 font-semibold text-white shadow-[0_8px_22px_rgba(230,60,100,.3)] transition hover:bg-pink2">Back to Home</Link>
          <Link href="/gallery" className="rounded-full border-2 border-pink px-7 py-3 font-semibold text-pink transition hover:bg-pink hover:text-white">Continue Shopping</Link>
        </div>
      </div>
    </section>
  );
}

export default function OrderSuccessPage() {
  return <Suspense><Inner /></Suspense>;
}
