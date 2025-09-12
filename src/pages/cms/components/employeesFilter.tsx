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

import type { Role, EmployeeStatus } from '../../../lib/employee.repo';
import {
  ROLE_OPTIONS,
  STATUS_OPTIONS,
  EMPLOYEE_SORT_OPTIONS,
} from '../tableColumns/employeesColumn';

const DEFAULT_SORT = 'createdAt:desc';

interface EmployeeFiltersProps {
  search: string;
  role: 'all' | Role;
  status: 'all' | EmployeeStatus;
  sort: string;
  totalCount?: number;
  onSearchChange: (search: string) => void;
  onRoleChange: (role: 'all' | Role) => void;
  onStatusChange: (status: 'all' | EmployeeStatus) => void;
  onSortChange: (sort: string) => void;
}

const EmployeeFilters: React.FC<EmployeeFiltersProps> = ({
  search,
  role,
  status,
  sort,
  totalCount = 0,
  onSearchChange,
  onRoleChange,
  onStatusChange,
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
      role !== 'all' ||
      status !== 'all' ||
      (sort && sort !== DEFAULT_SORT),
    [search, role, status, sort],
  );

  const activeFilterCount = useMemo(() => {
    let c = 0;
    if (search) c += 1;
    if (role !== 'all') c += 1;
    if (status !== 'all') c += 1;
    if (sort && sort !== DEFAULT_SORT) c += 1;
    return c;
  }, [search, role, status, sort]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(event.target.value);
  };

  const handleClearSearch = () => {
    onSearchChange('');
    setLocalSearch('');
  };

  const handleRoleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onRoleChange(event.target.value as 'all' | Role);
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onStatusChange(event.target.value as 'all' | EmployeeStatus);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSortChange(event.target.value);
  };

  const clearAll = () => {
    setLocalSearch('');
    onSearchChange('');
    onRoleChange('all');
    onStatusChange('all');
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
        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search employees by name, email, or phone..."
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
            inputProps={{ 'aria-label': 'search employees' }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            select
            fullWidth
            size="small"
            label="Filter by Role"
            value={role}
            onChange={handleRoleChange}
            inputProps={{ 'aria-label': 'Filter by role' }}
          >
            {ROLE_OPTIONS.map((option) => (
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
            label="Filter by Status"
            value={status}
            onChange={handleStatusChange}
            inputProps={{ 'aria-label': 'Filter by status' }}
          >
            {STATUS_OPTIONS.map((option) => (
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
            inputProps={{ 'aria-label': 'Sort Employees' }}
          >
            {EMPLOYEE_SORT_OPTIONS.map((option) => (
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

        {role !== 'all' && (
          <Chip
            label={`Role: ${role.charAt(0).toUpperCase() + role.slice(1)}`}
            size="small"
            onDelete={() => onRoleChange('all')}
            color="default"
          />
        )}

        {status !== 'all' && (
          <Chip
            label={`Status: ${status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}`}
            size="small"
            onDelete={() => onStatusChange('all')}
            color="default"
          />
        )}

        {sort && sort !== DEFAULT_SORT && (
          <Chip
            label={`Sort: ${
              EMPLOYEE_SORT_OPTIONS.find((option) => option.value === sort)
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

export default EmployeeFilters;
