import { useEffect, useRef, useState } from 'react'

interface Frame {
  heap: number[]
  /** indices en cours d'échange / comparaison */
  active: number[]
  note: string
}

const W = 640
const H = 260

function nodePos(i: number, count: number): { x: number; y: number } {
  const depth = Math.floor(Math.log2(i + 1))
  const posInLevel = i + 1 - 2 ** depth
  const levelCount = Math.min(2 ** depth, count)
  void levelCount
  const slots = 2 ** depth
  const x = ((posInLevel + 0.5) / slots) * (W - 40) + 20
  const y = 32 + depth * 62
  return { x, y }
}

function insertFrames(heap: number[], v: number): Frame[] {
  const frames: Frame[] = []
  const t = [...heap, v]
  let i = t.length - 1
  frames.push({ heap: [...t], active: [i], note: `inserer(${v}) : on place ${v} à la fin (position ${i}), puis on percole vers le haut.` })
  while (i > 0 && t[i] < t[Math.floor((i - 1) / 2)]) {
    const p = Math.floor((i - 1) / 2)
    ;[t[i], t[p]] = [t[p], t[i]]
    frames.push({ heap: [...t], active: [i, p], note: `${v} < ${t[i]} (son parent) : échange — ${v} monte en position ${p}.` })
    i = p
  }
  frames.push({ heap: [...t], active: [i], note: `${v} est à sa place : la propriété de min-heap est rétablie.` })
  return frames
}

function extractFrames(heap: number[]): Frame[] {
  const frames: Frame[] = []
  const t = [...heap]
  const min = t[0]
  const last = t.pop()!
  if (t.length === 0) {
    frames.push({ heap: [], active: [], note: `extraireMin() → ${min} : le heap est maintenant vide.` })
    return frames
  }
  t[0] = last
  frames.push({
    heap: [...t],
    active: [0],
    note: `extraireMin() → ${min}. Le dernier élément (${last}) est déplacé à la racine, puis on percole vers le bas.`,
  })
  let i = 0
  while (true) {
    const g = 2 * i + 1
    const d = 2 * i + 2
    let m = i
    if (g < t.length && t[g] < t[m]) m = g
    if (d < t.length && t[d] < t[m]) m = d
    if (m === i) break
    ;[t[i], t[m]] = [t[m], t[i]]
    frames.push({
      heap: [...t],
      active: [i, m],
      note: `${t[m]} était plus grand que son plus petit enfant ${t[i]} : échange — il descend.`,
    })
    i = m
  }
  frames.push({ heap: [...t], active: [i], note: `Percolation terminée : ${t[0]} est le nouveau minimum, à la racine.` })
  return frames
}

export default function HeapViz() {
  const [heap, setHeap] = useState<number[]>([2, 5, 8, 9, 12, 11])
  const [frame, setFrame] = useState<Frame | null>(null)
  const [animating, setAnimating] = useState(false)
  const [nextVal, setNextVal] = useState(4)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const play = (frames: Frame[]) => {
    setAnimating(true)
    frames.forEach((f, i) => {
      timers.current.push(
        setTimeout(() => {
          setFrame(f)
          if (i === frames.length - 1) {
            setHeap(f.heap)
            setAnimating(false)
          }
        }, i * 900),
      )
    })
  }

  const shown = frame?.heap ?? heap
  const active = frame?.active ?? []

  return (
    <figure className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
      <figcaption className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
        Min-heap : insertion et extraction animées
      </figcaption>

      <div className="mb-2 flex flex-wrap gap-2">
        <button
          className="viz-btn"
          disabled={animating || shown.length >= 15}
          onClick={() => {
            play(insertFrames(heap, nextVal))
            setNextVal(1 + Math.floor(Math.random() * 20))
          }}
        >
          inserer({nextVal})
        </button>
        <button className="viz-btn" disabled={animating || heap.length === 0} onClick={() => play(extractFrames(heap))}>
          extraireMin()
        </button>
        <button
          className="viz-btn"
          disabled={animating}
          onClick={() => {
            setHeap([2, 5, 8, 9, 12, 11])
            setFrame(null)
          }}
        >
          ↺ Réinitialiser
        </button>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Arbre du min-heap">
        {shown.map((_, i) => {
          if (i === 0) return null
          const p = nodePos(i, shown.length)
          const pp = nodePos(Math.floor((i - 1) / 2), shown.length)
          return (
            <line
              key={i}
              x1={pp.x}
              y1={pp.y}
              x2={p.x}
              y2={p.y}
              strokeWidth={1.5}
              className="stroke-slate-300 dark:stroke-slate-700"
            />
          )
        })}
        {shown.map((v, i) => {
          const p = nodePos(i, shown.length)
          const isActive = active.includes(i)
          return (
            <g key={i}>
              <circle
                cx={p.x}
                cy={p.y}
                r={17}
                strokeWidth={2}
                className={
                  isActive
                    ? 'fill-indigo-500 stroke-indigo-600'
                    : i === 0
                      ? 'fill-emerald-50 stroke-emerald-500 dark:fill-emerald-950'
                      : 'fill-white stroke-slate-400 dark:fill-slate-900 dark:stroke-slate-500'
                }
              />
              <text
                x={p.x}
                y={p.y + 4}
                textAnchor="middle"
                className={`text-[12px] font-semibold ${isActive ? 'fill-white' : 'fill-slate-700 dark:fill-slate-200'}`}
              >
                {v}
              </text>
            </g>
          )
        })}
      </svg>

      {/* représentation tableau */}
      <div className="mt-2 flex flex-wrap justify-center gap-1">
        {shown.map((v, i) => (
          <div
            key={i}
            className={`flex h-8 w-9 flex-col items-center justify-center rounded border font-mono text-xs ${
              active.includes(i)
                ? 'border-indigo-400 bg-indigo-50 dark:border-indigo-500 dark:bg-indigo-950'
                : 'border-slate-200 dark:border-slate-700'
            }`}
          >
            {v}
          </div>
        ))}
        {shown.length === 0 && <span className="text-xs text-slate-400">heap vide</span>}
      </div>
      <p className="mt-1 text-center text-xs text-slate-400 dark:text-slate-500">
        le même heap, vu comme un tableau : parent(i) = (i−1)/2, enfants = 2i+1 et 2i+2
      </p>

      <p className="mt-2 min-h-10 text-sm text-slate-600 dark:text-slate-300">
        {frame?.note ?? 'La racine (en vert) est toujours le minimum. Lance une insertion ou une extraction.'}
      </p>
    </figure>
  )
}
