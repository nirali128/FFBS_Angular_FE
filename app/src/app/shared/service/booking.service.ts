import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalConstant } from '../constants/global-const';
import { Observable } from 'rxjs';
import {
  ApiPaginatedResponse,
  ApiResponse
} from '../interfaces/api.response';
import {
  Booking,
  BookingApproveReject,
  BookingDetailsResponseDto,
} from '../interfaces/field';
import { FilterRequest } from '../interfaces/filter-request';
import { AuthService } from './authentication.service';
import { Role } from '../enum/role';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
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

  constructor(
    private httpClient: HttpClient,
    public authService: AuthService
  ) {}

  addBooking(data: Booking) {
    return this.httpClient.post(
      `${GlobalConstant.BOOKING_API_URL + GlobalConstant.BOOKING.ADD_BOOKING}`,
      data,
      this.getHeaders()
    );
  }

  getPaginatedBookings(
    filterRequest: FilterRequest
  ): Observable<ApiPaginatedResponse<BookingDetailsResponseDto[]>> {
    let httpParams = new HttpParams()
      .set('page', filterRequest.pageNumber)
      .set('pageSize', filterRequest.pageSize)
      .set('search', filterRequest.search)

      if(this.authService.getRole() != Role.Admin) {
        httpParams = httpParams.set('userId', this.authService.getUserId());
      }
    return this.httpClient.get<
      ApiPaginatedResponse<BookingDetailsResponseDto[]>
    >(
      `${
        GlobalConstant.BOOKING_API_URL + GlobalConstant.BOOKING.GET_ALL_BOOKINGS
      }`,
      {
        ...this.getHeaders(),
        params: httpParams,
      }
    );
  }

  approveOrRejectBooking(approvedRejectData: BookingApproveReject): Observable<ApiResponse<any>> {
    return this.httpClient.post<ApiResponse<any>>(
        `${
          GlobalConstant.BOOKING_API_URL +
          GlobalConstant.BOOKING.APPROVE_REJECT_BOOKING
        }`,
        approvedRejectData,
        this.getHeaders()
      );
  }

  deleteBooking(guid: string) {
    return this.httpClient.delete<ApiResponse<any>>(
      `${
        GlobalConstant.BOOKING_API_URL +
        GlobalConstant.BOOKING.DELETE_BOOKING +
        '?bookingId=' +
        guid
      }`,
      this.getHeaders()
    );
  }
}
