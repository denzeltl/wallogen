import Link from 'next/link';
import { ArrowRight, Coffee } from 'lucide-react';
import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { Gallery } from '@/components/landing/Gallery';
import { FAQ } from '@/components/landing/FAQ';
import { BuyMeACoffeeSection } from '@/components/landing/BuyMeACoffee';

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col justify-between selection:bg-blue-600">
      {/* Navigation Header */}
      <header className="border-b border-zinc-800/80 backdrop-blur-md sticky top-0 z-50 bg-zinc-950/90">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-600/25">
              W
            </div>
            <span className="font-bold text-lg tracking-tight">Wallogen</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#gallery" className="hover:text-white transition-colors">
              Gallery
            </a>
            <a href="#faq" className="hover:text-white transition-colors">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="https://buymeacoffee.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-all"
            >
              <Coffee className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Buy Me a Coffee</span>
            </a>
            <Link
              href="/generate"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 transition-all active:scale-95"
            >
              <span>Launch Studio</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Landing Sections */}
      <main className="flex-1">
        <Hero />
        <Features />
        <Gallery />
        <FAQ />
        <BuyMeACoffeeSection />
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 py-8 px-6 text-center text-xs text-zinc-500 bg-zinc-950">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Wallogen. Minimalist Procedural Wallpaper Generator.</p>
          <div className="flex items-center gap-6">
            <a
              href="https://buymeacoffee.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-400 transition-colors font-medium"
            >
              Buy Me a Coffee
            </a>
            <Link href="/generate" className="hover:text-zinc-200 transition-colors">
              Generator Studio
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
