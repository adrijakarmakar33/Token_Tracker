# Trending Token Tracker (Gasless)

A simple Web3 dApp that shows Top 3 trending tokens from CoinDCX and lets users buy via a gasless swap using 0xGasless AgentKit.

## Stack
- Frontend: React (Vite)
- Backend: Node.js + Express
- Data: CoinDCX public API
- Gasless: 0xGasless AgentKit (optional for demo)

## Quick Start

### 1) Install

```bash
# In workspace root
cd server && npm i && cd ..
cd client && npm i && cd ..
```

### 2) Run

```bash
# Terminal 1 - backend
cd server
npm run dev

# Terminal 2 - frontend
cd client
VITE_API_BASE=http://localhost:3001 npm run dev
```

Open http://localhost:5173

### 3) Using the App
- The homepage lists Top 3 tokens (by 24h % move × volume) from CoinDCX
- Enter amount and click Buy to simulate a gasless swap
- If AgentKit is configured, it will perform a real gasless swap

## AgentKit Configuration (Optional)
Create `server/.env`:

```
API_KEY=your_0xgasless_api_key
RPC_URL=https://your-rpc-url
CHAIN_ID=8453
PRIVATE_KEY=0xyour_private_key
# or
# MNEMONIC_PHRASE="word1 word2 ... word12"
```

Notes:
- Supported chains by the current SDK include Base(8453), Fantom(250), Moonbeam(1284), Metis(1088), Avalanche(43114), BSC(56)
- The `/buy` endpoint swaps from USDT to the selected token by symbol or address; update to your needs

## Endpoints
- `GET /health` -> `{ ok: true }`
- `GET /config` -> `{ agentkitConfigured, chainId }`
- `GET /trending` -> `{ tokens: [ { market, token, price, change24hPct, volume24h, quote } ] }`
- `POST /buy` -> `{ success, result | message }`

## Hackathon Demo Script
1. Open the app -> see top 3 tokens
2. Click Buy $X of token -> if configured, AgentKit performs gasless swap
3. Show confirmation toast

## Credits
- CoinDCX Public API
- 0xGasless AgentKit
