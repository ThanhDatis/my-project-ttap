/* eslint-disable no-unused-vars */
import {
  MoreVert as MoreVertIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';
import { Chip, IconButton, Box, Typography } from '@mui/material';
import { type GridColDef } from '@mui/x-data-grid';
import React from 'react';

import { brand } from '../../../common/color';
import { type Product } from '../../../lib/product.repo';
import { formatNumber, formatDateTime } from '../../../utils';

interface ProductData {
  id: number | string;
  name: string;
  description: string;
  price: number;
  stock: number;
  sku?: string;
  category: string;
  status?: 'active' | 'inactive' | 'out_of_stock';
  images?: string[];
  createdAt?: string;
  updatedAt?: string;
  createdBy?: {
    _id: string;
    name: string;
    email: string;
  };
}

export const getProductColumns = ({
  onMenuClick,
}: {
  onMenuClick: (
    event: React.MouseEvent<HTMLElement>,
    productId: string,
  ) => void;
}): GridColDef[] => [
  // {
  //   field: 'images',
  //   headerName: 'Image',
  //   width: 80,
  //   sortable: false,
  //   filterable: false,
  //   renderCell: (params) => (
  //     <Avatar
  //       src={params.value?.[0]}
  //       sx={{ width: 36, height: 36, borderRadius: 2 }}
  //       variant="rounded"
  //     >
  //       {params.row.name?.charAt(0)?.toUpperCase() || 'P'}
  //     </Avatar>
  //   ),
  // },
  {
    field: 'name',
    headerName: 'Product Name',
    type: 'string',
    flex: 1,
    minWidth: 200,
    headerAlign: 'center',
    renderCell: (params) => {
      const productName = params.value || params.row.name || 'Unnamed Product';
      const productSku = params.row?.sku;
      return (
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
          }}
        >
          <CategoryIcon sx={{ width: 18, height: 18, color: brand[550] }} />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Typography variant="body2"> {productName} </Typography>
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
              }}
            >
              SKU: {productSku}
            </Typography>
          </Box>
        </Box>
      );
    },
  },
  {
    field: 'category',
    headerName: 'Category',
    type: 'string',
    minWidth: 150,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => (
      <Chip
        label={params.value || 'Uncategorized'}
        size="small"
        variant="outlined"
        sx={{ textTransform: 'capitalize' }}
      />
    ),
  },
  {
    field: 'price',
    headerName: 'Price',
    type: 'number',
    minWidth: 150,
    align: 'center',
    headerAlign: 'center',
    valueFormatter: (params) => {
      if (params == null) return '-';
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(params);
    },
  },
  {
    field: 'stock',
    headerName: 'Stock',
    type: 'number',
    width: 120,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => {
      const stock = params.value || 0;
      const color = stock > 10 ? 'success' : stock > 0 ? 'warning' : 'error';

      return (
        <Chip
          label={formatNumber(stock)}
          size="small"
          color={color}
          variant={stock === 0 ? 'filled' : 'outlined'}
        />
      );
    },
  },
  {
    field: 'createdBy',
    headerName: 'Created by',
    type: 'string',
    flex: 1,
    minWidth: 150,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => {
      const createdBy = params.value || params.row?.createdBy;
      const name = createdBy?.name || 'Unknown';
      const email = createdBy?.email || 'Unknown';
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            py: 0.5,
          }}
        >
          <Typography variant="body2"> {name} </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {email}
          </Typography>
        </Box>
      );
    },
  },
  {
    field: 'createdAt',
    headerName: 'Created',
    type: 'string',
    flex: 1,
    minWidth: 100,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => {
      return formatDateTime(params.value);
    },
  },
  {
    field: 'action',
    headerName: 'Action',
    type: 'actions',
    minWidth: 100,
    maxWidth: 100,
    sortable: false,
    // filterable: false,
    renderCell: (params) => {
      const product = params.row as Product;

      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            size="small"
            onClick={(e) => onMenuClick(e, product.id.toString())}
            sx={{
              color: 'text.secondary',
            }}
            title="More options"
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Box>
      );
    },
  },
];

export const PRODUCT_STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'out_of_stock', label: 'Out of Stock' },
] as const;

export const PRODUCT_CATEGORY_OPTIONS = [
  { value: 'all', label: 'All Categories' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'food', label: 'Food & Beverages' },
  { value: 'books', label: 'Books' },
  { value: 'home', label: 'Home & Garden' },
  { value: 'sports', label: 'Sports & Outdoors' },
  { value: 'toys', label: 'Toys & Games' },
  { value: 'beauty', label: 'Beauty & Health' },
] as const;

export type { ProductData };
