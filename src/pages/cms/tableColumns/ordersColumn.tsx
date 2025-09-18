/* eslint-disable no-unused-vars */
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import { Box, Chip, IconButton, Typography } from '@mui/material';
import { type GridColDef } from '@mui/x-data-grid';

import type {
  Order,
  OrderStatus,
  ShippingAddress,
} from '../../../lib/order.repo';
import { formatDateTime } from '../../../utils';

export const getOrderColumns = ({
  onMenuClick,
}: {
  onMenuClick: (event: React.MouseEvent<HTMLElement>, orderId: string) => void;
  onView?: (order: Order) => void;
  onEdit?: (order: Order) => void;
  onDelete?: (order: Order) => void;
}): GridColDef[] => [
  {
    field: 'orderId',
    headerName: 'Order ID',
    type: 'string',
    flex: 1,
    maxWidth: 200,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => {
      const order = params.row as Order;
      return (
        <Box
          sx={{
            py: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: 'primary.main',
              fontFamily: 'monospace',
              cursor: 'pointer',
              '&:hover': {
                color: 'primary.dark',
              },
            }}
          >
            #{order.orderId}
          </Typography>
        </Box>
      );
    },
  },
  {
    field: 'customerName',
    headerName: 'Customer',
    type: 'string',
    flex: 1,
    maxWidth: 200,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => {
      const order = params.row as Order;
      const customerName = order?.customerName || 'Unknown Customer';
      const customerEmail = order?.customerEmail || 'No email';

      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            py: 0.5,
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {customerName}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
            }}
          >
            {customerEmail}
          </Typography>
        </Box>
      );
    },
  },
  {
    field: 'shippingAddress',
    headerName: 'Shipping Address',
    type: 'string',
    flex: 1,
    minWidth: 240,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => {
      const address = params.value as ShippingAddress | undefined;

      const fullAddress = address
        ? [address.street, address.ward, address.district, address.city]
            .filter(Boolean)
            .join(', ')
        : '';

      return (
        <Box sx={{ py: 2 }}>
          <Typography
            variant="body2"
            sx={{
              color: fullAddress ? 'text.primary' : 'text.secondary',
              fontStyle: fullAddress ? 'normal' : 'italic',
            }}
            title={fullAddress || 'No address provided'}
          >
            {fullAddress || 'No address'}
          </Typography>

          {address?.note && (
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                fontStyle: 'italic',
                display: 'block',
              }}
              title={address.note}
            >
              Note: {address.note}
            </Typography>
          )}
        </Box>
      );
    },
  },
  {
    field: 'items',
    headerName: 'Items',
    type: 'string',
    flex: 1,
    minWidth: 100,
    maxWidth: 100,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => {
      const itemCount = params.value?.length || 0;
      return (
        <Chip
          label={`${itemCount} items`}
          size="medium"
          variant="outlined"
          color={itemCount > 0 ? 'primary' : 'default'}
          sx={{
            fontWeight: 500,
            '& .MuiChip-icon': {
              color: 'inherit',
            },
          }}
        />
      );
    },
  },
  {
    field: 'status',
    headerName: 'Status',
    type: 'string',
    minWidth: 130,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => {
      const status = params.value as OrderStatus;

      const getStatusConfig = (status: OrderStatus) => {
        switch (status) {
          case 'pending':
            return {
              label: 'Pending',
              color: 'warning' as const,
            };
          case 'processing':
            return {
              label: 'Processing',
              color: 'info' as const,
            };
          case 'shipped':
            return {
              label: 'Shipped',
              color: 'primary' as const,
            };
          case 'delivered':
            return {
              label: 'Delivered',
              color: 'success' as const,
            };
          case 'cancelled':
            return {
              label: 'Cancelled',
              color: 'error' as const,
            };
          default:
            return {
              label: 'Unknown',
              color: 'default' as const,
            };
        }
      };

      const config = getStatusConfig(status);

      return (
        <Chip
          label={config.label}
          size="small"
          color={config.color}
          variant="filled"
          sx={{
            fontWeight: 600,
            textTransform: 'capitalize',
            '& .MuiChip-icon': {
              color: 'inherit',
            },
          }}
        />
      );
    },
  },
  {
    field: 'createdAt',
    headerName: 'Created At',
    type: 'string',
    flex: 1,
    maxWidth: 180,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => {
      return formatDateTime(params.value);
    },
  },
  {
    field: 'action',
    headerName: 'Actions',
    type: 'actions',
    minWidth: 80,
    maxWidth: 80,
    sortable: false,
    filterable: false,
    renderCell: (params) => {
      const order = params.row as Order;

      return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <IconButton
            size="small"
            onClick={(e) => onMenuClick(e, order.id.toString())}
            sx={{
              color: 'text.secondary',
            }}
            title="More options"
          >
            <MoreVertRoundedIcon fontSize="small" />
          </IconButton>
        </Box>
      );
    },
  },
];

export const ORDER_STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
] as const;

export const PAYMENT_METHOD_OPTIONS = [
  { value: 'all', label: 'All Payment Methods' },
  { value: 'cash', label: 'Cash' },
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'e_wallet', label: 'E-Wallet' },
] as const;

export const ORDER_SORT_OPTIONS = [
  { value: 'createdAt:desc', label: 'Newest First' },
  { value: 'createdAt:asc', label: 'Oldest First' },
  { value: 'total:desc', label: 'Highest Amount' },
  { value: 'total:asc', label: 'Lowest Amount' },
  { value: 'customerName:asc', label: 'Customer (A-Z)' },
  { value: 'customerName:desc', label: 'Customer (Z-A)' },
  { value: 'orderId:asc', label: 'Order ID (A-Z)' },
  { value: 'orderId:desc', label: 'Order ID (Z-A)' },
  { value: 'status:asc', label: 'Status (A-Z)' },
  { value: 'status:desc', label: 'Status (Z-A)' },
] as const;
