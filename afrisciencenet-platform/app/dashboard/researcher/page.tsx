import { requireRole } from '@/lib/auth/rbac';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';

export default async function ResearcherDashboard() {
  const session = await requireRole([UserRole.RESEARCHER, UserRole.INSTITUTION_ADMIN, UserRole.COUNTRY_COORDINATOR, UserRole.SUPER_ADMIN]);

  const profile = await prisma.researcherProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true, institutionId: true, bio: true, orcid: true, subSpecialties: true }
  });

  const [projects, datasets, bookings, savedFunding, recentMessages] = await Promise.all([
    prisma.project.count({ where: { createdByUserId: session.user.id } }),
    prisma.dataset.count({ where: { createdByUserId: session.user.id } }),
    prisma.bookingRequest.count({ where: { userId: session.user.id } }),
    prisma.savedFunding.count({ where: { userId: session.user.id } }),
    prisma.message.findMany({ where: { senderId: session.user.id }, orderBy: { createdAt: 'desc' }, take: 5, select: { id: true, body: true, createdAt: true } })
  ]);

  const completionFields = [profile?.bio, profile?.orcid, profile?.institutionId, profile?.subSpecialties];
  const completed = completionFields.filter(Boolean).length;
  const completion = Math.round((completed / completionFields.length) * 100);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-semibold text-navy">Welcome, {session.user.name}</h1>
      <p className="mt-2 text-slate-600">Profile completion: {completion}%</p>
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <article className="card p-5"><p className="text-sm text-slate-500">Projects</p><p className="text-2xl font-bold text-navy">{projects}</p></article>
        <article className="card p-5"><p className="text-sm text-slate-500">Datasets</p><p className="text-2xl font-bold text-navy">{datasets}</p></article>
        <article className="card p-5"><p className="text-sm text-slate-500">Booking Requests</p><p className="text-2xl font-bold text-navy">{bookings}</p></article>
        <article className="card p-5"><p className="text-sm text-slate-500">Saved Funding</p><p className="text-2xl font-bold text-navy">{savedFunding}</p></article>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <article className="card p-5">
          <h2 className="font-semibold text-navy">Quick Links</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li><a className="text-teal" href="/researchers/edit/me">Complete Profile</a></li>
            <li><a className="text-teal" href="/equipment">Browse Equipment</a></li>
            <li><a className="text-teal" href="/funding">Browse Funding</a></li>
            <li><a className="text-teal" href="/collaborations">Browse Collaborations</a></li>
            <li><a className="text-teal" href="/messages">Messages</a></li>
          </ul>
        </article>
        <article className="card p-5">
          <h2 className="font-semibold text-navy">Recent Messages</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {recentMessages.length === 0 ? <li>No recent messages yet.</li> : recentMessages.map((message) => <li key={message.id}>{message.body.slice(0, 80)}</li>)}
          </ul>
        </article>
      </div>
    </main>
  );
}
