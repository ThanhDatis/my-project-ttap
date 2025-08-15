import * as Yup from 'yup';

const validateEmail = Yup.string()
  .email('Email is not valid')
  .required('Email is required');

const validatePassword = Yup.string()
  .min(6, 'Password must be at least 6 characters')
  .required('Password is required');

const validateName = Yup.string()
  .min(2, 'Name is too short')
  .max(100, 'Name is too long')
  .required('Name is required');

const validatePhone = Yup.string()
  .min(10, "Phone number is too short")
  .max(15, "Phone number is too long")
  .required("Phone number is required");

const validateConfirmPassword = Yup.string()
  .oneOf([Yup.ref('password')], 'Passwords must match')
  .required('Confirm password is required');

const validateAcceptTerms = Yup.boolean()
  .oneOf([true], 'You must accept the terms and conditions')
  .required('You must accept the terms and conditions');

export {
  validateEmail,
  validatePassword,
  validatePhone,
  validateName,
  validateConfirmPassword,
  validateAcceptTerms,
};
