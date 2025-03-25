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
import * as CryptoJS from 'crypto-js';
import { environment } from '../../../environment/environment';
import { ResetPassword } from '../interfaces/user';

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
    let encryptedToken = localStorage.getItem('token');
    return this.decrypt(encryptedToken) ?? '';
  }

  getUserId(): string {
    let token = this.getToken()
    let decodedToken = this.decodedToken(token);
    return decodedToken.guid;
  }

  getRole(): string {
    let token = this.getToken()
    let decodedToken = this.decodedToken(token);
    return decodedToken.role
  }

  getRefreshToken(): string {
    const encryptedRefreshToken = localStorage.getItem('refreshToken');
    return encryptedRefreshToken ? this.decrypt(encryptedRefreshToken) : '';
  }

  getExpiryTime(): string {
    let decodedToken: DecodedToken;
    let token = this.getToken();
    if(token) {
      decodedToken = this.decodedToken(token);
    }
    return  new Date(decodedToken.exp * 1000).toString() ?? '';
  }

  clearToken() {
    localStorage.clear();
  }

  decodedToken(data: string): DecodedToken {
    return jwtDecode(data);
  }

  setToken(data: Token) {
    const encryptedToken = this.encrypt(data.token);
    const encryptedRefreshToken = this.encrypt(data.refreshToken);
    
    localStorage.setItem('token', encryptedToken);
    localStorage.setItem('refreshToken', encryptedRefreshToken);
  }

  setRememberMe(isRememberMe: boolean) {
    localStorage.setItem("rememberMe", isRememberMe.toString());
  }

  register(data: Register): Observable<ApiResponse<Register>> {
    return this.http.post<ApiResponse<Register>>(
      `${environment.baseUrl + GlobalConstant.AUTH.REGISTER}`,
      data,
      this.getHeaders()
    );
  }

  login(data: Login): Observable<ApiResponse<Token>> {
    return this.http
      .post<ApiResponse<Token>>(
        `${environment.baseUrl + GlobalConstant.AUTH.LOGIN}`,
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

  changePassword(resetPassword: ResetPassword) {
    return this.http.post(`${environment.baseUrl + GlobalConstant.AUTH.RESET_PASSWORD}`, resetPassword, this.getHeaders())
  }

  refreshToken(refresh: string): Observable<ApiResponse<Token>> {
    return this.http.post<ApiResponse<Token>>(`${environment.baseUrl + GlobalConstant.AUTH.REFRESH_TOKEN}`, {refreshToken: refresh}, this.getHeaders());
  }

  public encrypt(data: string): string {
    return CryptoJS.AES.encrypt(data, GlobalConstant.ENCRYPTION_KEY).toString();
  }

  private decrypt(data: string): string {
    const bytes = CryptoJS.AES.decrypt(data, GlobalConstant.ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}