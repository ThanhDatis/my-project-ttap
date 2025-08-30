/* eslint-disable @typescript-eslint/no-explicit-any */
import { Close as CloseIcon } from '@mui/icons-material';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  IconButton,
  FormControl,
  FormLabel,
  Alert,
  TextField,
  MenuItem,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { Formik, Form } from 'formik';
import React from 'react';
import * as Yup from 'yup';

import {
  validateProductName,
  validateProductDescription,
  validateProductPrice,
  validateProductStock,
  validateCategory,
  validateSku,
} from '../../../common/validate';
import { Input } from '../../../components/fields';
import LoadingButton from '../../../components/loadingButton';
import { type Product } from '../../../lib/product.repo';
import { useProductStore } from '../../../store/product.store';
import { PRODUCT_CATEGORY_OPTIONS } from '../tableColumns/productsColumn';

const productSchema = Yup.object({
  name: validateProductName,
  description: validateProductDescription,
  price: validateProductPrice,
  stock: validateProductStock,
  category: validateCategory,
  sku: validateSku,
});

export interface ProductFormValues {
  [x: string]: any;
  name: string;
  description: string;
  price: number | '';
  stock: number | '';
  category: string;
  sku: string;
}

interface ProductFormProps {
  open: boolean;
  onClose: () => void;
  product?: Product | null;
  mode: 'create' | 'edit';
}

export const ProductForm: React.FC<ProductFormProps> = ({
  open,
  onClose,
  product,
  mode,
}) => {
  const {
    createProduct,
    updateProduct,
    isCreating,
    isUpdating,
    error,
    clearError,
  } = useProductStore();

  const isLoading = isCreating || isUpdating;

  const initialValues: ProductFormValues = {
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    stock: product?.stock || '',
    category: product?.category || '',
    sku: product?.sku || '',
  };

  const handleSubmit = async (values: ProductFormValues) => {
    try {
      const productData = {
        name: values.name,
        description: values.description,
        price: Number(values.price),
        stock: Number(values.stock),
        category: values.category,
        sku: values.sku,
      };

      if (mode === 'create') {
        await createProduct(productData);
      } else if (mode === 'edit' && product) {
        await updateProduct(product.id.toString(), productData);
      }

      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleClose = () => {
    clearError();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
        }}
      >
        {mode === 'create' ? 'Create New Product' : 'Edit Product'}
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Formik
        initialValues={initialValues}
        validationSchema={productSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          isValid,
          dirty,
        }) => (
          <Form>
            <DialogContent>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={clearError}>
                  {error}
                </Alert>
              )}

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 8 }}>
                  <FormControl fullWidth>
                    <FormLabel htmlFor="name">Product Name *</FormLabel>
                    <Input
                      id="name"
                      name="name"
                      label=""
                      value={values.name}
                      placeholder="Enter product name"
                      isError={!!(touched.name && errors.name)}
                      errorText={errors.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={isLoading}
                    />
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <FormControl fullWidth>
                    <FormLabel htmlFor="sku">SKU</FormLabel>
                    <Input
                      id="sku"
                      name="sku"
                      label=""
                      value={values.sku}
                      placeholder="e.g. PROD-001"
                      isError={!!(touched.sku && errors.sku)}
                      errorText={errors.sku}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={isLoading}
                    />
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <FormControl fullWidth>
                    <FormLabel htmlFor="description">Description *</FormLabel>
                    <Input
                      id="description"
                      name="description"
                      label=""
                      value={values.description}
                      placeholder="Enter product description"
                      multiline
                      rows={4}
                      isError={!!(touched.description && errors.description)}
                      errorText={errors.description}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={isLoading}
                    />
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth>
                    <FormLabel htmlFor="category">Category *</FormLabel>
                    <Input
                      id="category"
                      name="category"
                      label=""
                      value={values.category}
                      isError={!!(touched.category && errors.category)}
                      errorText={errors.category}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={isLoading}
                    />
                    {/* Alternative: Use TextField with select for better UX */}
                    <TextField
                      select
                      fullWidth
                      name="category"
                      value={values.category}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={!!(touched.category && errors.category)}
                      helperText={errors.category}
                      disabled={isLoading}
                    >
                      {PRODUCT_CATEGORY_OPTIONS.filter(
                        (opt) => opt.value !== 'all',
                      ).map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth>
                    <FormLabel htmlFor="price">Price (VND) *</FormLabel>
                    <Input
                      id="price"
                      name="price"
                      label=""
                      typeInput="number"
                      value={values.price === '' ? '' : String(values.price)}
                      placeholder="0"
                      isError={!!(touched.price && errors.price)}
                      errorText={errors.price}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={isLoading}
                    />
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth>
                    <FormLabel htmlFor="stock">Stock Quantity *</FormLabel>
                    <Input
                      id="stock"
                      name="stock"
                      label=""
                      typeInput="number"
                      value={values.stock === '' ? '' : String(values.stock)}
                      placeholder="0"
                      isError={!!(touched.stock && errors.stock)}
                      errorText={errors.stock}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={isLoading}
                    />
                  </FormControl>
                </Grid>

                {mode === 'edit' && product && (
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Box sx={{ pt: 2 }}>
                      <FormLabel>Current Status</FormLabel>
                      <Box
                        sx={{
                          mt: 1,
                          fontSize: '0.875rem',
                          color: 'text.secondary',
                        }}
                      >
                        {Number(values.stock) === 0
                          ? 'Out of Stock'
                          : product.status === 'active'
                            ? 'Active'
                            : 'Inactive'}
                      </Box>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 0 }}>
              <Button
                onClick={handleClose}
                disabled={isLoading}
                variant="outlined"
              >
                Cancel
              </Button>
              <LoadingButton
                type="submit"
                loading={isLoading}
                disabled={!isValid || (!dirty && mode === 'edit')}
                textButton={
                  mode === 'create' ? 'Create Product' : 'Save Changes'
                }
                variant="contained"
              />
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default ProductForm;
