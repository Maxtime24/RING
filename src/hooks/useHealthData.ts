import { useCallback, useState } from 'react';
import useAppStore from '../store/useAppStore';
import { HealthData } from '../types';

export function useHealthData() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const currentHealth = useAppStore((state: any) => state.currentHealth);
  const setCurrentHealth = useAppStore((state: any) => state.setCurrentHealth);

  const fetchCurrentHealth = useCallback(async () => {
    // Backend API bypassed; data is stored locally in useAppStore
    setLoading(false);
    setError(null);
  }, []);

  const saveHealthData = useCallback(
    async (data: Partial<HealthData>) => {
      setLoading(true);
      setError(null);

      try {
        // Backend API bypassed; we just update the local store manually
        const updatedHealth = currentHealth 
          ? { ...currentHealth, ...data } 
          : { ...data, timestamp: new Date().toISOString() } as HealthData;
        setCurrentHealth(updatedHealth);
        return updatedHealth;
      } catch (err) {
        setError(String(err));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentHealth, setCurrentHealth]
  );

  return {
    currentHealth,
    loading,
    error,
    fetchCurrentHealth,
    saveHealthData,
  };
}
