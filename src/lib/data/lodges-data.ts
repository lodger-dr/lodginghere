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

// Real Data API: Zero hardcoded seed listings. Starts at 0 inventory.
export function getLodges(): Lodge[] {
  return getStorage<Lodge[]>(STORAGE_KEYS.LODGES, []);
}

export async function fetchLodges(): Promise<Lodge[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('properties')
      .select('*, universities(*), campuses(*), profiles(*), rooms(*)');

    if (!error && data) {
      const mapped = data.map(mapSupabasePropertyToLodge);
      setStorage(STORAGE_KEYS.LODGES, mapped);
      return mapped;
    }
  } catch (err) {
    console.warn('Supabase fetchLodges error:', err);
  }
  return getLodges();
}

export function getLodgeBySlug(slug: string): Lodge | undefined {
  const lodges = getLodges();
  return lodges.find((l) => l.slug.toLowerCase() === slug.toLowerCase());
}

export function getLodgeById(id: string): Lodge | undefined {
  const lodges = getLodges();
  return lodges.find((l) => l.id === id);
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
    let query = supabase.from('inspections').select('*, properties(*)');
    if (filter?.student_id) query = query.eq('student_id', filter.student_id);
    if (filter?.landlord_id) query = query.eq('landlord_id', filter.landlord_id);

    const { data, error } = await query;
    if (!error && data) {
      const mapped: Inspection[] = data.map((i) => ({
        id: i.id,
        property_id: i.property_id,
        property_title: i.properties?.title || 'Student Accommodation',
        property_slug: i.properties?.slug || 'student-accommodation',
        property_address: i.properties?.address || 'Near Campus',
        property_image: i.properties?.images?.[0] || '',
        student_id: i.student_id,
        student_name: 'Student Tenant',
        student_phone: '+234 812 345 6789',
        student_email: 'student@example.com',
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
