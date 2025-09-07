export const DRAWER_WIDTH = 240;
export const DRAWER_WIDTH_PRODUCT_MOBILE = '90%';
export const HEIGHT_HEADER_SIDE_BAR = 70;

export const ROUTES = {
  AUTH: {
    SIGNIN: '/auth/signin',
    SIGNUP: '/auth/signup',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  DASHBOARD: '/dashboard',
  PRODUCTS: '/products',
  CUSTOMERS: '/customers',
  ORDERS: '/orders',
  EMPLOYEES: '/employees',
  SETTING: '/setting',
  PROFILE: '/profile',
} as const;

export const PAGE_SIZES = [10, 20, 30, 50] as const;

export const DEFAULT_PAGE_SIZE = 10;
