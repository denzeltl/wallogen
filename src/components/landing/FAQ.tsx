'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { SectionHeading } from './SectionHeading';

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
    <section id="faq" className="py-24 sm:py-32 px-4 sm:px-6 max-w-7xl mx-auto border-t border-zinc-800/60">
      <SectionHeading
        label="FAQ"
        title="Price, privacy, resolution and licensing."
      />

      <div className="mt-12 border-t border-zinc-800">
        {faqItems.map((item, idx) => {
          const isOpen = openIndex === idx;

          return (
            <div
              key={idx}
              data-reveal
              style={{ '--reveal-i': idx } as React.CSSProperties}
              className="border-b border-zinc-800"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${idx}`}
                id={`faq-button-${idx}`}
                type="button"
                className="w-full min-h-[64px] py-5 text-left flex items-center justify-between gap-4 font-display font-bold text-lg tracking-tight text-zinc-100 [@media(hover:hover)]:hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-md"
              >
                <span className="min-w-0">
                  <span>{item.question}</span>
                </span>
                <div className={`shrink-0 transition-colors ${isOpen ? 'text-white' : 'text-zinc-500'}`}>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform duration-300 motion-reduce:transition-none ease-[cubic-bezier(0.16,1,0.3,1)] ${
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
                className={`grid transition-[grid-template-rows,opacity] duration-300 motion-reduce:transition-none ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="pb-6 pr-10 max-w-3xl text-base text-zinc-400 leading-relaxed">
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
