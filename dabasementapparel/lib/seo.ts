import type { Metadata } from 'next';

const siteUrl = 'https://dabasementapparel.com';

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Da Basement Apparel | Curated Streetwear Picks',
    template: '%s | Da Basement Apparel'
  },
  description:
    'Premium streetwear editorial picks with curated Amazon finds, style guides, and trend reports.',
  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName: 'Da Basement Apparel',
    title: 'Da Basement Apparel',
    description:
      'Streetwear that speaks before you do. Shop curated picks, read style guides, and get trend alerts.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Da Basement Apparel hero'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Da Basement Apparel',
    description:
      'Premium streetwear editorial look with curated product picks and journal stories.',
    images: ['https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=1200&q=80']
  },
  alternates: {
    canonical: '/'
  }
};

export const buildMetadata = (title: string, description: string, path: string): Metadata => ({
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    title,
    description,
    url: path
  }
});

export const absoluteUrl = (path: string) => `${siteUrl}${path}`;
