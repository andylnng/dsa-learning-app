import { useMemo, useState } from 'react'
import { StepControls, StepNote, useStepPlayer } from './StepPlayer'

interface RBNode {
  cle: number
  rouge: boolean
  gauche: RBNode | null
  droit: RBNode | null
  parent: RBNode | null
}

interface Placed {
  cle: number
  rouge: boolean
  x: number
  y: number
  parent?: { x: number; y: number }
}

interface Step {
  snapshot: Placed[]
  focus?: number
  note: string
}

const W = 640
const H = 300

function layout(root: RBNode | null): Placed[] {
  const placed: Placed[] = []
  let cursor = 0
  let maxDepth = 1
  const items: { n: RBNode; depth: number; order: number }[] = []
  function walk(n: RBNode | null, depth: number) {
    if (!n) return
    maxDepth = Math.max(maxDepth, depth)
    walk(n.gauche, depth + 1)
    items.push({ n, depth, order: cursor++ })
    walk(n.droit, depth + 1)
  }
  walk(root, 0)
  const count = Math.max(cursor, 1)
  const coord = new Map<RBNode, { x: number; y: number }>()
  for (const it of items) {
    coord.set(it.n, {
      x: 30 + ((it.order + 0.5) / count) * (W - 60),
      y: 32 + (it.depth / Math.max(maxDepth, 1)) * (H - 70),
    })
  }
  for (const it of items) {
    const c = coord.get(it.n)!
    placed.push({
      cle: it.n.cle,
      rouge: it.n.rouge,
      x: c.x,
      y: c.y,
      parent: it.n.parent ? coord.get(it.n.parent) : undefined,
    })
  }
  return placed
}

function computeSteps(keys: number[]): Step[] {
  const steps: Step[] = []
  let root: RBNode | null = null

  const snap = (focus: number | undefined, note: string) => steps.push({ snapshot: layout(root), focus, note })

  function rotationGauche(x: RBNode) {
    const y = x.droit!
    x.droit = y.gauche
    if (y.gauche) y.gauche.parent = x
    y.parent = x.parent
    if (!x.parent) root = y
    else if (x === x.parent.gauche) x.parent.gauche = y
    else x.parent.droit = y
    y.gauche = x
    x.parent = y
  }

  function rotationDroite(y: RBNode) {
    const x = y.gauche!
    y.gauche = x.droit
    if (x.droit) x.droit.parent = y
    x.parent = y.parent
    if (!y.parent) root = x
    else if (y === y.parent.gauche) y.parent.gauche = x
    else y.parent.droit = x
    x.droit = y
    y.parent = x
  }

  function inserer(cle: number) {
    let parent: RBNode | null = null
    let cur = root
    while (cur) {
      parent = cur
      cur = cle < cur.cle ? cur.gauche : cur.droit
    }
    const z: RBNode = { cle, rouge: true, gauche: null, droit: null, parent }
    if (!parent) root = z
    else if (cle < parent.cle) parent.gauche = z
    else parent.droit = z

    snap(cle, `Insertion ABR ordinaire de ${cle}, coloré ROUGE (la hauteur noire est préservée).`)

    let node = z
    while (node.parent && node.parent.rouge) {
      const p = node.parent
      const g = p.parent!
      const oncle = p === g.gauche ? g.droit : g.gauche
      if (oncle && oncle.rouge) {
        p.rouge = false
        oncle.rouge = false
        g.rouge = true
        snap(
          g.cle,
          `Violation « deux rouges » sur ${node.cle}–${p.cle}. Cas 1 (oncle ${oncle.cle} rouge) : recoloration — parent et oncle en noir, grand-parent ${g.cle} en rouge. On remonte.`,
        )
        node = g
      } else {
        const parentEstGauche = p === g.gauche
        const nodeEstInterieur = parentEstGauche ? node === p.droit : node === p.gauche
        if (nodeEstInterieur) {
          snap(
            node.cle,
            `Violation sur ${node.cle}–${p.cle}, oncle noir, configuration zig-zag. Cas 2 : rotation ${parentEstGauche ? 'gauche' : 'droite'} autour du parent ${p.cle}.`,
          )
          node = p
          if (parentEstGauche) rotationGauche(node)
          else rotationDroite(node)
          snap(node.cle, `Le zig-zag est devenu une ligne droite : on retombe sur le cas 3.`)
        }
        const p2 = node.parent!
        const g2 = p2.parent!
        p2.rouge = false
        g2.rouge = true
        if (p2 === g2.gauche) rotationDroite(g2)
        else rotationGauche(g2)
        snap(
          p2.cle,
          `Cas 3 (ligne droite, oncle noir) : rotation autour du grand-parent ${g2.cle} + échange des couleurs. ${p2.cle} devient la racine noire du sous-arbre — violation réparée.`,
        )
        break
      }
    }
    if (root && root.rouge) {
      root.rouge = false
      snap(root.cle, `La racine ${root.cle} est reforcée en NOIR (propriété 2).`)
    }
  }

  for (const k of keys) inserer(k)
  snap(undefined, `Terminé : ${keys.length} insertions, l'arbre respecte les 5 propriétés rouge-noir (hauteur O(log n) garantie).`)
  return steps
}

const SEQUENCE = [10, 20, 30, 15, 25, 5, 1]

function randomSequence(): number[] {
  const pool = Array.from({ length: 50 }, (_, i) => i + 1)
  const out: number[] = []
  for (let i = 0; i < 7; i++) {
    out.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0])
  }
  return out
}

export default function RBInsertViz() {
  const [keys, setKeys] = useState<number[]>(SEQUENCE)
  const steps = useMemo(() => computeSteps(keys), [keys])
  const player = useStepPlayer(steps.length)
  const step = steps[Math.min(player.index, steps.length - 1)]

  return (
    <figure className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
      <figcaption className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
        Insertion rouge-noir pas à pas : {keys.join(', ')}
      </figcaption>

      <div className="mb-2">
        <button
          className="viz-btn"
          onClick={() => {
            setKeys(randomSequence())
            player.reset()
          }}
        >
          🎲 Nouvelle séquence
        </button>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Arbre rouge-noir en construction">
        {step.snapshot.map(
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
        {step.snapshot.map((p) => {
          const isFocus = step.focus === p.cle
          return (
            <g key={p.cle}>
              <circle
                cx={p.x}
                cy={p.y}
                r={17}
                strokeWidth={isFocus ? 3.5 : 2}
                className={
                  p.rouge
                    ? `fill-red-500 ${isFocus ? 'stroke-indigo-500' : 'stroke-red-600'}`
                    : `fill-slate-800 dark:fill-slate-950 ${isFocus ? 'stroke-indigo-500' : 'stroke-slate-900 dark:stroke-slate-600'}`
                }
                style={{ transition: 'cx 250ms, cy 250ms' }}
              />
              <text
                x={p.x}
                y={p.y + 4}
                textAnchor="middle"
                className="fill-white text-[12px] font-semibold"
                style={{ transition: 'x 250ms, y 250ms' }}
              >
                {p.cle}
              </text>
            </g>
          )
        })}
        {step.snapshot.length === 0 && (
          <text x={W / 2} y={H / 2} textAnchor="middle" className="fill-slate-400 text-sm">
            arbre vide — lance la lecture
          </text>
        )}
      </svg>

      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500" /> nœud rouge
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-800 dark:bg-slate-950 dark:ring-1 dark:ring-slate-600" />{' '}
          nœud noir
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full ring-2 ring-indigo-500" /> nœud concerné par l'étape
        </span>
      </div>

      <StepNote index={player.index} count={steps.length} note={step.note} />
      <StepControls player={player} stepCount={steps.length} />
    </figure>
  )
}
