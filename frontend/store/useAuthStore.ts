import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Role = 'admin' | 'parent';

type User = {
  id: number;
  name: string;
  email: string;
  role: Role;
};

type AuthState = {
  token: string | null;
  user: User | null;
  role: Role | null;
  setAuth: (payload: { token: string; user: User }) => void;
  clear: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      role: null,
      setAuth: ({ token, user }) =>
        set({ token, user, role: user.role }),
      clear: () => set({ token: null, user: null, role: null }),
    }),
    {
      name: 'auth-store',
      storage: {
        getItem: (key) => AsyncStorage.getItem(key),
        setItem: (key, value) => AsyncStorage.setItem(key, value),
        removeItem: (key) => AsyncStorage.removeItem(key),
      },
    }
  )
);
