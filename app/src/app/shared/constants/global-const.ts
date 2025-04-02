import { environment } from "../../../environment/environment";

export class GlobalConstant {
  // Create a constants for the routes
  public static readonly DASHBOARD = 'dashboard';
  public static readonly PATHMATCH = 'full';
  public static readonly LOGIN = 'login';
  public static readonly REGISTER = 'register';
  public static readonly BEARER = 'Bearer';
  public static readonly ENCRYPTION_KEY = "FFBS26022025";
  public static readonly ADD = 'add';
  public static readonly EDIT = 'edit';
  public static readonly VIEW = 'view';
  public static readonly DELETE = 'delete';

  //Create constants for the API URL
  public static readonly COMMON_API_URL = `${environment.baseUrl}/common`;
  public static readonly FIELD_API_URL = `${environment.baseUrl}/field`;
  public static readonly BOOKING_API_URL = `${environment.baseUrl}/booking`;
  public static readonly AVAILABILITY_API_URL = `${environment.baseUrl}/availability`;
  public static readonly RATE_API_URL = `${environment.baseUrl}/rate`;
  public static readonly USER_API_URL = `${environment.baseUrl}/user`;
  public static readonly INVOICE_API_URL = `${environment.baseUrl}/invoice`;

  public static readonly AUTH = {
    LOGIN: "/login",
    REGISTER: "/register",
    FORGOT_PASSWORD: "/forgot-password",
    REFRESH_TOKEN: "/refresh-token",
    RESET_PASSWORD: "/reset-password",
  }

  public static readonly USER = {
    GET_USER_BY_ID: "/get-user-by-id",
    EDIT_USER: "/edit-user-details",
    GET_ALL_USER: "/get-all-users",
    BLOCK_USER: "/block-user"
  }

  public static readonly FIELD =  {
    GET_ALL_FIELDS: "/get-all-fields-detail",
    GET_SLOT_BY_FIELD: "/get-slot-by-field",
    GET_FIELD_DETAIL: "/get-field-detail",
    ADD_FIELD: "/add-field",
    EDIT_FIELD: "/edit-field",
  }

  public static readonly BOOKING = {
    ADD_BOOKING: "/add-booking",
    GET_BOOKING_BY_ID: "/get-booking-by-id",
    APPROVE_REJECT_BOOKING: "/approve-or-reject",
    GET_ALL_BOOKINGS: "/get-all-bookings",
    GET_BOOKING_BY_FIELDID_USERID: "/get-booking-by-field-and-user",
    DELETE_BOOKING: "/delete-booking"
  }

  public static readonly COMMON = {
    GET_ALL_ROLES: "/get-all-roles",
    GET_ALL_DAYS: "/get-all-days",
    GET_CLOSED_DAYS: "/get-all-close-days",
    GET_ALL_SLOTS: "/get-all-slots",
  }

  public static readonly INVOICE = {
    GET_ALL_INVOICE: "/get-all-invoices"
  }

  public static readonly paginationOptions = [5, 10, 20];

  public static readonly AVAILABILITY = {
    GET_FIELD_SLOTS_AVAILABILITY: "/fetch-field-slots-availability",
    MODIFY_FIELD_SLOTS_AVAILABILITY: "/modify-field-slot-availability",
  }

  public static readonly RATE = {
    GET_RATES: "/fetch-rates",
    ADD_RATES: "/add-rate-adjustment",
  }
}