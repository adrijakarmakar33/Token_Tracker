import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

// Get top trending tokens (Top 3) from CoinDCX
app.get("/api/trending", async (_req, res) => {
  try {
    const response = await axios.get(
      "https://api.coindcx.com/exchange/v1/markets_details"
    );
    const data = response.data as Array<any>;

    const spotInrPairs = data.filter(
      (pair) => pair.market_type === "spot" && pair.target_currency_short_name === "INR"
    );

    const scored = spotInrPairs
      .map((p) => ({
        symbol: p.coindcx_name,
        base: p.base_currency_short_name,
        target: p.target_currency_short_name,
        min_quantity: p.min_quantity,
        max_quantity: p.max_quantity,
        step_size: p.step_size,
        status: p.status,
        // Fake score using 24h volume if present, else 0
        score: Number(p.volume_24h || 0),
        price: Number(p.last_price || 0),
        change_24h: Number(p.change_24h || 0),
        volume_24h: Number(p.volume_24h || 0),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    res.json({ tokens: scored });
  } catch (error: any) {
    console.error("/api/trending error", error?.message);
    res.status(500).json({ error: "Failed to fetch trending tokens" });
  }
});

// Stub endpoint for gasless buy via AgentKit
app.post("/api/buy", async (req, res) => {
  const { tokenSymbol, amountUsd } = req.body as {
    tokenSymbol: string;
    amountUsd: number;
  };

  if (!tokenSymbol || !amountUsd || amountUsd <= 0) {
    return res.status(400).json({ error: "tokenSymbol and positive amountUsd required" });
  }

  try {
    // TODO: Integrate 0xGasless AgentKit swap here
    // For hackathon scaffolding, return success mock
    const mockTxHash = "0xmockhash";
    res.json({ success: true, txHash: mockTxHash });
  } catch (error: any) {
    console.error("/api/buy error", error?.message);
    res.status(500).json({ error: "Swap failed" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

