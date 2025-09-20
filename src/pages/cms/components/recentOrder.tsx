/* eslint-disable @typescript-eslint/no-explicit-any */
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import {
  Box,
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  CircularProgress,
  Button,
  useMediaQuery,
} from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import theme from '../../../common/theme/themes';
import type { RecentOrder } from '../../../lib/dashboard.repo';
import { formatDateTime } from '../../../utils';

interface RecentOrdersProps {
  orders: RecentOrder[];
  isLoading?: boolean;
  onRefresh?: () => void;
  onViewOrder?: (orderId: string) => void;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'warning';
    case 'processing':
      return 'info';
    case 'delivered':
      return 'success';
    case 'cancelled':
      return 'error';
    default:
      return 'default';
  }
};

const getPaymentMethodLabel = (method: string) => {
  switch (method) {
    case 'cash':
      return 'Cash';
    case 'credit_card':
      return 'Credit Card';
    case 'bank_transfer':
      return 'Bank Transfer';
    case 'e_wallet':
      return 'E-Wallet';
    default:
      return method?.toUpperCase() || 'Unknown';
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

export const RecentOrders: React.FC<RecentOrdersProps> = ({
  orders,
  isLoading = false,
  onRefresh,
  onViewOrder,
}) => {
  const navigate = useNavigate();

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (isLoading) {
    return (
      <Card sx={{ p: 3, height: 400 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <CircularProgress />
        </Box>
      </Card>
    );
  }

  return (
    <Card sx={{ height: '100%' }}>
      <Box sx={{ p: 3, pb: 0 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Recent Orders
          </Typography>

          <Box sx={{ display: 'flex', gap: 1 }}>
            {onRefresh && (
              <IconButton size="small" onClick={onRefresh} disabled={isLoading}>
                <RefreshRoundedIcon />
              </IconButton>
            )}
          </Box>
        </Box>

        {orders.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 4,
            }}
          >
            <Typography variant="body1" color="text.secondary" gutterBottom>
              No recent orders found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Orders will appear here when customers place them
            </Typography>
          </Box>
        ) : (
          <TableContainer sx={{ maxHeight: 350 }}>
            <Table stickyHeader size={isMobile ? 'small' : 'medium'}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Order ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Customer</TableCell>
                  {!isMobile && (
                    <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                  )}
                  <TableCell sx={{ fontWeight: 'bold' }}>Payment</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="right">
                    Total
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="center">
                    Status
                  </TableCell>
                  <TableCell width={50}></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {orders.map((order) => (
                  <TableRow
                    key={order.id}
                    hover
                    sx={{
                      cursor: onViewOrder ? 'pointer' : 'default',
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    }}
                    onClick={() => onViewOrder?.(order.id)}
                  >
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: 'monospace',
                          fontWeight: 600,
                          color: 'primary.main',
                        }}
                      >
                        #{order.orderId}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxWidth: 120,
                        }}
                        title={order.customerName}
                      >
                        {order.customerName}
                      </Typography>
                    </TableCell>

                    {!isMobile && (
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {formatDateTime(order.createdAt).split(' ')[0]}
                        </Typography>
                      </TableCell>
                    )}

                    <TableCell>
                      <Typography variant="body2">
                        {getPaymentMethodLabel(order.paymentMethod)}
                      </Typography>
                    </TableCell>

                    <TableCell align="right">
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: 'primary.main' }}
                      >
                        {formatCurrency(order.total)}
                      </Typography>
                    </TableCell>

                    <TableCell align="center">
                      <Chip
                        label={order.status}
                        size="small"
                        color={getStatusColor(order.status) as any}
                        sx={{
                          textTransform: 'capitalize',
                          fontWeight: 500,
                        }}
                      />
                    </TableCell>

                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewOrder?.(order.id);
                        }}
                      >
                        <MoreVertRoundedIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      {orders.length > 0 && (
        <Box sx={{ p: 2, pt: 1, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="text"
            size="small"
            onClick={() => navigate('/orders')}
          >
            View All Orders
          </Button>
        </Box>
      )}
    </Card>
  );
};

export default RecentOrders;
