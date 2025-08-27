"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/health", (_req, res) => {
    res.json({ ok: true });
});
// Get top trending tokens (Top 3) from CoinDCX
app.get("/api/trending", async (_req, res) => {
    try {
        const response = await axios_1.default.get("https://api.coindcx.com/exchange/v1/markets_details");
        const data = response.data;
        const spotInrPairs = data.filter((pair) => pair.market_type === "spot" && pair.target_currency_short_name === "INR");
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
    }
    catch (error) {
        console.error("/api/trending error", error?.message);
        res.status(500).json({ error: "Failed to fetch trending tokens" });
    }
});
// Stub endpoint for gasless buy via AgentKit
app.post("/api/buy", async (req, res) => {
    const { tokenSymbol, amountUsd } = req.body;
    if (!tokenSymbol || !amountUsd || amountUsd <= 0) {
        return res.status(400).json({ error: "tokenSymbol and positive amountUsd required" });
    }
    try {
        // TODO: Integrate 0xGasless AgentKit swap here
        // For hackathon scaffolding, return success mock
        const mockTxHash = "0xmockhash";
        res.json({ success: true, txHash: mockTxHash });
    }
    catch (error) {
        console.error("/api/buy error", error?.message);
        res.status(500).json({ error: "Swap failed" });
    }
});
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
