import type { Metadata } from "next";
import localFont from "next/font/local";
import MuiProviders from "@/components/theme";
import ToastProvider from "@/components/toast";
import CartProvider from "@/components/cart";
import "./globals.css";

const playfair = localFont({
  src: [
    { path: "../public/fonts/PlayfairDisplay-500.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/PlayfairDisplay-600.woff2", weight: "600", style: "normal" },
    { path: "../public/fonts/PlayfairDisplay-700.woff2", weight: "700", style: "normal" },
    { path: "../public/fonts/PlayfairDisplay-800.woff2", weight: "800", style: "normal" },
    { path: "../public/fonts/PlayfairDisplay-600-italic.woff2", weight: "600", style: "italic" },
  ],
  variable: "--font-playfair",
  display: "swap",
});
const poppins = localFont({
  src: [
    { path: "../public/fonts/Poppins-300.woff2", weight: "300" },
    { path: "../public/fonts/Poppins-400.woff2", weight: "400" },
    { path: "../public/fonts/Poppins-500.woff2", weight: "500" },
    { path: "../public/fonts/Poppins-600.woff2", weight: "600" },
    { path: "../public/fonts/Poppins-700.woff2", weight: "700" },
  ],
  variable: "--font-poppins",
  display: "swap",
});
const vibes = localFont({ src: "../public/fonts/GreatVibes-400.woff2", weight: "400", variable: "--font-vibes", display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "Cake Delight — Custom Cakes in Sahiwal | Birthday, Wedding & Event Cakes",
    template: "%s — Cake Delight Sahiwal",
  },
  description:
    "Beautifully designed, deliciously made — personalized custom cakes for birthdays, weddings, anniversaries and all your special celebrations in Sahiwal. Same-day delivery available.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${playfair.variable} ${poppins.variable} ${vibes.variable}`}>
      <body className="bg-cream font-body text-ink antialiased">
        <MuiProviders>
          <ToastProvider>
            <CartProvider>{children}</CartProvider>
          </ToastProvider>
        </MuiProviders>
      </body>
    </html>
  );
}
