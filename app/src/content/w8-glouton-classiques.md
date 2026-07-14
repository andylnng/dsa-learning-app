# Sélection d'activités, Prim et couverture de sommets

Trois problèmes, trois visages du glouton : un cas où il est **optimal** (activités),
un deuxième optimal sur les graphes (Prim), et un cas NP-complet où il ne donne
qu'une **approximation** (couverture de sommets).

## 1. Sélection d'activités — le glouton optimal

n activités avec début `d_i` et fin `f_i` ; en choisir un **maximum** de compatibles
(sans chevauchement).

**Le bon choix glouton : prendre l'activité qui finit le plus tôt**, éliminer celles
qui la chevauchent, recommencer.

```java
// activites triées par fin croissante — O(n log n)
List<int[]> choisies = new ArrayList<>();
int finDerniere = Integer.MIN_VALUE;
for (int[] a : activites) {          // a = [debut, fin]
    if (a[0] >= finDerniere) {
        choisies.add(a);
        finDerniere = a[1];
    }
}
```

**Argument d'échange** (le schéma de preuve glouton) : si une solution optimale ne
commence pas par l'activité qui finit le plus tôt, on peut échanger sa première
activité contre celle-ci sans rien perdre — donc il existe une optimale qui commence
par le choix glouton ; on itère.

⚠ Trier par **début**, par **durée** ou par **nombre de conflits** donne des
contre-exemples — essaie-les dans la visualisation.

## 2. Prim — l'arbre couvrant minimal (ACM)

Relier tous les sommets d'un graphe pondéré connexe à coût total minimal : c'est
l'**arbre couvrant minimal** (n − 1 arêtes, pas de cycle).

**Prim** fait pousser un arbre depuis un sommet : à chaque étape, ajouter **l'arête la
moins chère qui sort de l'arbre** (relie l'arbre à un sommet extérieur).

```java
// même squelette que Dijkstra, mais la priorité est le POIDS DE L'ARÊTE
// (pas la distance cumulée depuis le départ !)
pq.offer(new int[]{0, depart});
while (!pq.isEmpty()) {
    int[] top = pq.poll();
    int u = top[1];
    if (dansArbre[u]) continue;
    dansArbre[u] = true;
    coutTotal += top[0];
    for (int[] arete : adj.get(u)) {
        int v = arete[0], p = arete[1];
        if (!dansArbre[v]) pq.offer(new int[]{p, v});   // p, pas dist[u] + p
    }
}
```

Correction : la **propriété de la coupe** — pour toute partition (S, V∖S), l'arête
minimale qui traverse la coupe appartient à un ACM. Complexité : **O(m log n)** avec
un tas. (Kruskal, l'autre glouton d'ACM, trie les arêtes et utilise les ensembles
disjoints.)

## 3. Couverture de sommets — le glouton approché

Choisir un ensemble **minimum** de sommets touchant toutes les arêtes. Version
décision : **NP-complet**. On ne cherche plus l'optimal — on approxime :

**Glouton 2-approché** : tant qu'il reste des arêtes, prendre une arête (u, v)
quelconque, mettre **u et v** dans la couverture, effacer toutes les arêtes touchées.

- La solution obtenue est ≤ **2 ×** l'optimum : les arêtes choisies sont deux à deux
  disjointes, et toute couverture doit prendre au moins un sommet de chacune.
- Paradoxe pédagogique : le glouton « plus malin » (prendre le sommet de plus haut
  degré) a une garantie **pire** (facteur log n) — plus malin localement n'est pas
  meilleur globalement.

## Quand le glouton est-il correct ?

1. **Choix glouton sûr** : un meilleur choix local appartient à une solution optimale
   (prouvé par argument d'échange).
2. **Sous-structure optimale** : après le choix, le reste du problème est le même
   problème en plus petit.

Sans preuve, un glouton n'est qu'une heuristique — c'est la leçon de la couverture
de sommets.

## Pièges d'examen

- Sélection d'activités : le critère correct est la **fin la plus tôt**. Début, durée,
  conflits : tous faux (sache produire un contre-exemple pour chacun).
- Prim ≠ Dijkstra : priorité = **poids de l'arête** vs **distance cumulée**. Les deux
  déroulés se ressemblent — c'est le piège favori des examens.
- Un ACM n'est pas un arbre de plus courts chemins : le chemin dans l'ACM entre deux
  sommets peut être plus long que leur plus court chemin.
- La 2-approximation prend les **deux extrémités** de l'arête — en prendre une seule
  ne donne aucune garantie.
- « Le glouton marche ici » exige une **preuve** (échange) — pas juste des exemples
  où ça marche.
