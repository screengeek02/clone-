import React from 'react';

export default function EquipmentCard({ equipment }) {
  return (
    <article className="asn-card asn-listing-card">
      <div className="asn-card-meta">{equipment.country} • {equipment.institution}</div>
      <h3>{equipment.name}</h3>
      <p>{equipment.model}</p>
      <span className="asn-badge">{equipment.status}</span>
    </article>
  );
}
