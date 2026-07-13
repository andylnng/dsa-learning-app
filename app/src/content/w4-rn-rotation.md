# Arbre rouge-noir : les rotations

## Pourquoi équilibrer ?

Un ABR simple peut dégénérer en liste (hauteur n). Les **arbres rouge-noir** sont des
ABR *auto-équilibrés* : ils garantissent une hauteur **O(log n)** en réorganisant
l'arbre lors des insertions et suppressions. L'outil de réorganisation, c'est la
**rotation**.

## La rotation : l'opération fondamentale

Une rotation est une transformation **locale** (3 pointeurs modifiés) qui change la
forme de l'arbre **sans jamais violer la propriété d'ordre** de l'ABR.

### Rotation gauche autour de x

Le fils droit `y` de `x` remonte à la place de `x` ; `x` devient le fils gauche de `y` ;
le sous-arbre `B` (fils gauche de `y`, avec des clés entre x et y) change de parent :

```
      x                    y
     / \                  / \
    A   y      →         x   C
       / \              / \
      B   C            A   B
```

### Rotation droite autour de y

C'est l'opération miroir (et l'inverse exacte de la rotation gauche) :

```
        y                  x
       / \                / \
      x   C      →       A   y
     / \                    / \
    A   B                  B   C
```

## Code Java

```java
// rotation gauche autour de x ; retourne la nouvelle racine du sous-arbre
private Noeud rotationGauche(Noeud x) {
    Noeud y = x.droit;
    x.droit = y.gauche;    // B change de parent
    y.gauche = x;          // x descend à gauche de y
    return y;              // y remonte
}

private Noeud rotationDroite(Noeud y) {
    Noeud x = y.gauche;
    y.gauche = x.droit;
    x.droit = y;
    return x;
}
```

Coût : **O(1)** — un nombre constant de pointeurs, aucune visite du reste de l'arbre.
Manipule la visualisation ci-dessous pour voir que le parcours en ordre (A, x, B, y, C)
est identique avant et après.

## Les 5 propriétés rouge-noir

Chaque nœud porte une couleur, **rouge** ou **noir**, et l'arbre maintient :

1. Chaque nœud est rouge ou noir.
2. La **racine est noire**.
3. Les feuilles (`null`, notées NIL) sont noires.
4. **Un nœud rouge n'a jamais d'enfant rouge** (pas deux rouges de suite).
5. Tous les chemins d'un nœud vers ses feuilles contiennent le **même nombre de nœuds
   noirs** (la *hauteur noire*).

Conséquence : le chemin le plus long (alternance rouge/noir) fait au plus **2×** le plus
court (tout noir) → hauteur ≤ 2·log₂(n+1) = **O(log n)** garanti.

## Pièges d'examen

- Une rotation ne change **jamais** l'ordre en ordre (in-order) des clés — si ton
  déroulé le change, il est faux.
- Dans la rotation gauche, c'est le sous-arbre **B** (gauche de y) qui change de parent
  — pas A ni C. C'est le détail que les examens vérifient.
- Les rotations sont O(1) ; c'est le *rééquilibrage complet* après insertion qui peut
  en enchaîner, tout en restant O(log n).
- Propriété 5 : on compte les nœuds **noirs** seulement, et les NIL comptent
  (généralement) pour un nœud noir.
