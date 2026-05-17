/**
 * Health Data API Service
 * 심박수, 스트레스, 활동량 등 실시간 건강 데이터 API
 */

import { apiClient } from './client';
import {
  HealthData,
  HeartRateData,
  StressData,
  ActivityData,
  ApiResponse,
  PaginatedResponse,
} from '../../types';

class HealthDataAPI {
  /**
   * 최신 건강 데이터 조회
   */
  async getCurrentHealth(): Promise<ApiResponse<HealthData>> {
    return apiClient.get<HealthData>('/health/current');
  }

  /**
   * 건강 데이터 저장
   */
  async saveHealthData(data: Partial<HealthData>): Promise<ApiResponse<HealthData>> {
    return apiClient.post<HealthData>('/health/data', data);
  }

  /**
   * 심박수 데이터 조회
   */
  async getHeartRateData(
    startDate: string,
    endDate: string,
    limit: number = 100
  ): Promise<ApiResponse<PaginatedResponse<HeartRateData>>> {
    return apiClient.get<PaginatedResponse<HeartRateData>>('/health/heart-rate', {
      params: { startDate, endDate, limit },
    });
  }

  /**
   * 심박수 데이터 저장
   */
  async saveHeartRateData(data: Partial<HeartRateData>): Promise<ApiResponse<HeartRateData>> {
    return apiClient.post<HeartRateData>('/health/heart-rate', data);
  }

  /**
   * 심박수 데이터 배치 저장
   */
  async saveHeartRateDataBatch(
    data: Partial<HeartRateData>[]
  ): Promise<ApiResponse<{ saved: number; failed: number }>> {
    return apiClient.post<{ saved: number; failed: number }>(
      '/health/heart-rate/batch',
      { data }
    );
  }

  /**
   * 스트레스 데이터 조회
   */
  async getStressData(
    startDate: string,
    endDate: string,
    limit: number = 100
  ): Promise<ApiResponse<PaginatedResponse<StressData>>> {
    return apiClient.get<PaginatedResponse<StressData>>('/health/stress', {
      params: { startDate, endDate, limit },
    });
  }

  /**
   * 스트레스 데이터 저장
   */
  async saveStressData(data: Partial<StressData>): Promise<ApiResponse<StressData>> {
    return apiClient.post<StressData>('/health/stress', data);
  }

  /**
   * 활동량 데이터 조회
   */
  async getActivityData(
    startDate: string,
    endDate: string,
    limit: number = 100
  ): Promise<ApiResponse<PaginatedResponse<ActivityData>>> {
    return apiClient.get<PaginatedResponse<ActivityData>>('/health/activity', {
      params: { startDate, endDate, limit },
    });
  }

  /**
   * 활동량 데이터 저장
   */
  async saveActivityData(data: Partial<ActivityData>): Promise<ApiResponse<ActivityData>> {
    return apiClient.post<ActivityData>('/health/activity', data);
  }

  /**
   * 오늘의 건강 요약 조회
   */
  async getTodaySummary(): Promise<
    ApiResponse<{
      heartRate: { min: number; max: number; avg: number };
      stress: { min: number; max: number; avg: number };
      activity: { steps: number; calories: number; activeMinutes: number };
    }>
  > {
    return apiClient.get('/health/today-summary');
  }

  /**
   * 주간 건강 데이터 조회
   */
  async getWeeklyData(): Promise<
    ApiResponse<{
      heartRate: number[];
      stress: number[];
      activity: number[];
      dates: string[];
    }>
  > {
    return apiClient.get('/health/weekly');
  }

  /**
   * 월간 건강 데이터 조회
   */
  async getMonthlyData(): Promise<
    ApiResponse<{
      heartRate: number[];
      stress: number[];
      activity: number[];
      dates: string[];
    }>
  > {
    return apiClient.get('/health/monthly');
  }

  /**
   * 건강 알림 목록 조회
   */
  async getHealthAlerts(): Promise<ApiResponse<any[]>> {
    return apiClient.get('/health/alerts');
  }
}

export const healthDataAPI = new HealthDataAPI();

export default healthDataAPI;
