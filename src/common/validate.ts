import * as Yup from 'yup';

const validateEmail = Yup.string()
  .email('Email is not valid')
  .required('Email is required');

const validatePasswordSignIn = Yup.string().required('Password is required');

const validatePasswordSignUp = Yup.string()
  .min(6, 'Password must be at least 6 characters')
  .required('Password is required');

const validateName = Yup.string()
  .min(2, 'Name is too short')
  .max(100, 'Name is too long')
  .required('Name is required');

const validatePhone = Yup.string()
  .min(10, 'Phone number is too short')
  .max(15, 'Phone number is too long')
  .required('Phone number is required');

const validateConfirmPassword = Yup.string()
  .oneOf([Yup.ref('password')], 'Passwords must match')
  .required('Confirm password is required');

const validateAcceptTerms = Yup.boolean()
  .oneOf([true], 'You must accept the terms and conditions')
  .required('You must accept the terms and conditions');

const validateProductName = Yup.string()
  .min(2, 'Product name is too short')
  .max(100, 'Product name is too long')
  .required('Product name is required');

const validateProductDescription = Yup.string()
  .min(10, 'Product description is too short')
  .max(500, 'Product description is too long')
  .required('Product description is required');

const validateProductPrice = Yup.number()
  .positive('Price must be a positive number')
  .required('Price is required');

const validateProductStock = Yup.number()
  .integer('Stock must be a whole number')
  .min(0, 'Stock must be at least 0')
  .required('Stock is required');

const validateCategory = Yup.string().required('Category is required');

const validateSku = Yup.string()
  .matches(
    /^[a-zA-Z0-9-_]+$/,
    'SKU can only contain letters, numbers, hyphens, and underscores',
  )
  .max(50, 'SKU must be less than 50 characters');

export {
  validateEmail,
  validatePasswordSignIn,
  validatePasswordSignUp,
  validatePhone,
  validateName,
  validateConfirmPassword,
  validateAcceptTerms,
  validateProductName,
  validateProductDescription,
  validateProductStock,
  validateCategory,
  validateSku,
  validateProductPrice,
};
