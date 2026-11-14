import {
  Lodge,
  Room,
  Inspection,
  InspectionStatus,
  InspectionTimeSlot,
  RoomAvailabilityStatus,
  AccommodationType,
  AmenityKey,
} from '@/types/database';

export const AMENITIES_CATALOG: { key: AmenityKey; label: string; icon: string }[] = [
  { key: 'running_water', label: 'Borehole / Running Water', icon: 'Droplets' },
  { key: 'solar_inverter', label: 'Solar / Inverter Backup', icon: 'Sun' },
  { key: 'generator', label: 'Central Standby Generator', icon: 'Zap' },
  { key: 'security_guard', label: '24/7 Security Guard', icon: 'ShieldCheck' },
  { key: 'gated_compound', label: 'Fenced & Gated Compound', icon: 'Lock' },
  { key: 'prepaid_meter', label: 'Individual Prepaid Meter', icon: 'Gauge' },
  { key: 'wifi', label: 'High-speed Wi-Fi', icon: 'Wifi' },
  { key: 'wardrobe', label: 'Fitted Wardrobe', icon: 'Layers' },
  { key: 'tiled_floor', label: 'Fully Tiled Interior', icon: 'Grid' },
  { key: 'kitchen_cabinet', label: 'Kitchen Cabinets & Sink', icon: 'Utensils' },
];

export const SEED_LODGES: Lodge[] = [
  {
    id: 'lodge-unilag-01',
    title: 'Heritage Heights Student Villa',
    slug: 'heritage-heights-student-villa',
    description:
      'Modern executive student accommodation located right in the heart of Akoka, Yaba. Features reliable 24/7 borehole running water, solar inverter backup for nighttime reading, secured gated perimeter with uniformed security guard, and dedicated prepaid electricity meters per unit. Walking distance to UNILAG campus gate.',
    landlord_id: 'landlord-adebayo',
    landlord_name: 'Chief Adebayo Olanrewaju',
    landlord_phone: '+234 803 234 5678',
    landlord_verified: true,
    university_slug: 'university-of-lagos',
    university_name: 'University of Lagos',
    campus_name: 'Akoka Main Campus',
    neighbourhood: 'Akoka, Yaba',
    address: '14 St. Finbarrs College Road, Akoka, Yaba, Lagos',
    distance_to_campus: '5 mins walk from UNILAG Main Gate',
    accommodation_type: 'self_contained',
    pricing: {
      min_price: 450000,
      max_price: 520000,
      caution_deposit: 50000,
      service_charge: 35000,
      legal_agency_fee: 0,
    },
    amenities: [
      'running_water',
      'solar_inverter',
      'security_guard',
      'gated_compound',
      'prepaid_meter',
      'tiled_floor',
      'wardrobe',
    ],
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
    ],
    status: 'approved',
    rating: 4.9,
    review_count: 18,
    total_rooms: 12,
    available_rooms: 3,
    created_at: '2026-10-15T10:00:00Z',
  },
  {
    id: 'lodge-unilag-02',
    title: 'Emerald Crest Residence',
    slug: 'emerald-crest-residence',
    description:
      'Premium student apartments designed for scholars who value privacy and peaceful study. Located off University Road with high-speed fiber Wi-Fi, central backup generator, paved compound, and spacious rooms equipped with modern kitchenettes and ensuite bathrooms.',
    landlord_id: 'landlord-folashade',
    landlord_name: 'Engr. Folashade Adeleke',
    landlord_phone: '+234 812 345 6789',
    landlord_verified: true,
    university_slug: 'university-of-lagos',
    university_name: 'University of Lagos',
    campus_name: 'Akoka Main Campus',
    neighbourhood: 'University Road, Akoka',
    address: '28 University Road, Akoka, Lagos',
    distance_to_campus: '3 mins walk from UNILAG Second Gate',
    accommodation_type: 'one_bedroom',
    pricing: {
      min_price: 550000,
      max_price: 650000,
      caution_deposit: 60000,
      service_charge: 40000,
      legal_agency_fee: 0,
    },
    amenities: [
      'running_water',
      'generator',
      'wifi',
      'gated_compound',
      'security_guard',
      'prepaid_meter',
      'kitchen_cabinet',
      'tiled_floor',
    ],
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80',
    ],
    status: 'approved',
    rating: 4.8,
    review_count: 14,
    total_rooms: 8,
    available_rooms: 2,
    created_at: '2026-10-18T12:00:00Z',
  },
  {
    id: 'lodge-unilag-03',
    title: 'Apex Scholars Court',
    slug: 'apex-scholars-court',
    description:
      'Affordable, well-maintained single and self-contained student rooms in Abule Oja. Quiet atmosphere, close to student markets, with constant pumped borehole water, perimeter lighting, and friendly on-site caretaker.',
    landlord_id: 'landlord-adebayo',
    landlord_name: 'Chief Adebayo Olanrewaju',
    landlord_phone: '+234 803 234 5678',
    landlord_verified: true,
    university_slug: 'university-of-lagos',
    university_name: 'University of Lagos',
    campus_name: 'Akoka Main Campus',
    neighbourhood: 'Abule Oja, Yaba',
    address: '9 Commercial Avenue, Abule Oja, Yaba, Lagos',
    distance_to_campus: '8 mins walk from UNILAG Back Gate',
    accommodation_type: 'single_room',
    pricing: {
      min_price: 320000,
      max_price: 380000,
      caution_deposit: 30000,
      service_charge: 20000,
      legal_agency_fee: 0,
    },
    amenities: [
      'running_water',
      'gated_compound',
      'prepaid_meter',
      'tiled_floor',
    ],
    images: [
      'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    ],
    status: 'approved',
    rating: 4.7,
    review_count: 9,
    total_rooms: 16,
    available_rooms: 4,
    created_at: '2026-10-22T08:30:00Z',
  },
  {
    id: 'lodge-ui-01',
    title: 'Premier Court Suites',
    slug: 'premier-court-suites',
    description:
      'Top-rated student residence situated right in Agbowo opposite University of Ibadan Main Gate. Fully fenced with electric wire fencing, industrial borehole, study lounge with 24-hour solar electricity, and spacious rooms.',
    landlord_id: 'landlord-ibrahim',
    landlord_name: 'Alhaji Ibrahim Danjuma',
    landlord_phone: '+234 802 987 6543',
    landlord_verified: true,
    university_slug: 'university-of-ibadan',
    university_name: 'University of Ibadan',
    campus_name: 'Main Campus',
    neighbourhood: 'Agbowo, Ibadan',
    address: '15 UI Road, Opposite Main Gate, Agbowo, Ibadan, Oyo State',
    distance_to_campus: '3 mins walk from UI Main Gate',
    accommodation_type: 'self_contained',
    pricing: {
      min_price: 280000,
      max_price: 340000,
      caution_deposit: 30000,
      service_charge: 25000,
      legal_agency_fee: 0,
    },
    amenities: [
      'running_water',
      'solar_inverter',
      'security_guard',
      'gated_compound',
      'prepaid_meter',
      'tiled_floor',
      'wardrobe',
    ],
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
    ],
    status: 'approved',
    rating: 4.9,
    review_count: 22,
    total_rooms: 10,
    available_rooms: 2,
    created_at: '2026-10-12T14:00:00Z',
  },
  {
    id: 'lodge-ui-02',
    title: "Scholar's Haven Lodge",
    slug: 'scholars-haven-lodge',
    description:
      'Peaceful 1-bedroom apartments and shared flats in Bodija close to UI Second Gate. Ideal for postgraduate and undergraduate students looking for quiet surroundings, ample water storage tanks, and dedicated parking.',
    landlord_id: 'landlord-ibrahim',
    landlord_name: 'Alhaji Ibrahim Danjuma',
    landlord_phone: '+234 802 987 6543',
    landlord_verified: true,
    university_slug: 'university-of-ibadan',
    university_name: 'University of Ibadan',
    campus_name: 'Main Campus',
    neighbourhood: 'Bodija, Ibadan',
    address: '4 Osuntokun Avenue, Old Bodija, Ibadan',
    distance_to_campus: '6 mins drive / 12 mins walk to UI Second Gate',
    accommodation_type: 'one_bedroom',
    pricing: {
      min_price: 350000,
      max_price: 420000,
      caution_deposit: 40000,
      service_charge: 30000,
      legal_agency_fee: 0,
    },
    amenities: [
      'running_water',
      'gated_compound',
      'security_guard',
      'prepaid_meter',
      'kitchen_cabinet',
      'tiled_floor',
    ],
    images: [
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
    ],
    status: 'approved',
    rating: 4.8,
    review_count: 11,
    total_rooms: 6,
    available_rooms: 1,
    created_at: '2026-10-25T11:20:00Z',
  },
  {
    id: 'lodge-unn-01',
    title: 'Lion Gate Executive Villa',
    slug: 'lion-gate-executive-villa',
    description:
      'Premier off-campus accommodation for UNN students in Ofulonu. Consistent water supply powered by a heavy-duty solar submersible pump, fenced compound with security lighting, and fully tiled rooms.',
    landlord_id: 'landlord-chukwu',
    landlord_name: 'Dr. Emeka Chukwu',
    landlord_phone: '+234 803 765 4321',
    landlord_verified: true,
    university_slug: 'university-of-nigeria-nsukka',
    university_name: 'University of Nigeria, Nsukka',
    campus_name: 'Nsukka Campus',
    neighbourhood: 'Ofulonu, Nsukka',
    address: '8 University Market Road, Ofulonu, Nsukka, Enugu State',
    distance_to_campus: '5 mins walk from UNN Franco Gate',
    accommodation_type: 'self_contained',
    pricing: {
      min_price: 250000,
      max_price: 300000,
      caution_deposit: 25000,
      service_charge: 20000,
      legal_agency_fee: 0,
    },
    amenities: [
      'running_water',
      'solar_inverter',
      'gated_compound',
      'prepaid_meter',
      'tiled_floor',
      'wardrobe',
    ],
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
    ],
    status: 'approved',
    rating: 4.9,
    review_count: 16,
    total_rooms: 14,
    available_rooms: 4,
    created_at: '2026-10-14T09:15:00Z',
  },
  {
    id: 'lodge-oau-01',
    title: 'Great Ife Prime Lodge',
    slug: 'great-ife-prime-lodge',
    description:
      'Spacious self-contained rooms situated in Mayfair, Ile-Ife. Easy commute to campus via campus shuttles. Equipped with dual borehole system, solar-powered security perimeter lights, and individual balconies.',
    landlord_id: 'landlord-adebayo',
    landlord_name: 'Chief Adebayo Olanrewaju',
    landlord_phone: '+234 803 234 5678',
    landlord_verified: true,
    university_slug: 'obafemi-awolowo-university',
    university_name: 'Obafemi Awolowo University',
    campus_name: 'Main Campus',
    neighbourhood: 'Mayfair, Ile-Ife',
    address: '22 Mayfair Roundabout, Ile-Ife, Osun State',
    distance_to_campus: '8 mins campus shuttle to OAU Gate',
    accommodation_type: 'self_contained',
    pricing: {
      min_price: 300000,
      max_price: 360000,
      caution_deposit: 30000,
      service_charge: 25000,
      legal_agency_fee: 0,
    },
    amenities: [
      'running_water',
      'solar_inverter',
      'security_guard',
      'gated_compound',
      'prepaid_meter',
      'tiled_floor',
    ],
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
    ],
    status: 'approved',
    rating: 4.8,
    review_count: 8,
    total_rooms: 10,
    available_rooms: 3,
    created_at: '2026-10-20T16:45:00Z',
  },
  {
    id: 'lodge-futa-01',
    title: 'Apex Tech Lodging',
    slug: 'apex-tech-lodging',
    description:
      'Purpose-built student apartment 2 minutes from FUTA South Gate. High-speed Wi-Fi, constant water supply, solar reading lights in each room, and tight gated security.',
    landlord_id: 'landlord-folashade',
    landlord_name: 'Engr. Folashade Adeleke',
    landlord_phone: '+234 812 345 6789',
    landlord_verified: true,
    university_slug: 'federal-university-of-technology-akure',
    university_name: 'Federal University of Technology, Akure',
    campus_name: 'South Gate Campus',
    neighbourhood: 'South Gate, Akure',
    address: '5 South Gate Road, Akure, Ondo State',
    distance_to_campus: '2 mins walk from FUTA South Gate',
    accommodation_type: 'self_contained',
    pricing: {
      min_price: 260000,
      max_price: 310000,
      caution_deposit: 25000,
      service_charge: 20000,
      legal_agency_fee: 0,
    },
    amenities: [
      'running_water',
      'solar_inverter',
      'wifi',
      'security_guard',
      'gated_compound',
      'prepaid_meter',
      'tiled_floor',
    ],
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
    ],
    status: 'approved',
    rating: 4.9,
    review_count: 15,
    total_rooms: 12,
    available_rooms: 2,
    created_at: '2026-10-23T13:10:00Z',
  },
];

export const SEED_ROOMS: Room[] = [
  // Heritage Heights (lodge-unilag-01)
  {
    id: 'room-hh-101',
    property_id: 'lodge-unilag-01',
    room_number: 'Room 101 (Ground Floor)',
    title: 'Standard Executive Self-Contained',
    accommodation_type: 'self_contained',
    annual_rent: 450000,
    total_units: 1,
    available_units: 1,
    status: 'available',
    features: ['Private Bathroom', 'Kitchenette with Sink', 'Wardrobe', 'Prepaid Meter'],
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'],
    created_at: '2026-10-15T10:00:00Z',
  },
  {
    id: 'room-hh-102',
    property_id: 'lodge-unilag-01',
    room_number: 'Room 102 (Ground Floor)',
    title: 'Standard Executive Self-Contained',
    accommodation_type: 'self_contained',
    annual_rent: 450000,
    total_units: 1,
    available_units: 0,
    status: 'occupied',
    features: ['Private Bathroom', 'Kitchenette with Sink', 'Wardrobe'],
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'],
    created_at: '2026-10-15T10:00:00Z',
  },
  {
    id: 'room-hh-201',
    property_id: 'lodge-unilag-01',
    room_number: 'Room 201 (First Floor)',
    title: 'Deluxe Corner Self-Contained with Balcony',
    accommodation_type: 'self_contained',
    annual_rent: 520000,
    total_units: 1,
    available_units: 1,
    status: 'available',
    features: ['Private Balcony', 'Water Heater', 'Fitted Wardrobe', 'Cross-ventilation'],
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'],
    created_at: '2026-10-15T10:00:00Z',
  },
  {
    id: 'room-hh-202',
    property_id: 'lodge-unilag-01',
    room_number: 'Room 202 (First Floor)',
    title: 'Deluxe Corner Self-Contained with Balcony',
    accommodation_type: 'self_contained',
    annual_rent: 520000,
    total_units: 1,
    available_units: 1,
    status: 'available',
    features: ['Private Balcony', 'Water Heater', 'Fitted Wardrobe'],
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'],
    created_at: '2026-10-15T10:00:00Z',
  },

  // Emerald Crest (lodge-unilag-02)
  {
    id: 'room-ec-01',
    property_id: 'lodge-unilag-02',
    room_number: 'Flat 2A',
    title: '1-Bedroom Mini Flat with Living Room',
    accommodation_type: 'one_bedroom',
    annual_rent: 650000,
    total_units: 1,
    available_units: 1,
    status: 'available',
    features: ['Separate Sitting Room', 'Private Kitchen & Store', 'Water Heater', 'Fiber Wi-Fi'],
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'],
    created_at: '2026-10-18T12:00:00Z',
  },
  {
    id: 'room-ec-02',
    property_id: 'lodge-unilag-02',
    room_number: 'Flat 3B',
    title: '1-Bedroom Mini Flat with Balcony',
    accommodation_type: 'one_bedroom',
    annual_rent: 620000,
    total_units: 1,
    available_units: 1,
    status: 'available',
    features: ['Private Balcony', 'Dedicated Inverter Port', 'Modern Bathroom'],
    images: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80'],
    created_at: '2026-10-18T12:00:00Z',
  },

  // Premier Court Suites (lodge-ui-01)
  {
    id: 'room-pc-11',
    property_id: 'lodge-ui-01',
    room_number: 'Suite 11',
    title: 'Standard Self-Contained Room',
    accommodation_type: 'self_contained',
    annual_rent: 280000,
    total_units: 1,
    available_units: 1,
    status: 'available',
    features: ['Tiled Floor', 'Modern Toilet & Shower', 'Reading Table Space'],
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'],
    created_at: '2026-10-12T14:00:00Z',
  },
  {
    id: 'room-pc-12',
    property_id: 'lodge-ui-01',
    room_number: 'Suite 12',
    title: 'Large Self-Contained with Balcony',
    accommodation_type: 'self_contained',
    annual_rent: 340000,
    total_units: 1,
    available_units: 1,
    status: 'available',
    features: ['Private Balcony', 'Large Kitchenette', 'Constant Solar Lighting'],
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'],
    created_at: '2026-10-12T14:00:00Z',
  },
];

export const SEED_INSPECTIONS: Inspection[] = [
  {
    id: 'insp-001',
    property_id: 'lodge-unilag-01',
    property_title: 'Heritage Heights Student Villa',
    property_slug: 'heritage-heights-student-villa',
    property_address: '14 St. Finbarrs College Road, Akoka, Yaba, Lagos',
    property_image:
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
    student_id: 'student-demo-01',
    student_name: 'Daniel Okafor',
    student_phone: '+234 814 990 1234',
    student_email: 'daniel.student@example.com',
    landlord_id: 'landlord-adebayo',
    requested_date: '2026-11-18',
    time_slot: 'morning',
    status: 'accepted',
    student_notes: 'Interested in Room 201 on the first floor with the balcony.',
    landlord_notes: 'Confirmed. Caretaker Mr. Sunday will be on-site to show you around.',
    created_at: '2026-11-12T09:30:00Z',
  },
  {
    id: 'insp-002',
    property_id: 'lodge-ui-01',
    property_title: 'Premier Court Suites',
    property_slug: 'premier-court-suites',
    property_address: '15 UI Road, Opposite Main Gate, Agbowo, Ibadan',
    property_image:
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
    student_id: 'student-demo-01',
    student_name: 'Daniel Okafor',
    student_phone: '+234 814 990 1234',
    student_email: 'daniel.student@example.com',
    landlord_id: 'landlord-ibrahim',
    requested_date: '2026-11-20',
    time_slot: 'afternoon',
    status: 'pending',
    student_notes: 'Checking if solar power can support my PC workstation during exams.',
    created_at: '2026-11-14T11:00:00Z',
  },
  {
    id: 'insp-003',
    property_id: 'lodge-unilag-02',
    property_title: 'Emerald Crest Residence',
    property_slug: 'emerald-crest-residence',
    property_address: '28 University Road, Akoka, Lagos',
    property_image:
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    student_id: 'student-demo-02',
    student_name: 'Amina Bello',
    student_phone: '+234 809 112 3344',
    student_email: 'amina.bello@example.com',
    landlord_id: 'landlord-folashade',
    requested_date: '2026-11-16',
    time_slot: 'evening',
    status: 'reschedule_requested',
    rescheduled_date: '2026-11-17',
    rescheduled_time_slot: 'afternoon',
    student_notes: 'Looking to move in early next semester.',
    landlord_notes: 'I will be out of town on the 16th. Can we do Tuesday afternoon (17th) at 2pm instead?',
    created_at: '2026-11-13T15:20:00Z',
  },
];

// In-memory store fallback for SSR & test environments
const memoryStore = new Map<string, string>();

// Helper: safe storage access with localStorage and memory fallback
const STORAGE_KEYS = {
  LODGES: 'lodgehere_stored_lodges',
  ROOMS: 'lodgehere_stored_rooms',
  INSPECTIONS: 'lodgehere_stored_inspections',
};

function getStorage<T>(key: string, defaultValue: T): T {
  try {
    if (
      typeof window !== 'undefined' &&
      window.localStorage &&
      typeof window.localStorage.getItem === 'function'
    ) {
      const raw = window.localStorage.getItem(key);
      if (raw) return JSON.parse(raw) as T;
    }
  } catch {
    // fallback to memory store
  }

  const mem = memoryStore.get(key);
  if (mem) {
    try {
      return JSON.parse(mem) as T;
    } catch {
      return defaultValue;
    }
  }

  return defaultValue;
}

function setStorage<T>(key: string, value: T): void {
  const serialized = JSON.stringify(value);
  memoryStore.set(key, serialized);

  try {
    if (
      typeof window !== 'undefined' &&
      window.localStorage &&
      typeof window.localStorage.setItem === 'function'
    ) {
      window.localStorage.setItem(key, serialized);
      window.dispatchEvent(new CustomEvent('lodgehere-data-change', { detail: { key } }));
    }
  } catch {
    // Memory store already updated
  }
}

// Data API
export function getLodges(): Lodge[] {
  const custom = getStorage<Lodge[]>(STORAGE_KEYS.LODGES, []);
  // Return custom lodges prepended to seed lodges (custom can override if same ID)
  const map = new Map<string, Lodge>();
  SEED_LODGES.forEach((lodge) => map.set(lodge.id, lodge));
  custom.forEach((lodge) => map.set(lodge.id, lodge));
  return Array.from(map.values());
}

export function getLodgeBySlug(slug: string): Lodge | undefined {
  const lodges = getLodges();
  return lodges.find((l) => l.slug.toLowerCase() === slug.toLowerCase());
}

export function getLodgeById(id: string): Lodge | undefined {
  const lodges = getLodges();
  return lodges.find((l) => l.id === id);
}

export function saveLodge(lodge: Lodge): void {
  const current = getStorage<Lodge[]>(STORAGE_KEYS.LODGES, []);
  const idx = current.findIndex((l) => l.id === lodge.id);
  if (idx >= 0) {
    current[idx] = lodge;
  } else {
    current.unshift(lodge);
  }
  setStorage(STORAGE_KEYS.LODGES, current);
}

export function deleteLodge(id: string): void {
  const current = getStorage<Lodge[]>(STORAGE_KEYS.LODGES, []);
  const filtered = current.filter((l) => l.id !== id);
  setStorage(STORAGE_KEYS.LODGES, filtered);
}

export function getRooms(propertyId?: string): Room[] {
  const custom = getStorage<Room[]>(STORAGE_KEYS.ROOMS, []);
  const map = new Map<string, Room>();
  SEED_ROOMS.forEach((r) => map.set(r.id, r));
  custom.forEach((r) => map.set(r.id, r));
  const all = Array.from(map.values());
  return propertyId ? all.filter((r) => r.property_id === propertyId) : all;
}

export function saveRoom(room: Room): void {
  const current = getStorage<Room[]>(STORAGE_KEYS.ROOMS, []);
  const idx = current.findIndex((r) => r.id === room.id);
  if (idx >= 0) {
    current[idx] = room;
  } else {
    current.unshift(room);
  }
  setStorage(STORAGE_KEYS.ROOMS, current);

  // Recalculate available rooms on the parent lodge
  const allRooms = getRooms(room.property_id);
  const availableCount = allRooms.filter((r) => r.status === 'available').length;
  const parent = getLodgeById(room.property_id);
  if (parent) {
    saveLodge({
      ...parent,
      total_rooms: allRooms.length,
      available_rooms: availableCount,
    });
  }
}

export function updateRoomStatus(id: string, status: RoomAvailabilityStatus): void {
  const rooms = getRooms();
  const room = rooms.find((r) => r.id === id);
  if (!room) return;
  saveRoom({
    ...room,
    status,
    available_units: status === 'available' ? 1 : 0,
  });
}

export function deleteRoom(id: string): void {
  const current = getStorage<Room[]>(STORAGE_KEYS.ROOMS, []);
  const room = getRooms().find((r) => r.id === id);
  const filtered = current.filter((r) => r.id !== id);
  setStorage(STORAGE_KEYS.ROOMS, filtered);

  if (room) {
    const remaining = getRooms(room.property_id).filter((r) => r.id !== id);
    const parent = getLodgeById(room.property_id);
    if (parent) {
      saveLodge({
        ...parent,
        total_rooms: remaining.length,
        available_rooms: remaining.filter((r) => r.status === 'available').length,
      });
    }
  }
}

export function getInspections(filter?: { student_id?: string; landlord_id?: string }): Inspection[] {
  const custom = getStorage<Inspection[]>(STORAGE_KEYS.INSPECTIONS, []);
  const map = new Map<string, Inspection>();
  SEED_INSPECTIONS.forEach((i) => map.set(i.id, i));
  custom.forEach((i) => map.set(i.id, i));
  let all = Array.from(map.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  if (filter?.student_id) {
    all = all.filter((i) => i.student_id === filter.student_id);
  }
  if (filter?.landlord_id) {
    all = all.filter((i) => i.landlord_id === filter.landlord_id);
  }
  return all;
}

export function saveInspection(inspection: Inspection): void {
  const current = getStorage<Inspection[]>(STORAGE_KEYS.INSPECTIONS, []);
  const idx = current.findIndex((i) => i.id === inspection.id);
  if (idx >= 0) {
    current[idx] = inspection;
  } else {
    current.unshift(inspection);
  }
  setStorage(STORAGE_KEYS.INSPECTIONS, current);
}

export function updateInspectionStatus(
  id: string,
  status: InspectionStatus,
  options?: {
    rescheduled_date?: string;
    rescheduled_time_slot?: InspectionTimeSlot;
    landlord_notes?: string;
  }
): void {
  const all = getInspections();
  const existing = all.find((i) => i.id === id);
  if (!existing) return;

  const updated: Inspection = {
    ...existing,
    status,
    ...(options?.rescheduled_date && { rescheduled_date: options.rescheduled_date }),
    ...(options?.rescheduled_time_slot && { rescheduled_time_slot: options.rescheduled_time_slot }),
    ...(options?.landlord_notes && { landlord_notes: options.landlord_notes }),
    updated_at: new Date().toISOString(),
  };

  saveInspection(updated);
}

export function clearDataStore(): void {
  memoryStore.clear();
  try {
    if (
      typeof window !== 'undefined' &&
      window.localStorage &&
      typeof window.localStorage.clear === 'function'
    ) {
      window.localStorage.clear();
    }
  } catch {
    // Ignore
  }
}

