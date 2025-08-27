'use client';

import { useState, useEffect } from 'react';
import { TrendingToken } from './components/TrendingToken';
import { BuyModal } from './components/BuyModal';

interface Token {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
}

export default function Home() {
  const [trendingTokens, setTrendingTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [buyAmount, setBuyAmount] = useState(10);

  useEffect(() => {
    fetchTrendingTokens();
  }, []);

  const fetchTrendingTokens = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/trending');
      const data = await response.json();
      setTrendingTokens(data.tokens);
    } catch (error) {
      console.error('Error fetching trending tokens:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyToken = (token: Token) => {
    setSelectedToken(token);
    setShowBuyModal(true);
  };

  const handleBuyConfirm = async (amount: number) => {
    try {
      if (!selectedToken) return;
      
      console.log(`🔄 Initiating gasless swap for $${amount} of ${selectedToken.symbol}`);
      
      const response = await fetch('/api/swap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tokenSymbol: selectedToken.symbol,
          amountUSD: amount,
          userAddress: 'demo-user' // In real app, this would be the connected wallet address
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert(`✅ ${result.message}\nTransaction: ${result.transactionHash}`);
        setShowBuyModal(false);
        setSelectedToken(null);
      } else {
        alert(`❌ ${result.message || 'Failed to buy token. Please try again.'}`);
      }
    } catch (error) {
      console.error('Error buying token:', error);
      alert('❌ Failed to buy token. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            🚀 Trending Token Tracker
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Track trending crypto tokens and buy them instantly without gas fees
          </p>
          <div className="mt-4 inline-flex items-center px-4 py-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm font-medium">
            ⚡ Gasless Trading Enabled
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Trending Tokens Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {trendingTokens.map((token, index) => (
                <TrendingToken
                  key={token.id}
                  token={token}
                  rank={index + 1}
                  onBuy={() => handleBuyToken(token)}
                />
              ))}
            </div>

            {/* Info Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                How It Works
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 dark:text-blue-400 text-xl">1</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    View Trending Tokens
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    See the top 3 trending tokens with real-time prices and charts
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-green-600 dark:text-green-400 text-xl">2</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Click Buy
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Select the amount you want to buy and confirm your purchase
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-purple-600 dark:text-purple-400 text-xl">3</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Gasless Swap
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Our AI agent executes the swap without any gas fees
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Buy Modal */}
        {showBuyModal && selectedToken && (
          <BuyModal
            token={selectedToken}
            amount={buyAmount}
            onAmountChange={setBuyAmount}
            onConfirm={handleBuyConfirm}
            onClose={() => setShowBuyModal(false)}
          />
        )}
      </div>
    </div>
  );
}
