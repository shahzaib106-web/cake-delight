"use client";
/** Checkout — delivery details + COD + order placement */
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { useCart } from "@/components/cart";
import { useCustomer } from "@/components/customer";
import { useToast } from "@/components/toast";
import { rs } from "@/lib/types";

export default function CheckoutPage() {
  const cart = useCart();
  const router = useRouter();
  const toast = useToast();
  const [sending, setSending] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [f, setF] = useState({ name: "", phone: "", email: "", address: "", city: "Sahiwal", date: "", slot: "anytime", notes: "" });

  useEffect(() => {
    // wait until the cart has hydrated from localStorage before deciding it's empty;
    // never redirect after an order was successfully placed (cart is cleared then)
    if (!placed && cart.ready && !cart.items.length) router.replace("/cart");
    if (!f.date) {
      const d = new Date(); d.setDate(d.getDate() + 1);
      setF((s) => ({ ...s, date: d.toISOString().slice(0, 10) }));
    }
  }, [placed, cart.ready, cart.items.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const set = (k: string) => (e: any) => setF((s) => ({ ...s, [k]: e.target.value }));

  // prefill from signed-in customer
  const { customer } = useCustomer();
  useEffect(() => {
    if (customer) setF((s) => ({ ...s, name: s.name || customer.name, email: s.email || customer.email }));
  }, [customer]); // eslint-disable-line react-hooks/exhaustive-deps

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const r = await fetch("/api/orders", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: f.name, phone: f.phone, email: f.email, address: f.address, city: f.city,
          delivery_date: f.date, delivery_slot: f.slot, notes: f.notes,
          items: cart.items.map((i) => ({ product_id: i.product_id, qty: i.qty, size: i.size, flavor: i.flavor, message: i.message })),
        }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setPlaced(true);
      cart.clear();
      router.push(`/order-success?order=${encodeURIComponent(d.order_no)}`);
    } catch (ex: any) { toast.show(ex.message, "error"); setSending(false); }
  };

  return (
    <>
      <section className="bg-gradient-to-b from-blush to-cream py-14 text-center">
        <div className="mx-auto max-w-2xl px-6">
          <nav className="mb-4 text-sm text-mut"><Link href="/" className="hover:text-pink">Home</Link> › <Link href="/cart" className="hover:text-pink">Cart</Link> › <span>Checkout</span></nav>
          <h1 className="font-display text-4xl font-extrabold text-choco">Checkout <span className="font-script text-pink">— almost there!</span></h1>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto grid max-w-6xl items-start gap-8 px-6 lg:grid-cols-[1.5fr_1fr]">
          <form onSubmit={submit} className="space-y-5">
            <div className="rounded-3xl border border-line bg-white p-8 shadow-card">
              <h2 className="mb-6 flex items-center gap-2.5 font-display text-xl font-bold text-choco">
                <span className="grid h-[30px] w-[30px] place-items-center rounded-full bg-pink text-sm font-bold text-white">1</span> Delivery Details
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField label="Full name *" required value={f.name} onChange={set("name")} placeholder="e.g. Ayesha Malik" />
                <TextField label="Phone / WhatsApp *" required value={f.phone} onChange={set("phone")} placeholder="03XX-XXXXXXX" />
                <TextField type="email" label="Email (optional)" value={f.email} onChange={set("email")} placeholder="you@example.com" />
                <TextField label="City" value={f.city} onChange={set("city")} />
              </div>
              <div className="mt-4">
                <TextField label="Delivery address *" required multiline minRows={2} value={f.address} onChange={set("address")} placeholder="House #, street, area — e.g. House 42, Street 5, Farooq Colony, Sahiwal" />
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <TextField type="date" label="Delivery date *" required value={f.date} onChange={set("date")} slotProps={{ htmlInput: { min: new Date().toISOString().slice(0, 10) } }} />
                <TextField select label="Preferred time slot" value={f.slot} onChange={set("slot")}>
                  <MenuItem value="anytime">Anytime (9 AM – 10 PM)</MenuItem>
                  <MenuItem value="morning">Morning (9 AM – 12 PM)</MenuItem>
                  <MenuItem value="afternoon">Afternoon (12 PM – 4 PM)</MenuItem>
                  <MenuItem value="evening">Evening (4 PM – 10 PM)</MenuItem>
                </TextField>
                <TextField label="Order notes (optional)" value={f.notes} onChange={set("notes")} placeholder="e.g. Please call before delivery" />
              </div>
            </div>

            <div className="rounded-3xl border border-line bg-white p-8 shadow-card">
              <h2 className="mb-6 flex items-center gap-2.5 font-display text-xl font-bold text-choco">
                <span className="grid h-[30px] w-[30px] place-items-center rounded-full bg-pink text-sm font-bold text-white">2</span> Payment Method
              </h2>
              <label className="flex cursor-pointer items-center gap-4 rounded-2xl border-[1.5px] border-pink bg-pinkfaint p-5">
                <span className="grid h-11 w-11 place-items-center rounded-xl border border-line2 bg-white text-xl">💵</span>
                <span><b className="block text-base text-choco">Cash on Delivery</b><small className="text-xs text-mut">Pay when your delicious cake arrives — available across Sahiwal</small></span>
              </label>
            </div>

            <Button type="submit" variant="contained" size="large" disabled={sending} fullWidth
              sx={{ py: 2, fontSize: 16, boxShadow: "0 8px 22px rgba(230,60,100,.32)" }}>
              {sending ? "Placing your order…" : "Place Order · Cash on Delivery"}
            </Button>
            <p className="text-center text-xs text-mut">🔒 Your details are only used to deliver your order.</p>
          </form>

          <aside className="sticky top-24 rounded-3xl border border-line bg-white p-7 shadow-soft">
            <h3 className="mb-5 font-display text-xl font-bold text-choco">Your Order</h3>
            {cart.items.map((i) => (
              <div key={i.key} className="mb-3 flex justify-between gap-3 text-sm">
                <span className="max-w-[65%] text-mut">{i.name} × {i.qty}<br /><small className="text-xs">{i.size}{i.flavor ? " · " + i.flavor : ""}</small></span>
                <b className="text-choco">{rs(i.price * i.qty)}</b>
              </div>
            ))}
            <div className="mt-4 space-y-2.5 border-t border-line pt-4 text-sm text-mut">
              <div className="flex justify-between"><span>Subtotal</span><b className="text-choco">{rs(cart.subtotal)}</b></div>
              <div className="flex justify-between"><span>Delivery</span><b className="text-choco">{cart.deliveryFee === 0 ? "FREE" : rs(cart.deliveryFee)}</b></div>
            </div>
            <div className="mt-4 flex items-center justify-between border-t-[1.5px] border-dashed border-line2 pt-4">
              <span className="font-semibold text-choco">Total</span>
              <b className="font-display text-2xl font-extrabold text-pink">{rs(cart.total)}</b>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
