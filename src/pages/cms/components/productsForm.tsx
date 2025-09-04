/* eslint-disable @typescript-eslint/no-explicit-any */

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
import ToastMessage from '../../../components/toastMessage';
import type { Product } from '../../../lib/product.repo';
import { default as useProductStore } from '../../../store/product.store';
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
  name: string;
  description: string;
  price: number | '';
  stock: number | '';
  category: string;
  sku: string;
}

interface ProductFormProps {
  onRefresh: () => void;
  isTableLoading?: boolean;
  mode: 'create' | 'edit';
  product?: Product;
  onClose?: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  onRefresh,
  isTableLoading = false,
  mode,
  product,
  onClose,
}) => {
  const { createProduct, updateProduct, isCreating } = useProductStore();

  const initialValues: ProductFormValues = React.useMemo(() => {
    if (mode === 'edit' && product) {
      return {
        name: product.name ?? '',
        description: product.description ?? '',
        price: product.price ?? '',
        stock: product.stock ?? '',
        category: product.category ?? '',
        sku: product.sku ?? '',
      };
    }
    return {
      name: '',
      description: '',
      price: '',
      stock: '',
      category: '',
      sku: '',
    };
  }, [mode, product]);

  const handleSubmit = async (
    values: ProductFormValues,
    { resetForm }: { resetForm: () => void },
  ) => {
    if (!values.name || !values.description || !values.category) {
      ToastMessage('error', 'Please fill in all required fields');
      return;
    }

    if (values.price === '' || values.stock === '') {
      ToastMessage('error', 'Please fill in all required fields');
      return;
    }

    const productData = {
      name: values.name.trim(),
      description: values.description.trim(),
      price: Number(values.price),
      stock: Number(values.stock),
      category: values.category,
      sku: values.sku.trim() || undefined,
    };

    try {
      if (mode === 'edit' && product) {
        await updateProduct(product.id, productData);
        ToastMessage('success', 'Product updated successfully');
        onClose?.();
        onRefresh();
        return;
      } else {
        await createProduct(productData);
        ToastMessage('success', 'Product created successfully');
        resetForm();
        onRefresh();
      }
    } catch (error: any) {
      ToastMessage(
        'error',
        error?.message ||
          (mode === 'edit'
            ? 'Failed to update product'
            : 'Failed to create product'),
      );
    }
  };

  return (
    <Box sx={{ p: 3, mb: 2 }}>
      <Typography variant="h6" sx={{ p: 2, fontWeight: 'bold' }}>
        {mode === 'edit' ? 'Edit Product' : 'Create New Product'}
      </Typography>
      <Formik
        initialValues={initialValues}
        validationSchema={productSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, errors, touched, handleBlur, handleChange, isValid }) => (
          <Form>
            <Box>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <FormControl sx={{ width: '100%', mb: 2 }}>
                    <FormLabel htmlFor="name">Product Name</FormLabel>
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
                      disabled={isCreating}
                    />
                  </FormControl>
                  <FormControl sx={{ width: '100%', mb: 2 }}>
                    <FormLabel htmlFor="description">Description</FormLabel>
                    <Input
                      id="description"
                      name="description"
                      label=""
                      value={values.description}
                      placeholder="Enter product description"
                      multiline
                      rows={5}
                      isError={!!(touched.description && errors.description)}
                      errorText={errors.description}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={isCreating}
                    />
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <FormControl sx={{ width: '100%', mb: 2 }}>
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
                      disabled={isCreating}
                    />
                  </FormControl>
                  <FormControl sx={{ width: '100%', mb: 2 }}>
                    <FormLabel htmlFor="category">Category</FormLabel>
                    <TextField
                      select
                      fullWidth
                      name="category"
                      value={values.category}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={!!(touched.category && errors.category)}
                      helperText={errors.category}
                      disabled={isCreating}
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
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FormControl sx={{ width: '100%', mb: 2 }}>
                        <FormLabel htmlFor="price">Price (VND)</FormLabel>
                        <Input
                          id="price"
                          name="price"
                          label=""
                          typeInput="number"
                          value={
                            values.price === '' ? '' : String(values.price)
                          }
                          placeholder="0"
                          isError={!!(touched.price && errors.price)}
                          errorText={errors.price}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={isCreating}
                        />
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FormControl sx={{ width: '100%', mb: 2 }}>
                        <FormLabel htmlFor="stock">Stock Quantity</FormLabel>
                        <Input
                          id="stock"
                          name="stock"
                          label=""
                          typeInput="number"
                          value={
                            values.stock === '' ? '' : String(values.stock)
                          }
                          placeholder="0"
                          isError={!!(touched.stock && errors.stock)}
                          errorText={errors.stock}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={isCreating}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Card sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                      Product Preview
                    </Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 1,
                      }}
                    >
                      <Typography variant="subtitle1" color="text.secondary">
                        Product Name: &nbsp;
                      </Typography>
                      {values.name ? (
                        <Typography>{values.name}</Typography>
                      ) : (
                        <Typography
                          variant="body1"
                          sx={{ fontStyle: 'italic', color: 'text.disabled' }}
                        >
                          No Product Name
                        </Typography>
                      )}
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 1,
                      }}
                    >
                      <Typography variant="subtitle1" color="text.secondary">
                        Category: &nbsp;
                      </Typography>
                      {values.category ? (
                        <Chip
                          label={
                            PRODUCT_CATEGORY_OPTIONS.find(
                              (opt) => opt.value === values.category,
                            )?.label || values.category
                          }
                          size="small"
                          variant="outlined"
                          sx={{ mt: 0.5 }}
                        />
                      ) : (
                        <Typography
                          variant="body1"
                          sx={{
                            fontStyle: 'italic',
                            color: 'text.disabled',
                          }}
                        >
                          No Category
                        </Typography>
                      )}
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 1,
                      }}
                    >
                      <Typography variant="subtitle1" color="text.secondary">
                        SKU: &nbsp;
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {values.sku}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 1,
                      }}
                    >
                      <Typography variant="subtitle1" color="text.secondary">
                        Price: &nbsp;
                      </Typography>
                      <Typography
                        variant="body1"
                        color="primary.main"
                        sx={{ fontWeight: 'bold' }}
                      >
                        {values.price
                          ? new Intl.NumberFormat('vi-VN', {
                              style: 'currency',
                              currency: 'VND',
                            }).format(Number(values.price))
                          : '0 VND'}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 1,
                      }}
                    >
                      <Typography variant="subtitle1" color="text.secondary">
                        Stock: &nbsp;
                      </Typography>
                      <Chip
                        label={values.stock ? String(values.stock) : 0}
                        size="small"
                        color={
                          Number(values.stock) > 10
                            ? 'success'
                            : Number(values.stock) > 0
                              ? 'warning'
                              : 'default'
                        }
                      />
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
                      disabled={isTableLoading || isCreating}
                      // size="large"
                    >
                      Refresh
                    </Button>
                    {mode === 'edit' ? (
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="outlined"
                          color="inherit"
                          onClick={onClose}
                          disabled={isCreating}
                        >
                          Cancel
                        </Button>
                        <LoadingButton
                          type="submit"
                          loading={isCreating}
                          disabled={!isValid || isCreating}
                          textButton="Update Product"
                          variant="contained"
                        />
                      </Box>
                    ) : (
                      <LoadingButton
                        type="submit"
                        loading={isCreating}
                        disabled={!isValid || isCreating}
                        textButton="Add Product"
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

export default ProductForm;
