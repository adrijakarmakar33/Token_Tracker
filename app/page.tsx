'use client';

import { useState, useEffect } from 'react';
import TrendingTokens from './components/TrendingTokens';
import Header from './components/Header';
import TransactionHistory from './components/TransactionHistory';
import Stats from './components/Stats';
import Footer from './components/Footer';
import { Token } from './types/token';

interface Transaction {
  id: string;
  tokenSymbol: string;
  amount: number;
  status: 'success' | 'failed' | 'pending';
  timestamp: string;
  transactionHash?: string;
  gasUsed: number;
}

export default function Home() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    fetchTrendingTokens();
  }, []);

  const fetchTrendingTokens = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/trending-tokens');
      const data = await response.json();
      
      if (data.success) {
        setTokens(data.tokens);
      } else {
        setError(data.error || 'Failed to fetch trending tokens');
      }
    } catch (error) {
      console.error('Error fetching trending tokens:', error);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleBuyToken = async (token: Token, amount: number) => {
    try {
      const response = await fetch('/api/buy-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tokenSymbol: token.symbol,
          amount: amount,
          tokenAddress: token.address
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Add transaction to history
        const newTransaction: Transaction = {
          id: data.transaction.transactionHash || `tx-${Date.now()}`,
          tokenSymbol: token.symbol,
          amount: amount,
          status: 'success',
          timestamp: new Date().toISOString(),
          transactionHash: data.transaction.transactionHash,
          gasUsed: data.transaction.gasUsed,
        };
        
        setTransactions(prev => [newTransaction, ...prev]);
        
        alert(`✅ Successfully bought $${amount} of ${token.symbol}!`);
      } else {
        // Add failed transaction to history
        const failedTransaction: Transaction = {
          id: `tx-${Date.now()}`,
          tokenSymbol: token.symbol,
          amount: amount,
          status: 'failed',
          timestamp: new Date().toISOString(),
          gasUsed: 0,
        };
        
        setTransactions(prev => [failedTransaction, ...prev]);
        
        alert(`❌ Failed to buy ${token.symbol}: ${data.error}`);
      }
    } catch (error) {
      console.error('Error processing transaction:', error);
      alert('❌ Error processing transaction');
    }
  };

  // Calculate stats from transactions
  const successfulTransactions = transactions.filter(tx => tx.status === 'success');
  const totalVolume = successfulTransactions.reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              🚀 Trending Token Tracker
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Discover and buy trending tokens instantly with gasless transactions
            </p>
          </div>

          {/* Stats Section */}
          <Stats 
            transactionCount={successfulTransactions.length}
            totalVolume={totalVolume}
          />

          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              <strong>Error:</strong> {error}
            </div>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Trending Tokens Section */}
              <div className="lg:col-span-2">
                <TrendingTokens 
                  tokens={tokens} 
                  onBuyToken={handleBuyToken}
                  onRefresh={fetchTrendingTokens}
                />
              </div>
              
              {/* Transaction History Section */}
              <div className="lg:col-span-1">
                <TransactionHistory transactions={transactions} />
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
