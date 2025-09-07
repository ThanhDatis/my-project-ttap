/* eslint-disable no-unused-vars */
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import { Chip, IconButton, Box, Typography } from '@mui/material';
import { type GridColDef } from '@mui/x-data-grid';
import React from 'react';

import { brand } from '../../../common/color';
import { type Customer, type Tier } from '../../../lib/customer.repo';
import { formatNumber, formatDateTime } from '../../../utils';

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
    headerName: 'Customer',
    type: 'string',
    flex: 1,
    minWidth: 200,
    headerAlign: 'center',
    renderCell: (params) => {
      const customer = params.row as Customer;
      const customerName = customer.name || 'Unnamed Customer';
      const customerEmail = customer.email;

      // const getInitials = (name: string) => {
      //   return name
      //     .split(' ')
      //     .map((word) => word.charAt(0))
      //     .join('')
      //     .toUpperCase()
      //     .slice(0, 2);
      // };

      return (
        <Box
          sx={{
            height: '100%',
            // display: 'flex',
            // alignItems: 'center',
            // gap: 1.5,
          }}
        >
          {/* <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor:
                customer.tier === 'vip' ? 'warning.light' : 'primary.light',
              fontSize: '0.875rem',
            }}
          >
            {getInitials(customerName)}
          </Avatar> */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Typography variant="body2">{customerName}</Typography>
            {customerEmail && (
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                }}
              >
                {customerEmail}
              </Typography>
            )}
          </Box>
        </Box>
      );
    },
  },
  {
    field: 'phone',
    headerName: 'Contact',
    type: 'string',
    flex: 1,
    minWidth: 120,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => {
      const customer = params.row as Customer;
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {customer.phone ? (
            <Typography
              variant="body2"
              sx={{
                display: 'flex',
                // alignItems: 'center',
                gap: 0.5,
              }}
            >
              {customer.phone}
            </Typography>
          ) : (
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary', fontStyle: 'italic' }}
            >
              No phone
            </Typography>
          )}
        </Box>
      );
    },
  },
  {
    field: 'tier',
    headerName: 'Tier',
    type: 'string',
    width: 120,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => {
      const tier = params.value as Tier;
      const isVip = tier === 'vip';

      return (
        <Chip
          label={isVip ? 'VIP' : 'Normal'}
          size="small"
          color={isVip ? 'warning' : 'default'}
          icon={isVip ? <StarRoundedIcon sx={{ fontSize: 16 }} /> : undefined}
          variant={isVip ? 'filled' : 'outlined'}
          sx={{
            fontWeight: isVip ? 600 : 400,
            ...(isVip && {
              '& .MuiChip-icon': {
                color: 'warning.contrastText',
              },
            }),
          }}
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
      const totalOrders = params.value || 0;
      const color = totalOrders > 0 ? 'primary' : 'default';
      return (
        <Chip
          label={formatNumber(totalOrders)}
          size="small"
          color={color}
          variant={totalOrders === 0 ? 'filled' : 'outlined'}
        />
      );
    },
  },
  {
    field: 'lifetimeValue',
    headerName: 'Lifetime Value',
    type: 'number',
    flex: 1,
    minWidth: 150,
    align: 'center',
    headerAlign: 'center',
    valueFormatter: ({ value }) => {
      if (value == null) return '-';
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        notation: 'compact',
        compactDisplay: 'short',
      }).format(value);
    },
    renderCell: (params) => {
      const value = params.value || 0;
      const color =
        value > 10000000 ? 'success' : value > 1000000 ? 'warning' : 'default';

      return (
        <Typography
          variant="body2"
          sx={{
            color:
              color === 'success'
                ? 'success.main'
                : color === 'warning'
                  ? 'warning.main'
                  : 'text.primary',
          }}
        >
          {new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            notation: 'compact',
            compactDisplay: 'short',
          }).format(value)}
        </Typography>
      );
    },
  },
  {
    field: 'address',
    headerName: 'Address',
    type: 'string',
    flex: 1,
    minWidth: 200,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => {
      const address = params.value;

      return (
        <Box
          sx={{
            py: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              overflow: 'hidden',
              // textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '100%',
              color: address ? 'text.primary' : 'text.secondary',
              fontStyle: address ? 'normal' : 'italic',
            }}
            title={address || 'No address provided'}
          >
            {address || 'No address'}
          </Typography>
        </Box>
      );
    },
  },
  {
    field: 'isActive',
    headerName: 'Status',
    type: 'boolean',
    width: 100,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => {
      const isActive = params.value;

      return (
        <Chip
          label={isActive ? 'Active' : 'Inactive'}
          size="small"
          color={isActive ? 'success' : 'default'}
          variant={isActive ? 'filled' : 'outlined'}
        />
      );
    },
  },
  {
    field: 'createdAt',
    headerName: 'Created',
    type: 'string',
    flex: 1,
    minWidth: 160,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => {
      return (
        <Typography variant="caption" color="text.primary">
          {formatDateTime(params.value)}
        </Typography>
      );
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
      const customer = params.row as Customer;

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
            onClick={(e) => onMenuClick(e, customer.id.toString())}
            sx={{
              color: 'text.secondary',
              '&:hover': {
                color: brand[500],
                // backgroundColor: 'action.hover',
              },
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

export const TIER_OPTIONS = [
  { value: 'all', label: 'All Tiers' },
  { value: 'vip', label: 'VIP Customers' },
  { value: 'normal', label: 'Normal Customers' },
] as const;

export const SORT_OPTIONS = [
  { value: 'createdAt:desc', label: 'Newest First' },
  { value: 'createdAt:asc', label: 'Oldest First' },
  { value: 'name:asc', label: 'Name (A-Z)' },
  { value: 'name:desc', label: 'Name (Z-A)' },
  { value: 'lifetimeValue:desc', label: 'Highest Value' },
  { value: 'lifetimeValue:asc', label: 'Lowest Value' },
  { value: 'totalOrders:desc', label: 'Most Orders' },
  { value: 'totalOrders:asc', label: 'Least Orders' },
] as const;
