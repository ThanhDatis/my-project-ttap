export const paths = {
  home: '/',
  auth: {
    signin: '/auth/signin',
    signup: '/auth/signup',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
  },
  dashboard: '/dashboard',
  customers: '/customers',
  orders: '/orders',
  setting: '/setting',
  profile: '/profile',
  admin: {
    users: '/admin/users',
    system: '/admin/system',
  },
} as const;

export type PathKeys = keyof typeof paths;
