# Heap (monceau)

## Intuition

Un **heap binaire** (monceau) est un arbre binaire *presque complet* qui maintient une
seule promesse, la **propriété de heap** :

- **min-heap** : chaque parent ≤ ses enfants → le minimum est toujours à la racine ;
- **max-heap** : chaque parent ≥ ses enfants → le maximum est à la racine.

C'est *la* structure des **files de priorité** : accéder au plus prioritaire en O(1),
l'extraire ou insérer en O(log n). Attention : un heap n'est **pas** trié — seul le
sommet est garanti.

## Représentation par tableau

L'arbre étant presque complet, on le range dans un tableau **sans aucun pointeur** :

```
indices :   0   1   2   3   4   5 …
parent de i    → (i − 1) / 2
enfants de i   → 2i + 1  et  2i + 2
```

## Les deux mouvements fondamentaux

- **Percolation vers le haut** (*sift up*) — après une **insertion** en fin de tableau :
  tant que l'élément est plus petit que son parent (min-heap), on l'échange avec lui.
- **Percolation vers le bas** (*sift down*) — après une **extraction** du sommet : on
  met le dernier élément à la racine, puis on l'échange avec son plus petit enfant tant
  qu'il est plus grand que l'un d'eux.

```java
public class MinHeap {
    private final int[] t;
    private int taille;

    public MinHeap(int capacite) { t = new int[capacite]; }

    public void inserer(int v) {
        t[taille] = v;
        int i = taille++;
        while (i > 0 && t[i] < t[(i - 1) / 2]) {   // percolation vers le haut
            echanger(i, (i - 1) / 2);
            i = (i - 1) / 2;
        }
    }

    public int extraireMin() {
        int min = t[0];
        t[0] = t[--taille];
        int i = 0;
        while (true) {                              // percolation vers le bas
            int g = 2 * i + 1, d = 2 * i + 2, plusPetit = i;
            if (g < taille && t[g] < t[plusPetit]) plusPetit = g;
            if (d < taille && t[d] < t[plusPetit]) plusPetit = d;
            if (plusPetit == i) break;
            echanger(i, plusPetit);
            i = plusPetit;
        }
        return min;
    }

    private void echanger(int i, int j) { int tmp = t[i]; t[i] = t[j]; t[j] = tmp; }
}
```

## Complexités

| Opération | Coût |
|-----------|------|
| consulter le min/max (`peek`) | O(1) |
| insérer | O(log n) |
| extraire le min/max | O(log n) |
| **construire** un heap depuis n éléments (`heapify`) | **O(n)** — pas O(n log n) ! |
| recherche d'une valeur quelconque | O(n) |

La construction en O(n) (méthode de Floyd) percole vers le bas depuis le dernier parent
jusqu'à la racine : la plupart des nœuds sont près des feuilles et percolent peu.

## Usages

- **File de priorité** (`PriorityQueue` en Java — un min-heap par défaut).
- **Tri par tas** (heapsort) : construire un max-heap puis extraire n fois → O(n log n) en place.
- Dijkstra et Prim (semaine 8), fusion de k listes triées, les k plus grands éléments.

## Pièges d'examen

- Un heap n'est **pas un arbre binaire de recherche** : aucun ordre gauche/droite.
  Le parcours du tableau ne donne pas les éléments triés.
- `heapify` est O(n), mais insérer n éléments un à un coûte O(n log n) — distinction classique.
- La hauteur d'un heap de n éléments est ⌊log₂ n⌋ : c'est ce qui borne insertion et extraction.
- Dans `PriorityQueue` de Java, retirer un élément *arbitraire* (`remove(Object)`) est
  O(n), pas O(log n).
