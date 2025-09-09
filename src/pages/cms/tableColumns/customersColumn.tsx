/* eslint-disable no-unused-vars */
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
// import StarRoundedIcon from '@mui/icons-material/StarRounded';
import { Chip, IconButton, Box, Typography } from '@mui/material';
import { type GridColDef } from '@mui/x-data-grid';
import React from 'react';

// import { brand } from '../../../common/color';
import { type Customer } from '../../../lib/customer.repo';
import { formatDateTime } from '../../../utils';

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
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => {
      const createdBy = params.row as Customer;
      const customerName = createdBy?.name || 'Unnamed Customer';
      const customerEmail = createdBy?.email || 'Unknown Email';

      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            py: 0.5,
          }}
        >
          <Typography variant="body2">{customerName}</Typography>
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
    field: 'phone',
    headerName: 'Contact',
    type: 'string',
    flex: 1,
    minWidth: 120,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => {
      const phone = params.value;
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            py: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            {phone}
          </Typography>
        </Box>
      );
    },
  },
  {
    field: 'address',
    headerName: 'Address',
    type: 'string',
    flex: 1,
    minWidth: 250,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => {
      const customer = params.row as Customer;
      const addressParts = [
        customer.address,
        customer.ward,
        customer.district,
        customer.city,
      ].filter(Boolean);

      const fullAddress =
        addressParts.length > 0
          ? addressParts.join(', ')
          : 'No address provided';

      return (
        <Box sx={{ py: 1 }}>
          <Typography
            variant="body2"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '100%',
              color:
                addressParts.length > 0 ? 'text.primary' : 'text.secondary',
              fontStyle: addressParts.length > 0 ? 'normal' : 'italic',
            }}
            title={fullAddress}
          >
            {fullAddress}
          </Typography>
          {addressParts.length > 0 && (
            <Typography variant="caption" color="text.secondary">
              {customer.city && `${customer.city}`}
            </Typography>
          )}
        </Box>
      );
    },
  },
  {
    field: 'city',
    headerName: 'City/Province',
    type: 'string',
    width: 140,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => {
      const city = params.value;
      return (
        <Typography
          variant="body2"
          sx={{
            color: city ? 'text.primary' : 'text.secondary',
            fontStyle: city ? 'normal' : 'italic',
          }}
        >
          {city || 'No city'}
        </Typography>
      );
    },
  },
  {
    field: 'district',
    headerName: 'District',
    type: 'string',
    width: 120,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => {
      const district = params.value;
      return (
        <Typography
          variant="body2"
          sx={{
            color: district ? 'text.primary' : 'text.secondary',
            fontStyle: district ? 'normal' : 'italic',
          }}
        >
          {district || 'No district'}
        </Typography>
      );
    },
  },
  {
    field: 'ward',
    headerName: 'Ward',
    type: 'string',
    width: 120,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => {
      const ward = params.value;
      return (
        <Typography
          variant="body2"
          sx={{
            color: ward ? 'text.primary' : 'text.secondary',
            fontStyle: ward ? 'normal' : 'italic',
          }}
        >
          {ward || 'No ward'}
        </Typography>
      );
    },
  },
  // {
  //   field: 'tier',
  //   headerName: 'Tier',
  //   type: 'string',
  //   width: 120,
  //   align: 'center',
  //   headerAlign: 'center',
  //   renderCell: (params) => {
  //     const tier = params.value as Tier;
  //     const isVip = tier === 'vip';

  //     return (
  //       <Chip
  //         label={isVip ? 'VIP' : 'Normal'}
  //         size="small"
  //         color={isVip ? 'warning' : 'default'}
  //         icon={isVip ? <StarRoundedIcon sx={{ fontSize: 16 }} /> : undefined}
  //         variant={isVip ? 'filled' : 'outlined'}
  //         sx={{
  //           fontWeight: isVip ? 600 : 400,
  //           ...(isVip && {
  //             '& .MuiChip-icon': {
  //               color: 'warning.contrastText',
  //             },
  //           }),
  //         }}
  //       />
  //     );
  //   },
  // },
  // {
  //   field: 'totalOrders',
  //   headerName: 'Orders',
  //   type: 'number',
  //   width: 100,
  //   align: 'center',
  //   headerAlign: 'center',
  //   renderCell: (params) => {
  //     const totalOrders = params.value || 0;
  //     const color = totalOrders > 0 ? 'primary' : 'default';
  //     return (
  //       <Chip
  //         label={formatNumber(totalOrders)}
  //         size="small"
  //         color={color}
  //         variant={totalOrders === 0 ? 'filled' : 'outlined'}
  //       />
  //     );
  //   },
  // },
  // {
  //   field: 'lifetimeValue',
  //   headerName: 'Lifetime Value',
  //   type: 'number',
  //   flex: 1,
  //   minWidth: 150,
  //   align: 'center',
  //   headerAlign: 'center',
  //   valueFormatter: (params) => {
  //     if (params == null) return '-';
  //     return new Intl.NumberFormat('vi-VN', {
  //       style: 'currency',
  //       currency: 'VND',
  //     }).format(params);
  //   },
  // },
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

// export const TIER_OPTIONS = [
//   { value: 'all', label: 'All Tiers' },
//   { value: 'vip', label: 'VIP Customers' },
//   { value: 'normal', label: 'Normal Customers' },
// ] as const;

export const SORT_OPTIONS = [
  { value: 'createdAt:desc', label: 'Newest First' },
  { value: 'createdAt:asc', label: 'Oldest First' },
  { value: 'name:asc', label: 'Name (A-Z)' },
  { value: 'name:desc', label: 'Name (Z-A)' },
  // { value: 'lifetimeValue:desc', label: 'Highest Value' },
  // { value: 'lifetimeValue:asc', label: 'Lowest Value' },
  // { value: 'totalOrders:desc', label: 'Most Orders' },
  // { value: 'totalOrders:asc', label: 'Least Orders' },
] as const;
