import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Generator',
  description:
    'Pick a procedural engine or describe a scene, tune it live, and download a wallpaper at your exact screen resolution, up to 8K.',
  alternates: { canonical: '/generate' },
};

export default function GenerateLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
