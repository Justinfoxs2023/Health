declare module '../utils/api' {
  import { AxiosInstance } from 'axios';
  
  interface ApiService {
    get<T = any>(url: string, config?: any): Promise<T>;
    post<T = any>(url: string, data?: any, config?: any): Promise<T>;
    put<T = any>(url: string, data?: any, config?: any): Promise<T>;
    delete<T = any>(url: string, config?: any): Promise<T>;
  }

  export const api: AxiosInstance & ApiService;
} 