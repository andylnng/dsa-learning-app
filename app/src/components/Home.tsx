import { Link } from 'react-router-dom'
import { curriculum, findSection, allSectionIds } from '../data/curriculum'
import { useProgress } from '../data/progress'

export default function Home() {
  const { readCount, lastVisited } = useProgress()
  const totalDone = readCount(allSectionIds)
  const resume = lastVisited ? findSection(lastVisited) : undefined

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
        LOG320 — Structures de données et algorithmes
      </h1>
      <p className="mt-3 text-slate-600 dark:text-slate-300">
        Compagnon d'étude pour le cours, semaine par semaine : leçons, visualisations interactives et suivi de ta
        progression. Basé sur <em>Data Structures and Algorithms Made Easy in Java</em> et le plan de cours officiel.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        {resume && (
          <Link
            to={`/lecon/${resume.section.id}`}
            className="rounded-xl bg-indigo-600 px-5 py-3 font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
          >
            Reprendre : {resume.section.title}
          </Link>
        )}
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {totalDone}/{allSectionIds.length} sections lues
        </span>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {curriculum.map((week) => {
          const ids = week.sections.map((s) => s.id)
          const done = readCount(ids)
          const pct = ids.length ? Math.round((done / ids.length) * 100) : 0
          return (
            <Link
              key={week.number}
              to={`/lecon/${week.sections[0].id}`}
              className="rounded-2xl border border-slate-200 p-5 transition-shadow hover:shadow-md dark:border-slate-800 dark:hover:border-slate-700"
            >
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-semibold tracking-wide text-indigo-600 uppercase dark:text-indigo-400">
                  Semaine {week.number}
                  {week.exam && ' · examen'}
                </span>
                <span className="text-xs text-slate-400">{pct} %</span>
              </div>
              <h2 className="mt-1 font-semibold text-slate-900 dark:text-white">{week.title}</h2>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div className="h-full rounded-full bg-indigo-500 transition-all" style={{ width: `${pct}%` }} />
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
