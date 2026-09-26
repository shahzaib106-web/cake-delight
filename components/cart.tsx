"use client";
/** Shopping cart context — localStorage persisted */
import { createContext, useContext, useEffect, useState } from "react";
import type { CartItem } from "@/lib/types";

const KEY = "cd_cart_v2";
interface CartApi {
  items: CartItem[];
  count: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  ready: boolean;
  add: (item: Omit<CartItem, "key">) => void;
  updateQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
}

const CartCtx = createContext<CartApi | null>(null);
export const useCart = () => {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

export default function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try { setItems(JSON.parse(localStorage.getItem(KEY) || "[]")); } catch { setItems([]); }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(KEY, JSON.stringify(items));
  }, [items, ready]);

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const deliveryFee = subtotal >= 3000 || subtotal === 0 ? 0 : 200;

  const api: CartApi = {
    items,
    ready,
    count: items.reduce((s, i) => s + i.qty, 0),
    subtotal,
    deliveryFee,
    total: subtotal + deliveryFee,
    add: (item) => {
      const key = `${item.product_id}|${item.size}|${item.flavor}|${item.message}`;
      setItems((prev) => {
        const found = prev.find((i) => i.key === key);
        if (found) return prev.map((i) => (i.key === key ? { ...i, qty: Math.min(i.qty + item.qty, 20) } : i));
        return [...prev, { ...item, key }];
      });
    },
    updateQty: (key, qty) => setItems((prev) => prev.map((i) => (i.key === key ? { ...i, qty: Math.max(1, Math.min(20, qty)) } : i))),
    remove: (key) => setItems((prev) => prev.filter((i) => i.key !== key)),
    clear: () => setItems([]),
  };

  return <CartCtx.Provider value={api}>{children}</CartCtx.Provider>;
}
