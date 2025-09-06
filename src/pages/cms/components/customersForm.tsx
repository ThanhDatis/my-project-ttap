import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import {
  Button,
  Box,
  FormControl,
  FormLabel,
  TextField,
  MenuItem,
  Card,
  Typography,
  Chip,
  Divider,
  Avatar,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import type { AxiosError } from 'axios';
import { Formik, Form, type FormikHelpers } from 'formik';
import React from 'react';
import * as Yup from 'yup';

import {
  validateEmail,
  validateName,
  validatePhone,
} from '../../../common/validate';
import { Input } from '../../../components/fields';
import LoadingButton from '../../../components/loadingButton';
import ToastMessage from '../../../components/toastMessage';
import type {
  Customer,
  CustomerPayload,
  Tier,
} from '../../../lib/customer.repo';
import { useCustomerStore } from '../../../store/customer.store';

function isAxiosError(error: unknown): error is AxiosError {
  return typeof error === 'object' && error !== null && 'response' in error;
}

const customerSchema = Yup.object({
  name: validateName,
  email: validateEmail.optional(),
  phone: validatePhone.optional(),
  address: Yup.string().max(200, 'Address is too long').optional(),
  tier: Yup.mixed<Tier>().oneOf(['vip', 'normal']).required('Tier is required'),
  totalOrders: Yup.number()
    .min(0, 'Total orders must be at least 0')
    .optional(),
  lifetimeValue: Yup.number()
    .min(0, 'Lifetime value must be at least 0')
    .optional(),
});

export interface CustomerFormValues {
  name: string;
  email: string;
  phone: string;
  address: string;
  tier: Tier;
  totalOrders: number | '';
  lifetimeValue: number | '';
}

interface CustomerFormProps {
  onRefresh: () => void;
  isTableLoading?: boolean;
  mode: 'create' | 'edit';
  customer?: Customer;
  onClose?: () => void;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({
  onRefresh,
  isTableLoading = false,
  mode,
  customer,
  onClose,
}) => {
  const { createCustomer, updateCustomer, isLoading } = useCustomerStore();

  const initialValues: CustomerFormValues = React.useMemo(() => {
    if (mode === 'edit' && customer) {
      return {
        name: customer.name ?? '',
        email: customer.email ?? '',
        phone: customer.phone ?? '',
        address: customer.address ?? '',
        tier: customer.tier ?? 'normal',
        totalOrders: customer.totalOrders ?? '',
        lifetimeValue: customer.lifetimeValue ?? '',
      };
    }
    return {
      name: '',
      email: '',
      phone: '',
      address: '',
      tier: 'normal',
      totalOrders: '',
      lifetimeValue: '',
    };
  }, [mode, customer]);

  const handleSubmit = async (
    values: CustomerFormValues,
    { resetForm }: FormikHelpers<CustomerFormValues>,
  ) => {
    if (!values.name) {
      ToastMessage('error', 'Please fill in customer name');
      return;
    }

    const customerData: CustomerPayload = {
      name: values.name.trim(),
      email: values.email.trim() || undefined,
      phone: values.phone.trim() || undefined,
      address: values.address.trim() || undefined,
      tier: values.tier,
      totalOrders: Number(values.totalOrders || 0),
      lifetimeValue: Number(values.lifetimeValue || 0),
      isActive: true,
    };

    try {
      if (mode === 'edit' && customer) {
        await updateCustomer(customer.id, customerData);
        ToastMessage('success', 'Customer updated successfully');
        onClose?.();
        onRefresh();
        return;
      } else {
        await createCustomer(customerData);
        ToastMessage('success', 'Customer created successfully');
        resetForm();
        onRefresh();
      }
    } catch (error: unknown) {
      let message =
        mode === 'edit'
          ? 'Failed to update customer'
          : 'Failed to create customer';
      if (isAxiosError(error)) {
        message = error.response?.data?.message || message;
      } else if (error instanceof Error) {
        message = error.message || message;
      }
      ToastMessage('error', message);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'C';
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Box sx={{ p: 3, mb: 2 }}>
      <Typography
        variant="h6"
        sx={{
          p: 2,
          fontWeight: 'bold',
          // display: 'flex',
          // alignItems: 'center',
          // gap: 1,
        }}
      >
        {/* <PersonAddRoundedIcon /> */}
        {mode === 'edit' ? 'Edit Customer' : 'Create New Customer'}
      </Typography>
      <Formik
        initialValues={initialValues}
        validationSchema={customerSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, errors, touched, handleBlur, handleChange, isValid }) => (
          <Form>
            <Box>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <FormControl sx={{ width: '100%', mb: 2 }}>
                    <FormLabel htmlFor="name">Customer Name *</FormLabel>
                    <Input
                      id="name"
                      name="name"
                      label=""
                      value={values.name}
                      placeholder="Enter customer name"
                      isError={!!(touched.name && errors.name)}
                      errorText={errors.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={isLoading}
                    />
                  </FormControl>

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FormControl sx={{ width: '100%', mb: 2 }}>
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <Input
                          id="email"
                          name="email"
                          label=""
                          typeInput="email"
                          value={values.email}
                          placeholder="customer@example.com"
                          isError={!!(touched.email && errors.email)}
                          errorText={errors.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={isLoading}
                        />
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FormControl sx={{ width: '100%', mb: 2 }}>
                        <FormLabel htmlFor="phone">Phone</FormLabel>
                        <Input
                          id="phone"
                          name="phone"
                          label=""
                          value={values.phone}
                          placeholder="0123456789"
                          isError={!!(touched.phone && errors.phone)}
                          errorText={errors.phone}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={isLoading}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>

                  <FormControl sx={{ width: '100%', mb: 2 }}>
                    <FormLabel htmlFor="address">Address</FormLabel>
                    <Input
                      id="address"
                      name="address"
                      label=""
                      value={values.address}
                      placeholder="Enter customer address"
                      multiline
                      rows={3}
                      isError={!!(touched.address && errors.address)}
                      errorText={errors.address}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={isLoading}
                    />
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <FormControl sx={{ width: '100%', mb: 2 }}>
                    <FormLabel htmlFor="tier">Customer Tier *</FormLabel>
                    <TextField
                      select
                      fullWidth
                      name="tier"
                      value={values.tier}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={!!(touched.tier && errors.tier)}
                      helperText={errors.tier}
                      disabled={isLoading}
                    >
                      <MenuItem value="normal">Normal Customer</MenuItem>
                      <MenuItem value="vip">VIP Customer</MenuItem>
                    </TextField>
                  </FormControl>

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FormControl sx={{ width: '100%', mb: 2 }}>
                        <FormLabel htmlFor="totalOrders">
                          Total Orders
                        </FormLabel>
                        <Input
                          id="totalOrders"
                          name="totalOrders"
                          label=""
                          typeInput="number"
                          value={
                            values.totalOrders === ''
                              ? ''
                              : String(values.totalOrders)
                          }
                          placeholder="0"
                          isError={
                            !!(touched.totalOrders && errors.totalOrders)
                          }
                          errorText={errors.totalOrders}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={isLoading}
                        />
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FormControl sx={{ width: '100%', mb: 2 }}>
                        <FormLabel htmlFor="lifetimeValue">
                          Lifetime Value (VND)
                        </FormLabel>
                        <Input
                          id="lifetimeValue"
                          name="lifetimeValue"
                          label=""
                          typeInput="number"
                          value={
                            values.lifetimeValue === ''
                              ? ''
                              : String(values.lifetimeValue)
                          }
                          placeholder="0"
                          isError={
                            !!(touched.lifetimeValue && errors.lifetimeValue)
                          }
                          errorText={errors.lifetimeValue}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={isLoading}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <Card sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                      Customer Preview
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        sx={{
                          width: 50,
                          height: 50,
                          mr: 2,
                          bgcolor:
                            values.tier === 'vip'
                              ? 'warning.light'
                              : 'primary.light',
                        }}
                      >
                        {getInitials(values.name)}
                      </Avatar>
                      <Box>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 600 }}
                        >
                          {values.name || 'New Customer'}
                        </Typography>
                        <Chip
                          label={
                            values.tier === 'vip'
                              ? 'VIP Customer'
                              : 'Normal Customer'
                          }
                          size="small"
                          color={values.tier === 'vip' ? 'warning' : 'default'}
                          variant="outlined"
                        />
                      </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ mb: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Contact Information
                      </Typography>
                      <Typography variant="body2">
                        Email: {values.email || 'Not provided'}
                      </Typography>
                      <Typography variant="body2">
                        Phone: {values.phone || 'Not provided'}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Statistics
                      </Typography>
                      <Typography variant="body2">
                        Total Orders: {values.totalOrders || 0}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="success.main"
                        sx={{ fontWeight: 600 }}
                      >
                        Lifetime Value:{' '}
                        {values.lifetimeValue
                          ? new Intl.NumberFormat('vi-VN', {
                              style: 'currency',
                              currency: 'VND',
                            }).format(Number(values.lifetimeValue))
                          : '0 VND'}
                      </Typography>
                    </Box>
                  </Card>

                  <Box
                    sx={{
                      mt: 2,
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Button
                      variant="outlined"
                      startIcon={<RefreshRoundedIcon />}
                      onClick={onRefresh}
                      disabled={isTableLoading || isLoading}
                    >
                      Refresh
                    </Button>
                    {mode === 'edit' ? (
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="outlined"
                          color="inherit"
                          onClick={onClose}
                          disabled={isLoading}
                        >
                          Cancel
                        </Button>
                        <LoadingButton
                          type="submit"
                          loading={isLoading}
                          disabled={!isValid || isLoading}
                          textButton="Update Customer"
                          variant="contained"
                        />
                      </Box>
                    ) : (
                      <LoadingButton
                        type="submit"
                        loading={isLoading}
                        disabled={!isValid || isLoading}
                        textButton="Add Customer"
                        variant="contained"
                      />
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default CustomerForm;
