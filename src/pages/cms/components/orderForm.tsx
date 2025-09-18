/* eslint-disable @typescript-eslint/no-explicit-any */
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Paper,
  Divider,
  Autocomplete,
  FormControl,
  FormLabel,
  Card,
} from '@mui/material';
import dayjs from 'dayjs';
import { Formik, Form, type FormikHelpers } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';
import * as Yup from 'yup';

import { Input } from '../../../components/fields';
import LoadingButton from '../../../components/loadingButton';
import ToastMessage from '../../../components/toastMessage';
import { useDebounce } from '../../../hooks/useDebounce';
import {
  type OrderPayload,
  type CustomerAutocomplete,
  type ProductForOrder,
  type ShippingAddress,
} from '../../../lib/order.repo';
import { useOrderStore } from '../../../store';

interface OrderItem {
  id: string;
  productId?: string;
  productName: string;
  sku: string;
  quantity: number;
  price: number;
  lineTotal: number;
}

interface OrderFormData {
  orderId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  paymentMethod: string;
  shippingAddress: {
    street: string;
    ward: string;
    district: string;
    city: string;
    note?: string;
  };
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
}

interface OrderFormProps {
  onSubmit: (data: OrderPayload) => void;
  onCancel: () => void;
  initialData?: Partial<OrderFormData>;
}

const validationSchema = Yup.object({
  customerId: Yup.string().required('Customer is required'),
  customerName: Yup.string().required('Customer name is required'),
  customerEmail: Yup.string().email('Invalid email'),
  customerPhone: Yup.string(),
  paymentMethod: Yup.string().required('Payment method is required'),
  shippingAddress: Yup.object({
    street: Yup.string().required('Street is required'),
    ward: Yup.string().required('Ward is required'),
    district: Yup.string().required('District is required'),
    city: Yup.string().required('City is required'),
    note: Yup.string(),
  }),
  tax: Yup.number().min(0, 'Tax must be positive').default(0),
  notes: Yup.string(),
});

const OrderForm: React.FC<OrderFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
}) => {
  const {
    customers,
    products,
    isLoadingCustomers,
    isLoadingProducts,
    fetchCustomers,
    fetchProducts,
  } = useOrderStore();
  console.log('initialData:', initialData);

  const uniqueCustomers = React.useMemo(() => {
    const map = new Map<string, CustomerAutocomplete>();
    customers.forEach((c: CustomerAutocomplete) => {
      if (!map.has(c._id)) {
        map.set(c._id, c);
      }
    });
    return Array.from(map.values());
  }, [customers]);

  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [customerSearch, setCustomerSearch] = useState('');
  const [productSearch, setProductSearch] = useState<Record<string, string>>(
    {},
  );
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerAutocomplete | null>(null);
  const debouncedCustomerSearch = useDebounce(customerSearch, 350);

  useEffect(() => {
    fetchCustomers();
    fetchProducts();
  }, [fetchCustomers, fetchProducts]);

  useEffect(() => {
    if (debouncedCustomerSearch) {
      fetchCustomers(debouncedCustomerSearch);
    }
  }, [debouncedCustomerSearch, fetchCustomers]);

  const handleProductSearch = useCallback(
    (itemId: string, search: string) => {
      setProductSearch((prev) => ({ ...prev, [itemId]: search }));
      const q = search.trim();
      fetchProducts(q ? q : undefined);
    },
    [fetchProducts],
  );

  const paymentMethods = [
    { value: 'credit_card', label: 'Credit Card' },
    { value: 'cash', label: 'Cash' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'e_wallet', label: 'E-Wallet' },
  ];

  const initialValues: OrderFormData = {
    orderId: initialData?.orderId ?? '',
    customerId: initialData?.customerId ?? selectedCustomer?._id ?? '',
    customerName: initialData?.customerName ?? selectedCustomer?.name ?? '',
    customerEmail: initialData?.customerEmail ?? selectedCustomer?.email ?? '',
    customerPhone: initialData?.customerPhone ?? selectedCustomer?.phone ?? '',
    paymentMethod: initialData?.paymentMethod ?? '',
    shippingAddress: {
      street: initialData?.shippingAddress?.street ?? '',
      ward: initialData?.shippingAddress?.ward ?? '',
      district: initialData?.shippingAddress?.district ?? '',
      city: initialData?.shippingAddress?.city ?? '',
      note: initialData?.shippingAddress?.note ?? '',
    },
    items: initialData?.items ?? [],
    subtotal: 0,
    total: 0,
    tax: initialData?.tax ?? 0,
    // notes: initialData?.notes ?? '',
  };

  const calculateSubtotal = useCallback(
    (items: OrderItem[], tax: number = 0) => {
      const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
      const total = subtotal + tax;
      return { subtotal, total };
    },
    [],
  );

  const [orderId, setOrderId] = useState('');
  useEffect(() => {
    if (initialData?.orderId) {
      setOrderId(initialData.orderId);
    } else {
      setOrderId(`ORD-${dayjs().format('YYMMDDHHmmssSSS')}`);
    }
  }, [initialData]);

  const addOrderItem = () => {
    const newItem: OrderItem = {
      id: `item-${Date.now()}`,
      productId: '',
      productName: '',
      sku: '',
      quantity: 1,
      price: 0,
      lineTotal: 0,
    };
    setOrderItems([...orderItems, newItem]);
  };

  const removeOrderItem = (id: string) => {
    setOrderItems(orderItems.filter((item) => item.id !== id));
  };

  const updateOrderItem = (id: string, field: keyof OrderItem, value: any) => {
    setOrderItems(
      orderItems.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };

          if (field === 'quantity' || field === 'price') {
            updatedItem.lineTotal = updatedItem.quantity * updatedItem.price;
          }

          if (field === 'productId') {
            const selectedProduct = products.find((p) => p._id === value);
            if (selectedProduct) {
              updatedItem.productName = selectedProduct.name;
              updatedItem.sku = selectedProduct.sku;
              updatedItem.price = selectedProduct.price;
              updatedItem.lineTotal =
                updatedItem.quantity * selectedProduct.price;
            }
          }

          return updatedItem;
        }
        return item;
      }),
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const handleSubmit = (
    values: OrderFormData,
    helpers: FormikHelpers<OrderFormData>,
  ) => {
    if (orderItems.length === 0) {
      ToastMessage('error', 'Please add at least one order item');
      return;
    }

    const invalidItems = orderItems.filter(
      (item) =>
        !item.productId ||
        !item.productName ||
        item.quantity <= 0 ||
        item.price < 0,
    );
    if (invalidItems.length > 0) {
      ToastMessage('error', 'Please complete all order item details');
      return;
    }

    try {
      const { subtotal, total } = calculateSubtotal(orderItems, 0);

      const shippingAddress: ShippingAddress = {
        street: values.shippingAddress.street,
        ward: values.shippingAddress.ward,
        district: values.shippingAddress.district,
        city: values.shippingAddress.city,
        note: values.shippingAddress.note ?? '',
      };
      const orderData: OrderPayload = {
        orderId,
        customerId: values.customerId,
        customerName: values.customerName,
        customerEmail: values.customerEmail || undefined,
        customerPhone: values.customerPhone || undefined,
        paymentMethod: values.paymentMethod as any,
        shippingAddress,
        subtotal,
        total,
        items: orderItems.map((item) => ({
          productId: item.productId!,
          productName: item.productName,
          sku: item.sku,
          quantity: item.quantity,
          price: item.price,
        })),
      };
      onSubmit(orderData);
      helpers.resetForm();
      setOrderItems([]);
      setSelectedCustomer(null);
    } catch (error) {
      console.error('Error submitting order:', error);
    }
  };

  const handleCustomerSelect = (customer: CustomerAutocomplete | null) => {
    setSelectedCustomer(customer);
  };

  const { subtotal, total } = calculateSubtotal(orderItems, 0);

  return (
    <Box>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          setFieldValue,
          isSubmitting,
        }) => (
          <Form>
            <Typography
              variant="h5"
              sx={{
                mb: 2,
                display: 'flex',
                justifyContent: 'flex-start',
                color: 'text.secondary',
              }}
            >
              Order ID:&nbsp;{orderId}
            </Typography>
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{
                mb: 1,
                textAlign: 'left',
              }}
            >
              Shipping Information
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, md: 4 }}>
                <FormControl fullWidth>
                  <FormLabel>Customer Name</FormLabel>
                  <Autocomplete
                    options={uniqueCustomers}
                    getOptionLabel={(option) => option.name || ''}
                    isOptionEqualToValue={(option, value) =>
                      option._id === value._id
                    }
                    value={
                      uniqueCustomers.find(
                        (c) => c._id === values.customerId,
                      ) ||
                      selectedCustomer ||
                      null
                    }
                    onChange={(_, newValue) => {
                      handleCustomerSelect(newValue);
                      setFieldValue('customerId', newValue?._id || '');
                      setFieldValue('customerName', newValue?.name || '');
                      setFieldValue('customerEmail', newValue?.email || '');
                      setFieldValue('customerPhone', newValue?.phone || '');
                    }}
                    onInputChange={(_, newInputValue) => {
                      setCustomerSearch(newInputValue);
                    }}
                    loading={isLoadingCustomers}
                    renderOption={(props, option) => (
                      <li {...props} key={option._id}>
                        {option.name} {option.email && ` - ${option.email}`}
                      </li>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Search customers..."
                        error={!!(errors.customerId && touched.customerId)}
                        helperText={errors.customerId}
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <FormControl fullWidth>
                  <FormLabel>Customer Email</FormLabel>
                  <Input
                    label={''}
                    name="customerEmail"
                    typeInput="email"
                    value={values.customerEmail}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isError={!!(errors.customerEmail && touched.customerEmail)}
                    errorText={errors.customerEmail}
                    disabled={isSubmitting}
                  />
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <FormControl fullWidth>
                  <FormLabel>Customer Phone</FormLabel>
                  <Input
                    label={''}
                    name="customerPhone"
                    value={values.customerPhone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isError={!!(errors.customerPhone && touched.customerPhone)}
                    errorText={errors.customerPhone}
                    disabled={isSubmitting}
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
              Shipping Address
            </Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, md: 4 }}>
                <FormControl sx={{ width: '100%', mb: 2 }}>
                  <FormLabel>Street</FormLabel>
                  <Input
                    label={''}
                    name="shippingAddress.street"
                    value={values.shippingAddress.street}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isError={
                      !!(
                        errors.shippingAddress?.street &&
                        touched.shippingAddress?.street
                      )
                    }
                    errorText={errors.shippingAddress?.street}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormControl sx={{ width: '100%', mb: 2 }}>
                  <FormLabel>Ward</FormLabel>
                  <Input
                    label={''}
                    name="shippingAddress.ward"
                    value={values.shippingAddress.ward}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isError={
                      !!(
                        errors.shippingAddress?.ward &&
                        touched.shippingAddress?.ward
                      )
                    }
                    errorText={errors.shippingAddress?.ward}
                    disabled={isSubmitting}
                  />
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <FormControl sx={{ width: '100%', mb: 2 }}>
                  <FormLabel>District</FormLabel>
                  <Input
                    label={''}
                    name="shippingAddress.district"
                    value={values.shippingAddress.district}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isError={
                      !!(
                        errors.shippingAddress?.district &&
                        touched.shippingAddress?.district
                      )
                    }
                    errorText={errors.shippingAddress?.district}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormControl sx={{ width: '100%', mb: 2 }}>
                  <FormLabel>City/Province</FormLabel>
                  <Input
                    label={''}
                    name="shippingAddress.city"
                    value={values.shippingAddress.city}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isError={
                      !!(
                        errors.shippingAddress?.city &&
                        touched.shippingAddress?.city
                      )
                    }
                    errorText={errors.shippingAddress?.city}
                    disabled={isSubmitting}
                  />
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <FormControl sx={{ width: '100%', mb: 2 }}>
                  <FormLabel>Notes</FormLabel>
                  <Input
                    label={''}
                    name="shippingAddress.note"
                    multiline
                    minRows={4}
                    value={values.shippingAddress.note}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={isSubmitting}
                    isError={false}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <Divider sx={{ my: 3 }} />
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{
                mb: 1,
                textAlign: 'left',
              }}
            >
              Payment Method
            </Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, md: 4 }}>
                <FormControl fullWidth>
                  <FormLabel>Payment Method</FormLabel>
                  <TextField
                    select
                    name="paymentMethod"
                    value={values.paymentMethod}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={!!(errors.paymentMethod && touched.paymentMethod)}
                    helperText={errors.paymentMethod}
                    disabled={isSubmitting}
                  >
                    {paymentMethods.map((method) => (
                      <MenuItem key={method.value} value={method.value}>
                        {method.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}></Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ mb: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  mb: 2,
                }}
              >
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={addOrderItem}
                  size="small"
                >
                  Add Item
                </Button>
              </Box>

              {orderItems.length === 0 ? (
                <Card sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.50' }}>
                  <Typography color="text.secondary">
                    No items added. Click "Add Item" to start building your
                    order.
                  </Typography>
                </Card>
              ) : (
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: 'grey.50' }}>
                        <TableCell align="center">Product</TableCell>
                        <TableCell align="center">SKU</TableCell>
                        <TableCell align="center">Quantity</TableCell>
                        <TableCell align="center">Unit Price</TableCell>
                        <TableCell align="center">Line Total</TableCell>
                        <TableCell width={60} align="center">
                          Action
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orderItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Autocomplete
                              options={products}
                              getOptionLabel={(option) => option?.name || ''}
                              isOptionEqualToValue={(option, value) =>
                                option._id === value._id
                              }
                              onOpen={() => fetchProducts(undefined)}
                              value={
                                item.productId
                                  ? ({
                                      _id: item.productId,
                                      name: item.productName,
                                      sku: item.sku,
                                      price: item.price,
                                    } as ProductForOrder)
                                  : null
                              }
                              onChange={(_, newValue) => {
                                updateOrderItem(
                                  item.id,
                                  'productId',
                                  newValue?._id || '',
                                );
                                fetchProducts(undefined);
                              }}
                              onInputChange={(_, newInputValue) => {
                                handleProductSearch(item.id, newInputValue);
                              }}
                              filterOptions={(x) => x}
                              loading={isLoadingProducts}
                              renderOption={(props, option) => (
                                <li {...props} key={option._id}>
                                  {option.name}{' '}
                                  {option.sku && ` - ${option.sku}`}
                                </li>
                              )}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  placeholder="Search products..."
                                  sx={{ minWidth: 200 }}
                                />
                              )}
                            />
                          </TableCell>

                          <TableCell>
                            <TextField
                              size="small"
                              value={item.sku}
                              disabled
                              sx={{ minWidth: 100 }}
                            />
                          </TableCell>

                          <TableCell>
                            <TextField
                              size="small"
                              type="number"
                              value={item.quantity}
                              onChange={(e) =>
                                updateOrderItem(
                                  item.id,
                                  'quantity',
                                  Math.max(1, Number(e.target.value)),
                                )
                              }
                              sx={{ width: 80 }}
                              inputProps={{ min: 1 }}
                            />
                          </TableCell>

                          <TableCell align="center">
                            <TextField
                              size="small"
                              type="number"
                              value={item.price}
                              disabled
                              sx={{ minWidth: 120 }}
                              inputProps={{ min: 0, step: 1000 }}
                            />
                          </TableCell>

                          <TableCell align="right">
                            <Typography sx={{ fontWeight: 600, minWidth: 100 }}>
                              {formatCurrency(item.lineTotal)}
                            </Typography>
                          </TableCell>

                          <TableCell align="center">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => removeOrderItem(item.id)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>

            {orderItems.length > 0 && (
              <Card sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Grid container>
                  <Grid size={{ xs: 12, md: 8 }}></Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Box sx={{ textAlign: 'right' }}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          mb: 1,
                        }}
                      >
                        <Typography>Subtotal:</Typography>
                        <Typography>{formatCurrency(subtotal)}</Typography>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          mb: 1,
                        }}
                      >
                        <Typography>Tax:</Typography>
                        <Typography>
                          {formatCurrency(values.tax || 0)}
                        </Typography>
                      </Box>
                      <Divider sx={{ my: 1 }} />
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Typography variant="h6">Total:</Typography>
                        <Typography variant="h6" color="primary">
                          {formatCurrency(total + (values.tax || 0))}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Card>
            )}

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <LoadingButton
                textButton="Create Order"
                loading={isSubmitting}
                type="submit"
                variant="contained"
                disabled={orderItems.length === 0 || !values.customerId}
                sxButton={{
                  bgcolor: '#4ade80',
                  '&:hover': { bgcolor: '#22c55e' },
                  minWidth: 120,
                }}
              />

              <Button
                variant="outlined"
                onClick={onCancel}
                disabled={isSubmitting}
                sx={{ minWidth: 120 }}
              >
                Cancel
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default OrderForm;
