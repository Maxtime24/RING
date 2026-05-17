import { apiClient } from './client';
import { ApiResponse, User } from '../../types';

class UserAPI {
  async getProfile(): Promise<ApiResponse<User>> {
    return apiClient.get<User>('/user/me');
  }

  async login(email: string, password: string): Promise<ApiResponse<{ token: string; user: User }>> {
    return apiClient.post('/auth/login', { email, password });
  }

  async logout(): Promise<ApiResponse<null>> {
    return apiClient.post('/auth/logout');
  }
}

export const userAPI = new UserAPI();
export default userAPI;
