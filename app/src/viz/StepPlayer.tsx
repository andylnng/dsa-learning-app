import { useEffect, useRef, useState, type ReactNode } from 'react'

/** Contrôles lecture/pause/pas/vitesse partagés par les visualisations pas à pas. */
export function useStepPlayer(stepCount: number) {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(4)
  const timer = useRef<ReturnType<typeof setInterval>>(null)

  useEffect(() => {
    if (!playing) return
    timer.current = setInterval(() => {
      setIndex((i) => {
        if (i >= stepCount - 1) {
          setPlaying(false)
          return i
        }
        return i + 1
      })
    }, 1000 / speed)
    return () => {
      if (timer.current) clearInterval(timer.current)
    }
  }, [playing, speed, stepCount])

  const reset = () => {
    setPlaying(false)
    setIndex(0)
  }

  return { index, setIndex, playing, setPlaying, speed, setSpeed, reset }
}

export function StepControls({
  player,
  stepCount,
  extra,
}: {
  player: ReturnType<typeof useStepPlayer>
  stepCount: number
  extra?: ReactNode
}) {
  const { index, setIndex, playing, setPlaying, speed, setSpeed, reset } = player
  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      <button onClick={() => setPlaying((p) => !p)} className="viz-btn" disabled={index >= stepCount - 1}>
        {playing ? '⏸ Pause' : '▶ Lecture'}
      </button>
      <button onClick={() => setIndex((i) => Math.max(0, i - 1))} className="viz-btn" disabled={index === 0}>
        ← Pas
      </button>
      <button
        onClick={() => setIndex((i) => Math.min(stepCount - 1, i + 1))}
        className="viz-btn"
        disabled={index >= stepCount - 1}
      >
        Pas →
      </button>
      <button onClick={reset} className="viz-btn">
        ↺ Recommencer
      </button>
      {extra}
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
  )
}

export function StepNote({ index, count, note }: { index: number; count: number; note: string }) {
  return (
    <p className="mt-2 min-h-10 text-sm text-slate-600 dark:text-slate-300">
      <span className="mr-2 rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs dark:bg-slate-800">
        {index + 1}/{count}
      </span>
      {note}
    </p>
  )
}
