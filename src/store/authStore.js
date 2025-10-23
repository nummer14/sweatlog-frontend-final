import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      setTokens: ({ accessToken, refreshToken, user }) =>
        set((state) => {
          const newState = { ...state, accessToken, refreshToken };
          if (user) {
            newState.user = user;
          }
          return newState;
        }),
      logout: () => {
        set({ accessToken: null, refreshToken: null, user: null });
      },
    }),
    {
      name: 'auth-storage', // 로컬 스토리지에 저장될 때 사용될 키
    }
  )
);

export default useAuthStore;