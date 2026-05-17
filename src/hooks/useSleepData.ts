import { useCallback, useState } from 'react';
import { sleepDataAPI } from '../services/api/sleep';
import useAppStore from '../store/useAppStore';
import { SleepData } from '../types';

export function useSleepData() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const todaySleep = useAppStore((state: any) => state.todaySleep);
  const setTodaySleep = useAppStore((state: any) => state.setTodaySleep);

  const fetchTodaySleep = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await sleepDataAPI.getTodaySleepData();
      if (response.success) {
        setTodaySleep(response.data ?? null);
      } else {
        setError(response.error?.message || '수면 데이터를 가져오는 데 실패했습니다.');
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, [setTodaySleep]);

  const saveSleepData = useCallback(
    async (data: Partial<SleepData>) => {
      setLoading(true);
      setError(null);

      try {
        const response = await sleepDataAPI.saveSleepData(data);
        if (response.success && response.data) {
          setTodaySleep(response.data);
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
    [setTodaySleep]
  );

  return {
    todaySleep,
    loading,
    error,
    fetchTodaySleep,
    saveSleepData,
  };
}
