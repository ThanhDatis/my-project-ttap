// // src/utils/formatters/currency.ts
// import { type GridValueFormatter } from '@mui/x-data-grid';

// export const formatCurrency: GridValueFormatter = (params) => {
//   if (params.value == null) return '-';
//   return new Intl.NumberFormat('vi-VN', {
//     style: 'currency',
//     currency: 'VND'
//   }).format(params.value);
// };

// export const formatVND: GridValueFormatter = (params) => {
//   if (params.value == null) return '-';
//   const formatted = new Intl.NumberFormat('vi-VN').format(params.value);
//   return `${formatted} ₫`;
// };
