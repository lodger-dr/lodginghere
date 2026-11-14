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

