import { useState } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Home from './components/Home'
import Lesson from './components/Lesson'
import { ProgressProvider } from './data/progress'

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <ProgressProvider>
      <HashRouter>
        <div className="flex min-h-screen">
          {/* Sidebar bureau */}
          <aside className="sticky top-0 hidden h-screen w-72 shrink-0 lg:block">
            <Sidebar />
          </aside>

          {/* Sidebar mobile */}
          {menuOpen && (
            <div className="fixed inset-0 z-40 lg:hidden">
              <div className="absolute inset-0 bg-black/40" onClick={() => setMenuOpen(false)} />
              <aside className="absolute inset-y-0 left-0 w-72">
                <Sidebar onNavigate={() => setMenuOpen(false)} />
              </aside>
            </div>
          )}

          <div className="min-w-0 flex-1">
            <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur lg:hidden dark:border-slate-800 dark:bg-slate-950/90">
              <button
                onClick={() => setMenuOpen(true)}
                aria-label="Ouvrir le menu"
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm dark:border-slate-700"
              >
                ☰
              </button>
              <span className="text-sm font-semibold">LOG320</span>
            </header>

            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/lecon/:sectionId" element={<Lesson />} />
              </Routes>
            </main>
          </div>
        </div>
      </HashRouter>
    </ProgressProvider>
  )
}
