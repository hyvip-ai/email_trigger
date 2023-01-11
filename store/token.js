import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useTokenStore = create(
  persist(
    (set) => ({
      accessToken: '',
      setAccessToken: (accessToken) => set((state) => ({ accessToken })),
    }),
    {
      name: 'tokens',
    }
  )
);
