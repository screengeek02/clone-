export type Category = {
  slug: string;
  name: string;
  description: string;
  image: string;
};

export const categories: Category[] = [
  {
    slug: 'hoodies-sweats',
    name: 'Hoodies & Sweats',
    description: 'Heavyweight layers built for late nights and loud statements.',
    image:
      'https://images.unsplash.com/photo-1548883354-94bcfe321cbb?auto=format&fit=crop&w=900&q=80'
  },
  {
    slug: 'tops-graphics',
    name: 'Tops & Graphics',
    description: 'Graphic heat with silhouettes that command attention.',
    image:
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80'
  },
  {
    slug: 'bottoms-utility',
    name: 'Bottoms & Utility',
    description: 'Cargo, denim, and relaxed cuts for movement.',
    image:
      'https://images.unsplash.com/photo-1475180098004-ca77a66827be?auto=format&fit=crop&w=900&q=80'
  },
  {
    slug: 'accessories',
    name: 'Accessories',
    description: 'Finish the fit with chains, caps, and street-level details.',
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80'
  }
];
