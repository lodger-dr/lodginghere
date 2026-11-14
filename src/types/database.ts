// Database Types & Interfaces for Student Accommodation Marketplace

export type UserRole = 'student' | 'landlord' | 'admin';

export type ProviderType = 'owner' | 'authorized_representative';

export type VerificationStatus =
  | 'not_submitted'
  | 'pending'
  | 'verified'
  | 'rejected'
  | 'needs_information'
  | 'suspended';

export type UniversityType = 'federal' | 'state' | 'private' | 'other';

export type AccommodationType =
  | 'self_contained'
  | 'single_room'
  | 'shared_apartment'
  | 'one_bedroom'
  | 'two_bedroom'
  | 'hostel'
  | 'other';

export type ListingStatus =
  | 'draft'
  | 'pending_review'
  | 'approved'
  | 'changes_requested'
  | 'rejected'
  | 'suspended'
  | 'archived';

export type RoomAvailabilityStatus =
  | 'available'
  | 'temporarily_unavailable'
  | 'reserved_pending'
  | 'occupied'
  | 'archived';

export type InspectionStatus =
  | 'pending'
  | 'accepted'
  | 'reschedule_requested'
  | 'rejected'
  | 'cancelled'
  | 'completed'
  | 'expired';

export type BookingStatus =
  | 'draft'
  | 'pending_landlord_response'
  | 'accepted_by_landlord'
  | 'awaiting_student_confirmation'
  | 'confirmed'
  | 'rejected'
  | 'cancelled'
  | 'expired';

export interface State {
  id: string;
  name: string;
  code: string;
  created_at: string;
}

export interface City {
  id: string;
  state_id: string;
  name: string;
  lga_name?: string | null;
  created_at: string;
}

export interface University {
  id: string;
  name: string;
  slug: string;
  acronym?: string | null;
  university_type: UniversityType;
  state_id?: string | null;
  city_id?: string | null;
  website_url?: string | null;
  logo_url?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Campus {
  id: string;
  university_id: string;
  name: string;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Neighbourhood {
  id: string;
  city_id?: string | null;
  campus_id?: string | null;
  name: string;
  latitude?: number | null;
  longitude?: number | null;
  created_at: string;
}

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string;
  email: string;
  phone?: string | null;
  avatar_path?: string | null;
  created_at: string;
  updated_at: string;
}

export interface StudentProfile {
  user_id: string;
  university_id?: string | null;
  campus_id?: string | null;
  department?: string | null;
  created_at: string;
  updated_at: string;
}

export interface LandlordProfile {
  user_id: string;
  provider_type: ProviderType;
  verification_status: VerificationStatus;
  business_name?: string | null;
  contact_details?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

