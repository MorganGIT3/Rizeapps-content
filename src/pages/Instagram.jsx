import { useState, useEffect } from 'react'
import { loadData, saveData } from '../utils/storage'
import { Plus, Trash2, Check, Film, Eye } from 'lucide-react'

export default function Instagram() {
  const [ideas, setIdeas] = useState(() => loadData('instagram-ideas', []))
  const [newIdea, setNewIdea] = useState({ title: '', hook: '', type: 'tofu', format: 'face-cam', status: 'idea', notes: '' })
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('all')
  const [selectedIdeaId, setSelectedIdeaId] = useState(null)
  const [editIdea, setEditIdea] = useState(null)

  useEffect(() => { saveData('instagram-ideas', ideas) }, [ideas])

  const addIdea = () => {
    if (!newIdea.title.trim()) return
    setIdeas(prev => [...prev, { ...newIdea, id: Date.now(), createdAt: new Date().toISOString() }])
    setNewIdea({ title: '', hook: '', type: 'tofu', format: 'face-cam', status: 'idea', notes: '' })
    setShowForm(false)
  }

  const deleteIdea = (id) => setIdeas(prev => prev.filter(i => i.id !== id))
  
  const cycleStatus = (id) => {
    const statuses = ['idea', 'filming', 'posted']
    setIdeas(prev => prev.map(i => {
      if (i.id !== id) return i
      const next = statuses[(statuses.indexOf(i.status) + 1) % statuses.length]
      return { ...i, status: next }
    }))
  }

  const filtered = filter === 'all' ? ideas : ideas.filter(i => i.type === filter)
  const selectedIdea = ideas.find(i => i.id === selectedIdeaId) || null

  const statusIcon = (s) => {
    if (s === 'idea') return <Eye size={16} />
    if (s === 'filming') return <Film size={16} />
    return <Check size={16} />
  }

  const statusLabel = (s) => {
    if (s === 'idea') return 'Idée'
    if (s === 'filming') return 'À filmer'
    return 'Posté'
  }

  const openIdeaEditor = (idea) => {
    setSelectedIdeaId(idea.id)
    setEditIdea({ ...idea })
  }

  const closeIdeaEditor = () => {
    setSelectedIdeaId(null)
    setEditIdea(null)
  }

  const updateIdeaField = (field, value) => {
    setEditIdea(prev => ({ ...prev, [field]: value }))
  }

  const saveIdeaChanges = () => {
    if (!editIdea || !editIdea.title.trim()) return
    setIdeas(prev => prev.map(i => (i.id === editIdea.id ? { ...editIdea, title: editIdea.title.trim() } : i)))
    closeIdeaEditor()
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Instagram</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={18} /> Nouvelle idée
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <input placeholder="Titre / sujet du contenu" value={newIdea.title} onChange={e => setNewIdea({ ...newIdea, title: e.target.value })} />
          <textarea placeholder="Hook (les 2-3 premières phrases)" value={newIdea.hook} onChange={e => setNewIdea({ ...newIdea, hook: e.target.value })} />
          <div className="form-row">
            <select value={newIdea.type} onChange={e => setNewIdea({ ...newIdea, type: e.target.value })}>
              <option value="tofu">TOFU</option>
              <option value="mofu">MOFU</option>
              <option value="bofu">BOFU</option>
            </select>
            <select value={newIdea.format} onChange={e => setNewIdea({ ...newIdea, format: e.target.value })}>
              <option value="face-cam">Face caméra</option>
              <option value="screen">Screen recording</option>
              <option value="vlog">Vlog</option>
              <option value="mix">Mix face + screen</option>
            </select>
            <select value={newIdea.status} onChange={e => setNewIdea({ ...newIdea, status: e.target.value })}>
              <option value="idea">Idée</option>
              <option value="filming">À filmer</option>
              <option value="posted">Posté</option>
            </select>
          </div>
          <textarea placeholder="Notes supplémentaires..." value={newIdea.notes} onChange={e => setNewIdea({ ...newIdea, notes: e.target.value })} />
          <button className="btn-primary" onClick={addIdea}>Ajouter</button>
        </div>
      )}

      <div className="filter-bar">
        {['all', 'tofu', 'mofu', 'bofu'].map(f => (
          <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f === 'all' ? 'Tout' : f.toUpperCase()}
          </button>
        ))}
        <span className="count-badge">{filtered.length} contenus</span>
      </div>

      <div className="ideas-list">
        {filtered.length === 0 && <p className="empty-state">Aucune idée encore. Ajoute ta première idée de contenu.</p>}
        {filtered.map(idea => (
          <div
            key={idea.id}
            className={`idea-card ${idea.status} ${selectedIdeaId === idea.id ? 'active' : ''}`}
            onClick={() => openIdeaEditor(idea)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                openIdeaEditor(idea)
              }
            }}
          >
            <div className="idea-header">
              <span className={`type-badge ${idea.type}`}>{idea.type.toUpperCase()}</span>
              <span className="format-badge">{idea.format}</span>
              <button className={`status-btn ${idea.status}`} onClick={(e) => { e.stopPropagation(); cycleStatus(idea.id) }}>
                {statusIcon(idea.status)} {statusLabel(idea.status)}
              </button>
            </div>
            <h3>{idea.title}</h3>
            {idea.hook && <p className="idea-hook">"{idea.hook}"</p>}
            {idea.notes && <p className="idea-notes">{idea.notes}</p>}
            <div className="idea-footer">
              <span className="idea-date">{new Date(idea.createdAt).toLocaleDateString('fr-FR')}</span>
              <button className="btn-delete" onClick={(e) => { e.stopPropagation(); deleteIdea(idea.id) }}><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>

      {selectedIdea && editIdea && (
        <div className="idea-editor-overlay" onClick={closeIdeaEditor}>
          <div className="idea-editor-card" onClick={e => e.stopPropagation()}>
            <div className="idea-editor-header">
              <h2>Détails du contenu</h2>
              <button className="btn-small" onClick={closeIdeaEditor}>Fermer</button>
            </div>
            <div className="form-card idea-editor-form">
              <label>Titre</label>
              <input value={editIdea.title} onChange={e => updateIdeaField('title', e.target.value)} />

              <label>Hook</label>
              <textarea
                placeholder="Développe le hook en détail..."
                value={editIdea.hook}
                onChange={e => updateIdeaField('hook', e.target.value)}
              />

              <div className="form-row">
                <select value={editIdea.type} onChange={e => updateIdeaField('type', e.target.value)}>
                  <option value="tofu">TOFU</option>
                  <option value="mofu">MOFU</option>
                  <option value="bofu">BOFU</option>
                </select>
                <select value={editIdea.format} onChange={e => updateIdeaField('format', e.target.value)}>
                  <option value="face-cam">Face caméra</option>
                  <option value="screen">Screen recording</option>
                  <option value="vlog">Vlog</option>
                  <option value="mix">Mix face + screen</option>
                </select>
                <select value={editIdea.status} onChange={e => updateIdeaField('status', e.target.value)}>
                  <option value="idea">Idée</option>
                  <option value="filming">À filmer</option>
                  <option value="posted">Posté</option>
                </select>
              </div>

              <label>Notes détaillées</label>
              <textarea
                placeholder="Script, plan, CTA, angle, objections..."
                value={editIdea.notes}
                onChange={e => updateIdeaField('notes', e.target.value)}
              />

              <div className="idea-editor-actions">
                <button className="btn-small" onClick={closeIdeaEditor}>Annuler</button>
                <button className="btn-primary" onClick={saveIdeaChanges}>Enregistrer</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
