"use client";
/** Admin flavors — CRUD */
import { useCallback, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Switch from "@mui/material/Switch";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { useAdminApi, useConfirm } from "@/components/admin-kit";
import type { Flavor } from "@/lib/types";

export default function AdminFlavors() {
  const api = useAdminApi();
  const { ask, node } = useConfirm();
  const [rows, setRows] = useState<Flavor[] | null>(null);
  const [edit, setEdit] = useState<Partial<Flavor> | null>(null);
  const [err, setErr] = useState("");

  const load = useCallback(async () => setRows(await api("/api/admin/flavors")), [api]);
  useEffect(() => { load(); }, [load]);

  const save = async () => {
    setErr("");
    try {
      if (edit!.id) await api(`/api/admin/flavors/${edit!.id}`, { method: "PATCH", body: edit });
      else await api("/api/admin/flavors", { method: "POST", body: edit });
      setEdit(null); load();
    } catch (e: any) { setErr(e.message); }
  };

  return (
    <div className="rounded-3xl border border-line bg-white shadow-card">
      {node}
      <div className="flex items-center justify-between border-b border-line p-5">
        <span className="font-display text-lg font-bold text-choco">Cake Flavors</span>
        <Button variant="contained" onClick={() => setEdit({ name: "", description: "", tag: "classic" })} sx={{ boxShadow: "0 6px 16px rgba(230,60,100,.3)" }}>+ Add Flavor</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead><tr className="bg-cream text-left text-2xs uppercase tracking-wider text-mut">
            {["Flavor", "Description", "Tag", "Visible", ""].map((h) => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}
          </tr></thead>
          <tbody>
            {(rows || []).map((f) => (
              <tr key={f.id} className="border-b border-line hover:bg-pinkfaint">
                <td className="px-4 py-3 font-semibold text-choco">{f.name}</td>
                <td className="px-4 py-3 text-xs text-mut">{f.description}</td>
                <td className="px-4 py-3"><span className="rounded-full bg-pinkfaint px-2.5 py-1 text-2xs font-semibold text-pink">{f.tag}</span></td>
                <td className="px-4 py-3"><Switch checked={!!f.active} size="small" onChange={() => api(`/api/admin/flavors/${f.id}`, { method: "PATCH", body: { active: !f.active } }).then(load)} /></td>
                <td className="px-4 py-3">
                  <div className="flex gap-1.5">
                    <button onClick={() => setEdit(f)} className="grid h-8 w-8 place-items-center rounded-lg bg-cream text-sm transition hover:bg-pinkfaint">✏️</button>
                    <button onClick={() => ask("Delete flavor?", "It will be removed from the custom builder & product pages.", async () => { await api(`/api/admin/flavors/${f.id}`, { method: "DELETE" }); load(); })}
                      className="grid h-8 w-8 place-items-center rounded-lg bg-cream text-sm transition hover:bg-[#fdeaea]">🗑</button>
                  </div>
                </td>
              </tr>
            ))}
            {!rows && <tr><td colSpan={5} className="px-4 py-14 text-center text-mut">Loading…</td></tr>}
          </tbody>
        </table>
      </div>

      <Dialog open={!!edit} onClose={() => setEdit(null)} slotProps={{ paper: { sx: { borderRadius: 4, background: "#fdf6f2", maxWidth: 460 } } }}>
        {edit && (
          <>
            <DialogTitle sx={{ fontFamily: "var(--font-playfair)", fontWeight: 700 }}>{edit.id ? "Edit Flavor" : "Add Flavor"}</DialogTitle>
            <DialogContent dividers>
              {err && <p className="mb-3 rounded-lg bg-[#fdeaea] px-3 py-2 text-xs text-[#c0392b]">⚠ {err}</p>}
              <div className="grid gap-4">
                <TextField label="Name *" required value={edit.name || ""} onChange={(e) => setEdit({ ...edit, name: e.target.value })} />
                <TextField label="Description" value={edit.description || ""} onChange={(e) => setEdit({ ...edit, description: e.target.value })} />
                <TextField select label="Tag" value={edit.tag || "classic"} onChange={(e) => setEdit({ ...edit, tag: e.target.value })}>
                  {["classic", "premium", "fruity"].map((t) => <MenuItem key={t}>{t}</MenuItem>)}
                </TextField>
                <Button variant="contained" onClick={save}>{edit.id ? "Save Flavor" : "Add Flavor"}</Button>
              </div>
            </DialogContent>
          </>
        )}
      </Dialog>
    </div>
  );
}
