'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function StudentUniversitiesPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/student/explore');
  }, [router]);

  return null;
}
