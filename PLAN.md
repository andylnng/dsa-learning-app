# Plan — App web d'apprentissage LOG320 (Structures de données et algorithmes)

Application web personnelle pour suivre le cours **LOG320 (ÉTS)**, basée sur le livre
*Data Structures and Algorithms Made Easy in Java* (Narasimha Karumanchi) et alignée sur
le contenu officiel du cours (session 2026-1).

## Objectif

Un compagnon de cours : leçons en **français** (terminologie du cours), organisées selon
les semaines de LOG320, avec des **visualisations interactives** pour chaque structure de
données et algorithme clé. Progression sauvegardée localement (localStorage).

## Pile technologique

- **React 18 + Vite + TypeScript** — SPA sans backend
- **Tailwind CSS** — styles
- Contenu des leçons en Markdown structuré, chargé statiquement
- Visualisations : composants React + SVG maison (pas de lib externe lourde)
- Déploiement : GitHub Pages ou Vercel (statique)

## Modules (contenu officiel du cours, semaine par semaine)

| Sem. | Module | Notions | Chapitres du livre | Visualisations prévues |
|------|--------|---------|--------------------|------------------------|
| 1 | Analyse asymptotique et tris de base | Grand O, grand Ω, grand Θ ; tri par sélection, par insertion, à bulles | 1, 10 | Courbes de croissance comparées ; les 3 tris animés côte à côte |
| 2 | Récursivité et analyse | Récursion, arbre de récursivité, diviser pour régner, retour en arrière ; analyse : méthode itérative, arbre de récursivité, méthode générale (théorème maître) | 2, 18 | Pile d'appels animée ; arbre de récursivité interactif ; N-reines pas à pas |
| 3 | Arbres de jeu et structures de base | Minimax, alpha-beta, heuristiques ; pile, file, liste, heap | 3–5, 7 + **complément** (minimax/alpha-beta absents du livre) | Arbre de jeu avec élagage alpha-beta pas à pas ; pile/file/heap animés |
| 4 | Arbre binaire de recherche et arbre rouge-noir I | BST : recherche, insertion, suppression ; rouge-noir : rotations, insertion | 6 + **complément** (le livre couvre peu le rouge-noir) | BST interactif ; rotations et recoloration rouge-noir pas à pas |
| 5 | Arbre rouge-noir II et hachage | Suppression rouge-noir, augmentation de structure ; tables de hachage | 13–14 + complément | Suppression RN animée ; hachage : collisions (chaînage / adressage ouvert) |
| 6 | Graphes | Définitions, BFS, DFS, chemin d'Euler, chemin hamiltonien ; exercices intra | 9 | BFS/DFS pas à pas sur graphe éditable ; recherche de chemin d'Euler |
| 7 | **Révision intra** | Récapitulatif semaines 1–6 + exercices type examen | — | Fiches de révision + quiz de synthèse |
| 8 | Optimisation combinatoire et algorithmes gloutons | Survol NP-complet ; Dijkstra, A*, sélection d'activités, Prim, couverture de sommets | 17, 20 + **complément** (A* absent du livre) | Dijkstra et A* comparés sur grille ; Prim animé ; sélection d'activités |
| 9 | Programmation dynamique | Introduction, mémoïsation, exemples classiques | 19 | Table DP remplie pas à pas (Fibonacci, sac à dos, LCS) |
| 10 | Branch and bound et algorithmes probabilistes | Séparation et évaluation ; algorithmes probabilistes | 16, 21 + complément | Arbre d'exploration avec élagage par borne ; Monte-Carlo visualisé |
| 11 | Recherche dans les chaînes | Naïf, Boyer-Moore, Knuth-Morris-Pratt, distance de Levenshtein | 15, 19 | Comparaison animée naïf/BM/KMP ; matrice de Levenshtein pas à pas |
| 12 | Algorithmes parallèles | Notions de parallélisme | **complément** (absent du livre) | Diagramme fork/join ; accélération et loi d'Amdahl |
| 13 | **Révision finale** | Exercices (accent sur la programmation dynamique) | — | Quiz de synthèse + problèmes DP guidés |

**Compléments** : minimax/alpha-beta, arbres rouge-noir (en profondeur), A*,
algorithmes probabilistes et algorithmes parallèles sont peu ou pas couverts par le
livre — le contenu de ces leçons sera rédigé à partir des références classiques (CLRS,
notes de cours usuelles), toujours en original.

## Fonctionnalités

1. **Lecteur de leçons** — barre latérale (semaines → sections), typographie soignée,
   blocs de code Java avec coloration syntaxique, notes de complexité mises en évidence.
2. **Visualisations interactives** — contrôles lecture/pause/pas-à-pas, vitesse réglable,
   données d'entrée modifiables.
3. **Suivi de progression léger** — case « section lue » ; écran d'accueil « reprendre où
   j'en étais » ; pourcentage par semaine. Stocké dans localStorage.
4. **Révision intra/finale** — semaines 7 et 13 : fiches récapitulatives et quiz.
5. **Recherche** — recherche simple dans les titres de sections.

## Contenu

- Leçons **rédigées en français** (originales — pas de reproduction verbatim du livre
  sous droit d'auteur), termes techniques anglais usuels conservés entre parenthèses.
- Exemples de code en **Java** (langage du livre et des travaux pratiques du cours).
- Chaque section : intuition → fonctionnement → code → complexité → pièges d'examen.

## Étapes de réalisation

1. **Scaffold** : Vite + React + TS + Tailwind, routing, layout (sidebar + lecteur).
2. **Moteur de contenu** : schéma semaines/sections, rendu markdown, progression localStorage.
3. **Semaines 1–2** (analyse, tris de base, récursivité) + premières visualisations.
4. **Semaines 3–6** (arbres de jeu, structures de base, BST/rouge-noir, hachage, graphes)
   — le cœur visuel de l'app — puis module révision intra.
5. **Semaines 8–12** (glouton, DP, branch and bound, chaînes, parallèle).
6. **Polissage** : révision finale, recherche, responsive, mode sombre, déploiement.
