"use client";
/** Contact page — info cards + form */
import { useState } from "react";
import Link from "next/link";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { Reveal } from "@/components/ui";
import { useToast } from "@/components/toast";

const INFO = [
  ["📍", "Visit Our Shop", "Main Boulevard, Farooq Colony, Sahiwal, Punjab 57000"],
  ["📞", "Call / WhatsApp", "0300-1234567", "tel:03001234567"],
  ["✉️", "Email Us", "hello@cakedelight.pk", "mailto:hello@cakedelight.pk"],
  ["🕘", "Opening Hours", "Monday – Sunday · 9:00 AM – 10:00 PM"],
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", subject: "General Question", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const toast = useToast();
  const set = (k: string) => (e: any) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const r = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setSent(true);
      setForm({ name: "", phone: "", email: "", subject: "General Question", message: "" });
      toast.show("Message sent! We usually reply within a few hours.");
    } catch (ex: any) { toast.show(ex.message, "error"); }
    setSending(false);
  };

  return (
    <>
      <section className="bg-gradient-to-b from-blush to-cream py-16 text-center">
        <div className="mx-auto max-w-2xl px-6">
          <nav className="mb-4 text-sm text-mut"><Link href="/" className="hover:text-pink">Home</Link> › <span>Contact</span></nav>
          <h1 className="font-display text-4xl font-extrabold text-choco sm:text-5xl">Get in <span className="font-script text-pink">Touch</span></h1>
          <p className="mt-3 text-mut">Questions, custom requests or feedback — we&apos;d love to hear from you</p>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto grid max-w-6xl items-start gap-8 px-6 lg:grid-cols-[1fr_1.25fr]">
          <div className="space-y-4">
            {INFO.map(([em, t, v, href], i) => (
              <Reveal key={t} delay={i * 0.07}>
                <div className="flex items-center gap-4 rounded-3xl border border-line bg-white p-6 shadow-card transition hover:translate-x-1.5 hover:shadow-soft">
                  <span className="grid h-[52px] w-[52px] shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-pinkfaint to-pinksoft text-2xl">{em}</span>
                  <div><b className="block text-base text-choco">{t}</b>
                    {href ? <a href={href} className="text-sm text-mut hover:text-pink">{v}</a> : <p className="text-sm text-mut">{v}</p>}
                  </div>
                </div>
              </Reveal>
            ))}
            <Reveal delay={0.3}>
              <div className="flex items-center gap-4 rounded-3xl bg-choco p-6 shadow-soft">
                <span className="grid h-[52px] w-[52px] shrink-0 place-items-center rounded-2xl bg-pink/25 text-2xl">🚚</span>
                <div><b className="block text-base text-white">Same-Day Delivery</b><p className="text-sm text-[#e8cdc4]">Order by 2 PM for same-day delivery anywhere in Sahiwal</p></div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <form onSubmit={submit} className="rounded-3xl border border-line bg-white p-8 shadow-soft">
              <h2 className="mb-6 font-display text-2xl font-bold text-choco">Send us a Message 💬</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField label="Your name *" required value={form.name} onChange={set("name")} placeholder="e.g. Usman Ali" />
                <TextField label="Phone / WhatsApp" value={form.phone} onChange={set("phone")} placeholder="03XX-XXXXXXX" />
                <TextField type="email" label="Email" value={form.email} onChange={set("email")} placeholder="you@example.com" />
                <TextField select label="Subject" value={form.subject} onChange={set("subject")}>
                  {["General Question", "Custom Cake Order", "Event / Wedding Cake", "Delivery Question", "Feedback"].map((s) => <MenuItem key={s}>{s}</MenuItem>)}
                </TextField>
              </div>
              <div className="mt-4">
                <TextField label="Your message *" required multiline minRows={4} value={form.message} onChange={set("message")} placeholder="Tell us about your cake needs, dates, servings…" />
              </div>
              <Button type="submit" variant="contained" disabled={sending} endIcon={<SendRoundedIcon />} fullWidth size="large"
                sx={{ mt: 3, py: 1.6, fontSize: 15, boxShadow: "0 8px 22px rgba(230,60,100,.32)" }}>
                {sending ? "Sending…" : "Send Message"}
              </Button>
              {sent && <p className="mt-4 rounded-xl bg-[#e3f9ec] px-4 py-3 text-center text-xs font-semibold text-[#229954]">✅ Message sent! We usually reply within a few hours.</p>}
            </form>
          </Reveal>
        </div>
      </section>
    </>
  );
}
