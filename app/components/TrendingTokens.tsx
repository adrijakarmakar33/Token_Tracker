'use client';

import { useState } from 'react';
import { Token } from '../types/token';
import TokenCard from './TokenCard';
import { RefreshCw, TrendingUp } from 'lucide-react';

interface TrendingTokensProps {
  tokens: Token[];
  onBuyToken: (token: Token, amount: number) => void;
  onRefresh: () => void;
}

export default function TrendingTokens({ tokens, onBuyToken, onRefresh }: TrendingTokensProps) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await onRefresh();
    setRefreshing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-6 w-6 text-green-600" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Top 3 Trending Tokens
          </h2>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tokens.slice(0, 3).map((token, index) => (
          <TokenCard
            key={token.id}
            token={token}
            rank={index + 1}
            onBuyToken={onBuyToken}
          />
        ))}
      </div>

      {tokens.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 dark:text-gray-400">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No trending tokens available</p>
            <p className="text-sm">Try refreshing the data</p>
          </div>
        </div>
      )}
    </div>
  );
}
