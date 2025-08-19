import React from "react";
import { Box, Button, type SxProps, type Theme } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { gray } from "../common/color";

interface LoadingButtonProps {
  size?: number;
  sxButton?: SxProps<Theme> | undefined;
  textButton?: string;
  type?: "button" | "reset" | "submit" | undefined;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  variant?: "text" | "contained" | "outlined";
  color?: "inherit" | "primary" | "secondary";
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  sxButton = {
    py: 1.5,
    fontSize: '16px',
    fontWeight: 600,
    mb: 1,
  },
  textButton = "Sign In",
  type = "submit",
  loading = false,
  onClick,
  variant = "contained",
  disabled = false,
  size = 20,
  // color = "primary",
}: LoadingButtonProps): React.JSX.Element => {
  return (
    <Button
      variant={variant}
      // color={color}
      sx={{
        ...sxButton,
        color: loading ? "transparent" : "",
        position: 'relative',
      }}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {textButton}
      {loading && (
        <Box
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            background: "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress
            size={size}
            thickness={4}
            style={{
              color: variant != 'text' ? gray[500] : 'White'
            }}
            // color="inherit"
          />
        </Box>
      )}
    </Button>
  );
};

export default LoadingButton;
