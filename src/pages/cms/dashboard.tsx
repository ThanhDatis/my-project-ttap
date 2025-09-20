import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import InventoryRoundedIcon from '@mui/icons-material/InventoryRounded';
import PendingActionsRoundedIcon from '@mui/icons-material/PendingActionsRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import SellRoundedIcon from '@mui/icons-material/SellRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import {
  Box,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Alert,
  useMediaQuery,
} from '@mui/material';
import React from 'react';

import theme from '../../common/theme/themes';

import KpiCard from './components/kpiCard';
import LowStockList from './components/lowStockList';
import RecentOrders from './components/recentOrder';
import useDashboard from './hooks/useDashboard';

const Dashboard: React.FC = () => {
  const {
    stats,
    recentOrders,
    lowStockProducts,

    isLoading,
    isAnyLoading,
    error,
    lastUpdated,
    hasData,
    isEmpty,

    handleRefreshAll,
    // handleRefreshStats,
    handleRefreshOrders,
    handleRefreshProducts,
    handleViewOrder,
    handleViewProduct,
    handleNavigateToOrders,
    handleNavigateToProducts,
    handleNavigateToCustomers,
    // handleNavigateToEmployees,
  } = useDashboard();

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (isLoading && !hasData) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          gap: 2,
        }}
      >
        <CircularProgress size={40} />
        <Typography variant="h6" color="text.secondary">
          Loading dashboard...
        </Typography>
      </Box>
    );
  }

  if (isEmpty) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center',
          gap: 2,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Welcome to Sales Management System
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Start by adding your first products, customers, and create orders to
          see your dashboard come to life.
        </Typography>

        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <Button
            variant="contained"
            onClick={handleNavigateToProducts}
            startIcon={<InventoryRoundedIcon />}
          >
            Add Products
          </Button>
          <Button
            variant="outlined"
            onClick={handleNavigateToCustomers}
            startIcon={<GroupRoundedIcon />}
          >
            Add Customers
          </Button>
          <Button
            variant="outlined"
            onClick={handleNavigateToOrders}
            startIcon={<SellRoundedIcon />}
          >
            Create Orders
          </Button>
        </Box>
      </Box>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(amount);
  };

  return (
    <Box>
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box>
          <Typography
            variant={isMobile ? 'h5' : 'h4'}
            sx={{ fontWeight: 'bold', mb: 1 }}
          >
            Dashboard Overview
          </Typography>

          {lastUpdated && (
            <Typography variant="body2" color="text.secondary">
              Last updated: {new Date(lastUpdated).toLocaleString()}
            </Typography>
          )}
        </Box>

        <Button
          variant="outlined"
          startIcon={<RefreshRoundedIcon />}
          onClick={handleRefreshAll}
          disabled={isAnyLoading}
          sx={{ minWidth: 120 }}
        >
          {isAnyLoading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard
            title="Total Customers"
            value={stats?.totalCustomers || 0}
            icon={<GroupRoundedIcon />}
            color="primary"
            isLoading={isLoading}
            suffix=""
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard
            title="Total Orders"
            value={stats?.totalOrders || 0}
            icon={<SellRoundedIcon />}
            color="success"
            isLoading={isLoading}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard
            title="Total Products"
            value={stats?.totalProducts || 0}
            icon={<InventoryRoundedIcon />}
            color="info"
            isLoading={isLoading}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard
            title="Pending Orders"
            value={stats?.pendingOrders || 0}
            icon={<PendingActionsRoundedIcon />}
            color="warning"
            isLoading={isLoading}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <KpiCard
            title="Total Revenue"
            value={
              stats?.totalRevenue ? formatCurrency(stats.totalRevenue) : '0'
            }
            icon={<TrendingUpRoundedIcon />}
            color="success"
            isLoading={isLoading}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <KpiCard
            title="Total Employees"
            value={stats?.totalEmployees || 0}
            icon={<BadgeRoundedIcon />}
            color="secondary"
            isLoading={isLoading}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <RecentOrders
            orders={recentOrders}
            isLoading={isLoading}
            onRefresh={handleRefreshOrders}
            onViewOrder={handleViewOrder}
          />
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <LowStockList
            products={lowStockProducts}
            isLoading={isLoading}
            onRefresh={handleRefreshProducts}
            onViewProduct={handleViewProduct}
            threshold={5}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
