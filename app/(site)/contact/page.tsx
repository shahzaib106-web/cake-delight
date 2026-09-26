"use client";
/** Contact page — info cards (admin-editable) + roomy message form */
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { Reveal } from "@/components/ui";
import { useToast } from "@/components/toast";
import { useCustomer } from "@/components/customer";

/* taller, softer MUI fields */
const roomy = {
  "& .MuiOutlinedInput-root": { borderRadius: "14px", fontSize: 15, bg: "#fff" },
  "& .MuiOutlinedInput-input": { padding: "17px 15px" },
  "& .MuiInputBase-inputMultiline": { padding: "16px 15px", lineHeight: 1.75 },
  "& .MuiInputLabel-root": { fontSize: 14 },
};

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", subject: "General Question", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [wa, setWa] = useState("923001234567");
  const [info, setInfo] = useState<{ icon: string; title: string; value: string; href?: string }[]>([
    { icon: "📍", title: "Visit Our Shop", value: "Main Boulevard, Farooq Colony, Sahiwal, Punjab 57000" },
    { icon: "📞", title: "Call / WhatsApp", value: "0300-1234567", href: "tel:03001234567" },
    { icon: "✉️", title: "Email Us", value: "hello@cakedelight.pk", href: "mailto:hello@cakedelight.pk" },
    { icon: "🕘", title: "Opening Hours", value: "Monday – Sunday · 9:00 AM – 10:00 PM" },
  ]);
  const { customer } = useCustomer();
  const toast = useToast();
  const set = (k: string) => (e: any) => setForm((f) => ({ ...f, [k]: e.target.value }));

  useEffect(() => {
    fetch("/api/settings").then((r) => r.json()).then((s: Record<string, string>) => {
      const tel = String(s.contact_phone || "").replace(/[^\d+]/g, "");
      setInfo([
        { icon: "📍", title: "Visit Our Shop", value: s.contact_address },
        { icon: "📞", title: "Call / WhatsApp", value: s.contact_phone, href: `tel:${tel}` },
        { icon: "✉️", title: "Email Us", value: s.contact_email, href: `mailto:${s.contact_email}` },
        { icon: "🕘", title: "Opening Hours", value: s.contact_hours },
      ]);
    }).catch(() => {});
  }, []);

  // prefill from signed-in customer
  useEffect(() => {
    if (customer) setForm((f) => ({ ...f, name: f.name || customer.name, email: f.email || customer.email }));
  }, [customer]);

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
      <section className="bg-gradient-to-b from-blush to-cream py-12 text-center sm:py-14">
        <div className="mx-auto max-w-2xl px-6">
          <nav className="mb-4 text-sm text-mut"><Link href="/" className="hover:text-pink">Home</Link> › <span>Contact</span></nav>
          <h1 className="font-display text-4xl font-extrabold text-choco sm:text-5xl">Get in <span className="font-script text-pink">Touch</span></h1>
          <p className="mt-3 text-mut">Questions, custom requests or feedback — we&apos;d love to hear from you</p>
        </div>
      </section>

      <section className="py-14 lg:py-16">
        <div className="mx-auto grid max-w-6xl items-start gap-10 px-6 lg:grid-cols-[1fr_1.3fr]">
          <div className="space-y-5">
            {info.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.07}>
                <div className="flex items-center gap-4 rounded-3xl border border-line bg-white p-6.5 shadow-card transition hover:translate-x-1.5 hover:shadow-soft">
                  <span className="grid h-[54px] w-[54px] shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-pinkfaint to-pinksoft text-2xl">{c.icon}</span>
                  <div><b className="block text-base text-choco">{c.title}</b>
                    {c.href ? <a href={c.href} className="text-sm text-mut hover:text-pink">{c.value}</a> : <p className="text-sm text-mut">{c.value}</p>}
                  </div>
                </div>
              </Reveal>
            ))}
            <Reveal delay={0.3}>
              <div className="flex items-center gap-4 rounded-3xl bg-choco p-6.5 shadow-soft">
                <span className="grid h-[54px] w-[54px] shrink-0 place-items-center rounded-2xl bg-pink/25 text-2xl">🚚</span>
                <div><b className="block text-base text-white">Same-Day Delivery</b><p className="text-sm text-[#e8cdc4]">Order by 2 PM for same-day delivery anywhere in Sahiwal</p></div>
              </div>
            </Reveal>
            <Reveal delay={0.36}>
              <div className="rounded-3xl border border-line bg-blush/60 p-6.5 text-center">
                <b className="block font-display text-lg text-choco">Prefer WhatsApp? 💬</b>
                <p className="mt-1 mb-4 text-sm text-mut">Send us your design ideas directly — we reply fast</p>
                <a href="https://wa.me/923001234567" target="_blank" rel="noopener noreferrer" data-wa="contact"
                  className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(37,211,102,.35)] transition hover:-translate-y-0.5">
                  Chat on WhatsApp
                </a>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <form onSubmit={submit} className="relative overflow-hidden rounded-[28px] border border-line bg-white shadow-soft">
              <i className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-pink via-[#f0899f] to-gold" />
              <div className="p-7 sm:p-9 lg:p-10">
                <div className="mb-7 flex items-center gap-4">
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-pink to-[#f0899f] text-2xl shadow-[0_8px_20px_rgba(230,60,100,.35)]">💬</span>
                  <div>
                    <h2 className="font-display text-2xl font-bold text-choco sm:text-[27px]">Send us a Message 💬</h2>
                    <p className="mt-0.5 text-sm text-mut">We usually reply within a few hours</p>
                  </div>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <TextField label="Your name *" required value={form.name} onChange={set("name")} placeholder="e.g. Usman Ali" sx={roomy} />
                  <TextField label="Phone / WhatsApp" value={form.phone} onChange={set("phone")} placeholder="03XX-XXXXXXX" sx={roomy} />
                  <TextField type="email" label="Email" value={form.email} onChange={set("email")} placeholder="you@example.com" sx={roomy} />
                  <TextField select label="Subject" value={form.subject} onChange={set("subject")} sx={roomy}>
                    {["General Question", "Custom Cake Order", "Event / Wedding Cake", "Delivery Question", "Feedback"].map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                  </TextField>
                </div>
                <div className="mt-5">
                  <TextField label="Your message *" required multiline minRows={7} value={form.message} onChange={set("message")}
                    placeholder="Tell us about your cake needs, dates, servings, theme ideas…" sx={roomy} />
                </div>
                <Button type="submit" variant="contained" disabled={sending} endIcon={<SendRoundedIcon />} fullWidth size="large"
                  sx={{ mt: 6, py: 2, fontSize: 16, borderRadius: "14px", boxShadow: "0 10px 26px rgba(230,60,100,.35)" }}>
                  {sending ? "Sending…" : "Send Message"}
                </Button>
                {sent && (
                  <motion.p initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35 }}
                    className="mt-5 rounded-2xl border border-[#bfe8d0] bg-[#e3f9ec] px-5 py-4 text-center text-sm font-semibold text-[#229954]">
                    ✅ Message sent! We usually reply within a few hours.
                  </motion.p>
                )}
              </div>
            </form>
          </Reveal>
        </div>
      </section>
    </>
  );
}
