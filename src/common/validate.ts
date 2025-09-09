/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Yup from 'yup';

const normalizeString = (value: string) =>
  typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : value;

/**------------------EMAIL------------------ */
const EMAIL_REGEX_SIMPLE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const baseEmail = Yup.string()
  .transform(normalizeString)
  // .matches(EMAIL_REGEX_SIMPLE, 'Email is not valid')
  .test(
    'no-spaces',
    'Email cannot contain spaces',
    (value) => !value || !/\s/.test(value),
  )
  .max(254, 'Email is too long');

export const validateEmailSignUp = baseEmail
  .email('Please enter a valid email address')
  .required('Email is required');

export const validateEmailSignIn = baseEmail.test(
  'sign-email',
  'Email is not valid',
  (value) => !!value && EMAIL_REGEX_SIMPLE.test(value),
);

export const validateEmailFormInfo = validateEmailSignUp;

/**------------Password--------------- */
const noSpaces = (msg = 'Password cannot contain spaces') =>
  Yup.string().test(
    'no-spaces',
    msg,
    (value) => (value ?? '') === '' || !/\s/.test(String(value)),
  );

const withMaxLen = (schema: Yup.StringSchema, max = 128) =>
  schema.max(max, `Password must be at most max ${max} characters`);

export const validatePasswordSignIn = withMaxLen(
  noSpaces().required('Password is required'),
);

export const validatePasswordSignUp = withMaxLen(
  noSpaces()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-z]/, 'Include at least one lowercase letter')
    .matches(/[A-Z]/, 'Include at least one uppercase letter')
    .matches(/\d/, 'Include at least one number')
    .matches(/[^A-Za-z0-9]/, 'Include at least one special character')
    .required('Password is required'),
);

export const validateConfirmPassword = (passwordField: string = 'password') =>
  withMaxLen(
    noSpaces()
      .oneOf([Yup.ref(passwordField)], 'Passwords must match')
      .required('Confirm password is required'),
  );

/**------------------NAME------------------ */
export const validateName = Yup.string()
  .transform(normalizeString)
  .min(2, 'Name is too short')
  .max(100, 'Name is too long')
  .required('Name is required');

/**------------------PHONE NUMBER------------------ */
const phoneRegex = /^(0[1-9]{1}[0-9]{8}|(\+84)[1-9]{1}[0-9]{8})$/;

export const validatePhone = Yup.string()
  .transform(normalizeString)
  .matches(phoneRegex, 'Phone number is not valid')
  .required('Phone number is required');

// export const phoneOptional = Yup.string()
//   .transform(normalizeString)
//   .matches(phoneRegex, 'Phone number is not valid')
//   .nullable()
//   .optional();

const validateAcceptTerms = Yup.boolean()
  .oneOf([true], 'You must accept the terms and conditions')
  .required('You must accept the terms and conditions');

/**------------DESCRIPTION--------------- */
export const validateProductDescription = Yup.string()
  .min(10, 'Product description is too short')
  .max(500, 'Product description is too long')
  .required('Product description is required');

/**------------NUMBER FIELDS--------------- */
export const validatePrice = Yup.number()
  .typeError('Price must be a number')
  .moreThan(0, 'Price must be a positive number')
  .required('Price is required');

export const validateStock = Yup.number()
  .typeError('Stock must be a number')
  .integer('Stock must be a whole number')
  .min(0, 'Stock must be at least 0')
  .required('Stock is required');

const validateCategory = Yup.string().required('Category is required');

/**------------SKU--------------- */
const skuRegex = /^[a-zA-Z0-9-_]+$/;

export const validateSku = Yup.string()
  .matches(
    skuRegex,
    'SKU can only contain letters, numbers, hyphens, and underscores',
  )
  .max(50, 'SKU must be less than 50 characters');

/**------------ADDRESS--------------- */
export const ADDRESS_LINE_REGEX = /^[\p{L}\p{M}\p{N}\s\\.\-\\/,()#'"]+$/u;
export const PLACE_NAME_REGEX = /^[\p{L}\p{M}\s\\.\-()'"]+$/u;

const baseAddressLine = Yup.string()
  .transform(normalizeString)
  .max(200, 'Address is too long')
  .matches(ADDRESS_LINE_REGEX, 'Address contains invalid characters')
  .nullable()
  .optional();

const basePlaceName = Yup.string()
  .transform(normalizeString)
  .max(100, (ctx: any) => `${ctx.path} is too long`)
  .matches(
    PLACE_NAME_REGEX,
    (ctx: any) => `${ctx?.label || 'Field'} contains invalid characters`,
  )
  .nullable()
  .optional();

export const validateAddress = baseAddressLine.label('Address');
export const validateCity = basePlaceName.label('City name');
export const validateWard = basePlaceName.label('Ward name');
export const validateDistrict = basePlaceName.label('District name');

// export const requiredCity = basePlaceName
//   .label('City name')
//   .required('City name is required');
// export const requiredDistrict = basePlaceName
//   .label('District name')
//   .required('District name is required');
// export const requiredWard = basePlaceName
//   .label('Ward name')
//   .required('Ward name is required');

export { validateAcceptTerms, validateCategory };
