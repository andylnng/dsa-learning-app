import { useMemo } from 'react'
import { StepControls, StepNote, useStepPlayer } from './StepPlayer'

type Mode = 'bfs' | 'dfs'

const NODES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
const POS: Record<string, { x: number; y: number }> = {
  A: { x: 70, y: 140 },
  B: { x: 200, y: 60 },
  C: { x: 200, y: 220 },
  D: { x: 330, y: 110 },
  E: { x: 330, y: 230 },
  F: { x: 460, y: 150 },
  G: { x: 460, y: 260 },
  H: { x: 580, y: 200 },
}
const EDGES: [string, string][] = [
  ['A', 'B'],
  ['A', 'C'],
  ['B', 'D'],
  ['C', 'D'],
  ['C', 'E'],
  ['D', 'F'],
  ['E', 'F'],
  ['E', 'G'],
  ['F', 'H'],
  ['G', 'H'],
]

function voisins(u: string): string[] {
  const out: string[] = []
  for (const [a, b] of EDGES) {
    if (a === u) out.push(b)
    if (b === u) out.push(a)
  }
  return out.sort()
}

interface Step {
  visited: string[]
  current?: string
  frontier: string[]
  dist: Record<string, number>
  note: string
}

function computeSteps(mode: Mode): Step[] {
  const steps: Step[] = []
  const visited: string[] = []
  const dist: Record<string, number> = {}

  if (mode === 'bfs') {
    const file: string[] = ['A']
    dist.A = 0
    visited.push('A')
    steps.push({
      visited: [...visited],
      frontier: [...file],
      dist: { ...dist },
      note: `Départ : A est enfilé (distance 0). File = [A].`,
    })
    while (file.length > 0) {
      const u = file.shift()!
      const nouveaux: string[] = []
      for (const v of voisins(u)) {
        if (!visited.includes(v)) {
          visited.push(v)
          dist[v] = dist[u] + 1
          file.push(v)
          nouveaux.push(v)
        }
      }
      steps.push({
        visited: [...visited],
        current: u,
        frontier: [...file],
        dist: { ...dist },
        note:
          nouveaux.length > 0
            ? `On défile ${u} et on découvre ${nouveaux.join(', ')} (distance ${dist[u] + 1}). File = [${file.join(', ')}].`
            : `On défile ${u} : tous ses voisins sont déjà découverts. File = [${file.join(', ') || 'vide'}].`,
      })
    }
    steps.push({
      visited: [...visited],
      frontier: [],
      dist: { ...dist },
      note: `Terminé. Ordre par couches : ${visited.join(', ')} — chaque couleur est une distance depuis A.`,
    })
  } else {
    const ordre: string[] = []
    function dfs(u: string, pile: string[]) {
      visited.push(u)
      ordre.push(u)
      dist[u] = pile.length
      steps.push({
        visited: [...visited],
        current: u,
        frontier: [...pile, u],
        dist: { ...dist },
        note: `On visite ${u} et on s'enfonce. Pile d'appels = [${[...pile, u].join(', ')}].`,
      })
      for (const v of voisins(u)) {
        if (!visited.includes(v)) dfs(v, [...pile, u])
      }
      steps.push({
        visited: [...visited],
        current: u,
        frontier: [...pile],
        dist: { ...dist },
        note: `Tous les voisins de ${u} sont explorés : on remonte (backtrack). Pile = [${pile.join(', ') || 'vide'}].`,
      })
    }
    dfs('A', [])
    steps.push({
      visited: [...visited],
      frontier: [],
      dist: { ...dist },
      note: `Terminé. Ordre de découverte : ${ordre.join(', ')} — une plongée, pas des couches.`,
    })
  }
  return steps
}

const LAYER_COLORS = ['#2a78d6', '#1baf7a', '#eda100', '#e34948', '#4a3aa7', '#e87ba4']

export default function GraphTraversalViz({ mode }: { mode: Mode }) {
  const steps = useMemo(() => computeSteps(mode), [mode])
  const player = useStepPlayer(steps.length)
  const step = steps[Math.min(player.index, steps.length - 1)]

  return (
    <figure className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
      <figcaption className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
        {mode === 'bfs' ? 'BFS : exploration par couches (file)' : 'DFS : plongée puis retour en arrière (pile)'}
      </figcaption>

      <svg viewBox="0 0 640 300" className="w-full" role="img" aria-label={`Parcours ${mode.toUpperCase()} d'un graphe`}>
        {EDGES.map(([a, b]) => (
          <line
            key={`${a}${b}`}
            x1={POS[a].x}
            y1={POS[a].y}
            x2={POS[b].x}
            y2={POS[b].y}
            strokeWidth={1.5}
            className="stroke-slate-300 dark:stroke-slate-700"
          />
        ))}
        {NODES.map((n) => {
          const seen = step.visited.includes(n)
          const isCurrent = step.current === n
          const inFrontier = step.frontier.includes(n)
          const color = seen ? LAYER_COLORS[step.dist[n] % LAYER_COLORS.length] : undefined
          return (
            <g key={n}>
              <circle
                cx={POS[n].x}
                cy={POS[n].y}
                r={18}
                strokeWidth={isCurrent ? 4 : inFrontier ? 3 : 2}
                style={color ? { fill: color } : undefined}
                className={
                  isCurrent
                    ? 'stroke-slate-900 dark:stroke-white'
                    : inFrontier
                      ? 'stroke-indigo-500'
                      : seen
                        ? 'stroke-transparent'
                        : 'fill-white stroke-slate-300 dark:fill-slate-900 dark:stroke-slate-600'
                }
              />
              <text
                x={POS[n].x}
                y={POS[n].y + 5}
                textAnchor="middle"
                className={`text-[13px] font-bold ${seen ? 'fill-white' : 'fill-slate-400 dark:fill-slate-500'}`}
              >
                {n}
              </text>
            </g>
          )
        })}
      </svg>

      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
        <span className="font-semibold text-slate-500 dark:text-slate-400">
          {mode === 'bfs' ? 'File :' : 'Pile :'}
        </span>
        {step.frontier.length === 0 && <span className="text-slate-300 dark:text-slate-600">vide</span>}
        {step.frontier.map((n, i) => (
          <span
            key={i}
            className="rounded border border-indigo-300 bg-indigo-50 px-2 py-1 font-mono dark:border-indigo-700 dark:bg-indigo-950"
          >
            {n}
          </span>
        ))}
        {mode === 'bfs' && (
          <span className="ml-auto flex flex-wrap gap-2 text-slate-500 dark:text-slate-400">
            {[0, 1, 2, 3, 4].map((d) => (
              <span key={d} className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: LAYER_COLORS[d] }} />d = {d}
              </span>
            ))}
          </span>
        )}
      </div>

      <StepNote index={player.index} count={steps.length} note={step.note} />
      <StepControls player={player} stepCount={steps.length} />
    </figure>
  )
}

export function BFSViz() {
  return <GraphTraversalViz mode="bfs" />
}
export function DFSViz() {
  return <GraphTraversalViz mode="dfs" />
}
