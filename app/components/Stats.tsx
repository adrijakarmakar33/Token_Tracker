'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Users, Zap, DollarSign } from 'lucide-react';

interface StatsProps {
  transactionCount?: number;
  totalVolume?: number;
}

export default function Stats({ transactionCount = 0, totalVolume = 0 }: StatsProps) {
  const [stats, setStats] = useState([
    {
      icon: TrendingUp,
      label: 'Trending Tokens',
      value: '3',
      description: 'Live from CoinDCX'
    },
    {
      icon: Zap,
      label: 'Gasless Trades',
      value: transactionCount.toString(),
      description: 'No gas fees'
    },
    {
      icon: Users,
      label: 'Active Users',
      value: '1.2K+',
      description: 'This month'
    },
    {
      icon: DollarSign,
      label: 'Total Volume',
      value: totalVolume > 0 ? `$${totalVolume.toLocaleString()}` : '$45K+',
      description: 'Traded'
    }
  ]);

  useEffect(() => {
    setStats(prev => prev.map(stat => {
      if (stat.label === 'Gasless Trades') {
        return { ...stat, value: transactionCount.toString() };
      }
      if (stat.label === 'Total Volume') {
        return { ...stat, value: totalVolume > 0 ? `$${totalVolume.toLocaleString()}` : '$45K+' };
      }
      return stat;
    }));
  }, [transactionCount, totalVolume]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 text-center hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <div className="flex justify-center mb-2">
            <stat.icon className="h-6 w-6 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {stat.value}
          </div>
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {stat.label}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-500">
            {stat.description}
          </div>
        </div>
      ))}
    </div>
  );
}
