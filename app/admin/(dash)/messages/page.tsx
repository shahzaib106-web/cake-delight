"use client";
/** Admin messages inbox */
import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Button from "@mui/material/Button";
import { useAdminApi, useConfirm, dt } from "@/components/admin-kit";
import type { Message } from "@/lib/types";

export default function AdminMessages() {
  const api = useAdminApi();
  const { ask, node } = useConfirm();
  const [rows, setRows] = useState<Message[] | null>(null);

  const load = useCallback(async () => setRows(await api("/api/admin/messages")), [api]);
  useEffect(() => { load(); }, [load]);

  return (
    <div className="rounded-3xl border border-line bg-white p-5 shadow-card">
      {node}
      <div className="mb-4 font-display text-lg font-bold text-choco">Inbox</div>
      <div className="space-y-3">
        {(rows || []).map((m, i) => (
          <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.04, 0.3) }}
            className={`rounded-2xl border border-line p-5 ${!m.is_read ? "border-l-4 border-l-pink bg-pinkfaint" : "bg-white"}`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <b className="text-sm text-choco">{m.name} {!m.is_read && "🆕"}</b>
              <small className="text-xs text-mut">{m.subject} · {dt(m.created_at)}</small>
            </div>
            <div className="mt-0.5 text-xs text-mut">{m.email || "no email"}{m.phone ? " · " + m.phone : ""}</div>
            <p className="my-2.5 text-sm leading-relaxed text-ink/85">{m.message}</p>
            <div className="flex gap-2">
              {!m.is_read && (
                <Button size="small" variant="outlined" onClick={() => api(`/api/admin/messages/${m.id}`, { method: "PATCH", body: { is_read: true } }).then(load)}>
                  ✓ Mark Read
                </Button>
              )}
              {m.email && <Button size="small" href={`mailto:${m.email}`} variant="text" sx={{ color: "#7d6a63" }}>↩ Reply</Button>}
              <Button size="small" color="error" variant="text"
                onClick={() => ask("Delete message?", "This message will be permanently removed.", async () => { await api(`/api/admin/messages/${m.id}`, { method: "DELETE" }); load(); })}>
                🗑 Delete
              </Button>
            </div>
          </motion.div>
        ))}
        {rows && rows.length === 0 && <p className="py-14 text-center text-mut">📭 No messages yet</p>}
        {!rows && <p className="py-14 text-center text-mut">Loading inbox…</p>}
      </div>
    </div>
  );
}
