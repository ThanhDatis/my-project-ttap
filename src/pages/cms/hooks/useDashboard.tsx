import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { ToastMessage } from '../../../components/toastMessage';
import useDashboardStore from '../../../store/dashboard.store';

export default function useDashboard() {
  const navigate = useNavigate();

  const {
    stats,
    recentOrders,
    lowStockProducts,

    isLoading,
    isLoadingStats,
    isLoadingOrders,
    isLoadingProducts,

    error,
    lastUpdated,

    fetchDashboardData,
    fetchStats,
    fetchRecentOrders,
    fetchLowStockProducts,
    refreshAll,
    clearError,
  } = useDashboardStore();

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        await fetchDashboardData();
      } catch (error) {
        console.error('Failed to load dashboard:', error);
      }
    };

    loadDashboard();
  }, [fetchDashboardData]);

  useEffect(() => {
    if (error) {
      ToastMessage('error', error);
      clearError();
    }
  }, [error, clearError]);

  const handleRefreshAll = useCallback(async () => {
    try {
      await refreshAll();
      ToastMessage('success', 'Dashboard data refreshed successfully');
    } catch (error) {
      console.error('Failed to refresh dashboard:', error);
      ToastMessage('error', 'Failed to refresh dashboard data');
    }
  }, [refreshAll]);

  const handleRefreshStats = useCallback(async () => {
    try {
      await fetchStats();
      ToastMessage('success', 'Statistics refreshed');
    } catch (error) {
      console.error('Failed to refresh stats:', error);
      ToastMessage('error', 'Failed to refresh statistics');
    }
  }, [fetchStats]);

  const handleRefreshOrders = useCallback(async () => {
    try {
      await fetchRecentOrders();
      ToastMessage('success', 'Recent orders refreshed');
    } catch (error) {
      console.error('Failed to refresh orders:', error);
      ToastMessage('error', 'Failed to refresh recent orders');
    }
  }, [fetchRecentOrders]);

  const handleRefreshProducts = useCallback(async () => {
    try {
      await fetchLowStockProducts();
      ToastMessage('success', 'Low stock products refreshed');
    } catch (error) {
      console.error('Failed to refresh products:', error);
      ToastMessage('error', 'Failed to refresh low stock products');
    }
  }, [fetchLowStockProducts]);

  const handleViewOrder = useCallback(
    (orderId: string) => {
      navigate(`/orders?view=${orderId}`);
    },
    [navigate],
  );

  const handleViewProduct = useCallback(
    (productId: string) => {
      navigate(`/products?view=${productId}`);
    },
    [navigate],
  );

  const handleNavigateToOrders = useCallback(() => {
    navigate('/orders');
  }, [navigate]);

  const handleNavigateToProducts = useCallback(() => {
    navigate('/products');
  }, [navigate]);

  const handleNavigateToCustomers = useCallback(() => {
    navigate('/customers');
  }, [navigate]);

  const handleNavigateToEmployees = useCallback(() => {
    navigate('/employees');
  }, [navigate]);

  useEffect(() => {
    const interval = setInterval(
      () => {
        if (!isLoading) {
          fetchDashboardData();
        }
      },
      5 * 60 * 1000,
    );

    return () => clearInterval(interval);
  }, [fetchDashboardData, isLoading]);

  const hasData = stats !== null;
  const isEmpty =
    !isLoading &&
    (!stats ||
      (stats.totalCustomers === 0 &&
        stats.totalOrders === 0 &&
        stats.totalProducts === 0));

  const isAnyLoading =
    isLoading || isLoadingStats || isLoadingOrders || isLoadingProducts;

  return {
    stats,
    recentOrders,
    lowStockProducts,

    isLoading,
    isLoadingStats,
    isLoadingOrders,
    isLoadingProducts,
    isAnyLoading,
    error,
    lastUpdated,
    hasData,
    isEmpty,

    handleRefreshAll,
    handleRefreshStats,
    handleRefreshOrders,
    handleRefreshProducts,

    handleViewOrder,
    handleViewProduct,
    handleNavigateToOrders,
    handleNavigateToProducts,
    handleNavigateToCustomers,
    handleNavigateToEmployees,

    fetchDashboardData,
    clearError,
  };
}
