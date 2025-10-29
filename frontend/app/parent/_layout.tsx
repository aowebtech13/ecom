import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '@/store/useAuthStore';

export default function ParentLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { role, token } = useAuthStore();

  useEffect(() => {
    // If not parent and not at login, redirect to login
    if ((!token || role !== 'parent') && !segments.includes('login')) {
      router.replace('/parent/login');
    }
  }, [role, token]);

  return null;
}