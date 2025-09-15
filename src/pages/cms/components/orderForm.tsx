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
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import React, { useState } from 'react';
import * as Yup from 'yup';

import { Input } from '../../../components/fields';
import LoadingButton from '../../../components/loadingButton';

interface OrderItem {
  id: string;
  productName: string;
  sku: string;
  quantity: number;
  price: number;
  lineTotal: number;
}

interface OrderFormData {
  customerId: string;
  customerName: string;
  email: string;
  phone: string;
  paymentMethod: string;
  items: OrderItem[];
  subtotal: number;
  total: number;
}

interface OrderFormProps {
  onSubmit: (data: OrderFormData) => void;
  onCancel: () => void;
  initialData?: Partial<OrderFormData>;
}

const validationSchema = Yup.object({
  customerName: Yup.string().required('Customer name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().required('Phone number is required'),
  paymentMethod: Yup.string().required('Payment method is required'),
});

const OrderForm: React.FC<OrderFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
}) => {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    {
      id: '1',
      productName: 'Sport',
      sku: 'HHH-776',
      quantity: 8,
      price: 7000000,
      lineTotal: 56000000,
    },
    {
      id: '2',
      productName: 'Car',
      sku: 'CCC-225',
      quantity: 2,
      price: 800000,
      lineTotal: 1600000,
    },
  ]);

  // Mock products for dropdown (replace with real data)
  const mockProducts = [
    { id: '1', name: 'Sport', sku: 'HHH-776', price: 7000000 },
    { id: '2', name: 'Car', sku: 'CCC-225', price: 800000 },
    { id: '3', name: 'Phone', sku: 'PHN-123', price: 15000000 },
    { id: '4', name: 'Laptop', sku: 'LPT-456', price: 25000000 },
  ];

  const paymentMethods = [
    { value: 'cash', label: 'Cash' },
    { value: 'credit_card', label: 'Credit Card' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'e_wallet', label: 'E-Wallet' },
  ];

  const initialValues: OrderFormData = {
    customerId: '',
    customerName: '',
    email: '',
    phone: '',
    paymentMethod: '',
    items: orderItems,
    subtotal: 0,
    total: 0,
    ...initialData,
  };

  const calculateSubtotal = () => {
    return orderItems.reduce((sum, item) => sum + item.lineTotal, 0);
  };

  const addOrderItem = () => {
    const newItem: OrderItem = {
      id: Date.now().toString(),
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

          // Recalculate line total when quantity or price changes
          if (field === 'quantity' || field === 'price') {
            updatedItem.lineTotal = updatedItem.quantity * updatedItem.price;
          }

          // Auto-fill SKU and price when product is selected
          if (field === 'productName') {
            const selectedProduct = mockProducts.find((p) => p.name === value);
            if (selectedProduct) {
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
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  const handleSubmit = (values: OrderFormData) => {
    const finalData = {
      ...values,
      items: orderItems,
      subtotal: calculateSubtotal(),
      total: calculateSubtotal(), // Add tax calculation if needed
    };
    onSubmit(finalData);
  };

  return (
    <Box>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          isSubmitting,
        }) => (
          <Form>
            <Typography
              variant="h5"
              sx={{
                mb: 2,
                display: 'flex',
                justifyContent: 'flex-start',
              }}
            >
              Order ID: #####
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Field name="customerName">
                  {({ field }: any) => (
                    <Input
                      {...field}
                      label="Customer"
                      isError={!!(errors.customerName && touched.customerName)}
                      errorText={errors.customerName}
                    />
                  )}
                </Field>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Field name="email">
                  {({ field }: any) => (
                    <Input
                      {...field}
                      label="Email"
                      typeInput="email"
                      isError={!!(errors.email && touched.email)}
                      errorText={errors.email}
                    />
                  )}
                </Field>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Field name="phone">
                  {({ field }: any) => (
                    <Input
                      {...field}
                      label="Phone Number"
                      isError={!!(errors.phone && touched.phone)}
                      errorText={errors.phone}
                    />
                  )}
                </Field>
              </Grid>
            </Grid>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  select
                  fullWidth
                  label="Payment Method"
                  name="paymentMethod"
                  value={values.paymentMethod}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!(errors.paymentMethod && touched.paymentMethod)}
                  helperText={errors.paymentMethod}
                >
                  {paymentMethods.map((method) => (
                    <MenuItem key={method.value} value={method.value}>
                      {method.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
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

              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                      <TableCell>NAME PRODUCT</TableCell>
                      <TableCell>SKU</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Line Total</TableCell>
                      <TableCell width={60}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orderItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <TextField
                            select
                            size="small"
                            value={item.productName}
                            onChange={(e) =>
                              updateOrderItem(
                                item.id,
                                'productName',
                                e.target.value,
                              )
                            }
                            sx={{ minWidth: 150 }}
                          >
                            {mockProducts.map((product) => (
                              <MenuItem key={product.id} value={product.name}>
                                {product.name}
                              </MenuItem>
                            ))}
                          </TextField>
                        </TableCell>

                        <TableCell>
                          <TextField
                            size="small"
                            value={item.sku}
                            onChange={(e) =>
                              updateOrderItem(item.id, 'sku', e.target.value)
                            }
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
                                Number(e.target.value),
                              )
                            }
                            sx={{ width: 80 }}
                            inputProps={{ min: 1 }}
                          />
                        </TableCell>

                        <TableCell>
                          <TextField
                            size="small"
                            type="number"
                            value={item.price}
                            onChange={(e) =>
                              updateOrderItem(
                                item.id,
                                'price',
                                Number(e.target.value),
                              )
                            }
                            sx={{ minWidth: 120 }}
                          />
                        </TableCell>

                        <TableCell>
                          <Typography sx={{ fontWeight: 600 }}>
                            {formatCurrency(item.lineTotal)}
                          </Typography>
                        </TableCell>

                        <TableCell>
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
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Subtotal: {formatCurrency(calculateSubtotal())}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <LoadingButton
                textButton="Add Order"
                loading={isSubmitting}
                type="submit"
                variant="contained"
                sxButton={{
                  bgcolor: '#4ade80',
                  '&:hover': { bgcolor: '#22c55e' },
                  minWidth: 120,
                }}
              />

              <Button
                variant="outlined"
                onClick={onCancel}
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
