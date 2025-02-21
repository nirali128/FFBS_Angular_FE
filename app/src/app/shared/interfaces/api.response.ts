export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  validationError?: ValidationError[];
  errorId?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}