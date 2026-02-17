import type { Metadata } from 'next';
import '@/styles/globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'DR Services Marketplace',
  description: 'Marketplace for services, bookings, and messaging.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="mx-auto min-h-[calc(100vh-130px)] max-w-6xl p-6">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
