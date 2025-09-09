/* eslint-disable no-unused-vars */
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DateRangeRoundedIcon from '@mui/icons-material/DateRangeRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
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

import { type Customer } from '../../../lib/customer.repo';
import { formatDateTime } from '../../../utils';

interface CustomerDetailDialogProps {
  open: boolean;
  onClose: () => void;
  customer: Customer | null;
  onEdit?: (customer: Customer) => void;
  onDelete?: (customer: Customer) => void;
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

export const CustomerDetailDialog: React.FC<CustomerDetailDialogProps> = ({
  open,
  onClose,
  customer,
  onEdit,
  onDelete,
}) => {
  if (!customer) {
    return null;
  }

  // const getTierChip = () => {
  //   const tier = customer.tier;
  //   const color = tier === 'vip' ? 'warning' : 'default';
  //   const icon =
  //     tier === 'vip' ? <StarRoundedIcon fontSize="small" /> : undefined;

  //   return (
  //     <Chip
  //       label={tier === 'vip' ? 'VIP Customer' : 'Normal Customer'}
  //       color={color}
  //       size="small"
  //       icon={icon}
  //       sx={{ textTransform: 'capitalize' }}
  //     />
  //   );
  // };

  const getStatusChip = () => {
    const isActive = customer.isActive;
    return (
      <Chip
        label={isActive ? 'Active' : 'Inactive'}
        color={isActive ? 'success' : 'default'}
        size="small"
      />
    );
  };

  // const formatCurrency = (value: number) => {
  //   return new Intl.NumberFormat('vi-VN', {
  //     style: 'currency',
  //     currency: 'VND',
  //   }).format(value);
  // };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getFullAddress = () => {
    const parts = [
      customer.address,
      customer.ward,
      customer.district,
      customer.city,
    ].filter(Boolean);
    return parts.join(', ') || 'No address provided';
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
            Customer Details
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Customer ID: {customer.id}
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
                {getInitials(customer.name)}
              </Avatar>
              <Typography variant="h5" gutterBottom align="center">
                {customer.name}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                }}
              >
                {/* {getTierChip()} */}
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
                  icon={<PersonRoundedIcon />}
                  label="Full Name"
                  value={
                    <Typography variant="body2">{customer.name}</Typography>
                  }
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <InfoItem
                  icon={<EmailRoundedIcon />}
                  label="Email"
                  value={
                    customer.email ? (
                      <Typography variant="body2">{customer.email}</Typography>
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
              <Grid size={{ xs: 12, sm: 12 }}>
                <InfoItem
                  icon={<PhoneRoundedIcon />}
                  label="Phone Number"
                  value={
                    customer.phone ? (
                      <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                        {customer.phone}
                      </Typography>
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
            </Grid>
          </Grid>

          <Grid size={{ xs: 12, sm: 12 }}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Address Information
            </Typography>

            <Grid container spacing={3}>
              <Grid size={{ xs: 6, sm: 3 }}>
                <InfoItem
                  icon={<ShoppingCartRoundedIcon />}
                  label="Full Address"
                  value={
                    <Typography variant="h6" color="primary">
                      {getFullAddress()}
                    </Typography>
                  }
                />
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <InfoItem
                  icon={<LocationOnRoundedIcon />}
                  label="Street Address"
                  value={
                    <Typography
                      variant="body2"
                      color={
                        customer.address ? 'text.primary' : 'text.secondary'
                      }
                      fontStyle={customer.address ? 'normal' : 'italic'}
                    >
                      {customer.address || 'N/A'}
                    </Typography>
                  }
                />
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <InfoItem
                  icon={<LocationOnRoundedIcon />}
                  label="Ward"
                  value={
                    <Typography
                      variant="body2"
                      color={customer.ward ? 'text.primary' : 'text.secondary'}
                      fontStyle={customer.ward ? 'normal' : 'italic'}
                    >
                      {customer.ward || 'N/A'}
                    </Typography>
                  }
                />
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <InfoItem
                  icon={<LocationOnRoundedIcon />}
                  label="District"
                  value={
                    <Typography
                      variant="body2"
                      color={
                        customer.district ? 'text.primary' : 'text.secondary'
                      }
                      fontStyle={customer.district ? 'normal' : 'italic'}
                    >
                      {customer.district || 'N/A'}
                    </Typography>
                  }
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <InfoItem
                  icon={<LocationOnRoundedIcon />}
                  label="City/Province"
                  value={
                    <Typography
                      variant="body2"
                      color={customer.city ? 'text.primary' : 'text.secondary'}
                      fontStyle={customer.city ? 'normal' : 'italic'}
                    >
                      {customer.city || 'Not provided'}
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
              <InfoItem
                icon={<DateRangeRoundedIcon />}
                label="Created"
                value={
                  <Typography variant="body2">
                    {formatDateTime(customer.createdAt)}
                  </Typography>
                }
              />
              {customer.updatedAt && (
                <InfoItem
                  icon={<DateRangeRoundedIcon />}
                  label="Last Updated"
                  value={
                    <Typography variant="body2">
                      {formatDateTime(customer.updatedAt)}
                    </Typography>
                  }
                />
              )}
              <InfoItem
                icon={<PersonRoundedIcon />}
                label="Status"
                value={getStatusChip()}
              />
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
            onClick={() => onEdit(customer)}
            variant="contained"
            startIcon={<EditRoundedIcon />}
          >
            Edit Customer
          </Button>
        )}
        {onDelete && (
          <Button
            onClick={() => onDelete(customer)}
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

export default CustomerDetailDialog;
