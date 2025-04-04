import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalConstant } from '../constants/global-const';
import { ApiPaginatedResponse } from '../interfaces/api.response';
import { AuthService } from './authentication.service';
import { Observable } from 'rxjs';
import { FilterRequest } from '../interfaces/filter-request';
import { DiscountList } from '../interfaces/discount';

@Injectable({
  providedIn: 'root',
})
export class DiscountService {
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

  getPaginatedDiscounts(
    filterRequest: FilterRequest
  ): Observable<ApiPaginatedResponse<DiscountList[]>> {
    let httpParams = new HttpParams()
      .set('page', filterRequest.pageNumber)
      .set('pageSize', filterRequest.pageSize);
    if (filterRequest.search)
      httpParams = httpParams.set('search', filterRequest.search);
    return this.httpClient.get<ApiPaginatedResponse<DiscountList[]>>(
      `${
        GlobalConstant.DISCOUNT_API_URL +
        GlobalConstant.DISCOUNT.Get_ALL_DISCOUNTS_DETAIL
      }`,
      {
        ...this.getHeaders(),
        params: httpParams,
      }
    );
  }
}