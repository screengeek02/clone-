import { UserRole, ApprovalStatus, AvailabilityStatus, FundingStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';

async function main() {
  const passwordHash = await bcrypt.hash('ChangeMe123!', 10);

  const countries = await Promise.all([
    prisma.country.upsert({ where: { code: 'NG' }, update: {}, create: { code: 'NG', name: 'Nigeria', region: 'West Africa' } }),
    prisma.country.upsert({ where: { code: 'KE' }, update: {}, create: { code: 'KE', name: 'Kenya', region: 'East Africa' } }),
    prisma.country.upsert({ where: { code: 'GH' }, update: {}, create: { code: 'GH', name: 'Ghana', region: 'West Africa' } }),
    prisma.country.upsert({ where: { code: 'RW' }, update: {}, create: { code: 'RW', name: 'Rwanda', region: 'East Africa' } }),
    prisma.country.upsert({ where: { code: 'ZA' }, update: {}, create: { code: 'ZA', name: 'South Africa', region: 'Southern Africa' } })
  ]);

  const disciplines = await Promise.all([
    prisma.discipline.upsert({ where: { slug: 'biomedical-engineering' }, update: {}, create: { name: 'Biomedical Engineering', slug: 'biomedical-engineering' } }),
    prisma.discipline.upsert({ where: { slug: 'materials-science' }, update: {}, create: { name: 'Materials Science', slug: 'materials-science' } }),
    prisma.discipline.upsert({ where: { slug: 'molecular-biology' }, update: {}, create: { name: 'Molecular Biology', slug: 'molecular-biology' } })
  ]);

  const superAdmin = await prisma.user.upsert({ where: { email: 'admin@afrisciencenet.org' }, update: {}, create: { email: 'admin@afrisciencenet.org', name: 'Platform Admin', role: UserRole.SUPER_ADMIN, passwordHash, isApproved: true } });
  const institutionAdmin = await prisma.user.upsert({ where: { email: 'institution@afrisciencenet.org' }, update: {}, create: { email: 'institution@afrisciencenet.org', name: 'Institution Manager', role: UserRole.INSTITUTION_ADMIN, passwordHash, isApproved: true } });
  const researcherUser = await prisma.user.upsert({ where: { email: 'researcher@afrisciencenet.org' }, update: {}, create: { email: 'researcher@afrisciencenet.org', name: 'Dr. Amina Okafor', role: UserRole.RESEARCHER, passwordHash, isApproved: true } });

  const inst1 = await prisma.institution.upsert({
    where: { slug: 'university-of-lagos-research-lab' }, update: {},
    create: { name: 'University of Lagos Research Lab', slug: 'university-of-lagos-research-lab', type: 'University', countryId: countries[0].id, region: 'West Africa', city: 'Lagos', website: 'https://unilag.edu.ng', email: 'lab@unilag.edu.ng', verificationStatus: 'VERIFIED', focalPersonUserId: institutionAdmin.id, approvalStatus: ApprovalStatus.APPROVED }
  });
  const inst2 = await prisma.institution.upsert({
    where: { slug: 'nairobi-materials-institute' }, update: {},
    create: { name: 'Nairobi Materials Institute', slug: 'nairobi-materials-institute', type: 'Research Institute', countryId: countries[1].id, region: 'East Africa', city: 'Nairobi', website: 'https://nmi.ke', email: 'info@nmi.ke', verificationStatus: 'VERIFIED', approvalStatus: ApprovalStatus.APPROVED }
  });

  await prisma.researcherProfile.upsert({
    where: { userId: researcherUser.id }, update: {},
    create: { userId: researcherUser.id, fullName: 'Dr. Amina Okafor', slug: 'dr-amina-okafor', title: 'Senior Research Scientist', institutionId: inst1.id, countryId: countries[0].id, disciplineId: disciplines[0].id, subSpecialties: ['Diagnostic Devices', 'Bioinstrumentation'], bio: 'Leads translational biomedical research initiatives.', expertiseAreas: ['Microscopy', 'Clinical instrumentation'], keyPublications: ['Open instrumentation access in low-resource settings (2024)'], orcid: '0000-0002-1825-0097', availableForCollaboration: true, availableForSupervision: true, verificationStatus: 'VERIFIED', approvalStatus: ApprovalStatus.APPROVED, featured: true, createdByUserId: researcherUser.id }
  });

  const eq1 = await prisma.equipment.upsert({
    where: { slug: 'high-resolution-microscope-zeiss-axio-imager-m2' }, update: {},
    create: { title: 'High-Resolution Microscope', slug: 'high-resolution-microscope-zeiss-axio-imager-m2', manufacturer: 'Zeiss', model: 'Axio Imager M2', category: 'Microscopy', institutionId: inst1.id, labName: 'Central Imaging Lab', department: 'Biomedical Engineering', countryId: countries[0].id, region: 'West Africa', city: 'Lagos', description: 'High-resolution fluorescence microscopy platform.', technicalSpecifications: '40x/100x objectives, fluorescence module', yearInstalled: 2022, fundingSource: 'World Bank', availabilityStatus: AvailabilityStatus.AVAILABLE, bookingEnabled: true, contactPersonName: 'Lab Officer', contactPersonEmail: 'microscopy@unilag.edu.ng', createdByUserId: institutionAdmin.id, approvalStatus: ApprovalStatus.APPROVED, featured: true }
  });

  await prisma.equipmentImage.createMany({ data: [{ equipmentId: eq1.id, url: '/uploads/equipment/microscope-1.jpg', alt: 'Microscope front view' }] });
  await prisma.equipmentDocument.createMany({ data: [{ equipmentId: eq1.id, url: '/uploads/equipment/microscope-spec.pdf', fileType: 'application/pdf' }] });

  await prisma.equipment.upsert({
    where: { slug: 'ftir-spectrometer-thermo-nicolet-is20' }, update: {},
    create: { title: 'FTIR Spectrometer', slug: 'ftir-spectrometer-thermo-nicolet-is20', manufacturer: 'Thermo Fisher', model: 'Nicolet iS20', category: 'Spectroscopy', institutionId: inst2.id, labName: 'Characterization Unit', department: 'Materials Science', countryId: countries[1].id, region: 'East Africa', city: 'Nairobi', description: 'Molecular fingerprint analysis for materials.', technicalSpecifications: '4000–400 cm−1 with ATR accessory', yearInstalled: 2021, fundingSource: 'AfDB', availabilityStatus: AvailabilityStatus.LIMITED, bookingEnabled: true, contactPersonName: 'Facility Manager', contactPersonEmail: 'ftir@nmi.ke', createdByUserId: institutionAdmin.id, approvalStatus: ApprovalStatus.APPROVED, featured: true }
  });

  for (const provider of ['World Bank', 'DAAD', 'Erasmus+', 'Commonwealth', 'Fulbright', 'UKRI', 'JICA', 'AfDB']) {
    await prisma.fundingOpportunity.upsert({
      where: { slug: `${provider.toLowerCase().replace(/\+/g, 'plus').replace(/\s+/g, '-')}-research-grant-2027` }, update: {},
      create: {
        title: `${provider} Research Grant 2027`, slug: `${provider.toLowerCase().replace(/\+/g, 'plus').replace(/\s+/g, '-')}-research-grant-2027`, provider,
        fundingType: 'Equipment Grants', degreeLevel: 'Postdoc', fieldTags: ['STEM', 'Infrastructure'], countryEligibility: ['All African Countries'], regionEligibility: ['Africa'], deadline: new Date('2027-09-30'), amount: 'USD 250,000', summary: `Competitive grant program by ${provider} for research infrastructure.`, description: 'Supports equipment procurement, lab upgrades, and collaborative research networks.', sourceUrl: 'https://example.org/funding', applicationProcess: 'Online submission with institutional endorsement.', status: FundingStatus.OPEN, featured: provider === 'World Bank' || provider === 'DAAD', createdByUserId: superAdmin.id, approvalStatus: ApprovalStatus.APPROVED
      }
    });
  }

  await prisma.collaborationPost.upsert({
    where: { slug: 'malaria-genomics-cross-lab-consortium' }, update: {},
    create: { title: 'Malaria Genomics Cross-Lab Consortium', slug: 'malaria-genomics-cross-lab-consortium', summary: 'Seeking partner labs for multi-country sequencing initiative.', description: 'Open call for genomic sequencing partners and epidemiology teams.', category: 'Partner Search', disciplineId: disciplines[2].id, institutionId: inst1.id, countryId: countries[0].id, collaborationType: 'Consortium Building', deadline: new Date('2027-06-01'), contactMethod: 'contact@afrisciencenet.org', createdByUserId: researcherUser.id, approvalStatus: ApprovalStatus.APPROVED }
  });

  await prisma.project.upsert({
    where: { slug: 'pan-africa-portable-pcr-network' }, update: {},
    create: { title: 'Pan-Africa Portable PCR Network', slug: 'pan-africa-portable-pcr-network', summary: 'Building distributed PCR capacity across regional labs.', description: 'Cross-country project to improve pathogen surveillance capacity.', leadInstitutionId: inst1.id, countryId: countries[0].id, disciplineId: disciplines[2].id, status: 'ACTIVE', teamSize: 18, fundingSource: 'UKRI', equipmentNeeded: ['PCR Thermal Cyclers', 'Cold Chain Logistics'], startDate: new Date('2026-01-01'), endDate: new Date('2028-01-01'), createdByUserId: researcherUser.id, approvalStatus: ApprovalStatus.APPROVED }
  });

  await prisma.dataset.upsert({
    where: { slug: 'west-africa-lab-equipment-utilization-2025' }, update: {},
    create: { title: 'West Africa Lab Equipment Utilization 2025', slug: 'west-africa-lab-equipment-utilization-2025', summary: 'Aggregated utilization metrics for selected equipment facilities.', description: 'Dataset includes institution-level usage, downtime and maintenance metadata.', ownerInstitutionId: inst1.id, countryId: countries[0].id, license: 'CC-BY-4.0', repositoryUrl: 'https://example.org/datasets/equipment-utilization', fileFormat: 'CSV', size: '24MB', keywords: ['equipment', 'utilization', 'labs'], contactEmail: 'data@afrisciencenet.org', createdByUserId: superAdmin.id, approvalStatus: ApprovalStatus.APPROVED }
  });

  console.log('Seed completed');
}

main().finally(async () => prisma.$disconnect());
