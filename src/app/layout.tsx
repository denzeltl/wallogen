import type { Metadata, Viewport } from 'next';
import './globals.css';

const siteUrl = 'https://wallogen.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Wallogen — Minimalist 4K & Mobile Wallpaper Generator',
    template: '%s | Wallogen',
  },
  description:
    'Procedurally generate high-resolution minimalist wallpapers for 4K desktop, iPhone, Android, and tablets. 14 procedural pattern engines, 100% free, privacy-first, zero sign-up.',
  keywords: [
    'Wallpaper Generator',
    'Minimalist Wallpapers',
    '4K Wallpapers',
    'Mobile Wallpapers',
    'Procedural Graphics',
    'Vector Wallpaper',
    'Desktop Wallpaper 4K',
    'iPhone Lockscreen Wallpaper',
    'Procedural Art Generator',
  ],
  authors: [{ name: 'Wallogen', url: siteUrl }],
  creator: 'Wallogen',
  publisher: 'Wallogen',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: 'Wallogen — Minimalist 4K & Mobile Wallpaper Generator',
    description:
      'Procedurally generate high-resolution minimalist wallpapers for 4K desktop, iPhone, Android, and tablets in seconds. 100% free & client-side.',
    url: siteUrl,
    siteName: 'Wallogen',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wallogen — Minimalist Wallpaper Generator',
    description:
      'Generate high-resolution minimalist vector wallpapers for 4K desktop and mobile devices.',
    creator: '@wallogen',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: '#09090b',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Schema.org WebApplication structured data for Google & AI Search Engines
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Wallogen',
    url: siteUrl,
    description:
      'Client-side procedural wallpaper generator producing 4K desktop and mobile wallpapers in vector style.',
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'All',
    browserRequirements: 'Requires HTML5 Canvas support',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-zinc-950 text-zinc-100 antialiased selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
