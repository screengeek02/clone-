import { motion } from 'framer-motion';

export function FeatureCard({ title, body }: { title: string; body: string }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      className="panel rounded-2xl p-5"
    >
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted">{body}</p>
    </motion.article>
  );
}
