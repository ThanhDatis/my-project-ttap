/* eslint-disable no-unused-vars */
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import axios from '../lib/axios';

interface User {
  _id: string;
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
  login: (name: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  checkAuth: () => boolean;
  // updateToken: (token: string, refreshToken?: string) => void;
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

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          // Call your login API here
          const response = await axios.post('/auth/signin', {
            email,
            password,
          });
          const { user, token, refreshToken } = response.data;
          set({
            isAuthenticated: true,
            user: {
              _id: user._id,
              email: user.email,
              name: user.name,
              role: user.role,
              avatar: user.avatar,
            },
            token,
            refreshToken,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
          token: null,
          refreshToken: null,
          isLoading: false,
        });
      },

      setUser: (user: User) => {
        set({ user });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
      clearAuth: () => {
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
        return !!(token && user);

        // try {
        //   if (token.length < 10) {
        //     get().logout();
        //     return false;
        //   }
        //   // Decode token và check expiration
        //   // const decoded = jwt.decode(token);
        //   // if (decoded && typeof decoded === 'object' && decoded.exp) {
        //   //   if (Date.now() >= decoded.exp * 1000) {
        //   //     get().logout();
        //   //     return false;
        //   //   }
        //   // }
        //   return true;
        // } catch (error) {
        //   console.error('Token validation error:', error);
        //   get().logout();
        //   return false;
        // }
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

      // onRehydrateStorage: () => (state) => {
      //   console.log('Hydration finished, state:', state);
      //   if (state) {
      //     state.isLoading = false;
      //   }
      // },
    },
  ),
);

export type { User };
