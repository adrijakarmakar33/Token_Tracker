import { useEffect, useState } from 'react'
import './App.css'

type TrendingToken = {
  symbol: string
  base: string
  target: string
  price: number
  change_24h: number
  volume_24h: number
}

function App() {
  const [tokens, setTokens] = useState<TrendingToken[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [buying, setBuying] = useState<string | null>(null)

  const fetchTrending = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch('/api/trending')
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setTokens(data.tokens || [])
    } catch (e: any) {
      setError(e.message || 'Error fetching tokens')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTrending()
  }, [])

  const buy = async (symbol: string) => {
    try {
      setBuying(symbol)
      const res = await fetch('/api/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokenSymbol: symbol, amountUsd: 10 }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error || 'Buy failed')
      alert(`✅ You successfully bought ${symbol}! Tx: ${data.txHash}`)
    } catch (e: any) {
      alert(`❌ ${e.message || 'Buy failed'}`)
    } finally {
      setBuying(null)
    }
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <h1>Trending Token Tracker (Gasless)</h1>
      <p>Top 3 trending tokens from CoinDCX. Click Buy to simulate gasless swap.</p>

      <div style={{ margin: '16px 0' }}>
        <button onClick={fetchTrending} disabled={loading}>
          {loading ? 'Refreshing…' : 'Refresh'}
        </button>
        <span style={{ marginLeft: 12 }}>
          <a href="/health" target="_blank">API health</a>
        </span>
      </div>

      {error && <div style={{ color: 'red' }}>{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
        {tokens.map((t) => (
          <div key={t.symbol} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12 }}>
            <div style={{ fontWeight: 700 }}>{t.base}</div>
            <div style={{ fontSize: 12, color: '#666' }}>{t.symbol}</div>
            <div style={{ marginTop: 8 }}>Price: {t.price || '-'} {t.target}</div>
            <div>24h: {t.change_24h?.toFixed?.(2) ?? t.change_24h}%</div>
            <div>Vol 24h: {t.volume_24h}</div>
            <button style={{ marginTop: 8 }} onClick={() => buy(t.symbol)} disabled={buying === t.symbol}>
              {buying === t.symbol ? 'Buying…' : `Buy $10 of ${t.base}`}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
