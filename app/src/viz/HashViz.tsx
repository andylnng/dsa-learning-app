import { useEffect, useRef, useState } from 'react'

type Mode = 'chainage' | 'lineaire'

const M = 7

interface Frame {
  chains: number[][]
  slots: (number | null)[]
  focusSlot?: number
  note: string
}

export default function HashViz() {
  const [mode, setMode] = useState<Mode>('chainage')
  const [chains, setChains] = useState<number[][]>(() => Array.from({ length: M }, () => []))
  const [slots, setSlots] = useState<(number | null)[]>(() => Array(M).fill(null))
  const [frame, setFrame] = useState<Frame | null>(null)
  const [animating, setAnimating] = useState(false)
  const [nextVal, setNextVal] = useState(19)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const count = mode === 'chainage' ? chains.reduce((s, c) => s + c.length, 0) : slots.filter((s) => s !== null).length
  const alpha = count / M

  const play = (frames: Frame[], final: { chains?: number[][]; slots?: (number | null)[] }) => {
    setAnimating(true)
    frames.forEach((f, i) => {
      timers.current.push(
        setTimeout(() => {
          setFrame(f)
          if (i === frames.length - 1) {
            if (final.chains) setChains(final.chains)
            if (final.slots) setSlots(final.slots)
            setAnimating(false)
          }
        }, i * 1000),
      )
    })
  }

  const inserer = () => {
    const k = nextVal
    setNextVal(3 + Math.floor(Math.random() * 97))
    const h = k % M
    const frames: Frame[] = []

    if (mode === 'chainage') {
      const next = chains.map((c) => [...c])
      frames.push({ chains, slots, focusSlot: h, note: `h(${k}) = ${k} mod ${M} = ${h}.` })
      if (next[h].length > 0) {
        frames.push({
          chains,
          slots,
          focusSlot: h,
          note: `Collision ! La case ${h} contient déjà ${next[h].join(', ')} — on ajoute ${k} en tête de la chaîne (O(1)).`,
        })
      }
      next[h] = [k, ...next[h]]
      frames.push({ chains: next, slots, focusSlot: h, note: `${k} est inséré dans la chaîne de la case ${h}.` })
      play(frames, { chains: next })
    } else {
      if (count >= M) {
        setFrame({ chains, slots, note: `Table pleine (α = 1) : en adressage ouvert, il faut redimensionner avant d'insérer.` })
        return
      }
      const next = [...slots]
      let i = h
      let probes = 0
      frames.push({ chains, slots, focusSlot: i, note: `h(${k}) = ${k} mod ${M} = ${h}.` })
      while (next[i] !== null) {
        const old = i
        i = (i + 1) % M
        probes++
        frames.push({
          chains,
          slots,
          focusSlot: i,
          note: `Collision : la case ${old} est occupée par ${next[old]} — sondage linéaire, on essaie la case ${i}.`,
        })
      }
      next[i] = k
      frames.push({
        chains,
        slots: next,
        focusSlot: i,
        note: `${k} est inséré en case ${i}${probes > 0 ? ` après ${probes} sondage(s)` : ' du premier coup'}.`,
      })
      play(frames, { slots: next })
    }
  }

  const reset = (m: Mode) => {
    timers.current.forEach(clearTimeout)
    setMode(m)
    setChains(Array.from({ length: M }, () => []))
    setSlots(Array(M).fill(null))
    setFrame(null)
    setAnimating(false)
  }

  const shownChains = frame?.chains ?? chains
  const shownSlots = frame?.slots ?? slots
  const focus = frame?.focusSlot

  return (
    <figure className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
      <figcaption className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
        Collisions : chaînage vs adressage ouvert (m = {M}, h(k) = k mod {M})
      </figcaption>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="flex overflow-hidden rounded-lg border border-slate-200 text-sm dark:border-slate-700">
          {(['chainage', 'lineaire'] as const).map((m) => (
            <button
              key={m}
              onClick={() => reset(m)}
              className={`px-3 py-1.5 ${
                mode === m
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              {m === 'chainage' ? 'chaînage' : 'sondage linéaire'}
            </button>
          ))}
        </div>
        <button className="viz-btn" disabled={animating} onClick={inserer}>
          inserer({nextVal})
        </button>
        <button className="viz-btn" disabled={animating} onClick={() => reset(mode)}>
          ↺ Vider
        </button>
        <span className="ml-auto text-xs text-slate-500 dark:text-slate-400">
          α = {count}/{M} = {alpha.toFixed(2)}
        </span>
      </div>

      <div className="space-y-1.5">
        {Array.from({ length: M }, (_, i) => (
          <div key={i} className="flex items-center gap-2">
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border font-mono text-xs ${
                focus === i
                  ? 'border-indigo-500 bg-indigo-100 font-bold dark:bg-indigo-950'
                  : 'border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400'
              }`}
            >
              {i}
            </span>
            {mode === 'chainage' ? (
              <div className="flex flex-wrap items-center gap-1">
                {shownChains[i].length === 0 && <span className="text-xs text-slate-300 dark:text-slate-600">∅</span>}
                {shownChains[i].map((v, j) => (
                  <span key={j} className="flex items-center gap-1">
                    <span className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 font-mono text-sm dark:border-slate-600 dark:bg-slate-800">
                      {v}
                    </span>
                    {j < shownChains[i].length - 1 && <span className="text-slate-300 dark:text-slate-600">→</span>}
                  </span>
                ))}
              </div>
            ) : (
              <span
                className={`flex h-9 w-16 items-center justify-center rounded-lg border font-mono text-sm ${
                  shownSlots[i] !== null
                    ? 'border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-800'
                    : 'border-dashed border-slate-200 text-slate-300 dark:border-slate-700 dark:text-slate-600'
                }`}
              >
                {shownSlots[i] ?? '·'}
              </span>
            )}
          </div>
        ))}
      </div>

      <p className="mt-3 min-h-10 text-sm text-slate-600 dark:text-slate-300">
        {frame?.note ??
          'Insère des valeurs et observe : le chaînage allonge les listes, le sondage linéaire crée des paquets de cases occupées (regroupement primaire).'}
      </p>
    </figure>
  )
}
