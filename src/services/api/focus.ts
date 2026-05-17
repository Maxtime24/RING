import { apiClient } from './client';
import { ApiResponse, FocusAnalysis, FocusSession } from '../../types';

class FocusDataAPI {
  async getFocusAnalysis(days = 7): Promise<ApiResponse<FocusAnalysis>> {
    return apiClient.get<FocusAnalysis>('/focus/analysis', {
      params: { days },
    });
  }

  async getFocusSessions(
    startDate: string,
    endDate: string,
    page = 1,
    pageSize = 20
  ): Promise<ApiResponse<{ items: FocusSession[]; total: number }>> {
    return apiClient.get<{ items: FocusSession[]; total: number }>(
      '/focus/sessions',
      {
        params: { startDate, endDate, page, pageSize },
      }
    );
  }

  async saveFocusSession(
    session: Partial<FocusSession>
  ): Promise<ApiResponse<FocusSession>> {
    return apiClient.post<FocusSession>('/focus/session', session);
  }
}

export const focusDataAPI = new FocusDataAPI();
export default focusDataAPI;
