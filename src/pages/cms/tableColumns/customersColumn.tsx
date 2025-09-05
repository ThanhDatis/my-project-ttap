/* eslint-disable no-unused-vars */
import {
  MoreVert as MoreVertIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import { Chip, IconButton, Box, Typography, Avatar } from '@mui/material';
import { type GridColDef } from '@mui/x-data-grid';
import React from 'react';

// import { brand, gray } from '../../../common/color';
import { type Customer } from '../../../lib/customer.repo';
import { formatNumber, formatDateTime } from '../../../utils';

interface CustomerData {
  id: number | string;
  name: string;
  email: string;
  phone: string;
  customerType: 'individual' | 'business';
  status: 'active' | 'inactive' | 'blocked';
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
  fullAddress?: string;
  customerSegment?: 'New' | 'Regular' | 'Premium' | 'VIP';
  createdAt?: string;
  updatedAt?: string;
  createdBy?: {
    _id: string;
    name: string;
    email: string;
  };
}

export const getCustomerColumns = ({
  onMenuClick,
}: {
  onMenuClick: (
    event: React.MouseEvent<HTMLElement>,
    customerId: string,
  ) => void;
}): GridColDef[] => [
  {
    field: 'name',
    headerName: 'name',
    type: 'string',
    flex: 1,
    minWidth: 200,
    headerAlign: 'center',
    renderCell: (params) => {
      const name = params.row.name || 'Unknown';
      const email = params.row.email || '';
      const avatarText = name.charAt(0)?.toUpperCase() || 'C';

      return (
        <Box
          sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 0 }}
        >
          <Avatar sx={{ width: 34, height: 34, fontSize: 14 }}>
            {avatarText}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, lineHeight: 1.1 }}
            >
              {name}
            </Typography>
            {email && (
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  display: 'block',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
                title={email}
              >
                {email}
              </Typography>
            )}
          </Box>
        </Box>
      );
    },
  },
  {
    field: 'email',
    headerName: 'Email',
    minWidth: 200,
    flex: 1,
    renderCell: (params) => {
      const email = params.value || (params.row as Customer).email || '';
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <EmailIcon sx={{ width: 16, height: 16, color: 'text.secondary' }} />
          <Typography
            variant="body2"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '100%',
            }}
            title={email}
          >
            {email}
          </Typography>
        </Box>
      );
    },
  },
  {
    field: 'phone',
    headerName: 'Phone',
    type: 'string',
    minWidth: 140,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => {
      const phone = params.value || (params.row as Customer).phone || '';
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <PhoneIcon sx={{ width: 16, height: 16, color: 'text.secondary' }} />
          <Typography variant="body2">{phone}</Typography>
        </Box>
      );
    },
  },
  // {
  //   field: 'customerType',
  //   headerName: 'Type',
  //   type: 'string',
  //   width: 120,
  //   align: 'center',
  //   headerAlign: 'center',
  //   renderCell: (params) => {
  //     const type =
  //       (params.value as CustomerData['customerType']) || 'individual';
  //     return (
  //       <Chip
  //         label={type === 'business' ? 'Business' : 'Individual'}
  //         size="small"
  //         variant="outlined"
  //         color={type === 'business' ? 'primary' : 'default'}
  //         icon={type === 'business' ? <BusinessIcon /> : <PersonIcon />}
  //       />
  //     );
  //   },
  // },
  {
    field: 'tier',
    headerName: 'Tier',
    type: 'string',
    width: 120,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => {
      const raw = (params.value as string) || '';
      const isVip = raw.toLowerCase() === 'vip';
      return (
        <Chip
          label={isVip ? 'VIP' : 'Normal'}
          color={isVip ? 'warning' : 'default'}
          variant="outlined"
          size="small"
        />
      );
    },
  },
  {
    field: 'totalOrders',
    headerName: 'Orders',
    type: 'number',
    width: 100,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => {
      const orders = Number(params.value ?? 0);
      return (
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {formatNumber(orders)}
        </Typography>
      );
    },
  },
  {
    field: 'totalSpent',
    headerName: 'LTV',
    type: 'number',
    minWidth: 130,
    align: 'center',
    headerAlign: 'center',
    valueFormatter: (value) =>
      value == null ? '-' : formatNumber(Number(value)),
    sortComparator: (a, b) => Number(a ?? 0) - Number(b ?? 0),
  },
  {
    field: 'status',
    headerName: 'Status',
    type: 'string',
    width: 110,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => {
      const status =
        (params.value as 'active' | 'inactive' | 'blocked') || 'active';
      const map = {
        active: { color: 'success' as const, label: 'Active' },
        inactive: { color: 'warning' as const, label: 'Inactive' },
        blocked: { color: 'error' as const, label: 'Blocked' },
      };
      const { color, label } = map[status] ?? {
        color: 'default' as const,
        label: 'Unknown',
      };
      return <Chip label={label} color={color} size="small" />;
    },
  },
  {
    field: 'createdAt',
    headerName: 'Created',
    type: 'string',
    flex: 1,
    minWidth: 120,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => (
      <Typography variant="caption">
        {params.value ? formatDateTime(params.value) : ''}
      </Typography>
    ),
    sortComparator: (a, b) =>
      new Date(a || 0).getTime() - new Date(b || 0).getTime(),
  },
  {
    field: 'action',
    headerName: 'Action',
    type: 'actions',
    minWidth: 80,
    maxWidth: 80,
    sortable: false,
    filterable: false,
    renderCell: (params) => {
      const customer = params.row as Customer;
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            size="small"
            onClick={(e) => onMenuClick(e, customer.id.toString())}
            sx={{ color: 'text.secondary' }}
            title="More options"
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Box>
      );
    },
  },
];

export const CUSTOMER_TYPE_OPTIONS = [
  { value: 'all', label: 'All Types' },
  { value: 'individual', label: 'Individual' },
  { value: 'business', label: 'Business' },
] as const;

export const CUSTOMER_STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'blocked', label: 'Blocked' },
] as const;

export const CUSTOMER_SEGMENT_OPTIONS = [
  { value: 'all', label: 'All Segments' },
  { value: 'New', label: 'New' },
  { value: 'Regular', label: 'Regular' },
  { value: 'Premium', label: 'Premium' },
  { value: 'VIP', label: 'VIP' },
] as const;

export type { CustomerData };
