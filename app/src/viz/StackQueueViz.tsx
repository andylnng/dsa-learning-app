import { useState } from 'react'

/** Pile et file côte à côte, manipulables directement. */
export default function StackQueueViz() {
  const [stack, setStack] = useState<number[]>([3, 7])
  const [queue, setQueue] = useState<number[]>([3, 7])
  const [nextVal, setNextVal] = useState(12)
  const [lastOp, setLastOp] = useState('Essaie les opérations : la pile et la file reçoivent les mêmes valeurs, mais ne les rendent pas dans le même ordre.')

  const bump = () => {
    const v = nextVal
    setNextVal((n) => (n + 5) % 100 || 5)
    return v
  }

  const cellCls =
    'flex h-10 w-16 items-center justify-center rounded-lg border font-mono text-sm transition-all'

  return (
    <figure className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
      <figcaption className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
        Pile (LIFO) et file (FIFO) en action
      </figcaption>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Pile */}
        <div>
          <h4 className="mb-2 text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
            Pile — le sommet en haut
          </h4>
          <div className="flex min-h-56 flex-col items-center justify-end gap-1.5 rounded-xl bg-slate-50 p-3 dark:bg-slate-900">
            {stack.length === 0 && <span className="text-xs text-slate-400">pile vide</span>}
            {[...stack].reverse().map((v, i) => (
              <div
                key={stack.length - i}
                className={`${cellCls} ${
                  i === 0
                    ? 'border-indigo-400 bg-indigo-50 text-indigo-900 dark:border-indigo-500 dark:bg-indigo-950 dark:text-indigo-200'
                    : 'border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {v}
              </div>
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            <button
              className="viz-btn"
              onClick={() => {
                const v = bump()
                setStack((s) => [...s, v])
                setLastOp(`push(${v}) : ${v} devient le nouveau sommet.`)
              }}
            >
              push
            </button>
            <button
              className="viz-btn"
              disabled={stack.length === 0}
              onClick={() => {
                const v = stack[stack.length - 1]
                setStack((s) => s.slice(0, -1))
                setLastOp(`pop() → ${v} : le dernier entré sort en premier (LIFO).`)
              }}
            >
              pop
            </button>
          </div>
        </div>

        {/* File */}
        <div>
          <h4 className="mb-2 text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
            File — la tête à gauche
          </h4>
          <div className="flex min-h-56 items-center rounded-xl bg-slate-50 p-3 dark:bg-slate-900">
            <div className="flex flex-wrap items-center gap-1.5">
              {queue.length === 0 && <span className="text-xs text-slate-400">file vide</span>}
              {queue.map((v, i) => (
                <div
                  key={i}
                  className={`${cellCls} ${
                    i === 0
                      ? 'border-emerald-400 bg-emerald-50 text-emerald-900 dark:border-emerald-600 dark:bg-emerald-950 dark:text-emerald-200'
                      : 'border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {v}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-2 flex gap-2">
            <button
              className="viz-btn"
              onClick={() => {
                const v = bump()
                setQueue((q) => [...q, v])
                setLastOp(`enqueue(${v}) : ${v} entre en queue, à droite.`)
              }}
            >
              enqueue
            </button>
            <button
              className="viz-btn"
              disabled={queue.length === 0}
              onClick={() => {
                const v = queue[0]
                setQueue((q) => q.slice(1))
                setLastOp(`dequeue() → ${v} : le premier entré sort en premier (FIFO).`)
              }}
            >
              dequeue
            </button>
          </div>
        </div>
      </div>

      <p className="mt-3 min-h-10 text-sm text-slate-600 dark:text-slate-300">{lastOp}</p>
    </figure>
  )
}
