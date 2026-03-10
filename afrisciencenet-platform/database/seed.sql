INSERT INTO institutions (id, name, country, city, research_field, description, website, contact_info) VALUES
(1, 'University of Lagos Research Lab', 'Nigeria', 'Lagos', 'Biomedical Engineering', 'Advanced biomedical instrumentation and diagnostics lab.', 'https://example-ulab.org', 'labadmin@ulab.org'),
(2, 'Nairobi Materials Institute', 'Kenya', 'Nairobi', 'Materials Science', 'Facility for advanced characterization and microscopy.', 'https://example-nmi.org', 'contact@nmi.org');

INSERT INTO equipment (id, equipment_name, manufacturer, model, institution_id, country, city, department, description, technical_specifications, availability_status, contact_information, image_url) VALUES
(1, 'High-Resolution Microscope', 'Zeiss', 'Axio Imager M2', 1, 'Nigeria', 'Lagos', 'Microscopy Unit', 'Microscope for cellular and tissue imaging.', '40x/100x objectives, fluorescence support', 'available', 'microscopy@ulab.org', '/images/microscope.jpg'),
(2, 'FTIR Spectrometer', 'Thermo Fisher', 'Nicolet iS20', 2, 'Kenya', 'Nairobi', 'Characterization Lab', 'Spectrometer for molecular fingerprint analysis.', '4000–400 cm-1 range, ATR accessory', 'limited', 'ftir@nmi.org', '/images/ftir.jpg');

INSERT INTO resources (id, title, category, description, link, deadline) VALUES
(1, 'African Union Research Fellowship 2027', 'Funding', 'Competitive fellowship supporting cross-border research.', 'https://example.org/au-fellowship', '2027-02-28'),
(2, 'STEM Mobility Scholarships', 'Scholarship', 'Scholarship support for graduate mobility programs.', 'https://example.org/stem-mobility', '2026-11-15');

INSERT INTO forum_categories (id, name) VALUES
(1, 'Equipment Access'),
(2, 'Research Collaboration'),
(3, 'Funding Opportunities'),
(4, 'Graduate Opportunities');

INSERT INTO forum_posts (id, category_id, author_name, title, content) VALUES
(1, 1, 'Dr. A. Mensah', 'Need access to Raman spectrometer in West Africa', 'Looking for institutions with available Raman systems for polymer analysis.'),
(2, 2, 'R. Okeke', 'Seeking collaborators for malaria genomics project', 'Open to collaborators with sequencing and bioinformatics capacity.');
