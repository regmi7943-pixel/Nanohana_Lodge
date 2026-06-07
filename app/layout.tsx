import type {Metadata} from 'next';
import { Josefin_Sans, Lato } from 'next/font/google';
import './globals.css'; // Global styles

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
  title: 'Nanohana Lodge | Garden Oasis Guesthouse in Lakeside Pokhara, Nepal',
  description: 'Clean, cozy, eco-conscious guesthouse with mountain views from $12/night. Family-run in Lakeside Pokhara, next to Basundhara Park.',
};

import SecretKeybind from '@/components/SecretKeybind';

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${josefin.variable} ${lato.variable}`}>
      <body className="bg-cream text-earth font-sans font-light min-h-screen flex flex-col antialiased" suppressHydrationWarning>
        <SecretKeybind />
        <main className="flex-grow">{children}</main>
      </body>
    </html>
  );
}
