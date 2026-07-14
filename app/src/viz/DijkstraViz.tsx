import { useMemo } from 'react'
import { StepControls, StepNote, useStepPlayer } from './StepPlayer'

const POS: Record<string, { x: number; y: number }> = {
  A: { x: 70, y: 150 },
  B: { x: 220, y: 60 },
  C: { x: 220, y: 240 },
  D: { x: 380, y: 110 },
  E: { x: 380, y: 250 },
  F: { x: 530, y: 180 },
}
const EDGES: [string, string, number][] = [
  ['A', 'B', 4],
  ['A', 'C', 2],
  ['B', 'C', 1],
  ['B', 'D', 5],
  ['C', 'D', 8],
  ['C', 'E', 10],
  ['D', 'E', 2],
  ['D', 'F', 6],
  ['E', 'F', 3],
]

interface Step {
  dist: Record<string, number>
  finalise: string[]
  current?: string
  relaxing?: [string, string]
  pq: [number, string][]
  note: string
}

function computeSteps(): Step[] {
  const steps: Step[] = []
  const dist: Record<string, number> = { A: 0 }
  const finalise: string[] = []
  const pq: [number, string][] = [[0, 'A']]

  const snap = (note: string, current?: string, relaxing?: [string, string]) =>
    steps.push({
      dist: { ...dist },
      finalise: [...finalise],
      current,
      relaxing,
      pq: [...pq].sort((a, b) => a[0] - b[0]),
      note,
    })

  snap(`Départ : dist[A] = 0, tout le reste à ∞. File de priorité = [(0, A)].`, 'A')

  while (pq.length > 0) {
    pq.sort((a, b) => a[0] - b[0])
    const [d, u] = pq.shift()!
    if (finalise.includes(u)) continue
    finalise.push(u)
    snap(
      `On extrait ${u} (distance ${d}) : c'est le plus proche non finalisé — sa distance est DÉFINITIVE.`,
      u,
    )
    for (const [a, b, p] of EDGES) {
      const v = a === u ? b : b === u ? a : null
      if (!v || finalise.includes(v)) continue
      const nd = d + p
      if (dist[v] === undefined || nd < dist[v]) {
        const avant = dist[v]
        dist[v] = nd
        pq.push([nd, v])
        snap(
          `Relâchement de ${u}–${v} (poids ${p}) : dist[${v}] ${avant === undefined ? '= ∞' : `= ${avant}`} → ${nd}.`,
          u,
          [u, v],
        )
      }
    }
  }
  snap(
    `Terminé. Distances finales depuis A : ${Object.entries(dist)
      .map(([k, v]) => `${k}=${v}`)
      .join(', ')} — finalisées en ordre croissant.`,
  )
  return steps
}

export default function DijkstraViz() {
  const steps = useMemo(computeSteps, [])
  const player = useStepPlayer(steps.length)
  const step = steps[Math.min(player.index, steps.length - 1)]

  return (
    <figure className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
      <figcaption className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
        Dijkstra depuis A : finalisation gloutonne par distance croissante
      </figcaption>

      <svg viewBox="0 0 640 300" className="w-full" role="img" aria-label="Algorithme de Dijkstra sur un graphe pondéré">
        {EDGES.map(([a, b, p]) => {
          const isRelaxing = step.relaxing && edgeMatch(step.relaxing, a, b)
          const mx = (POS[a].x + POS[b].x) / 2
          const my = (POS[a].y + POS[b].y) / 2
          return (
            <g key={`${a}${b}`}>
              <line
                x1={POS[a].x}
                y1={POS[a].y}
                x2={POS[b].x}
                y2={POS[b].y}
                strokeWidth={isRelaxing ? 3.5 : 1.5}
                className={isRelaxing ? 'stroke-amber-500' : 'stroke-slate-300 dark:stroke-slate-700'}
              />
              <rect x={mx - 10} y={my - 9} width={20} height={18} rx={4} className="fill-white dark:fill-slate-950" />
              <text x={mx} y={my + 4} textAnchor="middle" className="fill-slate-500 text-[11px] font-medium dark:fill-slate-400">
                {p}
              </text>
            </g>
          )
        })}
        {Object.entries(POS).map(([n, p]) => {
          const isFinal = step.finalise.includes(n)
          const isCurrent = step.current === n
          const d = step.dist[n]
          return (
            <g key={n}>
              <circle
                cx={p.x}
                cy={p.y}
                r={19}
                strokeWidth={isCurrent ? 4 : 2}
                className={
                  isFinal
                    ? `fill-emerald-500 ${isCurrent ? 'stroke-slate-900 dark:stroke-white' : 'stroke-emerald-600'}`
                    : d !== undefined
                      ? 'fill-indigo-100 stroke-indigo-400 dark:fill-indigo-950'
                      : 'fill-white stroke-slate-300 dark:fill-slate-900 dark:stroke-slate-600'
                }
              />
              <text
                x={p.x}
                y={p.y + 1}
                textAnchor="middle"
                className={`text-[12px] font-bold ${isFinal ? 'fill-white' : 'fill-slate-600 dark:fill-slate-300'}`}
              >
                {n}
              </text>
              <text
                x={p.x}
                y={p.y + 12}
                textAnchor="middle"
                className={`text-[9px] font-medium ${isFinal ? 'fill-emerald-100' : 'fill-slate-400'}`}
              >
                {d === undefined ? '∞' : d}
              </text>
            </g>
          )
        })}
      </svg>

      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
        <span className="font-semibold text-slate-500 dark:text-slate-400">File de priorité :</span>
        {step.pq.length === 0 && <span className="text-slate-300 dark:text-slate-600">vide</span>}
        {step.pq.map(([d, n], i) => (
          <span
            key={i}
            className={`rounded border px-2 py-1 font-mono ${
              step.finalise.includes(n)
                ? 'border-slate-200 text-slate-300 line-through dark:border-slate-700 dark:text-slate-600'
                : 'border-indigo-300 bg-indigo-50 dark:border-indigo-700 dark:bg-indigo-950'
            }`}
          >
            ({d}, {n})
          </span>
        ))}
        <span className="ml-auto flex gap-3 text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> finalisé
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full border-2 border-indigo-400 bg-indigo-100 dark:bg-indigo-950" />{' '}
            découvert
          </span>
        </span>
      </div>

      <StepNote index={player.index} count={steps.length} note={step.note} />
      <StepControls player={player} stepCount={steps.length} />
    </figure>
  )
}

function edgeMatch(r: [string, string], a: string, b: string): boolean {
  return (r[0] === a && r[1] === b) || (r[0] === b && r[1] === a)
}
