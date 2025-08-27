import { NextRequest, NextResponse } from 'next/server';
import { gaslessSwapService } from '@/app/services/gaslessSwap';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tokenSymbol, amountUSD, userAddress } = body;

    // Validate input
    if (!tokenSymbol || !amountUSD || amountUSD <= 0) {
      return NextResponse.json(
        { error: 'Invalid input: tokenSymbol and amountUSD are required' },
        { status: 400 }
      );
    }

    // Check if service is available
    const isAvailable = await gaslessSwapService.isServiceAvailable();
    if (!isAvailable) {
      return NextResponse.json(
        { error: 'Gasless swap service is currently unavailable' },
        { status: 503 }
      );
    }

    // Execute the gasless swap
    const result = await gaslessSwapService.executeSwap({
      tokenSymbol,
      amountUSD,
      userAddress
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        transactionHash: result.transactionHash,
        message: result.message,
        details: {
          tokenSymbol,
          amountUSD,
          gasFee: 0, // Gasless!
          network: 'Polygon',
          timestamp: new Date().toISOString()
        }
      });
    } else {
      return NextResponse.json(
        { 
          success: false,
          error: result.error,
          message: result.message 
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error in swap API:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        message: 'Failed to process swap request'
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check service status
export async function GET() {
  try {
    const isAvailable = await gaslessSwapService.isServiceAvailable();
    
    return NextResponse.json({
      service: '0xGasless AgentKit',
      status: isAvailable ? 'available' : 'unavailable',
      network: 'Polygon',
      gasless: true,
      timestamp: new Date().toISOString()
    });
  } catch {
    return NextResponse.json(
      { 
        service: '0xGasless AgentKit',
        status: 'error',
        error: 'Failed to check service status'
      },
      { status: 500 }
    );
  }
}