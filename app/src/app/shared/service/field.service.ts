import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalConstant } from '../constants/global-const';
import { Observable } from 'rxjs';
import { ApiPaginatedResponse, ApiResponse } from '../interfaces/api.response';
import {
  Booking,
  Day,
  FieldDetail,
  FieldsDetailList,
  FieldSlotRateData,
  FieldSlotRateRequestData,
  Slot,
  SlotByField,
} from '../interfaces/field';

@Injectable({
  providedIn: 'root',
})
export class FieldService {
  public getHeaders() {
    const headerDict = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };
    return requestOptions;
  }

  constructor(private httpClient: HttpClient) {}

  getAllFields(): Observable<ApiPaginatedResponse<FieldsDetailList[]>> {
    return this.httpClient.get<ApiPaginatedResponse<FieldsDetailList[]>>(
      `${GlobalConstant.FIELD_API_URL + GlobalConstant.FIELD.GET_ALL_FIELDS}`,
      this.getHeaders()
    );
  }

  getAllSlots(): Observable<ApiResponse<Slot[]>> {
    return this.httpClient.get<ApiResponse<Slot[]>>(
      `${GlobalConstant.COMMON_API_URL + GlobalConstant.COMMON.GET_ALL_SLOTS}`,
      this.getHeaders()
    );
  }

  getSlotsByField(guid: string): Observable<ApiResponse<SlotByField[]>> {
    return this.httpClient.get<ApiResponse<SlotByField[]>>(
      `${
        GlobalConstant.FIELD_API_URL +
        GlobalConstant.FIELD.GET_SLOT_BY_FIELD +
        '?fieldId=' +
        guid
      }`,
      this.getHeaders()
    );
  }

  getAllDays(): Observable<ApiResponse<Day[]>> {
    return this.httpClient.get<ApiResponse<Day[]>>(
      `${GlobalConstant.COMMON_API_URL + GlobalConstant.COMMON.GET_ALL_DAYS}`,
      this.getHeaders()
    );
  }

  addBooking(data: Booking) {
    return this.httpClient.post(
      `${GlobalConstant.BOOKING_API_URL + GlobalConstant.BOOKING.ADD_BOOKING}`,
      data,
      this.getHeaders()
    );
  }

  getAllBooking(): Observable<ApiResponse<Booking[]>> {
    return this.httpClient.get<ApiResponse<Booking[]>>(
      `${
        GlobalConstant.BOOKING_API_URL + GlobalConstant.BOOKING.GET_ALL_BOOKINGS
      }`,
      this.getHeaders()
    );
  }

  getFieldById(guid: string) {
    return this.httpClient.get<ApiResponse<FieldDetail>>(
      `${
        GlobalConstant.FIELD_API_URL +
        GlobalConstant.FIELD.GET_FIELD_DETAIL +
        '?fieldId=' +
        guid
      }`,
      this.getHeaders()
    );
  }

  getFieldSlotsAvailability(data: FieldSlotRateRequestData) {
    return this.httpClient.post<ApiResponse<FieldSlotRateData[]>>(
      `${
        GlobalConstant.AVAILABILITY_API_URL +
        GlobalConstant.AVAILABILITY.GET_FIELD_SLOTS_AVAILABILITY
      }`, data,
      this.getHeaders()
    );
  }

  getFieldSlotsRates(data: FieldSlotRateRequestData) {
    return this.httpClient.post<ApiResponse<FieldSlotRateData[]>>(
      `${
        GlobalConstant.RATE_API_URL +
        GlobalConstant.RATE.GET_RATES
      }`, data,
      this.getHeaders()
    );
  }
}
