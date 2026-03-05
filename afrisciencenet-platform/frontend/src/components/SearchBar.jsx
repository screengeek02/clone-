import React from 'react';

export default function SearchBar({ placeholder }) {
  return (
    <form className="asn-search asn-glass" role="search">
      <input aria-label="Search" placeholder={placeholder} />
      <button type="submit" className="asn-btn asn-btn-primary">Search</button>
    </form>
  );
}
