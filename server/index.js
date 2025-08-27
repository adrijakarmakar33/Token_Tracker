import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
import AgentkitPkg from "@0xgasless/agentkit";
const { Agentkit, AGENTKIT_ACTIONS } = AgentkitPkg;

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
	res.json({ ok: true });
});


// Convenience: expose required env vars for the frontend (safe subset)
app.get("/config", (req, res) => {
	res.json({
		agentkitConfigured: Boolean(process.env.API_KEY && (process.env.PRIVATE_KEY || process.env.MNEMONIC_PHRASE) && process.env.RPC_URL),
		chainId: Number(process.env.CHAIN_ID || 8453)
	});
});

// Fetch top 3 trending tokens from CoinDCX public ticker by 24h percentage change and volume
app.get("/trending", async (req, res) => {
	try {
		// CoinDCX public ticker contains last_price, change_24_hour, volume per market
		const tickerUrl = "https://api.coindcx.com/exchange/ticker";
		const marketsUrl = "https://api.coindcx.com/exchange/v1/markets_details";

		const [tickerResp, marketsResp] = await Promise.all([
			axios.get(tickerUrl),
			axios.get(marketsUrl)
		]);

		const ticker = tickerResp.data; // array of { market, change_24_hour, volume, last_price, ... }
		const markets = marketsResp.data; // array of market meta data

		// Build lookup for market symbol -> metadata
		const marketMeta = new Map();
		for (const m of markets) {
			marketMeta.set(m.coindcx_name, m);
		}

		// Enhance ticker entries with metadata; filter to INR/USDT quote markets commonly used
		const enriched = ticker
			.map((t) => {
				const meta = marketMeta.get(t.market);
				return {
					market: t.market,
					lastPrice: Number(t.last_price),
					change24hPct: Number(t.change_24_hour),
					volume24h: Number(t.volume),
					base: meta?.target_currency_short_name || null,
					quote: meta?.base_currency_short_name || null,
					baseName: meta?.target_currency_name || null,
					quoteName: meta?.base_currency_name || null,
					ecoder: meta?.ecode || null,
					status: meta?.status || null
				};
			})
			.filter((e) => e.status === "active" && (e.quote === "INR" || e.quote === "USDT"));

		// Rank by a combined score: normalized pct change then tie-break by volume
		const top3 = enriched
			.sort((a, b) => {
				// Desc by absolute percentage change weighted by volume
				const scoreA = Math.abs(a.change24hPct) * Math.log10(1 + a.volume24h);
				const scoreB = Math.abs(b.change24hPct) * Math.log10(1 + b.volume24h);
				if (scoreA !== scoreB) return scoreB - scoreA;
				return b.volume24h - a.volume24h;
			})
			.slice(0, 3)
			.map((e) => ({
				market: e.market,
				token: e.base,
				tokenName: e.baseName,
				price: e.lastPrice,
				change24hPct: e.change24hPct,
				volume24h: e.volume24h,
				quote: e.quote
			}));

		res.json({ tokens: top3 });
	} catch (error) {
		console.error("/trending error", error?.response?.data || error.message);
		res.status(500).json({ error: "Failed to fetch trending tokens" });
	}
});

// Gasless buy endpoint powered by 0xGasless AgentKit
// Body: { amountUsd?: number, amount?: string, tokenSymbol?: string, tokenAddress?: string }
// For demo simplicity, we accept tokenOut by symbol (USDT, WETH, etc.) and swap from USDT to token or from native if not configured.
app.post("/buy", async (req, res) => {
	try {
		const { tokenSymbol, tokenAddress, amount } = req.body || {};
		if (!tokenSymbol && !tokenAddress) {
			return res.status(400).json({ error: "tokenSymbol or tokenAddress is required" });
		}
		if (!amount) {
			return res.status(400).json({ error: "amount (string, e.g. '0.01') is required" });
		}

		const isConfigured = Boolean(process.env.API_KEY && (process.env.PRIVATE_KEY || process.env.MNEMONIC_PHRASE) && process.env.RPC_URL);
		const chainID = Number(process.env.CHAIN_ID || 8453);

		if (!isConfigured) {
			// Mock response for demo when AgentKit is not configured
			return res.json({
				success: true,
				message: `Simulated gasless swap to ${tokenSymbol || tokenAddress} for amount ${amount}`,
				mock: true
			});
		}

		// Initialize Agentkit
		const agentkit = await Agentkit.configureWithWallet({
			privateKey: process.env.PRIVATE_KEY,
			mnemonicPhrase: process.env.MNEMONIC_PHRASE,
			rpcUrl: process.env.RPC_URL,
			apiKey: process.env.API_KEY,
			chainID
		});

		// Find SmartSwapAction from the actions list
		const swapAction = AGENTKIT_ACTIONS.find((a) => a.name === "smart_swap");
		if (!swapAction) {
			return res.status(500).json({ error: "SmartSwapAction not available in AgentKit" });
		}

		const args = tokenAddress
			? { tokenInSymbol: "USDT", tokenOut: tokenAddress, amount }
			: { tokenInSymbol: "USDT", tokenOutSymbol: tokenSymbol, amount };

		const result = await agentkit.run(swapAction, args);
		return res.json({ success: true, result });
	} catch (error) {
		console.error("/buy error", error?.response?.data || error.message || error);
		return res.status(500).json({ error: "Failed to execute gasless swap" });
	}
});

app.listen(PORT, () => {
	console.log(`🚀 Server running on http://localhost:${PORT}`);
});

