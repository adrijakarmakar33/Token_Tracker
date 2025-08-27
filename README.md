# 🚀 Trending Token Tracker (Gasless)

A Web3 application that shows trending crypto tokens and allows users to buy them instantly without gas fees using 0xGasless AgentKit.

## 🌟 Features

- **Real-time Trending Tokens**: Fetches top 3 trending tokens from CoinDCX API
- **Beautiful UI**: Modern, responsive design with dark mode support
- **Gasless Trading**: Buy tokens without paying gas fees using 0xGasless AgentKit
- **One-Click Purchase**: Simple buy flow with amount selection
- **Live Price Data**: Real-time price, volume, and market cap information

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 + React 19 + TypeScript
- **Styling**: Tailwind CSS 4
- **API**: CoinDCX for token data
- **Web3**: 0xGasless AgentKit for gasless swaps
- **Network**: Polygon (configurable)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd trending-token-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (optional):
```bash
# Create .env.local file
AGENT_KIT_URL=https://api.0xgasless.com
AGENT_KIT_API_KEY=your_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Demo Flow

1. **View Trending Tokens**: See the top 3 trending tokens with live data
2. **Select Token**: Click on any token card to view details
3. **Choose Amount**: Use the buy modal to select purchase amount
4. **Gasless Swap**: Confirm purchase - no gas fees required!
5. **Success**: Receive confirmation with transaction hash

## 🔧 API Integration

### CoinDCX API
- Fetches real-time market data
- Filters for trending tokens with positive price changes
- Falls back to mock data if API is unavailable

### 0xGasless AgentKit
- Handles gasless token swaps
- Supports multiple networks (Polygon, Arbitrum)
- Provides transaction quotes and execution

## 🏗️ Project Structure

```
app/
├── components/
│   ├── TrendingToken.tsx    # Individual token card
│   └── BuyModal.tsx         # Purchase modal
├── services/
│   └── gaslessSwap.ts       # 0xGasless integration
├── api/
│   ├── trending/            # CoinDCX data endpoint
│   └── swap/               # Gasless swap endpoint
├── page.tsx                # Main application page
└── layout.tsx              # App layout
```

## 🎯 Hackathon Features

### For Judges
- **AI Integration**: 0xGasless AgentKit for intelligent swap execution
- **Web3 Innovation**: Gasless trading eliminates barriers for beginners
- **Real-time Data**: Live market data from CoinDCX
- **Modern UI**: Beautiful, responsive design

### For Users
- **Beginner Friendly**: Simple interface, no complex DeFi knowledge needed
- **Cost Effective**: No gas fees means more money for tokens
- **Fast**: One-click purchases with instant execution
- **Transparent**: Clear pricing and transaction details

## 🔮 Future Enhancements

- [ ] Wallet integration (MetaMask, WalletConnect)
- [ ] Portfolio tracking
- [ ] Price alerts
- [ ] More token exchanges
- [ ] Mobile app
- [ ] Social features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [0xGasless AgentKit](https://github.com/0xgasless/agentkit) for gasless trading
- [CoinDCX](https://coindcx.com/) for market data
- [Next.js](https://nextjs.org/) for the framework
- [Tailwind CSS](https://tailwindcss.com/) for styling

---

**Built with ❤️ for the hackathon community**
