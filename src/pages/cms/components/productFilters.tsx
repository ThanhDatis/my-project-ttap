/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Paper,
  InputAdornment,
  Chip,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import React, { useState, useEffect } from 'react';

import { gray } from '../../../common/color';
import {
  default as useProductStore,
  type ProductFilters,
} from '../../../store/product.store';
import {
  PRODUCT_STATUS_OPTIONS,
  PRODUCT_CATEGORY_OPTIONS,
} from '../tableColumns/productsColumn';

interface ProductFiltersProps {
  onFiltersChange?: (filters: ProductFilters) => void;
}

export const ProductFiltersComponent: React.FC<ProductFiltersProps> = ({
  onFiltersChange,
}) => {
  const { filters, setFilters, clearFilters, isLoading } = useProductStore();

  const [localFilters, setLocalFilters] = useState<ProductFilters>(filters);
  const [searchDebounceTimer, setSearchDebounceTimer] =
    useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (searchDebounceTimer) {
      clearTimeout(searchDebounceTimer);
    }

    const timer = setTimeout(() => {
      if (localFilters.search !== filters.search) {
        setFilters({ search: localFilters.search });
        onFiltersChange?.(localFilters);
      }
    }, 500);

    setSearchDebounceTimer(timer);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [localFilters.search]);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setLocalFilters((prev) => ({ ...prev, search: value }));
  };

  const handleFilterChange = (key: keyof ProductFilters, value: any) => {
    const newFilters = { [key]: value };
    setLocalFilters((prev) => ({ ...prev, ...newFilters }));
    setFilters(newFilters);
    onFiltersChange?.({ ...localFilters, ...newFilters });
  };

  const handlePriceChange = (field: 'minPrice' | 'maxPrice', value: string) => {
    const numValue = value === '' ? undefined : Number(value);
    handleFilterChange(field, numValue);
  };

  const handleClearFilters = () => {
    clearFilters();
    onFiltersChange?.({});
  };

  const hasActiveFilters = () => {
    return (
      (filters.search && filters.search.length > 0) ||
      (filters.category && filters.category !== 'all') ||
      (filters.status && filters.status !== 'all') ||
      filters.minPrice !== undefined ||
      filters.maxPrice !== undefined
    );
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.search && filters.search.length > 0) count++;
    if (filters.category && filters.category !== 'all') count++;
    if (filters.status && filters.status !== 'all') count++;
    if (filters.minPrice !== undefined) count++;
    if (filters.maxPrice !== undefined) count++;
    return count;
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
        <FilterIcon color="action" />
        <Box sx={{ fontWeight: 500, fontSize: '1rem' }}>Filters</Box>
        {hasActiveFilters() && (
          <Chip
            label={`${getActiveFilterCount()} active`}
            size="small"
            color="primary"
            variant="outlined"
          />
        )}
        <Box sx={{ flex: 1 }} />
        {hasActiveFilters() && (
          <Button
            size="small"
            startIcon={<ClearIcon />}
            onClick={handleClearFilters}
            disabled={isLoading}
            sx={{ bgcolor: gray[200] }}
          >
            Clear All
          </Button>
        )}
      </Box>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search products, SKU..."
            value={localFilters.search || ''}
            onChange={handleSearchChange}
            disabled={isLoading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: localFilters.search && (
                <InputAdornment position="end">
                  <Button
                    size="small"
                    onClick={() =>
                      handleSearchChange({
                        target: { value: '' },
                      } as React.ChangeEvent<HTMLInputElement>)
                    }
                  >
                    <ClearIcon fontSize="small" />
                  </Button>
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <TextField
            select
            fullWidth
            size="small"
            label="Category"
            value={filters.category || 'all'}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            disabled={isLoading}
          >
            {PRODUCT_CATEGORY_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <TextField
            select
            fullWidth
            size="small"
            label="Status"
            value={filters.status || 'all'}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            disabled={isLoading}
          >
            {PRODUCT_STATUS_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid size={{ xs: 6, sm: 6, md: 2 }}>
          <TextField
            fullWidth
            size="small"
            type="number"
            label="Min Price"
            value={filters.minPrice || ''}
            onChange={(e) => handlePriceChange('minPrice', e.target.value)}
            disabled={isLoading}
            InputProps={{
              inputProps: { min: 0 },
              endAdornment: <InputAdornment position="end">₫</InputAdornment>,
            }}
          />
        </Grid>

        <Grid size={{ xs: 6, sm: 6, md: 2 }}>
          <TextField
            fullWidth
            size="small"
            type="number"
            label="Max Price"
            value={filters.maxPrice || ''}
            onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
            disabled={isLoading}
            InputProps={{
              inputProps: { min: 0 },
              endAdornment: <InputAdornment position="end">₫</InputAdornment>,
            }}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ProductFiltersComponent;
