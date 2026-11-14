import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNaira(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return 'N/A';
  return new Intl.DateTimeFormat('en-NG', {
    dateStyle: 'medium',
  }).format(new Date(dateStr));
}

