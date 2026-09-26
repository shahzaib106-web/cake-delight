"use client";
/** Site footer — dark chocolate, 4 columns. All contact content comes from site settings (admin-editable). */
import Link from "next/link";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import LocalPhoneRoundedIcon from "@mui/icons-material/LocalPhoneRounded";
import MailRoundedIcon from "@mui/icons-material/MailRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import { Logo } from "./ui";

export default function Footer({ settings }: { settings: Record<string, string> }) {
  const tel = String(settings.contact_phone || "").replace(/[^\d+]/g, "");
  const socials = [
    { icon: <FacebookRoundedIcon sx={{ fontSize: 18 }} />, href: "#", label: "Facebook" },
    { icon: <InstagramIcon sx={{ fontSize: 18 }} />, href: "#", label: "Instagram" },
    { icon: <WhatsAppIcon sx={{ fontSize: 18 }} />, href: `https://wa.me/${settings.whatsapp_number}`, label: "WhatsApp" },
    { icon: <YouTubeIcon sx={{ fontSize: 18 }} />, href: "#", label: "YouTube" },
  ];

  return (
    <footer className="relative mt-4 overflow-hidden bg-choco text-[#d8bfb6]">
      <i className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-pink to-transparent" />
      <div className="mx-auto grid max-w-6xl gap-11 px-6 py-16 md:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1.15fr_1fr]">
        <div>
          <Logo light />
          <p className="mt-4 max-w-[300px] text-sm leading-relaxed">{settings.footer_tagline}</p>
          <div className="mt-5 flex gap-2.5">
            {socials.map((s) => (
              <a key={s.label} href={s.href} aria-label={s.label}
                className="grid h-[42px] w-[42px] place-items-center rounded-xl bg-white/10 text-[#e9cfc7] transition hover:-translate-y-1 hover:bg-pink hover:text-white">
                {s.icon}
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="mb-5 font-display text-md font-bold text-white">Quick Links</h4>
          <ul className="space-y-2.5 text-sm">
            {[["Home", "/"], ["Custom Cakes", "/custom"], ["Gallery", "/gallery"], ["Flavors", "/flavors"], ["About", "/about"], ["Contact", "/contact"], ["My Account", "/account/orders"]].map(([l, h]) => (
              <li key={h}>
                <Link href={h} className="inline-flex items-center gap-2 transition hover:translate-x-1 hover:text-white">
                  <span className="font-bold text-pink">›</span> {l}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-5 font-display text-md font-bold text-white">Contact Us</h4>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <span className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-lg bg-pink/20 text-[#f7a8bd]"><PlaceRoundedIcon sx={{ fontSize: 16 }} /></span>
              <span><b className="font-semibold text-white">Visit Us</b><br />{settings.contact_address}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-lg bg-pink/20 text-[#f7a8bd]"><LocalPhoneRoundedIcon sx={{ fontSize: 16 }} /></span>
              <span><b className="font-semibold text-white">Call / WhatsApp</b><br /><a href={`tel:${tel}`} className="hover:text-white">{settings.contact_phone}</a></span>
            </li>
            <li className="flex items-start gap-3">
              <span className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-lg bg-pink/20 text-[#f7a8bd]"><MailRoundedIcon sx={{ fontSize: 16 }} /></span>
              <span><b className="font-semibold text-white">Email</b><br /><a href={`mailto:${settings.contact_email}`} className="hover:text-white">{settings.contact_email}</a></span>
            </li>
            <li className="flex items-start gap-3">
              <span className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-lg bg-pink/20 text-[#f7a8bd]"><ScheduleRoundedIcon sx={{ fontSize: 16 }} /></span>
              <span><b className="font-semibold text-white">Opening Hours</b><br />{settings.contact_hours}</span>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="mb-5 font-display text-md font-bold text-white">Follow Us</h4>
          <p className="mb-4 text-sm">Follow our daily bakes, behind-the-scenes &amp; offers</p>
          <div className="flex gap-2.5">
            {socials.map((s) => (
              <a key={s.label} href={s.href} aria-label={s.label}
                className="grid h-[42px] w-[42px] place-items-center rounded-xl bg-white/10 text-[#e9cfc7] transition hover:-translate-y-1 hover:bg-pink hover:text-white">
                {s.icon}
              </a>
            ))}
          </div>
          <Link href="/custom" className="mt-5 inline-flex rounded-full bg-pink px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_22px_rgba(230,60,100,.35)] transition hover:-translate-y-0.5">
            Build Custom Cake
          </Link>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3.5 px-6 py-5 text-xs max-sm:flex-col max-sm:justify-center max-sm:text-center">
          <div>© 2026 <b className="text-[#f7a8bd]">Cake Delight</b> — Made with <span className="text-pink">♥</span> in Sahiwal</div>
          <div>{settings.footer_note}</div>
        </div>
      </div>
    </footer>
  );
}
