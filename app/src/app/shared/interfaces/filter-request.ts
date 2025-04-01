export interface FilterRequest {
  pageSize: number;
  pageNumber: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}