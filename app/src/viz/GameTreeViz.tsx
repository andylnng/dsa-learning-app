import { useMemo, useState } from 'react'
import { StepControls, StepNote, useStepPlayer } from './StepPlayer'

// Arbre fixe : racine MAX → 3 nœuds MIN → 3 feuilles chacun.
interface Step {
  /** valeurs connues, par id de nœud */
  values: Record<number, number>
  current: number
  pruned: number[]
  visited: number[]
  note: string
}

const W = 640
const H = 300

// ids : 0 = racine ; 1..3 = MIN ; 4..12 = feuilles (4..6 sous 1, 7..9 sous 2, 10..12 sous 3)
const minNodes = [1, 2, 3]
const leavesOf = (m: number) => [m * 3 + 1, m * 3 + 2, m * 3 + 3]

function pos(id: number): { x: number; y: number } {
  if (id === 0) return { x: W / 2, y: 36 }
  if (id <= 3) return { x: (W / 4) * id, y: 140 }
  const parent = Math.floor((id - 1) / 3)
  const idx = (id - 1) % 3
  const px = pos(parent).x
  return { x: px + (idx - 1) * 58, y: 250 }
}

function computeSteps(leaves: number[], pruning: boolean): { steps: Step[]; explored: number } {
  const steps: Step[] = []
  const values: Record<number, number> = {}
  const pruned: number[] = []
  const visited: number[] = []
  const leafValue = (id: number) => leaves[id - 4]

  function push(current: number, note: string) {
    steps.push({ values: { ...values }, current, pruned: [...pruned], visited: [...visited], note })
  }

  let alpha = -Infinity
  visited.push(0)
  push(0, `Racine (MAX) : on explore ses enfants de gauche à droite. α = −∞, β = +∞.`)
  let best = -Infinity

  for (const m of minNodes) {
    visited.push(m)
    push(
      m,
      pruning
        ? `Nœud MIN ${m} : α = ${fmt(alpha)} (le meilleur que MAX garantit déjà), β = +∞.`
        : `Nœud MIN ${m} : on évalue toutes ses feuilles.`,
    )
    let beta = Infinity
    let cut = false
    for (const f of leavesOf(m)) {
      visited.push(f)
      values[f] = leafValue(f)
      beta = Math.min(beta, leafValue(f))
      push(f, `Feuille = ${leafValue(f)} → la valeur provisoire du nœud MIN descend à ${fmt(beta)}.`)
      if (pruning && beta <= alpha) {
        const rest = leavesOf(m).filter((x) => !visited.includes(x))
        if (rest.length > 0) {
          pruned.push(...rest)
          push(
            m,
            `β = ${fmt(beta)} ≤ α = ${fmt(alpha)} : coupure ! MAX a déjà mieux ailleurs — les ${rest.length} feuille(s) restante(s) sont élaguées.`,
          )
        }
        cut = true
        break
      }
    }
    values[m] = beta
    if (!cut) push(m, `Nœud MIN ${m} terminé : sa valeur est ${fmt(beta)}.`)
    best = Math.max(best, beta)
    alpha = Math.max(alpha, beta)
    values[0] = best
    push(0, `La racine (MAX) retient max(…) = ${fmt(best)}${pruning ? ` ; α devient ${fmt(alpha)}.` : '.'}`)
  }

  const explored = visited.filter((id) => id >= 4).length
  push(
    0,
    `Terminé : valeur minimax = ${fmt(best)}. ${explored}/9 feuilles explorées${
      pruning ? ` — ${9 - explored} évitée(s) par l'élagage.` : ' (minimax pur explore tout).'
    }`,
  )
  return { steps, explored }
}

function fmt(v: number): string {
  if (v === Infinity) return '+∞'
  if (v === -Infinity) return '−∞'
  return String(v)
}

function randomLeaves(): number[] {
  return Array.from({ length: 9 }, () => 1 + Math.floor(Math.random() * 15))
}

export default function GameTreeViz() {
  const [leaves, setLeaves] = useState<number[]>([3, 12, 8, 2, 4, 6, 14, 5, 2])
  const [pruning, setPruning] = useState(true)
  const { steps } = useMemo(() => computeSteps(leaves, pruning), [leaves, pruning])
  const player = useStepPlayer(steps.length)
  const step = steps[Math.min(player.index, steps.length - 1)]

  const nodeIds = [0, 1, 2, 3, ...Array.from({ length: 9 }, (_, i) => i + 4)]

  return (
    <figure className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
      <figcaption className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
        Minimax {pruning ? 'avec élagage alpha-beta' : 'sans élagage'}
      </figcaption>

      <div className="mb-2 flex flex-wrap items-center gap-3 text-sm">
        <label className="flex cursor-pointer items-center gap-1.5 text-slate-600 select-none dark:text-slate-300">
          <input
            type="checkbox"
            checked={pruning}
            onChange={(e) => {
              setPruning(e.target.checked)
              player.reset()
            }}
            className="accent-indigo-600"
          />
          élagage alpha-beta
        </label>
        <button
          onClick={() => {
            setLeaves(randomLeaves())
            player.reset()
          }}
          className="viz-btn"
        >
          🎲 Nouvelles valeurs
        </button>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Arbre de jeu minimax">
        {/* arêtes */}
        {minNodes.map((m) => {
          const pm = pos(m)
          const pr = pos(0)
          return (
            <g key={m}>
              <line
                x1={pr.x}
                y1={pr.y}
                x2={pm.x}
                y2={pm.y}
                strokeWidth={1.5}
                className="stroke-slate-300 dark:stroke-slate-700"
              />
              {leavesOf(m).map((f) => {
                const pf = pos(f)
                return (
                  <line
                    key={f}
                    x1={pm.x}
                    y1={pm.y}
                    x2={pf.x}
                    y2={pf.y}
                    strokeWidth={1.5}
                    className={
                      step.pruned.includes(f)
                        ? 'stroke-slate-200 dark:stroke-slate-800'
                        : 'stroke-slate-300 dark:stroke-slate-700'
                    }
                    strokeDasharray={step.pruned.includes(f) ? '3 3' : undefined}
                  />
                )
              })}
            </g>
          )
        })}

        {nodeIds.map((id) => {
          const p = pos(id)
          const isMax = id === 0
          const isMin = id >= 1 && id <= 3
          const isPruned = step.pruned.includes(id)
          const seen = step.visited.includes(id)
          const isCurrent = step.current === id
          const value = step.values[id]
          const fillCls = isCurrent
            ? 'fill-indigo-500 stroke-indigo-600'
            : isPruned
              ? 'fill-slate-100 stroke-slate-300 dark:fill-slate-900 dark:stroke-slate-700'
              : 'fill-white stroke-slate-400 dark:fill-slate-900 dark:stroke-slate-500'
          const txtCls = isCurrent ? 'fill-white' : isPruned ? 'fill-slate-300 dark:fill-slate-700' : 'fill-slate-700 dark:fill-slate-200'
          return (
            <g key={id} opacity={seen || isPruned ? 1 : 0.35}>
              {isMax || isMin ? (
                <polygon
                  points={
                    isMax
                      ? `${p.x},${p.y - 16} ${p.x - 18},${p.y + 12} ${p.x + 18},${p.y + 12}`
                      : `${p.x},${p.y + 16} ${p.x - 18},${p.y - 12} ${p.x + 18},${p.y - 12}`
                  }
                  strokeWidth={2}
                  className={fillCls}
                />
              ) : (
                <rect x={p.x - 14} y={p.y - 14} width={28} height={28} rx={6} strokeWidth={2} className={fillCls} />
              )}
              <text
                x={p.x}
                y={p.y + (isMax ? 7 : isMin ? 1 : 5)}
                textAnchor="middle"
                className={`text-[12px] font-semibold ${txtCls}`}
              >
                {isPruned ? '✕' : value !== undefined ? fmt(value) : id >= 4 ? leaves[id - 4] : '?'}
              </text>
            </g>
          )
        })}

        <text x={16} y={40} className="fill-slate-400 text-[11px] dark:fill-slate-500">
          △ MAX
        </text>
        <text x={16} y={140} className="fill-slate-400 text-[11px] dark:fill-slate-500">
          ▽ MIN
        </text>
        <text x={16} y={250} className="fill-slate-400 text-[11px] dark:fill-slate-500">
          □ feuilles
        </text>
      </svg>

      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" /> nœud courant
        </span>
        <span className="flex items-center gap-1.5">
          <span className="font-mono">✕</span> élagué (jamais exploré)
        </span>
        <span>? = valeur pas encore connue</span>
      </div>

      <StepNote index={player.index} count={steps.length} note={step.note} />
      <StepControls player={player} stepCount={steps.length} />
      <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
        Astuce : déroule une fois avec l'élagage, une fois sans — la valeur de la racine est identique, seul le nombre
        de feuilles explorées change.
      </p>
    </figure>
  )
}
