import type { Metadata } from 'next';
import './globals.css';
import { site } from '@/lib/site';
import { HeaderNav } from '@/components/HeaderNav';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Health Intelligence Membership`,
    template: `%s | ${site.name}`
  },
  description: site.description,
  openGraph: {
    title: `${site.name} | Health Intelligence Membership`,
    description: site.description,
    url: site.url,
    siteName: site.name,
    images: ['/og-image.svg'],
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} | Health Intelligence Membership`,
    description: site.description,
    images: ['/og-image.svg']
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <HeaderNav />
        <main className="container-xl py-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
