'use client';

import { useState } from 'react';
import { Token } from '../types/token';
import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from 'lucide-react';

interface TokenCardProps {
  token: Token;
  rank: number;
  onBuyToken: (token: Token, amount: number) => void;
}

export default function TokenCard({ token, rank, onBuyToken }: TokenCardProps) {
  const [buyAmount, setBuyAmount] = useState(10);
  const [isBuying, setIsBuying] = useState(false);

  const handleBuy = async () => {
    setIsBuying(true);
    try {
      await onBuyToken(token, buyAmount);
    } finally {
      setIsBuying(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(price);
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) {
      return `$${(volume / 1e9).toFixed(2)}B`;
    } else if (volume >= 1e6) {
      return `$${(volume / 1e6).toFixed(2)}M`;
    } else if (volume >= 1e3) {
      return `$${(volume / 1e3).toFixed(2)}K`;
    }
    return `$${volume.toFixed(2)}`;
  };

  const isPositive = token.priceChangePercent24h >= 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-shadow">
      {/* Rank Badge */}
      <div className="relative">
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center text-sm">
            {rank}
          </div>
        </div>
        
        {/* Token Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">{token.symbol}</h3>
              <p className="text-blue-100 text-sm">{token.name}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{formatPrice(token.price)}</div>
              <div className={`flex items-center text-sm ${isPositive ? 'text-green-200' : 'text-red-200'}`}>
                {isPositive ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                {Math.abs(token.priceChangePercent24h).toFixed(2)}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Token Stats */}
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <BarChart3 className="h-4 w-4" />
              <span>Volume 24h</span>
            </div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {formatVolume(token.volume24h)}
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <DollarSign className="h-4 w-4" />
              <span>Market Cap</span>
            </div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {formatVolume(token.marketCap)}
            </div>
          </div>
        </div>

        {/* Buy Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex items-center space-x-3 mb-3">
            <label htmlFor={`amount-${token.id}`} className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Buy Amount ($):
            </label>
            <input
              id={`amount-${token.id}`}
              type="number"
              min="1"
              max="1000"
              value={buyAmount}
              onChange={(e) => setBuyAmount(Number(e.target.value))}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <button
            onClick={handleBuy}
            disabled={isBuying || buyAmount <= 0}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
          >
            {isBuying ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Processing...</span>
              </div>
            ) : (
              `Buy $${buyAmount} of ${token.symbol}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
