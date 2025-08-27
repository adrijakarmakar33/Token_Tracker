import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  try {
    // Fetch market details from CoinDCX API
    const response = await axios.get("https://api.coindcx.com/exchange/v1/markets_details");
    const data = response.data;

    // Get ticker data for 24hr statistics
    const tickerResponse = await axios.get("https://api.coindcx.com/exchange/ticker");
    const tickerData = tickerResponse.data;

    // Filter for popular tokens and get trending ones
    // Focus on INR pairs for better liquidity and data
    const popularPairs = [
      'BTCINR', 'ETHINR', 'ADAINR', 'DOGINR', 'XRPINR', 
      'SOLINR', 'MATICADINR', 'DOTINR', 'LTCINR', 'SHIBITINR'
    ];

    const trendingTokens = data
      .filter((pair: any) => popularPairs.includes(pair.coindcx_name))
      .map((pair: any) => {
        const ticker = tickerData.find((t: any) => t.market === pair.coindcx_name);
        
        return {
          symbol: pair.coindcx_name,
          target_currency_short_name: pair.target_currency_short_name,
          base_currency_short_name: pair.base_currency_short_name,
          min_quantity: pair.min_quantity,
          price: ticker?.last_price || '0',
          change_24h: ticker?.change_24_hour || '0',
          volume: ticker?.volume || '0',
          high_24h: ticker?.high || '0',
          low_24h: ticker?.low || '0'
        };
      })
      .filter((token: any) => parseFloat(token.change_24h) !== 0) // Filter out tokens with no price data
      .sort((a: any, b: any) => parseFloat(b.change_24h) - parseFloat(a.change_24h)) // Sort by 24h change descending
      .slice(0, 3); // Get top 3

    return NextResponse.json({
      success: true,
      trending_tokens: trendingTokens
    });

  } catch (error) {
    console.error('Error fetching trending tokens:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch trending tokens",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}