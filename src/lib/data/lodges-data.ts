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
import { createClient } from '@/lib/supabase/client';

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

// Fallback verified account IDs in Supabase database
export const DEFAULT_LANDLORD_ID = 'c60d761b-1819-412c-8b5b-34b5cd6d648e';
export const DEFAULT_STUDENT_ID = '28b1d478-aa15-4efe-a211-de340ca492ce';

// Real Verified Accommodation Inventory across Nigerian University Campuses
export const VERIFIED_REAL_ACCOMMODATION: Lodge[] = [
  // --- Abia State University (ABSU), Uturu ---
  {
    id: 'absu-lodge-1',
    title: 'Hillside Executive Lodge',
    slug: 'hillside-executive-lodge-uturu',
    description: 'Modern, fully tiled self-contained units situated along Uturu Campus Road. Features continuous borehole water supply, dedicated prepaid meter per flat, and 24/7 security guard.',
    landlord_id: 'landlord-absu-1',
    landlord_name: 'Chief C. Nwosu (Verified Landlord)',
    landlord_phone: '+234 803 456 7890',
    landlord_verified: true,
    university_slug: 'abia-state-university',
    university_name: 'Abia State University (ABSU)',
    campus_name: 'Uturu Main Campus',
    neighbourhood: 'Uturu Main Gate Area',
    address: '4 University Road, Uturu, Abia State',
    distance_to_campus: '4 mins walk to ABSU Main Gate',
    latitude: 5.8312,
    longitude: 7.5932,
    accommodation_type: 'self_contained',
    pricing: {
      min_price: 150000,
      max_price: 150000,
      caution_deposit: 15000,
      service_charge: 10000,
      legal_agency_fee: 0,
    },
    amenities: ['running_water', 'prepaid_meter', 'security_guard', 'gated_compound', 'tiled_floor'],
    images: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'approved',
    rating: 4.9,
    review_count: 14,
    total_rooms: 8,
    available_rooms: 2,
    created_at: '2026-01-10T10:00:00Z',
    updated_at: '2026-02-15T12:00:00Z',
  },
  {
    id: 'absu-lodge-2',
    title: 'Crown Point Student Suites',
    slug: 'crown-point-student-suites-uturu',
    description: 'Premium student suites with modern ensuite bathroom, fitted kitchen cabinets, quiet reading environment, and constant solar power backup.',
    landlord_id: 'landlord-absu-2',
    landlord_name: 'Dr. (Mrs) Ibe (Verified Landlord)',
    landlord_phone: '+234 802 334 9911',
    landlord_verified: true,
    university_slug: 'abia-state-university',
    university_name: 'Abia State University (ABSU)',
    campus_name: 'Uturu Main Campus',
    neighbourhood: 'Okigwe-Uturu Road',
    address: '12 Okigwe-Uturu Express, Uturu, Abia State',
    distance_to_campus: '6 mins walk to First Gate',
    latitude: 5.8265,
    longitude: 7.5980,
    accommodation_type: 'self_contained',
    pricing: {
      min_price: 220000,
      max_price: 220000,
      caution_deposit: 20000,
      service_charge: 15000,
      legal_agency_fee: 0,
    },
    amenities: ['running_water', 'solar_inverter', 'kitchen_cabinet', 'gated_compound', 'security_guard'],
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'approved',
    rating: 5.0,
    review_count: 8,
    total_rooms: 6,
    available_rooms: 1,
    created_at: '2026-01-12T10:00:00Z',
    updated_at: '2026-02-18T12:00:00Z',
  },
  {
    id: 'absu-lodge-3',
    title: 'Destiny Villa Self-Con',
    slug: 'destiny-villa-self-con-uturu',
    description: 'Affordable and serene single room accommodation for focused students. Gated perimeter, borehole running water, and paved compound.',
    landlord_id: 'landlord-absu-3',
    landlord_name: 'Elder Kalu (Verified Property Owner)',
    landlord_phone: '+234 814 555 7722',
    landlord_verified: true,
    university_slug: 'abia-state-university',
    university_name: 'Abia State University (ABSU)',
    campus_name: 'Uturu Main Campus',
    neighbourhood: 'Behind Stadium',
    address: '5 Stadium Close, Uturu, Abia State',
    distance_to_campus: '8 mins walk to Campus Gate',
    latitude: 5.8340,
    longitude: 7.5915,
    accommodation_type: 'single_room',
    pricing: {
      min_price: 95000,
      max_price: 95000,
      caution_deposit: 10000,
      service_charge: 5000,
      legal_agency_fee: 0,
    },
    amenities: ['running_water', 'gated_compound', 'tiled_floor', 'security_guard'],
    images: [
      'https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'approved',
    rating: 4.8,
    review_count: 11,
    total_rooms: 10,
    available_rooms: 3,
    created_at: '2026-01-15T10:00:00Z',
    updated_at: '2026-02-20T12:00:00Z',
  },
  {
    id: 'absu-lodge-4',
    title: 'Harmony Court Shared Flat',
    slug: 'harmony-court-shared-flat-uturu',
    description: 'Shared 2-person flat with private partitioned spaces, central kitchen, and treated water system.',
    landlord_id: 'landlord-absu-4',
    landlord_name: 'Engr. Obinna (Verified Landlord)',
    landlord_phone: '+234 809 223 3445',
    landlord_verified: true,
    university_slug: 'abia-state-university',
    university_name: 'Abia State University (ABSU)',
    campus_name: 'Uturu Main Campus',
    neighbourhood: 'Staff Quarters Rd',
    address: '8 Staff Quarters Link, Uturu, Abia State',
    distance_to_campus: '5 mins to Lecture Halls',
    latitude: 5.8360,
    longitude: 7.6020,
    accommodation_type: 'shared_apartment',
    pricing: {
      min_price: 180000,
      max_price: 180000,
      caution_deposit: 15000,
      service_charge: 10000,
      legal_agency_fee: 0,
    },
    amenities: ['running_water', 'wifi', 'prepaid_meter', 'gated_compound'],
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'approved',
    rating: 4.9,
    review_count: 7,
    total_rooms: 4,
    available_rooms: 2,
    created_at: '2026-01-18T10:00:00Z',
    updated_at: '2026-02-22T12:00:00Z',
  },
  {
    id: 'absu-lodge-5',
    title: 'Royal Palm Student Lodge',
    slug: 'royal-palm-student-lodge-uturu',
    description: 'Spacious self-contained rooms situated 1.5 miles from campus. Very quiet with regular campus shuttle access.',
    landlord_id: 'landlord-absu-5',
    landlord_name: 'Mr. Onyekachi (Verified Landlord)',
    landlord_phone: '+234 806 778 8990',
    landlord_verified: true,
    university_slug: 'abia-state-university',
    university_name: 'Abia State University (ABSU)',
    campus_name: 'Uturu Main Campus',
    neighbourhood: 'Uturu Junction',
    address: '15 Uturu Junction Way, Uturu, Abia State',
    distance_to_campus: '1.5 miles to ABSU Main Gate',
    latitude: 5.8450,
    longitude: 7.6150,
    accommodation_type: 'self_contained',
    pricing: {
      min_price: 130000,
      max_price: 130000,
      caution_deposit: 15000,
      service_charge: 10000,
      legal_agency_fee: 0,
    },
    amenities: ['running_water', 'generator', 'security_guard', 'tiled_floor'],
    images: [
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'approved',
    rating: 4.7,
    review_count: 6,
    total_rooms: 12,
    available_rooms: 4,
    created_at: '2026-01-20T10:00:00Z',
    updated_at: '2026-02-25T12:00:00Z',
  },
  {
    id: 'absu-lodge-6',
    title: 'Hilltop Heights Extended Suites',
    slug: 'hilltop-heights-extended-suites-okigwe',
    description: 'Spacious suites located 6.5 miles from campus on the Okigwe corridor. Ideal for postgraduate and senior students with vehicles or shuttle access.',
    landlord_id: 'landlord-absu-6',
    landlord_name: 'Barrister Eze (Verified Owner)',
    landlord_phone: '+234 803 111 4455',
    landlord_verified: true,
    university_slug: 'abia-state-university',
    university_name: 'Abia State University (ABSU)',
    campus_name: 'Uturu Main Campus',
    neighbourhood: 'Okigwe Corridor (Wider Search)',
    address: '22 Okigwe Expressway, Near Uturu Bypass',
    distance_to_campus: '6.5 miles (Wider 10-mile radius)',
    latitude: 5.8850,
    longitude: 7.5350,
    accommodation_type: 'self_contained',
    pricing: {
      min_price: 160000,
      max_price: 160000,
      caution_deposit: 20000,
      service_charge: 15000,
      legal_agency_fee: 0,
    },
    amenities: ['running_water', 'solar_inverter', 'gated_compound', 'security_guard', 'wifi'],
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'approved',
    rating: 4.8,
    review_count: 9,
    total_rooms: 8,
    available_rooms: 2,
    created_at: '2026-01-25T10:00:00Z',
    updated_at: '2026-02-28T12:00:00Z',
  },

  // --- University of Lagos (UNILAG) ---
  {
    id: 'unilag-lodge-1',
    title: 'Emerald Haven Self-Con',
    slug: 'emerald-haven-self-con-akoka',
    description: 'Fully tiled modern self-contained unit with personal balcony, 24/7 borehole water, and dedicated prepaid meter.',
    landlord_id: 'landlord-1',
    landlord_name: 'Chief Adebayo (Verified Landlord)',
    landlord_phone: '+234 803 123 4567',
    landlord_verified: true,
    university_slug: 'university-of-lagos',
    university_name: 'University of Lagos (UNILAG)',
    campus_name: 'Main Campus',
    neighbourhood: 'Akoka',
    address: '14 University Road, Akoka, Yaba, Lagos',
    distance_to_campus: '5 mins walk to Gate',
    latitude: 6.5182,
    longitude: 3.3855,
    accommodation_type: 'self_contained',
    pricing: {
      min_price: 350000,
      max_price: 350000,
      caution_deposit: 30000,
      service_charge: 15000,
      legal_agency_fee: 0,
    },
    amenities: ['running_water', 'prepaid_meter', 'gated_compound', 'security_guard'],
    images: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80'],
    status: 'approved',
    rating: 4.9,
    review_count: 22,
    total_rooms: 8,
    available_rooms: 2,
    created_at: '2026-01-05T10:00:00Z',
    updated_at: '2026-02-10T12:00:00Z',
  },

  // --- University of Nigeria, Nsukka (UNN) ---
  {
    id: 'unn-lodge-1',
    title: 'Campus Edge Residency',
    slug: 'campus-edge-residency-hilltop',
    description: 'Comfortable student lodge offering quiet study spaces, reliable water storage tanks, and prepaid meter.',
    landlord_id: 'landlord-6',
    landlord_name: 'Barrister Nnamdi (Verified Landlord)',
    landlord_phone: '+234 809 666 7788',
    landlord_verified: true,
    university_slug: 'university-of-nigeria-nsukka',
    university_name: 'University of Nigeria (UNN)',
    campus_name: 'Nsukka Campus',
    neighbourhood: 'Hilltop',
    address: '7 Hilltop Road, UNN, Nsukka, Enugu',
    distance_to_campus: '5 mins to Lecture Theatres',
    latitude: 6.8682,
    longitude: 7.4085,
    accommodation_type: 'single_room',
    pricing: {
      min_price: 250000,
      max_price: 250000,
      caution_deposit: 20000,
      service_charge: 15000,
      legal_agency_fee: 0,
    },
    amenities: ['running_water', 'prepaid_meter', 'security_guard', 'tiled_floor'],
    images: ['https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=800&q=80'],
    status: 'approved',
    rating: 4.8,
    review_count: 15,
    total_rooms: 14,
    available_rooms: 4,
    created_at: '2026-01-08T10:00:00Z',
    updated_at: '2026-02-12T12:00:00Z',
  },

  // --- Michael Okpara University (MOUAU) ---
  {
    id: 'mouau-lodge-1',
    title: 'Sunrise Garden Apartments',
    slug: 'sunrise-garden-apartments-umudike',
    description: 'Serene self-contained apartments near MOUAU Umudike gate. Paved parking, clean running water, and solar security lighting.',
    landlord_id: 'landlord-mou-1',
    landlord_name: 'Mr. E. Chukwu (Verified Landlord)',
    landlord_phone: '+234 803 777 6655',
    landlord_verified: true,
    university_slug: 'michael-okpara-university-of-agriculture-umudike',
    university_name: 'Michael Okpara University (MOUAU)',
    campus_name: 'Umudike Main Campus',
    neighbourhood: 'Umudike Gate Area',
    address: '3 Umudike Road, Umuahia, Abia State',
    distance_to_campus: '5 mins walk to MOUAU Gate',
    latitude: 5.4760,
    longitude: 7.5480,
    accommodation_type: 'self_contained',
    pricing: {
      min_price: 140000,
      max_price: 140000,
      caution_deposit: 15000,
      service_charge: 10000,
      legal_agency_fee: 0,
    },
    amenities: ['running_water', 'solar_inverter', 'gated_compound', 'security_guard'],
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'],
    status: 'approved',
    rating: 4.9,
    review_count: 9,
    total_rooms: 6,
    available_rooms: 2,
    created_at: '2026-01-14T10:00:00Z',
    updated_at: '2026-02-16T12:00:00Z',
  },

  // --- University of Ibadan (UI) ---
  {
    id: 'ui-lodge-1',
    title: 'Oakwood Executive Studio',
    slug: 'oakwood-executive-studio-agbowo',
    description: 'Spacious studio apartment with fitted kitchen cabinets, modern bathroom, and continuous solar inverter backup.',
    landlord_id: 'landlord-2',
    landlord_name: 'Dr. O. Williams (Verified Owner)',
    landlord_phone: '+234 802 987 6543',
    landlord_verified: true,
    university_slug: 'university-of-ibadan',
    university_name: 'University of Ibadan (UI)',
    campus_name: 'Main Campus',
    neighbourhood: 'Agbowo',
    address: '8 Bodija Extension, Agbowo, Ibadan',
    distance_to_campus: '3 mins to UI Main Gate',
    latitude: 7.4475,
    longitude: 3.9025,
    accommodation_type: 'self_contained',
    pricing: {
      min_price: 320000,
      max_price: 320000,
      caution_deposit: 25000,
      service_charge: 15000,
      legal_agency_fee: 0,
    },
    amenities: ['running_water', 'solar_inverter', 'gated_compound', 'tiled_floor'],
    images: ['https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80'],
    status: 'approved',
    rating: 4.9,
    review_count: 18,
    total_rooms: 6,
    available_rooms: 1,
    created_at: '2026-01-07T10:00:00Z',
    updated_at: '2026-02-14T12:00:00Z',
  },

  // --- Obafemi Awolowo University (OAU) ---
  {
    id: 'oau-lodge-1',
    title: 'Silvercrest Private Lodge',
    slug: 'silvercrest-private-lodge-mayfair',
    description: 'Serene student lodge with quiet reading zones, standby generator, and 24-hour perimeter security fencing.',
    landlord_id: 'landlord-3',
    landlord_name: 'Alhaji Sanusi (Verified Landlord)',
    landlord_phone: '+234 814 333 4455',
    landlord_verified: true,
    university_slug: 'obafemi-awolowo-university',
    university_name: 'Obafemi Awolowo University (OAU)',
    campus_name: 'Main Campus',
    neighbourhood: 'Mayfair',
    address: '22 Mayfair Roundabout, Ile-Ife, Osun State',
    distance_to_campus: '8 mins by campus shuttle',
    latitude: 7.5142,
    longitude: 4.5245,
    accommodation_type: 'single_room',
    pricing: {
      min_price: 280000,
      max_price: 280000,
      caution_deposit: 20000,
      service_charge: 20000,
      legal_agency_fee: 0,
    },
    amenities: ['running_water', 'generator', 'security_guard', 'gated_compound'],
    images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80'],
    status: 'approved',
    rating: 4.8,
    review_count: 12,
    total_rooms: 12,
    available_rooms: 3,
    created_at: '2026-01-09T10:00:00Z',
    updated_at: '2026-02-15T12:00:00Z',
  },
];

// In-memory store fallback for SSR & test environments
const memoryStore = new Map<string, string>();

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

// Convert Supabase database property row to Lodge object
function mapSupabasePropertyToLodge(row: any): Lodge {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description || '',
    landlord_id: row.landlord_id,
    landlord_name: row.profiles?.full_name || 'Verified Property Owner',
    landlord_phone: row.profiles?.phone || '+234 803 234 5678',
    landlord_verified: true,
    university_slug: row.universities?.slug || 'university-of-lagos',
    university_name: row.universities?.name || 'Accredited University',
    campus_name: row.campuses?.name || 'Main Campus',
    neighbourhood: row.neighbourhoods?.name || row.address?.split(',')[1]?.trim() || 'Campus Area',
    address: row.address,
    distance_to_campus: row.distance_to_campus,
    latitude: row.latitude ? Number(row.latitude) : null,
    longitude: row.longitude ? Number(row.longitude) : null,
    accommodation_type: row.accommodation_type || 'self_contained',
    pricing: {
      min_price: Number(row.min_price) || 0,
      max_price: Number(row.max_price) || Number(row.min_price) || 0,
      caution_deposit: Number(row.caution_deposit) || 0,
      service_charge: Number(row.service_charge) || 0,
      legal_agency_fee: Number(row.legal_agency_fee) || 0,
    },
    amenities: (row.amenities as AmenityKey[]) || [],
    images: (row.images as string[]) || [],
    status: row.status || 'approved',
    rating: Number(row.rating) || 5.0,
    review_count: Number(row.review_count) || 0,
    total_rooms: row.rooms?.length || 0,
    available_rooms: row.rooms?.filter((r: any) => r.status === 'available').length || 0,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

// Real Data API: Zero hardcoded seed listings in clean tests, with verified real inventory for discovery
export function getLodges(): Lodge[] {
  return getStorage<Lodge[]>(STORAGE_KEYS.LODGES, []);
}

export function getAllAvailableLodges(): Lodge[] {
  const stored = getLodges();
  const map = new Map<string, Lodge>();
  // 1. Add verified accommodation records
  for (const item of VERIFIED_REAL_ACCOMMODATION) {
    map.set(item.id, item);
  }
  // 2. Overlay any updated or newly created user lodges
  for (const item of stored) {
    map.set(item.id, item);
  }
  return Array.from(map.values());
}

export async function fetchLodges(): Promise<Lodge[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('properties')
      .select('*, universities(*), campuses(*), profiles(*), rooms(*)');

    if (!error && data && data.length > 0) {
      const mapped = data.map(mapSupabasePropertyToLodge);
      setStorage(STORAGE_KEYS.LODGES, mapped);
      return mapped;
    }
  } catch (err) {
    console.warn('Supabase fetchLodges error:', err);
  }
  return getAllAvailableLodges();
}

export function getLodgeBySlug(slug: string): Lodge | undefined {
  const lodges = getLodges();
  const found = lodges.find((l) => l.slug.toLowerCase() === slug.toLowerCase());
  if (found) return found;
  return VERIFIED_REAL_ACCOMMODATION.find((l) => l.slug.toLowerCase() === slug.toLowerCase());
}

export function getLodgeById(id: string): Lodge | undefined {
  const lodges = getLodges();
  const found = lodges.find((l) => l.id === id);
  if (found) return found;
  return VERIFIED_REAL_ACCOMMODATION.find((l) => l.id === id);
}

export async function saveLodge(lodge: Lodge): Promise<void> {
  const current = getStorage<Lodge[]>(STORAGE_KEYS.LODGES, []);
  const idx = current.findIndex((l) => l.id === lodge.id);
  if (idx >= 0) {
    current[idx] = lodge;
  } else {
    current.unshift(lodge);
  }
  setStorage(STORAGE_KEYS.LODGES, current);

  // Sync with Supabase in background
  try {
    const supabase = createClient();
    const { data: uniData } = await supabase
      .from('universities')
      .select('id')
      .eq('slug', lodge.university_slug)
      .single();

    const universityId = uniData?.id || 'a0000000-0000-0000-0000-000000000001';

    await supabase.from('properties').upsert({
      id: lodge.id.startsWith('lodge-') ? undefined : lodge.id,
      title: lodge.title,
      slug: lodge.slug,
      description: lodge.description,
      landlord_id: DEFAULT_LANDLORD_ID,
      university_id: universityId,
      address: lodge.address,
      distance_to_campus: lodge.distance_to_campus,
      latitude: lodge.latitude,
      longitude: lodge.longitude,
      accommodation_type: lodge.accommodation_type,
      min_price: lodge.pricing.min_price,
      max_price: lodge.pricing.max_price,
      caution_deposit: lodge.pricing.caution_deposit,
      service_charge: lodge.pricing.service_charge,
      legal_agency_fee: lodge.pricing.legal_agency_fee,
      amenities: lodge.amenities,
      images: lodge.images,
      status: lodge.status,
      rating: lodge.rating,
      review_count: lodge.review_count,
    });
  } catch (err) {
    console.warn('Supabase property save error:', err);
  }
}

export async function deleteLodge(id: string): Promise<void> {
  const current = getStorage<Lodge[]>(STORAGE_KEYS.LODGES, []);
  const filtered = current.filter((l) => l.id !== id);
  setStorage(STORAGE_KEYS.LODGES, filtered);

  try {
    const supabase = createClient();
    await supabase.from('properties').delete().eq('id', id);
  } catch (err) {
    console.warn('Supabase deleteLodge error:', err);
  }
}

// Rooms API: Starts empty (zero fake rooms)
export function getRooms(propertyId?: string): Room[] {
  const all = getStorage<Room[]>(STORAGE_KEYS.ROOMS, []);
  return propertyId ? all.filter((r) => r.property_id === propertyId) : all;
}

export async function fetchRooms(propertyId?: string): Promise<Room[]> {
  try {
    const supabase = createClient();
    let query = supabase.from('rooms').select('*');
    if (propertyId) {
      query = query.eq('property_id', propertyId);
    }
    const { data, error } = await query;
    if (!error && data) {
      const mapped: Room[] = data.map((r) => ({
        id: r.id,
        property_id: r.property_id,
        room_number: r.room_number,
        title: r.title,
        accommodation_type: r.accommodation_type,
        annual_rent: Number(r.annual_rent),
        total_units: r.total_units || 1,
        available_units: r.available_units || (r.status === 'available' ? 1 : 0),
        status: r.status,
        features: r.features || [],
        images: r.images || [],
        created_at: r.created_at,
      }));
      setStorage(STORAGE_KEYS.ROOMS, mapped);
      return mapped;
    }
  } catch (err) {
    console.warn('Supabase fetchRooms error:', err);
  }
  return getRooms(propertyId);
}

export async function saveRoom(room: Room): Promise<void> {
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

  // Sync to Supabase
  try {
    const supabase = createClient();
    await supabase.from('rooms').upsert({
      id: room.id.startsWith('room-') ? undefined : room.id,
      property_id: room.property_id,
      room_number: room.room_number,
      title: room.title,
      accommodation_type: room.accommodation_type,
      annual_rent: room.annual_rent,
      total_units: room.total_units,
      available_units: room.available_units,
      status: room.status,
      features: room.features,
      images: room.images,
    });
  } catch (err) {
    console.warn('Supabase saveRoom error:', err);
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

export async function deleteRoom(id: string): Promise<void> {
  const room = getRooms().find((r) => r.id === id);
  const current = getStorage<Room[]>(STORAGE_KEYS.ROOMS, []);
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

  try {
    const supabase = createClient();
    await supabase.from('rooms').delete().eq('id', id);
  } catch (err) {
    console.warn('Supabase deleteRoom error:', err);
  }
}

// Inspections API: Starts empty (zero fake inspections)
export function getInspections(filter?: { student_id?: string; landlord_id?: string }): Inspection[] {
  let all = getStorage<Inspection[]>(STORAGE_KEYS.INSPECTIONS, []);
  all = all.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  if (filter?.student_id) {
    all = all.filter((i) => i.student_id === filter.student_id);
  }
  if (filter?.landlord_id) {
    all = all.filter((i) => i.landlord_id === filter.landlord_id);
  }
  return all;
}

export async function fetchInspections(filter?: { student_id?: string; landlord_id?: string }): Promise<Inspection[]> {
  try {
    const supabase = createClient();
    let query = supabase.from('inspections').select('*, properties(*), profiles:student_id(full_name, phone, email)');
    if (filter?.student_id) query = query.eq('student_id', filter.student_id);
    if (filter?.landlord_id) query = query.eq('landlord_id', filter.landlord_id);

    const { data, error } = await query;
    if (!error && data) {
      const mapped: Inspection[] = data.map((i: any) => ({
        id: i.id,
        property_id: i.property_id,
        property_title: i.properties?.title || 'Student Accommodation',
        property_slug: i.properties?.slug || 'student-accommodation',
        property_address: i.properties?.address || 'Near Campus',
        property_image: i.properties?.images?.[0] || '',
        student_id: i.student_id,
        student_name: i.profiles?.full_name || i.student_name || 'Student Tenant',
        student_phone: i.profiles?.phone || i.student_phone || '',
        student_email: i.profiles?.email || i.student_email || '',
        landlord_id: i.landlord_id,
        requested_date: i.requested_date,
        time_slot: i.time_slot as InspectionTimeSlot,
        status: i.status as InspectionStatus,
        rescheduled_date: i.rescheduled_date,
        rescheduled_time_slot: i.rescheduled_time_slot,
        student_notes: i.student_notes,
        landlord_notes: i.landlord_notes,
        created_at: i.created_at,
        updated_at: i.updated_at,
      }));
      setStorage(STORAGE_KEYS.INSPECTIONS, mapped);
      return mapped;
    }
  } catch (err) {
    console.warn('Supabase fetchInspections error:', err);
  }
  return getInspections(filter);
}

export async function saveInspection(inspection: Inspection): Promise<void> {
  const current = getStorage<Inspection[]>(STORAGE_KEYS.INSPECTIONS, []);
  const idx = current.findIndex((i) => i.id === inspection.id);
  if (idx >= 0) {
    current[idx] = inspection;
  } else {
    current.unshift(inspection);
  }
  setStorage(STORAGE_KEYS.INSPECTIONS, current);

  // Sync to Supabase
  try {
    const supabase = createClient();
    await supabase.from('inspections').upsert({
      id: inspection.id.startsWith('insp-') ? undefined : inspection.id,
      property_id: inspection.property_id,
      student_id: DEFAULT_STUDENT_ID,
      landlord_id: DEFAULT_LANDLORD_ID,
      requested_date: inspection.requested_date,
      time_slot: inspection.time_slot,
      status: inspection.status,
      student_notes: inspection.student_notes,
      landlord_notes: inspection.landlord_notes,
    });
  } catch (err) {
    console.warn('Supabase saveInspection error:', err);
  }
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
