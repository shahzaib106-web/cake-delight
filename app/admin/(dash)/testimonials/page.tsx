"use client";
/** Admin testimonials — CRUD */
import { useCallback, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Switch from "@mui/material/Switch";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { useAdminApi, useConfirm } from "@/components/admin-kit";
import type { Testimonial } from "@/lib/types";

export default function AdminTestimonials() {
  const api = useAdminApi();
  const { ask, node } = useConfirm();
  const [rows, setRows] = useState<Testimonial[] | null>(null);
  const [edit, setEdit] = useState<Partial<Testimonial> | null>(null);
  const [err, setErr] = useState("");

  const load = useCallback(async () => setRows(await api("/api/admin/testimonials")), [api]);
  useEffect(() => { load(); }, [load]);

  const save = async () => {
    setErr("");
    try {
      const body = { ...edit, rating: parseInt(String(edit!.rating)) || 5 };
      if (edit!.id) await api(`/api/admin/testimonials/${edit!.id}`, { method: "PATCH", body });
      else await api("/api/admin/testimonials", { method: "POST", body });
      setEdit(null); load();
    } catch (e: any) { setErr(e.message); }
  };

  return (
    <div className="rounded-3xl border border-line bg-white shadow-card">
      {node}
      <div className="flex items-center justify-between border-b border-line p-5">
        <span className="font-display text-lg font-bold text-choco">Customer Testimonials</span>
        <Button variant="contained" onClick={() => setEdit({ name: "", location: "Sahiwal", text: "", rating: 5 })} sx={{ boxShadow: "0 6px 16px rgba(230,60,100,.3)" }}>+ Add Testimonial</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead><tr className="bg-cream text-left text-2xs uppercase tracking-wider text-mut">
            {["Customer", "Testimonial", "Rating", "Shown", ""].map((h) => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}
          </tr></thead>
          <tbody>
            {(rows || []).map((t) => (
              <tr key={t.id} className="border-b border-line hover:bg-pinkfaint">
                <td className="px-4 py-3"><b className="text-choco">{t.name}</b><br /><small className="text-mut">📍 {t.location}</small></td>
                <td className="max-w-[340px] px-4 py-3 text-xs text-mut">{t.text.slice(0, 110)}{t.text.length > 110 ? "…" : ""}</td>
                <td className="px-4 py-3">★ {t.rating}</td>
                <td className="px-4 py-3"><Switch checked={!!t.active} size="small" onChange={() => api(`/api/admin/testimonials/${t.id}`, { method: "PATCH", body: { active: !t.active } }).then(load)} /></td>
                <td className="px-4 py-3">
                  <div className="flex gap-1.5">
                    <button onClick={() => setEdit(t)} title="Edit" className="grid h-8 w-8 place-items-center rounded-lg bg-cream text-sm transition hover:bg-pinkfaint">✏️</button>
                    <button onClick={() => ask("Delete testimonial?", "It will be removed from the website homepage.", async () => { await api(`/api/admin/testimonials/${t.id}`, { method: "DELETE" }); load(); })}
                      title="Delete" className="grid h-8 w-8 place-items-center rounded-lg bg-cream text-sm transition hover:bg-[#fdeaea]">🗑</button>
                  </div>
                </td>
              </tr>
            ))}
            {!rows && <tr><td colSpan={5} className="px-4 py-14 text-center text-mut">Loading…</td></tr>}
          </tbody>
        </table>
      </div>

      <Dialog open={!!edit} onClose={() => setEdit(null)} slotProps={{ paper: { sx: { borderRadius: 4, background: "#fdf6f2", maxWidth: 520 } } }}>
        {edit && (
          <>
            <DialogTitle sx={{ fontFamily: "var(--font-playfair)", fontWeight: 700 }}>{edit.id ? "Edit" : "Add"} Testimonial</DialogTitle>
            <DialogContent dividers>
              {err && <p className="mb-3 rounded-lg bg-[#fdeaea] px-3 py-2 text-xs text-[#c0392b]">⚠ {err}</p>}
              <div className="grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField label="Customer name *" required value={edit.name || ""} onChange={(e) => setEdit({ ...edit, name: e.target.value })} />
                  <TextField label="Location" value={edit.location || ""} onChange={(e) => setEdit({ ...edit, location: e.target.value })} />
                </div>
                <TextField label="Testimonial text *" required multiline minRows={3} value={edit.text || ""} onChange={(e) => setEdit({ ...edit, text: e.target.value })} />
                <TextField select label="Rating" value={edit.rating ?? 5} onChange={(e) => setEdit({ ...edit, rating: parseInt(e.target.value) })}>
                  {[5, 4, 3, 2, 1].map((r) => <MenuItem key={r} value={r}>{"★".repeat(r)}</MenuItem>)}
                </TextField>
                <Button variant="contained" onClick={save}>{edit.id ? "Save Changes" : "Add Testimonial"}</Button>
              </div>
            </DialogContent>
          </>
        )}
      </Dialog>
    </div>
  );
}
