import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { WallogenLogo } from '@/components/WallogenLogo';

export default function NotFound() {
  return (
    <main className="min-h-[100dvh] flex flex-col items-start justify-center gap-6 px-4 sm:px-6 max-w-3xl mx-auto">
      <WallogenLogo size={40} />
      <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">404 · Page not found</p>
      <h1 className="font-display text-5xl sm:text-7xl font-extrabold leading-[0.95] tracking-[-0.05em] text-white">
        This seed didn&apos;t render anything.
      </h1>
      <p className="text-lg text-zinc-400 max-w-xl">
        The page you followed doesn&apos;t exist. The generator does, and it can draw you a new wallpaper.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/generate"
          className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-white px-6 font-semibold text-zinc-950 transition-[transform,background-color] duration-150 [@media(hover:hover)]:hover:bg-zinc-200 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
        >
          Open generator <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/"
          className="inline-flex min-h-[48px] items-center rounded-full border border-zinc-700 px-6 font-semibold text-white transition-[transform,border-color] duration-150 [@media(hover:hover)]:hover:border-zinc-500 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
