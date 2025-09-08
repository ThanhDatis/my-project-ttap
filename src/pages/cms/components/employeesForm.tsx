import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import {
  Button,
  Box,
  FormControl,
  FormLabel,
  TextField,
  MenuItem,
  Typography,
  Chip,
  Divider,
  Avatar,
} from '@mui/material';
import Grid from '@mui/material/Grid';
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
  Employee,
  EmployeeCreatePayload,
  Role,
  EmployeeStatus,
} from '../../../lib/employee.repo';

const employeeSchema = Yup.object({
  name: validateName,
  dateOfBirth: Yup.string().optional(),
  address: Yup.string().max(200, 'Address is too long').optional(),
  email: validateEmail.optional(),
  phone: validatePhone.optional(),
  role: Yup.mixed<Role>()
    .oneOf(['admin', 'manager', 'staff'])
    .required('Role is required'),
  status: Yup.mixed<EmployeeStatus>()
    .oneOf(['active', 'inactive', 'suspended'])
    .required('Status is required'),
});

export interface EmployeeFormValues {
  name: string;
  dateOfBirth: string;
  address: string;
  email: string;
  phone: string;
  role: Role;
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
        dateOfBirth: employee.dateOfBirth ?? '',
        address: employee.address ?? '',
        email: employee.email ?? '',
        phone: employee.phone ?? '',
        role: employee.role ?? 'employee',
        status: employee.status ?? 'active',
      };
    }
    return {
      name: '',
      dateOfBirth: '',
      address: '',
      email: '',
      phone: '',
      role: 'employee',
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

    const employeeData: EmployeeCreatePayload = {
      name: values.name.trim(),
      dateOfBirth: values.dateOfBirth.trim() || undefined,
      address: values.address.trim() || undefined,
      email: values.email.trim() || undefined,
      phone: values.phone.trim() || undefined,
      role: values.role,
      status: values.status,
    };

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
      <Typography
        variant="h6"
        sx={{
          p: 2,
          fontWeight: 'bold',
        }}
      >
        {mode === 'edit' ? 'Edit Employee' : 'Create New Employee'}
      </Typography>
      <Formik
        initialValues={initialValues}
        validationSchema={employeeSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, errors, touched, handleBlur, handleChange, isValid }) => (
          <Form>
            <Box>
              <Grid container spacing={2}>
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
                    <Input
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
                    />
                  </FormControl>

                  <FormControl sx={{ width: '100%', mb: 2 }}>
                    <FormLabel htmlFor="address">Address</FormLabel>
                    <Input
                      id="address"
                      name="address"
                      label=""
                      value={values.address}
                      placeholder="Enter employee address"
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
                          placeholder="employee@example.com"
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
                          <MenuItem value="employee">Employee</MenuItem>
                          <MenuItem value="manager">Manager</MenuItem>
                          <MenuItem value="admin">Admin</MenuItem>
                        </TextField>
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FormControl sx={{ width: '100%', mb: 2 }}>
                        <FormLabel htmlFor="status">Status</FormLabel>
                        <TextField
                          select
                          fullWidth
                          name="status"
                          value={values.status}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={!!(touched.status && errors.status)}
                          helperText={errors.status}
                          disabled={isLoading}
                        >
                          <MenuItem value="active">Active</MenuItem>
                          <MenuItem value="inactive">Inactive</MenuItem>
                          <MenuItem value="on_leave">On Leave</MenuItem>
                        </TextField>
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
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  {/* <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                      Employee Preview
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
                          {values.name || 'New Employee'}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                          <Chip
                            label={values.role}
                            size="small"
                            color={getRoleColor(values.role)}
                            variant="outlined"
                            sx={{ textTransform: 'capitalize' }}
                          />
                          <Chip
                            label={values.status}
                            size="small"
                            color={getStatusColor(values.status)}
                            variant="outlined"
                            sx={{ textTransform: 'capitalize' }}
                          />
                        </Box>
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
                        Personal Information
                      </Typography>
                      <Typography variant="body2">
                        Date of Birth: {values.dateOfBirth || 'Not provided'}
                      </Typography>
                      <Typography variant="body2">
                        Address: {values.address || 'Not provided'}
                      </Typography>
                    </Box>
                  </Box> */}
                </Grid>
              </Grid>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default EmployeeForm;
