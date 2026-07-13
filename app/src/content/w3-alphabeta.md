# Élagage alpha-beta et heuristiques

## Intuition

Minimax explore tout l'arbre — mais une grande partie est inutile. Si MAX a déjà un
coup qui garantit 7, et qu'en explorant un autre coup il découvre que MIN peut y forcer
5, **inutile de finir d'explorer ce coup** : MAX ne le jouera jamais. On coupe la
branche. C'est l'**élagage alpha-beta** : le même résultat que minimax, en explorant
moins de nœuds.

## Les deux bornes

- **α (alpha)** : le meilleur score que MAX peut *déjà* garantir sur le chemin courant.
- **β (beta)** : le meilleur (plus petit) score que MIN peut déjà garantir.

Invariant : on n'explore que si `α < β`. Dès que `α ≥ β`, la branche est morte —
**coupure** (β-coupure à un nœud MAX quand sa valeur atteint β ; α-coupure à un nœud
MIN quand sa valeur descend à α).

## Code Java

```java
public static int alphaBeta(Etat etat, int prof, int alpha, int beta, boolean tourMax) {
    if (prof == 0 || etat.estTerminal()) {
        return etat.evaluer();
    }
    if (tourMax) {
        int v = Integer.MIN_VALUE;
        for (Etat enfant : etat.coupsPossibles()) {
            v = Math.max(v, alphaBeta(enfant, prof - 1, alpha, beta, false));
            alpha = Math.max(alpha, v);
            if (alpha >= beta) break;   // β-coupure : MIN ne laissera jamais passer
        }
        return v;
    } else {
        int v = Integer.MAX_VALUE;
        for (Etat enfant : etat.coupsPossibles()) {
            v = Math.min(v, alphaBeta(enfant, prof - 1, alpha, beta, true));
            beta = Math.min(beta, v);
            if (alpha >= beta) break;   // α-coupure : MAX a déjà mieux ailleurs
        }
        return v;
    }
}
// appel initial : alphaBeta(racine, d, Integer.MIN_VALUE, Integer.MAX_VALUE, true)
```

Compare minimax et alpha-beta sur le même arbre dans la visualisation ci-dessous —
les nœuds grisés sont ceux que l'élagage évite.

## Efficacité

- **Pire cas** (mauvais ordre des coups) : aucun élagage, O(b^d) comme minimax.
- **Meilleur cas** (meilleurs coups explorés en premier) : **O(b^(d/2))** — on peut
  chercher **deux fois plus profond** pour le même coût !
- L'**ordre d'exploration** est donc crucial : on trie les coups par qualité estimée
  (captures d'abord, coup tueur, table de transposition…).

## Heuristiques

Impossible d'atteindre les vraies feuilles d'un jeu réel : on coupe à une profondeur
limite et on évalue la position par une **fonction heuristique** `evaluer()`.

- Elle estime la valeur d'une position *sans* explorer plus loin
  (aux échecs : matériel, mobilité, sécurité du roi…).
- Elle doit être **rapide** (appelée sur chaque feuille) et **cohérente**
  (les bonnes positions doivent avoir de meilleurs scores).
- Compromis fondamental : heuristique plus fine = moins de profondeur ;
  heuristique grossière = plus de profondeur. Les deux améliorent le jeu.

## Pièges d'examen

- Alpha-beta retourne **exactement la même valeur** que minimax à la racine — c'est
  une optimisation, pas une approximation. (Les heuristiques, elles, approximent.)
- Une coupure a lieu quand `α ≥ β`, pas `α > β`.
- Le nombre de nœuds élagués **dépend de l'ordre des enfants** ; à l'examen, si on te
  fait dérouler alpha-beta, l'ordre gauche→droite donné dans l'énoncé est impératif.
- α et β se transmettent *vers le bas* (paramètres), les valeurs remontent *vers le
  haut* — ne les confonds pas dans un déroulé manuel.
