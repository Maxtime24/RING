/**
 * Sleep Data API Service
 * 수면 데이터 조회, 저장, 분석 API
 */

import { apiClient } from './client';
import {
  SleepData,
  SleepTrend,
  ApiResponse,
  PaginatedResponse,
} from '../../types';

class SleepDataAPI {
  /**
   * 오늘의 수면 데이터 조회
   */
  async getTodaySleepData(): Promise<ApiResponse<SleepData | null>> {
    return apiClient.get<SleepData | null>('/sleep/today');
  }

  /**
   * 수면 데이터 저장
   */
  async saveSleepData(data: Partial<SleepData>): Promise<ApiResponse<SleepData>> {
    return apiClient.post<SleepData>('/sleep/data', data);
  }

  /**
   * 날짜별 수면 데이터 조회
   */
  async getSleepDataByDate(date: string): Promise<ApiResponse<SleepData | null>> {
    return apiClient.get<SleepData | null>(`/sleep/data/${date}`);
  }

  /**
   * 기간별 수면 데이터 조회
   */
  async getSleepDataRange(
    startDate: string,
    endDate: string,
    limit: number = 100
  ): Promise<ApiResponse<PaginatedResponse<SleepData>>> {
    return apiClient.get<PaginatedResponse<SleepData>>('/sleep/range', {
      params: { startDate, endDate, limit },
    });
  }

  /**
   * 주간 수면 데이터 조회
   */
  async getWeeklySleepData(): Promise<
    ApiResponse<{
      data: SleepData[];
      average: {
        duration: number;
        quality: number;
        deepSleepDuration: number;
        remSleepDuration: number;
      };
    }>
  > {
    return apiClient.get('/sleep/weekly');
  }

  /**
   * 월간 수면 데이터 조회
   */
  async getMonthlySleepData(): Promise<
    ApiResponse<{
      data: SleepData[];
      average: {
        duration: number;
        quality: number;
      };
      trends: SleepTrend[];
    }>
  > {
    return apiClient.get('/sleep/monthly');
  }

  /**
   * 수면 분석 조회
   */
  async analyzeSleepPattern(days: number = 30): Promise<
    ApiResponse<{
      averageDuration: number;
      averageQuality: number;
      bestSleepTime: string;
      worstSleepTime: string;
      recommendations: string[];
      trends: {
        improving: boolean;
        changePercent: number;
      };
    }>
  > {
    return apiClient.get('/sleep/analysis', { params: { days } });
  }

  /**
   * 수면 회복 점수 조회
   */
  async getRecoveryScore(): Promise<
    ApiResponse<{
      score: number;
      level: 'low' | 'medium' | 'high' | 'excellent';
      message: string;
    }>
  > {
    return apiClient.get('/sleep/recovery-score');
  }

  /**
   * 수면 목표 설정
   */
  async setSleepGoal(targetDurationMinutes: number): Promise<ApiResponse<any>> {
    return apiClient.post('/sleep/goal', { targetDurationMinutes });
  }

  /**
   * 수면 목표 조회
   */
  async getSleepGoal(): Promise<
    ApiResponse<{
      targetDurationMinutes: number;
      currentStreak: number;
      successRate: number;
    }>
  > {
    return apiClient.get('/sleep/goal');
  }
}

export const sleepDataAPI = new SleepDataAPI();

export default sleepDataAPI;
