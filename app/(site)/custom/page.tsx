"use client";
/** Custom cake builder — 4 animated steps */
import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { useToast } from "@/components/toast";
import type { Flavor } from "@/lib/types";

const OCCASIONS = ["🎂 Birthday", "💍 Wedding", "👶 Kids Party", "❤️ Anniversary", "🎓 Graduation", "🏢 Corporate"];
const SIZES = [["Small · 1.5 lb", "Serves 8–10", 8], ["Medium · 2.5 lb", "Serves 12–16", 12], ["Large · 4 lb", "Serves 20–25", 20], ["Extra Large · 6 lb", "Serves 30–35", 30]] as const;
const STEPS = ["Select Design", "Pick a Flavor", "Size & Details", "Message & Date"];

export default function CustomPage() {
  const [step, setStep] = useState(0);
  const [occasion, setOccasion] = useState("");
  const [design, setDesign] = useState("");
  const [flavor, setFlavor] = useState("");
  const [size, setSize] = useState("");
  const [servings, setServings] = useState(12);
  const [budget, setBudget] = useState("");
  const [cakeMsg, setCakeMsg] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [flavors, setFlavors] = useState<Flavor[]>([]);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => { fetch("/api/flavors").then((r) => r.json()).then(setFlavors).catch(() => {}); }, []);

  const [designError, setDesignError] = useState(false);

  const next = () => {
    let err = "";
    if (step === 0) {
      if (!occasion) err = "Please pick an occasion first 🎈";
      else if (design.trim().length < 8) { err = "Please describe your dream design — min 8 characters ✍️"; setDesignError(true); }
      else setDesignError(false);
    }
    if (!err && step === 1 && !flavor) err = "Please choose a flavor first 🍰";
    if (!err && step === 2 && !size) err = "Please select a cake size 🎂";
    if (err) return toast.show(err, "error");
    setStep((s) => s + 1);
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  const submit = async () => {
    if (!name.trim() || !phone.trim()) return toast.show("Please fill in your name & phone", "error");
    setSending(true);
    try {
      const r = await fetch("/api/custom-orders", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, occasion, design, flavor, size, servings, delivery_date: date, message: cakeMsg, budget }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Failed");
      setDone(data.ref_no);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e: any) { toast.show(e.message, "error"); setSending(false); }
  };

  if (done) {
    return (
      <section className="py-20">
        <div className="mx-auto max-w-xl px-6 text-center">
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 18 }} className="block text-7xl">🎉</motion.span>
          <h1 className="mt-4 font-display text-3xl font-extrabold text-choco">Custom Cake Request Received!</h1>
          <p className="mx-auto mt-3 max-w-md text-mut">
            Thank you {name.split(" ")[0]}! Our cake designer will call you on <b className="text-ink">{phone}</b> within 2 hours to discuss your dream cake.
          </p>
          <div className="my-5 inline-block rounded-full bg-pinkfaint px-6 py-3 font-display text-lg font-bold tracking-wide text-pink">{done}</div>
          <p className="text-sm text-mut">Save this reference number for follow-ups.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/gallery" className="rounded-full bg-pink px-7 py-3 font-semibold text-white shadow-[0_8px_22px_rgba(230,60,100,.3)] transition hover:bg-pink2">Browse Gallery</Link>
            <Link href="/" className="rounded-full border-2 border-pink px-7 py-3 font-semibold text-pink transition hover:bg-pink hover:text-white">Back Home</Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="bg-gradient-to-b from-blush to-cream py-16 text-center">
        <div className="mx-auto max-w-2xl px-6">
          <nav className="mb-4 text-sm text-mut"><Link href="/" className="hover:text-pink">Home</Link> › <span>Custom Cakes</span></nav>
          <h1 className="font-display text-4xl font-extrabold text-choco sm:text-5xl">Build Your <span className="font-script text-pink">Custom Cake</span></h1>
          <p className="mt-3 text-mut">Create a cake that&apos;s uniquely yours in just a few steps</p>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-3xl px-6">
          <Stepper activeStep={step} alternativeLabel sx={{ mb: 5, "& .MuiStepIcon-root": { color: "#f0ded7" }, "& .MuiStepIcon-root.Mui-active": { color: "#e63c64" }, "& .MuiStepIcon-root.Mui-completed": { color: "#e63c64" } }}>
            {STEPS.map((s) => <Step key={s}><StepLabel sx={{ "& .MuiStepLabel-label": { fontSize: 13 } }}>{s}</StepLabel></Step>)}
          </Stepper>

          <div className="rounded-3xl border border-line bg-white p-7 shadow-soft sm:p-9">
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, x: 26 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -26 }} transition={{ duration: 0.3 }}>
                {step === 0 && (
                  <>
                    <h2 className="font-display text-2xl font-bold text-choco">What&apos;s the occasion? 🎉</h2>
                    <p className="mb-6 mt-1 text-sm text-mut">Choose a theme or share your own idea — we love creative requests!</p>
                    <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3">
                      {OCCASIONS.map((o) => (
                        <button key={o} onClick={() => setOccasion(o)}
                          className={`rounded-2xl border-[1.5px] p-5 text-center transition ${occasion === o ? "border-pink bg-pinkfaint shadow-[0_0_0_3px_#fdeef2]" : "border-line2 bg-white hover:border-pink"}`}>
                          <span className="mb-2 block text-3xl">{o.split(" ")[0]}</span>
                          <b className="text-sm text-choco">{o.split(" ").slice(1).join(" ")}</b>
                        </button>
                      ))}
                    </div>
                    <div className="mt-6">
                      <TextField label="Describe your dream design *" multiline minRows={3} value={design}
                        onChange={(e) => { setDesign(e.target.value); if (designError && e.target.value.trim().length >= 8) setDesignError(false); }}
                        error={designError}
                        helperText={designError ? "A few more words help our designer create your dream cake (min 8 characters)" : `${design.length} / 800`}
                        slotProps={{ htmlInput: { maxLength: 800 } }} placeholder="e.g. A two-tier pink and gold cake with roses on top, 'Happy Birthday Ayesha' written on it…" />
                    </div>
                  </>
                )}
                {step === 1 && (
                  <>
                    <h2 className="font-display text-2xl font-bold text-choco">Pick a Flavor 🍰</h2>
                    <p className="mb-6 mt-1 text-sm text-mut">Explore our delicious flavors — all made fresh with premium ingredients</p>
                    <div className="grid gap-3.5 sm:grid-cols-3">
                      {flavors.map((f) => (
                        <button key={f.id} onClick={() => setFlavor(f.name)}
                          className={`relative rounded-2xl border-[1.5px] p-4 text-left transition ${flavor === f.name ? "border-pink bg-pinkfaint shadow-[0_0_0_3px_#fdeef2]" : "border-line2 bg-white hover:border-pink"}`}>
                          <span className="absolute right-3 top-3 rounded-full bg-pinkfaint px-2 py-0.5 text-2xs font-semibold uppercase tracking-wide text-pink">{f.tag}</span>
                          <b className="block text-base text-choco">{f.name}</b>
                          <small className="mt-1 block text-xs leading-snug text-mut">{f.description}</small>
                        </button>
                      ))}
                    </div>
                  </>
                )}
                {step === 2 && (
                  <>
                    <h2 className="font-display text-2xl font-bold text-choco">Choose Your Cake Size 🎂</h2>
                    <p className="mb-6 mt-1 text-sm text-mut">Pick a size based on how many guests you&apos;re expecting</p>
                    <div className="grid grid-cols-2 gap-3.5">
                      {SIZES.map(([t, s, n]) => (
                        <button key={t} onClick={() => { setSize(t); setServings(n); }}
                          className={`rounded-2xl border-[1.5px] p-5 text-center transition ${size === t ? "border-pink bg-pinkfaint shadow-[0_0_0_3px_#fdeef2]" : "border-line2 bg-white hover:border-pink"}`}>
                          <span className="mb-2 block text-3xl">🍰</span>
                          <b className="block text-sm text-choco">{t}</b>
                          <small className="text-xs text-mut">{s}</small>
                        </button>
                      ))}
                    </div>
                    <div className="mt-6 max-w-xs">
                      <TextField select label="Your budget (optional)" value={budget} onChange={(e) => setBudget(e.target.value)}>
                        <MenuItem value="">Not sure yet — suggest me</MenuItem>
                        <MenuItem value="Under Rs. 3,000">Under Rs. 3,000</MenuItem>
                        <MenuItem value="Rs. 3,000 – 5,000">Rs. 3,000 – 5,000</MenuItem>
                        <MenuItem value="Rs. 5,000 – 8,000">Rs. 5,000 – 8,000</MenuItem>
                        <MenuItem value="Rs. 8,000+">Rs. 8,000+</MenuItem>
                      </TextField>
                    </div>
                  </>
                )}
                {step === 3 && (
                  <>
                    <h2 className="font-display text-2xl font-bold text-choco">Final Touches ✨</h2>
                    <p className="mb-6 mt-1 text-sm text-mut">Add a special message, pick your delivery date and leave your contact details</p>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <TextField label="Message on the cake" value={cakeMsg} onChange={(e) => setCakeMsg(e.target.value)} slotProps={{ htmlInput: { maxLength: 60 } }} placeholder="e.g. Happy 25th Anniversary!" />
                      <TextField type="date" label="Delivery date *" value={date} onChange={(e) => setDate(e.target.value)} slotProps={{ htmlInput: { min: new Date().toISOString().slice(0, 10) } }} />
                      <TextField label="Your name *" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ayesha Malik" />
                      <TextField label="Phone / WhatsApp *" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="03XX-XXXXXXX" />
                    </div>
                    <div className="mt-4">
                      <TextField type="email" label="Email (optional)" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex items-center justify-between gap-3.5">
              <Button variant="text" disabled={step === 0} onClick={() => setStep((s) => s - 1)} startIcon={<ArrowBackRoundedIcon />} sx={{ color: "#7d6a63" }}>
                Back
              </Button>
              {step < 3 ? (
                <Button variant="contained" onClick={next} endIcon={<ArrowForwardRoundedIcon />} sx={{ py: 1.4, px: 3.5, boxShadow: "0 8px 22px rgba(230,60,100,.32)" }}>
                  Next: {STEPS[step + 1]}
                </Button>
              ) : (
                <Button variant="contained" onClick={submit} disabled={sending} endIcon={<SendRoundedIcon />} sx={{ py: 1.4, px: 3.5, fontSize: 15, boxShadow: "0 8px 22px rgba(230,60,100,.32)" }}>
                  {sending ? "Sending…" : "Submit Custom Request 🎉"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
