# Exercices pour l'examen intra

Huit exercices dans l'esprit de l'intra, couvrant les semaines 1 à 6. Essaie chaque
exercice **avant** d'ouvrir la solution.

## Exercice 1 — Analyse asymptotique

Donne l'ordre de grandeur exact (Θ) du nombre d'exécutions de `compteur++` :

```java
for (int i = 1; i < n; i = i * 2) {
    for (int j = 0; j < n; j++) {
        compteur++;
    }
}
```

<details>
<summary>Solution</summary>

La boucle externe s'exécute Θ(log n) fois (i double à chaque tour), la boucle interne
Θ(n) fois à chaque itération. Total : **Θ(n log n)**.

</details>

## Exercice 2 — Récurrences (les trois méthodes)

Résous par la méthode de ton choix, puis vérifie avec la méthode générale quand elle
s'applique :

a) `T(n) = 4T(n/2) + n`  b) `T(n) = T(n/2) + n`  c) `T(n) = T(n−1) + 1`

<details>
<summary>Solution</summary>

a) `log₂ 4 = 2`, `f(n) = n = O(n^(2−ε))` → **cas 1 : Θ(n²)** (les feuilles dominent).

b) `log₂ 1 = 0`, `f(n) = n = Ω(n^(0+ε))`, régularité OK → **cas 3 : Θ(n)** (la racine domine).

c) Méthode générale **inapplicable** (pas de division). Itérative :
T(n) = T(n−1) + 1 = … = T(0) + n → **Θ(n)**.

</details>

## Exercice 3 — Tris de base

Un tableau est « presque trié » : chaque élément est à au plus 2 positions de sa place
finale. Lequel des tris — sélection, insertion, bulles — est le plus rapide sur ce
tableau, et quelle est sa complexité ?

<details>
<summary>Solution</summary>

**Le tri par insertion**, en **Θ(n)** : le nombre de décalages égale le nombre
d'inversions, et ici chaque élément en crée au plus 2 → O(n) au total.
Le tri par sélection reste Θ(n²) (il compare toujours tout) ; le tri à bulles optimisé
finit en O(n) aussi mais avec ~2 passes complètes — l'insertion fait strictement moins
de travail.

</details>

## Exercice 4 — Minimax et élagage alpha-beta

Racine MAX, trois nœuds MIN, feuilles de gauche à droite : [6, 8] , [2, x] , [7, 9].

a) Valeur minimax de la racine (en fonction de x) ?
b) Avec alpha-beta (ordre gauche→droite), quelles feuilles sont élaguées ?

<details>
<summary>Solution</summary>

a) Branche 1 : min(6, 8) = 6. Branche 2 : min(2, x) ≤ 2 < 6 — jamais choisie.
Branche 3 : min(7, 9) = 7. **Racine = max(6, min(2,x), 7) = 7**, quel que soit x.

b) Après la branche 1, α = 6. Branche 2 : première feuille 2 → β = 2 ≤ α = 6 →
**coupure : x n'est jamais évaluée**. Branche 3 : 7 puis 9, pas de coupure
(β passe de 7 à … 7 > α ; après 7, α final 7). Une seule feuille élaguée : **x**.

</details>

## Exercice 5 — ABR : suppression

Dans l'ABR obtenu en insérant 50, 30, 70, 20, 40, 60, 80, 35, 45 (dans cet ordre),
on supprime 30 (remplacement par le successeur). Dessine l'arbre résultat.

<details>
<summary>Solution</summary>

30 a deux enfants (20 et 40). Son successeur est le min du sous-arbre droit :
**35**. On copie 35 à la place de 30, puis on supprime l'ancien 35 (feuille).

```
          50
        /    \
      35      70
     /  \    /  \
   20    40 60   80
           \
            45
```

Le nœud 35 a maintenant pour enfants 20 et 40, et 40 garde son enfant droit 45.

</details>

## Exercice 6 — Arbre rouge-noir

On insère 10, 20, 30 (dans cet ordre) dans un arbre rouge-noir vide.
Donne l'arbre après chaque insertion (couleurs comprises), en nommant le cas appliqué.

<details>
<summary>Solution</summary>

- **10** : racine, forcée **noire**. `10(N)`
- **20** : inséré rouge sous 10, parent noir → aucune violation. `10(N) – 20(R)`
- **30** : inséré rouge sous 20 → violation (20 et 30 rouges). Oncle = NIL = **noir**,
  configuration ligne droite → **cas 3** : rotation gauche autour de 10 + échange de
  couleurs. Résultat : `20(N)` avec enfants `10(R)` et `30(R)`.

</details>

## Exercice 7 — Table de hachage

Table de taille m = 7, h(k) = k mod 7, **sondage linéaire**. Insère, dans l'ordre :
19, 26, 13, 48, 17. Donne l'état final du tableau (indices 0 à 6).

<details>
<summary>Solution</summary>

- 19 → h = 5 : case 5.
- 26 → h = 5 : occupée → 6. Case 6.
- 13 → h = 6 : occupée → 0. Case 0.
- 48 → h = 6 : occupée → 0 occupée → 1. Case 1.
- 17 → h = 3 : case 3.

| 0 | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|
| 13 | 48 | · | 17 | · | 19 | 26 |

Regroupement primaire bien visible : le paquet 5-6-0-1.

</details>

## Exercice 8 — Graphes : BFS et Euler

Graphe non orienté : arêtes A–B, A–C, B–C, B–D, C–D, D–E.

a) Ordre de visite d'un BFS depuis A (voisins traités en ordre alphabétique) ?
b) Ce graphe possède-t-il un chemin d'Euler ? Un circuit ? Justifie par les degrés.

<details>
<summary>Solution</summary>

a) File : A → découvre B, C → B découvre D → C (rien de neuf) → D découvre E.
**Ordre : A, B, C, D, E** (distances 0, 1, 1, 2, 3).

b) Degrés : A=2, B=3, C=3, D=3, E=1 → **4 sommets impairs** (B, C, D, E) →
**ni chemin ni circuit d'Euler**. (Il en faudrait 0 pour un circuit, exactement 2
pour un chemin.)

</details>

> **Conseil d'examen** : sur les déroulés (alpha-beta, rouge-noir, hachage, BFS),
> écris chaque étape — la démarche vaut des points même si une étape glisse.
