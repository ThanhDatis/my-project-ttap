import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import {
  Button,
  Box,
  FormControl,
  FormLabel,
  // TextField,
  // MenuItem,
  Card,
  Typography,
  // Chip,
  Divider,
  Avatar,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import type { AxiosError } from 'axios';
import { Formik, Form, type FormikHelpers } from 'formik';
import React from 'react';
import * as Yup from 'yup';

import {
  validateName,
  validatePhone,
  validateAddress,
  validateCity,
  validateWard,
  validateDistrict,
  validateEmailFormInfo,
} from '../../../common/validate';
import { Input } from '../../../components/fields';
import LoadingButton from '../../../components/loadingButton';
import ToastMessage from '../../../components/toastMessage';
import type {
  Customer,
  CustomerPayload,
  // Tier,
} from '../../../lib/customer.repo';
import { useCustomerStore } from '../../../store/customer.store';

function isAxiosError(error: unknown): error is AxiosError {
  return typeof error === 'object' && error !== null && 'response' in error;
}

const customerSchema = Yup.object({
  name: validateName.label('Full Name'),
  email: validateEmailFormInfo,
  phone: validatePhone,
  address: validateAddress,
  city: validateCity,
  district: validateDistrict,
  ward: validateWard,
});

export interface CustomerFormValues {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  // tier: Tier;
  // totalOrders: number | '';
  // lifetimeValue: number | '';
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
        city: customer.city ?? '',
        district: customer.district ?? '',
        ward: customer.ward ?? '',
        // tier: customer.tier ?? 'normal',
        // totalOrders: customer.totalOrders ?? '',
        // lifetimeValue: customer.lifetimeValue ?? '',
      };
    }
    return {
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      district: '',
      ward: '',
      // tier: 'normal',
      // totalOrders: '',
      // lifetimeValue: '',
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
      city: values.city?.trim() || undefined,
      district: values.district?.trim() || undefined,
      ward: values.ward?.trim() || undefined,
      // tier: values.tier,
      // totalOrders: Number(values.totalOrders || 0),
      // lifetimeValue: Number(values.lifetimeValue || 0),
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

  const getFullAddress = (values: CustomerFormValues) => {
    const parts = [
      values.address,
      values.ward,
      values.district,
      values.city,
    ].filter(Boolean);
    return parts.join(', ') || 'Not provided';
  };

  return (
    <Box sx={{ p: 3, mb: 2 }}>
      <Typography
        variant="h6"
        sx={{
          p: 2,
          fontWeight: 'bold',
        }}
      >
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
                <Grid size={{ xs: 12, md: 8 }}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                      <FormControl sx={{ width: '100%', mb: 2 }}>
                        <FormLabel htmlFor="name">Full Name</FormLabel>
                        <Input
                          id="name"
                          name="name"
                          label=""
                          value={values.name}
                          placeholder="Enter customer full name"
                          isError={!!(touched.name && errors.name)}
                          errorText={errors.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={isLoading}
                        />
                      </FormControl>
                    </Grid>

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

                    <Grid size={{ xs: 12 }}>
                      <FormControl sx={{ width: '100%', mb: 2 }}>
                        <FormLabel htmlFor="address">Street Address</FormLabel>
                        <Input
                          id="address"
                          name="address"
                          label=""
                          value={values.address}
                          placeholder="Enter street address"
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
                        <FormLabel htmlFor="ward">Ward</FormLabel>
                        <Input
                          id="ward"
                          name="ward"
                          label=""
                          value={values.ward}
                          placeholder="Enter ward"
                          isError={!!(touched.ward && errors.ward)}
                          errorText={errors.ward}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={isLoading}
                        />
                      </FormControl>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                      <FormControl sx={{ width: '100%', mb: 2 }}>
                        <FormLabel htmlFor="district">District</FormLabel>
                        <Input
                          id="district"
                          name="district"
                          label=""
                          value={values.district}
                          placeholder="Enter district"
                          isError={!!(touched.district && errors.district)}
                          errorText={errors.district}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={isLoading}
                        />
                      </FormControl>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                      <FormControl sx={{ width: '100%', mb: 2 }}>
                        <FormLabel htmlFor="city">City/Province</FormLabel>
                        <Input
                          id="city"
                          name="city"
                          label=""
                          value={values.city}
                          placeholder="Enter city or province"
                          isError={!!(touched.city && errors.city)}
                          errorText={errors.city}
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
                          bgcolor: 'primary.light',
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
                        <Typography variant="caption" color="text.secondary">
                          Customer
                        </Typography>
                      </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ mb: 2 }}>
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
                        Address
                      </Typography>
                      <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
                        {getFullAddress(values)}
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
