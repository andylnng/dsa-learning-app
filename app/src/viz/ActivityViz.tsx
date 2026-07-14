import { useState } from 'react'

type Critere = 'fin' | 'debut' | 'duree'

interface Act {
  id: number
  debut: number
  fin: number
}

// jeu construit pour que seul le critère « fin la plus tôt » soit optimal :
// - l'activité 6 (longue, début 0) piège le critère « début le plus tôt »
// - l'activité 3 (courte, à cheval sur 2 et 4) piège le critère « durée »
const ACTIVITES: Act[] = [
  { id: 1, debut: 1, fin: 4 },
  { id: 2, debut: 4, fin: 7 },
  { id: 3, debut: 6, fin: 8 },
  { id: 4, debut: 7, fin: 10 },
  { id: 5, debut: 10, fin: 13 },
  { id: 6, debut: 0, fin: 12 },
  { id: 7, debut: 13, fin: 15 },
]
const T_MAX = 15

function glouton(critere: Critere): number[] {
  const tri = [...ACTIVITES].sort((a, b) => {
    if (critere === 'fin') return a.fin - b.fin
    if (critere === 'debut') return a.debut - b.debut
    return a.fin - a.debut - (b.fin - b.debut)
  })
  const choisies: Act[] = []
  for (const a of tri) {
    if (choisies.every((c) => a.debut >= c.fin || a.fin <= c.debut)) {
      choisies.push(a)
    }
  }
  return choisies.map((a) => a.id)
}

const LABELS: Record<Critere, string> = {
  fin: 'fin la plus tôt (correct)',
  debut: 'début le plus tôt',
  duree: 'durée la plus courte',
}

export default function ActivityViz() {
  const [critere, setCritere] = useState<Critere>('fin')
  const choisies = glouton(critere)
  const optimum = glouton('fin').length

  return (
    <figure className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
      <figcaption className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
        Sélection d'activités : compare les critères gloutons
      </figcaption>

      <div className="mb-3 flex flex-wrap items-center gap-2 text-sm">
        <span className="text-xs text-slate-500 dark:text-slate-400">Critère :</span>
        <div className="flex overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
          {(Object.keys(LABELS) as Critere[]).map((c) => (
            <button
              key={c}
              onClick={() => setCritere(c)}
              className={`px-3 py-1.5 text-xs ${
                critere === c
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              {LABELS[c]}
            </button>
          ))}
        </div>
        <span
          className={`ml-auto rounded-lg px-2.5 py-1 text-xs font-semibold ${
            choisies.length === optimum
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
              : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
          }`}
        >
          {choisies.length} activités {choisies.length === optimum ? '= optimum' : `< optimum (${optimum})`}
        </span>
      </div>

      <svg viewBox={`0 0 640 ${ACTIVITES.length * 26 + 30}`} className="w-full" role="img" aria-label="Activités sur une ligne du temps">
        {Array.from({ length: T_MAX + 1 }, (_, t) => (
          <g key={t}>
            <line
              x1={40 + (t / T_MAX) * 580}
              y1={4}
              x2={40 + (t / T_MAX) * 580}
              y2={ACTIVITES.length * 26 + 8}
              className="stroke-slate-100 dark:stroke-slate-800"
              strokeWidth={1}
            />
            {t % 2 === 0 && (
              <text
                x={40 + (t / T_MAX) * 580}
                y={ACTIVITES.length * 26 + 24}
                textAnchor="middle"
                className="fill-slate-400 text-[10px] dark:fill-slate-500"
              >
                {t}
              </text>
            )}
          </g>
        ))}
        {ACTIVITES.map((a, i) => {
          const chosen = choisies.includes(a.id)
          const x1 = 40 + (a.debut / T_MAX) * 580
          const x2 = 40 + (a.fin / T_MAX) * 580
          return (
            <g key={a.id}>
              <text x={28} y={i * 26 + 21} textAnchor="end" className="fill-slate-400 text-[11px] dark:fill-slate-500">
                {a.id}
              </text>
              <rect
                x={x1}
                y={i * 26 + 8}
                width={x2 - x1}
                height={18}
                rx={5}
                className={
                  chosen
                    ? 'fill-emerald-400 stroke-emerald-600 dark:fill-emerald-600'
                    : 'fill-slate-200 stroke-slate-300 dark:fill-slate-800 dark:stroke-slate-700'
                }
                strokeWidth={1.5}
              />
              <text
                x={(x1 + x2) / 2}
                y={i * 26 + 21}
                textAnchor="middle"
                className={`text-[10px] font-medium ${chosen ? 'fill-white' : 'fill-slate-500 dark:fill-slate-400'}`}
              >
                [{a.debut}, {a.fin}]
              </text>
            </g>
          )
        })}
      </svg>

      <p className="mt-2 min-h-10 text-sm text-slate-600 dark:text-slate-300">
        {critere === 'fin'
          ? 'Fin la plus tôt : chaque choix laisse le maximum de place pour la suite — optimal (preuve par argument d’échange).'
          : critere === 'debut'
            ? 'Début le plus tôt : l’activité 6 [0, 12] est prise en premier et bloque presque tout — sous-optimal.'
            : 'Durée la plus courte : l’activité 3 [6, 8], courte mais à cheval sur 2 et 4, en bloque deux d’un coup — sous-optimal.'}
      </p>
    </figure>
  )
}
