"use client";
/** Admin — site settings (all editable site content) */
import { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import { useAdminApi } from "@/components/admin-kit";

const SETTINGS_SQL = `create table if not exists site_settings (
  key text primary key,
  value text not null default '',
  updated_at timestamptz default now()
);
alter table site_settings enable row level security;`;

type Group = { title: string; icon: string; fields: [string, string, boolean?][] }; // [key, label, multiline]

const GROUPS: Group[] = [
  { title: "Announcement Bar & Contact", icon: "📢", fields: [
    ["announcement", "Announcement bar text"], ["announcement_phone", "Announcement bar phone"],
    ["contact_phone", "Phone / WhatsApp"], ["contact_email", "Email address"],
    ["contact_address", "Shop address", true], ["contact_hours", "Opening hours"], ["whatsapp_number", "WhatsApp number (digits only, e.g. 923001234567)"],
  ]},
  { title: "Homepage Hero", icon: "🏠", fields: [
    ["hero_badge", "Badge text (top pill)"], ["hero_title_1", "Headline (line 1)"],
    ["hero_title_2", "Headline accent (script style)"], ["hero_sub", "Sub-headline paragraph", true],
    ["hero_points", "Checkmark points (separate with |)"],
  ]},
  { title: "About Page", icon: "📖", fields: [
    ["about_sub", "Sub-headline under title"], ["about_heading", "Section heading"],
    ["about_p1", "Story — paragraph 1", true], ["about_p2", "Story — paragraph 2", true],
  ]},
  { title: "Footer", icon: "🦶", fields: [
    ["footer_tagline", "Brand tagline", true], ["footer_note", "Bottom bar note"],
  ]},
  { title: "Social Links (footer icons)", icon: "🔗", fields: [
    ["facebook_url", "Facebook page URL (leave empty to hide icon)"],
    ["instagram_url", "Instagram profile URL (leave empty to hide icon)"],
    ["youtube_url", "YouTube channel URL (leave empty to hide icon)"],
  ]},
];

export default function AdminSettings() {
  const api = useAdminApi();
  const [settings, setSettings] = useState<Record<string, string> | null>(null);
  const [ready, setReady] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    api("/api/admin/settings").then((d) => { setSettings(d.settings); setReady(d.ready); }).catch((e) => setErr(e.message));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const set = (k: string) => (e: any) => setSettings((s) => ({ ...s!, [k]: e.target.value }));

  const save = async () => {
    setSaving(true); setMsg(""); setErr("");
    try {
      const d = await api("/api/admin/settings", { method: "PATCH", body: settings });
      setSettings(d.settings); setReady(d.ready);
      setMsg("Saved! Changes are live on the website. ✨");
    } catch (e: any) { setErr(e.message); }
    setSaving(false);
  };

  return (
    <div className="grid gap-6">
      {!ready && (
        <Alert severity="warning" sx={{ borderRadius: 3 }}>
          <b>The <code>site_settings</code> table is missing in Supabase.</b> Run this SQL once in
          Supabase Studio → SQL Editor, then reload this page:
          <pre className="mt-2 overflow-x-auto rounded-xl bg-white/70 p-3 text-2xs leading-relaxed">{SETTINGS_SQL}</pre>
          <Button size="small" startIcon={<ContentCopyRoundedIcon />} onClick={() => navigator.clipboard?.writeText(SETTINGS_SQL)}>Copy SQL</Button>
        </Alert>
      )}

      <div className="rounded-3xl border border-line bg-white p-6 shadow-card sm:p-8">
        <h2 className="font-display text-xl font-bold text-choco">⚙️ Website Content</h2>
        <p className="mt-1 text-sm text-mut">Edit every text on the storefront — changes go live immediately after saving.</p>

        {err && <p className="mt-4 rounded-lg bg-[#fdeaea] px-3 py-2.5 text-xs text-[#c0392b]">⚠ {err}</p>}
        {msg && <p className="mt-4 rounded-lg bg-[#e8f7ee] px-3 py-2.5 text-xs text-[#1e7d47]">✓ {msg}</p>}

        {!settings ? (
          <p className="py-10 text-center text-mut">Loading settings…</p>
        ) : (
          <div className="mt-6 grid gap-8">
            {GROUPS.map((g) => (
              <div key={g.title}>
                <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-choco">{g.icon} {g.title}</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {g.fields.map(([key, label, multiline]) => (
                    <div key={key} className={multiline ? "sm:col-span-2" : ""}>
                      <TextField label={label} value={settings[key] ?? ""} onChange={set(key)} fullWidth
                        multiline={!!multiline} minRows={multiline ? 2 : undefined} size={multiline ? undefined : "small"} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="sticky-bottom flex justify-end">
              <Button variant="contained" size="large" disabled={saving || !ready} onClick={save} startIcon={<SaveRoundedIcon />}
                sx={{ py: 1.5, px: 4, boxShadow: "0 6px 16px rgba(230,60,100,.3)" }}>
                {saving ? "Saving…" : "Save & Publish"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
