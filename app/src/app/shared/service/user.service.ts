import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalConstant } from '../constants/global-const';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '../interfaces/api.response';
import { Role } from '../interfaces/role';
import { DropdownOption } from '../interfaces/dropdown.options';
import { AuthService } from './authentication.service';
import { User } from '../interfaces/user';

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
    return this.httpClient.post(
      `${
        GlobalConstant.USER_API_URL +
        GlobalConstant.USER.EDIT_USER +
        '?userId=' +
        this.userId
      }`, user,
      this.getHeaders()
    );
  }
}
