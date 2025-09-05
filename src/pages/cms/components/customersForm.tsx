// src/pages/cms/components/customerForm.tsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  TextField,
  MenuItem,
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as React from 'react';
import * as Yup from 'yup';

import { Customer, CustomerPayload } from '@/lib/customer.repo';

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    values: CustomerPayload,
    editing?: Customer | null,
  ) => Promise<void>;
  editing?: Customer | null;
};

const phoneRegex = /^[0-9+\-\s()]{6,20}$/;

const schema = Yup.object({
  name: Yup.string().trim().required('Name is required'),
  email: Yup.string().email('Invalid email').optional(),
  phone: Yup.string().matches(phoneRegex, 'Invalid phone').optional(),
  tier: Yup.mixed<'vip' | 'normal'>().oneOf(['vip', 'normal']).optional(),
  status: Yup.mixed<'active' | 'inactive'>()
    .oneOf(['active', 'inactive'])
    .optional(),
});

const CustomerForm: React.FC<Props> = ({
  open,
  onClose,
  onSubmit,
  editing,
}) => {
  const initialValues: CustomerPayload = {
    name: editing?.name ?? '',
    email: editing?.email ?? '',
    phone: editing?.phone ?? '',
    tier: editing?.tier ?? 'normal',
    status: editing?.status ?? 'active',
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{editing ? 'Edit Customer' : 'New Customer'}</DialogTitle>
      <Formik
        initialValues={initialValues}
        validationSchema={schema}
        enableReinitialize
        onSubmit={async (values, helpers) => {
          await onSubmit(values, editing ?? null);
          helpers.setSubmitting(false);
          onClose();
        }}
      >
        {({ values, errors, touched, handleChange, isSubmitting }) => (
          <Form>
            <DialogContent dividers>
              <Stack spacing={2}>
                <TextField
                  name="name"
                  label="Name"
                  value={values.name}
                  onChange={handleChange}
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                  autoFocus
                />
                <TextField
                  name="email"
                  label="Email"
                  value={values.email}
                  onChange={handleChange}
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                />
                <TextField
                  name="phone"
                  label="Phone"
                  value={values.phone}
                  onChange={handleChange}
                  error={touched.phone && Boolean(errors.phone)}
                  helperText={touched.phone && errors.phone}
                />
                <Stack direction="row" spacing={2}>
                  <TextField
                    select
                    name="tier"
                    label="Tier"
                    value={values.tier}
                    onChange={handleChange}
                    sx={{ minWidth: 160 }}
                  >
                    <MenuItem value="normal">Normal</MenuItem>
                    <MenuItem value="vip">VIP</MenuItem>
                  </TextField>
                  <TextField
                    select
                    name="status"
                    label="Status"
                    value={values.status}
                    onChange={handleChange}
                    sx={{ minWidth: 160 }}
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </TextField>
                </Stack>
              </Stack>
            </DialogContent>

            <DialogActions>
              <Button onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {editing ? 'Save changes' : 'Create'}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default CustomerForm;
