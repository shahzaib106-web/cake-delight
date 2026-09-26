"use client";
/** Admin dashboard shell — sidebar, topbar, auth guard */
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Avatar from "@mui/material/Avatar";
import { useAdmin } from "@/components/admin-kit";

const NAV = [
  ["Main", [["📊", "Overview", "/admin"]]],
  ["Orders", [
    ["🧾", "Orders", "/admin/orders"],
    ["🎨", "Custom Requests", "/admin/custom-orders"],
  ]],
  ["Catalog", [
    ["🍰", "Products", "/admin/products"],
    ["🍯", "Flavors", "/admin/flavors"],
  ]],
  ["People", [
    ["✉️", "Messages", "/admin/messages"],
    ["⭐", "Testimonials", "/admin/testimonials"],
  ]],
] as const;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const name = useAdmin();
  const pathname = usePathname();
  const router = useRouter();
  if (name === null) return <div className="grid min-h-screen place-items-center bg-cream text-mut">Loading dashboard… 🍰</div>;

  return (
    <div className="grid min-h-screen grid-cols-[250px_1fr] bg-cream max-lg:grid-cols-[70px_1fr]">
      <aside className="sticky top-0 z-40 flex h-screen flex-col bg-choco text-[#d8bfb6]">
        <div className="flex items-center gap-2.5 border-b border-white/10 p-4 max-lg:justify-center">
          <svg className="h-10 w-10 shrink-0" viewBox="0 0 64 64" fill="none" aria-hidden>
            <rect x="2" y="2" width="60" height="60" rx="18" fill="#e63c64" />
            <path d="M18 44v-9a2.5 2.5 0 0 1 2.5-2.5h23A2.5 2.5 0 0 1 46 35v9" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
            <path d="M16 44c0-1.4 1.6-2.5 3.5-2.5S23 42.6 23 44s1.6 2.5 3.5 2.5S30 45.4 30 44s1.6-2.5 3.5-2.5S37 42.6 37 44s1.6 2.5 3.5 2.5S44 45.4 44 44" stroke="#ffd9e2" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M25 28.5v-6M32 26.5v-6M39 28.5v-6" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
          </svg>
          <span className="max-lg:hidden"><b className="block font-display text-lg text-white">Cake Delight</b><small className="text-2xs uppercase tracking-[0.28em] text-[#a98d84]">Admin Panel</small></span>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {NAV.map(([group, items]) => (
            <div key={group}>
              <div className="px-3 pb-1.5 pt-3.5 text-2xs uppercase tracking-[0.2em] text-[#8a6f66] max-lg:hidden">{group}</div>
              {items.map(([em, label, href]) => {
                const active = pathname === href;
                return (
                  <Link key={href} href={href} title={label}
                    className={`mb-0.5 flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition max-lg:justify-center ${active ? "bg-pink text-white shadow-[0_6px_16px_rgba(230,60,100,.35)]" : "text-[#d8bfb6] hover:bg-white/[0.07] hover:text-white"}`}>
                    <span className="w-5 text-center text-base">{em}</span><span className="max-lg:hidden">{label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
        <div className="space-y-1 border-t border-white/10 p-3">
          <Link href="/" target="_blank" className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition hover:bg-white/[0.07] hover:text-white max-lg:justify-center">
            <span className="w-5 text-center">🌐</span><span className="max-lg:hidden">View Website</span>
          </Link>
          <button onClick={() => { localStorage.removeItem("cd_admin_token"); router.replace("/admin/login"); }}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition hover:bg-white/[0.07] hover:text-white max-lg:justify-center">
            <span className="w-5 text-center">🚪</span><span className="max-lg:hidden">Logout</span>
          </button>
        </div>
      </aside>
      <main className="min-w-0 p-7 max-md:p-4">
        <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
          <div><h1 className="font-display text-[27px] font-bold text-choco">{NAV.flatMap(([, items]) => [...items]).find(([, , href]) => href === pathname)?.[1] ?? "Dashboard"}</h1></div>
          <div className="flex items-center gap-2.5 rounded-full border border-line bg-white px-4 py-1.5 text-xs font-semibold shadow-card">
            <Avatar sx={{ width: 32, height: 32, background: "linear-gradient(135deg,#e63c64,#f0899f)", fontFamily: "var(--font-playfair)" }}>{name[0]}</Avatar>
            {name}
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}
