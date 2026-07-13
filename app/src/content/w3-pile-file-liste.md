# Pile, file et liste

## Vue d'ensemble

Trois structures **linéaires** fondamentales, qui se distinguent par *où* on insère et
retire les éléments :

| Structure | Discipline | Insertion | Retrait | Image mentale |
|-----------|-----------|-----------|---------|----------------|
| **Pile** (stack) | LIFO — dernier entré, premier sorti | sommet (`push`) | sommet (`pop`) | pile d'assiettes |
| **File** (queue) | FIFO — premier entré, premier sorti | queue (`enqueue`) | tête (`dequeue`) | file d'attente |
| **Liste** (list) | accès par position | n'importe où | n'importe où | chaîne de wagons |

## La pile (stack)

Opérations : `push`, `pop`, `peek` (consulter le sommet sans retirer) — toutes en **O(1)**.

```java
Deque<Integer> pile = new ArrayDeque<>();
pile.push(3);          // [3]
pile.push(7);          // [7, 3]  — 7 au sommet
int sommet = pile.peek();  // 7
pile.pop();            // retire 7 → [3]
```

Usages : pile d'appels (récursion !), annulation (undo), évaluation d'expressions,
vérification de parenthèses équilibrées, parcours en profondeur (DFS).

> En Java, préfère `ArrayDeque` à la vieille classe `java.util.Stack` (synchronisée et
> héritée de `Vector`).

## La file (queue)

Opérations : `enqueue` (offrir en queue), `dequeue` (retirer en tête) — en **O(1)**.

```java
Queue<Integer> file = new ArrayDeque<>();
file.offer(3);         // [3]
file.offer(7);         // [3, 7]  — 3 en tête
int tete = file.poll(); // retire et retourne 3
```

Usages : parcours en largeur (BFS), files de tâches, tampons (buffers), ordonnancement.

Implémentation par tableau : **tableau circulaire** (deux indices tête/queue qui
s'enroulent avec le modulo) pour garder le O(1) sans décaler les éléments.

## La liste

- **Liste chaînée simple** : chaque nœud pointe vers le suivant.
- **Liste doublement chaînée** : pointeurs suivant *et* précédent (`LinkedList` en Java).
- **Tableau dynamique** (`ArrayList`) : un tableau redimensionné au besoin.

| Opération | `ArrayList` | Liste chaînée |
|-----------|-------------|---------------|
| accès par indice `get(i)` | **O(1)** | O(n) |
| insertion/suppression en tête | O(n) (décalage) | **O(1)** |
| insertion/suppression au milieu (position connue) | O(n) | **O(1)** |
| recherche d'une valeur | O(n) | O(n) |
| mémoire | compacte | +2 pointeurs par nœud |

L'`ArrayList` double sa capacité quand elle est pleine : l'ajout en fin est **O(1)
amorti** — la plupart des ajouts sont O(1), la copie occasionnelle O(n) se « répartit ».

## Pièges d'examen

- « Insérer dans une liste chaînée est O(1) » — seulement si on **tient déjà** le nœud
  précédent ; trouver la position coûte O(n).
- Une pile et une file s'implémentent chacune avec l'autre (question classique : une
  file avec deux piles — amortie O(1)).
- Le O(1) amorti de l'`ArrayList` n'est pas un O(1) pire cas : un ajout précis peut
  coûter O(n) au moment du redimensionnement.
- BFS ↔ file, DFS ↔ pile : cette correspondance revient sans arrêt (semaine 6, graphes).
