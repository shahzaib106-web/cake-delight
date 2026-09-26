"use client";
/** Admin overview — stats, revenue chart, recent activity */
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAdminApi, Pill, dt } from "@/components/admin-kit";
import { rs } from "@/lib/types";

interface Stats {
  revenue: number; orders: number; pending: number; custom: number; unread: number; products: number;
  chart: Record<string, number>; statusCounts: Record<string, number>;
  recentOrders: any[]; recentMessages: any[];
}

const CARDS = [
  ["💰", "p", "revenue", "Total Revenue", (v: number) => rs(v)],
  ["🧾", "b", "orders", "Total Orders", (v: number) => String(v)],
  ["⏳", "a", "pending", "Pending / Active", (v: number) => String(v)],
  ["🎨", "v", "custom", "Custom Requests", (v: number) => String(v)],
  ["✉️", "y", "unread", "Unread Messages", (v: number) => String(v)],
  ["🍰", "g", "products", "Products", (v: number) => String(v)],
] as const;

const BGC: Record<string, string> = { p: "bg-pinkfaint", b: "bg-[#e3f0ff]", a: "bg-[#fff3e0]", v: "bg-[#f3e8ff]", y: "bg-[#fff8e1]", g: "bg-[#e3f9ec]" };

export default function AdminOverview() {
  const api = useAdminApi();
  const [s, setS] = useState<Stats | null>(null);
  useEffect(() => { api("/api/admin/stats").then(setS).catch(() => {}); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!s) return <div className="py-20 text-center text-mut">Loading stats… 📊</div>;
  const days = Object.entries(s.chart);
  const max = Math.max(...days.map(([, v]) => v), 1);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
        {CARDS.map(([em, key, field, label, fmt], i) => (
          <motion.div key={field} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="flex items-center gap-4 rounded-2xl border border-line bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-soft">
            <span className={`grid h-[52px] w-[52px] place-items-center rounded-2xl text-2xl ${BGC[key]}`}>{em}</span>
            <span><b className="block font-display text-2xl text-choco tnum">{fmt((s as any)[field])}</b><small className="text-xs font-medium text-mut">{label}</small></span>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="rounded-3xl border border-line bg-white shadow-card">
          <div className="border-b border-line px-6 py-5 font-display text-lg font-bold text-choco">Revenue — Last 7 Days</div>
          <div className="p-6">
            <div className="flex h-[210px] items-end gap-3">
              {days.map(([d, v], i) => (
                <div key={d} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                  <motion.div initial={{ height: 0 }} animate={{ height: `${Math.max(3, (v / max) * 100)}%` }} transition={{ delay: 0.15 + i * 0.07, duration: 0.5, ease: "easeOut" }}
                    className="group relative w-full max-w-11 rounded-lg bg-gradient-to-b from-pink to-[#f0899f]">
                    <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-choco px-2 py-1 text-2xs text-white opacity-0 transition group-hover:opacity-100">{rs(v)}</span>
                  </motion.div>
                  <small className="text-2xs font-medium text-mut">{new Date(d + "T00:00:00Z").toLocaleDateString("en-PK", { weekday: "short" })}</small>
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-3.5">
              {Object.entries(s.statusCounts).map(([k, v]) => (
                <span key={k} className="inline-flex items-center gap-1.5 text-xs text-mut"><i className={`st-${k} h-2.5 w-2.5 rounded-full`} />{k.replace(/-/g, " ")}: <b className="text-choco">{v}</b></span>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-line bg-white shadow-card">
          <div className="flex items-center justify-between border-b border-line px-6 py-5">
            <span className="font-display text-lg font-bold text-choco">Latest Messages</span>
            <Link href="/admin/messages" className="rounded-full border-[1.5px] border-pink px-3.5 py-1.5 text-xs font-semibold text-pink transition hover:bg-pink hover:text-white">View All</Link>
          </div>
          <div className="space-y-3 p-5">
            {s.recentMessages.length === 0 && <p className="py-8 text-center text-sm text-mut">📭 No messages yet</p>}
            {s.recentMessages.map((m) => (
              <div key={m.id} className={`rounded-2xl border border-line p-4 ${!m.is_read ? "border-l-4 border-l-pink bg-pinkfaint" : "bg-white"}`}>
                <div className="flex justify-between gap-2 text-sm"><b className="text-choco">{m.name}</b><small className="text-mut">{dt(m.created_at)}</small></div>
                <div className="mt-0.5 text-xs text-mut">{m.subject}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-line bg-white shadow-card">
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <span className="font-display text-lg font-bold text-choco">Recent Orders</span>
          <Link href="/admin/orders" className="rounded-full border-[1.5px] border-pink px-3.5 py-1.5 text-xs font-semibold text-pink transition hover:bg-pink hover:text-white">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead><tr className="bg-cream text-left text-2xs uppercase tracking-wider text-mut">
              {["Order", "Customer", "Total", "Status", "Date"].map((h) => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}
            </tr></thead>
            <tbody>
              {s.recentOrders.map((o) => (
                <tr key={o.id} className="border-b border-line transition hover:bg-pinkfaint">
                  <td className="px-4 py-3 font-semibold text-choco">{o.order_no}</td>
                  <td className="px-4 py-3">{o.customer_name}</td>
                  <td className="px-4 py-3 font-semibold text-choco">{rs(o.total)}</td>
                  <td className="px-4 py-3"><Pill status={o.status} /></td>
                  <td className="px-4 py-3 text-xs text-mut">{dt(o.created_at)}</td>
                </tr>
              ))}
              {s.recentOrders.length === 0 && <tr><td colSpan={5} className="px-4 py-10 text-center text-mut">No orders yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
