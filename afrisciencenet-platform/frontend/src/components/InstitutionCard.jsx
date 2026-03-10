import React from 'react';

export default function InstitutionCard({ institution }) {
  return (
    <article className="asn-card asn-listing-card">
      <div className="asn-card-meta">{institution.country} • {institution.city}</div>
      <h3>{institution.name}</h3>
      <p>{institution.field}</p>
      <a href="#" className="asn-inline-link">View institution →</a>
    </article>
  );
}
