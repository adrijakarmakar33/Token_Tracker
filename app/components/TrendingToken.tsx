interface Token {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
}

interface TrendingTokenProps {
  token: Token;
  rank: number;
  onBuy: () => void;
}

export function TrendingToken({ token, rank, onBuy }: TrendingTokenProps) {
  const isPositive = token.change24h >= 0;
  const rankEmoji = rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉';
  
  const formatVolume = (volume: number) => {
    if (volume >= 1000000) {
      return `$${(volume / 1000000).toFixed(1)}M`;
    } else if (volume >= 1000) {
      return `$${(volume / 1000).toFixed(1)}K`;
    }
    return `$${volume.toFixed(0)}`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
      {/* Header with Rank */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{rankEmoji}</span>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {token.symbol}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {token.name}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              ${token.price.toFixed(2)}
            </div>
            <div className={`text-sm font-medium ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {isPositive ? '+' : ''}{token.change24h.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="p-6 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">24h Volume</span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {formatVolume(token.volume24h)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">Market Cap</span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {formatVolume(token.marketCap)}
          </span>
        </div>
      </div>

      {/* Buy Button */}
      <div className="p-6 pt-0">
        <button
          onClick={onBuy}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        >
          🚀 Buy {token.symbol}
        </button>
      </div>
    </div>
  );
}