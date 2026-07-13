# Arbres de jeu : l'algorithme Minimax

## Intuition

Dans un jeu à deux joueurs à somme nulle (échecs, dames, tic-tac-toe), chaque position
peut être vue comme un nœud d'un **arbre de jeu** : les enfants sont les positions
atteignables en un coup. Deux joueurs alternent :

- **MAX** (nous) veut *maximiser* le score final ;
- **MIN** (l'adversaire) veut le *minimiser*.

**Minimax** calcule la valeur d'une position en supposant que les deux joueurs jouent
parfaitement : à un nœud MAX on prend le maximum des valeurs des enfants, à un nœud MIN
le minimum. Les feuilles portent une valeur donnée par la règle du jeu (victoire = +1,
défaite = −1, nulle = 0) ou par une **heuristique** si on coupe la recherche avant la fin.

## Fonctionnement

1. Descendre récursivement jusqu'aux feuilles (fin de partie ou profondeur limite).
2. Évaluer les feuilles.
3. Remonter : chaque nœud MAX prend le max de ses enfants, chaque nœud MIN le min.
4. À la racine, MAX joue le coup menant à l'enfant de valeur maximale.

## Code Java

```java
public static int minimax(Etat etat, int profondeur, boolean tourMax) {
    if (profondeur == 0 || etat.estTerminal()) {
        return etat.evaluer();               // feuille : évaluation
    }
    if (tourMax) {
        int meilleur = Integer.MIN_VALUE;
        for (Etat enfant : etat.coupsPossibles()) {
            meilleur = Math.max(meilleur, minimax(enfant, profondeur - 1, false));
        }
        return meilleur;
    } else {
        int pire = Integer.MAX_VALUE;
        for (Etat enfant : etat.coupsPossibles()) {
            pire = Math.min(pire, minimax(enfant, profondeur - 1, true));
        }
        return pire;
    }
}
```

## Complexité

Avec un **facteur de branchement** `b` (nombre moyen de coups possibles) et une
profondeur `d` :

- **Temps** : O(b^d) — l'arbre entier est exploré.
- **Espace** : O(d) — c'est un parcours en profondeur.

Aux échecs, b ≈ 35 : à profondeur 6, c'est déjà ~1,8 milliard de nœuds. D'où deux
leviers : **limiter la profondeur** (et évaluer par heuristique) et **élaguer**
(alpha-beta, section suivante).

## Pièges d'examen

- Minimax remonte la valeur *en supposant l'adversaire optimal*. Si l'adversaire joue
  mal, on obtient au moins cette valeur — jamais moins.
- Ne mélange pas les niveaux : la racine est MAX, ses enfants sont des nœuds MIN,
  etc. Une erreur d'alternance fausse tout l'arbre.
- La valeur minimax d'un nœud interne ne dépend **que** des feuilles de son
  sous-arbre — sache la recalculer à la main sur un petit arbre, c'est LA question
  d'examen typique.
