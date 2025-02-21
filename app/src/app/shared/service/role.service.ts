import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalConstant } from '../constants/global-const';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '../interfaces/api.response';
import { Role } from '../interfaces/role';
import { DropdownOption } from '../interfaces/dropdown.options';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
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

  getRole(): Observable<ApiResponse<DropdownOption[]>> {
    return this.httpClient
      .get<ApiResponse<Role[]>>(
        `${GlobalConstant.COMMON_API_URL}/get-all-roles`,
        this.getHeaders()
      )
      .pipe(
        map((response) => ({
          ...response,
          data: response.data.map((role) => this.mapRoleToDropdown(role)),
        }))
      );
  }

  clearToken() {
    localStorage.clear();
  }

  private mapRoleToDropdown(role: Role): DropdownOption {
    return {
      value: role.guid,
      label: role.roleName,
    };
  }
}