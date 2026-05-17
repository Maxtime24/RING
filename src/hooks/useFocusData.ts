import { useCallback, useState } from 'react';
import { focusDataAPI } from '../services/api/focus';
import useAppStore from '../store/useAppStore';

export function useFocusData() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const focusAnalysis = useAppStore((state: any) => state.focusAnalysis);
  const setFocusAnalysis = useAppStore((state: any) => state.setFocusAnalysis);

  const fetchFocusAnalysis = useCallback(
    async (days = 7) => {
      setLoading(true);
      setError(null);

      try {
        const response = await focusDataAPI.getFocusAnalysis(days);
        if (response.success && response.data) {
          setFocusAnalysis(response.data);
        } else {
          setError(response.error?.message || '집중 분석 데이터를 가져오는 데 실패했습니다.');
        }
      } catch (err) {
        setError(String(err));
      } finally {
        setLoading(false);
      }
    },
    [setFocusAnalysis]
  );

  return {
    focusAnalysis,
    loading,
    error,
    fetchFocusAnalysis,
  };
}
