import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;

  // Actions
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  checkAuth: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      isLoading: false,

      login: (user: User, token: string) => {
        set({
          isAuthenticated: true,
          user,
          token,
          isLoading: false,
        });
      },

      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
          token: null,
          isLoading: false,
        });
        // Clear localStorage
        localStorage.removeItem('auth-storage');
      },

      setUser: (user: User) => {
        set({ user });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      checkAuth: () => {
        const { token, user } = get();
        if (!token || !user) {
          return false;
        }

        try {
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
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token,
      }),
    }
  )
);
