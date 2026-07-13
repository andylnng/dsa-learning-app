# Recherche en largeur d'abord (BFS)

## Intuition

Le **BFS** (*breadth-first search*) explore le graphe **par couches** : d'abord le
sommet de départ, puis tous ses voisins (distance 1), puis les voisins des voisins
(distance 2)… Comme une onde qui se propage.

L'outil qui impose cet ordre : une **file** (FIFO — semaine 3 !). On découvre les
sommets dans l'ordre où on les enfile, donc par distance croissante.

## Fonctionnement

1. Enfiler le départ, le marquer découvert.
2. Tant que la file n'est pas vide : défiler `u`, et enfiler chaque voisin de `u`
   **pas encore découvert** (en le marquant immédiatement).

Le marquage *au moment de l'enfilement* (et non du défilement) évite d'enfiler deux
fois le même sommet.

## Code Java

```java
public static int[] bfs(List<List<Integer>> adj, int depart) {
    int n = adj.size();
    int[] dist = new int[n];
    Arrays.fill(dist, -1);              // -1 = pas encore découvert
    Queue<Integer> file = new ArrayDeque<>();

    dist[depart] = 0;
    file.offer(depart);
    while (!file.isEmpty()) {
        int u = file.poll();
        for (int v : adj.get(u)) {
            if (dist[v] == -1) {         // découvert pour la première fois
                dist[v] = dist[u] + 1;
                file.offer(v);
            }
        }
    }
    return dist;   // dist[v] = longueur du plus court chemin depart→v (en arêtes)
}
```

## La propriété fondamentale

> Dans un graphe **non pondéré**, BFS calcule le **plus court chemin** (en nombre
> d'arêtes) du départ vers tous les sommets atteignables.

En mémorisant `parent[v] = u` au moment de la découverte, on reconstruit le chemin.
L'ensemble des arêtes (parent, enfant) forme l'**arbre BFS**.

## Complexité

- **Temps : O(n + m)** avec listes d'adjacence — chaque sommet est enfilé/défilé au
  plus une fois, chaque arête examinée au plus deux fois.
- **Espace : O(n)** (file + marquage).

Regarde la visualisation : la file est affichée à chaque étape, et les couches de
distance se colorent au fur et à mesure.

## Usages classiques

Plus court chemin non pondéré, composantes connexes, test de bipartition
(2-coloration), « degrés de séparation », labyrinthe le plus court.

## Pièges d'examen

- BFS ne donne le plus court chemin que si le graphe est **non pondéré** (ou à poids
  uniformes). Pondéré → Dijkstra (semaine 8).
- Marquer au **défilement** au lieu de l'enfilement : le sommet peut être enfilé
  plusieurs fois — l'algo reste correct mais la complexité se dégrade ; à l'examen,
  c'est compté faux.
- L'ordre de visite exact dépend de l'ordre des listes d'adjacence — deux réponses
  différentes peuvent être toutes deux correctes si l'énoncé ne fixe pas l'ordre.
- BFS ↔ file, DFS ↔ pile. Échanger la structure échange l'algorithme.
