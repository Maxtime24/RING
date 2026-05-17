import { useCallback, useState } from 'react';
import useAppStore from '../store/useAppStore';

export function useFocusData() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const focusAnalysis = useAppStore((state: any) => state.focusAnalysis);
  const setFocusAnalysis = useAppStore((state: any) => state.setFocusAnalysis);

  const fetchFocusAnalysis = useCallback(
    async (days = 7) => {
      // Backend API bypassed; using local state from useAppStore
      setLoading(false);
      setError(null);
    },
    []
  );

  return {
    focusAnalysis,
    loading,
    error,
    fetchFocusAnalysis,
  };
}
