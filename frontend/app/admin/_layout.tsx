import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '@/store/useAuthStore';

export default function AdminLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { role, token } = useAuthStore();

  useEffect(() => {
    // If not admin and not at login, redirect to login
    if ((!token || role !== 'admin') && !segments.includes('login')) {
      router.replace('/admin/login');
    }
  }, [role, token]);

  return null;
}