'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Coffee, Menu, X, ChevronRight, Sparkles, Monitor } from 'lucide-react';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Lock body scroll when mobile menu is open to prevent background scrolling
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Handle keydown & resize events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const closeMenu = () => setMobileMenuOpen(false);

  const navLinks = [
    { num: '01', href: '#features', label: '// Features', subtext: 'Procedural canvas specifications' },
    { num: '02', href: '#gallery', label: '// Gallery', subtext: 'Explore curated wallpaper styles' },
    { num: '03', href: '#faq', label: '// FAQ', subtext: 'Resolutions & licensing questions' },
  ];

  return (
    <header className="border-b border-zinc-800/80 backdrop-blur-md sticky top-0 z-50 bg-zinc-950/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            onClick={closeMenu}
            className="group flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg active:scale-95 transition-transform"
          >
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-xs text-white shadow-md shadow-blue-600/30 group-hover:scale-105 transition-transform">
              W
            </div>
            <span className="font-extrabold text-base tracking-tight text-white group-hover:text-zinc-200 transition-colors">
              Wallogen
            </span>
            <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 rounded font-semibold hidden sm:inline">
              v0.1
            </span>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-mono font-medium text-zinc-300">
          <a
            href="#features"
            className="hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md px-1 py-0.5"
          >
            // Features
          </a>
          <a
            href="#gallery"
            className="hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md px-1 py-0.5"
          >
            // Gallery
          </a>
          <a
            href="#faq"
            className="hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md px-1 py-0.5"
          >
            // FAQ
          </a>
        </nav>

        {/* Desktop Action Group */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href="https://buymeacoffee.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 hover:border-amber-500/40 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 active:scale-95"
          >
            <Coffee className="w-3.5 h-3.5" />
            <span>Support</span>
          </a>
          <Link
            href="/generate"
            className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 hover:shadow-blue-500/35 transition-all duration-200 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <span>Launch Studio</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>

        {/* Mobile Action & Menu Toggle Button */}
        <div className="flex md:hidden items-center gap-2.5">
          <Link
            href="/generate"
            onClick={closeMenu}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20 transition-all active:scale-95"
          >
            Studio
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-all duration-300 active:scale-90"
          >
            <div className={`transition-transform duration-300 ${mobileMenuOpen ? 'rotate-90 scale-110' : 'rotate-0'}`}>
              {mobileMenuOpen ? <X className="w-5 h-5 text-blue-400" /> : <Menu className="w-5 h-5" />}
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Full-Viewport Slide Sheet Overlay (Non-clunky fixed overlay with backdrop blur) */}
      <div
        className={`fixed inset-x-0 top-16 bottom-0 z-40 md:hidden bg-zinc-950/95 backdrop-blur-2xl transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col justify-between overflow-y-auto px-6 py-8 border-t border-zinc-800/80 ${
          mobileMenuOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        {/* Navigation Items */}
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400 uppercase tracking-wider pb-2 border-b border-zinc-900">
            <span>Navigation Menu</span>
            <span className="text-blue-400 font-semibold">Wallogen Studio</span>
          </div>

          <nav className="flex flex-col gap-3">
            {navLinks.map((link, index) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                style={{ transitionDelay: `${mobileMenuOpen ? index * 50 : 0}ms` }}
                className={`group flex items-center justify-between p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900 active:scale-[0.98] transition-all duration-200 ${
                  mobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span className="text-xs font-mono font-bold text-zinc-400 group-hover:text-blue-400 transition-colors">
                    {link.num}
                  </span>
                  <div className="flex flex-col">
                    <span className="font-mono text-sm font-semibold text-zinc-100 group-hover:text-white transition-colors">
                      {link.label}
                    </span>
                    <span className="text-xs text-zinc-400 font-normal">
                      {link.subtext}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-200" />
              </a>
            ))}
          </nav>
        </div>

        {/* Mobile Menu Bottom Action Cards */}
        <div className="pt-6 border-t border-zinc-900 space-y-4">
          <Link
            href="/generate"
            onClick={closeMenu}
            className="w-full group flex items-center justify-between p-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-xl shadow-blue-600/25 active:scale-[0.98] transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-blue-200" />
              <span>Launch Wallpaper Studio</span>
            </div>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <a
            href="https://buymeacoffee.com"
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMenu}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-zinc-900/80 border border-amber-500/20 text-amber-400 hover:bg-amber-500/10 text-xs font-semibold active:scale-[0.98] transition-all"
          >
            <div className="flex items-center gap-2.5">
              <Coffee className="w-4 h-4 text-amber-400" />
              <span>Support Wallogen Creator</span>
            </div>
            <span className="text-[10px] font-mono bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full text-amber-300">
              Coffee
            </span>
          </a>

          <div className="text-center pt-2">
            <p className="text-[11px] font-mono text-zinc-400">
              100% Client-Side HTML5 Canvas Engine • No Sign-Up
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
