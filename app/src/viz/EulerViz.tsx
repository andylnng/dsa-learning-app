import { useMemo } from 'react'
import { StepControls, StepNote, useStepPlayer } from './StepPlayer'

/**
 * Algorithme de Hierholzer sur un graphe à circuit d'Euler
 * (tous les degrés sont pairs).
 */
const POS: Record<string, { x: number; y: number }> = {
  A: { x: 120, y: 90 },
  B: { x: 320, y: 60 },
  C: { x: 210, y: 230 },
  D: { x: 470, y: 120 },
  E: { x: 430, y: 260 },
  F: { x: 570, y: 220 },
}
const EDGES: [string, string][] = [
  ['A', 'B'],
  ['B', 'C'],
  ['C', 'A'],
  ['B', 'D'],
  ['D', 'E'],
  ['E', 'B'],
  ['D', 'F'],
  ['F', 'E'],
  ['E', 'C'],
  ['C', 'D'],
]

const edgeId = (a: string, b: string) => (a < b ? `${a}-${b}` : `${b}-${a}`)

interface Step {
  used: string[] // ids d'arêtes consommées, dans l'ordre
  pile: string[]
  chemin: string[]
  current?: string
  note: string
}

function computeSteps(): Step[] {
  const steps: Step[] = []
  const restantes = new Map<string, [string, string]>()
  for (const [a, b] of EDGES) restantes.set(edgeId(a, b), [a, b])
  const used: string[] = []
  const pile: string[] = ['A']
  const chemin: string[] = []

  steps.push({
    used: [],
    pile: [...pile],
    chemin: [],
    current: 'A',
    note: `Tous les degrés sont pairs (A:2, B:4, C:4, D:4, E:4, F:2) : circuit d'Euler garanti. Départ en A.`,
  })

  while (pile.length > 0) {
    const u = pile[pile.length - 1]
    let next: string | undefined
    for (const [id, [a, b]] of restantes) {
      if (a === u || b === u) {
        next = a === u ? b : a
        restantes.delete(id)
        used.push(id)
        break
      }
    }
    if (next) {
      pile.push(next)
      steps.push({
        used: [...used],
        pile: [...pile],
        chemin: [...chemin],
        current: next,
        note: `De ${u}, on emprunte (et efface) l'arête ${u}–${next}. Pile = [${pile.join(', ')}].`,
      })
    } else {
      const done = pile.pop()!
      chemin.unshift(done)
      steps.push({
        used: [...used],
        pile: [...pile],
        chemin: [...chemin],
        current: pile[pile.length - 1],
        note: `${done} n'a plus d'arête libre : il rejoint le circuit final. Circuit = ${chemin.join(' → ')}.`,
      })
    }
  }
  steps.push({
    used,
    pile: [],
    chemin,
    note: `Circuit d'Euler complet : ${chemin.join(' → ')} — chaque arête parcourue exactement une fois, en O(m).`,
  })
  return steps
}

export default function EulerViz() {
  const steps = useMemo(computeSteps, [])
  const player = useStepPlayer(steps.length)
  const step = steps[Math.min(player.index, steps.length - 1)]

  return (
    <figure className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
      <figcaption className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
        Circuit d'Euler par l'algorithme de Hierholzer
      </figcaption>

      <svg viewBox="0 0 640 300" className="w-full" role="img" aria-label="Construction d'un circuit d'Euler">
        {EDGES.map(([a, b]) => {
          const id = edgeId(a, b)
          const idx = step.used.indexOf(id)
          const isUsed = idx >= 0
          const mx = (POS[a].x + POS[b].x) / 2
          const my = (POS[a].y + POS[b].y) / 2
          return (
            <g key={id}>
              <line
                x1={POS[a].x}
                y1={POS[a].y}
                x2={POS[b].x}
                y2={POS[b].y}
                strokeWidth={isUsed ? 3 : 1.5}
                className={isUsed ? 'stroke-indigo-500' : 'stroke-slate-300 dark:stroke-slate-700'}
                strokeDasharray={isUsed ? undefined : '4 3'}
              />
              {isUsed && (
                <g>
                  <circle cx={mx} cy={my} r={9} className="fill-indigo-500" />
                  <text x={mx} y={my + 3.5} textAnchor="middle" className="fill-white text-[10px] font-bold">
                    {idx + 1}
                  </text>
                </g>
              )}
            </g>
          )
        })}
        {Object.entries(POS).map(([n, p]) => {
          const isCurrent = step.current === n
          const inPile = step.pile.includes(n)
          return (
            <g key={n}>
              <circle
                cx={p.x}
                cy={p.y}
                r={17}
                strokeWidth={isCurrent ? 4 : 2}
                className={
                  isCurrent
                    ? 'fill-indigo-500 stroke-slate-900 dark:stroke-white'
                    : inPile
                      ? 'fill-indigo-100 stroke-indigo-400 dark:fill-indigo-950'
                      : 'fill-white stroke-slate-400 dark:fill-slate-900 dark:stroke-slate-500'
                }
              />
              <text
                x={p.x}
                y={p.y + 5}
                textAnchor="middle"
                className={`text-[13px] font-bold ${isCurrent ? 'fill-white' : 'fill-slate-600 dark:fill-slate-300'}`}
              >
                {n}
              </text>
            </g>
          )
        })}
      </svg>

      <div className="mt-2 space-y-1 text-xs text-slate-600 dark:text-slate-300">
        <p>
          <span className="font-semibold text-slate-500 dark:text-slate-400">Pile : </span>
          {step.pile.length > 0 ? step.pile.join(' → ') : 'vide'}
        </p>
        <p>
          <span className="font-semibold text-slate-500 dark:text-slate-400">Circuit final : </span>
          {step.chemin.length > 0 ? step.chemin.join(' → ') : '(en construction)'}
        </p>
      </div>

      <StepNote index={player.index} count={steps.length} note={step.note} />
      <StepControls player={player} stepCount={steps.length} />
    </figure>
  )
}
