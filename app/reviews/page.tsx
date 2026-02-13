import { TestimonialGrid, VideoCard } from '@/components/TestimonialGrid';

export default function ReviewsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">Member reviews</h1>
      <p className="text-xl">★★★★★ <span className="text-muted">4.8 average rating</span></p>
      <TestimonialGrid />
      <div className="grid gap-4 md:grid-cols-3">
        {['Athlete', 'Parent', 'Executive'].map((role) => <article key={role} className="panel rounded-xl p-4"><p className="text-sm text-cyan-300">{role} story</p><p className="mt-2">How preventive data changed my weekly routines.</p></article>)}
      </div>
      <VideoCard />
    </div>
  );
}
