import { useState, useEffect } from 'react'
import { loadData, saveData } from '../utils/storage'
import { Plus, Trash2, ArrowDown, Edit3, Save } from 'lucide-react'

const defaultTunnel = [
  { id: 1, title: 'TOFU — Contenu broad', description: '3x/jour. Ma vie, takes, IA. Pas de CTA. Kevin te découvre.', color: '#3b82f6', items: ['Face cam quotidien', 'Takes salariat/business', 'Contenu IA broad', 'Hooks niche parallèle'] },
  { id: 2, title: 'PROFIL INSTAGRAM', description: 'Kevin visite ton profil. Il voit le carrousel "J\'AI TOUT ESSAYÉ" + highlights.', color: '#f59e0b', items: ['Post carrousel Système Copie-Colle', 'Highlight RÉSULTATS', 'Highlight DÉMO', 'Highlight MON HISTOIRE', 'Highlight START', 'Bio optimisée'] },
  { id: 3, title: 'MOFU — Preuve + logique', description: '1x/jour. Virements, messages patrons, calcul, Google zéro résultat. CTA "RIZE en DM".', color: '#f97316', items: ['Screenshot virement + explication', 'Message patron merci', 'Le calcul devant le patron', 'Google zéro résultat', '"Le seul en France"'] },
  { id: 4, title: 'DM "RIZE"', description: 'Kevin commente ou DM "RIZE". ManyChat envoie automatiquement le lien de la VSL.', color: '#8b5cf6', items: ['ManyChat configuré', 'Message auto avec lien YT privé', 'Setter qualifie en DM'] },
  { id: 5, title: 'VSL YOUTUBE PRIVÉE', description: '20-25 min. Le Système Copie-Colle. Kevin convaincu à 9/10. CTA → "CALL en DM".', color: '#ec4899', items: ['Exclusivité', 'Mon histoire', 'Le marché', 'Système Copie-Colle (4 étapes)', '9 arguments', 'Preuves virements', 'CTA audit call'] },
  { id: 6, title: 'STORIES BOFU', description: 'Quotidien. Screenshots virements + CTA "RIZE en DM" + sondage + urgence.', color: '#f59e0b', items: ['Screenshot virement', 'Argument business', 'Sondage', 'CTA RIZE'] },
  { id: 7, title: 'DM "CALL"', description: 'Kevin envoie "CALL" après la VSL. Le setter qualifie et book l\'appel Calendly.', color: '#8b5cf6', items: ['Setter qualifie', 'Questions qualification', 'Book sur Calendly'] },
  { id: 8, title: 'APPEL DE CLOSING', description: '15 min. Structure Nicolas Erni : Connexion → Situation → Problème → Histoire → Solution → Conséquence → CTA.', color: '#22c55e', items: ['Connexion + situation', 'Problème (creuser la douleur)', 'Ton histoire perso', 'Présentation Rize-Apps', 'Conséquence (ne pas agir)', 'Close'] },
  { id: 9, title: 'POST-VENTE — BOUCLE', description: 'Vocal témoignage + screenshot "premier client" → devient du contenu MOFU/BOFU → plus de clients.', color: '#22c55e', items: ['Demander vocal témoignage', 'Screenshot premier client', 'Formulaire onboarding', 'Mettre en highlight', 'La boucle continue'] },
]

export default function Workflow() {
  const [tunnel, setTunnel] = useState(() => loadData('workflow-tunnel', defaultTunnel))
  const [customBlocks, setCustomBlocks] = useState(() => loadData('custom-workflows', []))
  const [editingBlock, setEditingBlock] = useState(null)
  const [showCustomForm, setShowCustomForm] = useState(false)
  const [newBlock, setNewBlock] = useState({ title: '', description: '', color: '#f59e0b', items: '' })

  useEffect(() => { saveData('workflow-tunnel', tunnel) }, [tunnel])
  useEffect(() => { saveData('custom-workflows', customBlocks) }, [customBlocks])

  const addCustomBlock = () => {
    if (!newBlock.title.trim()) return
    setCustomBlocks(prev => [...prev, { ...newBlock, id: Date.now(), items: newBlock.items.split('\n').filter(Boolean) }])
    setNewBlock({ title: '', description: '', color: '#f59e0b', items: '' })
    setShowCustomForm(false)
  }

  const deleteCustomBlock = (id) => setCustomBlocks(prev => prev.filter(b => b.id !== id))

  const resetTunnel = () => {
    setTunnel(defaultTunnel)
    saveData('workflow-tunnel', defaultTunnel)
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Tunnel de Vente</h1>
        <div className="header-actions">
          <button className="btn-small" onClick={resetTunnel}>Reset tunnel</button>
          <button className="btn-primary" onClick={() => setShowCustomForm(!showCustomForm)}>
            <Plus size={18} /> Ajouter un bloc
          </button>
        </div>
      </div>

      {showCustomForm && (
        <div className="form-card">
          <input placeholder="Titre du bloc" value={newBlock.title} onChange={e => setNewBlock({ ...newBlock, title: e.target.value })} />
          <input placeholder="Description" value={newBlock.description} onChange={e => setNewBlock({ ...newBlock, description: e.target.value })} />
          <input type="color" value={newBlock.color} onChange={e => setNewBlock({ ...newBlock, color: e.target.value })} />
          <textarea placeholder="Éléments (un par ligne)" value={newBlock.items} onChange={e => setNewBlock({ ...newBlock, items: e.target.value })} />
          <button className="btn-primary" onClick={addCustomBlock}>Ajouter</button>
        </div>
      )}

      <div className="workflow-container">
        <h2 className="workflow-title">Système Copie-Colle — Tunnel Complet</h2>
        
        <div className="tunnel-flow">
          {tunnel.map((block, i) => (
            <div key={block.id}>
              <div className="tunnel-block" style={{ borderLeftColor: block.color }}>
                <div className="tunnel-block-header">
                  <span className="tunnel-step" style={{ background: block.color }}>{i + 1}</span>
                  <h3>{block.title}</h3>
                </div>
                <p className="tunnel-desc">{block.description}</p>
                <ul className="tunnel-items">
                  {block.items.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              </div>
              {i < tunnel.length - 1 && (
                <div className="tunnel-arrow">
                  <ArrowDown size={24} />
                </div>
              )}
            </div>
          ))}
        </div>

        {customBlocks.length > 0 && (
          <>
            <h2 className="workflow-title" style={{ marginTop: '40px' }}>Workflows personnalisés</h2>
            <div className="custom-blocks">
              {customBlocks.map(block => (
                <div key={block.id} className="tunnel-block" style={{ borderLeftColor: block.color }}>
                  <div className="tunnel-block-header">
                    <h3>{block.title}</h3>
                    <button className="btn-delete" onClick={() => deleteCustomBlock(block.id)}><Trash2 size={16} /></button>
                  </div>
                  <p className="tunnel-desc">{block.description}</p>
                  <ul className="tunnel-items">
                    {block.items.map((item, j) => <li key={j}>{item}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
