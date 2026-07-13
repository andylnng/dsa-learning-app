# Recherche en profondeur d'abord (DFS)

## Intuition

Le **DFS** (*depth-first search*) s'enfonce **le plus loin possible** le long d'un
chemin avant de revenir en arrière — exactement comme l'exploration d'un labyrinthe
main sur le mur. C'est le retour en arrière (semaine 2) appliqué aux graphes.

L'outil : une **pile** — le plus souvent implicite, via la récursion.

## Code Java

```java
static boolean[] visite;

public static void dfs(List<List<Integer>> adj, int u) {
    visite[u] = true;
    // pré-visite : premier passage sur u
    for (int v : adj.get(u)) {
        if (!visite[v]) {
            dfs(adj, v);
        }
    }
    // post-visite : tous les descendants de u sont explorés
}
```

Version itérative : remplacer la récursion par une pile explicite (`ArrayDeque`) —
utile quand la profondeur menace la pile d'appels.

## Temps de découverte et de fin

En horodatant chaque sommet (`decouverte[u]` au premier passage, `fin[u]` quand tout
son voisinage est traité), on obtient une structure en **parenthèses bien imbriquées** :
les intervalles [decouverte, fin] de deux sommets sont soit disjoints, soit emboîtés.

Cette structure classe les arêtes (en orienté) :

| Type d'arête (u, v) | Condition | Signification |
|---|---|---|
| d'arbre | v découvert via u | squelette du parcours |
| **arrière** (back) | v ancêtre de u encore « ouvert » | **il y a un cycle !** |
| avant (forward) | v descendant déjà fermé | raccourci |
| transversale (cross) | intervalles disjoints | entre branches |

## Complexité

**Temps : O(n + m)** avec listes d'adjacence, **espace : O(n)** (pile de récursion +
marquage) — comme BFS. Seul l'**ordre** d'exploration change.

## Usages classiques

- **Détection de cycle** : une arête arrière pendant le DFS ⇔ cycle.
- **Tri topologique** (graphe orienté acyclique) : trier par `fin` décroissant.
- **Composantes connexes** / fortement connexes (Kosaraju : deux DFS).
- Numérotations d'arbres, résolution de labyrinthes, backtracking en général.

Dans la visualisation, compare BFS et DFS sur le même graphe : la file devient une
pile et l'onde devient une plongée.

## Pièges d'examen

- DFS ne donne **pas** les plus courts chemins — il peut atteindre un voisin direct
  par un détour de 10 arêtes. C'est LA confusion BFS/DFS classique.
- La détection de cycle en orienté exige trois états (blanc/gris/noir) : une arête
  vers un sommet **gris** (ouvert) = cycle ; vers un **noir** (fermé) = pas forcément.
  En non orienté : un voisin visité qui n'est pas le parent = cycle.
- Tri topologique = ordre de **fin** décroissant — pas l'ordre de découverte.
- Récursif ou itératif, la complexité est la même ; mais l'ordre de visite peut
  différer (la pile explicite inverse l'ordre des voisins).
