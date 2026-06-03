import type {Metadata} from 'next';
import { Josefin_Sans, Lato } from 'next/font/google';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import CurtainLoader from '@/components/CurtainLoader';
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

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${josefin.variable} ${lato.variable}`}>
      <body className="bg-cream text-earth font-sans font-light min-h-screen flex flex-col antialiased" suppressHydrationWarning>
        <CurtainLoader />
        <Navigation />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
