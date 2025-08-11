import * as Yup from 'yup';

const validateEmail = Yup.string()
  .email('Email is not valid')
  .required('Email is required');

const validateName = Yup.string()
  .min(2, 'Name is too short')
  .max(100, 'Name is too long')
  .required('Name is required');

const validatePhone = Yup.string()
  .min(10, "Phone number is too short")
  .max(15, "Phone number is too long")
  .required("Phone number is required");

export { validateEmail, validatePhone, validateName };
