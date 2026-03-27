import { useEffect, useState } from 'react';

const API_URL = '/api/blockchain-stats';
// Replace with real endpoint (e.g. Stellar Horizon / Alchemy / custom backend)

const useBlockchainStats = (interval = 5000) => {
  const [data, setData] = useState({
    tps: null,
    latestBlock: null,
    avgFee: null,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setError(null);

      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Failed to fetch stats');

      const result = await res.json();

      setData({
        tps: result.tps,
        latestBlock: result.latestBlock,
        avgFee: result.avgFee,
      });

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    const intervalId = setInterval(fetchStats, interval);
    return () => clearInterval(intervalId);
  }, [interval]);

  return { data, loading, error };
};

export default useBlockchainStats;
