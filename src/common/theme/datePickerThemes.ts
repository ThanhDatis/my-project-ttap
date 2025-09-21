import type { Theme, Components } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';
import {
  pickersDayClasses,
  pickersMonthClasses,
  pickersYearClasses,
} from '@mui/x-date-pickers';
// import { pickersMonthClasses } from '@mui/x-date-pickers/MonthCalendar';
// import { pickersYearClasses } from '@mui/x-date-pickers/PickersYear';

import '@mui/x-date-pickers/themeAugmentation';

export const datePickers: Components<Theme> = {
  MuiPickersPopper: {
    defaultProps: {
      placement: 'bottom-start',
    },
    styleOverrides: {
      root: ({ theme }) => ({
        zIndex: theme.zIndex.modal + 1,
        '& .MuiPaper-root': {
          borderRadius: theme.shape.borderRadius * 2,
          boxShadow: theme.shadows[8],
          border: `1px solid ${theme.palette.divider}`,
          background: theme.palette.background.paper,
        },
      }),
    },
  },
  MuiDateCalendar: {
    styleOverrides: {
      root: ({ theme }) => ({
        padding: theme.spacing(1),
      }),
    },
  },

  MuiPickersCalendarHeader: {
    styleOverrides: {
      root: ({ theme }) => ({
        padding: theme.spacing(1, 1.5),
      }),
      label: ({ theme }) => ({
        fontWeight: theme.typography.fontWeightMedium,
      }),
      switchViewButton: ({ theme }) => ({
        '&:focus-visible': {
          outline: `2px solid ${alpha(theme.palette.primary.main, 0.4)}`,
          outlineOffset: 2,
        },
      }),
      // navigationButton: ({ theme }) => ({
      //   '&:focus-visible': {
      //     outline: `2px solid ${alpha(theme.palette.primary.main, 0.45)}`,
      //     outlineOffset: 2,
      //   },
      // }),
    },
  },
  MuiPickersDay: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: theme.shape.borderRadius,
        '&:focus-visible': {
          outline: `2px solid ${alpha(theme.palette.primary.main, 0.45)}`,
          outlineOffset: 2,
        },
        [`&.${pickersDayClasses.today}`]: {
          border: `1px solid ${alpha(theme.palette.primary.main, 0.4)}`,
        },
        [`&.${pickersDayClasses.selected}`]: {
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.85),
          },
        },
        [`&.${pickersDayClasses.outsideCurrentMonth}`]: {
          color: theme.palette.text.disabled,
        },
        '&.Mui-disabled': {
          opacity: 0.6,
        },
      }),
    },
  },
  MuiPickersMonth: {
    styleOverrides: {
      monthButton: ({ theme }) => ({
        borderRadius: theme.shape.borderRadius,
        '&:focus-visible': {
          outline: `2px solid ${alpha(theme.palette.primary.main, 0.4)}`,
          outlineOffset: 2,
        },
        [`&.${pickersMonthClasses.selected}`]: {
          backgroundColor: alpha(theme.palette.primary.main, 0.15),
          border: `1px solid ${alpha(theme.palette.primary.main, 0.4)}`,
        },
      }),
    },
  },
  MuiPickersYear: {
    styleOverrides: {
      root: ({ theme }) => ({
        '&:focus-visible': {
          outline: `2px solid ${alpha(theme.palette.primary.main, 0.4)}`,
          outlineOffset: 2,
        },
        [`&.${pickersYearClasses.selected}`]: {
          backgroundColor: alpha(
            `rgb(${theme.vars.palette.primary.mainChannel})`,
            0.15,
          ),
          border: `1px solid ${alpha(
            `rgb(${theme.vars.palette.primary.mainChannel})`,
            0.5,
          )}`,
        },
      }),
    },
  },
  MuiDatePicker: {
    defaultProps: {
      closeOnSelect: true,
      reduceAnimations: true,
      showDaysOutsideCurrentMonth: true,
      slotProps: {
        textField: { size: 'small', fullWidth: true },
      },
    },
  },
  MuiDateTimePicker: {
    defaultProps: {
      closeOnSelect: true,
      reduceAnimations: true,
      slotProps: { textField: { size: 'small', fullWidth: true } },
    },
  },
  MuiTimePicker: {
    defaultProps: {
      reduceAnimations: true,
      slotProps: { textField: { size: 'small', fullWidth: true } },
    },
  },
};
