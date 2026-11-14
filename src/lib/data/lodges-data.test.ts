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
} from './lodges-data';
import { Lodge, Room, Inspection } from '@/types/database';

describe('lodges-data module - Real Zero-Data Architecture', () => {
  beforeEach(() => {
    clearDataStore();
  });

  it('should start with zero fake lodges by default', () => {
    const lodges = getLodges();
    expect(lodges).toEqual([]);
    expect(lodges.length).toBe(0);
  });

  it('should start with zero fake rooms and zero fake inspections by default', () => {
    expect(getRooms()).toEqual([]);
    expect(getInspections()).toEqual([]);
  });

  it('should allow adding, updating and deleting a real lodge', () => {
    const realLodge: Lodge = {
      id: 'real-lodge-101',
      title: 'Sunrise Student Villa',
      slug: 'sunrise-student-villa',
      description: 'Real student lodge close to UNILAG gate.',
      landlord_id: 'landlord-adebayo',
      landlord_name: 'Chief Adebayo Olanrewaju',
      landlord_verified: true,
      university_slug: 'university-of-lagos',
      university_name: 'University of Lagos',
      campus_name: 'Akoka Main Campus',
      neighbourhood: 'Akoka, Yaba',
      address: '14 St. Finbarrs College Road, Akoka, Lagos',
      distance_to_campus: '5 mins walk from UNILAG Gate',
      accommodation_type: 'self_contained',
      pricing: {
        min_price: 350000,
        max_price: 400000,
        caution_deposit: 30000,
        service_charge: 25000,
        legal_agency_fee: 0,
      },
      amenities: ['running_water', 'solar_inverter', 'gated_compound'],
      images: ['https://pbgrhgenxpubcnmptqvv.supabase.co/storage/v1/object/public/property-media/lodges/sample.jpg'],
      status: 'approved',
      rating: 5.0,
      review_count: 0,
      total_rooms: 0,
      available_rooms: 0,
      created_at: new Date().toISOString(),
    };

    saveLodge(realLodge);
    let found = getLodgeById('real-lodge-101');
    expect(found).toBeDefined();
    expect(found?.title).toBe('Sunrise Student Villa');

    // Case-insensitive slug search
    const bySlug = getLodgeBySlug('SUNRISE-STUDENT-VILLA');
    expect(bySlug).toBeDefined();
    expect(bySlug?.id).toBe('real-lodge-101');

    // Update
    saveLodge({ ...realLodge, title: 'Sunrise Student Villa (Updated)' });
    found = getLodgeById('real-lodge-101');
    expect(found?.title).toBe('Sunrise Student Villa (Updated)');

    // Delete
    deleteLodge('real-lodge-101');
    found = getLodgeById('real-lodge-101');
    expect(found).toBeUndefined();
  });

  it('should manage room availability and recalculate lodge room counts', () => {
    const parentLodge: Lodge = {
      id: 'lodge-test-parent',
      title: 'Test Parent Lodge',
      slug: 'test-parent-lodge',
      description: 'Lodge description',
      landlord_id: 'landlord-adebayo',
      landlord_name: 'Landlord',
      landlord_verified: true,
      university_slug: 'university-of-lagos',
      university_name: 'University of Lagos',
      campus_name: 'Akoka',
      neighbourhood: 'Akoka',
      address: '10 University Rd',
      distance_to_campus: '3 mins',
      accommodation_type: 'self_contained',
      pricing: {
        min_price: 400000,
        max_price: 450000,
        caution_deposit: 40000,
        service_charge: 20000,
        legal_agency_fee: 0,
      },
      amenities: ['running_water'],
      images: [],
      status: 'approved',
      rating: 5.0,
      review_count: 0,
      total_rooms: 0,
      available_rooms: 0,
      created_at: new Date().toISOString(),
    };
    saveLodge(parentLodge);

    const room: Room = {
      id: 'room-test-1',
      property_id: 'lodge-test-parent',
      room_number: 'Room 101',
      title: 'Self-Contained Room 101',
      accommodation_type: 'self_contained',
      annual_rent: 400000,
      total_units: 1,
      available_units: 1,
      status: 'available',
      features: ['Private Bathroom', 'Prepaid Meter'],
      images: [],
      created_at: new Date().toISOString(),
    };

    saveRoom(room);
    const rooms = getRooms('lodge-test-parent');
    expect(rooms.length).toBe(1);
    expect(rooms[0].room_number).toBe('Room 101');

    // Parent lodge should now show 1 room and 1 available
    let updatedParent = getLodgeById('lodge-test-parent');
    expect(updatedParent?.total_rooms).toBe(1);
    expect(updatedParent?.available_rooms).toBe(1);

    // Toggle room to occupied
    updateRoomStatus('room-test-1', 'occupied');
    const occupiedRoom = getRooms('lodge-test-parent').find((r) => r.id === 'room-test-1');
    expect(occupiedRoom?.status).toBe('occupied');
    expect(occupiedRoom?.available_units).toBe(0);

    updatedParent = getLodgeById('lodge-test-parent');
    expect(updatedParent?.available_rooms).toBe(0);

    // Delete room
    deleteRoom('room-test-1');
    expect(getRooms('lodge-test-parent').length).toBe(0);
  });

  it('should manage inspection requests lifecycle', () => {
    const inspection: Inspection = {
      id: 'insp-test-200',
      property_id: 'lodge-test-parent',
      property_title: 'Sunrise Student Villa',
      property_slug: 'sunrise-student-villa',
      property_address: '14 St. Finbarrs',
      property_image: 'https://example.com/photo.jpg',
      student_id: 'student-tester',
      student_name: 'Daniel Okafor',
      student_phone: '+234 814 990 1234',
      student_email: 'daniel.student@example.com',
      landlord_id: 'landlord-adebayo',
      requested_date: '2026-11-20',
      time_slot: 'morning',
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    saveInspection(inspection);
    let list = getInspections({ student_id: 'student-tester' });
    expect(list.length).toBe(1);
    expect(list[0].status).toBe('pending');

    // Landlord accepts inspection
    updateInspectionStatus('insp-test-200', 'accepted', {
      landlord_notes: 'Caretaker Mr. Sunday will receive you at 10am.',
    });
    list = getInspections({ student_id: 'student-tester' });
    expect(list[0].status).toBe('accepted');
    expect(list[0].landlord_notes).toContain('Sunday');

    // Propose reschedule
    updateInspectionStatus('insp-test-200', 'reschedule_requested', {
      rescheduled_date: '2026-11-22',
      rescheduled_time_slot: 'afternoon',
    });
    list = getInspections({ student_id: 'student-tester' });
    expect(list[0].status).toBe('reschedule_requested');
    expect(list[0].rescheduled_date).toBe('2026-11-22');
    expect(list[0].rescheduled_time_slot).toBe('afternoon');

    // Mark completed
    updateInspectionStatus('insp-test-200', 'completed');
    list = getInspections({ student_id: 'student-tester' });
    expect(list[0].status).toBe('completed');
  });
});
