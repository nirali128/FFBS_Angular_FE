export interface User {
  userId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string | null;
  dob?: Date;
  avatar?: string | null;
  isActive?: boolean;
  rememberMe?: boolean;
  role?: {
    roleId: string;
    roleName: string;
  } | null;
}

export interface ResetPassword {
  email: string;
  password: string;
  oldPassword: string;
}

export interface BlockUser {
  userId: string;
  reason: string;
  isActive: boolean;
}