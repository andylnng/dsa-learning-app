import { useMemo, useState } from 'react'

// Palette catégorielle validée (CVD-safe, ordre fixe) — light / dark
const SERIES = [
  { key: 'logn', label: 'log n', fn: (n: number) => Math.log2(Math.max(n, 1)), light: '#2a78d6', dark: '#3987e5' },
  { key: 'n', label: 'n', fn: (n: number) => n, light: '#1baf7a', dark: '#199e70' },
  {
    key: 'nlogn',
    label: 'n log n',
    fn: (n: number) => n * Math.log2(Math.max(n, 1)),
    light: '#eda100',
    dark: '#c98500',
  },
  { key: 'n2', label: 'n²', fn: (n: number) => n * n, light: '#008300', dark: '#008300' },
  { key: '2n', label: '2ⁿ', fn: (n: number) => Math.pow(2, n), light: '#4a3aa7', dark: '#9085e9' },
] as const

type SeriesKey = (typeof SERIES)[number]['key']

const W = 640
const H = 360
const PAD = { top: 16, right: 64, bottom: 36, left: 48 }
const N_MAX = 40
const Y_MAX = 200

export default function GrowthViz() {
  const [active, setActive] = useState<Record<SeriesKey, boolean>>({
    logn: true,
    n: true,
    nlogn: true,
    n2: true,
    '2n': true,
  })
  const [hoverN, setHoverN] = useState<number | null>(null)

  const x = (n: number) => PAD.left + (n / N_MAX) * (W - PAD.left - PAD.right)
  const y = (v: number) => PAD.top + (1 - Math.min(v, Y_MAX) / Y_MAX) * (H - PAD.top - PAD.bottom)

  const paths = useMemo(
    () =>
      SERIES.map((s) => {
        const pts: string[] = []
        let clippedAt: number | null = null
        for (let n = 1; n <= N_MAX; n += 0.5) {
          const v = s.fn(n)
          if (v > Y_MAX) {
            clippedAt = n
            pts.push(`${x(n).toFixed(1)},${y(Y_MAX).toFixed(1)}`)
            break
          }
          pts.push(`${x(n).toFixed(1)},${y(v).toFixed(1)}`)
        }
        const last = pts[pts.length - 1].split(',').map(Number)
        return { ...s, d: 'M' + pts.join(' L'), labelX: last[0], labelY: last[1], clippedAt }
      }),
    [],
  )

  return (
    <figure className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
      <figcaption className="mb-2 text-sm font-semibold text-slate-900 dark:text-white">
        Comparaison des taux de croissance
      </figcaption>

      <div className="mb-3 flex flex-wrap gap-2">
        {SERIES.map((s) => (
          <label
            key={s.key}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 px-2 py-1 text-xs select-none dark:border-slate-700"
          >
            <input
              type="checkbox"
              checked={active[s.key]}
              onChange={() => setActive((a) => ({ ...a, [s.key]: !a[s.key] }))}
              className="accent-indigo-600"
            />
            <span className="h-2 w-2 rounded-full" style={{ background: `light-dark(${s.light}, ${s.dark})` }} />
            {s.label}
          </label>
        ))}
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label="Courbes de croissance de log n, n, n log n, n carré et 2 puissance n"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect()
          const px = ((e.clientX - rect.left) / rect.width) * W
          const n = Math.round(((px - PAD.left) / (W - PAD.left - PAD.right)) * N_MAX)
          setHoverN(n >= 1 && n <= N_MAX ? n : null)
        }}
        onMouseLeave={() => setHoverN(null)}
      >
        {/* grille */}
        {[0, 50, 100, 150, 200].map((v) => (
          <g key={v}>
            <line
              x1={PAD.left}
              x2={W - PAD.right}
              y1={y(v)}
              y2={y(v)}
              className="stroke-slate-200 dark:stroke-slate-800"
              strokeWidth={1}
            />
            <text
              x={PAD.left - 8}
              y={y(v) + 4}
              textAnchor="end"
              className="fill-slate-400 text-[11px] dark:fill-slate-500"
            >
              {v}
            </text>
          </g>
        ))}
        {[0, 10, 20, 30, 40].map((n) => (
          <text
            key={n}
            x={x(n)}
            y={H - PAD.bottom + 18}
            textAnchor="middle"
            className="fill-slate-400 text-[11px] dark:fill-slate-500"
          >
            {n}
          </text>
        ))}
        <text
          x={(PAD.left + W - PAD.right) / 2}
          y={H - 4}
          textAnchor="middle"
          className="fill-slate-500 text-[11px] dark:fill-slate-400"
        >
          n (taille de l'entrée)
        </text>

        {/* courbes + étiquettes directes */}
        {paths.map(
          (s) =>
            active[s.key] && (
              <g key={s.key}>
                <path
                  d={s.d}
                  fill="none"
                  strokeWidth={2}
                  strokeLinecap="round"
                  style={{ stroke: `light-dark(${s.light}, ${s.dark})` }}
                />
                <text
                  x={s.labelX + 6}
                  y={s.labelY + 4}
                  className="text-[12px] font-medium"
                  style={{ fill: `light-dark(${s.light}, ${s.dark})` }}
                >
                  {s.label}
                </text>
              </g>
            ),
        )}

        {/* survol : ligne verticale + valeurs */}
        {hoverN !== null && (
          <g>
            <line
              x1={x(hoverN)}
              x2={x(hoverN)}
              y1={PAD.top}
              y2={H - PAD.bottom}
              className="stroke-slate-300 dark:stroke-slate-600"
              strokeWidth={1}
              strokeDasharray="3 3"
            />
            {SERIES.filter((s) => active[s.key]).map((s) => {
              const v = s.fn(hoverN)
              if (v > Y_MAX) return null
              return (
                <circle
                  key={s.key}
                  cx={x(hoverN)}
                  cy={y(v)}
                  r={4}
                  style={{ fill: `light-dark(${s.light}, ${s.dark})` }}
                  className="stroke-white stroke-2 dark:stroke-slate-950"
                />
              )
            })}
          </g>
        )}
      </svg>

      {hoverN !== null ? (
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-300">
          <span className="font-semibold">n = {hoverN} :</span>
          {SERIES.filter((s) => active[s.key]).map((s) => (
            <span key={s.key}>
              {s.label} ≈ {formatValue(s.fn(hoverN))}
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
          Survole le graphique pour comparer les valeurs. Les courbes qui dépassent 200 opérations sont coupées — c'est
          exactement le point : n² et 2ⁿ explosent très vite.
        </p>
      )}
    </figure>
  )
}

function formatValue(v: number): string {
  if (v >= 1e9) return v.toExponential(1).replace('e+', ' × 10^')
  if (v >= 1000) return Math.round(v).toLocaleString('fr-CA')
  return (Math.round(v * 10) / 10).toString()
}
