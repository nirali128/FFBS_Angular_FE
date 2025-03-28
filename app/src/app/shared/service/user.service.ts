import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalConstant } from '../constants/global-const';
import { Observable } from 'rxjs';
import { ApiPaginatedResponse, ApiResponse } from '../interfaces/api.response';
import { AuthService } from './authentication.service';
import { BlockUser, User } from '../interfaces/user';
import { FilterRequest } from '../interfaces/filter-request';

@Injectable({
  providedIn: 'root',
})
export class UserService {
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

  constructor(private httpClient: HttpClient, public authService: AuthService) {
    this.userId = this.authService.getUserId();
  }

  getUserById(): Observable<ApiResponse<User>> {
    return this.httpClient.get<ApiResponse<User>>(
      `${
        GlobalConstant.USER_API_URL +
        GlobalConstant.USER.GET_USER_BY_ID +
        '?userId=' +
        this.userId
      }`,
      this.getHeaders()
    );
  }

  editUser(user: User) {
    return this.httpClient.post<ApiResponse<any>>(
      `${
        GlobalConstant.USER_API_URL +
        GlobalConstant.USER.EDIT_USER +
        '?userId=' +
        this.userId
      }`,
      user,
      this.getHeaders()
    );
  }

  getPaginatedUsers(
    filterRequest?: FilterRequest
  ): Observable<ApiPaginatedResponse<User[]>> {
    let httpParams = new HttpParams();
    if (filterRequest && filterRequest.pageNumber && filterRequest.pageSize)
      httpParams = httpParams
        .set('page', filterRequest.pageNumber)
        .set('pageSize', filterRequest.pageSize);

    if (filterRequest && filterRequest.search) {
      httpParams = httpParams.set('search', filterRequest.search);
    }

    return this.httpClient.get<ApiPaginatedResponse<User[]>>(
      `${GlobalConstant.USER_API_URL + GlobalConstant.USER.GET_ALL_USER}`,
      {
        ...this.getHeaders(),
        params: httpParams,
      }
    );
  }

  blockUser(data: BlockUser) {
    return this.httpClient.post<ApiResponse<any>>(
      `${GlobalConstant.USER_API_URL + GlobalConstant.USER.BLOCK_USER}`,
      data,
      this.getHeaders()
    );
  }
}
