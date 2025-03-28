import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalConstant } from '../constants/global-const';
import { Observable } from 'rxjs';
import { ApiPaginatedResponse, ApiResponse } from '../interfaces/api.response';
import { AuthService } from './authentication.service';
import { User } from '../interfaces/user';
import { InvoiceList } from '../interfaces/invoice';
import { FilterRequest } from '../interfaces/filter-request';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
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
  userId: string;

  constructor(
    private httpClient: HttpClient,
    public authService: AuthService
  ) {}

  getPaginatedInvoices(
    filterRequest: FilterRequest
  ): Observable<ApiPaginatedResponse<InvoiceList[]>> {
    let httpParams = new HttpParams()
      .set('page', filterRequest.pageNumber)
      .set('pageSize', filterRequest.pageSize);

    if (filterRequest.search) {
      httpParams = httpParams.set('search', filterRequest.search);
    }

    return this.httpClient.get<ApiPaginatedResponse<InvoiceList[]>>(
      `${
        GlobalConstant.INVOICE_API_URL + GlobalConstant.INVOICE.GET_ALL_INVOICE
      }`,
      {
        ...this.getHeaders(),
        params: httpParams,
      }
    );
  }
}
