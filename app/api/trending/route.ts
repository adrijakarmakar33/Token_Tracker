import { NextResponse } from 'next/server';
import axios from 'axios';

interface CoinDCXToken {
  coindcx_name: string;
  base_currency_short_name: string;
  target_currency_short_name: string;
  target_currency_name: string;
  base_currency_name: string;
  min_quantity: string;
  max_quantity: string;
  base_currency_precision: number;
  target_currency_precision: number;
  step: string;
  order_types: string[];
  symbol: string;
  external_symbol: string;
  market_type: string;
  market_cap: string;
  bid: string;
  ask: string;
  last_price: string;
  high: string;
  low: string;
  volume: string;
  change: string;
  change_percentage: string;
}

export async function GET() {
  try {
    // Fetch data from CoinDCX API
    const response = await axios.get('https://api.coindcx.com/exchange/v1/markets_details');
    const data: CoinDCXToken[] = response.data;

    // Filter and process the data to get trending tokens
    const trendingTokens = data
      .filter(token => 
        // Filter for popular pairs and exclude some low-quality tokens
        token.target_currency_short_name === 'USDT' &&
        parseFloat(token.volume) > 100000 && // Minimum volume filter
        parseFloat(token.change_percentage) > 0 // Only positive changes for trending
      )
      .map(token => ({
        id: token.coindcx_name,
        symbol: token.base_currency_short_name,
        name: token.base_currency_name,
        price: parseFloat(token.last_price),
        change24h: parseFloat(token.change_percentage),
        volume24h: parseFloat(token.volume),
        marketCap: parseFloat(token.market_cap) || 0
      }))
      .sort((a, b) => b.change24h - a.change24h) // Sort by highest change first
      .slice(0, 3); // Get top 3

    // If no trending tokens found, return mock data
    if (trendingTokens.length === 0) {
      const mockTokens = [
        {
          id: '1',
          symbol: 'AIX',
          name: 'AI Exchange Token',
          price: 0.85,
          change24h: 30.5,
          volume24h: 2500000,
          marketCap: 85000000
        },
        {
          id: '2',
          symbol: 'ARB',
          name: 'Arbitrum',
          price: 1.25,
          change24h: 12.3,
          volume24h: 1800000,
          marketCap: 125000000
        },
        {
          id: '3',
          symbol: 'MATIC',
          name: 'Polygon',
          price: 0.92,
          change24h: 7.8,
          volume24h: 3200000,
          marketCap: 92000000
        }
      ];
      
      return NextResponse.json({ tokens: mockTokens });
    }

    return NextResponse.json({ tokens: trendingTokens });
  } catch (error) {
    console.error('Error fetching trending tokens:', error);
    
    // Return mock data as fallback
    const mockTokens = [
      {
        id: '1',
        symbol: 'AIX',
        name: 'AI Exchange Token',
        price: 0.85,
        change24h: 30.5,
        volume24h: 2500000,
        marketCap: 85000000
      },
      {
        id: '2',
        symbol: 'ARB',
        name: 'Arbitrum',
        price: 1.25,
        change24h: 12.3,
        volume24h: 1800000,
        marketCap: 125000000
      },
      {
        id: '3',
        symbol: 'MATIC',
        name: 'Polygon',
        price: 0.92,
        change24h: 7.8,
        volume24h: 3200000,
        marketCap: 92000000
      }
    ];
    
    return NextResponse.json({ tokens: mockTokens });
  }
}