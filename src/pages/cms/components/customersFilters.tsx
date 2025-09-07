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

import type { Tier } from '../../../lib/customer.repo';
import { TIER_OPTIONS, SORT_OPTIONS } from '../tableColumns/customersColumn';

const DEFAULT_SORT = 'createdAt:desc';
interface CustomerFiltersProps {
  search: string;
  tier: 'all' | Tier;
  sort: string;
  totalCount?: number;
  onSearchChange: (search: string) => void;
  onTierChange: (tier: 'all' | Tier) => void;
  onSortChange: (sort: string) => void;
}

const CustomerFilters: React.FC<CustomerFiltersProps> = ({
  search,
  tier,
  sort,
  totalCount = 0,
  onSearchChange,
  onTierChange,
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
    () => Boolean(search) || tier !== 'all' || (sort && sort !== DEFAULT_SORT),
    [search, tier, sort],
  );

  const getActiveFilterCount = useMemo(() => {
    let c = 0;
    if (search) c += 1;
    if (tier !== 'all') c += 1;
    if (sort && sort !== DEFAULT_SORT) c += 1;
    return c;
  }, [search, tier, sort]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value);
  };

  const handleClearSearch = () => {
    onSearchChange('');
    setLocalSearch('');
  };

  const handleTierChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onTierChange(event.target.value as 'all' | Tier);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSortChange(event.target.value);
  };

  const clearAll = () => {
    setLocalSearch('');
    onSearchChange('');
    onTierChange('all');
    onSortChange(DEFAULT_SORT);
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
        <FilterListRoundedIcon color="action" />
        <Box sx={{ fontWeight: 500, fontSize: 16 }}>Filter</Box>

        {hasActiveFilters && (
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
        )}
      </Box>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search customers by name, email, or phone..."
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
            inputProps={{ 'aria-label': 'search customers' }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            select
            fullWidth
            size="small"
            label="Filter by Tier"
            value={tier}
            onChange={handleTierChange}
            inputProps={{ 'aria-label': 'Filter by tier' }}
          >
            {TIER_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            select
            fullWidth
            size="small"
            label="Sort by"
            value={sort}
            onChange={handleSortChange}
            inputProps={{ 'aria-label': 'Sort Customers' }}
          >
            {SORT_OPTIONS.map((option) => (
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

        {tier !== 'all' && (
          <Chip
            label={`Tier: ${tier.charAt(0).toUpperCase() + tier.slice(1)}`}
            size="small"
            onDelete={() => onTierChange('all')}
            color="default"
          />
        )}

        {sort && sort !== DEFAULT_SORT && (
          <Chip
            label={`Sort: ${
              SORT_OPTIONS.find((option) => option.value === sort)?.label ||
              sort
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

export default CustomerFilters;
