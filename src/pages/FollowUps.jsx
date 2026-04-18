import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, AtSign, BellRing, CheckCircle2, Clock, MessageCircle, Plus, Trash2 } from 'lucide-react'
import {
  addDaysToNow,
  getWhatsappLink,
  isDue,
  isValidHttpUrl,
  loadData,
  normalizeInstagramUrl,
  saveData,
} from '../utils/storage'

const INITIAL_FORM = {
  firstName: '',
  lastName: '',
  instagramUrl: '',
  phone: '',
  notes: '',
  delayDays: '7',
}

export default function FollowUps() {
  const [followUps, setFollowUps] = useState(() => loadData('followups', []))
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('pending')
  const [form, setForm] = useState(INITIAL_FORM)
  const [error, setError] = useState('')

  useEffect(() => {
    saveData('followups', followUps)
  }, [followUps])

  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      const dueContacts = followUps.filter((item) => item.status === 'pending' && isDue(item.dueAt))
      if (dueContacts.length > 0 && Notification.permission === 'granted') {
        const first = dueContacts[0]
        new Notification('RIZE — Relance après call', {
          body: `Relancer ${first.firstName} ${first.lastName}`,
          icon: '📞',
        })
      }
    }, 300000)

    return () => clearInterval(interval)
  }, [followUps])

  const dueNow = useMemo(
    () => followUps.filter((item) => item.status === 'pending' && isDue(item.dueAt)),
    [followUps]
  )

  const filteredItems = useMemo(() => {
    if (filter === 'done') return followUps.filter((item) => item.status === 'done')
    if (filter === 'due') return dueNow
    if (filter === 'pending') return followUps.filter((item) => item.status === 'pending')
    return followUps
  }, [filter, followUps, dueNow])

  const sortedItems = useMemo(
    () =>
      [...filteredItems].sort((a, b) => {
        if (a.status !== b.status) return a.status === 'pending' ? -1 : 1
        return new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime()
      }),
    [filteredItems]
  )

  const addFollowUp = () => {
    const firstName = form.firstName.trim()
    const lastName = form.lastName.trim()
    const phone = form.phone.trim()
    const instagramUrl = normalizeInstagramUrl(form.instagramUrl)
    const notes = form.notes.trim()
    const delayDays = Number(form.delayDays)

    if (!firstName || !lastName) {
      setError('Le prénom et le nom sont obligatoires.')
      return
    }
    if (!phone) {
      setError('Le numéro WhatsApp est obligatoire.')
      return
    }
    if (!instagramUrl) {
      setError("L'URL Instagram est obligatoire.")
      return
    }
    if (!isValidHttpUrl(instagramUrl)) {
      setError("L'URL Instagram est invalide.")
      return
    }
    if (!Number.isInteger(delayDays) || delayDays < 1 || delayDays > 30) {
      setError('Le délai doit être entre 1 et 30 jours.')
      return
    }

    setFollowUps((prev) => [
      ...prev,
      {
        id: Date.now(),
        firstName,
        lastName,
        phone,
        instagramUrl,
        notes,
        delayDays,
        createdAt: new Date().toISOString(),
        dueAt: addDaysToNow(delayDays),
        status: 'pending',
        doneAt: null,
      },
    ])

    setForm(INITIAL_FORM)
    setError('')
    setShowForm(false)
  }

  const markAsDone = (id) => {
    setFollowUps((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: 'done',
              doneAt: new Date().toISOString(),
            }
          : item
      )
    )
  }

  const removeFollowUp = (id) => {
    setFollowUps((prev) => prev.filter((item) => item.id !== id))
  }

  const openInstagram = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const openWhatsApp = (phone) => {
    const link = getWhatsappLink(phone)
    if (!link) return
    window.open(link, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Relance après call</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={18} /> Ajouter un contact à relancer
        </button>
      </div>

      {dueNow.length > 0 && (
        <div className="alert-banner followup-alert-banner">
          <AlertTriangle size={20} />
          <span>{dueNow.length} relance(s) importante(s) à faire maintenant.</span>
        </div>
      )}

      {showForm && (
        <div className="form-card followup-form">
          <div className="form-row">
            <input
              placeholder="Prénom"
              value={form.firstName}
              onChange={(event) => setForm({ ...form, firstName: event.target.value })}
            />
            <input
              placeholder="Nom"
              value={form.lastName}
              onChange={(event) => setForm({ ...form, lastName: event.target.value })}
            />
          </div>
          <input
            placeholder="URL Instagram"
            value={form.instagramUrl}
            onChange={(event) => setForm({ ...form, instagramUrl: event.target.value })}
          />
          <input
            placeholder="Numéro WhatsApp"
            value={form.phone}
            onChange={(event) => setForm({ ...form, phone: event.target.value })}
          />
          <textarea
            placeholder="Notes à afficher dans la notification"
            value={form.notes}
            onChange={(event) => setForm({ ...form, notes: event.target.value })}
          />
          <div className="form-row">
            <select
              value={form.delayDays}
              onChange={(event) => setForm({ ...form, delayDays: event.target.value })}
            >
              {Array.from({ length: 30 }, (_, index) => index + 1).map((days) => (
                <option key={days} value={String(days)}>
                  Relancer dans {days} jour{days > 1 ? 's' : ''}
                </option>
              ))}
            </select>
          </div>
          {error && <p className="form-error">{error}</p>}
          <button className="btn-primary" onClick={addFollowUp}>
            Enregistrer le contact
          </button>
        </div>
      )}

      <div className="filter-bar">
        {[
          { key: 'pending', label: 'A relancer' },
          { key: 'due', label: `Urgent (${dueNow.length})` },
          { key: 'done', label: 'Deja relances' },
          { key: 'all', label: 'Tous' },
        ].map((entry) => (
          <button
            key={entry.key}
            className={`filter-btn ${filter === entry.key ? 'active' : ''}`}
            onClick={() => setFilter(entry.key)}
          >
            {entry.label}
          </button>
        ))}
      </div>

      <div className="tasks-list followups-list">
        {sortedItems.length === 0 && (
          <p className="empty-state">Aucun contact. Commence par ajouter une relance.</p>
        )}

        {sortedItems.map((item) => {
          const urgent = item.status === 'pending' && isDue(item.dueAt)
          const fullName = `${item.firstName} ${item.lastName}`

          return (
            <div key={item.id} className={`task-card followup-card ${item.status} ${urgent ? 'overdue' : ''}`}>
              <div className="task-content">
                {urgent && (
                  <p className="followup-important">
                    <BellRing size={14} /> Relancer {fullName}
                  </p>
                )}

                <h3>{fullName}</h3>

                <div className="task-meta">
                  <span className={`deadline-badge ${urgent ? 'overdue' : ''}`}>
                    <Clock size={12} />
                    {new Date(item.dueAt).toLocaleDateString('fr-FR')}
                    {urgent ? ' — A FAIRE MAINTENANT' : ''}
                  </span>
                  <span className="priority-badge low">+{item.delayDays}j</span>
                  {item.status === 'done' && (
                    <span className="priority-badge medium">Relance faite</span>
                  )}
                </div>

                <p className="followup-phone">WhatsApp: {item.phone}</p>
                {item.notes && <p className="followup-notes">Notes: {item.notes}</p>}

                {item.status === 'pending' && (
                  <div className="followup-actions">
                    <button className="btn-small" onClick={() => openInstagram(item.instagramUrl)}>
                      <AtSign size={14} /> Relancer sur Insta
                    </button>
                    <button className="btn-small" onClick={() => openWhatsApp(item.phone)}>
                      <MessageCircle size={14} /> Relancer WhatsApp
                    </button>
                    <button className="btn-small btn-success" onClick={() => markAsDone(item.id)}>
                      <CheckCircle2 size={14} /> Relance
                    </button>
                  </div>
                )}
              </div>

              <button className="btn-delete" onClick={() => removeFollowUp(item.id)}>
                <Trash2 size={16} />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
