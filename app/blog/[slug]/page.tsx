import { notFound } from 'next/navigation';

const content: Record<string, { title: string; body: string }> = {
  'understanding-apob': {
    title: 'Understanding ApoB beyond LDL',
    body: 'ApoB offers additional context on cardiovascular particle burden and prevention planning.'
  },
  'sleep-and-glucose-trends': {
    title: 'Sleep quality and glucose trends',
    body: 'Consistent sleep can improve fasting glucose variability and daily energy regulation.'
  }
};

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = content[params.slug];
  if (!post) return notFound();
  return <article className="prose prose-invert max-w-3xl"><h1>{post.title}</h1><p>{post.body}</p></article>;
}
