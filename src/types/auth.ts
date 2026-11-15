import { UserRole, ProviderType } from './database';

export interface UserSession {
  id: string;
  email: string;
  role: UserRole;
  fullName: string;
}

export interface StudentSignUpData {
  role: 'student';
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  universityId?: string;
  department?: string;
}

export interface LandlordSignUpData {
  role: 'landlord';
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  providerType: ProviderType;
  businessName?: string;
}

export type SignUpFormData = StudentSignUpData | LandlordSignUpData;

export interface EmailSignUpData {
  email: string;
  password: string;
}

export interface StudentOnboardingData {
  role: 'student';
  fullName: string;
  phone?: string;
  universityId?: string;
  campusName?: string;
  department?: string;
  preferredRoomType?: string;
}

export interface LandlordOnboardingData {
  role: 'landlord';
  fullName: string;
  phone?: string;
  providerType: ProviderType;
  businessName?: string;
  operatingArea?: string;
}

export type OnboardingData = StudentOnboardingData | LandlordOnboardingData;


