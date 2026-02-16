export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  coverImage: string;
  tags: string[];
  content: string;
};

export const posts: Post[] = [
  {
    slug: 'how-to-build-a-monochrome-fit',
    title: 'How to Build a Monochrome Fit That Hits',
    excerpt: 'A practical blueprint for tonal layering without looking flat.',
    date: '2026-01-09',
    coverImage:
      'https://images.unsplash.com/photo-1506629905607-c9a6ec4646b1?auto=format&fit=crop&w=1200&q=80',
    tags: ['styling', 'essentials'],
    content: `# Start with Texture\n\nMonochrome works when your materials do the talking. Mix fleece, denim, and nylon to create depth.\n\n## Anchor Piece\n\nPick one hero item—an oversized hoodie or heavyweight jacket—and build around it with tonal pieces.\n\n## Finish Strong\n\nUse accessories in matte black or steel to sharpen the final look without breaking the palette.`
  },
  {
    slug: '3-under-50-streetwear-upgrades',
    title: '3 Under-$50 Streetwear Upgrades That Feel Premium',
    excerpt: 'Affordable moves that instantly elevate your rotation.',
    date: '2026-01-21',
    coverImage:
      'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1200&q=80',
    tags: ['budget', 'trending'],
    content: `# Upgrade 1: Better Tee Weight\n\nThicker tees drape cleaner and hold shape all day.\n\n# Upgrade 2: Utility Bottoms\n\nA tapered cargo adds structure and movement with almost any top.\n\n# Upgrade 3: Layered Chains\n\nSmall detail, major effect. Start subtle and stack when needed.`
  }
];
