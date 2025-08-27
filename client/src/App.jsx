import { useEffect, useMemo, useState } from 'react'
import './App.css'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001'

function App() {
  const [tokens, setTokens] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [amountMap, setAmountMap] = useState({})
  const [config, setConfig] = useState({ agentkitConfigured: false, chainId: 0 })

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const [tRes, cRes] = await Promise.all([
          fetch(`${API_BASE}/trending`),
          fetch(`${API_BASE}/config`)
        ])
        const tJson = await tRes.json()
        const cJson = await cRes.json()
        if (!cancelled) {
          setTokens(tJson.tokens || [])
          setConfig(cJson)
        }
      } catch (e) {
        if (!cancelled) setError('Failed to load tokens')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const handleBuy = async (token) => {
    const amt = amountMap[token.token] || '0.01'
    try {
      const res = await fetch(`${API_BASE}/buy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokenSymbol: token.token, amount: amt })
      })
      const json = await res.json()
      if (json.success) {
        alert(`✅ You successfully bought ${token.token}!`)
      } else {
        alert('❌ Purchase failed')
      }
    } catch (e) {
      alert('❌ Purchase failed')
    }
  }

  const header = useMemo(() => (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
      <h1 style={{ margin: 0 }}>Trending Token Tracker (Gasless)</h1>
      <span style={{ fontSize: 12, opacity: 0.7 }}>
        {config.agentkitConfigured ? 'Gasless enabled' : 'Demo mode'} · Chain: {config.chainId}
      </span>
    </div>
  ), [config])

  return (
    <div style={{ maxWidth: 720, margin: '40px auto', padding: '0 16px' }}>
      {header}
      <p style={{ marginTop: 8, color: '#666' }}>Top 3 tokens by 24h move × volume</p>
      {loading && <div>Loading…</div>}
      {error && <div style={{ color: 'tomato' }}>{error}</div>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12, marginTop: 16 }}>
        {tokens.map((t, i) => (
          <div key={t.market} style={{ border: '1px solid #e5e5e5', borderRadius: 12, padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 16 }}>{i+1}. {t.token} <span style={{ opacity: 0.7, fontWeight: 400 }}>({t.market})</span></div>
              <div style={{ marginTop: 6, fontSize: 14 }}>
                <span>Price: {t.price} {t.quote}</span>
                <span style={{ marginLeft: 12, color: t.change24hPct >= 0 ? 'green' : 'tomato' }}>{t.change24hPct.toFixed(2)}%</span>
                <span style={{ marginLeft: 12, opacity: 0.8 }}>Vol: {Math.round(t.volume24h).toLocaleString()}</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                value={amountMap[t.token] ?? '0.01'}
                onChange={(e) => setAmountMap((m) => ({ ...m, [t.token]: e.target.value }))}
                style={{ width: 80, padding: 6, borderRadius: 8, border: '1px solid #ddd' }}
              />
              <button onClick={() => handleBuy(t)} style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #111', background: '#111', color: '#fff' }}>
                Buy {t.token}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
