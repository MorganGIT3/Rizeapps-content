import { useState, useEffect } from 'react'
import { loadData, saveData } from '../utils/storage'
import { Plus, Trash2, ExternalLink, Check, Clock } from 'lucide-react'

export default function YouTube() {
  const [videos, setVideos] = useState(() => loadData('youtube-videos', [
    { id: 1, title: 'VSL — Le Système Copie-Colle', miroLink: '', status: 'scripting', deadline: '', notes: 'Vidéo privée envoyée par ManyChat quand quelqu\'un DM RIZE', createdAt: new Date().toISOString() }
  ]))
  const [showForm, setShowForm] = useState(false)
  const [newVideo, setNewVideo] = useState({ title: '', miroLink: '', status: 'idea', deadline: '', notes: '' })

  useEffect(() => { saveData('youtube-videos', videos) }, [videos])

  const addVideo = () => {
    if (!newVideo.title.trim()) return
    setVideos(prev => [...prev, { ...newVideo, id: Date.now(), createdAt: new Date().toISOString() }])
    setNewVideo({ title: '', miroLink: '', status: 'idea', deadline: '', notes: '' })
    setShowForm(false)
  }

  const deleteVideo = (id) => setVideos(prev => prev.filter(v => v.id !== id))

  const updateStatus = (id, status) => {
    setVideos(prev => prev.map(v => v.id === id ? { ...v, status } : v))
  }

  const statuses = {
    idea: { label: 'Idée', color: '#666' },
    scripting: { label: 'Script/Miro', color: '#f59e0b' },
    filming: { label: 'À filmer', color: '#3b82f6' },
    editing: { label: 'Montage', color: '#8b5cf6' },
    posted: { label: 'Publié', color: '#22c55e' },
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>YouTube</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={18} /> Nouvelle vidéo
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <input placeholder="Titre de la vidéo" value={newVideo.title} onChange={e => setNewVideo({ ...newVideo, title: e.target.value })} />
          <input placeholder="Lien Miro (optionnel)" value={newVideo.miroLink} onChange={e => setNewVideo({ ...newVideo, miroLink: e.target.value })} />
          <div className="form-row">
            <select value={newVideo.status} onChange={e => setNewVideo({ ...newVideo, status: e.target.value })}>
              {Object.entries(statuses).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
            <input type="date" value={newVideo.deadline} onChange={e => setNewVideo({ ...newVideo, deadline: e.target.value })} />
          </div>
          <textarea placeholder="Notes..." value={newVideo.notes} onChange={e => setNewVideo({ ...newVideo, notes: e.target.value })} />
          <button className="btn-primary" onClick={addVideo}>Ajouter</button>
        </div>
      )}

      <div className="yt-pipeline">
        {Object.entries(statuses).map(([statusKey, statusInfo]) => {
          const vids = videos.filter(v => v.status === statusKey)
          return (
            <div key={statusKey} className="pipeline-column">
              <div className="pipeline-header" style={{ borderColor: statusInfo.color }}>
                <span className="pipeline-dot" style={{ background: statusInfo.color }}></span>
                <span>{statusInfo.label}</span>
                <span className="pipeline-count">{vids.length}</span>
              </div>
              {vids.map(video => (
                <div key={video.id} className="yt-card">
                  <h3>{video.title}</h3>
                  {video.miroLink && (
                    <a href={video.miroLink} target="_blank" rel="noopener" className="miro-link">
                      <ExternalLink size={14} /> Ouvrir le Miro
                    </a>
                  )}
                  {video.deadline && (
                    <p className="yt-deadline"><Clock size={14} /> {new Date(video.deadline).toLocaleDateString('fr-FR')}</p>
                  )}
                  {video.notes && <p className="yt-notes">{video.notes}</p>}
                  <div className="yt-actions">
                    <select value={video.status} onChange={e => updateStatus(video.id, e.target.value)}>
                      {Object.entries(statuses).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                    </select>
                    <button className="btn-delete" onClick={() => deleteVideo(video.id)}><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}
