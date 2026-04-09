import { useState, useEffect } from 'react'
import { loadData, saveData, isOverdue } from '../utils/storage'
import { Plus, Trash2, CheckCircle, Circle, AlertTriangle, Clock } from 'lucide-react'

export default function Tasks() {
  const [tasks, setTasks] = useState(() => loadData('tasks', []))
  const [showForm, setShowForm] = useState(false)
  const [newTask, setNewTask] = useState({ title: '', deadline: '', priority: 'medium', done: false })
  const [filter, setFilter] = useState('all')

  useEffect(() => { saveData('tasks', tasks) }, [tasks])

  useEffect(() => {
    const interval = setInterval(() => {
      const overdueTasks = tasks.filter(t => !t.done && t.deadline && isOverdue(t.deadline))
      if (overdueTasks.length > 0 && Notification.permission === 'granted') {
        new Notification('RIZE — Tâches en retard', {
          body: `${overdueTasks.length} tâche(s) en retard : ${overdueTasks[0].title}`,
          icon: '🔥'
        })
      }
    }, 300000)
    return () => clearInterval(interval)
  }, [tasks])

  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  const addTask = () => {
    if (!newTask.title.trim()) return
    setTasks(prev => [...prev, { ...newTask, id: Date.now(), createdAt: new Date().toISOString() }])
    setNewTask({ title: '', deadline: '', priority: 'medium', done: false })
    setShowForm(false)
  }

  const toggleDone = (id) => setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  const deleteTask = (id) => setTasks(prev => prev.filter(t => t.id !== id))

  const filtered = (() => {
    if (filter === 'done') return tasks.filter(t => t.done)
    if (filter === 'active') return tasks.filter(t => !t.done)
    if (filter === 'overdue') return tasks.filter(t => !t.done && t.deadline && isOverdue(t.deadline))
    return tasks
  })()

  const sorted = [...filtered].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) return priorityOrder[a.priority] - priorityOrder[b.priority]
    if (a.deadline && b.deadline) return new Date(a.deadline) - new Date(b.deadline)
    return 0
  })

  const overdueCount = tasks.filter(t => !t.done && t.deadline && isOverdue(t.deadline)).length
  const activeCount = tasks.filter(t => !t.done).length

  return (
    <div className="page">
      <div className="page-header">
        <h1>Tâches</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={18} /> Nouvelle tâche
        </button>
      </div>

      {overdueCount > 0 && (
        <div className="alert-banner">
          <AlertTriangle size={20} />
          <span>{overdueCount} tâche(s) en retard !</span>
        </div>
      )}

      {showForm && (
        <div className="form-card">
          <input placeholder="Titre de la tâche" value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} />
          <div className="form-row">
            <input type="date" value={newTask.deadline} onChange={e => setNewTask({ ...newTask, deadline: e.target.value })} placeholder="Deadline" />
            <select value={newTask.priority} onChange={e => setNewTask({ ...newTask, priority: e.target.value })}>
              <option value="high">Urgent</option>
              <option value="medium">Normal</option>
              <option value="low">Pas pressé</option>
            </select>
          </div>
          <button className="btn-primary" onClick={addTask}>Ajouter</button>
        </div>
      )}

      <div className="filter-bar">
        {[
          { key: 'all', label: 'Tout' },
          { key: 'active', label: `Actives (${activeCount})` },
          { key: 'overdue', label: `En retard (${overdueCount})` },
          { key: 'done', label: 'Terminées' },
        ].map(f => (
          <button key={f.key} className={`filter-btn ${filter === f.key ? 'active' : ''}`} onClick={() => setFilter(f.key)}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="tasks-list">
        {sorted.length === 0 && <p className="empty-state">Aucune tâche. Ajoute ta première tâche.</p>}
        {sorted.map(task => (
          <div key={task.id} className={`task-card ${task.done ? 'done' : ''} ${!task.done && task.deadline && isOverdue(task.deadline) ? 'overdue' : ''} priority-${task.priority}`}>
            <button className="task-check" onClick={() => toggleDone(task.id)}>
              {task.done ? <CheckCircle size={22} /> : <Circle size={22} />}
            </button>
            <div className="task-content">
              <h3>{task.title}</h3>
              <div className="task-meta">
                {task.deadline && (
                  <span className={`deadline-badge ${isOverdue(task.deadline) && !task.done ? 'overdue' : ''}`}>
                    <Clock size={12} />
                    {new Date(task.deadline).toLocaleDateString('fr-FR')}
                    {isOverdue(task.deadline) && !task.done && ' — EN RETARD'}
                  </span>
                )}
                <span className={`priority-badge ${task.priority}`}>
                  {task.priority === 'high' ? 'Urgent' : task.priority === 'medium' ? 'Normal' : 'Pas pressé'}
                </span>
              </div>
            </div>
            <button className="btn-delete" onClick={() => deleteTask(task.id)}><Trash2 size={16} /></button>
          </div>
        ))}
      </div>
    </div>
  )
}
