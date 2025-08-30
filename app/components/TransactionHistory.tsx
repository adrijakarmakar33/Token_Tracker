'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, Clock, ExternalLink } from 'lucide-react';

interface Transaction {
  id: string;
  tokenSymbol: string;
  amount: number;
  status: 'success' | 'failed' | 'pending';
  timestamp: string;
  transactionHash?: string;
  gasUsed: number;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export default function TransactionHistory({ transactions }: TransactionHistoryProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'success':
        return 'Success';
      case 'failed':
        return 'Failed';
      case 'pending':
        return 'Pending';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600 dark:text-green-400';
      case 'failed':
        return 'text-red-600 dark:text-red-400';
      case 'pending':
        return 'text-yellow-600 dark:text-yellow-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Transaction History
        </h3>
        <div className="text-center py-8">
          <div className="text-gray-500 dark:text-gray-400">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No transactions yet</p>
            <p className="text-sm">Your gasless trades will appear here</p>
          </div>
        </div>
      </div>
    );
  }

  const displayedTransactions = isExpanded ? transactions : transactions.slice(0, 3);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Recent Transactions
        </h3>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {transactions.length} total
        </div>
      </div>

      <div className="space-y-3">
        {displayedTransactions.map((tx) => (
          <div
            key={tx.id}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <div className="flex items-center space-x-3">
              {getStatusIcon(tx.status)}
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  Buy ${tx.amount} {tx.tokenSymbol}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {formatTime(tx.timestamp)}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className={`text-sm font-medium ${getStatusColor(tx.status)}`}>
                {getStatusText(tx.status)}
              </div>
              
              {tx.transactionHash && (
                <a
                  href={`https://mumbai.polygonscan.com/tx/${tx.transactionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
              
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {tx.gasUsed === 0 ? 'Gasless' : `${tx.gasUsed} gas`}
              </div>
            </div>
          </div>
        ))}
      </div>

      {transactions.length > 3 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full mt-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
        >
          {isExpanded ? 'Show Less' : `Show ${transactions.length - 3} More`}
        </button>
      )}
    </div>
  );
}
