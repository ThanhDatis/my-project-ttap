/* eslint-disable @typescript-eslint/no-explicit-any */
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import {
  Button,
  Box,
  FormControl,
  FormLabel,
  Typography,
  Divider,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import type { AxiosError } from 'axios';
import { Formik, Form, type FormikHelpers } from 'formik';
import React from 'react';

import { customerSchema, toUndef } from '../../../common/validate';
import { Input } from '../../../components/fields';
import LoadingButton from '../../../components/loadingButton';
import ToastMessage from '../../../components/toastMessage';
import type { Customer, CustomerPayload } from '../../../lib/customer.repo';
import { useCustomerStore } from '../../../store/customer.store';

function isAxiosError(error: unknown): error is AxiosError {
  return typeof error === 'object' && error !== null && 'response' in error;
}

export interface CustomerFormValues {
  name: string;
  email: string;
  phone: string;
  address: string;
  ward: string;
  district: string;
  city: string;
  note: string;
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
        ward: customer.ward ?? '',
        district: customer.district ?? '',
        city: customer.city ?? '',
        note: customer.note ?? '',
      };
    }
    return {
      name: '',
      email: '',
      phone: '',
      address: '',
      ward: '',
      district: '',
      city: '',
      note: '',
    };
  }, [mode, customer]);

  const handleSubmit = async (
    values: CustomerFormValues,
    helpers: FormikHelpers<CustomerFormValues>,
  ) => {
    const { resetForm, setFieldError } = helpers;
    const v = customerSchema.cast(values) as CustomerFormValues;

    const customerData: CustomerPayload = {
      name: v.name,
      email: v.email,
      phone: v.phone,
      address: toUndef(v.address),
      ward: toUndef(v.ward),
      district: toUndef(v.district),
      city: toUndef(v.city),
      note: toUndef(v.note),
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
        const data = error.response?.data as any;
        const payload = data?.payload ?? data;

        message = payload?.message || message;

        if (payload?.errors) {
          Object.entries(payload.errors).forEach(([field, msg]) => {
            if (
              [
                'name',
                'email',
                'phone',
                'address',
                'ward',
                'district',
                'city',
                'note',
              ].includes(field)
            ) {
              setFieldError(field as keyof CustomerFormValues, msg as string);
            }
          });
        } else {
          const low = message.toLowerCase();
          if (low.includes('email')) setFieldError('email', message);
          if (low.includes('phone')) setFieldError('phone', message);
        }
      } else if (error instanceof Error) {
        message = error.message || message;
      }

      ToastMessage('error', message);
    }
  };

  return (
    <Box sx={{ p: 3, mb: 2 }}>
      {/* <Typography
        variant="h6"
        sx={{
          p: 2,
          fontWeight: 'bold',
        }}
      >
        {mode === 'edit' ? 'Edit Customer' : 'Create New Customer'}
      </Typography> */}
      <Formik
        initialValues={initialValues}
        validationSchema={customerSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, errors, touched, handleBlur, handleChange, isValid }) => (
          <Form>
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{
                mb: 1,
                textAlign: 'left',
              }}
            >
              Personal Information
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 4 }}>
                <FormControl sx={{ width: '100%', mb: 2 }}>
                  <FormLabel htmlFor="fullname">Full Name</FormLabel>
                  <Input
                    id="name"
                    name="name"
                    label=""
                    value={values.name}
                    placeholder=""
                    isError={!!(touched.name && errors.name)}
                    errorText={errors.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={isLoading}
                  />
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <FormControl sx={{ width: '100%', mb: 2 }}>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <Input
                    id="email"
                    name="email"
                    label=""
                    typeInput="email"
                    value={values.email}
                    placeholder=""
                    isError={!!(touched.email && errors.email)}
                    errorText={errors.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={isLoading}
                  />
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <FormControl sx={{ width: '100%', mb: 2 }}>
                  <FormLabel htmlFor="phone">Phone</FormLabel>
                  <Input
                    id="phone"
                    name="phone"
                    label=""
                    value={values.phone}
                    placeholder=""
                    isError={!!(touched.phone && errors.phone)}
                    errorText={errors.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={isLoading}
                  />
                </FormControl>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{
                mb: 1,
                textAlign: 'left',
              }}
            >
              Address Information
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 4 }}>
                <FormControl sx={{ width: '100%', mb: 2 }}>
                  <FormLabel htmlFor="address">Street Address</FormLabel>
                  <Input
                    id="address"
                    name="address"
                    label=""
                    value={values.address}
                    placeholder=""
                    isError={!!(touched.address && errors.address)}
                    errorText={errors.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormControl sx={{ width: '100%', mb: 2 }}>
                  <FormLabel htmlFor="district">District</FormLabel>
                  <Input
                    id="district"
                    name="district"
                    label=""
                    value={values.district}
                    placeholder=""
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
                  <FormLabel htmlFor="ward">Ward</FormLabel>
                  <Input
                    id="ward"
                    name="ward"
                    label=""
                    value={values.ward}
                    placeholder=""
                    isError={!!(touched.ward && errors.ward)}
                    errorText={errors.ward}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormControl fullWidth>
                  <FormLabel htmlFor="note">Note</FormLabel>
                  <Input
                    id="note"
                    name="note"
                    label=""
                    value={values.note}
                    placeholder=""
                    // multiline
                    // rows={3}
                    isError={!!(touched.note && errors.note)}
                    errorText={errors.note}
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
                    placeholder=""
                    isError={!!(touched.city && errors.city)}
                    errorText={errors.city}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={isLoading}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <Box
              sx={{
                mt: 2,
                display: 'flex',
                justifyContent: 'space-around',
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
                    // type="submit"
                    loading={isLoading}
                    disabled={!isValid || isLoading}
                    textButton="Update Customer"
                    // variant="contained"
                  />
                </Box>
              ) : (
                <LoadingButton
                  // type="submit"
                  loading={isLoading}
                  disabled={!isValid || isLoading}
                  textButton="Add Customer"
                  // variant="contained"
                />
              )}
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default CustomerForm;
