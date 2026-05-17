import { useCallback, useState } from 'react';
import { healthDataAPI } from '../services/api/health';
import useAppStore from '../store/useAppStore';
import { HealthData } from '../types';

export function useHealthData() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const currentHealth = useAppStore((state: any) => state.currentHealth);
  const setCurrentHealth = useAppStore((state: any) => state.setCurrentHealth);

  const fetchCurrentHealth = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await healthDataAPI.getCurrentHealth();
      if (response.success && response.data) {
        setCurrentHealth(response.data);
      } else {
        setError(response.error?.message || '데이터를 가져오는 데 실패했습니다.');
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, [setCurrentHealth]);

  const saveHealthData = useCallback(
    async (data: Partial<HealthData>) => {
      setLoading(true);
      setError(null);

      try {
        const response = await healthDataAPI.saveHealthData(data);
        if (response.success && response.data) {
          setCurrentHealth(response.data);
          return response.data;
        }

        throw new Error(response.error?.message || '저장에 실패했습니다.');
      } catch (err) {
        setError(String(err));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setCurrentHealth]
  );

  return {
    currentHealth,
    loading,
    error,
    fetchCurrentHealth,
    saveHealthData,
  };
}
