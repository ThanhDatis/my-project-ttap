/* eslint-disable no-unused-vars */
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;

  // Actions
  login: (user: User, token: string, refreshToken?: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  checkAuth: () => boolean;
  updateToken: (token: string, refreshToken?: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      refreshToken: null,
      isLoading: false,

      login: (user: User, token: string, refreshToken?: string) => {
        set({
          isAuthenticated: true,
          user,
          token,
          refreshToken,
          isLoading: false,
        });
      },

      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
          token: null,
          refreshToken: null,
          isLoading: false,
        });
        // Clear localStorage
        // localStorage.removeItem('auth-storage');
      },

      setUser: (user: User) => {
        set({ user });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      updateToken: (token: string, refreshToken?: string) => {
        set({
          token,
          refreshToken: refreshToken || get().refreshToken,
        });
      },

      clearAuth() {
        set({
          isAuthenticated: false,
          user: null,
          token: null,
          refreshToken: null,
          isLoading: false,
        });
      },

      checkAuth: () => {
        const { token, user } = get();
        if (!token || !user) {
          return false;
        }

        try {
          if (token.length < 10) {
            get().logout();
            return false;
          }
          // Decode token và check expiration
          // const decoded = jwt.decode(token);
          // if (decoded && typeof decoded === 'object' && decoded.exp) {
          //   if (Date.now() >= decoded.exp * 1000) {
          //     get().logout();
          //     return false;
          //   }
          // }
          return true;
        } catch (error) {
          console.error('Token validation error:', error);
          get().logout();
          return false;
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
      }),

      onRehydrateStorage: () => (state) => {
        console.log('Hydration finished, state:', state);
        if (state) {
          state.isLoading = false;
        }
      },
    },
  ),
);
