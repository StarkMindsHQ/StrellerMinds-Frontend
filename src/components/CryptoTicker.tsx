'use client'

import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

const fetchPrices = async () => {
  const { data } = await axios.get(
    'https://api.coingecko.com/api/v3/simple/price',
    {
      params: {
        ids: 'bitcoin,ethereum,stellar',
        vs_currencies: 'usd',
        include_24hr_change: 'true',
      },
    }
  )
  return data
}

const coins = [
  { id: 'bitcoin', symbol: 'BTC' },
  { id: 'ethereum', symbol: 'ETH' },
  { id: 'stellar', symbol: 'XLM' },
]

export default function CryptoTicker() {
  const { data, isLoading } = useQuery({
    queryKey: ['cryptoPrices'],
    queryFn: fetchPrices,
    refetchInterval: 15000,
  })

  if (isLoading || !data) return null

  return (
    <div className="ml-4 flex space-x-3 text-xs font-medium text-white">
      {coins.map(({ id, symbol }) => {
        const price = data[id]?.usd
        const change = data[id]?.usd_24h_change

        return (
          <div key={id} className="flex items-center space-x-1">
            <span>{symbol}: ${price?.toFixed(2)}</span>
            <span
              className={`w-2 h-2 rounded-full ${
                change >= 0 ? 'bg-green-400' : 'bg-red-400'
              }`}
            />
          </div>
        )
      })}
    </div>
  )
}
