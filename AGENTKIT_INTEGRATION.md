# 0xGasless AgentKit Integration Guide

This document explains how to integrate the 0xGasless AgentKit into the Trending Token Tracker project for gasless trading functionality.

## Overview

The current implementation includes a mock buy functionality that simulates gasless transactions. To enable real gasless trading, you'll need to integrate the 0xGasless AgentKit.

## Integration Steps

### 1. Install AgentKit SDK

```bash
npm install @0xgasless/agentkit
```

### 2. Environment Setup

Create a `.env.local` file in the project root:

```env
AGENTKIT_API_KEY=your_agentkit_api_key_here
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_walletconnect_project_id
```

### 3. Update the Buy Token API Route

Replace the mock implementation in `app/api/buy-token/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { AgentKit } from '@0xgasless/agentkit';

const agentKit = new AgentKit({
  apiKey: process.env.AGENTKIT_API_KEY!,
  network: 'polygon-testnet' // or 'arbitrum-testnet'
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tokenSymbol, amount, userAddress } = body;

    // Validate input
    if (!tokenSymbol || !amount || !userAddress) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Missing required parameters: tokenSymbol, amount, userAddress" 
        },
        { status: 400 }
      );
    }

    // Create the swap intent for AgentKit
    const intent = `Swap ${amount} ETH for ${tokenSymbol.replace('INR', '')} tokens`;
    
    // Execute the gasless transaction
    const result = await agentKit.executeIntent(intent, {
      userAddress,
      slippage: 0.5, // 0.5% slippage tolerance
      gasless: true
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Successfully bought ${tokenSymbol} with ${amount} ETH`,
        transaction_hash: result.transactionHash,
        network: result.network,
        gasless: true,
        timestamp: new Date().toISOString(),
        details: result
      });
    } else {
      throw new Error(result.error || 'Transaction failed');
    }

  } catch (error) {
    console.error('Error processing buy request:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to process buy request",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
```

### 4. Add Wallet Connection

To connect user wallets, update the frontend to include wallet connection:

```typescript
// Add to app/page.tsx
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

// Add wallet state
const [walletAddress, setWalletAddress] = useState<string>('');
const [isConnected, setIsConnected] = useState(false);

// Wallet connection function
const connectWallet = async () => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      setWalletAddress(accounts[0]);
      setIsConnected(true);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  } else {
    alert('Please install MetaMask!');
  }
};
```

### 5. Token Address Mapping

Create a mapping for token addresses on your target network:

```typescript
// utils/tokenAddresses.ts
export const TOKEN_ADDRESSES = {
  'polygon-testnet': {
    'BTC': '0x...',
    'ETH': '0x...',
    'ADA': '0x...',
    // Add more token addresses
  },
  'arbitrum-testnet': {
    'BTC': '0x...',
    'ETH': '0x...',
    'ADA': '0x...',
    // Add more token addresses
  }
};
```

## Testing

1. **Testnet Setup**: Use Polygon Mumbai or Arbitrum Sepolia for testing
2. **Test Tokens**: Get testnet ETH from faucets
3. **Monitor**: Check transactions on testnet explorers

## Production Deployment

1. **Mainnet**: Switch to mainnet networks (Polygon, Arbitrum)
2. **Real Tokens**: Use actual token addresses
3. **Security**: Implement proper error handling and user confirmations

## AgentKit Features Used

- **Intent Parsing**: Natural language to transaction conversion
- **Gasless Execution**: No gas fees for users
- **Multi-chain Support**: Works on Polygon, Arbitrum, etc.
- **Slippage Protection**: Configurable slippage tolerance
- **MEV Protection**: Built-in MEV protection

## API Reference

For complete AgentKit documentation, visit:
- GitHub: https://github.com/0xgasless/agentkit
- Documentation: [Coming Soon]
- Discord: [Community Support]

## Support

For issues with AgentKit integration:
1. Check the GitHub repository
2. Join the Discord community
3. Contact the 0xGasless team

---

**Note**: This is a reference implementation. Always test thoroughly on testnets before deploying to mainnet.