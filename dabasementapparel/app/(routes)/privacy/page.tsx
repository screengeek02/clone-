import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata('Privacy Policy', 'Privacy practices for Da Basement Apparel.', '/privacy');

export default function PrivacyPage() {
  return (
    <section className="mx-auto max-w-3xl space-y-4">
      <h1 className="font-display text-4xl uppercase">Privacy Policy</h1>
      <p className="text-zinc-300">
        We collect minimal personal data, such as email addresses submitted through newsletter forms.
      </p>
      <p className="text-zinc-300">
        Analytics and affiliate programs may use cookies to attribute purchases and improve content performance.
      </p>
      <p className="text-zinc-300">To request data removal, contact hello@dabasementapparel.com.</p>
    </section>
  );
}
