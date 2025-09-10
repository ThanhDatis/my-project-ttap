/* eslint-disable no-unused-vars */
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import { Chip, IconButton, Box, Typography } from '@mui/material';
import { type GridColDef } from '@mui/x-data-grid';
import React from 'react';

// import { brand } from '../../../common/color';
import { type Customer } from '../../../lib/customer.repo';
import { formatDateTime, formatPhoneGrid } from '../../../utils';

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
      const phone = formatPhoneGrid(params.value);
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
    minWidth: 150,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => {
      const customer = params.row as Customer;
      const addressParts = [
        customer.address,
        // customer.ward,
        // customer.district,
        // customer.city,
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
              py: 1,
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
    minWidth: 180,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => {
      const city = params.value;
      return (
        <Typography
          variant="body2"
          sx={{
            py: 2,
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
    minWidth: 120,
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
            py: 2,
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
    minWidth: 120,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => {
      const ward = params.value;
      return (
        <Typography
          variant="body2"
          sx={{
            py: 2,
            color: ward ? 'text.primary' : 'text.secondary',
            fontStyle: ward ? 'normal' : 'italic',
          }}
        >
          {ward || 'No ward'}
        </Typography>
      );
    },
  },
  {
    field: 'isActive',
    headerName: 'Status',
    type: 'boolean',
    minWidth: 100,
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

export const SORT_OPTIONS = [
  { value: 'createdAt:desc', label: 'Newest First' },
  { value: 'createdAt:asc', label: 'Oldest First' },
  { value: 'name:asc', label: 'Name (A-Z)' },
  { value: 'name:desc', label: 'Name (Z-A)' },
] as const;
