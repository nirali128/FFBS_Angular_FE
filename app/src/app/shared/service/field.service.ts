import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalConstant } from '../constants/global-const';
import { Observable } from 'rxjs';
import { ApiPaginatedResponse, ApiResponse, PaginationRequest } from '../interfaces/api.response';
import {
  Day,
  FieldDetail,
  FieldsDetailList,
  FieldSlotRateData,
  FieldSlotRateRequestData,
  Slot,
  SlotByField,
} from '../interfaces/field';
import { AuthService } from './authentication.service';

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

  constructor(private httpClient: HttpClient, public authService: AuthService) {}

  getAllFields(params: PaginationRequest): Observable<ApiPaginatedResponse<FieldsDetailList[]>> {
    let httpParams = new HttpParams()
      .set('page', params.page)
      .set('pageSize', params.pageSize)
      .set('search', params.search)
      .set('sortBy', params.sortBy)
      .set('sortOrder', params.sortOrder);
    return this.httpClient.get<ApiPaginatedResponse<FieldsDetailList[]>>(
      `${GlobalConstant.FIELD_API_URL + GlobalConstant.FIELD.GET_ALL_FIELDS}`,  { 
        ...this.getHeaders(),
        params: httpParams,  
      }
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

  getClosedDays(guid: string): Observable<ApiResponse<Day[]>> {
    return this.httpClient.get<ApiResponse<Day[]>>(
      `${GlobalConstant.COMMON_API_URL + GlobalConstant.COMMON.GET_CLOSED_DAYS +
        '?fieldId=' +
        guid}`,
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

  addField(data: FieldDetail) {
    return this.httpClient.post<ApiResponse<any>>(
      `${GlobalConstant.FIELD_API_URL + GlobalConstant.FIELD.ADD_FIELD}`,
      data,
      this.getHeaders()
    );
  }

  editField(guid: string, data: FieldDetail) {
    return this.httpClient.post<ApiResponse<any>>(
      `${GlobalConstant.FIELD_API_URL + GlobalConstant.FIELD.EDIT_FIELD + '?fieldId=' + guid}` ,
      data,
      this.getHeaders()
    );
  }
}
