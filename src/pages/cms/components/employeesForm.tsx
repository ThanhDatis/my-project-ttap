import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import {
  Button,
  Box,
  FormControl,
  FormLabel,
  TextField,
  MenuItem,
  Typography,
  // Chip,
  Divider,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { vi } from 'date-fns/locale';
import { Formik, Form, type FormikHelpers } from 'formik';
import React from 'react';
import * as Yup from 'yup';

import {
  validateAddress,
  validateCity,
  validateDistrict,
  validateEmailFormInfo,
  validateGender,
  validateName,
  validatePhone,
  validateRole,
  validateStatus,
  validateWard,
} from '../../../common/validate';
import { Input } from '../../../components/fields';
import LoadingButton from '../../../components/loadingButton';
import ToastMessage from '../../../components/toastMessage';
import type {
  Employee,
  EmployeePayload,
  Role,
  Gender,
  EmployeeStatus,
} from '../../../lib/employee.repo';

const employeeSchema = Yup.object({
  name: validateName.label('Employee Name'),
  email: validateEmailFormInfo,
  phone: validatePhone,
  dateOfBirth: Yup.string().optional(),
  role: validateRole.label('Role'),
  gender: validateGender.label('Gender'),
  street: validateAddress.label('Street'),
  ward: validateWard,
  district: validateDistrict,
  city: validateCity,
  status: validateStatus.label('Status'),
});

export interface EmployeeFormValues {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: Gender;
  role: Role;
  street: string;
  ward: string;
  district: string;
  city: string;
  status: EmployeeStatus;
}

interface EmployeeFormProps {
  onRefresh: () => void;
  isTableLoading?: boolean;
  mode: 'create' | 'edit';
  employee?: Employee;
  onClose?: () => void;
}

export const EmployeeForm: React.FC<EmployeeFormProps> = ({
  onRefresh,
  isTableLoading = false,
  mode,
  employee,
  onClose,
}) => {
  const [isLoading] = React.useState(false);

  const initialValues: EmployeeFormValues = React.useMemo(() => {
    if (mode === 'edit' && employee) {
      return {
        name: employee.name ?? '',
        email: employee.email ?? '',
        phone: employee.phone ?? '',
        dateOfBirth: employee.dateOfBirth ?? '',
        gender: employee.gender ?? 'other',
        street: '',
        ward: employee.ward ?? '',
        district: employee.district ?? '',
        city: employee.city ?? '',
        role: employee.role ?? 'staff',
        status: employee.status ?? 'active',
      };
    }
    return {
      name: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: 'other',
      role: 'staff',
      street: '',
      ward: '',
      district: '',
      city: '',
      status: 'active',
    };
  }, [mode, employee]);

  const handleSubmit = async (
    values: EmployeeFormValues,
    { resetForm }: FormikHelpers<EmployeeFormValues>,
  ) => {
    if (!values.name) {
      ToastMessage('error', 'Please fill in employee name');
      return;
    }
    const fullAddress = [
      values.street,
      values.ward,
      values.district,
      values.city,
    ]
      .map((s) => s?.trim())
      .filter(Boolean)
      .join(', ');

    const employeeData: EmployeePayload = {
      name: values.name.trim(),
      dateOfBirth: values.dateOfBirth.trim() || undefined,
      address: fullAddress || undefined,
      email: values.email.trim() || undefined,
      phone: values.phone.trim() || undefined,
      role: values.role,
      status: values.status,
    };
    console.log('employeeData', employeeData);

    try {
      if (mode === 'edit' && employee) {
        // await updateEmployee(employee.id, employeeData);
        ToastMessage('success', 'Employee updated successfully');
        onClose?.();
        onRefresh();
        return;
      } else {
        // await createEmployee(employeeData);
        ToastMessage('success', 'Employee created successfully');
        resetForm();
        onRefresh();
      }
    } catch (error: unknown) {
      let message =
        mode === 'edit'
          ? 'Failed to update employee'
          : 'Failed to create employee';
      if (error instanceof Error) {
        message = error.message || message;
      }
      ToastMessage('error', message);
    }
  };

  return (
    <Box sx={{ p: 3, mb: 2 }}>
      <Formik
        initialValues={initialValues}
        validationSchema={employeeSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, errors, touched, handleBlur, handleChange, isValid }) => (
          <Form>
            <Box>
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
                    <FormLabel htmlFor="name">Full Name</FormLabel>
                    <Input
                      id="name"
                      name="name"
                      label=""
                      value={values.name}
                      placeholder="Enter employee name"
                      isError={!!(touched.name && errors.name)}
                      errorText={errors.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormControl sx={{ width: '100%', mb: 2 }}>
                    <FormLabel htmlFor="dateOfBirth">Date of Birth</FormLabel>
                    <LocalizationProvider
                      dateAdapter={AdapterDateFns}
                      adapterLocale={vi}
                    >
                      <DatePicker
                        value={
                          values.dateOfBirth
                            ? new Date(values.dateOfBirth)
                            : null
                        }
                        onChange={(d) => {
                          const iso = d
                            ? new Date(
                                Date.UTC(
                                  d.getFullYear(),
                                  d.getMonth(),
                                  d.getDate(),
                                ),
                              )
                                .toISOString()
                                .split('T')[0]
                            : '';
                          handleChange({
                            target: { name: 'dateOfBirth', value: iso },
                          } as React.ChangeEvent<HTMLInputElement>);
                        }}
                        slotProps={{ textField: { size: 'small' } }}
                      />
                    </LocalizationProvider>
                    {/* <Input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      label=""
                      typeInput="date"
                      value={values.dateOfBirth}
                      isError={!!(touched.dateOfBirth && errors.dateOfBirth)}
                      errorText={errors.dateOfBirth}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={isLoading}
                    /> */}
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
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FormControl sx={{ width: '100%', mb: 2 }}>
                        <FormLabel htmlFor="role">Role</FormLabel>
                        <TextField
                          select
                          fullWidth
                          name="role"
                          value={values.role}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={!!(touched.role && errors.role)}
                          helperText={errors.role}
                          disabled={isLoading}
                        >
                          <MenuItem value="staff">Staff</MenuItem>
                          <MenuItem value="manager">Manager</MenuItem>
                          <MenuItem value="admin">Admin</MenuItem>
                        </TextField>
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FormControl sx={{ width: '100%', mb: 2 }}>
                        <FormLabel htmlFor="gender">Gender</FormLabel>
                        <TextField
                          select
                          fullWidth
                          name="gender"
                          value={values.gender}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={!!(touched.gender && errors.gender)}
                          helperText={errors.gender}
                          disabled={isLoading}
                        >
                          <MenuItem value="male">Male</MenuItem>
                          <MenuItem value="female">Female</MenuItem>
                          <MenuItem value="other">Other</MenuItem>
                        </TextField>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <FormControl sx={{ width: '100%', mb: 2 }}>
                    <FormLabel htmlFor="phone">Phone Number</FormLabel>
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
                    <FormLabel htmlFor="street">Street</FormLabel>
                    <Input
                      id="street"
                      name="street"
                      label=""
                      value={values.street}
                      placeholder=""
                      isError={!!(touched.street && errors.street)}
                      errorText={errors.street}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormControl sx={{ width: '100%', mb: 2 }}>
                    <FormLabel htmlFor="city">City</FormLabel>
                    <Input
                      id="city"
                      name="city"
                      label=""
                      value={values.city}
                      placeholder="Enter employee city"
                      isError={!!(touched.city && errors.city)}
                      errorText={errors.city}
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
                      placeholder="Enter employee ward"
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
                      placeholder="Enter employee district"
                      isError={!!(touched.district && errors.district)}
                      errorText={errors.district}
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
                      textButton="Update Employee"
                      variant="contained"
                    />
                  </Box>
                ) : (
                  <LoadingButton
                    type="submit"
                    loading={isLoading}
                    disabled={!isValid || isLoading}
                    textButton="Add Employee"
                    variant="contained"
                  />
                )}
              </Box>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default EmployeeForm;
