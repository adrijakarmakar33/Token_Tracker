# 🌟 Trending Token Tracker (Gasless)

A Web3 application that shows trending crypto tokens and enables gasless trading using the 0xGasless AgentKit. Built for the OnchAIn Island Hackathon.

![Trending Token Tracker](https://img.shields.io/badge/Built%20for-OnchAIn%20Island%20Hackathon-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)

## 🚀 Problem & Solution

**Problem**: Crypto beginners struggle to know which tokens are trending and can't buy quickly due to gas fees and complex trading processes.

**Solution**: A simple dApp that shows the top 3 trending tokens from CoinDCX and enables gasless trading with one click using 0xGasless AgentKit.

## ✨ Features

- 📈 **Real-time trending tokens** from CoinDCX API
- ⚡ **Gasless trading** with 0xGasless AgentKit
- 💰 **Live price data** with 24h changes and volume
- 🎨 **Beautiful UI** with dark/light mode support
- 📱 **Responsive design** for all devices
- 🔒 **Wallet integration** ready

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Icons**: Lucide React
- **API**: CoinDCX Public API
- **Backend**: Next.js API Routes
- **Gasless Trading**: 0xGasless AgentKit (integration ready)
- **Network**: Polygon/Arbitrum Testnet

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Routes    │    │   External      │
│   (Next.js)     │────│   (Backend)     │────│   Services      │
│                 │    │                 │    │                 │
│ • Token Display │    │ • CoinDCX API   │    │ • CoinDCX API   │
│ • Buy Interface │    │ • AgentKit      │    │ • 0xGasless     │
│ • Real-time UI  │    │ • Gasless Trade │    │ • Blockchain    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd token_tracker
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file for AgentKit integration:

```env
AGENTKIT_API_KEY=your_agentkit_api_key_here
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_walletconnect_project_id
```

### AgentKit Integration

See [`AGENTKIT_INTEGRATION.md`](./AGENTKIT_INTEGRATION.md) for detailed integration steps.

## 📊 API Endpoints

### GET `/api/trending-tokens`
Fetches the top 3 trending tokens from CoinDCX

**Response:**
```json
{
  "success": true,
  "trending_tokens": [
    {
      "symbol": "BTCINR",
      "base_currency_short_name": "BTC",
      "price": "4500000",
      "change_24h": "2.5",
      "volume": "1000000000"
    }
  ]
}
```

### POST `/api/buy-token`
Executes gasless token purchase

**Request:**
```json
{
  "tokenSymbol": "BTCINR",
  "amount": "0.1",
  "userAddress": "0x..."
}
```

**Response:**
```json
{
  "success": true,
  "transaction_hash": "0x...",
  "network": "Polygon Testnet",
  "gasless": true
}
```

## 🎯 Demo Flow

1. **View Trending Tokens**
   - See top 3 trending tokens with real-time data
   - View price, 24h change, and volume

2. **Select Amount**
   - Choose ETH amount to swap
   - Real-time validation

3. **Gasless Purchase**
   - One-click gasless trading
   - Instant confirmation

## 🧪 Testing

```bash
# Run linting
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

## 🚀 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-repo%2Ftoken-tracker)

### Manual Deployment

1. Build the project: `npm run build`
2. Deploy the `.next` folder to your hosting provider
3. Set environment variables in your hosting dashboard

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📋 Project Structure

```
token_tracker/
├── app/
│   ├── api/
│   │   ├── trending-tokens/
│   │   │   └── route.ts
│   │   └── buy-token/
│   │       └── route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── public/
├── package.json
├── README.md
└── AGENTKIT_INTEGRATION.md
```

## 🔗 Links

- **Hackathon Guide**: [OnchAIn Island Hacker Guide](https://dashing-devourer-b6b.notion.site/OnchAIn-Island-Hacker-Guide-254606a324a880f7a87af26b6ebfe720)
- **AgentKit**: [0xGasless AgentKit](https://github.com/0xgasless/agentkit)
- **CoinDCX API**: [Public API Documentation](https://docs.coindcx.com/)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏆 Hackathon Pitch

> **Trending Token Tracker (Gasless) makes crypto simple for beginners by showing trending tokens and letting them buy instantly without gas fees.**

### Why This Project Wins:
- ✅ **Beginner-Friendly**: Simple UI, clear value proposition
- ✅ **Real Utility**: Solves actual crypto onboarding problems
- ✅ **Technical Innovation**: Combines AI intent parsing + gasless trading
- ✅ **Market Ready**: Uses real APIs and production-ready tech
- ✅ **Impressive Demo**: Live trending data + working gasless transactions

---

Built with 💙 for OnchAIn Island Hackathon using Next.js, CoinDCX API & 0xGasless AgentKit