import React from 'react';

export default function FeatureCard({ icon, title, description, href = '#' }) {
  return (
    <article className="asn-card asn-feature-card">
      <span className="asn-feature-icon" aria-hidden="true">{icon}</span>
      <h3>{title}</h3>
      <p>{description}</p>
      <a href={href} className="asn-inline-link">Explore →</a>
    </article>
  );
}
