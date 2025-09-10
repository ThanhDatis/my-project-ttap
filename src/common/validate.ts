/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Yup from 'yup';

import type { EmployeeStatus, Gender, Role } from '../lib/employee.repo';

const normalizeString = (value: unknown) =>
  typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : value;

export const toUndef = (v?: string | null) => {
  if (typeof v !== 'string') return undefined;
  const s = v.trim();
  return s ? s : undefined;
};

export const normalizeEmail = (e?: string | null) => {
  const s = toUndef(e);
  return s ? s.toLowerCase() : undefined;
};

const normalizePhone = (raw?: string) => {
  if (!raw) return undefined;
  const s = String(raw).replace(/\D+/g, '');
  if (s.startsWith('+84')) {
    const digits = s.slice(3).replace(/\D/g, '');
    return digits.length >= 9 && digits.length <= 10
      ? `+84${digits}`
      : undefined;
  }
  if (/^0\d{9,10}$/.test(s)) return `+84${s.slice(1)}`;
  if (/^84\d{9,10}$/.test(s)) return `+${s}`;
  return undefined;
};

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

export const validateEmailFormInfo = Yup.string()
  .transform(normalizeEmail as any)
  .test('email-format', 'Email is not valid', (v) => {
    if (!v) return true;
    return EMAIL_REGEX_SIMPLE.test(v);
  });

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
  .min(2, 'Full Name must be at least 2 characters')
  .max(100, 'Full Name must be less than 100 characters')
  .required('Full Name is required');

/**------------------PHONE NUMBER------------------ */
export const validatePhone = Yup.string()
  .transform((_v, orig) => normalizePhone(orig) ?? '')
  .test('phone-format', 'Phone number is invalid', (v) =>
    /^\+84\d{9,10}$/.test(v || ''),
  );

// export const validatePhone = Yup.string()
//   .transform((v) => normalizePhone(v))
//   .test('phone-format', 'Phone number is not valid', (v) => {
//     if (!v) return true;
//     return phoneRegex.test(v);
//   })
//   .required('Phone number is required');

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
export const validateAddress = Yup.string()
  .transform((v) => toUndef(normalizeString(v) as string) as any)
  .max(200, 'Address must be at most 200 characters');

export const validateCity = Yup.string()
  .transform((v) => toUndef(normalizeString(v) as string) as any)
  .max(100, 'City must be at most 100 characters');

export const validateDistrict = Yup.string()
  .transform((v) => toUndef(normalizeString(v) as string) as any)
  .max(100, 'District must be at most 100 characters');

export const validateWard = Yup.string()
  .transform((v) => toUndef(normalizeString(v) as string) as any)
  .max(100, 'Ward must be at most 100 characters');

// Note (optional)
export const validateNote = Yup.string()
  .transform((v) => toUndef(normalizeString(v) as string) as any)
  .max(500, 'Note must be at most 500 characters');

/**--------------ROLE---------------- */
export const validateRole = Yup.mixed<Role>()
  .oneOf(['admin', 'manager', 'staff'], 'Invalid role')
  .required('Role is required');

/**------------Gender---------------- */
export const validateGender = Yup.mixed<Gender>()
  .oneOf(['male', 'female', 'other'], 'Invalid gender')
  .required('Gender is required');

/**------------Status---------------- */
export const validateStatus = Yup.mixed<EmployeeStatus>()
  .oneOf(['active', 'inactive', 'suspended'], 'Invalid status')
  .required('Status is required');

export { validateAcceptTerms, validateCategory, normalizePhone };
export const customerSchema = Yup.object({
  name: validateName.label('Full Name'),
  email: validateEmailFormInfo,
  phone: validatePhone,
  address: validateAddress,
  ward: validateWard,
  district: validateDistrict,
  city: validateCity,
  note: validateNote,
});
