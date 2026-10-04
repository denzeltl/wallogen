'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

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
      answer: 'No. All rendering and export logic happens 100% client-side directly inside your web browser. No graphics or data are ever transmitted to an external server.',
    },
    {
      question: 'Can I use Wallogen wallpapers for commercial projects or streams?',
      answer: 'Absolutely! You are free to use any wallpapers you generate for personal desktops, mobile phones, video streams, or commercial media projects.',
    },
  ];

  return (
    <section id="faq" className="py-20 px-6 max-w-4xl mx-auto border-t border-zinc-800/60">
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-zinc-900 text-zinc-400 border border-zinc-800 mb-3">
          <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
          <span>Frequently Asked Questions</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          Everything You Need to Know
        </h2>
      </div>

      <div className="space-y-4">
        {faqItems.map((item, idx) => {
          const isOpen = openIndex === idx;

          return (
            <div
              key={idx}
              className="rounded-2xl bg-zinc-900/50 border border-zinc-800/80 overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between font-bold text-sm sm:text-base text-zinc-200 hover:text-white transition-colors"
              >
                <span>{item.question}</span>
                <ChevronDown
                  className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-blue-400' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-zinc-400 leading-relaxed border-t border-zinc-800/40">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
