-- Seed Data: All 36 States + FCT and Accredited Universities across Nigeria

-- 1. Insert States
INSERT INTO public.states (name, code) VALUES
  ('Abia', 'AB'),
  ('Adamawa', 'AD'),
  ('Akwa Ibom', 'AK'),
  ('Anambra', 'AN'),
  ('Bauchi', 'BA'),
  ('Bayelsa', 'BY'),
  ('Benue', 'BE'),
  ('Borno', 'BO'),
  ('Cross River', 'CR'),
  ('Delta', 'DE'),
  ('Ebonyi', 'EB'),
  ('Edo', 'ED'),
  ('Ekiti', 'EK'),
  ('Enugu', 'EN'),
  ('Federal Capital Territory', 'FC'),
  ('Gombe', 'GO'),
  ('Imo', 'IM'),
  ('Jigawa', 'JI'),
  ('Kaduna', 'KD'),
  ('Kano', 'KN'),
  ('Katsina', 'KT'),
  ('Kebbi', 'KE'),
  ('Kogi', 'KO'),
  ('Kwara', 'KW'),
  ('Lagos', 'LA'),
  ('Nasarawa', 'NA'),
  ('Niger', 'NI'),
  ('Ogun', 'OG'),
  ('Ondo', 'ON'),
  ('Osun', 'OS'),
  ('Oyo', 'OY'),
  ('Plateau', 'PL'),
  ('Rivers', 'RI'),
  ('Sokoto', 'SO'),
  ('Taraba', 'TA'),
  ('Yobe', 'YO'),
  ('Zamfara', 'ZA')
ON CONFLICT (name) DO NOTHING;

-- 2. Insert Universities with linked state_id
INSERT INTO public.universities (name, slug, acronym, university_type, state_id, website_url, is_active)
SELECT 
  u.name, 
  u.slug, 
  u.acronym, 
  u.university_type, 
  s.id, 
  u.website_url, 
  true
FROM (
  VALUES
    -- Federal
    ('University of Lagos', 'university-of-lagos', 'UNILAG', 'federal', 'Lagos', 'https://unilag.edu.ng'),
    ('University of Ibadan', 'university-of-ibadan', 'UI', 'federal', 'Oyo', 'https://ui.edu.ng'),
    ('University of Nigeria, Nsukka', 'university-of-nigeria-nsukka', 'UNN', 'federal', 'Enugu', 'https://unn.edu.ng'),
    ('Ahmadu Bello University', 'ahmadu-bello-university', 'ABU', 'federal', 'Kaduna', 'https://abu.edu.ng'),
    ('Obafemi Awolowo University', 'obafemi-awolowo-university', 'OAU', 'federal', 'Osun', 'https://oauife.edu.ng'),
    ('University of Benin', 'university-of-benin', 'UNIBEN', 'federal', 'Edo', 'https://uniben.edu'),
    ('University of Ilorin', 'university-of-ilorin', 'UNILORIN', 'federal', 'Kwara', 'https://unilorin.edu.ng'),
    ('University of Jos', 'university-of-jos', 'UNIJOS', 'federal', 'Plateau', 'https://unijos.edu.ng'),
    ('University of Port Harcourt', 'university-of-port-harcourt', 'UNIPORT', 'federal', 'Rivers', 'https://uniport.edu.ng'),
    ('University of Calabar', 'university-of-calabar', 'UNICAL', 'federal', 'Cross River', 'https://unical.edu.ng'),
    ('University of Abuja', 'university-of-abuja', 'UNIABUJA', 'federal', 'Federal Capital Territory', 'https://uniabuja.edu.ng'),
    ('University of Uyo', 'university-of-uyo', 'UNIUYO', 'federal', 'Akwa Ibom', 'https://uniuyo.edu.ng'),
    ('University of Maiduguri', 'university-of-maiduguri', 'UNIMAID', 'federal', 'Borno', 'https://unimaid.edu.ng'),
    ('Nnamdi Azikiwe University', 'nnamdi-azikiwe-university', 'UNIZIK', 'federal', 'Anambra', 'https://unizik.edu.ng'),
    ('Federal University of Technology, Akure', 'federal-university-of-technology-akure', 'FUTA', 'federal', 'Ondo', 'https://futa.edu.ng'),
    ('Federal University of Technology, Minna', 'federal-university-of-technology-minna', 'FUTMINNA', 'federal', 'Niger', 'https://futminna.edu.ng'),
    ('Federal University of Technology, Owerri', 'federal-university-of-technology-owerri', 'FUTO', 'federal', 'Imo', 'https://futo.edu.ng'),
    ('Abubakar Tafawa Balewa University', 'abubakar-tafawa-balewa-university', 'ATBU', 'federal', 'Bauchi', 'https://atbu.edu.ng'),
    ('Bayero University Kano', 'bayero-university-kano', 'BUK', 'federal', 'Kano', 'https://buk.edu.ng'),
    ('Federal University of Agriculture, Abeokuta', 'federal-university-of-agriculture-abeokuta', 'FUNAAB', 'federal', 'Ogun', 'https://funaab.edu.ng'),
    ('Usmanu Danfodiyo University', 'usmanu-danfodiyo-university', 'UDUS', 'federal', 'Sokoto', 'https://udusok.edu.ng'),
    ('Federal University, Oye-Ekiti', 'federal-university-oye-ekiti', 'FUOYE', 'federal', 'Ekiti', 'https://fuoye.edu.ng'),
    ('Federal University, Dutse', 'federal-university-dutse', 'FUD', 'federal', 'Jigawa', 'https://fud.edu.ng'),
    ('Federal University, Lafia', 'federal-university-lafia', 'FULAFIA', 'federal', 'Nasarawa', 'https://fulafia.edu.ng'),
    ('Federal University, Lokoja', 'federal-university-lokoja', 'FULOKOJA', 'federal', 'Kogi', 'https://fulokoja.edu.ng'),
    ('Federal University, Ndufu-Alike', 'federal-university-ndufu-alike', 'AE-FUNAI', 'federal', 'Ebonyi', 'https://funai.edu.ng'),
    ('Federal University, Otuoke', 'federal-university-otuoke', 'FUOTUOKE', 'federal', 'Bayelsa', 'https://fuotuoke.edu.ng'),
    ('Federal University, Wukari', 'federal-university-wukari', 'FUWUKARI', 'federal', 'Taraba', 'https://fuwukari.edu.ng'),
    ('Federal University of Petroleum Resources, Effurun', 'federal-university-of-petroleum-resources-effurun', 'FUPRE', 'federal', 'Delta', 'https://fupre.edu.ng'),
    ('Michael Okpara University of Agriculture, Umudike', 'michael-okpara-university-of-agriculture-umudike', 'MOUAU', 'federal', 'Abia', 'https://mouau.edu.ng'),
    ('Modibbo Adama University', 'modibbo-adama-university', 'MAU', 'federal', 'Adamawa', 'https://mau.edu.ng'),

    -- State
    ('Lagos State University', 'lagos-state-university', 'LASU', 'state', 'Lagos', 'https://lasu.edu.ng'),
    ('Lagos State University of Science and Technology', 'lagos-state-university-of-science-and-technology', 'LASUSTECH', 'state', 'Lagos', 'https://lasustech.edu.ng'),
    ('Lagos State University of Education', 'lagos-state-university-of-education', 'LASUED', 'state', 'Lagos', 'https://lasued.edu.ng'),
    ('Ladoke Akintola University of Technology', 'ladoke-akintola-university-of-technology', 'LAUTECH', 'state', 'Oyo', 'https://lautech.edu.ng'),
    ('Olabisi Onabanjo University', 'olabisi-onabanjo-university', 'OOU', 'state', 'Ogun', 'https://oouagoiwoye.edu.ng'),
    ('Ekiti State University', 'ekiti-state-university', 'EKSU', 'state', 'Ekiti', 'https://eksu.edu.ng'),
    ('Adekunle Ajasin University', 'adekunle-ajasin-university', 'AAUA', 'state', 'Ondo', 'https://aaua.edu.ng'),
    ('Ambrose Alli University', 'ambrose-alli-university', 'AAU', 'state', 'Edo', 'https://aauekpoma.edu.ng'),
    ('Delta State University', 'delta-state-university', 'DELSU', 'state', 'Delta', 'https://delsu.edu.ng'),
    ('Rivers State University', 'rivers-state-university', 'RSU', 'state', 'Rivers', 'https://rsu.edu.ng'),
    ('Ignatius Ajuru University of Education', 'ignatius-ajuru-university-of-education', 'IAUE', 'state', 'Rivers', 'https://iaue.edu.ng'),
    ('Kwara State University', 'kwara-state-university', 'KWASU', 'state', 'Kwara', 'https://kwasu.edu.ng'),
    ('Enugu State University of Science and Technology', 'enugu-state-university-of-science-and-technology', 'ESUT', 'state', 'Enugu', 'https://esut.edu.ng'),
    ('Abia State University', 'abia-state-university', 'ABSU', 'state', 'Abia', 'https://abiastateuniversity.edu.ng'),
    ('Imo State University', 'imo-state-university', 'IMSU', 'state', 'Imo', 'https://imsu.edu.ng'),
    ('Chukwuemeka Odumegwu Ojukwu University', 'chukwuemeka-odumegwu-ojukwu-university', 'COOU', 'state', 'Anambra', 'https://coou.edu.ng'),
    ('Benue State University', 'benue-state-university', 'BSUM', 'state', 'Benue', 'https://bsum.edu.ng'),
    ('Kogi State University', 'kogi-state-university', 'KSU', 'state', 'Kogi', 'https://ksu.edu.ng'),
    ('Nasarawa State University', 'nasarawa-state-university', 'NSUK', 'state', 'Nasarawa', 'https://nsuk.edu.ng'),
    ('Kaduna State University', 'kaduna-state-university', 'KASU', 'state', 'Kaduna', 'https://kasu.edu.ng'),
    ('Yusuf Maitama Sule University', 'yusuf-maitama-sule-university', 'YUMSUK', 'state', 'Kano', 'https://yumsuk.edu.ng'),
    ('Umaru Musa Yar’adua University', 'umaru-musa-yaradua-university', 'UMYU', 'state', 'Katsina', 'https://umyu.edu.ng'),
    ('Taraba State University', 'taraba-state-university', 'TSU', 'state', 'Taraba', 'https://tsuniversity.edu.ng'),
    ('Osun State University', 'osun-state-university', 'UNIOSUN', 'state', 'Osun', 'https://uniosun.edu.ng'),

    -- Private
    ('Covenant University', 'covenant-university', 'CU', 'private', 'Ogun', 'https://covenantuniversity.edu.ng'),
    ('Babcock University', 'babcock-university', 'BU', 'private', 'Ogun', 'https://babcock.edu.ng'),
    ('Afe Babalola University', 'afe-babalola-university', 'ABUAD', 'private', 'Ekiti', 'https://abuad.edu.ng'),
    ('Pan-Atlantic University', 'pan-atlantic-university', 'PAU', 'private', 'Lagos', 'https://pau.edu.ng'),
    ('Bowen University', 'bowen-university', 'BU', 'private', 'Osun', 'https://bowen.edu.ng'),
    ('Baze University', 'baze-university', 'BAZE', 'private', 'Federal Capital Territory', 'https://bazeuniversity.edu.ng'),
    ('Nile University of Nigeria', 'nile-university-of-nigeria', 'NILE', 'private', 'Federal Capital Territory', 'https://nile.edu.ng'),
    ('American University of Nigeria', 'american-university-of-nigeria', 'AUN', 'private', 'Adamawa', 'https://aun.edu.ng'),
    ('Igbinedion University', 'igbinedion-university', 'IUO', 'private', 'Edo', 'https://iuokada.edu.ng'),
    ('Bells University of Technology', 'bells-university-of-technology', 'BELLSTECH', 'private', 'Ogun', 'https://bellsuniversity.edu.ng'),
    ('Landmark University', 'landmark-university', 'LMU', 'private', 'Kwara', 'https://lmu.edu.ng'),
    ('Redeemer’s University', 'redeemers-university', 'RUN', 'private', 'Osun', 'https://run.edu.ng'),
    ('Al-Hikmah University', 'al-hikmah-university', 'HUI', 'private', 'Kwara', 'https://alhikmahuniversity.edu.ng'),
    ('Veritas University', 'veritas-university', 'VUNA', 'private', 'Federal Capital Territory', 'https://veritas.edu.ng'),
    ('Lead City University', 'lead-city-university', 'LCU', 'private', 'Oyo', 'https://lcu.edu.ng'),
    ('Caleb University', 'caleb-university', 'CALEB', 'private', 'Lagos', 'https://calebuniversity.edu.ng'),
    ('Madonna University', 'madonna-university', 'MADONNA', 'private', 'Rivers', 'https://madonnauniversity.edu.ng'),
    ('Bingham University', 'bingham-university', 'BINGHAM', 'private', 'Nasarawa', 'https://binghamuni.edu.ng'),
    ('Adeleke University', 'adeleke-university', 'AU', 'private', 'Osun', 'https://adelekeuniversity.edu.ng'),
    ('Achievers University', 'achievers-university', 'AUO', 'private', 'Ondo', 'https://achievers.edu.ng'),
    ('Crawford University', 'crawford-university', 'CRU', 'private', 'Ogun', 'https://crawforduniversity.edu.ng')
) AS u(name, slug, acronym, university_type, state_name, website_url)
JOIN public.states s ON s.name = u.state_name
ON CONFLICT (slug) DO UPDATE SET
  acronym = EXCLUDED.acronym,
  website_url = EXCLUDED.website_url;

-- 3. Insert Main Campuses for Universities
INSERT INTO public.campuses (university_id, name, address, is_active)
SELECT 
  u.id, 
  'Main Campus', 
  u.name || ' Main Campus', 
  true
FROM public.universities u
ON CONFLICT DO NOTHING;

