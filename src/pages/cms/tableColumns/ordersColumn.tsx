import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Chip, IconButton, Box } from '@mui/material';
import { type GridColDef } from '@mui/x-data-grid';

import { formatDateTime } from '../../../utils/dateTime';
import { formatNumber } from '../../../utils/number';

// Order status color mapping
const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return { backgroundColor: '#fef3c7', color: '#d97706' };
    case 'processing':
      return { backgroundColor: '#dbeafe', color: '#2563eb' };
    case 'shipped':
      return { backgroundColor: '#e0e7ff', color: '#6366f1' };
    case 'delivered':
      return { backgroundColor: '#dcfce7', color: '#16a34a' };
    case 'cancelled':
      return { backgroundColor: '#fee2e2', color: '#dc2626' };
    default:
      return { backgroundColor: '#f3f4f6', color: '#6b7280' };
  }
};

// Payment method color mapping
const getPaymentMethodColor = (method: string) => {
  switch (method) {
    case 'cash':
      return { backgroundColor: '#dcfce7', color: '#16a34a' };
    case 'credit_card':
      return { backgroundColor: '#dbeafe', color: '#2563eb' };
    case 'bank_transfer':
      return { backgroundColor: '#e0e7ff', color: '#6366f1' };
    case 'e_wallet':
      return { backgroundColor: '#fef3c7', color: '#d97706' };
    default:
      return { backgroundColor: '#f3f4f6', color: '#6b7280' };
  }
};

export const orderColumns: GridColDef[] = [
  {
    field: 'orderId',
    headerName: 'Order ID',
    width: 120,
    renderCell: (params) => (
      <Box sx={{ fontWeight: 600, color: '#1976d2' }}>#{params.value}</Box>
    ),
  },
  {
    field: 'customerName',
    headerName: 'Customer',
    width: 180,
    renderCell: (params) => (
      <Box>
        <Box sx={{ fontWeight: 500 }}>{params.value}</Box>
        <Box sx={{ fontSize: '12px', color: '#6b7280' }}>
          {params.row.customerEmail}
        </Box>
      </Box>
    ),
  },
  {
    field: 'items',
    headerName: 'Items',
    width: 100,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => (
      <Chip
        label={`${params.value?.length || 0} items`}
        variant="outlined"
        size="small"
      />
    ),
  },
  {
    field: 'total',
    headerName: 'Total',
    width: 130,
    align: 'right',
    headerAlign: 'right',
    renderCell: (params) => (
      <Box sx={{ fontWeight: 600, fontSize: '14px' }}>
        {formatNumber(params.value)} ₫
      </Box>
    ),
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 120,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => {
      const colorStyle = getStatusColor(params.value);
      return (
        <Chip
          label={params.value?.charAt(0).toUpperCase() + params.value?.slice(1)}
          size="small"
          sx={{
            ...colorStyle,
            fontWeight: 500,
            fontSize: '12px',
            textTransform: 'capitalize',
          }}
        />
      );
    },
  },
  {
    field: 'paymentMethod',
    headerName: 'Payment',
    width: 120,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => {
      const colorStyle = getPaymentMethodColor(params.value);
      const displayText = params.value?.replace('_', ' ').toUpperCase();
      return (
        <Chip
          label={displayText}
          size="small"
          sx={{
            ...colorStyle,
            fontWeight: 500,
            fontSize: '11px',
          }}
        />
      );
    },
  },
  {
    field: 'createdAt',
    headerName: 'Created',
    width: 140,
    renderCell: (params) => (
      <Box sx={{ fontSize: '13px' }}>{formatDateTime(params.value)}</Box>
    ),
  },
  {
    field: 'actions',
    headerName: 'Actions',
    width: 120,
    align: 'center',
    headerAlign: 'center',
    sortable: false,
    filterable: false,
    renderCell: (params) => (
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        <IconButton
          size="small"
          onClick={() => console.log('View order:', params.row.id)}
          sx={{ color: '#6b7280' }}
        >
          <VisibilityIcon fontSize="small" />
        </IconButton>

        <IconButton
          size="small"
          onClick={() => console.log('Edit order:', params.row.id)}
          sx={{ color: '#f59e0b' }}
        >
          <EditIcon fontSize="small" />
        </IconButton>

        <IconButton
          size="small"
          onClick={() => console.log('Delete order:', params.row.id)}
          sx={{ color: '#ef4444' }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
    ),
  },
];
