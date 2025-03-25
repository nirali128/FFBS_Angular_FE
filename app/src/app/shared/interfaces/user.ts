export interface User {
  userId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string | null;
  dob?: Date;
  avatar?: string | null;
  rememberMe?: boolean;
  role?: {
    roleId: string;
    roleName: string;
  } | null;
}

export interface ResetPassword {
  email: string;
  password: string;
}
