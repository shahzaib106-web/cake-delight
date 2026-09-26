"use client";
/** Admin custom requests — pipeline, design briefs, notes */
import { useCallback, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import { useAdminApi, Pill, useConfirm, dt } from "@/components/admin-kit";
import { CUSTOM_STATUSES, type CustomOrder } from "@/lib/types";

export default function AdminCustomOrders() {
  const api = useAdminApi();
  const { ask, node } = useConfirm();
  const [rows, setRows] = useState<CustomOrder[] | null>(null);
  const [status, setStatus] = useState("all");
  const [view, setView] = useState<CustomOrder | null>(null);
  const [notes, setNotes] = useState("");

  const load = useCallback(async (s: string) => {
    setRows(await api(`/api/admin/custom-orders${s !== "all" ? `?status=${s}` : ""}`));
  }, [api]);
  useEffect(() => { load(status); }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  const setSt = async (id: number, st: string) => { await api(`/api/admin/custom-orders/${id}`, { method: "PATCH", body: { status: st } }); load(status); };

  return (
    <div className="rounded-3xl border border-line bg-white shadow-card">
      {node}
      <div className="flex flex-wrap gap-3 border-b border-line p-5">
        <TextField select label="Status" value={status} onChange={(e) => setStatus(e.target.value)} sx={{ maxWidth: 190, "& .MuiOutlinedInput-root": { borderRadius: 99 } }}>
          <MenuItem value="all">All statuses</MenuItem>
          {CUSTOM_STATUSES.map((s) => <MenuItem key={s} value={s} sx={{ textTransform: "capitalize" }}>{s}</MenuItem>)}
        </TextField>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[880px] text-sm">
          <thead><tr className="bg-cream text-left text-2xs uppercase tracking-wider text-mut">
            {["Ref", "Customer", "Occasion", "Design", "Flavor / Size", "Delivery", "Status", ""].map((h) => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}
          </tr></thead>
          <tbody>
            {(rows || []).map((c) => (
              <tr key={c.id} className="border-b border-line hover:bg-pinkfaint">
                <td className="px-4 py-3 font-semibold text-choco">{c.ref_no}</td>
                <td className="px-4 py-3"><b className="text-sm text-choco">{c.name}</b><br /><small className="text-mut">{c.phone}</small></td>
                <td className="px-4 py-3">{c.occasion}</td>
                <td className="max-w-[220px] px-4 py-3 text-xs text-mut">{c.design.slice(0, 70)}{c.design.length > 70 ? "…" : ""}</td>
                <td className="px-4 py-3 text-xs">{c.flavor}<br /><small className="text-mut">{c.size}</small></td>
                <td className="px-4 py-3 text-xs">{c.delivery_date || "—"}</td>
                <td className="px-4 py-3">
                  <TextField select value={c.status} onChange={(e) => setSt(c.id, e.target.value)} size="small"
                    sx={{ minWidth: 135, "& .MuiOutlinedInput-root": { borderRadius: 1.5, fontSize: 13.5, py: 0.5 } }}>
                    {CUSTOM_STATUSES.map((s) => <MenuItem key={s} value={s} sx={{ textTransform: "capitalize", fontSize: 13.5 }}>{s}</MenuItem>)}
                  </TextField>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1.5">
                    <button onClick={() => { setView(c); setNotes(c.admin_notes || ""); }} className="grid h-8 w-8 place-items-center rounded-lg bg-cream text-sm transition hover:bg-pinkfaint" title="View">👁</button>
                    <button onClick={() => ask("Delete this request?", `Ref ${c.ref_no} will be permanently removed.`, async () => { await api(`/api/admin/custom-orders/${c.id}`, { method: "DELETE" }); load(status); })}
                      className="grid h-8 w-8 place-items-center rounded-lg bg-cream text-sm transition hover:bg-[#fdeaea]" title="Delete">🗑</button>
                  </div>
                </td>
              </tr>
            ))}
            {rows && rows.length === 0 && <tr><td colSpan={8} className="px-4 py-14 text-center text-mut">🎨 No custom requests yet</td></tr>}
            {!rows && <tr><td colSpan={8} className="px-4 py-14 text-center text-mut">Loading…</td></tr>}
          </tbody>
        </table>
      </div>

      <Dialog open={!!view} onClose={() => setView(null)} scroll="paper" slotProps={{ paper: { sx: { borderRadius: 4, background: "#fdf6f2", maxWidth: 640 } } }}>
        {view && (
          <>
            <DialogTitle sx={{ fontFamily: "var(--font-playfair)", fontWeight: 700 }}>Custom Request {view.ref_no}
              <span className="ml-3 align-middle"><Pill status={view.status} /></span></DialogTitle>
            <DialogContent dividers>
              <dl className="mb-5 grid grid-cols-[120px_1fr] gap-y-2 text-sm">
                <div className="contents"><dt className="font-medium text-mut">Customer</dt><dd className="text-choco"><b>{view.name}</b></dd></div>
                <div className="contents"><dt className="font-medium text-mut">Phone</dt>
                  <dd><a href={`tel:${view.phone}`} className="text-pink">{view.phone}</a> · <a href={`https://wa.me/92${view.phone.replace(/^0/, "")}`} target="_blank" className="text-[#229954]">WhatsApp</a></dd></div>
                {view.email && <div className="contents"><dt className="font-medium text-mut">Email</dt><dd className="text-choco">{view.email}</dd></div>}
                <div className="contents"><dt className="font-medium text-mut">Occasion</dt><dd className="text-choco">{view.occasion}</dd></div>
                <div className="contents"><dt className="font-medium text-mut">Flavor</dt><dd className="text-choco">{view.flavor}</dd></div>
                <div className="contents"><dt className="font-medium text-mut">Size</dt><dd className="text-choco">{view.size} (~{view.servings} servings)</dd></div>
                {view.budget && <div className="contents"><dt className="font-medium text-mut">Budget</dt><dd className="text-choco">{view.budget}</dd></div>}
                <div className="contents"><dt className="font-medium text-mut">Delivery</dt><dd className="text-choco">{view.delivery_date || "—"}</dd></div>
                {view.message && <div className="contents"><dt className="font-medium text-mut">Cake message</dt><dd className="text-choco">“{view.message}”</dd></div>}
                <div className="contents"><dt className="font-medium text-mut">Received</dt><dd className="text-choco">{dt(view.created_at)}</dd></div>
              </dl>
              <h4 className="mb-2 font-display text-base font-bold text-choco">Design Brief</h4>
              <p className="mb-5 rounded-xl bg-cream p-4 text-sm leading-relaxed">{view.design}</p>
              <TextField label="Internal notes" multiline minRows={2} value={notes} onChange={(e) => setNotes(e.target.value)} fullWidth />
              <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={async () => { await api(`/api/admin/custom-orders/${view.id}`, { method: "PATCH", body: { admin_notes: notes } }); setView(null); }}>
                Save Notes
              </Button>
            </DialogContent>
          </>
        )}
      </Dialog>
    </div>
  );
}
