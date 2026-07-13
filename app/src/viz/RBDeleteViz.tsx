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

class RBTree {
  root: RBNode | null = null
  steps: Step[] = []

  snap(focus: number | undefined, note: string) {
    this.steps.push({ snapshot: layout(this.root), focus, note })
  }

  private rotationGauche(x: RBNode) {
    const y = x.droit!
    x.droit = y.gauche
    if (y.gauche) y.gauche.parent = x
    y.parent = x.parent
    if (!x.parent) this.root = y
    else if (x === x.parent.gauche) x.parent.gauche = y
    else x.parent.droit = y
    y.gauche = x
    x.parent = y
  }

  private rotationDroite(y: RBNode) {
    const x = y.gauche!
    y.gauche = x.droit
    if (x.droit) x.droit.parent = y
    x.parent = y.parent
    if (!y.parent) this.root = x
    else if (y === y.parent.gauche) y.parent.gauche = x
    else y.parent.droit = x
    x.droit = y
    y.parent = x
  }

  /** insertion silencieuse (pour construire l'arbre initial) */
  inserer(cle: number) {
    let parent: RBNode | null = null
    let cur = this.root
    while (cur) {
      parent = cur
      cur = cle < cur.cle ? cur.gauche : cur.droit
    }
    const z: RBNode = { cle, rouge: true, gauche: null, droit: null, parent }
    if (!parent) this.root = z
    else if (cle < parent.cle) parent.gauche = z
    else parent.droit = z
    let node = z
    while (node.parent && node.parent.rouge) {
      const p = node.parent
      const g = p.parent!
      const oncle = p === g.gauche ? g.droit : g.gauche
      if (oncle && oncle.rouge) {
        p.rouge = false
        oncle.rouge = false
        g.rouge = true
        node = g
      } else {
        const parentEstGauche = p === g.gauche
        if (parentEstGauche ? node === p.droit : node === p.gauche) {
          node = p
          if (parentEstGauche) this.rotationGauche(node)
          else this.rotationDroite(node)
        }
        const p2 = node.parent!
        const g2 = p2.parent!
        p2.rouge = false
        g2.rouge = true
        if (p2 === g2.gauche) this.rotationDroite(g2)
        else this.rotationGauche(g2)
        break
      }
    }
    if (this.root) this.root.rouge = false
  }

  private minimum(n: RBNode): RBNode {
    while (n.gauche) n = n.gauche
    return n
  }

  private transplant(u: RBNode, v: RBNode | null) {
    if (!u.parent) this.root = v
    else if (u === u.parent.gauche) u.parent.gauche = v
    else u.parent.droit = v
    if (v) v.parent = u.parent
  }

  supprimer(cle: number) {
    let z = this.root
    while (z && z.cle !== cle) z = cle < z.cle ? z.gauche : z.droit
    if (!z) {
      this.snap(undefined, `${cle} est absent de l'arbre.`)
      return
    }
    this.snap(cle, `Suppression de ${cle} : suppression d'ABR ordinaire d'abord.`)

    let y = z
    let yEtaitRouge = y.rouge
    let x: RBNode | null
    let xParent: RBNode | null

    if (!z.gauche) {
      x = z.droit
      xParent = z.parent
      this.transplant(z, z.droit)
    } else if (!z.droit) {
      x = z.gauche
      xParent = z.parent
      this.transplant(z, z.gauche)
    } else {
      y = this.minimum(z.droit)
      yEtaitRouge = y.rouge
      x = y.droit
      if (y.parent === z) {
        xParent = y
      } else {
        xParent = y.parent
        this.transplant(y, y.droit)
        y.droit = z.droit
        y.droit.parent = y
      }
      this.transplant(z, y)
      y.gauche = z.gauche
      y.gauche.parent = y
      y.rouge = z.rouge
      this.snap(
        y.cle,
        `${cle} avait deux enfants : son successeur ${y.cle} prend sa place (et sa couleur). Le nœud physiquement retiré était ${yEtaitRouge ? 'ROUGE' : 'NOIR'}.`,
      )
    }

    if (yEtaitRouge) {
      this.snap(undefined, `Le nœud retiré était ROUGE : aucune propriété n'est violée, aucune réparation.`)
      return
    }

    this.snap(
      x?.cle ?? xParent?.cle,
      `Le nœud retiré était NOIR : les chemins passant par lui ont perdu un noir. ${
        x ? `${x.cle} porte un « double noir ».` : `Un NIL (feuille) porte le « double noir ».`
      }`,
    )

    // réparation du double noir
    while (x !== this.root && !(x && x.rouge)) {
      if (!xParent) break
      const estGauche = x === xParent.gauche
      let f = estGauche ? xParent.droit : xParent.gauche
      if (!f) break

      if (f.rouge) {
        f.rouge = false
        xParent.rouge = true
        this.snap(
          f.cle,
          `Cas 1 : le frère ${f.cle} est ROUGE — rotation autour du parent ${xParent.cle} + échange de couleurs. Le nouveau frère sera noir.`,
        )
        if (estGauche) this.rotationGauche(xParent)
        else this.rotationDroite(xParent)
        f = estGauche ? xParent.droit : xParent.gauche
        if (!f) break
      }

      const procheRouge = estGauche ? f.gauche?.rouge : f.droit?.rouge
      const lointainRouge = estGauche ? f.droit?.rouge : f.gauche?.rouge

      if (!procheRouge && !lointainRouge) {
        f.rouge = true
        this.snap(
          f.cle,
          `Cas 2 : frère ${f.cle} noir avec deux enfants noirs — on le recolore en ROUGE, le déficit remonte à ${xParent.cle}.`,
        )
        x = xParent
        xParent = x.parent
      } else {
        if (!lointainRouge) {
          const proche = estGauche ? f.gauche! : f.droit!
          proche.rouge = false
          f.rouge = true
          this.snap(
            f.cle,
            `Cas 3 : l'enfant proche ${proche.cle} du frère est rouge, le lointain noir — rotation autour du frère ${f.cle} pour retomber sur le cas 4.`,
          )
          if (estGauche) this.rotationDroite(f)
          else this.rotationGauche(f)
          f = estGauche ? xParent.droit! : xParent.gauche!
        }
        f.rouge = xParent.rouge
        xParent.rouge = false
        const lointain = estGauche ? f.droit! : f.gauche!
        lointain.rouge = false
        this.snap(
          f.cle,
          `Cas 4 : l'enfant lointain du frère est rouge — rotation autour du parent ${xParent.cle}, le frère ${f.cle} hérite de sa couleur. Le double noir est absorbé.`,
        )
        if (estGauche) this.rotationGauche(xParent)
        else this.rotationDroite(xParent)
        x = this.root
        xParent = null
      }
    }
    if (x) x.rouge = false
    this.snap(undefined, `Réparation terminée : les 5 propriétés rouge-noir sont rétablies.`)
  }
}

const BUILD = [20, 10, 30, 5, 15, 25, 40, 1]
const DELETE_SEQ = [1, 5, 25, 20]

function computeSteps(build: number[], deleteSeq: number[]): Step[] {
  const t = new RBTree()
  for (const k of build) t.inserer(k)
  t.snap(undefined, `Arbre de départ (construit avec ${build.join(', ')}). On supprime : ${deleteSeq.join(', ')}.`)
  for (const k of deleteSeq) t.supprimer(k)
  return t.steps
}

export default function RBDeleteViz() {
  const [config, setConfig] = useState({ build: BUILD, del: DELETE_SEQ })
  const steps = useMemo(() => computeSteps(config.build, config.del), [config])
  const player = useStepPlayer(steps.length)
  const step = steps[Math.min(player.index, steps.length - 1)]

  const randomize = () => {
    const pool = Array.from({ length: 50 }, (_, i) => i + 1)
    const build: number[] = []
    for (let i = 0; i < 8; i++) build.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0])
    const del = [...build].sort(() => Math.random() - 0.5).slice(0, 4)
    setConfig({ build, del })
    player.reset()
  }

  return (
    <figure className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
      <figcaption className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
        Suppression rouge-noir pas à pas
      </figcaption>

      <div className="mb-2">
        <button className="viz-btn" onClick={randomize}>
          🎲 Nouvelle configuration
        </button>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Arbre rouge-noir pendant des suppressions">
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
            arbre vide
          </text>
        )}
      </svg>

      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500" /> rouge
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-800 dark:bg-slate-950 dark:ring-1 dark:ring-slate-600" /> noir
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full ring-2 ring-indigo-500" /> nœud concerné
        </span>
      </div>

      <StepNote index={player.index} count={steps.length} note={step.note} />
      <StepControls player={player} stepCount={steps.length} />
    </figure>
  )
}
