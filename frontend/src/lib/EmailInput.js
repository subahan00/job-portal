import { TextField } from "@material-ui/core";

const EmailInput = (props) => {
  const {
    label,
    value,
    onChange,
    inputErrorHandler = {}, // default to empty object
    handleInputError = () => {}, // default to no-op
    required,
    className,
  } = props;

  const errorObj = inputErrorHandler.email || { error: false, message: "" };

  return (
    <TextField
      label={label}
      variant="outlined"
      value={value}
      onChange={onChange}
      helperText={errorObj.message}
      onBlur={(event) => {
        const val = event.target.value;
        if (val === "") {
          required
            ? handleInputError("email", true, "Email is required")
            : handleInputError("email", false, "");
        } else {
          const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          re.test(val.toLowerCase())
            ? handleInputError("email", false, "")
            : handleInputError("email", true, "Incorrect email format");
        }
      }}
      error={errorObj.error}
      className={className}
      fullWidth
    />
  );
};

export default EmailInput;
