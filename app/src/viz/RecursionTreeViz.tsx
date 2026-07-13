import { useMemo, useState } from 'react'
import { StepControls, StepNote, useStepPlayer } from './StepPlayer'

interface TreeNode {
  id: number
  n: number
  children: TreeNode[]
  /** appel résolu par la mémoïsation (pas de sous-arbre) */
  fromCache: boolean
  x: number
  y: number
}

interface Step {
  /** ids visités jusqu'ici */
  visited: number[]
  /** id du nœud courant */
  current: number
  note: string
}

const W = 640
const H = 320

function buildTree(n: number, memo: boolean): { root: TreeNode; steps: Step[]; total: number } {
  let nextId = 0
  const cache = new Set<number>()
  const steps: Step[] = []
  const visited: number[] = []

  function build(k: number): TreeNode {
    const node: TreeNode = { id: nextId++, n: k, children: [], fromCache: false, x: 0, y: 0 }
    if (memo && cache.has(k)) {
      node.fromCache = true
      return node
    }
    if (k > 1) {
      node.children.push(build(k - 1))
      node.children.push(build(k - 2))
    }
    if (memo) cache.add(k)
    return node
  }

  const root = build(n)

  // disposition : x = ordre infixe, y = profondeur
  let cursor = 0
  const depthMax = { v: 0 }
  function layout(node: TreeNode, depth: number) {
    depthMax.v = Math.max(depthMax.v, depth)
    if (node.children.length === 0) {
      node.x = cursor++
    } else {
      layout(node.children[0], depth + 1)
      layout(node.children[1], depth + 1)
      node.x = (node.children[0].x + node.children[1].x) / 2
    }
    node.y = depth
  }
  layout(root, 0)
  const width = Math.max(cursor - 1, 1)
  function scale(node: TreeNode) {
    node.x = 40 + (node.x / width) * (W - 80)
    node.y = 32 + (node.y / Math.max(depthMax.v, 1)) * (H - 72)
    node.children.forEach(scale)
  }
  scale(root)

  // pas : parcours en profondeur (ordre d'appel réel)
  let count = 0
  function walk(node: TreeNode) {
    count++
    visited.push(node.id)
    steps.push({
      visited: [...visited],
      current: node.id,
      note: node.fromCache
        ? `fib(${node.n}) : déjà en cache — la mémoïsation évite tout un sous-arbre.`
        : node.n <= 1
          ? `fib(${node.n}) : cas de base, retourne ${node.n}.`
          : `Appel de fib(${node.n}) → déclenche fib(${node.n - 1}) puis fib(${node.n - 2}).`,
    })
    node.children.forEach(walk)
  }
  walk(root)
  steps.push({
    visited: [...visited],
    current: -1,
    note: `Terminé : ${count} appels au total pour fib(${n})${memo ? ' avec mémoïsation — croissance linéaire.' : ' sans mémoïsation — croissance exponentielle.'}`,
  })

  return { root, steps, total: count }
}

function flatten(node: TreeNode, acc: TreeNode[] = []): TreeNode[] {
  acc.push(node)
  node.children.forEach((c) => flatten(c, acc))
  return acc
}

export default function RecursionTreeViz() {
  const [n, setN] = useState(6)
  const [memo, setMemo] = useState(false)
  const { root, steps, total } = useMemo(() => buildTree(n, memo), [n, memo])
  const player = useStepPlayer(steps.length)
  const step = steps[Math.min(player.index, steps.length - 1)]
  const nodes = useMemo(() => flatten(root), [root])

  const naiveTotal = useMemo(() => buildTree(n, false).total, [n])
  const memoTotal = useMemo(() => buildTree(n, true).total, [n])

  const changeConfig = (newN: number, newMemo: boolean) => {
    setN(newN)
    setMemo(newMemo)
    player.reset()
  }

  return (
    <figure className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
      <figcaption className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
        L'arbre de récursivité de fib({n})
      </figcaption>

      <div className="mb-3 flex flex-wrap items-center gap-3 text-sm">
        <label className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
          n =
          <input
            type="range"
            min={3}
            max={8}
            value={n}
            onChange={(e) => changeConfig(Number(e.target.value), memo)}
            className="accent-indigo-600"
          />
          <span className="w-4 font-mono">{n}</span>
        </label>
        <label className="flex cursor-pointer items-center gap-1.5 text-slate-600 select-none dark:text-slate-300">
          <input
            type="checkbox"
            checked={memo}
            onChange={(e) => changeConfig(n, e.target.checked)}
            className="accent-indigo-600"
          />
          mémoïsation
        </label>
        <span className="ml-auto text-xs text-slate-500 dark:text-slate-400">
          {naiveTotal} appels sans mémo · {memoTotal} avec
        </span>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`Arbre de récursivité de fib(${n})`}>
        {nodes.map((node) =>
          node.children.map((c) => (
            <line
              key={`${node.id}-${c.id}`}
              x1={node.x}
              y1={node.y}
              x2={c.x}
              y2={c.y}
              strokeWidth={1.5}
              className={
                step.visited.includes(c.id)
                  ? 'stroke-slate-400 dark:stroke-slate-500'
                  : 'stroke-slate-200 dark:stroke-slate-800'
              }
            />
          )),
        )}
        {nodes.map((node) => {
          const seen = step.visited.includes(node.id)
          const isCurrent = step.current === node.id
          return (
            <g key={node.id} opacity={seen ? 1 : 0.25}>
              <circle
                cx={node.x}
                cy={node.y}
                r={14}
                strokeWidth={2}
                className={
                  isCurrent
                    ? 'fill-indigo-500 stroke-indigo-600'
                    : node.fromCache
                      ? 'fill-emerald-100 stroke-emerald-500 dark:fill-emerald-950'
                      : node.n <= 1
                        ? 'fill-slate-100 stroke-slate-400 dark:fill-slate-800 dark:stroke-slate-500'
                        : 'fill-white stroke-slate-400 dark:fill-slate-900 dark:stroke-slate-500'
                }
              />
              <text
                x={node.x}
                y={node.y + 4}
                textAnchor="middle"
                className={`text-[11px] font-medium ${isCurrent ? 'fill-white' : 'fill-slate-700 dark:fill-slate-200'}`}
              >
                {node.n}
              </text>
            </g>
          )
        })}
      </svg>

      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full border-2 border-slate-400 bg-white dark:bg-slate-900" /> appel
          récursif
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full border-2 border-slate-400 bg-slate-100 dark:bg-slate-800" /> cas de
          base
        </span>
        {memo && (
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full border-2 border-emerald-500 bg-emerald-100 dark:bg-emerald-950" />
            résolu par le cache
          </span>
        )}
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" /> appel courant
        </span>
      </div>

      <StepNote index={player.index} count={steps.length} note={step.note} />
      <StepControls player={player} stepCount={steps.length} />
      <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
        Astuce : active la mémoïsation et compare le nombre d'appels — {total} pour cette configuration. Les mêmes
        sous-problèmes (mêmes valeurs de n) reviennent partout dans l'arbre naïf.
      </p>
    </figure>
  )
}
