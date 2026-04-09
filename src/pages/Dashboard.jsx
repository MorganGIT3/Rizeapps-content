import { useState, useEffect } from 'react'
import { loadData, saveData, getTodayKey, getDailyChecklist } from '../utils/storage'
import { CheckCircle, Circle, Flame, TrendingUp, MessageSquare, Phone } from 'lucide-react'

export default function Dashboard() {
  const todayKey = getTodayKey()
  const checklist = getDailyChecklist()
  const [checked, setChecked] = useState(() => loadData(`checklist-${todayKey}`, {}))
  const [stats, setStats] = useState(() => loadData('stats', { dms: 0, calls: 0, sales: 0, revenue: 0 }))
  const [editStats, setEditStats] = useState(false)

  useEffect(() => { saveData(`checklist-${todayKey}`, checked) }, [checked])
  useEffect(() => { saveData('stats', stats) }, [stats])

  const toggle = (id) => setChecked(prev => ({ ...prev, [id]: !prev[id] }))
  const done = Object.values(checked).filter(Boolean).length
  const total = checklist.length
  const pct = Math.round((done / total) * 100)

  const streak = (() => {
    let count = 0
    let d = new Date()
    while (true) {
      const key = d.toISOString().split('T')[0]
      const dayData = loadData(`checklist-${key}`, {})
      const dayDone = Object.values(dayData).filter(Boolean).length
      if (dayDone >= 8) { count++; d.setDate(d.getDate() - 1) }
      else break
    }
    return count
  })()

  const categories = {
    content: { label: '📱 Contenu', items: checklist.filter(c => c.category === 'content') },
    stories: { label: '📸 Stories', items: checklist.filter(c => c.category === 'stories') },
    research: { label: '🔍 Recherche', items: checklist.filter(c => c.category === 'research') },
    engagement: { label: '💬 Engagement', items: checklist.filter(c => c.category === 'engagement') },
    sales: { label: '💰 Vente', items: checklist.filter(c => c.category === 'sales') },
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p className="date-display">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <Flame className="stat-icon" />
          <div>
            <p className="stat-value">{streak}</p>
            <p className="stat-label">jours de streak</p>
          </div>
        </div>
        <div className="stat-card">
          <MessageSquare className="stat-icon" />
          <div>
            <p className="stat-value">{stats.dms}</p>
            <p className="stat-label">DMs ce mois</p>
          </div>
        </div>
        <div className="stat-card">
          <Phone className="stat-icon" />
          <div>
            <p className="stat-value">{stats.calls}</p>
            <p className="stat-label">calls ce mois</p>
          </div>
        </div>
        <div className="stat-card accent">
          <TrendingUp className="stat-icon" />
          <div>
            <p className="stat-value">{stats.revenue.toLocaleString()}€</p>
            <p className="stat-label">revenu ce mois</p>
          </div>
        </div>
      </div>

      <button className="btn-small" onClick={() => setEditStats(!editStats)}>
        {editStats ? 'Fermer' : 'Modifier les stats'}
      </button>
      {editStats && (
        <div className="edit-stats">
          {['dms', 'calls', 'sales', 'revenue'].map(key => (
            <div key={key} className="edit-row">
              <label>{key === 'dms' ? 'DMs' : key === 'calls' ? 'Calls' : key === 'sales' ? 'Ventes' : 'Revenu (€)'}</label>
              <input type="number" value={stats[key]} onChange={e => setStats(prev => ({ ...prev, [key]: Number(e.target.value) }))} />
            </div>
          ))}
        </div>
      )}

      <div className="progress-section">
        <div className="progress-header">
          <h2>Checklist du jour</h2>
          <span className="progress-badge">{done}/{total}</span>
        </div>
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${pct}%` }}></div>
        </div>
      </div>

      <div className="checklist-grid">
        {Object.entries(categories).map(([key, cat]) => (
          <div key={key} className="checklist-category">
            <h3>{cat.label}</h3>
            {cat.items.map(item => (
              <button key={item.id} className={`checklist-item ${checked[item.id] ? 'done' : ''}`} onClick={() => toggle(item.id)}>
                {checked[item.id] ? <CheckCircle size={20} /> : <Circle size={20} />}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="strategy-reminder">
        <h3>📋 Rappel stratégie quotidienne</h3>
        <div className="strategy-items">
          <div className="strat-item">
            <span className="strat-tag tofu">TOFU</span>
            <span>3x/jour — Ma vie, takes broad, IA — PAS de CTA</span>
          </div>
          <div className="strat-item">
            <span className="strat-tag mofu">MOFU</span>
            <span>1x/jour — Preuve + logique du marché — CTA "RIZE"</span>
          </div>
          <div className="strat-item">
            <span className="strat-tag bofu">BOFU</span>
            <span>Stories — Screenshots virements + CTA "RIZE en DM"</span>
          </div>
          <div className="strat-item">
            <span className="strat-tag research">NICHE</span>
            <span>10 min/jour — Sort For Instagram — hooks niche parallèle</span>
          </div>
        </div>
      </div>
    </div>
  )
}
