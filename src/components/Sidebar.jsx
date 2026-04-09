import { Smartphone, Video, BookOpen, CheckSquare, GitBranch, LayoutDashboard, Menu, X } from 'lucide-react'
import logoRize from '../../logo rize.png'

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'instagram', label: 'Instagram', icon: Smartphone },
  { id: 'youtube', label: 'YouTube', icon: Video },
  { id: 'stories', label: 'Stories', icon: BookOpen },
  { id: 'tasks', label: 'Tâches', icon: CheckSquare },
  { id: 'workflow', label: 'Tunnel', icon: GitBranch },
]

export default function Sidebar({ activePage, setActivePage, sidebarOpen, setSidebarOpen }) {
  return (
    <>
      <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="logo">
            <img className="logo-r" src={logoRize} alt="Logo Rize" />
            <span className="logo-text">RIZE</span>
          </div>
          <p className="logo-sub">Système Copie-Colle</p>
        </div>
        <nav className="sidebar-nav">
          {menuItems.map(item => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                className={`nav-item ${activePage === item.id ? 'active' : ''}`}
                onClick={() => setActivePage(item.id)}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>
        <div className="sidebar-footer">
          <div className="objective-box">
            <p className="obj-label">OBJECTIF</p>
            <p className="obj-value">10 000€</p>
            <p className="obj-sub">ce mois-ci</p>
          </div>
        </div>
      </aside>
    </>
  )
}
