import { NextResponse } from 'next/server';
import axios from 'axios';
import { Token } from '../../types/token';
import logger from '../../utils/logger';
import { performance } from 'perf_hooks';


interface CoinDCXMarket {
  market: string;
  base_currency_short_name: string;
  base_currency_name: string;
  last_price: string;
  change_24h: string;
  change_24h_percent: string;
  volume_24h: string;
  market_cap: string;
  status: string;
  quote_currency_short_name: string;
}

export async function GET() {
  try {
    // Fetch real data from CoinDCX API
    const response = await axios.get('https://api.coindcx.com/exchange/v1/markets_details');
    const markets = response.data as CoinDCXMarket[];
    
    // Filter and process trending tokens
    const trendingTokens = markets
      .filter((market: CoinDCXMarket) => 
        market.status === 'active' && 
        market.quote_currency_short_name === 'INR' &&
        parseFloat(market.volume_24h) > 1000000 // Only tokens with significant volume
      )
      .map((market: CoinDCXMarket) => ({
        id: market.market,
        symbol: market.base_currency_short_name,
        name: market.base_currency_name,
        price: parseFloat(market.last_price),
        priceChange24h: parseFloat(market.change_24h || '0'),
        priceChangePercent24h: parseFloat(market.change_24h_percent || '0'),
        volume24h: parseFloat(market.volume_24h || '0'),
        marketCap: parseFloat(market.market_cap || '0'),
        rank: 0,
        address: `0x${Math.random().toString(16).substring(2, 42)}`, // Mock address for demo
      }))
      .sort((a: Token, b: Token) => b.volume24h - a.volume24h)
      .slice(0, 3)
      .map((token: Token, index: number) => ({
        ...token,
        rank: index + 1,
      }));

    // If no real data, fall back to mock data
    if (trendingTokens.length === 0) {
      const mockTrendingTokens: Token[] = [
        {
          id: '1',
          symbol: 'AIX',
          name: 'AI Exchange Token',
          price: 2.45,
          priceChange24h: 0.73,
          priceChangePercent24h: 30.2,
          volume24h: 12500000,
          marketCap: 245000000,
          address: '0x1234567890123456789012345678901234567890',
          rank: 1,
        },
        {
          id: '2',
          symbol: 'ARB',
          name: 'Arbitrum',
          price: 1.85,
          priceChange24h: 0.20,
          priceChangePercent24h: 12.1,
          volume24h: 89000000,
          marketCap: 1850000000,
          address: '0x2345678901234567890123456789012345678901',
          rank: 2,
        },
        {
          id: '3',
          symbol: 'MATIC',
          name: 'Polygon',
          price: 0.95,
          priceChange24h: 0.06,
          priceChangePercent24h: 7.3,
          volume24h: 156000000,
          marketCap: 950000000,
          address: '0x3456789012345678901234567890123456789012',
          rank: 3,
        },
      ];
      
      return NextResponse.json({
        success: true,
        tokens: mockTrendingTokens,
        timestamp: new Date().toISOString(),
        source: 'mock-data',
      });
    }

    return NextResponse.json({
      success: true,
      tokens: trendingTokens,
      timestamp: new Date().toISOString(),
      source: 'coindcx-api',
    });

  } catch (error) {
    logger.error('Error fetching trending tokens:', error); // Log the error using the logger
    
    // Fallback to mock data if API fails
    const mockTrendingTokens: Token[] = [
      {
        id: '1',
        symbol: 'AIX',
        name: 'AI Exchange Token',
        price: 2.45,
        priceChange24h: 0.73,
        priceChangePercent24h: 30.2,
        volume24h: 12500000,
        marketCap: 245000000,
        address: '0x1234567890123456789012345678901234567890',
        rank: 1,
      },
      {
        id: '2',
        symbol: 'ARB',
        name: 'Arbitrum',
        price: 1.85,
        priceChange24h: 0.20,
        priceChangePercent24h: 12.1,
        volume24h: 89000000,
        marketCap: 1850000000,
        address: '0x2345678901234567890123456789012345678901',
        rank: 2,
      },
      {
        id: '3',
        symbol: 'MATIC',
        name: 'Polygon',
        price: 0.95,
        priceChange24h: 0.06,
        priceChangePercent24h: 7.3,
        volume24h: 156000000,
        marketCap: 950000000,
        address: '0x3456789012345678901234567890123456789012',
        rank: 3,
      },
    ];
    
    return NextResponse.json({
      success: true,
      tokens: mockTrendingTokens,
      timestamp: new Date().toISOString(),
      source: 'fallback-mock-data',
    });
  }
}
