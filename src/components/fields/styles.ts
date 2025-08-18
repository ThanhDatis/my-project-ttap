export const defaultStyleInput = {
  ".MuiInputBase-root": {
    borderRadius: "8px",
    paddingRight: "0px !important",
    fieldset: { boxSizing: " border-box" },
  },
  "textarea::placeholder": {
    fontSize: "14px",
  },
  width: "100%",
};

export const errorStyleInput = {
  "&.MuiAlert-colorError	": {
    backgroundColor: "#FFFFFF",
    color: "red",
    padding: "2px 0px 0px 0px",
  },
  display: "flex",
  alignItems: "center",
};
