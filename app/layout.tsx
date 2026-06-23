import type {Metadata} from 'next';
import { Josefin_Sans, Lato } from 'next/font/google';
import './globals.css'; // Global styles
import { Toaster } from 'react-hot-toast';
const josefin = Josefin_Sans({
  subsets: ['latin'],
  variable: '--font-serif',
  weight: ['300', '400', '500', '600'],
});

const lato = Lato({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://nanohanalodge.com'), // Using a placeholder domain for Next.js metadataBase
  title: {
    default: 'Nanohana Lodge | Garden Oasis Guesthouse in Lakeside Pokhara, Nepal',
    template: '%s | Nanohana Lodge',
  },
  description: 'Clean, cozy, eco-conscious guesthouse with mountain views from $12/night. Family-run in Lakeside Pokhara, next to Basundhara Park.',
  openGraph: {
    title: 'Nanohana Lodge | Garden Oasis Guesthouse',
    description: 'Clean, cozy, eco-conscious guesthouse with mountain views from $12/night. Family-run in Lakeside Pokhara, next to Basundhara Park.',
    url: 'https://nanohanalodge.com',
    siteName: 'Nanohana Lodge',
    images: [
      {
        url: '/story_home.jpg', // Fallback image
        width: 1200,
        height: 800,
        alt: 'Nanohana Lodge',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nanohana Lodge | Garden Oasis Guesthouse',
    description: 'Clean, cozy, eco-conscious guesthouse with mountain views from $12/night. Family-run in Lakeside Pokhara.',
    images: ['/story_home.jpg'],
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
  alternates: {
    canonical: '/',
  },
};

import SecretKeybind from '@/components/SecretKeybind';

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${josefin.variable} ${lato.variable}`}>
      <body className="bg-cream text-earth font-sans font-light min-h-screen flex flex-col antialiased" suppressHydrationWarning>
        <Toaster position="top-center" toastOptions={{ className: 'bg-forest text-cream font-sans border border-white/10' }} />
        <SecretKeybind />
        <main className="flex-grow">{children}</main>
      </body>
    </html>
  );
}
