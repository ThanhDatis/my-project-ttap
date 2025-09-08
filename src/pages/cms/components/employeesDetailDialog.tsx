/* eslint-disable no-unused-vars */
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import CakeRoundedIcon from '@mui/icons-material/CakeRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DateRangeRoundedIcon from '@mui/icons-material/DateRangeRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import ManageAccountsRoundedIcon from '@mui/icons-material/ManageAccountsRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import WorkRoundedIcon from '@mui/icons-material/WorkRounded';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  Divider,
  Grid,
  Avatar,
  IconButton,
} from '@mui/material';
import React from 'react';

import { type Employee } from '../../../lib/employee.repo';
import { formatDateTime } from '../../../utils';

interface EmployeeDetailDialogProps {
  open: boolean;
  onClose: () => void;
  employee: Employee | null;
  onEdit?: (employee: Employee) => void;
  onDelete?: (employee: Employee) => void;
}

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
    <Box sx={{ color: 'primary.main', display: 'flex', alignItems: 'center' }}>
      {icon}
    </Box>
    <Box sx={{ flex: 1 }}>
      <Typography variant="caption" color="text.secondary" display="block">
        {label}
      </Typography>
      <Box>{value}</Box>
    </Box>
  </Box>
);

export const EmployeeDetailDialog: React.FC<EmployeeDetailDialogProps> = ({
  open,
  onClose,
  employee,
  onEdit,
  onDelete,
}) => {
  if (!employee) {
    return null;
  }

  const getRoleChip = () => {
    const role = employee.role;
    const config = (() => {
      switch (role) {
        case 'admin':
          return {
            label: 'Admin',
            color: 'error' as const,
            icon: <AdminPanelSettingsRoundedIcon fontSize="small" />,
          };
        case 'manager':
          return {
            label: 'Manager',
            color: 'warning' as const,
            icon: <ManageAccountsRoundedIcon fontSize="small" />,
          };
        case 'staff':
          return {
            label: 'Staff',
            color: 'primary' as const,
            icon: <PersonRoundedIcon fontSize="small" />,
          };
        default:
          return {
            label: 'Unknown',
            color: 'default' as const,
            icon: <PersonRoundedIcon fontSize="small" />,
          };
      }
    })();

    return (
      <Chip
        label={config.label}
        color={config.color}
        size="small"
        icon={config.icon}
        sx={{
          textTransform: 'capitalize',
          fontWeight: 600,
          '& .MuiChip-icon': {
            color: 'inherit',
          },
        }}
      />
    );
  };

  const getStatusChip = () => {
    const status = employee.status;
    const config = (() => {
      switch (status) {
        case 'active':
          return { label: 'Active', color: 'success' as const };
        case 'inactive':
          return { label: 'Inactive', color: 'default' as const };
        case 'suspended':
          return { label: 'On Leave', color: 'warning' as const };
        default:
          return { label: 'Unknown', color: 'default' as const };
      }
    })();

    return (
      <Chip
        label={config.label}
        color={config.color}
        size="small"
        variant={status === 'active' ? 'filled' : 'outlined'}
      />
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDateOfBirth = (dateOfBirth: string | undefined) => {
    if (!dateOfBirth) return 'Not provided';
    return formatDateTime(dateOfBirth).split(' ')[0]; // Only date part
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { maxHeight: '90vh' },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 1,
        }}
      >
        <Box>
          <Typography variant="h6" component="div">
            Employee Details
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Employee ID: {employee.id}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseRoundedIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mb: 3,
              }}
            >
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  fontSize: '2.5rem',
                  mb: 2,
                  bgcolor: 'primary.light',
                }}
              >
                {getInitials(employee.name)}
              </Avatar>
              <Typography variant="h5" gutterBottom align="center">
                {employee.name}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                }}
              >
                {getRoleChip()}
                {getStatusChip()}
              </Box>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <Typography variant="h6" gutterBottom>
              Contact Information
            </Typography>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <InfoItem
                  icon={<EmailRoundedIcon />}
                  label="Email"
                  value={
                    employee.email ? (
                      <Typography variant="body2">{employee.email}</Typography>
                    ) : (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontStyle="italic"
                      >
                        No email provided
                      </Typography>
                    )
                  }
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <InfoItem
                  icon={<PhoneRoundedIcon />}
                  label="Phone"
                  value={
                    employee.phone ? (
                      <Typography variant="body2">{employee.phone}</Typography>
                    ) : (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontStyle="italic"
                      >
                        No phone provided
                      </Typography>
                    )
                  }
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 12 }}>
                <InfoItem
                  icon={<LocationOnRoundedIcon />}
                  label="Address"
                  value={
                    employee.address ? (
                      <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                        {employee.address}
                      </Typography>
                    ) : (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontStyle="italic"
                      >
                        No address provided
                      </Typography>
                    )
                  }
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid size={{ xs: 12, sm: 12 }}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Work Information
            </Typography>

            <Grid container spacing={3}>
              <Grid size={{ xs: 6, sm: 3 }}>
                <InfoItem
                  icon={<WorkRoundedIcon />}
                  label="Role"
                  value={getRoleChip()}
                />
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <InfoItem
                  icon={<PersonRoundedIcon />}
                  label="Status"
                  value={getStatusChip()}
                />
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <InfoItem
                  icon={<CakeRoundedIcon />}
                  label="Date of Birth"
                  value={
                    <Typography variant="body2">
                      {formatDateOfBirth(employee.dateOfBirth)}
                    </Typography>
                  }
                />
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <InfoItem
                  icon={<DateRangeRoundedIcon />}
                  label="Joined Date"
                  value={
                    <Typography variant="body2">
                      {formatDateTime(employee.createdAt)}
                    </Typography>
                  }
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid size={{ xs: 12, sm: 12 }}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Account Information
            </Typography>
            <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Created
                </Typography>
                <Typography variant="body2">
                  {formatDateTime(employee.createdAt)}
                </Typography>
              </Box>
              {employee.updatedAt && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Last Updated
                  </Typography>
                  <Typography variant="body2">
                    {formatDateTime(employee.updatedAt)}
                  </Typography>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0, gap: 1 }}>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
        {onEdit && (
          <Button
            onClick={() => onEdit(employee)}
            variant="contained"
            startIcon={<EditRoundedIcon />}
          >
            Edit Employee
          </Button>
        )}
        {onDelete && (
          <Button
            onClick={() => onDelete(employee)}
            variant="outlined"
            color="error"
            startIcon={<DeleteRoundedIcon />}
          >
            Delete
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default EmployeeDetailDialog;
