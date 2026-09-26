import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-cream px-5 text-center">
      <div>
        <div className="text-8xl">🎂</div>
        <h1 className="mt-4 font-display text-4xl font-extrabold text-choco">404 — Page Not Found</h1>
        <p className="mt-2 text-mut">This page seems to have been eaten. Let&apos;s get you back to the cakes!</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/" className="rounded-full bg-pink px-7 py-3 font-semibold text-white shadow-[0_8px_22px_rgba(230,60,100,.3)] transition hover:bg-pink2">Back to Home</Link>
          <Link href="/gallery" className="rounded-full border-2 border-pink px-7 py-3 font-semibold text-pink transition hover:bg-pink hover:text-white">Browse Cakes</Link>
        </div>
      </div>
    </div>
  );
}
