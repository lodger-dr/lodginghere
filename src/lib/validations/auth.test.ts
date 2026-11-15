import { describe, it, expect } from 'vitest';
import {
  loginSchema,
  studentSignUpSchema,
  landlordSignUpSchema,
  signUpSchema,
  resetPasswordSchema,
  emailSignUpSchema,
  studentOnboardingSchema,
  landlordOnboardingSchema,
  onboardingSchema,
} from './auth';

describe('Auth Validation Schemas', () => {
  describe('loginSchema', () => {
    it('should validate a valid email and password', () => {
      const validData = {
        email: 'student@example.com',
        password: 'password123',
      };
      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email formats', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'password123',
      };
      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.email).toBeDefined();
      }
    });

    it('should reject passwords shorter than 6 characters', () => {
      const invalidData = {
        email: 'student@example.com',
        password: '123',
      };
      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.password).toBeDefined();
      }
    });
  });

  describe('studentSignUpSchema', () => {
    it('should accept valid student signup data', () => {
      const validStudent = {
        role: 'student' as const,
        fullName: 'Chinedu Okafor',
        email: 'chinedu@unilag.edu.ng',
        password: 'SecurePassword1',
        phone: '08012345678',
        department: 'Computer Science',
      };
      const result = studentSignUpSchema.safeParse(validStudent);
      expect(result.success).toBe(true);
    });

    it('should require a password with at least one uppercase letter and one number', () => {
      const weakPassword = {
        role: 'student' as const,
        fullName: 'Chinedu Okafor',
        email: 'chinedu@unilag.edu.ng',
        password: 'lowercaseonly',
      };
      const result = studentSignUpSchema.safeParse(weakPassword);
      expect(result.success).toBe(false);
    });

    it('should validate Nigerian phone numbers correctly', () => {
      const validPhones = ['08012345678', '07098765432', '+2348012345678', '09012345678'];
      validPhones.forEach((phone) => {
        const student = {
          role: 'student' as const,
          fullName: 'Test Student',
          email: 'test@example.com',
          password: 'SecurePassword1',
          phone,
        };
        const result = studentSignUpSchema.safeParse(student);
        expect(result.success).toBe(true);
      });

      const invalidPhone = {
        role: 'student' as const,
        fullName: 'Test Student',
        email: 'test@example.com',
        password: 'SecurePassword1',
        phone: '12345',
      };
      const result = studentSignUpSchema.safeParse(invalidPhone);
      expect(result.success).toBe(false);
    });

    it('should accept universityId as a slug or a UUID or empty', () => {
      const studentWithSlug = {
        role: 'student' as const,
        fullName: 'Test Student',
        email: 'test@example.com',
        password: 'SecurePassword1',
        universityId: 'university-of-lagos',
      };
      expect(studentSignUpSchema.safeParse(studentWithSlug).success).toBe(true);

      const studentWithUUID = {
        role: 'student' as const,
        fullName: 'Test Student',
        email: 'test@example.com',
        password: 'SecurePassword1',
        universityId: '123e4567-e89b-12d3-a456-426614174000',
      };
      expect(studentSignUpSchema.safeParse(studentWithUUID).success).toBe(true);

      const studentWithEmpty = {
        role: 'student' as const,
        fullName: 'Test Student',
        email: 'test@example.com',
        password: 'SecurePassword1',
        universityId: '',
      };
      expect(studentSignUpSchema.safeParse(studentWithEmpty).success).toBe(true);
    });
  });

  describe('landlordSignUpSchema', () => {
    it('should accept valid landlord owner signup', () => {
      const validLandlord = {
        role: 'landlord' as const,
        fullName: 'Alhaji Ibrahim',
        email: 'ibrahim@example.com',
        password: 'SecurePassword1',
        providerType: 'owner' as const,
        businessName: 'Apex Lodges',
      };
      const result = landlordSignUpSchema.safeParse(validLandlord);
      expect(result.success).toBe(true);
    });

    it('should accept authorized representative provider type', () => {
      const validRep = {
        role: 'landlord' as const,
        fullName: 'Agent Emeka',
        email: 'emeka@example.com',
        password: 'SecurePassword1',
        providerType: 'authorized_representative' as const,
      };
      const result = landlordSignUpSchema.safeParse(validRep);
      expect(result.success).toBe(true);
    });

    it('should reject invalid provider types', () => {
      const invalid = {
        role: 'landlord' as const,
        fullName: 'Alhaji Ibrahim',
        email: 'ibrahim@example.com',
        password: 'SecurePassword1',
        providerType: 'random_type',
      };
      const result = landlordSignUpSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('signUpSchema (discriminated union)', () => {
    it('should properly discriminate student vs landlord based on role', () => {
      const studentResult = signUpSchema.safeParse({
        role: 'student',
        fullName: 'Student User',
        email: 'student@example.com',
        password: 'SecurePassword1',
      });
      expect(studentResult.success).toBe(true);

      const landlordResult = signUpSchema.safeParse({
        role: 'landlord',
        fullName: 'Landlord User',
        email: 'landlord@example.com',
        password: 'SecurePassword1',
        providerType: 'owner',
      });
      expect(landlordResult.success).toBe(true);
    });
  });

  describe('emailSignUpSchema', () => {
    it('should validate valid email and password (min 8 chars, 1 uppercase, 1 number)', () => {
      const valid = {
        email: 'user@gmail.com',
        password: 'Password123',
      };
      expect(emailSignUpSchema.safeParse(valid).success).toBe(true);
    });

    it('should reject email missing @ or invalid domain', () => {
      const invalid = {
        email: 'invalid-email',
        password: 'Password123',
      };
      expect(emailSignUpSchema.safeParse(invalid).success).toBe(false);
    });

    it('should reject passwords without uppercase letter or number', () => {
      expect(emailSignUpSchema.safeParse({ email: 'user@gmail.com', password: 'passwordonly' }).success).toBe(false);
      expect(emailSignUpSchema.safeParse({ email: 'user@gmail.com', password: 'PASSWORDONLY' }).success).toBe(false);
      expect(emailSignUpSchema.safeParse({ email: 'user@gmail.com', password: 'Pass1' }).success).toBe(false);
    });
  });

  describe('onboardingSchema', () => {
    it('should validate complete student onboarding data', () => {
      const student = {
        role: 'student' as const,
        fullName: 'Chukwuemeka Adebayo',
        phone: '08012345678',
        universityId: 'university-of-lagos',
        campusName: 'Main Campus',
        department: 'Computer Science',
        preferredRoomType: 'self_contained',
      };
      expect(studentOnboardingSchema.safeParse(student).success).toBe(true);
      expect(onboardingSchema.safeParse(student).success).toBe(true);
    });

    it('should validate complete landlord onboarding data', () => {
      const landlord = {
        role: 'landlord' as const,
        fullName: 'Chief Adebayo',
        phone: '08032345678',
        providerType: 'owner' as const,
        businessName: 'Apex Lodges',
        operatingArea: 'Akoka, Lagos',
      };
      expect(landlordOnboardingSchema.safeParse(landlord).success).toBe(true);
      expect(onboardingSchema.safeParse(landlord).success).toBe(true);
    });

    it('should reject student onboarding if full name is less than 2 characters', () => {
      const invalid = {
        role: 'student' as const,
        fullName: 'A',
      };
      expect(studentOnboardingSchema.safeParse(invalid).success).toBe(false);
    });
  });
});

