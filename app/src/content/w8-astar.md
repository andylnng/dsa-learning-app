# A* (A étoile)

## Intuition

Dijkstra explore « en rond » : il s'étend uniformément dans toutes les directions,
même à l'opposé de la cible. Quand on **connaît la cible**, on peut faire mieux :
**A\*** oriente la recherche avec une **heuristique** `h(v)` qui estime la distance
restante de `v` à la cible.

A\* sert le sommet qui minimise :

> **f(v) = g(v) + h(v)** — coût déjà parcouru + estimation du reste

- `h = 0` partout → A\* **est** Dijkstra.
- `h` bien informée → l'exploration file droit vers la cible.

## Les deux propriétés de l'heuristique

- **Admissible** : `h(v)` ne **surestime jamais** la vraie distance restante.
  → A\* retourne le chemin **optimal**.
- **Cohérente** (monotone) : `h(u) ≤ poids(u,v) + h(v)` pour toute arête.
  → en plus, chaque sommet est finalisé une seule fois (comme Dijkstra).

Heuristiques classiques sur grille :

| Déplacements | Heuristique admissible |
|---|---|
| 4 directions | distance de **Manhattan** : \|Δx\| + \|Δy\| |
| 8 directions | distance de Tchebychev : max(\|Δx\|, \|Δy\|) |
| libres | distance euclidienne |

## Code Java (différences avec Dijkstra)

```java
// Identique à Dijkstra, sauf la priorité :
pq.offer(new int[]{ dist[depart] + h(depart), depart });
// ...
if (!finalise[v] && dist[u] + p < dist[v]) {
    dist[v] = dist[u] + p;
    pq.offer(new int[]{ dist[v] + h(v), v });   // f = g + h
}
// et on peut s'arrêter dès que la CIBLE est finalisée.
```

Trois différences, pas une de plus : la priorité `f = g + h`, l'arrêt à la cible,
et la nécessité de connaître la cible.

## Ce que ça change en pratique

Dans la visualisation, le même labyrinthe est résolu par Dijkstra (h = 0) et A\*
(Manhattan) : compte les cases explorées. Même chemin final — mais A\* en visite
beaucoup moins. C'est tout l'enjeu : **même optimalité, moins de travail**, au prix
d'une heuristique.

- Jeux vidéo (pathfinding), GPS (heuristique = vol d'oiseau), puzzles (taquin avec
  Manhattan), planification.

## Pièges d'examen

- Heuristique **non admissible** (qui surestime) → A\* peut retourner un chemin
  sous-optimal. C'est LE point à vérifier avant de garantir l'optimalité.
- `h` doit estimer la distance **vers la cible** — pas depuis le départ.
- A\* avec h = 0 = Dijkstra : question réflexe d'examen.
- Une heuristique « plus grande mais toujours admissible » est **meilleure** (moins
  d'exploration) : h = 0 est admissible mais inutile ; Manhattan domine h = 0.
- A\* n'est pas plus « rapide » en complexité pire cas — il explore juste moins de
  sommets en pratique quand h est informative.
