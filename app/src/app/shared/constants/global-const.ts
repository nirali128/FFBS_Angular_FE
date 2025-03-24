import { environment } from "../../../environment/environment";

export class GlobalConstant {
  // Create a constants for the routes
  public static readonly DASHBOARD = 'dashboard';
  public static readonly PATHMATCH = 'full';
  public static readonly LOGIN = 'login';
  public static readonly REGISTER = 'register';
  public static readonly BEARER = 'Bearer';
  public static readonly ENCRYPTION_KEY = "FFBS26022025";

  //Create constants for the API URL
  public static readonly COMMON_API_URL = `${environment.baseUrl}/common`;
  public static readonly FIELD_API_URL = `${environment.baseUrl}/field`;
  public static readonly BOOKING_API_URL = `${environment.baseUrl}/booking`;

  public static readonly AUTH = {
    LOGIN: "/login",
    REGISTER: "/register",
    FORGOT_PASSWORD: "/forgot-password",
    REFRESH_TOKEN: "/refresh-token",
    RESET_PASSWORD: "/reset-password",
  }

  public static readonly FIELD =  {
    GET_ALL_FIELDS: "/get-all-fields-detail",
    GET_SLOT_BY_FIELD: "/get-slot-by-field",
    GET_FIELD_DETAIL: "/get-field-detail",
  }

  public static readonly BOOKING = {
    ADD_BOOKING: "/add-booking",
    GET_BOOKING_BY_ID: "/get-booking-by-id",
    APPROVE_REJECT_BOOKING: "/approve-or-reject",
    GET_ALL_BOOKINGS: "/get-all-bookings",
  }

  public static readonly COMMON = {
    GET_ALL_ROLES: "/get-all-roles",
    GET_ALL_DAYS: "/get-all-days",
    GET_ALL_SLOTS: "/get-all-slots",
  }

  public static readonly paginationOptions = [5, 10, 20];
}