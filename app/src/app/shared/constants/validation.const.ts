import { ErrorMessages } from "./messages-const";

export const ValidationPatterns = {
  EMAIL: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
  PHONE: /^[1-9]\d{9}$/,
  PASSWORD:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,15}$/,
  LINK: /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?$/,
  OTP: /^[0-9]{6}$/,
  JWT: /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/,
};

export const ValidationRules = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 16,
  NAME_MAX_LENGTH: 50,
  EMAIL_MAX_LENGTH: 100,
  PHONE_NUMBER_MAX_LENGTH: 30,
  ROLE_NAME_MAX_LENGTH: 30,
  DESCRIPTION_MAX_LENGTH: 100,
  FIELD_NAME_MAX_LENGTH: 50,
  FIELD_ADDRESS_MAX_LENGTH: 100,
};

export const ErrorLabel = {
  PASSWORD: "password",
  Role: "role"
}

export const ValidationErrors: Record<string, string | ((error: any, label?: string) => string)> = {
  required: (label = 'This field') => label.toLowerCase() === ErrorLabel.Role ? ErrorMessages.ROLE_SELECTION : `${label} is required`,
  minlength: (error) => `Minimum length of ${error.requiredLength} characters`,
  maxlength: (error) => `Maximum length of ${error.requiredLength} characters`,
  pattern: (label = 'This field') =>  label.toLowerCase() === ErrorLabel.PASSWORD
  ? ErrorMessages.PASSWORD_INVALID
  : `Please enter a valid ${label}`,
  mismatch: ErrorMessages.PASSWORD_MISMATCH
};