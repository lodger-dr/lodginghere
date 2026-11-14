import { describe, it, expect, beforeEach } from 'vitest';
import {
  getLodges,
  getLodgeBySlug,
  getLodgeById,
  saveLodge,
  deleteLodge,
  getRooms,
  saveRoom,
  updateRoomStatus,
  deleteRoom,
  getInspections,
  saveInspection,
  updateInspectionStatus,
  clearDataStore,
  SEED_LODGES,
} from './lodges-data';
import { Lodge, Room, Inspection } from '@/types/database';

describe('lodges-data module', () => {
  beforeEach(() => {
    clearDataStore();
  });

  it('should return initial seed lodges', () => {
    const lodges = getLodges();
    expect(lodges.length).toBeGreaterThanOrEqual(SEED_LODGES.length);
    expect(lodges[0]).toHaveProperty('title');
    expect(lodges[0]).toHaveProperty('slug');
    expect(lodges[0]).toHaveProperty('pricing');
  });

  it('should retrieve a lodge by slug case-insensitively', () => {
    const slug = 'heritage-heights-student-villa';
    const lodge = getLodgeBySlug(slug.toUpperCase());
    expect(lodge).toBeDefined();
    expect(lodge?.slug).toBe(slug);
    expect(lodge?.university_slug).toBe('university-of-lagos');
  });

  it('should allow adding, updating and deleting a custom lodge', () => {
    const customLodge: Lodge = {
      id: 'custom-lodge-999',
      title: 'Sunrise Student Villa',
      slug: 'sunrise-student-villa',
      description: 'Test lodge description',
      landlord_id: 'landlord-custom',
      landlord_name: 'Mr. Test Landlord',
      landlord_verified: true,
      university_slug: 'university-of-lagos',
      university_name: 'University of Lagos',
      campus_name: 'Akoka',
      neighbourhood: 'Akoka',
      address: '10 Sunrise St',
      distance_to_campus: '5 mins',
      accommodation_type: 'self_contained',
      pricing: {
        min_price: 300000,
        max_price: 350000,
        caution_deposit: 30000,
        service_charge: 20000,
        legal_agency_fee: 0,
      },
      amenities: ['running_water', 'solar_inverter'],
      images: ['https://example.com/photo.jpg'],
      status: 'approved',
      rating: 5,
      review_count: 1,
      total_rooms: 4,
      available_rooms: 2,
      created_at: new Date().toISOString(),
    };

    saveLodge(customLodge);
    let found = getLodgeById('custom-lodge-999');
    expect(found).toBeDefined();
    expect(found?.title).toBe('Sunrise Student Villa');

    // Update
    saveLodge({ ...customLodge, title: 'Sunrise Student Villa (Updated)' });
    found = getLodgeById('custom-lodge-999');
    expect(found?.title).toBe('Sunrise Student Villa (Updated)');

    // Delete
    deleteLodge('custom-lodge-999');
    found = getLodgeById('custom-lodge-999');
    expect(found).toBeUndefined();
  });

  it('should manage room availability and recalculate lodge room counts', () => {
    const customRoom: Room = {
      id: 'test-room-1',
      property_id: 'lodge-unilag-01',
      room_number: 'Room 999',
      title: 'Test Self-Contained',
      accommodation_type: 'self_contained',
      annual_rent: 400000,
      total_units: 1,
      available_units: 1,
      status: 'available',
      features: ['Balcony'],
      images: [],
      created_at: new Date().toISOString(),
    };

    saveRoom(customRoom);
    const rooms = getRooms('lodge-unilag-01');
    expect(rooms.some((r) => r.id === 'test-room-1')).toBe(true);

    // Toggle status
    updateRoomStatus('test-room-1', 'occupied');
    const updated = getRooms('lodge-unilag-01').find((r) => r.id === 'test-room-1');
    expect(updated?.status).toBe('occupied');
    expect(updated?.available_units).toBe(0);

    // Cleanup
    deleteRoom('test-room-1');
  });

  it('should manage inspection requests lifecycle', () => {
    const inspection: Inspection = {
      id: 'test-insp-100',
      property_id: 'lodge-unilag-01',
      property_title: 'Heritage Heights',
      property_slug: 'heritage-heights-student-villa',
      property_address: '14 St. Finbarrs',
      property_image: 'https://example.com/image.jpg',
      student_id: 'student-tester',
      student_name: 'Test Student',
      student_phone: '+234 800 000 0000',
      student_email: 'test@student.ng',
      landlord_id: 'landlord-adebayo',
      requested_date: '2026-12-01',
      time_slot: 'morning',
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    saveInspection(inspection);
    let list = getInspections({ student_id: 'student-tester' });
    expect(list.length).toBe(1);
    expect(list[0].status).toBe('pending');

    // Landlord accepts
    updateInspectionStatus('test-insp-100', 'accepted', { landlord_notes: 'All good' });
    list = getInspections({ student_id: 'student-tester' });
    expect(list[0].status).toBe('accepted');
    expect(list[0].landlord_notes).toBe('All good');

    // Propose reschedule
    updateInspectionStatus('test-insp-100', 'reschedule_requested', {
      rescheduled_date: '2026-12-03',
      rescheduled_time_slot: 'afternoon',
    });
    list = getInspections({ student_id: 'student-tester' });
    expect(list[0].status).toBe('reschedule_requested');
    expect(list[0].rescheduled_date).toBe('2026-12-03');
    expect(list[0].rescheduled_time_slot).toBe('afternoon');
  });
});
