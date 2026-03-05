import React from 'react';
import SearchBar from './SearchBar.jsx';

export default function HeroSection() {
  return (
    <section className="asn-hero asn-glass">
      <p className="asn-eyebrow">Africa Science Information Access Network</p>
      <h1>Connecting African Researchers to Labs &amp; Equipment</h1>
      <p className="asn-hero-sub">Discover laboratory infrastructure, institutions, funding pathways, and collaboration opportunities across Africa.</p>
      <div className="asn-hero-actions">
        <button className="asn-btn asn-btn-primary">Find Equipment</button>
        <button className="asn-btn asn-btn-secondary">Find Laboratory</button>
        <button className="asn-btn asn-btn-ghost">Join Network</button>
      </div>
      <SearchBar placeholder="Search equipment, institutions, resources..." />
    </section>
  );
}
