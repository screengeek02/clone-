import React from 'react';

export default function SectionGrid({ title, items }) {
  return (
    <section className="asn-section">
      <div className="asn-section-head">
        <h2>{title}</h2>
        <a href="#">View all</a>
      </div>
      <div className="asn-grid">
        {items.map((item) => (
          <article className="asn-card asn-item-card" key={item.id}>
            <h3>{item.title}</h3>
            <p>{item.meta}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
