import { NavLink, Link } from 'react-router-dom'
import { curriculum } from '../data/curriculum'
import { useProgress } from '../data/progress'

export default function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { isRead, readCount } = useProgress()

  return (
    <nav className="flex h-full flex-col overflow-y-auto border-r border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
      <Link
        to="/"
        onClick={onNavigate}
        className="sticky top-0 border-b border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-800 dark:bg-slate-900"
      >
        <span className="text-sm font-bold tracking-wide text-indigo-600 uppercase dark:text-indigo-400">LOG320</span>
        <span className="block text-xs text-slate-500 dark:text-slate-400">Structures de données et algorithmes</span>
      </Link>

      <div className="flex-1 px-3 py-4">
        {curriculum.map((week) => {
          const ids = week.sections.map((s) => s.id)
          const done = readCount(ids)
          return (
            <div key={week.number} className="mb-5">
              <div className="flex items-baseline justify-between px-2 pb-1">
                <h3 className="text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
                  Semaine {week.number}
                  {week.exam && ' · examen'}
                </h3>
                <span className="text-[10px] text-slate-400 dark:text-slate-500">
                  {done}/{ids.length}
                </span>
              </div>
              <p className="px-2 pb-2 text-xs text-slate-600 dark:text-slate-300">{week.title}</p>
              <ul className="space-y-0.5">
                {week.sections.map((section) => (
                  <li key={section.id}>
                    <NavLink
                      to={`/lecon/${section.id}`}
                      onClick={onNavigate}
                      className={({ isActive }) =>
                        `flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors ${
                          isActive
                            ? 'bg-indigo-100 font-medium text-indigo-800 dark:bg-indigo-950 dark:text-indigo-200'
                            : 'text-slate-700 hover:bg-slate-200/60 dark:text-slate-300 dark:hover:bg-slate-800'
                        }`
                      }
                    >
                      <span
                        className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                          isRead(section.id) ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'
                        }`}
                        aria-hidden
                      />
                      <span className="min-w-0 truncate">{section.title}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </nav>
  )
}
