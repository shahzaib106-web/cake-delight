"use client";
/** Admin products — CRUD with image upload, toggles */
import { useCallback, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import { useAdminApi, useConfirm } from "@/components/admin-kit";
import { rs, type Product } from "@/lib/types";

const CATS_OK = ["birthday", "wedding", "kids", "anniversary", "cupcakes"];
const BADGES = ["", "Best Seller", "Trending", "Premium", "Kids Favorite", "New"];

export default function AdminProducts() {
  const api = useAdminApi();
  const { ask, node } = useConfirm();
  const [rows, setRows] = useState<Product[] | null>(null);
  const [edit, setEdit] = useState<Partial<Product> | null>(null);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const load = useCallback(async () => setRows(await api("/api/admin/products")), [api]);
  useEffect(() => { load(); }, [load]);

  const openNew = () => setEdit({ name: "", category: "birthday", price: 2500, description: "", long_description: "", image: "/img/cat-birthday.jpg", rating: 4.8, reviews: 0, badge: "", bestseller: 0, active: 1 });
  const set = (k: string) => (e: any) => setEdit((f) => ({ ...f!, [k]: e.target.type === "checkbox" ? (e.target.checked ? 1 : 0) : e.target.value }));

  const upload = async (file: File) => {
    const fd = new FormData();
    fd.append("image", file);
    try {
      const token = localStorage.getItem("cd_admin_token") || "";
      const r = await fetch("/api/admin/upload", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: fd });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setEdit((f) => ({ ...f!, image: d.path }));
    } catch (e: any) { setErr(e.message); }
  };

  const save = async () => {
    setSaving(true); setErr("");
    try {
      const body = { ...edit, price: parseFloat(String(edit!.price)), rating: parseFloat(String(edit!.rating)), reviews: parseInt(String(edit!.reviews)) || 0 };
      if (edit!.id) await api(`/api/admin/products/${edit!.id}`, { method: "PATCH", body });
      else await api("/api/admin/products", { method: "POST", body });
      setEdit(null); load();
    } catch (e: any) { setErr(e.message); }
    setSaving(false);
  };

  return (
    <div className="rounded-3xl border border-line bg-white shadow-card">
      {node}
      <div className="flex items-center justify-between border-b border-line p-5">
        <span className="font-display text-lg font-bold text-choco">Cake Catalog</span>
        <Button variant="contained" onClick={openNew} sx={{ boxShadow: "0 6px 16px rgba(230,60,100,.3)" }}>+ Add New Cake</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[880px] text-sm">
          <thead><tr className="bg-cream text-left text-2xs uppercase tracking-wider text-mut">
            {["Cake", "Category", "Price (2lb)", "Rating", "Badge", "Bestseller", "Visible", ""].map((h) => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}
          </tr></thead>
          <tbody>
            {(rows || []).map((p) => (
              <tr key={p.id} className="border-b border-line hover:bg-pinkfaint">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.image} alt="" className="h-11 w-12 rounded-lg object-cover" />
                    <div><b className="block text-sm text-choco">{p.name}</b><small className="text-mut">{p.description.slice(0, 42)}…</small></div>
                  </div>
                </td>
                <td className="px-4 py-3 capitalize">{p.category}</td>
                <td className="px-4 py-3 font-semibold text-choco">{rs(p.price)}</td>
                <td className="px-4 py-3">★ {p.rating} <small className="text-mut">({p.reviews})</small></td>
                <td className="px-4 py-3">{p.badge ? <span className="rounded-full bg-pinkfaint px-2.5 py-1 text-2xs font-semibold text-pink">{p.badge}</span> : "—"}</td>
                <td className="px-4 py-3"><Switch checked={!!p.bestseller} onChange={() => api(`/api/admin/products/${p.id}`, { method: "PATCH", body: { bestseller: !p.bestseller } }).then(load)} size="small" /></td>
                <td className="px-4 py-3"><Switch checked={!!p.active} onChange={() => api(`/api/admin/products/${p.id}`, { method: "PATCH", body: { active: !p.active } }).then(load)} size="small" /></td>
                <td className="px-4 py-3">
                  <div className="flex gap-1.5">
                    <button onClick={() => setEdit(p)} className="grid h-8 w-8 place-items-center rounded-lg bg-cream text-sm transition hover:bg-pinkfaint" title="Edit">✏️</button>
                    <button onClick={() => ask("Delete this cake?", "It will disappear from the website immediately.", async () => { await api(`/api/admin/products/${p.id}`, { method: "DELETE" }); load(); })}
                      className="grid h-8 w-8 place-items-center rounded-lg bg-cream text-sm transition hover:bg-[#fdeaea]" title="Delete">🗑</button>
                  </div>
                </td>
              </tr>
            ))}
            {rows && rows.length === 0 && <tr><td colSpan={8} className="px-4 py-14 text-center text-mut">🍰 No products</td></tr>}
            {!rows && <tr><td colSpan={8} className="px-4 py-14 text-center text-mut">Loading…</td></tr>}
          </tbody>
        </table>
      </div>

      <Dialog open={!!edit} onClose={() => setEdit(null)} scroll="paper" slotProps={{ paper: { sx: { borderRadius: 4, background: "#fdf6f2", maxWidth: 660 } } }}>
        {edit && (
          <>
            <DialogTitle sx={{ fontFamily: "var(--font-playfair)", fontWeight: 700 }}>{edit.id ? "Edit Cake" : "Add New Cake"}</DialogTitle>
            <DialogContent dividers>
              {err && <p className="mb-3 rounded-lg bg-[#fdeaea] px-3 py-2 text-xs text-[#c0392b]">⚠ {err}</p>}
              <div className="grid gap-4">
                <TextField label="Cake name *" required value={edit.name || ""} onChange={set("name")} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField select label="Category *" value={edit.category} onChange={set("category")}>
                    {CATS_OK.map((c) => <MenuItem key={c} value={c} sx={{ textTransform: "capitalize" }}>{c}</MenuItem>)}
                  </TextField>
                  <TextField label="Base price — 2 lb (Rs.) *" required type="number" value={String(edit.price ?? "")} onChange={set("price")} />
                </div>
                <TextField label="Short description *" required value={edit.description || ""} onChange={set("description")} />
                <TextField label="Full description" multiline minRows={3} value={edit.long_description || ""} onChange={set("long_description")} />
                <div className="flex items-center gap-4 rounded-2xl border-[1.5px] border-line2 bg-white p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={edit.image || "/img/cat-birthday.jpg"} alt="" className="h-[68px] w-[74px] rounded-xl border-2 border-line2 object-cover" />
                  <div>
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border-[1.5px] border-dashed border-pink px-4 py-2.5 text-xs font-semibold text-pink transition hover:bg-pinkfaint">
                      <UploadFileRoundedIcon sx={{ fontSize: 16 }} /> Upload Image
                      <input type="file" accept=".jpg,.jpeg,.png,.webp" className="hidden" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
                    </label>
                    <div className="mt-1.5 text-2xs text-mut">jpg / png · max 5MB · or paste a path below</div>
                  </div>
                </div>
                <TextField label="Image path / URL" value={edit.image || ""} onChange={set("image")} />
                <div className="grid grid-cols-3 gap-4">
                  <TextField label="Rating (1–5)" type="number" value={String(edit.rating ?? 4.8)} onChange={set("rating")} />
                  <TextField label="Reviews" type="number" value={String(edit.reviews ?? 0)} onChange={set("reviews")} />
                  <TextField select label="Badge" value={edit.badge || ""} onChange={set("badge")}>
                    {BADGES.map((b) => <MenuItem key={b} value={b}>{b || "None"}</MenuItem>)}
                  </TextField>
                </div>
                <div className="flex gap-8">
                  <label className="flex items-center gap-2 text-sm font-medium text-choco"><Switch checked={!!edit.bestseller} onChange={set("bestseller")} size="small" /> Bestseller</label>
                  <label className="flex items-center gap-2 text-sm font-medium text-choco"><Switch checked={edit.active !== 0} onChange={set("active")} size="small" /> Visible on website</label>
                </div>
                <Button variant="contained" disabled={saving} onClick={save} sx={{ py: 1.4, boxShadow: "0 6px 16px rgba(230,60,100,.3)" }}>
                  {saving ? "Saving…" : edit.id ? "Save Changes 🍰" : "Add Cake 🍰"}
                </Button>
              </div>
            </DialogContent>
          </>
        )}
      </Dialog>
    </div>
  );
}
