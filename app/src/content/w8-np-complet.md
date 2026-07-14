# Introduction à l'optimisation combinatoire et au NP-complet

## L'optimisation combinatoire

Un problème d'**optimisation combinatoire** : trouver, dans un ensemble **fini mais
gigantesque** de solutions candidates, celle qui minimise (ou maximise) un objectif.

Exemples : le plus court chemin (candidats : tous les chemins), le voyageur de
commerce (tous les ordres de visite : n!), le sac à dos (tous les sous-ensembles : 2ⁿ),
la couverture de sommets minimale…

Énumérer toutes les solutions est toujours *correct* — et presque toujours
*impraticable* (2ⁿ, n!). Tout le reste de la session est un catalogue de stratégies
pour faire mieux : **glouton** (cette semaine), **programmation dynamique** (semaine 9),
**branch and bound** (semaine 10). Mais avant : quels problèmes *peut-on* espérer
résoudre efficacement ?

## P, NP — l'essentiel

- **P** : les problèmes de décision résolubles en temps **polynomial** (n, n², n³…).
  Exemples : plus court chemin, tri, « ce graphe a-t-il un chemin d'Euler ? ».
- **NP** : les problèmes dont une solution proposée est **vérifiable** en temps
  polynomial. Trouver est peut-être dur ; vérifier est facile.
  Exemple : « ce graphe a-t-il un chemin hamiltonien ? » — donné un chemin, le
  vérifier est trivial ; en trouver un, personne ne sait le faire vite.
- Évidemment **P ⊆ NP** (si on sait résoudre vite, on sait vérifier vite).
  **P = NP ?** est LA question ouverte de l'informatique — réponse présumée : non.

## NP-complet

Un problème est **NP-complet** s'il est dans NP **et** que tout problème de NP s'y
**réduit** en temps polynomial : c'est un « plus dur de NP ». Conséquences pratiques :

- Résoudre *un seul* problème NP-complet en temps polynomial → P = NP.
- Ton problème est NP-complet ? N'espère pas d'algorithme exact rapide dans le cas
  général. Options : instances petites (backtracking/branch and bound), cas
  particuliers polynomiaux, **approximation**, heuristiques.

Le premier NP-complet historique : **SAT** (théorème de Cook-Levin, 1971). Depuis,
des centaines par réduction : hamiltonien, TSP (version décision), sac à dos,
couverture de sommets, coloration de graphe, clique…

## La frontière est fine : les paires jumelles

| Facile (P) | Dur (NP-complet) |
|---|---|
| chemin d'**Euler** (arêtes) | chemin **hamiltonien** (sommets) |
| plus court chemin | plus **long** chemin simple |
| arbre couvrant minimal (Prim !) | TSP |
| 2-coloration (biparti) | 3-coloration |
| couplage maximal | couverture de sommets minimale |

Deux énoncés presque identiques, deux mondes de complexité — c'est le message central
de la semaine.

## Et le glouton dans tout ça ?

Un algorithme **glouton** construit la solution choix par choix, en prenant à chaque
étape le meilleur choix **local**, sans jamais revenir en arrière. Quand ça marche
(sélection d'activités, Prim, Dijkstra), c'est rapide et élégant. Quand ça ne marche
pas (couverture de sommets), le glouton donne une **approximation** — parfois avec
garantie. Les sections suivantes déroulent les deux cas.

## Pièges d'examen

- NP ≠ « non polynomial » ! NP = *vérifiable* en temps polynomial
  (**N**ondeterministic **P**olynomial). Erreur éliminatoire classique.
- P ⊆ NP est un fait ; P ≠ NP est une conjecture. Ne les confonds pas.
- NP-complet = NP **et** NP-difficile. Un problème peut être NP-difficile sans être
  dans NP (p. ex. version optimisation du TSP).
- « Le TSP est NP-complet » : en toute rigueur, c'est sa **version décision**
  (« existe-t-il un tour de coût ≤ k ? ») qui l'est.
- Montrer qu'un problème est NP-complet : on réduit **depuis** un NP-complet connu
  **vers** ton problème — pas l'inverse. Le sens de la réduction est le piège favori.
