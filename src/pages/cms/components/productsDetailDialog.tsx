/* eslint-disable no-unused-vars */
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  // ShoppingCart as CartIcon,
  Inventory as InventoryIcon,
  AttachMoney as MoneyIcon,
  Category as CategoryIcon,
  DateRange as DateIcon,
} from '@mui/icons-material';
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
  Grid as Grid,
  Card,
  CardMedia,
  IconButton,
  Avatar,
} from '@mui/material';
import React from 'react';

import { type Product } from '../../../lib/product.repo';
import { formatDateTime, formatNumber } from '../../../utils';

interface ProductDetailDialogProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
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

export const ProductDetailDialog: React.FC<ProductDetailDialogProps> = ({
  open,
  onClose,
  product,
  onEdit,
  onDelete,
}) => {
  if (!product) {
    return null;
  }

  const getStatusChip = () => {
    if (product.stock === 0) {
      return <Chip label="Out of Stock" color="error" size="small" />;
    }

    switch (product.status) {
      case 'active':
        return <Chip label="Active" color="success" size="small" />;
      case 'inactive':
        return <Chip label="Inactive" color="default" size="small" />;
      default:
        return <Chip label="Unknown" color="default" size="small" />;
    }
  };

  const getStockChip = () => {
    const stock = product.stock || 0;
    const color = stock > 10 ? 'success' : stock > 0 ? 'warning' : 'error';

    return (
      <Chip
        label={formatNumber(stock)}
        color={color}
        variant={stock === 0 ? 'filled' : 'outlined'}
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

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
          pb: 1,
        }}
      >
        <Box>
          <Typography variant="h6" component="div">
            Product Details
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {product.sku && `SKU: ${product.sku}`}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            {product.images && product.images.length > 0 ? (
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={product.images[0]}
                  alt={product.name}
                  sx={{ objectFit: 'contain' }}
                />
              </Card>
            ) : (
              <Card
                sx={{
                  height: 200,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: 2,
                    fontSize: '2rem',
                  }}
                  variant="rounded"
                >
                  {product.name?.charAt(0)?.toUpperCase()}
                </Avatar>
              </Card>
            )}
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h5" gutterBottom>
                {product.name}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                {getStatusChip()}
                <Chip
                  label={product.category}
                  variant="outlined"
                  size="small"
                  sx={{ textTransform: 'capitalize' }}
                />
              </Box>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <InfoItem
                  icon={<MoneyIcon />}
                  label="Price"
                  value={
                    <Typography variant="h6" color="primary">
                      {formatPrice(product.price)}
                    </Typography>
                  }
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <InfoItem
                  icon={<InventoryIcon />}
                  label="Stock"
                  value={getStockChip()}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <InfoItem
                  icon={<CategoryIcon />}
                  label="Category"
                  value={
                    <Typography sx={{ textTransform: 'capitalize' }}>
                      {product.category}
                    </Typography>
                  }
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <InfoItem
                  icon={<DateIcon />}
                  label="Created"
                  value={
                    <Typography variant="body2">
                      {formatDateTime(product.createdAt)}
                    </Typography>
                  }
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Description */}
          <Grid size={{ xs: 12 }}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ lineHeight: 1.6 }}
            >
              {product.description}
            </Typography>
          </Grid>

          {/* Additional Images */}
          {product.images && product.images.length > 1 && (
            <Grid size={{ xs: 12 }}>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Additional Images
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {product.images.slice(1).map((image, index) => (
                  <Card key={index} sx={{ width: 100, height: 100 }}>
                    <CardMedia
                      component="img"
                      width="100%"
                      height="100%"
                      image={image}
                      alt={`${product.name} ${index + 2}`}
                      sx={{ objectFit: 'contain' }}
                    />
                  </Card>
                ))}
              </Box>
            </Grid>
          )}

          {/* Metadata */}
          {(product.updatedAt || product.createdAt) && (
            <Grid size={{ xs: 12 }}>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Timestamps
              </Typography>
              <Box sx={{ display: 'flex', gap: 4 }}>
                {product.createdAt && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Created
                    </Typography>
                    <Typography variant="body2">
                      {formatDateTime(product.createdAt)}
                    </Typography>
                  </Box>
                )}
                {product.updatedAt && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Last Updated
                    </Typography>
                    <Typography variant="body2">
                      {formatDateTime(product.updatedAt)}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0, gap: 1 }}>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
        {onEdit && (
          <Button
            onClick={() => onEdit(product)}
            variant="contained"
            startIcon={<EditIcon />}
          >
            Edit
          </Button>
        )}
        {onDelete && (
          <Button
            onClick={() => onDelete(product)}
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ProductDetailDialog;
