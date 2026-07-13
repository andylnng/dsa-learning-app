# ABR : insertion et suppression

## Insertion

On descend comme pour une recherche, et on accroche le nouveau nœud à la place du
`null` où la recherche échoue. Une insertion se fait donc **toujours en feuille**.

```java
public static Noeud inserer(Noeud n, int cle) {
    if (n == null) return new Noeud(cle);
    if (cle < n.cle)      n.gauche = inserer(n.gauche, cle);
    else if (cle > n.cle) n.droit  = inserer(n.droit, cle);
    // clé déjà présente : on ne fait rien (ou on gère les doublons selon la politique)
    return n;
}
```

Coût : **O(h)** — une seule descente.

> L'ordre d'insertion détermine la forme de l'arbre : insérer 1, 2, 3, …, n en ordre
> donne un arbre dégénéré de hauteur n. Essaie dans la visualisation ci-dessous !

## Suppression : les trois cas

Supprimer le nœud `z` de clé donnée. Après l'avoir *trouvé* (O(h)), trois cas :

### Cas 1 — feuille (aucun enfant)

On détache simplement le nœud.

### Cas 2 — un seul enfant

L'enfant remonte : le parent de `z` pointe directement vers l'unique enfant de `z`.

### Cas 3 — deux enfants

On ne supprime pas le nœud physiquement : on le **remplace par son successeur** —
le minimum du sous-arbre droit (qui n'a, par construction, pas d'enfant gauche) —
puis on supprime ce successeur (cas 1 ou 2, jamais cas 3).

```java
public static Noeud supprimer(Noeud n, int cle) {
    if (n == null) return null;
    if (cle < n.cle)      { n.gauche = supprimer(n.gauche, cle); return n; }
    if (cle > n.cle)      { n.droit  = supprimer(n.droit, cle);  return n; }

    // n est le nœud à supprimer
    if (n.gauche == null) return n.droit;    // cas 1 et 2 (enfant droit ou null)
    if (n.droit == null)  return n.gauche;   // cas 2 (enfant gauche)

    // cas 3 : deux enfants — remplacer par le successeur
    Noeud succ = n.droit;
    while (succ.gauche != null) succ = succ.gauche;
    n.cle = succ.cle;                         // copier la clé du successeur
    n.droit = supprimer(n.droit, succ.cle);   // supprimer le successeur (cas simple)
    return n;
}
```

Coût : **O(h)** au total (la descente vers le successeur reste dans le même chemin).

## Résumé des coûts

| Opération | Coût | Arbre équilibré | Arbre dégénéré |
|-----------|------|-----------------|----------------|
| recherche | O(h) | O(log n) | O(n) |
| insertion | O(h) | O(log n) | O(n) |
| suppression | O(h) | O(log n) | O(n) |

## Pièges d'examen

- Cas 3 : on remplace par le **successeur** (min du sous-arbre droit) — ou,
  symétriquement, par le **prédécesseur** (max du sous-arbre gauche). Les deux sont
  corrects ; sache dérouler celui demandé par l'énoncé.
- Le successeur du cas 3 a **au plus un enfant** (droit) : c'est pourquoi sa propre
  suppression retombe toujours dans les cas simples.
- Après suppression, l'arbre reste un ABR valide mais peut se **déséquilibrer** — rien
  ne maintient la hauteur, contrairement au rouge-noir.
- L'insertion se fait en feuille : on ne « réorganise » jamais l'arbre existant
  (aucune rotation dans un ABR simple).
