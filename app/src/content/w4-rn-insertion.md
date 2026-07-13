# Arbre rouge-noir : insertion

## Vue d'ensemble

L'insertion rouge-noir se fait en deux temps :

1. **Insérer comme dans un ABR ordinaire**, et colorer le nouveau nœud en **rouge**.
2. **Réparer** les violations éventuelles en remontant (recolorations et rotations).

Pourquoi rouge ? Un nœud rouge ne change pas la hauteur noire (propriété 5) — la seule
propriété qui puisse casser est la n° 4 : *deux rouges de suite* (si le parent est
rouge aussi). C'est la violation la moins coûteuse à réparer.

## La réparation : trois cas

Soit `z` le nœud rouge dont le parent est rouge. Le personnage clé est **l'oncle** de
`z` (le frère du parent). En notant la configuration côté gauche (les cas droits sont
les miroirs) :

### Cas 1 — l'oncle est rouge → recoloration

Parent et oncle deviennent noirs, le grand-parent devient rouge, et `z` remonte au
grand-parent (la violation peut se propager plus haut).

```
      G(noir)                G(rouge) ← nouveau z
      /     \                /     \
  P(rouge)  O(rouge)  →  P(noir)  O(noir)
    /                      /
  z(rouge)              z(rouge)
```

### Cas 2 — oncle noir, z est un « enfant intérieur » (zig-zag) → rotation du parent

Une rotation autour du parent transforme le zig-zag en ligne droite : on retombe sur
le cas 3.

### Cas 3 — oncle noir, z est un « enfant extérieur » (ligne droite) → rotation du grand-parent

Rotation autour du grand-parent + échange des couleurs parent/grand-parent. La
violation est réparée, la boucle s'arrête.

```
        G(noir)                    P(noir)
        /     \                    /     \
    P(rouge)  O(noir)   →      z(rouge)  G(rouge)
      /                                     \
  z(rouge)                                 O(noir)
```

Enfin, on force la **racine en noir** (propriété 2).

## Code Java (schéma)

```java
private void reparerInsertion(Noeud z) {
    while (z.parent != null && z.parent.couleur == ROUGE) {
        Noeud grandParent = z.parent.parent;
        Noeud oncle = (z.parent == grandParent.gauche) ? grandParent.droit : grandParent.gauche;

        if (couleur(oncle) == ROUGE) {                 // cas 1 : recoloration
            z.parent.couleur = NOIR;
            oncle.couleur = NOIR;
            grandParent.couleur = ROUGE;
            z = grandParent;                           // et on remonte
        } else {
            if (estEnfantInterieur(z)) {               // cas 2 : rotation du parent
                z = z.parent;
                tourner(z);                            // gauche ou droite selon le côté
            }
            z.parent.couleur = NOIR;                   // cas 3 : rotation du grand-parent
            grandParent.couleur = ROUGE;
            tournerAutreSens(grandParent);
            // plus de violation : la boucle se termine
        }
    }
    racine.couleur = NOIR;                             // propriété 2
}
```

## Complexité

- Descente d'insertion : O(log n) (hauteur garantie).
- Réparation : le cas 1 peut remonter de 2 niveaux à la fois → O(log n) recolorations ;
  les cas 2–3 déclenchent **au plus 2 rotations** au total, puis c'est fini.
- **Total : O(log n)**, avec un nombre de rotations constant.

Déroule la visualisation ci-dessous : insère des valeurs et observe quel cas s'applique
à chaque réparation.

## Pièges d'examen

- Le nouveau nœud est **toujours inséré rouge** — l'insérer noir casserait la hauteur
  noire (propriété 5) sur tout un chemin, bien plus dur à réparer.
- Cas 1 (oncle rouge) : **aucune rotation**, seulement des recolorations — et la
  violation peut se propager vers la racine.
- L'insertion fait au plus **2 rotations** ; si ton déroulé en fait 5, il y a une erreur.
- L'oncle `null` (NIL) compte comme **noir** → cas 2/3, pas cas 1.
- Après chaque insertion, vérifie tes 5 propriétés : racine noire, pas de deux rouges
  de suite, hauteur noire uniforme.
