import { useMemo, useState } from 'react'
import { StepControls, StepNote, useStepPlayer } from './StepPlayer'

interface Step {
  /** colonnes[ligne] = colonne de la reine, -1 si vide */
  queens: number[]
  /** case en cours d'essai */
  trying?: [number, number]
  /** l'essai est-il rejeté ? */
  rejected?: boolean
  backtrack?: boolean
  note: string
}

function computeSteps(n: number): Step[] {
  const steps: Step[] = []
  const queens = new Array(n).fill(-1)

  function estValide(ligne: number, col: number): boolean {
    for (let i = 0; i < ligne; i++) {
      if (queens[i] === col || Math.abs(queens[i] - col) === ligne - i) return false
    }
    return true
  }

  function solve(ligne: number): boolean {
    if (ligne === n) return true
    for (let col = 0; col < n; col++) {
      const ok = estValide(ligne, col)
      steps.push({
        queens: [...queens],
        trying: [ligne, col],
        rejected: !ok,
        note: ok
          ? `Ligne ${ligne} : la colonne ${col} est compatible — on place la reine et on descend.`
          : `Ligne ${ligne}, colonne ${col} : conflit avec une reine déjà posée (colonne ou diagonale).`,
      })
      if (ok) {
        queens[ligne] = col
        if (solve(ligne + 1)) return true
        queens[ligne] = -1
        steps.push({
          queens: [...queens],
          trying: [ligne, col],
          backtrack: true,
          note: `Impasse plus bas : on retire la reine de (${ligne}, ${col}) — retour en arrière.`,
        })
      }
    }
    return false
  }

  solve(0)
  steps.push({ queens: [...queens], note: `Solution trouvée pour ${n} reines ! ✔` })
  return steps
}

export default function NQueensViz() {
  const [n, setN] = useState(6)
  const steps = useMemo(() => computeSteps(n), [n])
  const player = useStepPlayer(steps.length)
  const step = steps[Math.min(player.index, steps.length - 1)]
  const cell = 40

  return (
    <figure className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
      <figcaption className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
        Les {n} reines par retour en arrière
      </figcaption>

      <div className="mb-3 flex items-center gap-3 text-sm">
        <label className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
          n =
          <input
            type="range"
            min={4}
            max={7}
            value={n}
            onChange={(e) => {
              setN(Number(e.target.value))
              player.reset()
            }}
            className="accent-indigo-600"
          />
          <span className="w-4 font-mono">{n}</span>
        </label>
        <span className="ml-auto text-xs text-slate-500 dark:text-slate-400">{steps.length} étapes explorées</span>
      </div>

      <div className="flex justify-center">
        <svg
          viewBox={`0 0 ${n * cell} ${n * cell}`}
          className="w-full max-w-xs"
          role="img"
          aria-label={`Échiquier ${n} par ${n} du problème des ${n} reines`}
        >
          {Array.from({ length: n }, (_, ligne) =>
            Array.from({ length: n }, (_, col) => {
              const isTrying = step.trying && step.trying[0] === ligne && step.trying[1] === col
              const dark = (ligne + col) % 2 === 1
              return (
                <rect
                  key={`${ligne}-${col}`}
                  x={col * cell}
                  y={ligne * cell}
                  width={cell}
                  height={cell}
                  className={
                    isTrying
                      ? step.rejected
                        ? 'fill-red-300 dark:fill-red-900'
                        : step.backtrack
                          ? 'fill-amber-300 dark:fill-amber-800'
                          : 'fill-emerald-300 dark:fill-emerald-800'
                      : dark
                        ? 'fill-slate-300 dark:fill-slate-700'
                        : 'fill-slate-100 dark:fill-slate-900'
                  }
                />
              )
            }),
          )}
          {step.queens.map(
            (col, ligne) =>
              col >= 0 && (
                <text
                  key={ligne}
                  x={col * cell + cell / 2}
                  y={ligne * cell + cell / 2 + 9}
                  textAnchor="middle"
                  fontSize={26}
                >
                  ♛
                </text>
              ),
          )}
          {step.trying && step.queens[step.trying[0]] === -1 && (
            <text
              x={step.trying[1] * cell + cell / 2}
              y={step.trying[0] * cell + cell / 2 + 9}
              textAnchor="middle"
              fontSize={26}
              opacity={0.45}
            >
              ♛
            </text>
          )}
        </svg>
      </div>

      <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-emerald-300 dark:bg-emerald-800" /> essai accepté
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-red-300 dark:bg-red-900" /> essai rejeté (élagage)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-amber-300 dark:bg-amber-800" /> retour en arrière
        </span>
      </div>

      <StepNote index={player.index} count={steps.length} note={step.note} />
      <StepControls player={player} stepCount={steps.length} />
    </figure>
  )
}
