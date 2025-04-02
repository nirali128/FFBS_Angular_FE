import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalConstant } from '../constants/global-const';
import {
  ApiResponse
} from '../interfaces/api.response';
import { AuthService } from './authentication.service';
import { AddFeedback } from '../interfaces/feedback';

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
      `${GlobalConstant.FEEDBACK_API_URL + GlobalConstant.FEEDBACK.ADD_FEEDBACK}`,
      data,
      this.getHeaders()
    );
  }
}
