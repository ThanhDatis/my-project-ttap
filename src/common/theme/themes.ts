/* eslint-disable prettier/prettier */
import { createTheme } from '@mui/material/styles';


import {
  brand,
  gray,
  errorColor,
  infoTextColor,
  primaryBackground,
  primaryTextColor,
  secondaryTextColor,
  successColor,
  warningColor,
  // labelColor,
} from '../color';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: primaryTextColor,
      light: '#42a5f5',
      dark: '1565c0',
      contrastText: '#808080',
    },
    secondary: {
      main: secondaryTextColor,
      light: '#ff5983',
      dark: '#9a0036',
      contrastText: '#757575',
    },
    error: { main: errorColor },
    warning: { main: warningColor },
    info: { main: infoTextColor },
    success: { main: successColor },
    background: {
      default: primaryBackground,
      paper: primaryBackground,
    },
    text: {
      primary: '#000000',
      secondary: '#757575',
    },
  },
  typography: {
    fontFamily: " 'Inter', san-serif",
    h1: { fontSize: '2.5rem', fontWeight: 700 },
    h2: { fontSize: '2rem', fontWeight: 600 },
    h3: { fontSize: '1.75rem', fontWeight: 600 },
    h4: { fontSize: '1.5rem', fontWeight: 500 },
    h5: { fontSize: '1.25rem', fontWeight: 500 },
    h6: { fontSize: '1rem', fontWeight: 500 },
    body1: { fontSize: '1rem', fontWeight: 500 },
    body2: { fontSize: '0.875rem', fontWeight: 500, lineHeight: 2 },
    subtitle1: { fontSize: '1rem', fontWeight: 400, lineHeight: 2 },
    subtitle2: { fontSize: '0.875rem', fontWeight: 400, lineHeight: 2 },
    button: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 2,
      textTransform: 'none',
    },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          a: { color: infoTextColor, textDecoration: "underline" },
        },
      },
      defaultProps: {
        variant: 'body1',
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          padding: "8px 16px",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
        outlined: {
          borderColor: gray[500],
          color: brand[500],
          "&:hover": {
            backgroundColor: "rgba(25, 118, 210, 0.04)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
          border: `1px solid ${gray[300]}`,
          borderRadius: 12,
          padding: "24px",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          ".MuiInputBase-root.MuiOutlinedInput-root.Mui-error":{
            "&:hover fieldset": {
              borderColor: errorColor,
            },
            "& fieldset": {
              borderWidth: "1px",
              borderColor: `${errorColor} !important`,
            },
          },
          ".MuiInputBase-root.MuiOutlinedInput-root": {
            borderColor: "#e6e8ee",
          },
          "& .MuiOutlinedInput-root": {
            // borderRadius: 8,
            "& fieldset": {
              borderWidth: '1px',
              borderColor: `${gray[50]} !important`,
            },
            "&:hover fieldset": {
              borderWidth: '1px',
            },
            "&.Mui-focused fieldset": {
              // borderColor: colors.primary,
              borderWidth: "1px !important",
            },
            // "&.Mui-error fieldset": {
            //   borderColor: colors.error,
            // },
          },
          textfield: {
            padding: "8px 12px",
            borderWidth: "thin",
            borderColor: "#e6e8ee !important",
          },
          input: {
            padding: "8px 12px",
            fontSize: "14px",
            fontWeight: 400,
            borderWidth: "thin",
          },
          // "& .MuiInputBase-input": {
          //   fontSize: "1rem",
          //   fontWeight: 400,
          //   color: primaryTextColor,
          // },
          // "& .MuiInputLabel-root": {
          //   fontSize: "1rem",
          //   color: labelColor,
          // },
        },
      }
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontSize: "0.875rem",
          fontWeight: 400,
          marginBottom: "8px",
          display: "block",
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: gray[300],
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
          borderRadius: 8,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: `1px solid ${gray[300]}`,
          backgroundColor: primaryBackground,
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        root: {
          span: {
            fontSize: "14px",
          },
        },
        // primary: {
        //   fontSize: "0.875rem",
        //   fontWeight: 400,
        // },
        // secondary: {
        //   fontSize: "0.75rem",
        //   color: colors.textSecondary,
        // },
      },
    },
  }
});

export default theme;
