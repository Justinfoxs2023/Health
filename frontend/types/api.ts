export interface ApiResponse<T> {
  code: number;
  data: T;
  message: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  total: number;
  page: number;
  pageSize: number;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  keyword?: string;
  category?: string;
} 