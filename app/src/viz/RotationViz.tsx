import { useState } from 'react'

/**
 * Rotation gauche/droite sur le motif canonique :
 *   droite :  y(x(A,B),C)  ⇄  x(A,y(B,C))  : gauche
 */
const W = 640
const H = 280

interface Spot {
  x: number
  y: number
}

// positions des 5 éléments dans chaque configuration
const CONFIG = {
  // x est racine : x(A, y(B, C))
  xRoot: {
    x: { x: 280, y: 50 },
    y: { x: 400, y: 120 },
    A: { x: 160, y: 200 },
    B: { x: 330, y: 200 },
    C: { x: 470, y: 200 },
    edges: [
      ['x', 'A'],
      ['x', 'y'],
      ['y', 'B'],
      ['y', 'C'],
    ] as const,
  },
  // y est racine : y(x(A, B), C)
  yRoot: {
    y: { x: 360, y: 50 },
    x: { x: 240, y: 120 },
    A: { x: 170, y: 200 },
    B: { x: 310, y: 200 },
    C: { x: 480, y: 200 },
    edges: [
      ['y', 'x'],
      ['y', 'C'],
      ['x', 'A'],
      ['x', 'B'],
    ] as const,
  },
}

export default function RotationViz() {
  const [state, setState] = useState<'xRoot' | 'yRoot'>('yRoot')
  const [note, setNote] = useState(
    "Configuration y(x(A, B), C). Fais une rotation et observe : seul B change de parent, et l'ordre en ordre A, x, B, y, C ne bouge jamais.",
  )
  const cfg = CONFIG[state]
  const spots = cfg as unknown as Record<string, Spot>

  const rotate = () => {
    if (state === 'yRoot') {
      setState('xRoot')
      setNote(
        'Rotation droite autour de y : x remonte, y descend à sa droite, et B (les clés entre x et y) passe de « droite de x » à « gauche de y ».',
      )
    } else {
      setState('yRoot')
      setNote(
        'Rotation gauche autour de x : y remonte, x descend à sa gauche, et B repasse de « gauche de y » à « droite de x ».',
      )
    }
  }

  const nodeKeys = ['x', 'y'] as const
  const triKeys = ['A', 'B', 'C'] as const

  return (
    <figure className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
      <figcaption className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
        La rotation : une réorganisation locale qui préserve l'ordre
      </figcaption>

      <div className="mb-2 flex gap-2">
        <button className="viz-btn" onClick={rotate}>
          {state === 'yRoot' ? '⟳ Rotation droite (autour de y)' : '⟲ Rotation gauche (autour de x)'}
        </button>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Rotation d'arbre binaire">
        {cfg.edges.map(([from, to]) => (
          <line
            key={`${from}-${to}`}
            x1={spots[from].x}
            y1={spots[from].y}
            x2={spots[to].x}
            y2={spots[to].y}
            strokeWidth={1.5}
            className="stroke-slate-300 transition-all duration-500 dark:stroke-slate-700"
          />
        ))}

        {triKeys.map((k) => {
          const p = spots[k]
          const isB = k === 'B'
          return (
            <g key={k} className="transition-all duration-500" style={{ transform: `translate(${p.x}px, ${p.y}px)` }}>
              <polygon
                points="0,-16 -26,26 26,26"
                strokeWidth={2}
                className={
                  isB
                    ? 'fill-amber-100 stroke-amber-500 dark:fill-amber-950 dark:stroke-amber-600'
                    : 'fill-slate-100 stroke-slate-400 dark:fill-slate-800 dark:stroke-slate-500'
                }
              />
              <text y={16} textAnchor="middle" className="fill-slate-600 text-[13px] font-semibold dark:fill-slate-300">
                {k}
              </text>
            </g>
          )
        })}

        {nodeKeys.map((k) => {
          const p = spots[k]
          return (
            <g key={k} className="transition-all duration-500" style={{ transform: `translate(${p.x}px, ${p.y}px)` }}>
              <circle r={18} strokeWidth={2} className="fill-indigo-500 stroke-indigo-600" />
              <text y={5} textAnchor="middle" className="fill-white text-[14px] font-bold">
                {k}
              </text>
            </g>
          )
        })}

        <text x={20} y={H - 12} className="fill-slate-400 text-[12px] dark:fill-slate-500">
          parcours en ordre, avant comme après : A, x, B, y, C — clés de B ∈ (x, y)
        </text>
      </svg>

      <p className="mt-2 min-h-10 text-sm text-slate-600 dark:text-slate-300">{note}</p>
    </figure>
  )
}
