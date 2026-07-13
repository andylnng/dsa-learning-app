import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import { curriculum, findSection } from '../data/curriculum'
import { getLessonContent } from '../data/content'
import { useProgress } from '../data/progress'
import { getViz } from '../viz/registry'

export default function Lesson() {
  const { sectionId } = useParams<{ sectionId: string }>()
  const { isRead, toggleRead, markVisited } = useProgress()

  const found = sectionId ? findSection(sectionId) : undefined

  useEffect(() => {
    if (found) markVisited(found.section.id)
    window.scrollTo(0, 0)
    // markVisited est stable dans les faits ; on ne dépend que de la section
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionId])

  if (!found) {
    return (
      <div className="px-6 py-10">
        <p>Section introuvable.</p>
        <Link to="/" className="text-indigo-600 hover:underline dark:text-indigo-400">
          Retour à l'accueil
        </Link>
      </div>
    )
  }

  const { week, section } = found
  const content = section.content ? getLessonContent(section.content) : undefined
  const Viz = section.viz ? getViz(section.viz) : undefined

  const flat = curriculum.flatMap((w) => w.sections)
  const index = flat.findIndex((s) => s.id === section.id)
  const prev = index > 0 ? flat[index - 1] : undefined
  const next = index < flat.length - 1 ? flat[index + 1] : undefined
  const read = isRead(section.id)

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <p className="text-xs font-semibold tracking-wide text-indigo-600 uppercase dark:text-indigo-400">
        Semaine {week.number} — {week.title}
      </p>

      {content ? (
        <article className="lesson">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw, rehypeHighlight]}>{content}</ReactMarkdown>
        </article>
      ) : (
        <article className="lesson">
          <h1>{section.title}</h1>
          <blockquote>
            <p>Leçon à venir — cette section sera rédigée dans une prochaine étape.</p>
          </blockquote>
        </article>
      )}

      {Viz && (
        <div className="mt-8">
          <Viz />
        </div>
      )}

      <div className="mt-10 flex items-center justify-between border-t border-slate-200 pt-6 dark:border-slate-800">
        <button
          onClick={() => toggleRead(section.id)}
          className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
            read
              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-950 dark:text-emerald-300'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
          }`}
        >
          {read ? '✓ Section lue' : 'Marquer comme lue'}
        </button>
        <div className="flex gap-2 text-sm">
          {prev && (
            <Link
              to={`/lecon/${prev.id}`}
              className="rounded-xl border border-slate-200 px-4 py-2 text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              ← Précédent
            </Link>
          )}
          {next && (
            <Link
              to={`/lecon/${next.id}`}
              className="rounded-xl border border-slate-200 px-4 py-2 text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Suivant →
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
