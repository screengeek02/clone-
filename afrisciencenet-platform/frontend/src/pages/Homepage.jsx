import React from 'react';
import Navbar from '../components/Navbar.jsx';
import HeroSection from '../components/HeroSection.jsx';
import FeatureCard from '../components/FeatureCard.jsx';
import EquipmentCard from '../components/EquipmentCard.jsx';
import InstitutionCard from '../components/InstitutionCard.jsx';
import Footer from '../components/Footer.jsx';
import '../styles/homepage.css';

const navLinks = [
  { label: 'Equipment', href: '#' },
  { label: 'Institutions', href: '#' },
  { label: 'Resources', href: '#' },
  { label: 'Forum', href: '#' }
];

const features = [
  { icon: '🔬', title: 'Equipment Database', description: 'Browse lab instruments available across institutions.' },
  { icon: '🏛️', title: 'Laboratory Directory', description: 'Discover research centers and departments by location.' },
  { icon: '🎓', title: 'Scholarships & Funding', description: 'Track grants, scholarships, and innovation calls.' },
  { icon: '🤝', title: 'Research Collaboration', description: 'Join community discussions and project calls.' }
];

const equipmentItems = [
  { name: 'High-Resolution Microscope', model: 'Zeiss Axio Imager M2', institution: 'University of Lagos', country: 'Nigeria', status: 'Available' },
  { name: 'FTIR Spectrometer', model: 'Thermo Nicolet iS20', institution: 'Nairobi Materials Institute', country: 'Kenya', status: 'Limited' },
  { name: 'PCR Thermal Cycler', model: 'Bio-Rad T100', institution: 'Kigali Genomics Center', country: 'Rwanda', status: 'Available' },
  { name: 'Gas Chromatograph', model: 'Agilent 8890', institution: 'UCT Central Lab', country: 'South Africa', status: 'Busy' },
  { name: 'Flow Cytometer', model: 'BD FACSCanto II', institution: 'Makerere Biotech Lab', country: 'Uganda', status: 'Available' },
  { name: 'NMR Spectrometer', model: 'Bruker AVANCE III', institution: 'Cairo Advanced Science Hub', country: 'Egypt', status: 'Limited' }
];

const institutionItems = [
  { name: 'University of Lagos Research Lab', country: 'Nigeria', city: 'Lagos', field: 'Biomedical Engineering' },
  { name: 'Nairobi Materials Institute', country: 'Kenya', city: 'Nairobi', field: 'Materials Science' },
  { name: 'Kigali Genomics Center', country: 'Rwanda', city: 'Kigali', field: 'Molecular Biology' },
  { name: 'Addis Innovation Lab', country: 'Ethiopia', city: 'Addis Ababa', field: 'Health Technology' },
  { name: 'Accra Nano Center', country: 'Ghana', city: 'Accra', field: 'Nanoscience' },
  { name: 'Dakar Marine Research Unit', country: 'Senegal', city: 'Dakar', field: 'Marine Science' }
];

const resourceItems = [
  'African Union Fellowship 2027',
  'STEM Mobility Scholarships',
  'Open Lab Capacity Toolkit',
  'Innovation Program — Climate Science'
];

const forumItems = [
  'Need Raman spectrometer access in West Africa',
  'Seeking malaria genomics collaborators',
  'Funding calls for biotech startups',
  'Graduate exchange opportunities 2026'
];

export default function Homepage() {
  return (
    <main className="asn-homepage">
      <Navbar links={navLinks} />
      <HeroSection />

      <section className="asn-features-grid">
        {features.map((feature) => <FeatureCard key={feature.title} {...feature} />)}
      </section>

      <section className="asn-section">
        <div className="asn-section-head"><h2>Featured Equipment</h2><a href="#">View all</a></div>
        <div className="asn-grid asn-grid-3">
          {equipmentItems.map((equipment) => <EquipmentCard key={equipment.name} equipment={equipment} />)}
        </div>
      </section>

      <section className="asn-section">
        <div className="asn-section-head"><h2>Featured Institutions</h2><a href="#">View all</a></div>
        <div className="asn-grid asn-grid-3">
          {institutionItems.map((institution) => <InstitutionCard key={institution.name} institution={institution} />)}
        </div>
      </section>

      <section className="asn-section">
        <div className="asn-section-head"><h2>Resource Center</h2><a href="#">View all</a></div>
        <div className="asn-grid asn-grid-2">
          {resourceItems.map((item) => <article key={item} className="asn-card asn-simple-card"><h3>{item}</h3></article>)}
        </div>
      </section>

      <section className="asn-section">
        <div className="asn-section-head"><h2>Community Posts</h2><a href="#">View all</a></div>
        <div className="asn-grid asn-grid-2">
          {forumItems.map((item) => <article key={item} className="asn-card asn-simple-card"><h3>{item}</h3></article>)}
        </div>
      </section>

      <Footer />
    </main>
  );
}
