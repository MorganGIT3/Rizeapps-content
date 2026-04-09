export function loadData(key, defaultValue) {
  try {
    const saved = localStorage.getItem(`rize-${key}`)
    return saved ? JSON.parse(saved) : defaultValue
  } catch {
    return defaultValue
  }
}

export function saveData(key, data) {
  try {
    localStorage.setItem(`rize-${key}`, JSON.stringify(data))
  } catch (e) {
    console.error('Save failed:', e)
  }
}

export function getTodayKey() {
  return new Date().toISOString().split('T')[0]
}

export function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

export function isOverdue(deadline) {
  return new Date(deadline) < new Date() 
}

export function getDailyChecklist() {
  return [
    { id: 'tofu1', label: 'TOFU 1 posté', category: 'content' },
    { id: 'tofu2', label: 'TOFU 2 posté', category: 'content' },
    { id: 'tofu3', label: 'TOFU 3 posté', category: 'content' },
    { id: 'mofu1', label: 'MOFU 1 posté', category: 'content' },
    { id: 'story1', label: 'Story BOFU postée', category: 'stories' },
    { id: 'story2', label: 'Screenshot virement en story', category: 'stories' },
    { id: 'niche', label: '10 min — Niche parallèle (hooks)', category: 'research' },
    { id: 'engage', label: '30 min engagement après post', category: 'engagement' },
    { id: 'dm', label: 'Répondre aux DMs', category: 'sales' },
    { id: 'calls', label: 'Calls du jour faits', category: 'sales' },
  ]
}
