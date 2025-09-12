/* eslint-disable no-unused-vars */
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import ManageAccountsRoundedIcon from '@mui/icons-material/ManageAccountsRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import { Box, Chip, IconButton, Typography } from '@mui/material';
import { type GridColDef } from '@mui/x-data-grid';

import type {
  Employee,
  EmployeeStatus,
  Role,
} from '../../../lib/employee.repo';
import { formatDateTime } from '../../../utils';

export const getEmployeeColumns = ({
  onMenuClick,
}: {
  onMenuClick: (
    event: React.MouseEvent<HTMLElement>,
    employeeId: string,
  ) => void;
}): GridColDef[] => [
  {
    field: 'name',
    headerName: 'Employee',
    type: 'string',
    flex: 1,
    minWidth: 200,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => {
      const employee = params.row as Employee;
      const employeeName = employee?.name || 'Unnamed Employee';
      const employeeEmail = employee?.email || 'No email';

      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            py: 0.5,
          }}
        >
          <Typography variant="body2">{employeeName}</Typography>
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
            }}
          >
            {employeeEmail}
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
    minWidth: 100,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => {
      const employee = params.row as Employee;
      return (
        <Typography
          variant="body2"
          sx={{
            display: 'flex',
            justifyContent: 'center',
            py: 2,
          }}
        >
          {employee.phone || 'No phone'}
        </Typography>
      );
    },
  },
  {
    field: 'role',
    headerName: 'Role',
    type: 'string',
    minWidth: 120,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => {
      const role = params.value as Role;

      const getRoleConfig = (role: Role) => {
        switch (role) {
          case 'admin':
            return {
              label: 'Admin',
              color: 'error' as const,
              icon: <AdminPanelSettingsRoundedIcon sx={{ fontSize: 16 }} />,
            };
          case 'manager':
            return {
              label: 'Manager',
              color: 'warning' as const,
              icon: <ManageAccountsRoundedIcon sx={{ fontSize: 16 }} />,
            };
          case 'staff':
            return {
              label: 'Staff',
              color: 'primary' as const,
              icon: <PersonRoundedIcon sx={{ fontSize: 16 }} />,
            };
          default:
            return {
              label: 'Unknown',
              color: 'default' as const,
              icon: <PersonRoundedIcon sx={{ fontSize: 16 }} />,
            };
        }
      };

      const config = getRoleConfig(role);

      return (
        <Chip
          label={config.label}
          size="small"
          color={config.color}
          icon={config.icon}
          variant="filled"
          sx={{
            fontWeight: 600,
            '& .MuiChip-icon': {
              color: 'inherit',
            },
          }}
        />
      );
    },
  },
  {
    field: 'status',
    headerName: 'Status',
    type: 'string',
    minWidth: 120,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => {
      const status = params.value as EmployeeStatus;

      const getStatusConfig = (status: EmployeeStatus) => {
        switch (status) {
          case 'active':
            return { label: 'Active', color: 'success' as const };
          case 'inactive':
            return { label: 'Inactive', color: 'default' as const };
          case 'suspended':
            return { label: 'Suspended', color: 'warning' as const };
          default:
            return { label: 'Unknown', color: 'default' as const };
        }
      };

      const config = getStatusConfig(status);

      return (
        <Chip
          label={config.label}
          size="small"
          color={config.color}
          variant={status === 'active' ? 'filled' : 'outlined'}
        />
      );
    },
  },
  {
    field: 'dateOfBirth',
    headerName: 'Date of Birth',
    type: 'string',
    flex: 1,
    minWidth: 100,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => {
      const dateOfBirth = params.value;
      return (
        <Typography
          variant="body2"
          sx={{
            color: dateOfBirth ? 'text.primary' : 'text.secondary',
            fontStyle: dateOfBirth ? 'normal' : 'italic',
            py: 2,
          }}
        >
          {dateOfBirth ? formatDateTime(dateOfBirth).split(' ')[0] : 'No date'}
        </Typography>
      );
    },
  },
  {
    field: 'address',
    headerName: 'Address',
    type: 'string',
    flex: 1,
    minWidth: 350,
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
    field: 'createdAt',
    headerName: 'Created',
    type: 'string',
    flex: 1,
    minWidth: 180,
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
      const employee = params.row as Employee;

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
            onClick={(e) => onMenuClick(e, employee.id.toString())}
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

export const ROLE_OPTIONS = [
  { value: 'all', label: 'All Roles' },
  { value: 'admin', label: 'Admin' },
  { value: 'manager', label: 'Manager' },
  { value: 'staff', label: 'Staff' },
] as const;

export const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'suspended', label: 'Suspended' },
] as const;

export const EMPLOYEE_SORT_OPTIONS = [
  { value: 'createdAt:desc', label: 'Newest First' },
  { value: 'createdAt:asc', label: 'Oldest First' },
  { value: 'name:asc', label: 'Name (A-Z)' },
  { value: 'name:desc', label: 'Name (Z-A)' },
  { value: 'role:asc', label: 'Role (A-Z)' },
  { value: 'role:desc', label: 'Role (Z-A)' },
] as const;
