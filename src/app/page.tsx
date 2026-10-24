import { Hero } from "@/components/landing/Hero";
import { AiSection } from "@/components/landing/AiSection";
import { Features } from "@/components/landing/Features";
import { Gallery } from "@/components/landing/Gallery";
import { FAQ } from "@/components/landing/FAQ";
import { BuyMeACoffeeSection } from "@/components/landing/BuyMeACoffee";
import { Header } from "@/components/landing/Header";
import { LandingMotion } from "@/components/landing/LandingMotion";
import { WallogenLogo } from "@/components/WallogenLogo";

export default function Home() {
    return (
        <div id="top" className="min-h-screen bg-zinc-950 text-white flex flex-col">
            <LandingMotion />
            <Header />

            <main className="flex-1">
                <Hero />
                <AiSection />
                <Features />
                <Gallery />
                <FAQ />
                <BuyMeACoffeeSection />
            </main>

            <footer className="border-t border-zinc-800/80 px-4 sm:px-6 py-10 text-sm text-zinc-400">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <WallogenLogo size={24} />
                        <p>© {new Date().getFullYear()} Wallogen. Wallpapers drawn by math.</p>
                    </div>
                    <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <a
                            href="/generate"
                            className="inline-flex min-h-[44px] items-center rounded px-2 transition-colors [@media(hover:hover)]:hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                        >
                            Generator
                        </a>
                        <a
                            href="https://buymeacoffee.com/denzeltl"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-h-[44px] items-center rounded px-2 transition-colors [@media(hover:hover)]:hover:text-amber-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                        >
                            Buy me a coffee
                        </a>
                        <a
                            href="#top"
                            className="inline-flex min-h-[44px] items-center rounded px-2 transition-colors [@media(hover:hover)]:hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                        >
                            Back to top ↑
                        </a>
                    </nav>
                </div>
            </footer>
        </div>
    );
}
