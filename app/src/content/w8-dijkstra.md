# Dijkstra

## Intuition

BFS calcule les plus courts chemins quand toutes les arêtes valent 1. **Dijkstra**
généralise aux poids **positifs** : au lieu d'une file FIFO, une **file de priorité**
qui sert toujours le sommet le plus proche du départ.

L'idée gloutonne : le sommet non finalisé **le plus proche** ne pourra jamais être
atteint plus court par un autre chemin (tous les autres chemins passent par des
sommets au moins aussi loin, et les poids sont ≥ 0). On peut donc le **finaliser**
définitivement — un choix local jamais remis en cause.

## Fonctionnement

1. `dist[départ] = 0`, tout le reste à ∞. File de priorité sur `dist`.
2. Extraire le sommet non finalisé `u` de plus petite distance ; le **finaliser**.
3. **Relâcher** chaque arête (u, v) : si `dist[u] + poids(u,v) < dist[v]`, améliorer
   `dist[v]` et mémoriser `parent[v] = u`.
4. Répéter jusqu'à la file vide (ou jusqu'à finaliser la cible).

## Code Java

```java
public static int[] dijkstra(List<List<int[]>> adj, int depart) {
    int n = adj.size();
    int[] dist = new int[n];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[depart] = 0;
    boolean[] finalise = new boolean[n];
    // file de priorité de paires [distance, sommet]
    PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);
    pq.offer(new int[]{0, depart});

    while (!pq.isEmpty()) {
        int[] top = pq.poll();
        int u = top[1];
        if (finalise[u]) continue;      // entrée obsolète : on l'ignore
        finalise[u] = true;
        for (int[] arete : adj.get(u)) { // arete = [voisin, poids]
            int v = arete[0], p = arete[1];
            if (!finalise[v] && dist[u] + p < dist[v]) {
                dist[v] = dist[u] + p;   // relâchement
                pq.offer(new int[]{dist[v], v});
            }
        }
    }
    return dist;
}
```

(Plutôt que de *diminuer la clé* dans la file — non supporté par `PriorityQueue` —
on réinsère et on ignore les entrées obsolètes : le « lazy deletion » standard.)

## Complexité

| Implémentation de la file | Coût total |
|---|---|
| tableau (extraire-min naïf) | O(n²) — bon pour graphes denses |
| **tas binaire** (semaine 3 !) | **O((n + m) log n)** |

## La limite : les poids négatifs

Dijkstra **échoue** avec des poids négatifs : la finalisation gloutonne suppose qu'on
ne peut pas raccourcir un chemin en s'éloignant. Un poids négatif brise l'argument
(→ Bellman-Ford, hors plan de cours). Poids positifs = condition d'entrée à vérifier
avant d'appliquer Dijkstra à l'examen.

Déroule la visualisation : la file de priorité est affichée, les sommets se finalisent
dans l'ordre des distances croissantes.

## Pièges d'examen

- Dijkstra est **glouton** : chaque finalisation est définitive. Si ton déroulé
  « re-finalise » un sommet, il est faux.
- L'ordre de finalisation = l'ordre des distances finales croissantes — vérification
  rapide de ton déroulé.
- BFS = cas particulier de Dijkstra (poids tous égaux). Sur un graphe non pondéré,
  répondre « Dijkstra » n'est pas faux, mais BFS suffit et c'est la réponse attendue.
- `dist[v]` peut être amélioré **plusieurs fois** tant que v n'est pas finalisé —
  n'écris pas la valeur définitive avant l'extraction.
- Poids négatifs → Dijkstra invalide, même s'il n'y a pas de cycle négatif.
