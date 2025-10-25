import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// [핵심] 첫 번째 코드의 단순하고 직관적인 스토어 구조를 사용합니다.
const useAuthStore = create(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,
      accessToken: null,
      // 로그인 시 user 정보와 token을 한 번에 저장합니다.
      login: (user, accessToken) => set({ 
        isLoggedIn: true, 
        user, 
        accessToken 
      }),
      // 로그아웃 시 모든 상태를 초기화합니다.
      logout: () => set({ 
        isLoggedIn: false, 
        user: null, 
        accessToken: null 
      }),
    }),
    {
      name: 'auth-storage', // localStorage에 저장될 때 사용될 키 이름
      // localStorage에 어떤 데이터를 저장할지 명시적으로 선택합니다.
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        user: state.user,
        accessToken: state.accessToken,
      }),
    }
  )
);

export default useAuthStore;