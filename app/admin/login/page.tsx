"use client";
/** Admin login */
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setError("");
    try {
      const r = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, password }) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      localStorage.setItem("cd_admin_token", d.token);
      localStorage.setItem("cd_admin_name", d.name);
      router.replace("/admin");
    } catch (ex: any) { setError(ex.message); setBusy(false); }
  };

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-gradient-to-br from-choco via-choco2 to-[#8a4a3d] p-5">
      <i className="absolute -right-24 -top-32 h-[420px] w-[420px] rounded-full bg-pink/[0.14]" />
      <i className="absolute -bottom-28 -left-20 h-[320px] w-[320px] rounded-full bg-pink/10" />
      <motion.form onSubmit={submit} initial={{ opacity: 0, y: 26, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5, ease: [0.21, 0.65, 0.35, 1] }}
        className="relative z-10 w-full max-w-sm rounded-3xl bg-white p-10 shadow-[0_30px_80px_rgba(0,0,0,.35)]">
        <div className="mb-6 text-center">
          <svg className="mx-auto mb-2.5 h-16 w-16" viewBox="0 0 64 64" fill="none" aria-hidden>
            <rect x="2" y="2" width="60" height="60" rx="18" fill="#e63c64" />
            <path d="M18 44v-9a2.5 2.5 0 0 1 2.5-2.5h23A2.5 2.5 0 0 1 46 35v9" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
            <path d="M16 44c0-1.4 1.6-2.5 3.5-2.5S23 42.6 23 44s1.6 2.5 3.5 2.5S30 45.4 30 44s1.6-2.5 3.5-2.5S37 42.6 37 44s1.6 2.5 3.5 2.5S44 45.4 44 44" stroke="#ffd9e2" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M25 28.5v-6M32 26.5v-6M39 28.5v-6" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
            <circle cx="25" cy="12.5" r="1.4" fill="#ffd9e2" /><circle cx="32" cy="10.5" r="1.4" fill="#ffd9e2" /><circle cx="39" cy="12.5" r="1.4" fill="#ffd9e2" />
          </svg>
          <h1 className="font-display text-2xl font-bold text-choco">Cake Delight</h1>
          <p className="text-xs text-mut">Admin Dashboard · Sahiwal</p>
        </div>
        {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2.5 }}>⚠ {error}</Alert>}
        <div className="space-y-4">
          <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} required autoComplete="username" placeholder="admin" fullWidth />
          <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" placeholder="••••••••" fullWidth />
        </div>
        <Button type="submit" variant="contained" fullWidth size="large" disabled={busy} endIcon={<LoginRoundedIcon />}
          sx={{ mt: 3, py: 1.5, fontSize: 15, boxShadow: "0 8px 22px rgba(230,60,100,.35)" }}>
          {busy ? "Signing in…" : "Sign In"}
        </Button>
        <div className="mt-4 rounded-xl bg-cream px-3 py-2.5 text-center text-xs text-mut">Admin account — <b className="text-pink">admin@cakedelight.pk</b> / <b className="text-pink">admin123</b></div>
        <div className="mt-3 text-center"><Link href="/" className="text-xs text-mut hover:text-pink">← Back to website</Link></div>
      </motion.form>
    </div>
  );
}
