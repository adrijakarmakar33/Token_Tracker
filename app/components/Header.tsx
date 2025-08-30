import { TrendingUp, Zap } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <Zap className="h-6 w-6 text-yellow-500" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Trending Token Tracker
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Gasless Trading
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Live Market Data</span>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full">
              <span className="text-blue-700 dark:text-blue-300 text-sm font-medium">
                Testnet
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
