import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Register } from '../interfaces/register';
import { ApiResponse } from '../interfaces/api.response';
import { Observable, tap } from 'rxjs';
import { GlobalConstant } from '../constants/global-const';
import { Login } from '../interfaces/login';
import { Token } from '../interfaces/token';
import { jwtDecode } from 'jwt-decode';

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
    return !!localStorage.getItem('token');
  }

  getToken(): string {
    return localStorage.getItem('token') ?? '';
  }

  getRefreshToken(): string {
    return localStorage.getItem('refreshToken') ?? '';
  }

  clearToken() {
    localStorage.clear();
  }

  decodedToken(data: string): string {
    return jwtDecode(data);
  }

  setToken(data: Token) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);
  }

  setRememberMe(isRememberMe: boolean) {
    localStorage.setItem("rememberMe", isRememberMe.toString());
  }

  register(data: Register): Observable<ApiResponse<Register>> {
    return this.httpClient.post<ApiResponse<Register>>(
      `${GlobalConstant.AUTH_API_URL}/register`,
      data,
      this.getHeaders()
    );
  }

  login(data: Login): Observable<ApiResponse<Token>> {
    return this.httpClient
      .post<ApiResponse<Token>>(
        `${GlobalConstant.AUTH_API_URL}/login`,
        data,
        this.getHeaders()
      )
      .pipe(
        tap((res) => {
          {
            if (res.success && res.data) {
              this.setRememberMe(data.rememberMe);
              this.setToken(res.data as Token);
            }
          }
        })
      );
  }
}