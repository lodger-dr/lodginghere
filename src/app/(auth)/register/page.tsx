'use client';

import React, { Suspense } from 'react';
import { RoleSelectionView } from '@/components/shared/role-selector';

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-slate-500">Loading...</div>}>
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center py-10 bg-slate-50">
        <RoleSelectionView
          title="Testing Stage: Select Your Role"
          subtitle="Sign up forms are removed for development. Select whether you want to test as a Student or Landlord:"
        />
      </div>
    </Suspense>
  );
}
