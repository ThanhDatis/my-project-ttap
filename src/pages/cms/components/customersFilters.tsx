/* eslint-disable no-unused-vars */
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  TextField,
  MenuItem,
  InputAdornment,
  Stack,
  Chip,
  Typography,
} from '@mui/material';
import React from 'react';

import type { Tier } from '../../../lib/customer.repo';
import { TIER_OPTIONS, SORT_OPTIONS } from '../tableColumns/customersColumn';

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
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value);
  };

  const handleTierChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onTierChange(event.target.value as 'all' | Tier);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSortChange(event.target.value);
  };

  const activeFiltersCount = [
    search && 'search',
    tier !== 'all' && 'tier',
  ].filter(Boolean).length;

  return (
    <Box sx={{ mb: 3 }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ mb: 2 }}
        alignItems={{ xs: 'stretch', sm: 'center' }}
      >
        <TextField
          value={search}
          onChange={handleSearchChange}
          placeholder="Search customers by name, email, or phone..."
          size="small"
          sx={{
            flex: 1,
            maxWidth: { xs: '100%', sm: 400 },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon
                  sx={{ color: 'text.secondary', width: 20, height: 20 }}
                />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          select
          value={tier}
          onChange={handleTierChange}
          size="small"
          sx={{ minWidth: 120 }}
          label="Tier"
        >
          {TIER_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          value={sort}
          onChange={handleSortChange}
          size="small"
          sx={{ minWidth: 160 }}
          label="Sort by"
        >
          {SORT_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        sx={{ flexWrap: 'wrap', gap: 1 }}
      >
        <Typography variant="body2" color="text.secondary">
          {totalCount} customer{totalCount !== 1 ? 's' : ''} found
        </Typography>

        {activeFiltersCount > 0 && (
          <>
            <Typography variant="body2" color="text.secondary">
              •
            </Typography>
            <Chip
              label={`${activeFiltersCount} filter${activeFiltersCount > 1 ? 's' : ''} active`}
              size="small"
              variant="outlined"
              color="primary"
            />
          </>
        )}

        {search && (
          <Chip
            label={`Search: "${search}"`}
            size="small"
            onDelete={() => onSearchChange('')}
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
      </Stack>
    </Box>
  );
};

export default CustomerFilters;
