'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Zap } from 'lucide-react';

interface TrendingToken {
  symbol: string;
  target_currency_short_name: string;
  base_currency_short_name: string;
  price: string;
  change_24h: string;
  volume: string;
  high_24h: string;
  low_24h: string;
}

export default function Home() {
  const [trendingTokens, setTrendingTokens] = useState<TrendingToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [buyingToken, setBuyingToken] = useState<string | null>(null);
  const [buyAmount, setBuyAmount] = useState('10');
  const [userAddress] = useState('0x1234...5678'); // Mock user address

  useEffect(() => {
    fetchTrendingTokens();
  }, []);

  const fetchTrendingTokens = async () => {
    try {
      const response = await fetch('/api/trending-tokens');
      const data = await response.json();
      
      if (data.success) {
        setTrendingTokens(data.trending_tokens);
      }
    } catch (error) {
      console.error('Error fetching trending tokens:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyToken = async (tokenSymbol: string) => {
    setBuyingToken(tokenSymbol);
    
    try {
      const response = await fetch('/api/buy-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tokenSymbol,
          amount: buyAmount,
          userAddress,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert(`✅ Successfully bought ${tokenSymbol}!\n\nTransaction Hash: ${data.transaction_hash}\nNetwork: ${data.network}\nGasless: ${data.gasless ? 'Yes' : 'No'}`);
      } else {
        alert(`❌ Failed to buy ${tokenSymbol}: ${data.error}`);
      }
    } catch (error) {
      alert(`❌ Error buying ${tokenSymbol}: ${error}`);
    } finally {
      setBuyingToken(null);
    }
  };

  const formatPrice = (price: string) => {
    const num = parseFloat(price);
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  const formatVolume = (volume: string) => {
    const num = parseFloat(volume);
    if (num >= 1e9) return `₹${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `₹${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `₹${(num / 1e3).toFixed(1)}K`;
    return `₹${num.toFixed(0)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-lg">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Trending Token Tracker
              </h1>
              <p className="text-gray-600 dark:text-gray-300 flex items-center mt-1">
                <Zap className="h-4 w-4 mr-1 text-yellow-500" />
                Gasless Trading Enabled
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            🔥 Top 3 Trending Tokens
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Buy trending crypto tokens instantly without gas fees using our gasless trading technology.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {trendingTokens.map((token, index) => {
              const changePercent = parseFloat(token.change_24h);
              const isPositive = changePercent > 0;
              
              return (
                <div
                  key={token.symbol}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300"
                >
                  {/* Rank Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      #{index + 1}
                    </div>
                    <div className={`flex items-center px-2 py-1 rounded-lg ${
                      isPositive 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {isPositive ? (
                        <TrendingUp className="h-4 w-4 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 mr-1" />
                      )}
                      {changePercent > 0 ? '+' : ''}{changePercent.toFixed(2)}%
                    </div>
                  </div>

                  {/* Token Info */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      {token.base_currency_short_name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {token.symbol}
                    </p>
                  </div>

                  {/* Price Info */}
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Price:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {formatPrice(token.price)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Volume 24h:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {formatVolume(token.volume)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">High/Low:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {formatPrice(token.high_24h)} / {formatPrice(token.low_24h)}
                      </span>
                    </div>
                  </div>

                  {/* Buy Section */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <input
                        type="number"
                        value={buyAmount}
                        onChange={(e) => setBuyAmount(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Amount in ETH"
                        min="0.001"
                        step="0.001"
                      />
                      <span className="text-sm text-gray-500 dark:text-gray-400">ETH</span>
                    </div>
                    
                    <button
                      onClick={() => handleBuyToken(token.symbol)}
                      disabled={buyingToken === token.symbol}
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {buyingToken === token.symbol ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4" />
                          <span>Buy {token.base_currency_short_name} (Gasless)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Info Section */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <DollarSign className="h-5 w-5 mr-2 text-green-500" />
            How It Works
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-blue-600 dark:text-blue-300">1</span>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">View Trending</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                See the top 3 trending tokens with real-time price data from CoinDCX
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-green-600 dark:text-green-300">2</span>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Select Amount</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Choose how much ETH you want to swap for the trending token
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-purple-600 dark:text-purple-300">3</span>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Gasless Buy</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Execute the swap instantly without paying gas fees using AgentKit
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-600 dark:text-gray-300">
            Built for OnchAIn Island Hackathon with 💙 using Next.js, CoinDCX API & 0xGasless AgentKit
          </p>
        </div>
      </footer>
    </div>
  );
}
