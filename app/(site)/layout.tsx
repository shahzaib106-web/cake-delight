import Header from "@/components/header";
import Footer from "@/components/footer";
import { getSettings } from "@/lib/store";

// All storefront pages render per-request so admin edits (products, settings, …)
// show up immediately — no stale static cache.
export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  return (
    <>
      <Header settings={settings} />
      <main>{children}</main>
      <Footer settings={settings} />
    </>
  );
}
