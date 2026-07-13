import { useMemo } from 'react'
import { StepControls, StepNote, useStepPlayer } from './StepPlayer'

interface Frame {
  label: string
  /** résultat affiché quand le cadre retourne */
  result?: number
}

interface Step {
  stack: Frame[]
  note: string
  phase: 'appel' | 'base' | 'retour' | 'fin'
}

const N = 5

function computeSteps(): Step[] {
  const steps: Step[] = []
  const stack: Frame[] = []

  function fact(n: number): number {
    stack.push({ label: `factorielle(${n})` })
    steps.push({
      stack: stack.map((f) => ({ ...f })),
      note:
        n <= 1
          ? `factorielle(${n}) : cas de base atteint — on retourne 1 sans rappel.`
          : `Appel de factorielle(${n}) : un nouveau cadre est empilé. Il attend le résultat de factorielle(${n - 1}).`,
      phase: n <= 1 ? 'base' : 'appel',
    })
    let r: number
    if (n <= 1) {
      r = 1
    } else {
      r = n * fact(n - 1)
    }
    stack[stack.length - 1].result = r
    steps.push({
      stack: stack.map((f) => ({ ...f })),
      note:
        n <= 1
          ? `factorielle(1) retourne 1 : son cadre est dépilé.`
          : `factorielle(${n}) reçoit ${r / n}, calcule ${n} × ${r / n} = ${r} et retourne : son cadre est dépilé.`,
      phase: 'retour',
    })
    stack.pop()
    return r
  }

  const total = fact(N)
  steps.push({ stack: [], note: `Pile vide : factorielle(${N}) = ${total}. ✔`, phase: 'fin' })
  return steps
}

export default function CallStackViz() {
  const steps = useMemo(computeSteps, [])
  const player = useStepPlayer(steps.length)
  const step = steps[player.index]

  return (
    <figure className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
      <figcaption className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
        La pile d'appels de factorielle({N}), pas à pas
      </figcaption>

      <div className="flex min-h-72 items-end justify-center rounded-xl bg-slate-50 p-4 dark:bg-slate-900">
        <div className="flex w-64 flex-col-reverse gap-1.5">
          {step.stack.map((frame, i) => {
            const isTop = i === step.stack.length - 1
            return (
              <div
                key={i}
                className={`rounded-lg border px-3 py-2 font-mono text-sm transition-all ${
                  isTop
                    ? frame.result !== undefined
                      ? 'border-emerald-400 bg-emerald-50 text-emerald-900 dark:border-emerald-600 dark:bg-emerald-950 dark:text-emerald-200'
                      : 'border-indigo-400 bg-indigo-50 text-indigo-900 dark:border-indigo-500 dark:bg-indigo-950 dark:text-indigo-200'
                    : 'border-slate-200 bg-white text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                {frame.label}
                {frame.result !== undefined && isTop && <span className="float-right">→ {frame.result}</span>}
              </div>
            )
          })}
          {step.stack.length === 0 && (
            <div className="rounded-lg border border-dashed border-slate-300 px-3 py-2 text-center text-sm text-slate-400 dark:border-slate-600">
              pile vide
            </div>
          )}
        </div>
      </div>
      <p className="mt-1 text-center text-xs text-slate-400 dark:text-slate-500">
        le sommet de la pile est en haut · profondeur max = {N} cadres = O(n) d'espace
      </p>

      <StepNote index={player.index} count={steps.length} note={step.note} />
      <StepControls player={player} stepCount={steps.length} />
    </figure>
  )
}
