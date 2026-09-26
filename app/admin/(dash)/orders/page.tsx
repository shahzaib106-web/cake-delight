"use client";
/** Admin orders — search, filter, status pipeline, detail dialog */
import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import InputAdornment from "@mui/material/InputAdornment";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { useAdminApi, Pill, useConfirm, dt } from "@/components/admin-kit";
import { rs, ORDER_STATUSES, type Order } from "@/lib/types";

export default function AdminOrders() {
  const api = useAdminApi();
  const { ask, node } = useConfirm();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [status, setStatus] = useState("all");
  const [q, setQ] = useState("");
  const [detail, setDetail] = useState<any>(null);

  const load = useCallback(async (s: string, query: string) => {
    const qs = new URLSearchParams();
    if (s !== "all") qs.set("status", s);
    if (query) qs.set("q", query);
    setOrders(await api(`/api/admin/orders?${qs}`));
  }, [api]);

  useEffect(() => { load(status, q); }, [status]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { const t = setTimeout(() => load(status, q), 320); return () => clearTimeout(t); }, [q]); // eslint-disable-line react-hooks/exhaustive-deps

  const setSt = async (id: number, st: string) => { await api(`/api/admin/orders/${id}`, { method: "PATCH", body: { status: st } }); load(status, q); };
  const open = async (id: number) => setDetail(await api(`/api/admin/orders/${id}`));

  return (
    <div className="rounded-3xl border border-line bg-white shadow-card">
      {node}
      <div className="flex flex-wrap gap-3 border-b border-line p-5">
        <TextField placeholder="Search order #, name, phone…" value={q} onChange={(e) => setQ(e.target.value)}
          sx={{ flex: "1 1 220px", maxWidth: 360, "& .MuiOutlinedInput-root": { borderRadius: 99 } }}
          slotProps={{ input: { startAdornment: (<InputAdornment position="start"><SearchRoundedIcon sx={{ color: "#7d6a63", fontSize: 19 }} /></InputAdornment>) } }} />
        <TextField select label="Status" value={status} onChange={(e) => setStatus(e.target.value)} sx={{ maxWidth: 190, "& .MuiOutlinedInput-root": { borderRadius: 99 } }}>
          <MenuItem value="all">All statuses</MenuItem>
          {ORDER_STATUSES.map((s) => <MenuItem key={s} value={s} sx={{ textTransform: "capitalize" }}>{s}</MenuItem>)}
        </TextField>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-sm">
          <thead><tr className="bg-cream text-left text-2xs uppercase tracking-wider text-mut">
            {["Order", "Customer", "Delivery", "Items", "Total", "Status", "Placed", ""].map((h) => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}
          </tr></thead>
          <tbody>
            {(orders || []).map((o, i) => (
              <motion.tr key={o.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: Math.min(i * 0.03, 0.3) }} className="border-b border-line hover:bg-pinkfaint">
                <td className="px-4 py-3 font-semibold text-choco">{o.order_no}</td>
                <td className="px-4 py-3"><b className="text-sm text-choco">{o.customer_name}</b><br /><small className="text-mut">{o.phone}</small></td>
                <td className="px-4 py-3 text-xs">{o.delivery_date || "ASAP"}<br /><small className="text-mut">{o.delivery_slot}</small></td>
                <td className="px-4 py-3"><span className="rounded-full bg-cream px-2.5 py-1 text-2xs font-semibold text-choco">{o.items_count} item{(o.items_count || 0) === 1 ? "" : "s"}</span></td>
                <td className="px-4 py-3 font-semibold tnum text-choco">{rs(o.total)}</td>
                <td className="px-4 py-3">
                  <TextField select value={o.status} onChange={(e) => setSt(o.id, e.target.value)} size="small"
                    sx={{ minWidth: 150, "& .MuiOutlinedInput-root": { borderRadius: 1.5, fontSize: 13.5, py: 0.5 } }}>
                    {ORDER_STATUSES.map((s) => <MenuItem key={s} value={s} sx={{ textTransform: "capitalize", fontSize: 13.5 }}>{s}</MenuItem>)}
                  </TextField>
                </td>
                <td className="px-4 py-3 text-xs text-mut">{dt(o.created_at)}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1.5">
                    <button onClick={() => open(o.id)} className="grid h-8 w-8 place-items-center rounded-lg bg-cream text-sm transition hover:bg-pinkfaint" title="View">👁</button>
                    <button onClick={() => ask("Delete this order?", "This permanently removes the order and its items.", async () => { await api(`/api/admin/orders/${o.id}`, { method: "DELETE" }); load(status, q); })}
                      className="grid h-8 w-8 place-items-center rounded-lg bg-cream text-sm transition hover:bg-[#fdeaea]" title="Delete">🗑</button>
                  </div>
                </td>
              </motion.tr>
            ))}
            {orders && orders.length === 0 && <tr><td colSpan={8} className="px-4 py-14 text-center text-mut">🧾 No orders found</td></tr>}
            {!orders && <tr><td colSpan={8} className="px-4 py-14 text-center text-mut">Loading orders…</td></tr>}
          </tbody>
        </table>
      </div>

      <Dialog open={!!detail} onClose={() => setDetail(null)} scroll="paper" slotProps={{ paper: { sx: { borderRadius: 4, background: "#fdf6f2", maxWidth: 720 } } }}>
        {detail && (
          <>
            <DialogTitle sx={{ fontFamily: "var(--font-playfair)", fontWeight: 700 }}>Order {detail.order_no}
              <span className="ml-3 align-middle"><Pill status={detail.status} /></span></DialogTitle>
            <DialogContent dividers>
              <dl className="mb-5 grid grid-cols-[120px_1fr] gap-y-2 text-sm">
                {[["Customer", <b key="c">{detail.customer_name}</b>], ["Phone", <a key="p" href={`tel:${detail.phone}`} className="text-pink">{detail.phone}</a>],
                  ["Email", detail.email || "—"], ["Address", `${detail.address}, ${detail.city}`],
                  ["Delivery", `${detail.delivery_date || "ASAP"} · ${detail.delivery_slot}`], ["Notes", detail.notes || "—"], ["Payment", "Cash on Delivery"]].map(([k, v], i) => (
                  <div key={i} className="contents"><dt className="font-medium text-mut">{k as string}</dt><dd className="text-choco">{v}</dd></div>
                ))}
              </dl>
              <h4 className="mb-2 font-display text-base font-bold text-choco">Items</h4>
              <div className="space-y-2">
                {detail.items?.map((it: any) => (
                  <div key={it.id} className="flex items-center gap-3 rounded-xl border border-line bg-white p-2.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={it.image} alt="" className="h-11 w-12 rounded-lg object-cover" />
                    <div className="min-w-0 flex-1 text-sm"><b className="text-choco">{it.name}</b>
                      <div className="text-xs text-mut">{it.size}{it.flavor ? " · " + it.flavor : ""}{it.message ? ` · “${it.message}”` : ""}</div></div>
                    <span className="text-xs text-mut">×{it.qty}</span><b className="text-sm text-choco">{rs(it.unit_price * it.qty)}</b>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-right">
                <div className="text-sm text-mut">Subtotal: <b className="text-choco">{rs(detail.subtotal)}</b> · Delivery: <b className="text-choco">{detail.delivery_fee ? rs(detail.delivery_fee) : "FREE"}</b></div>
                <div className="font-display text-2xl font-extrabold text-pink">Total: {rs(detail.total)}</div>
              </div>
            </DialogContent>
          </>
        )}
      </Dialog>
    </div>
  );
}
