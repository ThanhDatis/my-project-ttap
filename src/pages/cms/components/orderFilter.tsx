/* eslint-disable no-unused-vars */
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import {
  Box,
  TextField,
  MenuItem,
  InputAdornment,
  Chip,
  Paper,
  Button,
  Grid,
} from '@mui/material';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import type { OrderStatus, PaymentMethod } from '../../../lib/order.repo';
import {
  ORDER_STATUS_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
  ORDER_SORT_OPTIONS,
} from '../tableColumns/ordersColumn';


const DEFAULT_SORT = 'createdAt:desc';

interface OrderFiltersProps {
  search: string;
  status: 'all' | OrderStatus;
  paymentMethod: 'all' | PaymentMethod;
  sort: string;
  totalCount?: number;
  onSearchChange: (search: string) => void;
  onStatusChange: (status: 'all' | OrderStatus) => void;
  onPaymentMethodChange: (paymentMethod: 'all' | PaymentMethod) => void;
  onSortChange: (sort: string) => void;
}

const OrderFilters: React.FC<OrderFiltersProps> = ({
  search = '',
  status = 'all',
  paymentMethod = 'all',
  sort,
  totalCount = 0,
  onSearchChange,
  onStatusChange,
  onPaymentMethodChange,
  onSortChange,
}) => {
  const [localSearch, setLocalSearch] = useState(search);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      if (localSearch !== search) {
        onSearchChange(localSearch);
      }
    }, 350);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [localSearch, onSearchChange, search]);

  const hasActiveFilters = useMemo(
    () =>
      Boolean(search) ||
      status !== 'all' ||
      paymentMethod !== 'all' ||
      (sort && sort !== DEFAULT_SORT),
    [search, status, paymentMethod, sort],
  );

  const activeFilterCount = useMemo(() => {
    let c = 0;
    if (search) c += 1;
    if (status !== 'all') c += 1;
    if (paymentMethod !== 'all') c += 1;
    if (sort && sort !== DEFAULT_SORT) c += 1;
    return c;
  }, [search, status, paymentMethod, sort]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(event.target.value);
  };

  const handleClearSearch = () => {
    onSearchChange('');
    setLocalSearch('');
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onStatusChange(event.target.value as 'all' | OrderStatus);
  };

  const handlePaymentMethodChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    onPaymentMethodChange(event.target.value as 'all' | PaymentMethod);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSortChange(event.target.value);
  };

  const clearAll = () => {
    setLocalSearch('');
    onSearchChange('');
    onStatusChange('all');
    onPaymentMethodChange('all');
    onSortChange(DEFAULT_SORT);
  };

  return (
    <Paper sx={{ p: 2, m: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
        <FilterListRoundedIcon color="action" />
        <Box sx={{ fontWeight: 500, fontSize: 16 }}>Filter</Box>

        {hasActiveFilters && (
          <Chip
            label={`${activeFilterCount} active`}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ ml: 1 }}
          />
        )}
        <Chip
          label={`${totalCount} result${totalCount !== 1 ? 's' : ''}`}
          size="small"
          color="default"
          variant="outlined"
          sx={{ ml: 1 }}
        />
        <Box sx={{ flex: 1 }} />

        {hasActiveFilters && (
          <Button
            size="small"
            startIcon={<ClearRoundedIcon />}
            onClick={clearAll}
          >
            Clear Filters
          </Button>
        )}
      </Box>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search orders, customers, order ID..."
            value={localSearch}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon sx={{ color: 'action' }} />
                </InputAdornment>
              ),
              endAdornment: localSearch && (
                <InputAdornment position="end">
                  <Button size="small" onClick={handleClearSearch}>
                    <ClearRoundedIcon sx={{ color: 'action' }} />
                  </Button>
                </InputAdornment>
              ),
            }}
            inputProps={{ 'aria-label': 'search orders' }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 2 }}>
          <TextField
            select
            fullWidth
            size="small"
            label="Filter by Status"
            value={status}
            onChange={handleStatusChange}
            inputProps={{ 'aria-label': 'Filter by status' }}
          >
            {ORDER_STATUS_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            select
            fullWidth
            size="small"
            label="Filter by Payment"
            value={paymentMethod}
            onChange={handlePaymentMethodChange}
            inputProps={{ 'aria-label': 'Filter by payment method' }}
          >
            {PAYMENT_METHOD_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            select
            fullWidth
            size="small"
            label="Sort by"
            value={sort}
            onChange={handleSortChange}
            inputProps={{ 'aria-label': 'Sort Orders' }}
          >
            {ORDER_SORT_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          mt: 1,
          flexWrap: 'wrap',
        }}
      >
        {search && (
          <Chip
            label={`Search: "${localSearch}"`}
            size="small"
            onDelete={handleClearSearch}
            color="default"
          />
        )}

        {status && status !== 'all' && (
          <Chip
            label={`Status: ${String(status).charAt(0).toUpperCase() + String(status).slice(1)}`}
            size="small"
            onDelete={() => onStatusChange('all')}
            color="default"
          />
        )}

        {paymentMethod && paymentMethod !== 'all' && (
          <Chip
            label={`Payment: ${String(paymentMethod)
              .split('_')
              .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
              .join(' ')}`}
            size="small"
            onDelete={() => onPaymentMethodChange('all')}
            color="default"
          />
        )}

        {sort && sort !== DEFAULT_SORT && (
          <Chip
            label={`Sort: ${
              ORDER_SORT_OPTIONS.find((option) => option.value === sort)
                ?.label || sort
            }`}
            size="small"
            onDelete={() => onSortChange(DEFAULT_SORT)}
            color="default"
          />
        )}
      </Box>
    </Paper>
  );
};

export default OrderFilters;
