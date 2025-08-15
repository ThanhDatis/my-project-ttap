import React from 'react';
import { Typography, type SxProps, type Theme } from "@mui/material";

interface TextTypographyProps {
  sx?: SxProps<Theme> | undefined;
  children?: React.ReactNode;
  component?: React.ElementType;
}

export function TextTypography ({
  sx = {},
  children,
  component = 'p',
}: TextTypographyProps) : React.JSX.Element {
  return (
    <Typography
      component={component}
      sx={{
        fontWeight: 400,
        fontSize: '1rem',
        color: 'text.primary',
        lineHeight: 1.5,
        ...sx
      }}
    >
      {children}
    </Typography>
  )
}
