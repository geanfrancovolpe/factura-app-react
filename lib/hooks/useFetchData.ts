import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface UseFetchDataOptions<T> {
  fetchFn: () => Promise<T>;
  errorMessage?: string;
}

export function useFetchData<T>({ fetchFn, errorMessage = 'Error al cargar los datos' }: UseFetchDataOptions<T>) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await fetchFn();
      setData(result);
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || errorMessage;
      setError(message);
      toast.error(message);
      console.error('Error loading data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return { data, isLoading, error, reload: loadData };
}
