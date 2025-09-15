// import FilterListIcon from '@mui/icons-material/FilterList';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import {
  Box,
  TextField,
  MenuItem,
  InputAdornment,
  Button,
  Grid,
  Paper,
} from '@mui/material';
import React, { useState } from 'react';

interface OrderFilterProps {
  onFilterChange: (filters: OrderFilters) => void;
}

export interface OrderFilters {
  search: string;
  status: string;
  paymentMethod: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  dateFrom?: string;
  dateTo?: string;
}

const OrderFilter: React.FC<OrderFilterProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<OrderFilters>({
    search: '',
    status: 'all',
    paymentMethod: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const orderStatuses = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  const paymentMethods = [
    { value: 'all', label: 'All Payment Methods' },
    { value: 'cash', label: 'Cash' },
    { value: 'credit_card', label: 'Credit Card' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'e_wallet', label: 'E-Wallet' },
  ];

  const sortOptions = [
    { value: 'createdAt:desc', label: 'Newest First' },
    { value: 'createdAt:asc', label: 'Oldest First' },
    { value: 'total:desc', label: 'Highest Total' },
    { value: 'total:asc', label: 'Lowest Total' },
    { value: 'customerName:asc', label: 'Customer A-Z' },
    { value: 'customerName:desc', label: 'Customer Z-A' },
  ];

  const handleFilterChange = (field: keyof OrderFilters, value: any) => {
    const newFilters = { ...filters, [field]: value };

    // Handle sort field
    if (field === 'sortBy') {
      const [sortField, sortDirection] = value.split(':');
      newFilters.sortBy = sortField;
      newFilters.sortOrder = sortDirection as 'asc' | 'desc';
    }

    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    const defaultFilters: OrderFilters = {
      search: '',
      status: 'all',
      paymentMethod: 'all',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <Paper sx={{ p: 2, m: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
        <FilterListRoundedIcon color="action" />
        <Box sx={{ fontWeight: 500, fontSize: 16 }}>Filter</Box>
      </Box>
      {/* {hasActiveFilters && (
        <Chip
          label={`${getActiveFilterCount} active`}
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
      )} */}
      <Grid container spacing={2} alignItems="center">
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search orders, customers..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 2 }}>
          <TextField
            select
            fullWidth
            size="small"
            label="Status"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FilterListRoundedIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            }}
          >
            {orderStatuses.map((status) => (
              <MenuItem key={status.value} value={status.value}>
                {status.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Payment Method Filter */}
        <Grid size={{ xs: 12, md: 2 }}>
          <TextField
            select
            fullWidth
            size="small"
            label="Payment"
            value={filters.paymentMethod}
            onChange={(e) =>
              handleFilterChange('paymentMethod', e.target.value)
            }
          >
            {paymentMethods.map((method) => (
              <MenuItem key={method.value} value={method.value}>
                {method.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Sort */}
        <Grid size={{ xs: 12, md: 2 }}>
          <TextField
            select
            fullWidth
            size="small"
            label="Sort by"
            value={`${filters.sortBy}:${filters.sortOrder}`}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SortIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            }}
          >
            {sortOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Clear Filters */}
        <Grid size={{ xs: 12, md: 2 }}>
          <Button
            variant="outlined"
            fullWidth
            onClick={handleClearFilters}
            sx={{ height: '40px' }}
          >
            Clear
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default OrderFilter;
