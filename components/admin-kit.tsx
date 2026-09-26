"use client";
/** Admin shared kit — auth-guarded fetch, status pill, confirm dialog */
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

export function useAdminApi() {
  const router = useRouter();
  const call = useCallback(async (path: string, opts: { method?: string; body?: any } = {}) => {
    const token = localStorage.getItem("cd_admin_token") || "";
    const res = await fetch(path, {
      method: opts.method || "GET",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    });
    if (res.status === 401) { localStorage.removeItem("cd_admin_token"); router.replace("/admin/login"); throw new Error("Session expired"); }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Request failed");
    return data;
  }, [router]);
  return call;
}

export function useAdmin() {
  const router = useRouter();
  const [name, setName] = useState<string | null>(null);
  const [offline, setOffline] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let alive = true;
    const token = localStorage.getItem("cd_admin_token");
    if (!token) { router.replace("/admin/login"); return; }
    (async () => {
      // retry transient network failures — a flaky connection must NEVER log the admin out
      for (let tryNo = 0; tryNo < 3; tryNo++) {
        try {
          const r = await fetch("/api/admin/me", { headers: { Authorization: `Bearer ${token}` } });
          if (!alive) return;
          if (r.ok) { setName((await r.json()).admin.name); setOffline(false); return; }
          if (r.status === 401) { localStorage.removeItem("cd_admin_token"); router.replace("/admin/login"); return; }
          throw new Error("server error " + r.status);
        } catch { /* network hiccup — retry */ }
        await new Promise((res) => setTimeout(res, 900 * (tryNo + 1)));
      }
      if (alive) setOffline(true);
    })();
    return () => { alive = false; };
  }, [router, attempt]);
  return { name, offline, retry: () => { setOffline(false); setAttempt((n) => n + 1); } };
}

export function Pill({ status }: { status: string }) {
  return <span className={`st-${status} inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-2xs font-semibold capitalize`}>{status.replace(/-/g, " ")}</span>;
}

export function useConfirm() {
  const [state, setState] = useState<{ open: boolean; title: string; text: string; fn?: () => any }>({ open: false, title: "", text: "" });
  const ask = (title: string, text: string, fn: () => any) => setState({ open: true, title, text, fn });
  const node = (
    <Dialog open={state.open} onClose={() => setState((s) => ({ ...s, open: false }))} slotProps={{ paper: { sx: { borderRadius: 4, background: "#fdf6f2", p: 1 } } }}>
      <DialogTitle sx={{ fontFamily: "var(--font-playfair)", fontWeight: 700, textAlign: "center", pt: 3 }}>🗑 {state.title}</DialogTitle>
      <DialogContent sx={{ color: "#7d6a63", textAlign: "center" }}>{state.text}</DialogContent>
      <DialogActions sx={{ justifyContent: "center", pb: 3, gap: 1.5 }}>
        <Button onClick={() => setState((s) => ({ ...s, open: false }))} variant="text" sx={{ color: "#7d6a63" }}>Cancel</Button>
        <Button onClick={async () => { await state.fn?.(); setState((s) => ({ ...s, open: false })); }} variant="contained" color="error">Yes, delete</Button>
      </DialogActions>
    </Dialog>
  );
  return { ask, node };
}

export const dt = (s: string) => new Date(String(s).replace(" ", "T") + (String(s).includes("Z") ? "" : "Z")).toLocaleString("en-PK", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
