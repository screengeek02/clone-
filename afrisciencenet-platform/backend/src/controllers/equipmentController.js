import { equipment } from '../db/mockData.js';

export function listEquipment(req, res) {
  const { q, institution, country } = req.query;

  const filtered = equipment.filter((item) => {
    const matchesQ = !q || [
      item.equipmentName,
      item.model,
      item.manufacturer,
      item.description,
      item.department
    ].join(' ').toLowerCase().includes(String(q).toLowerCase());

    const matchesInstitution = !institution || item.institution.toLowerCase() === String(institution).toLowerCase();
    const matchesCountry = !country || item.country.toLowerCase() === String(country).toLowerCase();

    return matchesQ && matchesInstitution && matchesCountry;
  });

  res.json({
    total: filtered.length,
    data: filtered
  });
}

export function getEquipmentById(req, res) {
  const id = Number(req.params.id);
  const item = equipment.find((entry) => entry.id === id);

  if (!item) {
    return res.status(404).json({ message: 'Equipment not found' });
  }

  return res.json(item);
}
