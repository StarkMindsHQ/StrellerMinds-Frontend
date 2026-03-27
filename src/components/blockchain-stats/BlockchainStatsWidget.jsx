import React from 'react';
import useBlockchainStats from './useBlockchainStats';
import StatsCard from './StatsCard';

const BlockchainStatsWidget = () => {
  const { data, loading, error } = useBlockchainStats(5000);

  if (loading) {
    return (
      <div className="bg-gray-900 p-6 rounded-xl text-gray-400">
        Loading blockchain stats...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/30 border border-red-700 p-6 rounded-xl text-red-400">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="bg-gray-950 p-6 rounded-2xl border border-gray-800 w-full max-w-xl">
      <h2 className="text-lg font-bold text-white mb-4">
        Live Blockchain Stats
      </h2>

      <div className="grid grid-cols-3 gap-4">
        <StatsCard label="TPS" value={data.tps} />
        <StatsCard label="Latest Block" value={data.latestBlock} />
        <StatsCard label="Avg Fee (ETH)" value={data.avgFee} />
      </div>
    </div>
  );
};

export default BlockchainStatsWidget;
