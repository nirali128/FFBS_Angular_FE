import { ErrorMessages } from "./messages-const";

export const ValidationPatterns = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z.-]+\.[a-zA-Z]{2,4}$/,
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
  FIELD_NAME_MAX_LENGTH: 100,
  FIELD_AREA_MIN: 100,
  FEILD_BASE_RATE_MIN: 10,
  FIELD_ADDRESS_MAX_LENGTH: 255,
  RULES_POLICIES_MAX_LENGTH: 1000,
  FIELD_DESCRIPTION_MAX_LENGTH: 1000
};

export const ErrorLabel = {
  PASSWORD: "password",
  Role: "role"
}

export const ValidationErrors: Record<string, string | ((error: any, label?: string) => string)> = {
  required: (label = 'This field') => label.toLowerCase() === ErrorLabel.Role ? ErrorMessages.ROLE_SELECTION : `This field is required`,
  minlength: (error) => `Minimum length of ${error.requiredLength} characters`,
  maxlength: (error) => `Maximum length of ${error.requiredLength} characters`,
  min: (error) => `Min value is ${error.min}.`,
  pattern: (label = 'This field') =>  label.toLowerCase() === ErrorLabel.PASSWORD
  ? ErrorMessages.PASSWORD_INVALID
  : `Please enter a valid ${label}`,
  mismatch: ErrorMessages.PASSWORD_MISMATCH,
  minAge: (error) => `You must be at least ${error.minAge} years old`,
};