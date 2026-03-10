import React from 'react';

export default function Navbar({ links, ctaLabel = 'Join Network' }) {
  return (
    <header className="asn-navbar asn-glass">
      <a href="#" className="asn-brand">Afrisciencenet</a>
      <nav className="asn-nav-links" aria-label="Primary">
        {links.map((link) => (
          <a key={link.label} href={link.href}>{link.label}</a>
        ))}
      </nav>
      <button className="asn-btn asn-btn-primary asn-nav-cta">{ctaLabel}</button>
    </header>
  );
}
