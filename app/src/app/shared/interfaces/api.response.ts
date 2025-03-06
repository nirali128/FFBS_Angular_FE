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

export interface ApiPaginatedResponse<T> extends ApiResponse<T> {
  pagination: PaginationData;
}

export interface PaginationData {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}