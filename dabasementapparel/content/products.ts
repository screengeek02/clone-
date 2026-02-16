export type Product = {
  slug: string;
  title: string;
  category: string;
  description: string;
  whyWePickedThis: string;
  howToStyle: string;
  affiliateUrl: string;
  image: string;
  gallery: string[];
  priceMin?: number;
  priceMax?: number;
  badges?: string[];
  trending?: boolean;
};

export const products: Product[] = [
  {
    slug: 'oversized-vintage-hoodie',
    title: 'Oversized Vintage Hoodie',
    category: 'hoodies-sweats',
    description: 'Ultra-soft fleece hoodie with drop-shoulder structure and washed finish.',
    whyWePickedThis:
      'The faded pigment wash gives designer-level texture without designer-level pricing.',
    howToStyle:
      'Layer over a longline tee, cargo pants, and chunky sneakers for that after-hours studio feel.',
    affiliateUrl: 'https://www.amazon.com/?tag=dabasement-20',
    image:
      'https://images.unsplash.com/photo-1618354691503-c90f2f9f93dc?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1618354691225-ff4f6f292743?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=900&q=80'
    ],
    priceMin: 32,
    priceMax: 45,
    badges: ['Trending', 'Under $50'],
    trending: true
  },
  {
    slug: 'stacked-cargo-pants',
    title: 'Stacked Cargo Pants',
    category: 'bottoms-utility',
    description: 'Relaxed tapered cargo with reinforced seams and deep utility pockets.',
    whyWePickedThis: 'Easy drape, quality zippers, and cuff shape that stacks perfectly over sneakers.',
    howToStyle: 'Pair with a cropped bomber and monochrome tee to emphasize the silhouette.',
    affiliateUrl: 'https://www.amazon.com/?tag=dabasement-20',
    image:
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1475178626620-a4d074967452?auto=format&fit=crop&w=900&q=80'
    ],
    priceMin: 39,
    priceMax: 60,
    badges: ['Editor Pick'],
    trending: true
  },
  {
    slug: 'retro-graphic-tee',
    title: 'Retro Graphic Tee',
    category: 'tops-graphics',
    description: 'Heavy cotton graphic tee with cracked print and roomy street fit.',
    whyWePickedThis: 'The crackle print looks authentic and the collar keeps shape after washes.',
    howToStyle: 'Size up and tuck the front into distressed denim with silver accessories.',
    affiliateUrl: 'https://www.amazon.com/?tag=dabasement-20',
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1527719327859-c6ce80353573?auto=format&fit=crop&w=900&q=80'
    ],
    priceMin: 22,
    priceMax: 34,
    badges: ['Under $50']
  },
  {
    slug: 'minimal-chain-pack',
    title: 'Minimal Chain Pack',
    category: 'accessories',
    description: 'Three-piece chain set for layered detail with low-key shine.',
    whyWePickedThis: 'A fast way to level up plain tees and open-collar shirts.',
    howToStyle: 'Use two chains for daytime, all three when the fit needs extra edge.',
    affiliateUrl: 'https://www.amazon.com/?tag=dabasement-20',
    image:
      'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=900&q=80'
    ],
    priceMin: 16,
    priceMax: 25,
    badges: ['Budget Flex']
  }
];
