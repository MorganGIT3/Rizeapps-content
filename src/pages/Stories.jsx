import { useState, useEffect } from 'react'
import { loadData, saveData, getTodayKey } from '../utils/storage'
import { Plus, Trash2, CheckCircle, Circle, Image } from 'lucide-react'

export default function Stories() {
  const todayKey = getTodayKey()
  const [stories, setStories] = useState(() => loadData('stories', []))
  const [postedToday, setPostedToday] = useState(() => loadData(`stories-posted-${todayKey}`, {}))
  const [showForm, setShowForm] = useState(false)
  const [newStory, setNewStory] = useState({ title: '', type: 'bofu', content: '', hasScreenshot: false })

  useEffect(() => { saveData('stories', stories) }, [stories])
  useEffect(() => { saveData(`stories-posted-${todayKey}`, postedToday) }, [postedToday])

  const addStory = () => {
    if (!newStory.title.trim()) return
    setStories(prev => [...prev, { ...newStory, id: Date.now() }])
    setNewStory({ title: '', type: 'bofu', content: '', hasScreenshot: false })
    setShowForm(false)
  }

  const deleteStory = (id) => setStories(prev => prev.filter(s => s.id !== id))
  const togglePosted = (id) => setPostedToday(prev => ({ ...prev, [id]: !prev[id] }))

  const postedCount = Object.values(postedToday).filter(Boolean).length

  const templates = [
    { title: 'Screenshot virement', type: 'bofu', content: 'Screenshot du dernier virement + "un seul client"', hasScreenshot: true },
    { title: 'Message patron', type: 'bofu', content: 'Screenshot message patron qui dit merci + "dans quel business ça arrive ?"', hasScreenshot: true },
    { title: 'Sondage', type: 'bofu', content: 'Sondage : "Tu lancerais un business si quelqu\'un te montrait exactement comment ?"', hasScreenshot: false },
    { title: 'CTA RIZE', type: 'bofu', content: '"Envoie-moi RIZE en DM pour la vidéo gratuite"', hasScreenshot: false },
    { title: 'Argument business', type: 'mofu', content: 'Un argument du Système Copie-Colle en texte simple', hasScreenshot: false },
    { title: 'Quotidien', type: 'tofu', content: 'Photo/vidéo de ton quotidien (salle, bureau, café)', hasScreenshot: false },
  ]

  return (
    <div className="page">
      <div className="page-header">
        <h1>Stories</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={18} /> Nouvelle story
        </button>
      </div>

      <div className="stories-today">
        <h2>Aujourd'hui — {postedCount} stories postées</h2>
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${Math.min((postedCount / 4) * 100, 100)}%` }}></div>
        </div>
        <p className="progress-label">Objectif : 4 stories minimum</p>
      </div>

      <div className="templates-section">
        <h3>Templates rapides</h3>
        <div className="templates-grid">
          {templates.map((t, i) => (
            <button key={i} className="template-btn" onClick={() => {
              setStories(prev => [...prev, { ...t, id: Date.now() }])
            }}>
              {t.hasScreenshot && <Image size={14} />}
              <span className={`type-badge ${t.type}`}>{t.type.toUpperCase()}</span>
              {t.title}
            </button>
          ))}
        </div>
      </div>

      {showForm && (
        <div className="form-card">
          <input placeholder="Titre de la story" value={newStory.title} onChange={e => setNewStory({ ...newStory, title: e.target.value })} />
          <div className="form-row">
            <select value={newStory.type} onChange={e => setNewStory({ ...newStory, type: e.target.value })}>
              <option value="tofu">TOFU</option>
              <option value="mofu">MOFU</option>
              <option value="bofu">BOFU</option>
            </select>
            <label className="checkbox-label">
              <input type="checkbox" checked={newStory.hasScreenshot} onChange={e => setNewStory({ ...newStory, hasScreenshot: e.target.checked })} />
              Screenshot nécessaire
            </label>
          </div>
          <textarea placeholder="Contenu de la story..." value={newStory.content} onChange={e => setNewStory({ ...newStory, content: e.target.value })} />
          <button className="btn-primary" onClick={addStory}>Ajouter</button>
        </div>
      )}

      <div className="stories-list">
        {stories.length === 0 && <p className="empty-state">Utilise les templates rapides ou ajoute une story manuellement.</p>}
        {stories.map(story => (
          <div key={story.id} className={`story-card ${postedToday[story.id] ? 'posted' : ''}`}>
            <button className="story-check" onClick={() => togglePosted(story.id)}>
              {postedToday[story.id] ? <CheckCircle size={22} /> : <Circle size={22} />}
            </button>
            <div className="story-content">
              <div className="story-header">
                <span className={`type-badge ${story.type}`}>{story.type.toUpperCase()}</span>
                {story.hasScreenshot && <span className="screenshot-badge"><Image size={12} /> Screenshot</span>}
              </div>
              <h3>{story.title}</h3>
              <p>{story.content}</p>
            </div>
            <button className="btn-delete" onClick={() => deleteStory(story.id)}><Trash2 size={16} /></button>
          </div>
        ))}
      </div>
    </div>
  )
}
