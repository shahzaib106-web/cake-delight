"use client";
/** Customer session (Supabase Auth) — localStorage + cross-component sync */
import { useCallback, useEffect, useState } from "react";

export interface Customer {
  token: string;
  email: string;
  name: string;
}

const KEY = "cd_customer";
const EVT = "cd-customer-changed";

export function readCustomer(): Customer | null {
  try {
    const c = JSON.parse(localStorage.getItem(KEY) || "null");
    return c?.token ? c : null;
  } catch { return null; }
}

export function writeCustomer(c: Customer | null) {
  if (c) localStorage.setItem(KEY, JSON.stringify(c));
  else localStorage.removeItem(KEY);
  window.dispatchEvent(new Event(EVT));
}

export function useCustomer() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setCustomer(readCustomer());
    setReady(true);
    const on = () => setCustomer(readCustomer());
    window.addEventListener(EVT, on);
    return () => window.removeEventListener(EVT, on);
  }, []);

  const signOut = useCallback(async () => {
    const c = readCustomer();
    if (c) await fetch("/api/auth/signout", { method: "POST", headers: { Authorization: `Bearer ${c.token}` } }).catch(() => {});
    writeCustomer(null);
  }, []);

  return { customer, ready, signOut };
}
