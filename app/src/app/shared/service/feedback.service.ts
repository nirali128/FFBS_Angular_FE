import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalConstant } from '../constants/global-const';
import { ApiPaginatedResponse, ApiResponse } from '../interfaces/api.response';
import { AuthService } from './authentication.service';
import { AddFeedback, FeedbackList } from '../interfaces/feedback';
import { Observable } from 'rxjs';
import { FilterRequest } from '../interfaces/filter-request';
import { Role } from '../interfaces/role';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
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

  addFeedback(data: AddFeedback) {
    return this.httpClient.post<ApiResponse<any>>(
      `${
        GlobalConstant.FEEDBACK_API_URL + GlobalConstant.FEEDBACK.ADD_FEEDBACK
      }`,
      data,
      this.getHeaders()
    );
  }

  getPaginatedFeedbacks(
    filterRequest?: FilterRequest,
    fieldId?: string,
    userId?: string
  ): Observable<ApiPaginatedResponse<FeedbackList[]>> {
    let httpParams = new HttpParams();

    if (filterRequest) {
      if (filterRequest.pageNumber && filterRequest.pageNumber)
        httpParams = httpParams
          .set('page', filterRequest.pageNumber)
          .set('pageSize', filterRequest.pageSize);
      if (filterRequest.search)
        httpParams = httpParams.set('search', filterRequest.search);

      if (filterRequest.sortBy && filterRequest.sortOrder) {
        httpParams = httpParams
          .set('sortBy', filterRequest.sortBy)
          .set('sortOrder', filterRequest.sortOrder);
      }
    }

    let url =
      `${
        GlobalConstant.FEEDBACK_API_URL +
        GlobalConstant.FEEDBACK.GET_ALL_FEEDBACK
      }` +
      (fieldId ? '?fieldId=' + fieldId : '') +
      (userId ? (fieldId ? '&' : '?') + 'userId=' + userId : '');

    return this.httpClient.get<ApiPaginatedResponse<FeedbackList[]>>(url, {
      ...this.getHeaders(),
      params: httpParams,
    });
  }

  deleteFeedback(guid: string) {
    return this.httpClient.delete<ApiResponse<any>>(
      `${
        GlobalConstant.FEEDBACK_API_URL +
        GlobalConstant.FEEDBACK.DELETE_FEEDBACK +
        '?feedbackId=' +
        guid
      }`,
      this.getHeaders()
    );
  }
}
