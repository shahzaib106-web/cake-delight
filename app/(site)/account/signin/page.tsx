"use client";
/** Customer sign in / create account */
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import MarkEmailReadRoundedIcon from "@mui/icons-material/MarkEmailReadRounded";
import { writeCustomer, useCustomer } from "@/components/customer";

export default function SignInPage() {
  const router = useRouter();
  const { customer, ready } = useCustomer();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [mailed, setMailed] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setError(""); setMailed("");
    try {
      const r = await fetch(`/api/auth/${mode === "signin" ? "signin" : "signup"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mode === "signin" ? { email, password } : { name, email, password }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Something went wrong");
      if (mode === "signin") {
        writeCustomer({ token: d.token, email: d.user.email, name: d.user.name || "" });
        router.push("/account/orders");
      } else if (d.confirmed) {
        // project has email confirmation off — signed up & in immediately
        const s = await fetch("/api/auth/signin", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }).then((x) => x.json());
        if (s.token) { writeCustomer({ token: s.token, email: s.user.email, name: s.user.name || "" }); router.push("/account/orders"); }
        else setMailed(d.message);
      } else {
        setMailed(d.message);
        setMode("signin");
      }
    } catch (ex: any) { setError(ex.message); }
    setBusy(false);
  };

  return (
    <>
      <section className="bg-gradient-to-b from-blush to-cream py-12 sm:py-14 text-center">
        <div className="mx-auto max-w-2xl px-6">
          <nav className="mb-4 text-sm text-mut"><Link href="/" className="hover:text-pink">Home</Link> › <span>My Account</span></nav>
          <h1 className="font-display text-4xl font-extrabold text-choco sm:text-5xl">
            {mode === "signin" ? <>Welcome <span className="font-script text-pink">Back!</span></> : <>Join Cake <span className="font-script text-pink">Delight</span></>}
          </h1>
          <p className="mt-3 text-mut">
            {mode === "signin" ? "Sign in to track your orders and custom cake requests" : "Create an account to track orders and check out faster"}
          </p>
        </div>
      </section>

      <section className="py-10 sm:py-12">
        <div className="mx-auto max-w-md px-6">
          {ready && customer && (
            <div className="mb-6 rounded-3xl border border-line bg-white p-6 text-center shadow-card">
              <p className="text-sm text-mut">You&apos;re signed in as</p>
              <b className="mt-1 block font-display text-lg text-choco">{customer.name || customer.email}</b>
              <Link href="/account/orders" className="mt-4 inline-flex rounded-full bg-pink px-6 py-2.5 text-sm font-semibold text-white shadow-[0_8px_22px_rgba(230,60,100,.3)] transition hover:bg-pink2">
                View My Orders →
              </Link>
            </div>
          )}

          {mailed && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex items-start gap-3 rounded-2xl border border-line bg-pinkfaint p-4 text-sm text-choco shadow-card">
              <MarkEmailReadRoundedIcon sx={{ color: "#e63c64", mt: 0.5 }} />
              <span>{mailed}</span>
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="rounded-3xl border border-line bg-white p-7 shadow-card sm:p-9">
            {/* mode tabs */}
            <div className="mb-6 grid grid-cols-2 gap-1.5 rounded-full bg-cream2 p-1.5">
              {(["signin", "signup"] as const).map((m) => (
                <button key={m} type="button" onClick={() => { setMode(m); setError(""); }}
                  className={`rounded-full py-2.5 text-sm font-semibold transition ${mode === m ? "bg-pink text-white shadow-[0_6px_16px_rgba(230,60,100,.3)]" : "text-choco hover:text-pink"}`}>
                  {m === "signin" ? "Sign In" : "Create Account"}
                </button>
              ))}
            </div>

            <form onSubmit={submit} className="grid gap-4">
              {error && <p className="rounded-lg bg-[#fdeaea] px-3 py-2.5 text-xs text-[#c0392b]">⚠ {error}</p>}
              {mode === "signup" && (
                <TextField label="Your name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ayesha Malik" required />
              )}
              <TextField type="email" label="Email address" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required autoComplete="email" />
              <TextField type="password" label="Password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === "signup" ? "At least 6 characters" : "••••••••"} required autoComplete={mode === "signin" ? "current-password" : "new-password"} />
              <Button type="submit" variant="contained" size="large" disabled={busy}
                startIcon={mode === "signin" ? <LoginRoundedIcon /> : <PersonAddAltRoundedIcon />}
                sx={{ py: 1.6, fontSize: 15, boxShadow: "0 8px 22px rgba(230,60,100,.32)" }}>
                {busy ? "Please wait…" : mode === "signin" ? "Sign In" : "Create Account 🎉"}
              </Button>
            </form>

            {mode === "signup" && (
              <p className="mt-4 text-center text-xs leading-relaxed text-mut">
                We&apos;ll send a confirmation email to activate your account. Your email is stored securely in our Supabase database.
              </p>
            )}
          </motion.div>
        </div>
      </section>
    </>
  );
}
