import { useCallback, useEffect, useState } from 'react';
import { fetchSetting } from '../services/api';

/**
 * Loads a dynamic SiteSetting key from the backend API without client-side
 * static mock fallbacks.
 */
export const useStorefrontSetting = (key) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const value = await fetchSetting(key);
      setData(value || null);
    } catch (err) {
      setError(err?.message || `Failed to load ${key} configuration.`);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [key]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, reload: load };
};

export default useStorefrontSetting;
