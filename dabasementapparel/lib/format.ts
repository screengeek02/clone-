export const formatPriceRange = (priceMin?: number, priceMax?: number) => {
  if (!priceMin && !priceMax) return 'Price varies';
  if (priceMin && priceMax && priceMin !== priceMax) return `$${priceMin} - $${priceMax}`;
  return `$${priceMin ?? priceMax}`;
};
