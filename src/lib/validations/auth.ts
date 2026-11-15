import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long'),
});

export const studentSignUpSchema = z.object({
  role: z.literal('student'),
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name is too long'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  phone: z
    .string()
    .regex(/^(\+234|0)[789][01]\d{8}$/, 'Please enter a valid Nigerian phone number')
    .optional()
    .or(z.literal('')),
  universityId: z.string().min(1, 'Please select a valid university').optional().or(z.literal('')),
  department: z.string().max(100).optional().or(z.literal('')),
});

export const landlordSignUpSchema = z.object({
  role: z.literal('landlord'),
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name is too long'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  phone: z
    .string()
    .regex(/^(\+234|0)[789][01]\d{8}$/, 'Please enter a valid Nigerian phone number')
    .optional()
    .or(z.literal('')),
  providerType: z.enum(['owner', 'authorized_representative'], {
    errorMap: () => ({ message: 'Please select whether you are the owner or authorized representative' }),
  }),
  businessName: z.string().max(100).optional().or(z.literal('')),
});

export const signUpSchema = z.discriminatedUnion('role', [
  studentSignUpSchema,
  landlordSignUpSchema,
]);

export const resetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
});

export const emailSignUpSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

export const studentOnboardingSchema = z.object({
  role: z.literal('student'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  phone: z
    .string()
    .regex(/^(\+234|0)[789][01]\d{8}$/, 'Please enter a valid Nigerian phone number')
    .optional()
    .or(z.literal('')),
  universityId: z.string().min(1, 'Please select your university').optional().or(z.literal('')),
  campusName: z.string().max(100).optional().or(z.literal('')),
  department: z.string().max(100).optional().or(z.literal('')),
  preferredRoomType: z.string().optional().or(z.literal('')),
});

export const landlordOnboardingSchema = z.object({
  role: z.literal('landlord'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  phone: z
    .string()
    .regex(/^(\+234|0)[789][01]\d{8}$/, 'Please enter a valid Nigerian phone number')
    .optional()
    .or(z.literal('')),
  providerType: z.enum(['owner', 'authorized_representative'], {
    errorMap: () => ({ message: 'Please select whether you are the owner or authorized representative' }),
  }),
  businessName: z.string().max(100).optional().or(z.literal('')),
  operatingArea: z.string().max(100).optional().or(z.literal('')),
});

export const onboardingSchema = z.discriminatedUnion('role', [
  studentOnboardingSchema,
  landlordOnboardingSchema,
]);

export const updateProfileSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  phone: z
    .string()
    .regex(/^(\+234|0)[789][01]\d{8}$/, 'Please enter a valid Nigerian phone number')
    .optional()
    .or(z.literal('')),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type StudentSignUpInput = z.infer<typeof studentSignUpSchema>;
export type LandlordSignUpInput = z.infer<typeof landlordSignUpSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type EmailSignUpInput = z.infer<typeof emailSignUpSchema>;
export type StudentOnboardingInput = z.infer<typeof studentOnboardingSchema>;
export type LandlordOnboardingInput = z.infer<typeof landlordOnboardingSchema>;
export type OnboardingInput = z.infer<typeof onboardingSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

