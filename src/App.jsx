import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Instagram from './pages/Instagram'
import YouTube from './pages/YouTube'
import Stories from './pages/Stories'
import Tasks from './pages/Tasks'
import Workflow from './pages/Workflow'
import './App.css'

function App() {
  const [activePage, setActivePage] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="app">
      <Sidebar 
        activePage={activePage} 
        setActivePage={setActivePage}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <main className={`main-content ${sidebarOpen ? '' : 'sidebar-closed'}`}>
        {activePage === 'dashboard' && <Dashboard />}
        {activePage === 'instagram' && <Instagram />}
        {activePage === 'youtube' && <YouTube />}
        {activePage === 'stories' && <Stories />}
        {activePage === 'tasks' && <Tasks />}
        {activePage === 'workflow' && <Workflow />}
      </main>
    </div>
  )
}

export default App
