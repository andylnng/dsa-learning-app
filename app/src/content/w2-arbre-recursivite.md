# L'arbre de récursivité

## Intuition

Quand une fonction fait **plusieurs** appels récursifs, l'exécution ne forme plus une
simple chaîne mais un **arbre** : chaque nœud est un appel, ses enfants sont les appels
qu'il déclenche. Dessiner cet arbre est *l'outil* pour comprendre — et compter — le
travail total d'un algorithme récursif.

## L'exemple canonique : Fibonacci naïf

```java
public static long fib(int n) {
    if (n <= 1) {
        return n;
    }
    return fib(n - 1) + fib(n - 2);
}
```

L'arbre de `fib(5)` :

```
                    fib(5)
              ┌───────┴────────┐
           fib(4)            fib(3)
         ┌───┴────┐        ┌───┴───┐
      fib(3)   fib(2)   fib(2)  fib(1)
      ┌──┴──┐   ┌─┴─┐    ┌─┴─┐
   fib(2) fib(1) …   …   …   …
```

Observation cruciale : `fib(3)` est calculé **deux fois**, `fib(2)` **trois fois** —
les mêmes sous-problèmes reviennent encore et encore. Le nombre total de nœuds croît
comme **Θ(φⁿ) ≈ O(2ⁿ)** : exponentiel. Explore-le dans la visualisation ci-dessous.

C'est exactement le gaspillage que la **mémoïsation** (semaine 9, programmation
dynamique) élimine : mémoriser chaque résultat ramène le coût à O(n).

## Lire un arbre de récursivité

Pour une récurrence de la forme `T(n) = a·T(n/b) + f(n)` :

- **Profondeur** : combien de fois peut-on réduire `n` avant le cas de base ?
  Pour `n → n/b`, la profondeur est `log_b n` ; pour `n → n − 1`, elle est `n`.
- **Largeur** : chaque nœud a `a` enfants → le niveau `k` contient `aᵏ` nœuds.
- **Coût total** = somme, niveau par niveau, du travail local `f`.

Trois régimes possibles :

| Le coût par niveau… | Exemple | Total |
|---|---|---|
| est constant à chaque niveau | tri fusion : n à chaque niveau, log n niveaux | Θ(n log n) |
| décroît géométriquement | `T(n) = T(n/2) + n` | Θ(n) — dominé par la racine |
| croît géométriquement | `T(n) = 2T(n/2) + 1` | Θ(n) — dominé par les feuilles |

Cette lecture « niveau par niveau » est la **méthode de l'arbre de récursivité**,
détaillée dans la section d'analyse des récurrences.

## Pièges d'examen

- Ne confonds pas *profondeur* de l'arbre (espace de pile) et *nombre de nœuds*
  (temps). `fib(n)` naïf : profondeur O(n), mais temps O(2ⁿ).
- Deux appels sur `n − 1` et `n − 2` ne donnent pas « O(n²) » : l'arbre est
  exponentiel. La multiplication par niveau, c'est pour les *branches*, pas les soustractions.
- À l'examen, dessine les 2–3 premiers niveaux et cherche le motif : combien de nœuds
  par niveau ? quel coût par nœud ? combien de niveaux ?
