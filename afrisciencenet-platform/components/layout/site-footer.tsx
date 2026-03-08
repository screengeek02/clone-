export function SiteFooter() {
  return (
    <footer className="mt-12 border-t bg-white/80">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:grid-cols-3">
        <div>
          <h4 className="font-semibold text-navy">AfriScienceNet Platform</h4>
          <p className="mt-2 text-sm">Continent-scale research infrastructure and collaboration platform.</p>
        </div>
        <div className="text-sm">
          <a className="block" href="/equipment">Equipment</a>
          <a className="block" href="/researchers">Experts</a>
          <a className="block" href="/funding">Funding</a>
        </div>
        <div className="text-sm">© {new Date().getFullYear()} AfriScienceNet</div>
      </div>
    </footer>
  );
}
