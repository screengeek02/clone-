import './globals.css';
import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { MainNav } from '@/components/layout/main-nav';

export const metadata: Metadata = {
  title: 'AfriScienceNet Platform',
  description: 'Africa’s Research Infrastructure & Collaboration Network'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <MainNav />
        {children}
      </body>
    </html>
  );
}
