import { useEffect, useRef, useState } from 'react'

interface BNode {
  cle: number
  gauche: BNode | null
  droit: BNode | null
}

interface Placed {
  cle: number
  x: number
  y: number
  parent?: { x: number; y: number }
}

interface Frame {
  snapshot: Placed[]
  /** clé mise en évidence */
  focus?: number
  /** la clé focus est-elle « trouvée » (vert) ou simplement visitée (indigo) */
  found?: boolean
  note: string
}

const W = 640
const H = 300

function clone(n: BNode | null): BNode | null {
  if (!n) return null
  return { cle: n.cle, gauche: clone(n.gauche), droit: clone(n.droit) }
}

function layout(root: BNode | null): Placed[] {
  const placed: Placed[] = []
  let cursor = 0
  let maxDepth = 1
  const items: { n: BNode; depth: number; order: number; parent?: BNode }[] = []
  function walk(n: BNode | null, depth: number, parent?: BNode) {
    if (!n) return
    maxDepth = Math.max(maxDepth, depth)
    walk(n.gauche, depth + 1, n)
    items.push({ n, depth, order: cursor++, parent })
    walk(n.droit, depth + 1, n)
  }
  walk(root, 0)
  const count = Math.max(cursor, 1)
  const coord = new Map<BNode, { x: number; y: number }>()
  for (const it of items) {
    coord.set(it.n, {
      x: 30 + ((it.order + 0.5) / count) * (W - 60),
      y: 32 + (it.depth / Math.max(maxDepth, 1)) * (H - 70),
    })
  }
  for (const it of items) {
    const c = coord.get(it.n)!
    placed.push({ cle: it.n.cle, x: c.x, y: c.y, parent: it.parent ? coord.get(it.parent) : undefined })
  }
  return placed
}

function makeFrames(root: BNode | null, op: 'inserer' | 'chercher' | 'supprimer', cle: number): { frames: Frame[]; newRoot: BNode | null } {
  const frames: Frame[] = []
  let tree = clone(root)

  const snap = (focus?: number, note = '', found = false) =>
    frames.push({ snapshot: layout(tree), focus, found, note })

  // descente commune
  const path: number[] = []
  let cur = tree
  let parent: BNode | null = null
  while (cur && cur.cle !== cle) {
    path.push(cur.cle)
    snap(cur.cle, `${cle} ${cle < cur.cle ? '<' : '>'} ${cur.cle} : on descend à ${cle < cur.cle ? 'gauche' : 'droite'}.`)
    parent = cur
    cur = cle < cur.cle ? cur.gauche : cur.droit
  }

  if (op === 'chercher') {
    if (cur) snap(cur.cle, `${cle} trouvé après ${path.length + 1} comparaison(s).`, true)
    else snap(undefined, `${cle} est absent : la recherche atteint un null après ${path.length} comparaison(s).`)
    return { frames, newRoot: root }
  }

  if (op === 'inserer') {
    if (cur) {
      snap(cur.cle, `${cle} est déjà dans l'arbre : rien à faire.`, true)
      return { frames, newRoot: root }
    }
    const neuf: BNode = { cle, gauche: null, droit: null }
    if (!parent) tree = neuf
    else if (cle < parent.cle) parent.gauche = neuf
    else parent.droit = neuf
    snap(cle, `On accroche ${cle} comme nouvelle feuille${parent ? ` sous ${parent.cle}` : ' (racine)'}.`, true)
    return { frames, newRoot: tree }
  }

  // suppression
  if (!cur) {
    snap(undefined, `${cle} est absent : rien à supprimer.`)
    return { frames, newRoot: root }
  }
  snap(cur.cle, `${cle} trouvé : on identifie le cas de suppression.`, true)

  function supprimer(n: BNode | null, k: number): BNode | null {
    if (!n) return null
    if (k < n.cle) {
      n.gauche = supprimer(n.gauche, k)
      return n
    }
    if (k > n.cle) {
      n.droit = supprimer(n.droit, k)
      return n
    }
    if (!n.gauche && !n.droit) return null
    if (!n.gauche) return n.droit
    if (!n.droit) return n.gauche
    let succ = n.droit
    while (succ.gauche) succ = succ.gauche
    n.cle = succ.cle
    n.droit = supprimer(n.droit, succ.cle)
    return n
  }

  const hasTwo = cur.gauche && cur.droit
  let succCle: number | undefined
  if (hasTwo) {
    let s = cur.droit!
    while (s.gauche) s = s.gauche
    succCle = s.cle
  }
  tree = supprimer(tree, cle)
  if (hasTwo) {
    snap(
      succCle,
      `Deux enfants : ${cle} est remplacé par son successeur ${succCle} (le min du sous-arbre droit), qui est ensuite détaché.`,
      true,
    )
  } else {
    snap(undefined, `${cle} avait ${cur.gauche || cur.droit ? 'un seul enfant : il remonte à sa place' : 'aucun enfant : on le détache simplement'}.`)
  }
  return { frames, newRoot: tree }
}

function buildFrom(keys: number[]): BNode | null {
  let root: BNode | null = null
  for (const k of keys) {
    const ins = (n: BNode | null): BNode => {
      if (!n) return { cle: k, gauche: null, droit: null }
      if (k < n.cle) n.gauche = ins(n.gauche)
      else if (k > n.cle) n.droit = ins(n.droit)
      return n
    }
    root = ins(root)
  }
  return root
}

const INITIAL = [50, 30, 70, 20, 40, 60, 80]

export default function BSTViz() {
  const [root, setRoot] = useState<BNode | null>(() => buildFrom(INITIAL))
  const [value, setValue] = useState(55)
  const [frame, setFrame] = useState<Frame | null>(null)
  const [animating, setAnimating] = useState(false)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const run = (op: 'inserer' | 'chercher' | 'supprimer') => {
    const { frames, newRoot } = makeFrames(root, op, value)
    setAnimating(true)
    frames.forEach((f, i) => {
      timers.current.push(
        setTimeout(() => {
          setFrame(f)
          if (i === frames.length - 1) {
            setRoot(newRoot)
            setAnimating(false)
          }
        }, i * 900),
      )
    })
  }

  const shown = frame?.snapshot ?? layout(root)

  return (
    <figure className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
      <figcaption className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
        Arbre binaire de recherche interactif
      </figcaption>

      <div className="mb-2 flex flex-wrap items-center gap-2">
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="w-20 rounded-lg border border-slate-200 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-900"
          aria-label="Valeur"
        />
        <button className="viz-btn" disabled={animating} onClick={() => run('chercher')}>
          chercher
        </button>
        <button className="viz-btn" disabled={animating} onClick={() => run('inserer')}>
          inserer
        </button>
        <button className="viz-btn" disabled={animating} onClick={() => run('supprimer')}>
          supprimer
        </button>
        <button
          className="viz-btn"
          disabled={animating}
          onClick={() => {
            setRoot(buildFrom(INITIAL))
            setFrame(null)
          }}
        >
          ↺ Réinitialiser
        </button>
        <button
          className="viz-btn"
          disabled={animating}
          onClick={() => {
            setRoot(buildFrom([10, 20, 30, 40, 50, 60]))
            setFrame(null)
          }}
        >
          ⚠ Arbre dégénéré
        </button>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Arbre binaire de recherche">
        {shown.map(
          (p) =>
            p.parent && (
              <line
                key={`e${p.cle}`}
                x1={p.parent.x}
                y1={p.parent.y}
                x2={p.x}
                y2={p.y}
                strokeWidth={1.5}
                className="stroke-slate-300 dark:stroke-slate-700"
              />
            ),
        )}
        {shown.map((p) => {
          const isFocus = frame?.focus === p.cle
          return (
            <g key={p.cle}>
              <circle
                cx={p.x}
                cy={p.y}
                r={17}
                strokeWidth={2}
                className={
                  isFocus
                    ? frame?.found
                      ? 'fill-emerald-500 stroke-emerald-600'
                      : 'fill-indigo-500 stroke-indigo-600'
                    : 'fill-white stroke-slate-400 dark:fill-slate-900 dark:stroke-slate-500'
                }
                style={{ transition: 'cx 250ms, cy 250ms' }}
              />
              <text
                x={p.x}
                y={p.y + 4}
                textAnchor="middle"
                className={`text-[12px] font-semibold ${isFocus ? 'fill-white' : 'fill-slate-700 dark:fill-slate-200'}`}
                style={{ transition: 'x 250ms, y 250ms' }}
              >
                {p.cle}
              </text>
            </g>
          )
        })}
        {shown.length === 0 && (
          <text x={W / 2} y={H / 2} textAnchor="middle" className="fill-slate-400 text-sm">
            arbre vide
          </text>
        )}
      </svg>

      <p className="mt-2 min-h-10 text-sm text-slate-600 dark:text-slate-300">
        {frame?.note ??
          'Choisis une valeur puis chercher, inserer ou supprimer. Essaie aussi « Arbre dégénéré » pour voir un ABR devenu liste (hauteur n).'}
      </p>
    </figure>
  )
}
