import Link from 'next/link';
import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { Gallery } from '@/components/landing/Gallery';
import { FAQ } from '@/components/landing/FAQ';
import { BuyMeACoffeeSection } from '@/components/landing/BuyMeACoffee';
import { Header } from '@/components/landing/Header';

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col justify-between selection:bg-blue-600">
      {/* Navigation Header */}
      <Header />

      {/* Main Landing Sections */}
      <main className="flex-1">
        <Hero />
        <Features />
        <Gallery />
        <FAQ />
        <BuyMeACoffeeSection />
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 py-8 px-6 text-center text-xs text-zinc-400 bg-zinc-950">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Wallogen. Minimalist Procedural Wallpaper Generator.</p>
          <div className="flex items-center gap-6">
            <a
              href="https://buymeacoffee.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-400 transition-colors font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded px-1"
            >
              Buy Me a Coffee
            </a>
            <Link href="/generate" className="hover:text-zinc-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-1">
              Generator Studio
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
