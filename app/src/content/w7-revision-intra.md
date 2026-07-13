# Révision intra : fiche récapitulative

Tout ce qui peut tomber à l'intra (semaines 1 à 6), condensé. Repasse chaque ligne :
si un terme n'évoque pas immédiatement l'idée, retourne à la section correspondante.

## Les complexités à connaître par cœur

| Algorithme / opération | Meilleur | Moyen | Pire | Espace |
|---|---|---|---|---|
| tri par sélection | Θ(n²) | Θ(n²) | Θ(n²) | O(1) |
| tri par insertion | **Θ(n)** | Θ(n²) | Θ(n²) | O(1) |
| tri à bulles (optimisé) | Θ(n) | Θ(n²) | Θ(n²) | O(1) |
| recherche binaire | O(1) | Θ(log n) | Θ(log n) | O(1) |
| pile / file (push, pop…) | — | — | O(1) | — |
| heap : insérer / extraire | — | — | O(log n) | — |
| heapify (construction) | — | — | **O(n)** | — |
| ABR : toutes opérations | — | O(log n)* | **O(n)** | — |
| rouge-noir : toutes opérations | — | — | **O(log n)** | — |
| hachage : chercher/insérer | — | **O(1)**† | O(n) | — |
| BFS / DFS | — | — | O(n + m) | O(n) |
| minimax | — | — | O(b^d) | O(d) |
| alpha-beta (bon ordre) | — | — | O(b^(d/2)) | O(d) |

\* si l'arbre est équilibré † sous hachage uniforme, α = O(1)

## Le théorème maître en 10 secondes

`T(n) = a·T(n/b) + f(n)` — compare f(n) au pivot `n^(log_b a)` :
plus petit (polynomialement) → **Θ(n^(log_b a))** ; égal → **× log n** ;
plus grand + régularité → **Θ(f(n))**. Inapplicable si pas de division (T(n−1)).

## Les invariants à réciter

- **ABR** : sous-arbre gauche < clé < sous-arbre droit — sur **tout** le sous-arbre.
- **Rouge-noir** : racine noire ; pas deux rouges de suite ; hauteur noire uniforme →
  h ≤ 2·log₂(n+1). Insertion : rouge puis réparation (recoloration si oncle rouge,
  sinon 1–2 rotations). Suppression : problème seulement si le nœud retiré est noir.
- **Min-heap** : parent ≤ enfants ; tableau : parent(i) = (i−1)/2. Pas un ABR !
- **Hachage** : α = n/m ; chaînage tolère α > 1, adressage ouvert exige α < 1 et des
  pierres tombales à la suppression.
- **Euler** : 0 sommet impair → circuit ; 2 → chemin ; sinon rien (+ connexité !).
  Hamilton : NP-complet, pas de critère simple.

## Les correspondances structure ↔ algorithme

| Structure | Algorithme |
|---|---|
| file (FIFO) | BFS — plus courts chemins non pondérés |
| pile (LIFO) | DFS, backtracking, pile d'appels |
| heap / file de priorité | Dijkstra, Prim (post-intra), heapsort |
| récursion | diviser pour régner, arbre de récursivité |

## Les distinctions qui piègent

- O est une **borne**, pas « le pire cas » ; Θ est exact.
- Insertion ≥ sélection sur tableau trié : **insertion Θ(n)**, sélection toujours Θ(n²).
- BFS = plus court chemin **non pondéré** seulement ; DFS ne donne aucun plus court chemin.
- heapify O(n) ≠ n insertions O(n log n).
- Euler (arêtes, facile) ≠ Hamilton (sommets, NP-complet).
- Alpha-beta retourne la **même valeur** que minimax — il explore juste moins.
- ABR : successeur = min du sous-arbre droit ; la suppression à deux enfants s'y ramène.

## Stratégie d'examen

1. Les déroulés pas à pas (alpha-beta, rouge-noir, hachage, BFS/DFS) rapportent des
   points à chaque étape écrite : montre tout.
2. Pour une complexité, cite la **représentation** (listes d'adjacence) et le **cas**
   (pire, moyen, amorti).
3. Feuille de notes fournie : réserve-la aux tableaux ci-dessus, pas aux définitions
   que tu connais.
4. Refais les 8 exercices de la semaine 6 en te chronométrant.
