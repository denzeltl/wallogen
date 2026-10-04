import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Wallogen — Minimalist Wallpaper Generator for Desktop & Mobile',
  description:
    'Generate beautiful, high-resolution minimalist wallpapers for 4K desktop, iPhone, Android, and tablets. Free, privacy-first, and zero clutter.',
  keywords: [
    'Wallpaper Generator',
    'Minimalist Wallpapers',
    '4K Wallpapers',
    'Mobile Wallpapers',
    'Procedural Graphics',
    'Canvas Art',
  ],
  authors: [{ name: 'Wallogen Team' }],
  openGraph: {
    title: 'Wallogen — Minimalist Wallpaper Generator',
    description: 'Generate high-res minimalist wallpapers in 4K, 8K, and Mobile resolutions.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-zinc-950 text-zinc-100 antialiased selection:bg-blue-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
