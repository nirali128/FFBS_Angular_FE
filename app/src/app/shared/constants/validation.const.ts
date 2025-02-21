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