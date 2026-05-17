/**
 * API Client - Axios 기반의 HTTP 클라이언트
 * 모든 API 호출은 이 클라이언트를 통해서만 이루어집니다.
 */

import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios';
import { ApiResponse, ApiError } from '../../types';
import { API_BASE_URL, API_TIMEOUT, ERROR_CODES } from '../../constants';

class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Response interceptor
    (this.client.interceptors.response.use as any)(
      this.handleResponse.bind(this),
      this.handleError.bind(this)
    );
  }

  /**
   * Set authentication token
   */
  setToken(token: string): void {
    this.token = token;
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Clear authentication token
   */
  clearToken(): void {
    this.token = null;
    delete this.client.defaults.headers.common['Authorization'];
  }

  /**
   * GET request
   */
  async get<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.get<T>(url, config);
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * POST request
   */
  async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.post<T>(url, data, config);
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * PUT request
   */
  async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.put<T>(url, data, config);
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * PATCH request
   */
  async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.patch<T>(url, data, config);
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * DELETE request
   */
  async delete<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.delete<T>(url, config);
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Handle successful response
   */
  private handleResponse(response: AxiosResponse): ApiResponse<any> {
    return {
      success: true,
      data: response.data,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Handle error response
   */
  private handleError(error: any): ApiResponse<any> {
    const apiError: ApiError = {
      code: ERROR_CODES.UNKNOWN_ERROR,
      message: '알 수 없는 오류가 발생했습니다',
      statusCode: 500,
    };

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      apiError.statusCode = axiosError.response?.status || 500;

      if (axiosError.response?.data) {
        const responseData = axiosError.response.data as any;
        apiError.code = responseData.code || ERROR_CODES.UNKNOWN_ERROR;
        apiError.message = responseData.message || axiosError.message;
        apiError.details = responseData.details;
      } else if (axiosError.code === 'ECONNABORTED') {
        apiError.code = ERROR_CODES.API_TIMEOUT;
        apiError.message = '요청 시간이 초과되었습니다';
      } else if (axiosError.code === 'ERR_NETWORK') {
        apiError.code = ERROR_CODES.NETWORK_ERROR;
        apiError.message = '네트워크 연결을 확인해주세요';
      } else {
        apiError.message = axiosError.message;
      }
    }

    return {
      success: false,
      error: apiError,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Upload file
   */
  async uploadFile<T>(
    url: string,
    file: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await this.client.post<T>(url, formData, {
        ...config,
        headers: {
          ...config?.headers,
          'Content-Type': 'multipart/form-data',
        },
      });

      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Download file
   */
  async downloadFile(
    url: string,
    filename: string
  ): Promise<void> {
    try {
      const response = await this.client.get(url, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data]);
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      window.URL.revokeObjectURL(link.href);
    } catch (error) {
      throw this.handleError(error);
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

export default apiClient;
