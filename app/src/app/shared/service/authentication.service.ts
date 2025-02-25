import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Register } from '../interfaces/register';
import { ApiResponse } from '../interfaces/api.response';
import { Observable } from 'rxjs';
import { GlobalConstant } from '../constants/global-const';
//import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
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

  isLoggedIn(): boolean {
    return !!localStorage.getItem('');
  }

  getToken(): string {
    return localStorage.getItem('') ?? '';
  }

  clearToken() {
    localStorage.clear();
  }

  decodedToken() {
    //return jwtDecode(this.getToken());
  }

  register(data: Register): Observable<ApiResponse<Register[]>> {
    return this.httpClient.post<ApiResponse<Register[]>>(
      `${GlobalConstant.AUTH_API_URL}/register`,
      data,
      this.getHeaders()
    );
  }

  login(data: any) {}
}