import { useEffect, useMemo, useRef, useState } from 'react'

type Algo = 'selection' | 'insertion' | 'bulles'

interface Step {
  arr: number[]
  /** indices en cours de comparaison */
  compare?: [number, number]
  /** indices venant d'être échangés / déplacés */
  moved?: number[]
  /** indices définitivement triés */
  sorted: number[]
  note: string
}

function randomArray(size: number): number[] {
  return Array.from({ length: size }, () => 5 + Math.floor(Math.random() * 95))
}

function computeSteps(algo: Algo, input: number[]): Step[] {
  const a = [...input]
  const steps: Step[] = [{ arr: [...a], sorted: [], note: 'Tableau initial.' }]
  const n = a.length

  if (algo === 'selection') {
    const sorted: number[] = []
    for (let i = 0; i < n - 1; i++) {
      let min = i
      for (let j = i + 1; j < n; j++) {
        steps.push({
          arr: [...a],
          compare: [min, j],
          sorted: [...sorted],
          note: `On cherche le minimum de la partie non triée : a[${j}] = ${a[j]} vs minimum actuel a[${min}] = ${a[min]}.`,
        })
        if (a[j] < a[min]) min = j
      }
      if (min !== i) {
        ;[a[i], a[min]] = [a[min], a[i]]
        steps.push({
          arr: [...a],
          moved: [i, min],
          sorted: [...sorted],
          note: `Échange : le minimum ${a[i]} prend la position ${i}.`,
        })
      }
      sorted.push(i)
      steps.push({ arr: [...a], sorted: [...sorted], note: `La position ${i} est définitivement triée.` })
    }
    steps.push({ arr: [...a], sorted: Array.from({ length: n }, (_, k) => k), note: 'Tableau trié. ✔' })
  }

  if (algo === 'insertion') {
    for (let i = 1; i < n; i++) {
      const key = a[i]
      let j = i - 1
      steps.push({
        arr: [...a],
        compare: [i, j],
        sorted: [],
        note: `On insère a[${i}] = ${key} dans la partie triée à sa gauche.`,
      })
      while (j >= 0 && a[j] > key) {
        a[j + 1] = a[j]
        steps.push({
          arr: [...a],
          moved: [j + 1],
          sorted: [],
          note: `${a[j + 1]} > ${key} : on le décale vers la droite.`,
        })
        j--
      }
      a[j + 1] = key
      steps.push({ arr: [...a], moved: [j + 1], sorted: [], note: `${key} est inséré en position ${j + 1}.` })
    }
    steps.push({ arr: [...a], sorted: Array.from({ length: n }, (_, k) => k), note: 'Tableau trié. ✔' })
  }

  if (algo === 'bulles') {
    const sorted: number[] = []
    for (let i = 0; i < n - 1; i++) {
      let swapped = false
      for (let j = 0; j < n - 1 - i; j++) {
        steps.push({
          arr: [...a],
          compare: [j, j + 1],
          sorted: [...sorted],
          note: `Comparaison des voisins a[${j}] = ${a[j]} et a[${j + 1}] = ${a[j + 1]}.`,
        })
        if (a[j] > a[j + 1]) {
          ;[a[j], a[j + 1]] = [a[j + 1], a[j]]
          swapped = true
          steps.push({
            arr: [...a],
            moved: [j, j + 1],
            sorted: [...sorted],
            note: `Ils sont dans le mauvais ordre : échange.`,
          })
        }
      }
      sorted.unshift(n - 1 - i)
      steps.push({
        arr: [...a],
        sorted: [...sorted],
        note: `Le plus grand élément restant a « remonté » en position ${n - 1 - i}.`,
      })
      if (!swapped) break
    }
    steps.push({ arr: [...a], sorted: Array.from({ length: n }, (_, k) => k), note: 'Tableau trié. ✔' })
  }

  return steps
}

const TITLES: Record<Algo, string> = {
  selection: 'Tri par sélection, pas à pas',
  insertion: 'Tri par insertion, pas à pas',
  bulles: 'Tri à bulles, pas à pas',
}

// Couleurs de la palette catégorielle validée (light / dark)
const COLORS = {
  default: 'light-dark(#2a78d6, #3987e5)',
  compare: 'light-dark(#eda100, #c98500)',
  moved: 'light-dark(#e34948, #e66767)',
  sorted: 'light-dark(#008300, #008300)',
}

const SIZE = 12
const W = 640
const H = 220
const PAD = { top: 24, bottom: 8, side: 8 }

function SortingViz({ algo }: { algo: Algo }) {
  const [input, setInput] = useState(() => randomArray(SIZE))
  const steps = useMemo(() => computeSteps(algo, input), [algo, input])
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(4) // pas par seconde
  const timer = useRef<ReturnType<typeof setInterval>>(null)

  useEffect(() => {
    if (!playing) return
    timer.current = setInterval(() => {
      setIndex((i) => {
        if (i >= steps.length - 1) {
          setPlaying(false)
          return i
        }
        return i + 1
      })
    }, 1000 / speed)
    return () => {
      if (timer.current) clearInterval(timer.current)
    }
  }, [playing, speed, steps.length])

  const step = steps[Math.min(index, steps.length - 1)]
  const barW = (W - PAD.side * 2) / SIZE

  const colorOf = (i: number): string => {
    if (step.sorted.includes(i)) return COLORS.sorted
    if (step.moved?.includes(i)) return COLORS.moved
    if (step.compare && (step.compare[0] === i || step.compare[1] === i)) return COLORS.compare
    return COLORS.default
  }

  const reset = (newArray?: boolean) => {
    setPlaying(false)
    setIndex(0)
    if (newArray) setInput(randomArray(SIZE))
  }

  return (
    <figure className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
      <figcaption className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">{TITLES[algo]}</figcaption>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={TITLES[algo]}>
        {step.arr.map((v, i) => {
          const h = (v / 100) * (H - PAD.top - PAD.bottom)
          return (
            <g key={i}>
              <rect
                x={PAD.side + i * barW + 3}
                y={H - PAD.bottom - h}
                width={barW - 6}
                height={h}
                rx={4}
                style={{ fill: colorOf(i), transition: 'x 120ms, y 120ms, height 120ms' }}
              />
              <text
                x={PAD.side + i * barW + barW / 2}
                y={H - PAD.bottom - h - 6}
                textAnchor="middle"
                className="fill-slate-500 text-[11px] dark:fill-slate-400"
              >
                {v}
              </text>
            </g>
          )
        })}
      </svg>

      <p className="mt-2 min-h-10 text-sm text-slate-600 dark:text-slate-300">
        <span className="mr-2 rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs dark:bg-slate-800">
          {index + 1}/{steps.length}
        </span>
        {step.note}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button onClick={() => setPlaying((p) => !p)} className="viz-btn" disabled={index >= steps.length - 1}>
          {playing ? '⏸ Pause' : '▶ Lecture'}
        </button>
        <button onClick={() => setIndex((i) => Math.max(0, i - 1))} className="viz-btn" disabled={index === 0}>
          ← Pas
        </button>
        <button
          onClick={() => setIndex((i) => Math.min(steps.length - 1, i + 1))}
          className="viz-btn"
          disabled={index >= steps.length - 1}
        >
          Pas →
        </button>
        <button onClick={() => reset()} className="viz-btn">
          ↺ Recommencer
        </button>
        <button onClick={() => reset(true)} className="viz-btn">
          🎲 Nouveau tableau
        </button>
        <label className="ml-auto flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          Vitesse
          <input
            type="range"
            min={1}
            max={12}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="accent-indigo-600"
          />
        </label>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
        <LegendDot color={COLORS.default} label="non trié" />
        <LegendDot color={COLORS.compare} label="en comparaison" />
        <LegendDot color={COLORS.moved} label="déplacé / échangé" />
        <LegendDot color={COLORS.sorted} label="trié" />
      </div>
    </figure>
  )
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="h-2.5 w-2.5 rounded-sm" style={{ background: color }} />
      {label}
    </span>
  )
}

export function SortSelectionViz() {
  return <SortingViz algo="selection" />
}
export function SortInsertionViz() {
  return <SortingViz algo="insertion" />
}
export function SortBubbleViz() {
  return <SortingViz algo="bulles" />
}
