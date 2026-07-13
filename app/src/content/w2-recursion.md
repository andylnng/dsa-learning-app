# Rappel sur la récursion

## Intuition

Une fonction est **récursive** quand elle s'appelle elle-même sur un problème *plus
petit*. Toute récursion correcte repose sur deux ingrédients :

1. **Cas de base** : une entrée assez petite pour répondre directement, sans rappel.
2. **Cas récursif** : on réduit le problème et on s'appelle sur cette version réduite,
   en se *rapprochant obligatoirement* du cas de base.

> Oublie l'un des deux et c'est le débordement de pile (`StackOverflowError`) assuré.

## Format d'une fonction récursive

```java
public static int factorielle(int n) {
    if (n <= 1) {          // cas de base
        return 1;
    }
    return n * factorielle(n - 1);  // cas récursif : n décroît vers le cas de base
}
```

## Récursion et mémoire : la pile d'appels

Chaque appel crée un **cadre** (*stack frame*) sur la pile d'exécution : paramètres,
variables locales, adresse de retour. Les cadres s'empilent jusqu'au cas de base, puis
se dépilent en remontant les résultats.

Pour `factorielle(4)` :

```
factorielle(4)
  → factorielle(3)
      → factorielle(2)
          → factorielle(1)   ← cas de base : retourne 1
          retourne 2 · 1 = 2
      retourne 3 · 2 = 6
  retourne 4 · 6 = 24
```

La visualisation ci-dessous montre la pile qui s'empile puis se dépile.

**Conséquence importante** : une récursion de profondeur `d` consomme **O(d) d'espace
de pile**, même si l'algorithme ne « stocke » rien explicitement.

## Récursion ou itération ?

| | Récursion | Itération |
|---|---|---|
| Lisibilité | naturelle pour les structures récursives (arbres, diviser pour régner) | naturelle pour les parcours simples |
| Espace | O(profondeur) de pile | O(1) en général |
| Coût | appels de fonction (léger surcoût) | aucun surcoût d'appel |
| Risque | débordement de pile | boucle infinie |

Toute récursion peut se réécrire en itération (au besoin avec une pile explicite), et
inversement. En Java, il n'y a **pas d'optimisation d'appel terminal** : une récursion
profonde de 100 000 niveaux plantera, là où une boucle passera.

## Pièges d'examen

- Vérifie que *chaque* chemin récursif se rapproche du cas de base — un `factorielle(n - 1)`
  appelé avec `n` négatif ne termine jamais si le cas de base est `n == 1`.
- L'espace d'une fonction récursive n'est jamais « O(1) » : compte la profondeur de pile.
- Deux appels récursifs ≠ deux fois plus lent : `fib(n)` naïf fait ~2ⁿ appels, pas 2n
  (voir la section suivante sur l'arbre de récursivité).
