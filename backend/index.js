const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

// Helper to fetch and compute top trending tokens
async function fetchTrendingTokens(limit = 3) {
  const url = 'https://api.coindcx.com/exchange/ticker';
  const resp = await axios.get(url);
  const data = resp.data;

  // Calculate trending score based on absolute 24h percentage change * volume (rough proxy)
  const tokens = data
    .filter(t => t.market.endsWith('USDT')) // use liquid USDT pairs
    .map(t => ({
      symbol: t.market.replace('USDT', ''),
      market: t.market,
      price: parseFloat(t.last_price),
      changePercent: parseFloat(t.change_24_hour),
      volume: parseFloat(t.volume),
    }))
    .sort((a, b) => {
      // Sort by absolute percentage change descending, then volume
      const scoreA = Math.abs(a.changePercent);
      const scoreB = Math.abs(b.changePercent);
      if (scoreA === scoreB) return b.volume - a.volume;
      return scoreB - scoreA;
    })
    .slice(0, limit);

  return tokens;
}

// API endpoint
app.get('/trending-tokens', async (req, res) => {
  try {
    const tokens = await fetchTrendingTokens();
    res.json({ tokens });
  } catch (err) {
    console.error('Error fetching trending tokens:', err.message);
    res.status(500).json({ error: 'Unable to fetch trending tokens' });
  }
});

app.get('/', (req, res) => {
  res.send('Trending Token Tracker Backend');
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server listening on http://localhost:${PORT}`);
});