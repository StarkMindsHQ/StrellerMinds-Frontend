'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { TrendingUp, TrendingDown, Loader2, AlertCircle } from 'lucide-react';
import { env } from '@/lib/env';

// TypeScript interfaces for API responses
interface CoinPrice {
  usd: number;
  usd_24h_change: number;
}

interface CryptoData {
  bitcoin: CoinPrice;
  ethereum: CoinPrice;
  stellar: CoinPrice;
}

interface CoinConfig {
  id: keyof CryptoData;
  symbol: string;
  name: string;
}

const fetchCryptoPrices = async (): Promise<CryptoData> => {
  const { data } = await axios.get(
    `${env.NEXT_PUBLIC_COINGECKO_API_URL}/simple/price`,
    {
      params: {
        ids: 'bitcoin,ethereum,stellar',
        vs_currencies: 'usd',
        include_24hr_change: 'true',
      },
      timeout: env.NEXT_PUBLIC_API_TIMEOUT,

    },
  );
  return data;
};

const coins: CoinConfig[] = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin' },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum' },
  { id: 'stellar', symbol: 'XLM', name: 'Stellar' },
];

const formatPrice = (price: number): string => {
  if (price >= 1000) {
    return price.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }
  return price.toFixed(4);
};

const formatChange = (change: number): string => {
  return `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`;
};

export default function CryptoTicker() {
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ['cryptoPrices'],
    queryFn: fetchCryptoPrices,
    refetchInterval: 15000, // Refetch every 15 seconds
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 text-xs text-white/70">
        <Loader2 className="h-3 w-3 animate-spin" />
        <span>Loading prices...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center space-x-2 text-xs text-red-300">
        <AlertCircle className="h-3 w-3" />
        <span>Price unavailable</span>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="flex items-center space-x-4 text-xs font-medium">
      {coins.map(({ id, symbol, name }) => {
        const coinData = data[id];
        if (!coinData) return null;

        const { usd: price, usd_24h_change: change } = coinData;
        const isPositive = change >= 0;

        return (
          <div
            key={id}
            className="flex items-center space-x-1.5 group cursor-pointer transition-all duration-200 hover:scale-105"
            title={`${name}: $${formatPrice(price)} (${formatChange(change)} 24h)`}
          >
            {/* Symbol and Price */}
            <div className="flex items-center space-x-1">
              <span className="text-white font-semibold">{symbol}</span>
              <span className="text-[#ffcc00]">${formatPrice(price)}</span>
            </div>

            {/* Change Indicator */}
            <div className="flex items-center space-x-0.5">
              {isPositive ? (
                <TrendingUp className="h-3 w-3 text-green-400" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-400" />
              )}
              <span
                className={`text-xs font-medium ${
                  isPositive ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {formatChange(change)}
              </span>
            </div>
          </div>
        );
      })}

      {/* Live indicator */}
      <div className="flex items-center space-x-1">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span className="text-white/60 text-xs">LIVE</span>
      </div>
    </div>
  );
}
