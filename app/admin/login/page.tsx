"use client";
/** Admin login — premium card, icon fields, show/hide password */
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Alert from "@mui/material/Alert";
import MailRoundedIcon from "@mui/icons-material/MailRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setError("");
    try {
      const r = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username: email, password }) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      localStorage.setItem("cd_admin_token", d.token);
      localStorage.setItem("cd_admin_name", d.name);
      router.replace("/admin");
    } catch (ex: any) { setError(ex.message); setBusy(false); }
  };

  const field = (props: any) => ({
    fullWidth: true,
    sx: {
      "& .MuiOutlinedInput-root": { borderRadius: 2.5, bgcolor: "#fdfaf8", py: 0.5, "& fieldset": { borderColor: "#eadfd8" }, "&:hover fieldset": { borderColor: "#e63c64" }, "&.Mui-focused fieldset": { borderColor: "#e63c64", borderWidth: "1.5px" } },
      "& .MuiInputAdornment-root": { color: "#b39c93" },
      "& input": { fontSize: 15 },
    },
    ...props,
  });

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-gradient-to-br from-[#33201b] via-choco to-[#160d0b] p-5">
      {/* ambient decor */}
      <i className="absolute -right-32 -top-40 h-[520px] w-[520px] rounded-full bg-pink/[0.13] blur-[6px]" />
      <i className="absolute -bottom-36 -left-28 h-[380px] w-[380px] rounded-full bg-[#f5b73d]/[0.07]" />
      <i className="absolute left-1/2 top-1/3 h-[240px] w-[240px] -translate-x-1/2 rounded-full bg-pink/[0.06] blur-2xl" />
      <i className="absolute inset-0 opacity-[0.35]" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,.05) 1px, transparent 1px)", backgroundSize: "26px 26px" }} />

      <motion.div initial={{ opacity: 0, y: 26, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.55, ease: [0.21, 0.65, 0.35, 1] }}
        className="relative z-10 w-full max-w-[420px]">
        <div className="overflow-hidden rounded-[28px] bg-white shadow-[0_40px_90px_rgba(0,0,0,.5)]">
          {/* gradient accent bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-pink via-[#f0899f] to-[#f5b73d]" />

          <form onSubmit={submit} className="px-8 pb-8 pt-9 sm:px-10">
            {/* brand */}
            <div className="mb-8 text-center">
              <span className="mx-auto mb-4 grid h-[74px] w-[74px] place-items-center rounded-3xl bg-gradient-to-br from-pinkfaint to-pinksoft shadow-[inset_0_0_0_1px_#f6dfd8,0_10px_24px_rgba(230,60,100,.16)]">
                <svg className="h-11 w-11" viewBox="0 0 64 64" fill="none" aria-hidden>
                  <rect x="2" y="2" width="60" height="60" rx="18" fill="#e63c64" />
                  <path d="M18 44v-9a2.5 2.5 0 0 1 2.5-2.5h23A2.5 2.5 0 0 1 46 35v9" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
                  <path d="M16 44c0-1.4 1.6-2.5 3.5-2.5S23 42.6 23 44s1.6 2.5 3.5 2.5S30 45.4 30 44s1.6-2.5 3.5-2.5S37 42.6 37 44s1.6 2.5 3.5 2.5S44 45.4 44 44" stroke="#ffd9e2" strokeWidth="2.4" strokeLinecap="round" />
                  <path d="M25 28.5v-6M32 26.5v-6M39 28.5v-6" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
                  <circle cx="25" cy="12.5" r="1.4" fill="#ffd9e2" /><circle cx="32" cy="10.5" r="1.4" fill="#ffd9e2" /><circle cx="39" cy="12.5" r="1.4" fill="#ffd9e2" />
                </svg>
              </span>
              <h1 className="font-display text-[26px] font-extrabold tracking-tight text-choco">Cake Delight</h1>
              <p className="mt-1 text-xs font-medium uppercase tracking-[0.28em] text-mut">Admin Panel · Sahiwal</p>
            </div>

            {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2.5, fontSize: 13.5 }}>⚠ {error}</Alert>}

            {/* fields — grid gap so they can never touch */}
            <div className="grid gap-4">
              <TextField
                {...field({
                  label: "Email address",
                  type: "email",
                  value: email,
                  onChange: (e: any) => setEmail(e.target.value),
                  required: true,
                  autoComplete: "email",
                  placeholder: "admin@cakedelight.pk",
                  slotProps: { input: { startAdornment: (<InputAdornment position="start"><MailRoundedIcon sx={{ fontSize: 19 }} /></InputAdornment>) } },
                })}
              />
              <TextField
                {...field({
                  label: "Password",
                  type: showPw ? "text" : "password",
                  value: password,
                  onChange: (e: any) => setPassword(e.target.value),
                  required: true,
                  autoComplete: "current-password",
                  placeholder: "••••••••",
                  slotProps: {
                    input: {
                      startAdornment: (<InputAdornment position="start"><LockRoundedIcon sx={{ fontSize: 19 }} /></InputAdornment>),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPw((v) => !v)} aria-label={showPw ? "Hide password" : "Show password"} edge="end" sx={{ color: "#b39c93" }}>
                            {showPw ? <VisibilityOffRoundedIcon sx={{ fontSize: 19 }} /> : <VisibilityRoundedIcon sx={{ fontSize: 19 }} />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  },
                })}
              />
            </div>

            <Button type="submit" variant="contained" fullWidth size="large" disabled={busy} endIcon={<LoginRoundedIcon />}
              sx={{
                mt: 4, py: 1.7, fontSize: 15.5, fontWeight: 600, borderRadius: 2.5,
                background: "linear-gradient(135deg,#e63c64 0%,#ef5f84 100%)",
                boxShadow: "0 12px 28px rgba(230,60,100,.4)",
                "&:hover": { background: "linear-gradient(135deg,#d42f56 0%,#e34e74 100%)", boxShadow: "0 14px 32px rgba(230,60,100,.5)" },
              }}>
              {busy ? "Signing in…" : "Sign In to Dashboard"}
            </Button>

            <div className="mt-5 rounded-2xl border border-dashed border-[#ecd9d2] bg-[#fdf6f2] px-4 py-3 text-center">
              <p className="text-2xs font-semibold uppercase tracking-[0.18em] text-mut">Admin credentials</p>
              <p className="mt-1 text-xs text-choco">
                <b className="text-pink">admin@cakedelight.pk</b> · password <b className="text-pink">admin123</b>
              </p>
            </div>

            <div className="mt-5 text-center">
              <Link href="/" className="text-xs font-medium text-mut transition hover:text-pink">← Back to website</Link>
            </div>
          </form>
        </div>

        <p className="mt-5 text-center text-2xs text-[#a98d84]">🔒 Secured by Supabase Auth · admin access only</p>
      </motion.div>
    </div>
  );
}
