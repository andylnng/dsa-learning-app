import { useMemo, useState } from 'react'
import { StepControls, StepNote, useStepPlayer } from './StepPlayer'

/** Grille : Dijkstra (h = 0) vs A* (Manhattan). Coût uniforme, 4 directions. */
const COLS = 16
const ROWS = 10
const START: [number, number] = [1, 5]
const GOAL: [number, number] = [14, 5]

// murs : un « U » qui force le contournement
const WALLS = new Set<string>()
for (let y = 2; y <= 8; y++) WALLS.add(`8,${y}`)
for (let x = 5; x <= 8; x++) WALLS.add(`${x},2`)
for (let x = 5; x <= 8; x++) WALLS.add(`${x},8`)

const key = (x: number, y: number) => `${x},${y}`

interface Step {
  explored: string[]
  frontier: string[]
  current?: string
  path: string[]
  note: string
}

function computeSteps(useHeuristic: boolean): { steps: Step[]; exploredCount: number; pathLen: number } {
  const steps: Step[] = []
  const h = (x: number, y: number) => (useHeuristic ? Math.abs(x - GOAL[0]) + Math.abs(y - GOAL[1]) : 0)
  const dist = new Map<string, number>()
  const parent = new Map<string, string>()
  const explored: string[] = []
  const open: [number, number, string][] = [] // [f, g, key]

  dist.set(key(...START), 0)
  open.push([h(...START), 0, key(...START)])

  let found = false
  let batch: string[] = []
  while (open.length > 0 && !found) {
    open.sort((a, b) => a[0] - b[0] || a[1] - b[1])
    const [, g, k] = open.shift()!
    if (explored.includes(k)) continue
    explored.push(k)
    batch.push(k)
    const [x, y] = k.split(',').map(Number)
    if (k === key(...GOAL)) {
      found = true
      break
    }
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      const nx = x + dx
      const ny = y + dy
      const nk = key(nx, ny)
      if (nx < 0 || ny < 0 || nx >= COLS || ny >= ROWS || WALLS.has(nk) || explored.includes(nk)) continue
      const ng = g + 1
      if (dist.get(nk) === undefined || ng < dist.get(nk)!) {
        dist.set(nk, ng)
        parent.set(nk, k)
        open.push([ng + h(nx, ny), ng, nk])
      }
    }
    // un pas de visualisation toutes les 4 expansions pour garder un déroulé digeste
    if (batch.length >= 4) {
      steps.push({
        explored: [...explored],
        frontier: open.map((o) => o[2]),
        current: k,
        path: [],
        note: `${explored.length} cases explorées — ${
          useHeuristic
            ? `A* privilégie f = g + h : l'exploration file vers la cible.`
            : `Dijkstra (h = 0) s'étend uniformément dans toutes les directions.`
        }`,
      })
      batch = []
    }
  }

  // reconstruire le chemin
  const path: string[] = []
  let cur: string | undefined = key(...GOAL)
  while (cur) {
    path.unshift(cur)
    cur = parent.get(cur)
  }
  steps.push({
    explored: [...explored],
    frontier: [],
    path,
    note: `Cible atteinte : chemin optimal de ${path.length - 1} pas, ${explored.length} cases explorées ${
      useHeuristic ? 'avec' : 'sans'
    } heuristique.`,
  })
  return { steps, exploredCount: explored.length, pathLen: path.length - 1 }
}

export default function AStarViz() {
  const [useH, setUseH] = useState(true)
  const { steps } = useMemo(() => computeSteps(useH), [useH])
  const dijkstraCount = useMemo(() => computeSteps(false).exploredCount, [])
  const astarCount = useMemo(() => computeSteps(true).exploredCount, [])
  const player = useStepPlayer(steps.length)
  const step = steps[Math.min(player.index, steps.length - 1)]
  const cell = 38

  return (
    <figure className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
      <figcaption className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
        Même labyrinthe, deux algorithmes : Dijkstra vs A*
      </figcaption>

      <div className="mb-3 flex flex-wrap items-center gap-3 text-sm">
        <div className="flex overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
          {[
            { v: false, label: 'Dijkstra (h = 0)' },
            { v: true, label: 'A* (Manhattan)' },
          ].map((o) => (
            <button
              key={o.label}
              onClick={() => {
                setUseH(o.v)
                player.reset()
              }}
              className={`px-3 py-1.5 ${
                useH === o.v
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
        <span className="ml-auto text-xs text-slate-500 dark:text-slate-400">
          exploration totale : Dijkstra {dijkstraCount} cases · A* {astarCount} cases — même chemin optimal
        </span>
      </div>

      <svg viewBox={`0 0 ${COLS * cell} ${ROWS * cell}`} className="w-full" role="img" aria-label="Recherche de chemin sur grille">
        {Array.from({ length: ROWS }, (_, y) =>
          Array.from({ length: COLS }, (_, x) => {
            const k = key(x, y)
            const isWall = WALLS.has(k)
            const isStart = k === key(...START)
            const isGoal = k === key(...GOAL)
            const onPath = step.path.includes(k)
            const isExplored = step.explored.includes(k)
            const inFrontier = step.frontier.includes(k)
            return (
              <rect
                key={k}
                x={x * cell + 1}
                y={y * cell + 1}
                width={cell - 2}
                height={cell - 2}
                rx={4}
                className={
                  isWall
                    ? 'fill-slate-700 dark:fill-slate-600'
                    : isStart
                      ? 'fill-emerald-500'
                      : isGoal
                        ? 'fill-red-500'
                        : onPath
                          ? 'fill-amber-400'
                          : isExplored
                            ? 'fill-indigo-300 dark:fill-indigo-800'
                            : inFrontier
                              ? 'fill-indigo-100 dark:fill-indigo-950'
                              : 'fill-slate-100 dark:fill-slate-900'
                }
              />
            )
          }),
        )}
        <text x={START[0] * cell + cell / 2} y={START[1] * cell + cell / 2 + 5} textAnchor="middle" className="fill-white text-[13px] font-bold">
          D
        </text>
        <text x={GOAL[0] * cell + cell / 2} y={GOAL[1] * cell + cell / 2 + 5} textAnchor="middle" className="fill-white text-[13px] font-bold">
          C
        </text>
      </svg>

      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" /> départ
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-red-500" /> cible
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-indigo-300 dark:bg-indigo-800" /> exploré
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-indigo-100 dark:bg-indigo-950" /> frontière
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-amber-400" /> chemin final
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-slate-700 dark:bg-slate-600" /> mur
        </span>
      </div>

      <StepNote index={player.index} count={steps.length} note={step.note} />
      <StepControls player={player} stepCount={steps.length} />
    </figure>
  )
}
