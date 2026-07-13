# Retour en arrière (backtracking)

## Intuition

Le **retour en arrière** explore l'espace des solutions comme un labyrinthe : on avance
choix par choix ; dès qu'un choix mène à une impasse (une contrainte est violée), on
**revient en arrière** au dernier choix et on essaie l'option suivante.

C'est une recherche **en profondeur** dans l'arbre des solutions partielles, avec
**élagage** : on coupe une branche entière dès qu'on sait qu'elle ne peut plus mener à
une solution — sans attendre de l'avoir explorée au complet.

## Le squelette générique

```java
boolean backtrack(EtatPartiel etat) {
    if (etat.estComplet()) {
        return true;                     // solution trouvée
    }
    for (Choix c : etat.choixPossibles()) {
        if (etat.estValide(c)) {         // élagage : on ne descend que si viable
            etat.appliquer(c);
            if (backtrack(etat)) {
                return true;
            }
            etat.annuler(c);             // ← le « retour en arrière »
        }
    }
    return false;                        // aucune option ne marche : impasse
}
```

Les trois moments clés : **appliquer**, **récurser**, **annuler**. L'annulation doit
remettre l'état *exactement* comme avant.

## L'exemple canonique : les N reines

Placer N reines sur un échiquier N×N sans qu'aucune n'en menace une autre. On place une
reine par ligne ; le choix de la ligne `i` est la colonne. Contrainte : pas la même
colonne ni la même diagonale qu'une reine déjà posée.

```java
public static boolean nReines(int[] colonnes, int ligne) {
    int n = colonnes.length;
    if (ligne == n) return true;                 // toutes placées
    for (int col = 0; col < n; col++) {
        if (estValide(colonnes, ligne, col)) {
            colonnes[ligne] = col;               // appliquer
            if (nReines(colonnes, ligne + 1)) return true;
            colonnes[ligne] = -1;                // annuler
        }
    }
    return false;
}

private static boolean estValide(int[] colonnes, int ligne, int col) {
    for (int i = 0; i < ligne; i++) {
        if (colonnes[i] == col) return false;                       // même colonne
        if (Math.abs(colonnes[i] - col) == ligne - i) return false; // même diagonale
    }
    return true;
}
```

Regarde la visualisation ci-dessous : chaque impasse déclenche un retour en arrière
visible.

## Complexité

Dans le pire cas, le retour en arrière reste **exponentiel** (l'arbre des choix a
jusqu'à `N!` ou `2ⁿ` feuilles selon le problème). Tout l'enjeu est la qualité de
l'élagage : plus la validation coupe tôt, moins on explore. C'est une différence de
*pratique*, pas de classe de complexité.

Applications classiques : N reines, sudoku, coloration de graphe, somme de
sous-ensembles, génération de permutations/combinaisons.

## Pièges d'examen

- Backtracking ≠ force brute : la force brute génère les solutions *complètes* puis les
  teste ; le backtracking élague les solutions *partielles* invalides.
- Oublier le `annuler(c)` est LE bug classique — l'état reste pollué pour les frères.
- Le backtracking trouve *une* solution (ou toutes, si on continue au lieu de
  retourner `true`) ; il ne garantit pas la *meilleure* — ça, c'est branch and bound
  (semaine 10).
