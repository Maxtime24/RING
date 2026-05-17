import { useCallback, useState } from 'react';
import useAppStore from '../store/useAppStore';
import { SleepData } from '../types';

export function useSleepData() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const todaySleep = useAppStore((state: any) => state.todaySleep);
  const setTodaySleep = useAppStore((state: any) => state.setTodaySleep);

  const fetchTodaySleep = useCallback(async () => {
    // Backend API bypassed; using local state from useAppStore
    setLoading(false);
    setError(null);
  }, []);

  const saveSleepData = useCallback(
    async (data: Partial<SleepData>) => {
      setLoading(true);
      setError(null);

      try {
        // Backend API bypassed; updating local state manually
        const updatedSleep = todaySleep 
          ? { ...todaySleep, ...data } 
          : { ...data } as SleepData;
        setTodaySleep(updatedSleep);
        return updatedSleep;
      } catch (err) {
        setError(String(err));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [todaySleep, setTodaySleep]
  );

  return {
    todaySleep,
    loading,
    error,
    fetchTodaySleep,
    saveSleepData,
  };
}
