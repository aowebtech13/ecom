import { useEffect } from 'react';
import { useRouter, useSegments, Slot } from 'expo-router';
import { useAuthStore } from '@/store/useAuthStore';

export default function StudentLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { token, role } = useAuthStore();

  useEffect(() => {
    // Allow access to login without authentication
    if (!segments.includes('login')) {
      if (!token || role !== 'student') {
        router.replace('/student/login');
      }
    }
  }, [token, role, router, segments]);

  return <Slot />;
}