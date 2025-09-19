/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
import AttachMoneyRoundedIcon from '@mui/icons-material/AttachMoneyRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DateRangeRoundedIcon from '@mui/icons-material/DateRangeRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import PaymentRoundedIcon from '@mui/icons-material/PaymentRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Card,
} from '@mui/material';
import React from 'react';

import { type Order } from '../../../lib/order.repo';
import { formatDateTime, formatNumber } from '../../../utils';

interface OrderDetailDialogProps {
  open: boolean;
  onClose: () => void;
  order: Order | null;
  onEdit?: (order: Order) => void;
  onDelete?: (order: Order) => void;
}

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
    <Box sx={{ color: 'primary.main', display: 'flex', alignItems: 'center' }}>
      {icon}
    </Box>
    <Box sx={{ flex: 1 }}>
      <Typography variant="caption" color="text.secondary" display="block">
        {label}
      </Typography>
      <Box>{value}</Box>
    </Box>
  </Box>
);

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'warning';
    case 'processing':
      return 'info';
    case 'shipped':
      return 'primary';
    case 'delivered':
      return 'success';
    case 'cancelled':
      return 'error';
    default:
      return 'default';
  }
};

const getPaymentMethodLabel = (method: string) => {
  switch (method) {
    case 'cash':
      return 'Cash';
    case 'credit_card':
      return 'Credit Card';
    case 'bank_transfer':
      return 'Bank Transfer';
    case 'e_wallet':
      return 'E-Wallet';
    default:
      return method?.toUpperCase() || 'Unknown';
  }
};

export const OrderDetailDialog: React.FC<OrderDetailDialogProps> = ({
  open,
  onClose,
  order,
  onEdit,
  onDelete,
}) => {
  if (!order) {
    return null;
  }

  const getStatusChip = () => {
    const color = getStatusColor(order.status);
    return (
      <Chip
        label={order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
        color={color as any}
        size="small"
      />
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const formatShippingAddress = () => {
    if (!order.shippingAddress) return 'No shipping address';
    const { street, ward, district, city } = order.shippingAddress;
    return `${street}, ${ward}, ${district}, ${city}`;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
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
          pb: 1,
        }}
      >
        <Box>
          <Typography variant="h4" component="div">
            Order Details
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Order ID: #{order.orderId}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseRoundedIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h5" gutterBottom>
              Order Information
            </Typography>
            <InfoItem
              icon={<AttachMoneyRoundedIcon />}
              label="Total Amount"
              value={
                <Typography variant="h6" color="primary">
                  {formatPrice(order.total)}
                </Typography>
              }
            />

            <InfoItem
              icon={<DateRangeRoundedIcon />}
              label="Order Status"
              value={getStatusChip()}
            />

            <InfoItem
              icon={<PaymentRoundedIcon />}
              label="Payment Method"
              value={
                <Chip
                  label={getPaymentMethodLabel(order.paymentMethod)}
                  variant="outlined"
                  size="small"
                />
              }
            />

            <InfoItem
              icon={<DateRangeRoundedIcon />}
              label="Created"
              value={
                <Typography variant="body2">
                  {formatDateTime(order.createdAt)}
                </Typography>
              }
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h5" gutterBottom>
              Customer Information
            </Typography>

            <InfoItem
              icon={<PersonRoundedIcon />}
              label="Customer Name"
              value={
                <Typography variant="body2">{order.customerName}</Typography>
              }
            />

            {order.customerEmail && (
              <InfoItem
                icon={<EmailRoundedIcon />}
                label="Email"
                value={
                  <Typography variant="body2">{order.customerEmail}</Typography>
                }
              />
            )}

            {order.customerPhone && (
              <InfoItem
                icon={<PhoneRoundedIcon />}
                label="Phone"
                value={
                  <Typography variant="body2">{order.customerPhone}</Typography>
                }
              />
            )}
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Shipping Address
            </Typography>

            <Card sx={{ p: 2, bgcolor: 'grey.50' }}>
              <InfoItem
                icon={<LocationOnRoundedIcon />}
                label="Delivery Address"
                value={
                  <Typography variant="body1">
                    {formatShippingAddress()}
                  </Typography>
                }
              />

              {order.shippingAddress?.note && (
                <InfoItem
                  icon={<LocationOnRoundedIcon />}
                  label="Delivery Note"
                  value={
                    <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                      {order.shippingAddress.note}
                    </Typography>
                  }
                />
              )}
            </Card>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Order Items ({order.items?.length || 0} items)
            </Typography>

            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell>Product</TableCell>
                    <TableCell>SKU</TableCell>
                    <TableCell align="center">Quantity</TableCell>
                    <TableCell align="right">Unit Price</TableCell>
                    <TableCell align="right">Line Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items?.map((item) => (
                    <TableRow key={item.id || item.productId}>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {item.productName}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontFamily: 'monospace' }}
                        >
                          {item.sku}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={formatNumber(item.quantity)}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2">
                          {formatPrice(item.price)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {formatPrice(item.lineTotal)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Card sx={{ p: 2, bgcolor: 'grey.50' }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6, md: 4 }}>
                  <Box sx={{ textAlign: 'right' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mb: 1,
                      }}
                    >
                      <Typography variant="h6">Subtotal:</Typography>
                      <Typography variant="h6">
                        {formatPrice(order.subtotal)}
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
                        {formatPrice(order.total)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0, gap: 1 }}>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
        {onEdit && (
          <Button
            onClick={() => onEdit(order)}
            variant="contained"
            startIcon={<EditRoundedIcon />}
          >
            Edit Order
          </Button>
        )}
        {onDelete && (
          <Button
            onClick={() => onDelete(order)}
            variant="outlined"
            color="error"
            startIcon={<DeleteRoundedIcon />}
          >
            Delete Order
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default OrderDetailDialog;
