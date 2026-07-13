export interface Section {
  id: string
  title: string
  /** Nom du fichier markdown dans src/content (sans extension) */
  content?: string
  /** Clé d'une visualisation interactive à afficher dans la leçon */
  viz?: string
}

export interface Week {
  number: number
  title: string
  /** Notions du plan de cours couvertes cette semaine */
  notions: string[]
  sections: Section[]
  exam?: boolean
}

export const curriculum: Week[] = [
  {
    number: 1,
    title: 'Analyse asymptotique et tris de base',
    notions: ['Grand O, grand Ω, grand Θ', 'Tri par sélection', 'Tri par insertion', 'Tri à bulles'],
    sections: [
      { id: 'w1-analyse', title: 'Analyse asymptotique : O, Ω et Θ', content: 'w1-analyse', viz: 'croissance' },
      { id: 'w1-tri-selection', title: 'Tri par sélection', content: 'w1-tri-selection', viz: 'tri:selection' },
      { id: 'w1-tri-insertion', title: 'Tri par insertion', content: 'w1-tri-insertion', viz: 'tri:insertion' },
      { id: 'w1-tri-bulles', title: 'Tri à bulles', content: 'w1-tri-bulles', viz: 'tri:bulles' },
    ],
  },
  {
    number: 2,
    title: 'Récursivité et analyse des récurrences',
    notions: [
      'Récursion et arbre de récursivité',
      'Diviser pour régner',
      'Retour en arrière (backtracking)',
      'Analyse : méthode itérative, arbre de récursivité, méthode générale',
    ],
    sections: [
      { id: 'w2-recursion', title: 'Rappel sur la récursion', content: 'w2-recursion', viz: 'pile-appels' },
      {
        id: 'w2-arbre-recursivite',
        title: "L'arbre de récursivité",
        content: 'w2-arbre-recursivite',
        viz: 'arbre-recursion',
      },
      { id: 'w2-diviser-regner', title: 'Diviser pour régner', content: 'w2-diviser-regner' },
      { id: 'w2-backtracking', title: 'Retour en arrière (backtracking)', content: 'w2-backtracking', viz: 'n-reines' },
      {
        id: 'w2-analyse-recurrences',
        title: 'Analyse des récurrences : itérative, arbre, méthode générale',
        content: 'w2-analyse-recurrences',
      },
    ],
  },
  {
    number: 3,
    title: 'Arbres de jeu et structures de base',
    notions: ['Minimax', 'Alpha-beta', 'Heuristiques', 'Pile, file, liste', 'Heap'],
    sections: [
      { id: 'w3-minimax', title: 'Arbres de jeu : algorithme Minimax' },
      { id: 'w3-alphabeta', title: 'Élagage alpha-beta et heuristiques' },
      { id: 'w3-pile-file-liste', title: 'Pile, file et liste' },
      { id: 'w3-heap', title: 'Heap (monceau)' },
    ],
  },
  {
    number: 4,
    title: 'Arbre binaire de recherche et arbre rouge-noir I',
    notions: ['BST : recherche, insertion, suppression', 'Rouge-noir : rotation, insertion'],
    sections: [
      { id: 'w4-bst-operations', title: 'BST : opérations de base et recherche' },
      { id: 'w4-bst-insertion-suppression', title: 'BST : insertion et suppression' },
      { id: 'w4-rn-rotation', title: 'Arbre rouge-noir : rotations' },
      { id: 'w4-rn-insertion', title: 'Arbre rouge-noir : insertion' },
    ],
  },
  {
    number: 5,
    title: 'Arbre rouge-noir II et table de hachage',
    notions: ['Rouge-noir : suppression', 'Augmentation de structure', 'Table de hachage'],
    sections: [
      { id: 'w5-rn-suppression', title: 'Arbre rouge-noir : suppression' },
      { id: 'w5-augmentation', title: 'Augmentation de structure' },
      { id: 'w5-hachage', title: 'Table de hachage' },
    ],
  },
  {
    number: 6,
    title: 'Graphes',
    notions: ['Définitions', 'BFS', 'DFS', "Chemin d'Euler", 'Chemin hamiltonien'],
    sections: [
      { id: 'w6-graphes-intro', title: 'Introduction et définitions' },
      { id: 'w6-bfs', title: "Recherche en largeur d'abord (BFS)" },
      { id: 'w6-dfs', title: "Recherche en profondeur d'abord (DFS)" },
      { id: 'w6-euler-hamilton', title: "Chemin d'Euler et chemin hamiltonien" },
      { id: 'w6-exercices-intra', title: "Exercices pour l'examen intra" },
    ],
  },
  {
    number: 7,
    title: 'Examen intra',
    notions: ['Récapitulatif des semaines 1 à 6'],
    exam: true,
    sections: [{ id: 'w7-revision-intra', title: 'Révision intra : fiches et exercices' }],
  },
  {
    number: 8,
    title: 'Optimisation combinatoire et algorithmes gloutons',
    notions: ['Survol du NP-complet', 'Dijkstra', 'A*', "Sélection d'activités", 'Prim', 'Couverture de sommets'],
    sections: [
      { id: 'w8-np-complet', title: "Introduction à l'optimisation combinatoire et au NP-complet" },
      { id: 'w8-dijkstra', title: 'Dijkstra' },
      { id: 'w8-astar', title: 'A*' },
      { id: 'w8-glouton-classiques', title: "Sélection d'activités, Prim et couverture de sommets" },
    ],
  },
  {
    number: 9,
    title: 'Programmation dynamique',
    notions: ['Introduction', 'Mémoïsation', 'Exemples classiques'],
    sections: [
      { id: 'w9-dp-intro', title: 'Introduction à la programmation dynamique' },
      { id: 'w9-memoisation', title: 'Mémoïsation' },
      { id: 'w9-dp-exemples', title: 'Exemples classiques' },
    ],
  },
  {
    number: 10,
    title: 'Branch and bound et algorithmes probabilistes',
    notions: ['Séparation et évaluation', 'Algorithmes probabilistes'],
    sections: [
      { id: 'w10-branch-bound', title: 'Branch and bound' },
      { id: 'w10-probabilistes', title: 'Algorithmes probabilistes' },
    ],
  },
  {
    number: 11,
    title: 'Recherche dans les chaînes de caractères',
    notions: ['Algorithme naïf', 'Boyer-Moore', 'Knuth-Morris-Pratt', 'Distance de Levenshtein'],
    sections: [
      { id: 'w11-naif', title: 'Algorithme naïf' },
      { id: 'w11-boyer-moore', title: 'Boyer-Moore' },
      { id: 'w11-kmp', title: 'Knuth-Morris-Pratt' },
      { id: 'w11-levenshtein', title: 'Distance de Levenshtein' },
    ],
  },
  {
    number: 12,
    title: 'Algorithmes parallèles',
    notions: ['Notions de parallélisme'],
    sections: [{ id: 'w12-paralleles', title: 'Algorithmes parallèles' }],
  },
  {
    number: 13,
    title: 'Révision finale',
    notions: ['Exercices pour l’examen final (accent sur la programmation dynamique)'],
    exam: true,
    sections: [{ id: 'w13-revision-finale', title: 'Révision finale : exercices' }],
  },
]

export function findSection(sectionId: string): { week: Week; section: Section } | undefined {
  for (const week of curriculum) {
    const section = week.sections.find((s) => s.id === sectionId)
    if (section) return { week, section }
  }
  return undefined
}

export const allSectionIds = curriculum.flatMap((w) => w.sections.map((s) => s.id))
