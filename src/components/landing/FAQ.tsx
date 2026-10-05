'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqItems = [
    {
      question: 'Is Wallogen completely free to use?',
      answer: 'Yes! Wallogen is 100% free and open for everyone. There are no paywalls, accounts, or watermarks. If you enjoy the wallpapers, you can voluntarily buy the creator a coffee!',
    },
    {
      question: 'How do high-resolution 4K and 8K exports work?',
      answer: 'When you click "Download Wallpaper", Wallogen creates an offscreen canvas at your exact requested target resolution (e.g. 3840×2160 for 4K Desktop or 1290×2796 for iPhone). It re-renders the procedural vector math natively at full resolution so the image is crisp down to the pixel.',
    },
    {
      question: 'Are my wallpapers uploaded or saved on any server?',
      answer: 'No. All rendering and export logic happens 100% client-side directly inside your web browser. Your wallpapers and images are never uploaded anywhere.',
    },
    {
      question: 'How does "Describe a wallpaper" (AI) work, and what gets sent?',
      answer: "When you type a description, only that text is sent to Google's Gemini API, which picks a pattern, colors, and settings. Your browser then renders the wallpaper locally, so it stays sharp at 4K and 8K and you can keep tweaking it. We use Gemini's free tier, where Google may use prompts to improve its products, so please don't include personal information. If the free daily AI allowance runs out, Wallogen makes a close match from your words on-device instead.",
    },
    {
      question: 'Can I use Wallogen wallpapers for commercial projects or streams?',
      answer: 'Absolutely! You are free to use any wallpapers you generate for personal desktops, mobile phones, video streams, or commercial media projects.',
    },
  ];

  return (
    <section id="faq" className="py-20 px-4 sm:px-6 max-w-4xl mx-auto border-t border-zinc-800/60">
      <div className="text-center mb-14">
        <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold mb-2 block">
          Frequently Asked Questions
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Everything You Need to Know.
        </h2>
      </div>

      <div className="space-y-4">
        {faqItems.map((item, idx) => {
          const isOpen = openIndex === idx;

          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all duration-300 ${
                isOpen
                  ? 'bg-zinc-900/90 border-cyan-500/30 shadow-lg shadow-cyan-500/5'
                  : 'bg-zinc-900/50 border-zinc-800/80 hover:border-zinc-700/80 hover:bg-zinc-900/70'
              }`}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${idx}`}
                id={`faq-button-${idx}`}
                className="w-full p-5 text-left flex items-center justify-between font-bold text-sm sm:text-base text-zinc-200 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-2xl active:scale-[0.995]"
              >
                <span className="flex items-center gap-3">
                  <span className={`text-xs font-mono font-semibold transition-colors ${isOpen ? 'text-cyan-400' : 'text-zinc-500'}`}>
                    0{idx + 1}
                  </span>
                  <span>{item.question}</span>
                </span>
                <div className={`p-1 rounded-lg transition-colors ${isOpen ? 'bg-cyan-500/20 text-cyan-400' : 'text-zinc-400'}`}>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isOpen ? 'rotate-180' : 'rotate-0'
                    }`}
                    aria-hidden="true"
                  />
                </div>
              </button>

              {/* Smooth Animated Accordion Content */}
              <div
                id={`faq-answer-${idx}`}
                role="region"
                aria-labelledby={`faq-button-${idx}`}
                className={`grid transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-zinc-800/50">
                    {item.answer}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
