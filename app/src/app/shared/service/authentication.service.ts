import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Register } from '../interfaces/register';
import { ApiResponse } from '../interfaces/api.response';
import { Observable, tap } from 'rxjs';
import { GlobalConstant } from '../constants/global-const';
import { Login } from '../interfaces/login';
import { Token } from '../interfaces/token';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken } from '../interfaces/decoded.token';

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

  constructor(private http: HttpClient) {}

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string {
    return localStorage.getItem('token') ?? '';
  }

  getRefreshToken(): string {
    return localStorage.getItem('refreshToken') ?? '';
  }

  getRole(): string {
    return localStorage.getItem('role') ?? '';
  }

  getExpiryTime(): string {
    return localStorage.getItem('expiryTime') ?? '';
  }

  clearToken() {
    localStorage.clear();
  }

  decodedToken(data: string): DecodedToken {
    return jwtDecode(data);
  }

  setToken(data: Token) {
    let token = this.decodedToken(data.token);
    localStorage.setItem('token', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('expiryTime', new Date(token.exp * 1000).toString())
    localStorage.setItem('role', token.role);
  }

  setRememberMe(isRememberMe: boolean) {
    localStorage.setItem("rememberMe", isRememberMe.toString());
  }

  register(data: Register): Observable<ApiResponse<Register>> {
    return this.http.post<ApiResponse<Register>>(
      `${GlobalConstant.AUTH_API_URL + GlobalConstant.AUTH.REGISTER}`,
      data,
      this.getHeaders()
    );
  }

  login(data: Login): Observable<ApiResponse<Token>> {
    return this.http
      .post<ApiResponse<Token>>(
        `${GlobalConstant.AUTH_API_URL + GlobalConstant.AUTH.LOGIN}`,
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

  refreshToken(refresh: string): Observable<ApiResponse<Token>> {
    return this.http.post<ApiResponse<Token>>(`${GlobalConstant.AUTH_API_URL + GlobalConstant.AUTH.REFRESH_TOKEN}`, {refreshToken: refresh}, this.getHeaders());
  }
}