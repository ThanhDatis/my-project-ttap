import { create } from 'zustand';

import dashboardRepository, {
  type DashboardStats,
  type RecentOrder,
  type LowStockProduct,
  type DashboardData,
} from '../lib/dashboard.repo';

type DashboardState = {
  stats: DashboardStats | null;
  recentOrders: RecentOrder[];
  lowStockProducts: LowStockProduct[];

  isLoading: boolean;
  isLoadingStats: boolean;
  isLoadingOrders: boolean;
  isLoadingProducts: boolean;

  error: string | null;

  lastUpdated: Date | null;
};

type DashboardActions = {
  fetchDashboardData: () => Promise<void>;

  fetchStats: () => Promise<void>;
  fetchRecentOrders: () => Promise<void>;
  fetchLowStockProducts: () => Promise<void>;

  refreshStats: () => Promise<void>;
  refreshRecentOrders: () => Promise<void>;
  refreshLowStockProducts: () => Promise<void>;

  clearError: () => void;
  clearData: () => void;

  refreshAll: () => Promise<void>;
};

const initialStats: DashboardStats = {
  totalCustomers: 0,
  totalOrders: 0,
  totalProducts: 0,
  pendingOrders: 0,
  totalRevenue: 0,
  totalEmployees: 0,
};

export const useDashboardStore = create<DashboardState & DashboardActions>(
  (set, get) => ({
    stats: null,
    recentOrders: [],
    lowStockProducts: [],

    isLoading: false,
    isLoadingStats: false,
    isLoadingOrders: false,
    isLoadingProducts: false,

    error: null,
    lastUpdated: null,

    clearError: () => set({ error: null }),

    clearData: () =>
      set({
        stats: null,
        recentOrders: [],
        lowStockProducts: [],
        error: null,
        lastUpdated: null,
      }),

    fetchDashboardData: async () => {
      set({ isLoading: true, error: null });

      try {
        const data = await dashboardRepository.getDashboardData();

        set({
          stats: data.stats,
          recentOrders: data.recentOrders,
          lowStockProducts: data.lowStockProducts,
          isLoading: false,
          lastUpdated: new Date(),
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to fetch dashboard data';
        set({
          error: errorMessage,
          isLoading: false,
          stats: initialStats,
        });
      }
    },

    fetchStats: async () => {
      set({ isLoadingStats: true, error: null });

      try {
        const stats = await dashboardRepository.getDashboardStats();
        set({
          stats,
          isLoadingStats: false,
          lastUpdated: new Date(),
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to fetch statistics';
        set({
          error: errorMessage,
          isLoadingStats: false,
          stats: initialStats,
        });
      }
    },

    fetchRecentOrders: async () => {
      set({ isLoadingOrders: true, error: null });

      try {
        const recentOrders = await dashboardRepository.getRecentOrders(10);
        set({
          recentOrders,
          isLoadingOrders: false,
          lastUpdated: new Date(),
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to fetch recent orders';
        set({
          error: errorMessage,
          isLoadingOrders: false,
        });
      }
    },

    fetchLowStockProducts: async () => {
      set({ isLoadingProducts: true, error: null });

      try {
        const lowStockProducts = await dashboardRepository.getLowStockProducts(
          5,
          10,
        );
        set({
          lowStockProducts,
          isLoadingProducts: false,
          lastUpdated: new Date(),
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to fetch low stock products';
        set({
          error: errorMessage,
          isLoadingProducts: false,
        });
      }
    },

    refreshStats: async () => {
      await get().fetchStats();
    },

    refreshRecentOrders: async () => {
      await get().fetchRecentOrders();
    },

    refreshLowStockProducts: async () => {
      await get().fetchLowStockProducts();
    },

    refreshAll: async () => {
      await get().fetchDashboardData();
    },
  }),
);

export default useDashboardStore;
