# Analyse des récurrences : méthode itérative, arbre, méthode générale

## Pourquoi des récurrences ?

Le coût d'un algorithme récursif s'exprime naturellement comme une **récurrence** :
le coût sur `n` en fonction du coût sur des entrées plus petites.

- Tri fusion : `T(n) = 2T(n/2) + Θ(n)`
- Recherche binaire : `T(n) = T(n/2) + Θ(1)`
- Factorielle : `T(n) = T(n−1) + Θ(1)`

Trois méthodes pour les résoudre — les trois sont exigibles à l'examen.

## 1. Méthode itérative (par substitution répétée)

On « déroule » la récurrence jusqu'à voir le motif, puis on somme.

Exemple : `T(n) = T(n/2) + 1`, `T(1) = 1`.

```
T(n) = T(n/2) + 1
     = T(n/4) + 1 + 1
     = T(n/8) + 1 + 1 + 1
     = …
     = T(n/2ᵏ) + k
```

On atteint le cas de base quand `n/2ᵏ = 1`, donc `k = log₂ n` :
`T(n) = T(1) + log₂ n = Θ(log n)`.

Exemple 2 : `T(n) = T(n−1) + n` → `T(n) = n + (n−1) + … + 1 = n(n+1)/2 = Θ(n²)`.

## 2. Méthode de l'arbre de récursivité

On dessine l'arbre des appels et on somme le travail **niveau par niveau** (voir la
section sur l'arbre de récursivité).

Exemple : `T(n) = 2T(n/2) + n` (tri fusion).

| Niveau | Nœuds | Taille | Coût du niveau |
|--------|-------|--------|----------------|
| 0 | 1 | n | n |
| 1 | 2 | n/2 | n |
| 2 | 4 | n/4 | n |
| … | … | … | n |
| log₂ n | n | 1 | n |

Chaque niveau coûte `n`, il y a `log₂ n + 1` niveaux → **Θ(n log n)**.

## 3. Méthode générale (théorème maître)

Pour les récurrences de la forme `T(n) = a·T(n/b) + f(n)` avec `a ≥ 1`, `b > 1`.
Le pivot est `n^(log_b a)` — le coût des feuilles. On compare `f(n)` à ce pivot :

| Cas | Condition | Résultat | Qui domine |
|-----|-----------|----------|------------|
| 1 | `f(n) = O(n^(log_b a − ε))` | `T(n) = Θ(n^(log_b a))` | les feuilles |
| 2 | `f(n) = Θ(n^(log_b a))` | `T(n) = Θ(n^(log_b a) · log n)` | tous les niveaux également |
| 3 | `f(n) = Ω(n^(log_b a + ε))` et condition de régularité | `T(n) = Θ(f(n))` | la racine |

Exemples :

- `T(n) = 2T(n/2) + n` : `log₂ 2 = 1`, `f(n) = n = Θ(n¹)` → **cas 2** : Θ(n log n). ✔ tri fusion
- `T(n) = T(n/2) + 1` : `log₂ 1 = 0`, `f(n) = Θ(n⁰)` → **cas 2** : Θ(log n). ✔ recherche binaire
- `T(n) = 8T(n/2) + n²` : `log₂ 8 = 3`, `n² = O(n^(3−ε))` → **cas 1** : Θ(n³).
- `T(n) = 2T(n/2) + n²` : `n² = Ω(n^(1+ε))` → **cas 3** : Θ(n²).

## Quelle méthode choisir ?

- La récurrence a la forme `a·T(n/b) + f(n)` ? → **méthode générale**, c'est immédiat.
- Forme soustractive (`T(n−1)`) ou inhabituelle ? → **itérative**.
- Besoin de *comprendre* d'où vient le résultat, ou forme irrégulière ? → **arbre**.

## Pièges d'examen

- Le théorème maître **ne s'applique pas** à `T(n) = T(n−1) + n` (pas de division !)
  ni à `T(n) = 2T(n/2) + n log n` (entre les cas 2 et 3 dans la version vue en cours).
- Cas 1 et 3 exigent un écart **polynomial** (le ε) : `f(n)` juste « un peu » plus
  petit ne suffit pas.
- N'oublie pas la condition de régularité du cas 3 : `a·f(n/b) ≤ c·f(n)` pour un `c < 1`.
- `log_b a` : c'est `a` (le nombre d'enfants) dans le log, pas `b`. `8T(n/2)` → `log₂ 8 = 3`.
