"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Coffee, Menu, X } from "lucide-react";
import { WallogenLogo } from "@/components/WallogenLogo";

const NAV_LINKS = [
    { href: "#ai", label: "AI" },
    { href: "#features", label: "How it works" },
    { href: "#gallery", label: "Gallery" },
    { href: "#faq", label: "FAQ" },
];

const COFFEE_URL = "https://buymeacoffee.com/denzeltl";

export const Header: React.FC = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [pastHero, setPastHero] = useState(false);

    // Transparent over the hero wallpaper, solid once the visitor scrolls into the page.
    useEffect(() => {
        const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.5);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Lock body scroll when mobile menu is open to prevent background scrolling
    useEffect(() => {
        document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [mobileMenuOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setMobileMenuOpen(false);
        };
        const handleResize = () => {
            if (window.innerWidth >= 640) setMobileMenuOpen(false);
        };
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const closeMenu = () => setMobileMenuOpen(false);
    const solid = pastHero || mobileMenuOpen;

    return (
        <header
            className={`sticky top-0 z-50 border-b transition-[background-color,border-color] duration-300 ${
                solid ? "border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md" : "hero-scope border-transparent bg-transparent"
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
                <Link
                    href="/"
                    onClick={(e) => {
                        closeMenu();
                        if (window.location.pathname === "/") {
                            e.preventDefault();
                            const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
                            window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
                        }
                    }}
                    className="flex min-h-[44px] items-center gap-2.5 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                    <WallogenLogo size={28} />
                    <span className="hero-ink font-display text-lg font-extrabold tracking-tight text-white">Wallogen</span>
                </Link>

                <nav aria-label="Primary" className="hidden md:flex items-center gap-1">
                    {NAV_LINKS.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="hero-ink-2 inline-flex min-h-[44px] items-center rounded-full px-4 text-sm font-medium text-zinc-200 transition-colors [@media(hover:hover)]:hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>

                <div className="hidden sm:flex items-center gap-2">
                    <a
                        href={COFFEE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hero-glass inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/15 bg-zinc-950/45 px-4 text-sm font-semibold text-amber-400 backdrop-blur-md transition-[transform,border-color] duration-150 [@media(hover:hover)]:hover:border-amber-500/50 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 motion-reduce:transform-none"
                    >
                        <Coffee className="h-4 w-4" />
                        Buy me a coffee
                    </a>
                    <Link
                        href="/generate"
                        className="hero-solid group inline-flex min-h-[44px] items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-zinc-950 transition-[transform,background-color] duration-150 [@media(hover:hover)]:hover:bg-zinc-200 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 motion-reduce:transform-none"
                    >
                        Open generator
                        <ArrowRight className="h-4 w-4 transition-transform duration-200 [@media(hover:hover)]:group-hover:translate-x-1 motion-reduce:transform-none" />
                    </Link>
                </div>

                <button
                    type="button"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-expanded={mobileMenuOpen}
                    aria-controls="mobile-menu"
                    aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                    className="hero-glass sm:hidden inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-zinc-950/45 text-white backdrop-blur-md transition-transform duration-150 active:scale-[0.94] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                    {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
            </div>

            {/* Mobile sheet */}
            <div
                id="mobile-menu"
                aria-hidden={!mobileMenuOpen}
                className={`fixed inset-x-0 top-16 bottom-0 z-40 sm:hidden flex flex-col justify-between overflow-y-auto border-t border-zinc-800/80 bg-zinc-950 px-4 py-6 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-opacity ${
                    mobileMenuOpen ? "opacity-100 translate-y-0" : "invisible pointer-events-none opacity-0 -translate-y-2"
                }`}
            >
                <nav aria-label="Mobile" className="flex flex-col">
                    {NAV_LINKS.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            onClick={closeMenu}
                            className="flex min-h-[56px] items-center border-b border-zinc-900 font-display text-2xl font-bold tracking-tight text-white active:text-zinc-300"
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>
                <div className="flex flex-col gap-3 pt-6">
                    <Link
                        href="/generate"
                        onClick={closeMenu}
                        className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-white text-base font-semibold text-zinc-950 transition-transform active:scale-[0.98]"
                    >
                        Open generator
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                    <a
                        href={COFFEE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={closeMenu}
                        className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full border border-zinc-800 text-base font-semibold text-amber-400 transition-transform active:scale-[0.98]"
                    >
                        <Coffee className="h-4 w-4" />
                        Buy me a coffee
                    </a>
                </div>
            </div>
        </header>
    );
};
