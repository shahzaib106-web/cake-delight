"use client";
/** Site header — announcement bar, sticky nav, cart badge, mobile drawer */
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Badge from "@mui/material/Badge";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ShoppingBagRoundedIcon from "@mui/icons-material/ShoppingBagRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { useCart } from "./cart";
import { Logo } from "./ui";

const LINKS = [
  ["Custom Cakes", "/custom"],
  ["Gallery", "/gallery"],
  ["Flavors", "/flavors"],
  ["About", "/about"],
  ["Contact", "/contact"],
];

export default function Header() {
  const pathname = usePathname();
  const cart = useCart();
  const [open, setOpen] = useState(false);
  const active = (href: string) => (href === "/custom" ? pathname === href : pathname.startsWith(href));

  return (
    <>
      <div className="bg-choco2 px-4 py-2 text-center text-sm font-medium text-[#f6e7e0]">
        🍰 <b className="text-[#ffd9e2]">Custom cakes</b> for birthdays, weddings &amp; special events in Sahiwal · 📞 <b className="text-[#ffd9e2]">0300-1234567</b>
      </div>
      <header className="sticky top-0 z-40 border-b border-line bg-cream/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[74px] max-w-6xl items-center justify-between gap-5 px-6">
          <Link href="/" aria-label="Cake Delight home"><Logo /></Link>
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {LINKS.map(([label, href]) => (
              <Link key={href} href={href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${active(href) ? "bg-pinkfaint font-semibold text-pink" : "text-ink hover:bg-pinkfaint hover:text-pink"}`}>
                {label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2.5">
            <Link href="/cart" aria-label="Cart" className="grid h-11 w-11 place-items-center rounded-full bg-pinkfaint text-choco transition hover:bg-pinksoft hover:text-pink">
              <Badge badgeContent={cart.count} color="primary" sx={{ "& .MuiBadge-badge": { transform: "scale(.9)" } }}>
                <ShoppingBagRoundedIcon sx={{ fontSize: 21 }} />
              </Badge>
            </Link>
            <Link href="/custom" className="hidden rounded-full bg-pink px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_22px_rgba(230,60,100,.32)] transition hover:-translate-y-0.5 hover:bg-pink2 sm:inline-flex">
              Order Custom Cake
            </Link>
            <button onClick={() => setOpen(true)} aria-label="Menu" className="grid h-11 w-11 place-items-center rounded-xl bg-pinkfaint text-choco lg:hidden">
              <MenuRoundedIcon />
            </button>
          </div>
        </div>
      </header>

      <Drawer open={open} onClose={() => setOpen(false)} slotProps={{ paper: { sx: { background: "#fdf6f2", width: 290 } } }}>
        <div className="p-5"><Logo /></div>
        <List onClick={() => setOpen(false)} sx={{ pb: 2 }}>
          {LINKS.map(([label, href]) => (
            <ListItemButton key={href} component={Link} href={href} selected={active(href)}
              sx={{ borderRadius: 2, mx: 1.5, mb: 0.5, fontSize: 15, "&.Mui-selected": { background: "#fdeef2", color: "#e63c64", fontWeight: 600 } }}>
              {label}
            </ListItemButton>
          ))}
        </List>
        <div className="px-4 pb-5">
          <Link href="/custom" onClick={() => setOpen(false)}
            className="block rounded-full bg-pink px-5 py-3.5 text-center text-base font-semibold text-white shadow-[0_8px_22px_rgba(230,60,100,.32)] transition hover:bg-pink2">
            🎂 Order Custom Cake
          </Link>
          <Link href="/cart" onClick={() => setOpen(false)}
            className="mt-2.5 block rounded-full border-2 border-line2 px-5 py-3 text-center text-sm font-semibold text-choco transition hover:border-pink hover:text-pink">
            View Cart ({cart.count})
          </Link>
        </div>
      </Drawer>
    </>
  );
}
