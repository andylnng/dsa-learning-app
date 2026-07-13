# Augmentation de structure

## Intuition

Plutôt que d'inventer une nouvelle structure pour chaque besoin, on **augmente** une
structure existante : on ajoute à chaque nœud une **information supplémentaire**,
maintenue à jour par les opérations, qui permet de répondre à de nouvelles requêtes
efficacement.

La recette (celle du cours et de CLRS) :

1. **Choisir la structure de base** — souvent un arbre rouge-noir.
2. **Choisir l'information à ajouter** dans chaque nœud.
3. **Vérifier qu'elle est maintenable** lors des insertions/suppressions/rotations
   sans dégrader le O(log n).
4. **Écrire les nouvelles opérations** qui l'exploitent.

## La clé : une information « locale »

L'information ajoutée doit être **recalculable à partir du nœud et de ses enfants
seulement** :

> `info(n) = f(n, info(n.gauche), info(n.droit))`

Si c'est le cas, une insertion, une suppression ou une **rotation** n'invalide
l'information que sur le chemin modifié → mise à jour en O(log n), et O(1) par rotation.

## Exemple 1 : arbre de statistiques d'ordre

On stocke dans chaque nœud la **taille de son sous-arbre** :
`taille(n) = 1 + taille(n.gauche) + taille(n.droit)`.

Deux nouvelles requêtes en **O(log n)** :

```java
// le i-ième plus petit élément (i à partir de 1)
Noeud selectionner(Noeud n, int i) {
    int rang = taille(n.gauche) + 1;
    if (i == rang)  return n;
    if (i < rang)   return selectionner(n.gauche, i);
    return selectionner(n.droit, i - rang);
}

// le rang d'une clé : combien d'éléments lui sont ≤
int rang(Noeud racine, int cle) {
    int r = 0;
    Noeud n = racine;
    while (n != null) {
        if (cle < n.cle) n = n.gauche;
        else { r += taille(n.gauche) + 1; if (cle == n.cle) return r; n = n.droit; }
    }
    return r;
}
```

Lors d'une rotation, seules les tailles de `x` et `y` changent — recalcul O(1).

## Exemple 2 : arbre d'intervalles

Chaque nœud stocke un intervalle `[début, fin]` (clé = début) et le **max des fins**
de son sous-arbre : `maxFin(n) = max(n.fin, maxFin(n.gauche), maxFin(n.droit))`.

Requête : « trouve un intervalle qui chevauche `[a, b]` » en O(log n) — on descend à
gauche si `maxFin(gauche) ≥ a`, sinon à droite.

## Pourquoi le rouge-noir s'y prête bien

Le théorème d'augmentation (CLRS 14.1) : si l'information de chaque nœud ne dépend que
du nœud et de ses enfants, on peut la maintenir pendant insertion et suppression d'un
arbre rouge-noir **sans changer leur coût asymptotique O(log n)**.

## Pièges d'examen

- L'information doit être **locale** (fonction des enfants). Stocker « le rang global
  du nœud » casse : une seule insertion peut changer le rang de *tous* les nœuds → O(n).
- Dans `selectionner`, le rang local est `taille(gauche) + 1` — le +1 (le nœud
  lui-même) est l'oubli classique.
- Une rotation ne demande que la mise à jour des **deux** nœuds tournés (dans l'ordre :
  d'abord celui qui descend… non — d'abord le nouveau *bas*, puis le nouveau *haut*,
  puisque le haut dépend du bas).
- L'arbre d'intervalles est trié par **début** d'intervalle ; `maxFin` est
  l'augmentation, pas la clé.
