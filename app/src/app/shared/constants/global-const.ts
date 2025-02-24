export class GlobalConstant {
  // Create a constants for the routes
  public static readonly DASHBOARD = 'dashboard';
  public static readonly PATHMATCH = 'full';
  public static readonly LOGIN = 'login';
  public static readonly REGISTER = 'register';
  public static readonly BEARER = 'Bearer';

  //Create constants for the API URL
  public static readonly COMMON_API_URL = "http://localhost:3000/common";
  public static readonly AUTH_API_URL = "http://localhost:3000";

  public static readonly AUTH = {
    LOGIN: "/login",
    REGISTER: "/register",
    FORGOT_PASSWORD: "/forgot-password",
    REFRESH_TOKEN: "/refresh-token",
    RESET_PASSWORD: "/reset-password",
  }
}