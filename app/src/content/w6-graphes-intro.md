# Graphes : introduction et définitions

## Intuition

Un **graphe** modélise des objets (**sommets**, *vertices*) et leurs relations
(**arêtes**, *edges*) : réseaux routiers, réseaux sociaux, dépendances de compilation,
états d'un jeu… C'est la structure la plus générale du cours — arbres et listes n'en
sont que des cas particuliers.

## Vocabulaire essentiel

- **G = (V, E)** : ensemble de sommets V (n = |V|) et d'arêtes E (m = |E|).
- **Orienté / non orienté** : les arêtes ont-elles un sens ? (arc vs arête)
- **Pondéré** : chaque arête porte un poids (distance, coût…).
- **Degré** d'un sommet : nombre d'arêtes incidentes. En orienté : degré entrant et
  degré sortant. Lemme des poignées de main : Σ degrés = 2m.
- **Chemin** : suite de sommets reliés par des arêtes ; **simple** s'il ne répète pas
  de sommet. **Cycle** : chemin qui revient à son point de départ.
- **Connexe** (non orienté) : tout sommet est joignable depuis tout autre ;
  **composantes connexes** sinon. En orienté : fortement connexe.
- **Arbre** : graphe connexe **acyclique** — exactement n − 1 arêtes.
- **Graphe dense** : m proche de n² ; **creux** (sparse) : m proche de n.

## Les deux représentations

### Matrice d'adjacence

`adj[u][v] = 1` (ou le poids) si l'arête (u, v) existe.

```java
int[][] adj = new int[n][n];
adj[u][v] = 1;
adj[v][u] = 1;   // si non orienté
```

### Listes d'adjacence

Pour chaque sommet, la liste de ses voisins.

```java
List<List<Integer>> adj = new ArrayList<>();
for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
adj.get(u).add(v);
adj.get(v).add(u);   // si non orienté
```

### Comparaison

| | Matrice | Listes |
|---|---|---|
| mémoire | Θ(n²) | Θ(n + m) |
| « u et v sont-ils voisins ? » | **O(1)** | O(deg(u)) |
| énumérer les voisins de u | O(n) | **O(deg(u))** |
| adapté à | graphes denses | graphes creux (le cas usuel) |

Les parcours (BFS, DFS) coûtent **O(n + m)** avec des listes, mais **O(n²)** avec une
matrice — c'est pourquoi les listes sont le choix par défaut.

## Pièges d'examen

- Σ des degrés = **2m** (chaque arête compte deux fois) — d'où : le nombre de sommets
  de degré impair est toujours **pair** (utile pour Euler, dernière section !).
- Un arbre a exactement **n − 1** arêtes ; n − 1 arêtes + connexe ⇒ arbre ;
  n − 1 arêtes seul ⇒ pas forcément (peut être non connexe avec un cycle).
- En orienté, la matrice n'est **pas symétrique** ; ne symétrise pas par réflexe.
- Complexité « O(n + m) » : dis toujours *avec listes d'adjacence* — la
  représentation fait partie de la réponse.
