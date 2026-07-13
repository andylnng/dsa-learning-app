# Arbre rouge-noir : suppression

## Vue d'ensemble

Comme l'insertion, la suppression se fait en deux temps : une **suppression d'ABR
ordinaire**, puis une **réparation** si les propriétés rouge-noir sont violées.

La question centrale : **quelle couleur avait le nœud effectivement retiré ?**

- Il était **rouge** → aucune propriété ne casse (la hauteur noire ne change pas,
  pas de deux rouges créés). **Rien à réparer.**
- Il était **noir** → tous les chemins qui passaient par lui ont perdu un nœud noir :
  la propriété 5 (hauteur noire uniforme) est violée. C'est le cas difficile.

On modélise le déficit par un **« double noir »** : le nœud qui remplace le supprimé
porte un noir *en trop* qu'il faut écouler.

## Rappel : qui est « effectivement retiré » ?

Comme dans un ABR, si le nœud à supprimer a deux enfants, on copie la clé de son
**successeur** et on supprime le successeur (qui a au plus un enfant). Le nœud
*physiquement* retiré a donc toujours **au plus un enfant** — et c'est *sa* couleur
qui compte.

Cas immédiat : si le nœud retiré est noir et que son remplaçant est **rouge**, on le
recolore simplement en noir. Fini.

## La réparation du double noir : 4 cas

Soit `x` le nœud double-noir et `f` son **frère** (l'autre enfant du parent).
Configuration décrite avec `x` à gauche (les cas droits sont les miroirs) :

### Cas 1 — le frère `f` est rouge

Rotation autour du parent + échange de couleurs parent/frère. Le nouveau frère de `x`
est maintenant noir → on retombe sur les cas 2, 3 ou 4.

### Cas 2 — frère noir, ses deux enfants noirs

On **recolore `f` en rouge** : le déficit remonte au parent. Si le parent était rouge,
on le noircit et c'est terminé ; sinon il devient double-noir et on recommence plus haut.

### Cas 3 — frère noir, son enfant *proche* rouge, son enfant *lointain* noir

Rotation autour de `f` + échange de couleurs : l'enfant rouge lointain apparaît →
on retombe sur le cas 4.

### Cas 4 — frère noir, son enfant *lointain* rouge

Rotation autour du **parent**, le frère prend la couleur du parent, parent et enfant
lointain deviennent noirs. **Le déficit est absorbé — terminé.**

```java
// schéma (x à gauche de son parent ; miroir sinon)
while (x != racine && couleur(x) == NOIR) {
    Noeud f = frere(x);
    if (couleur(f) == ROUGE) {                        // cas 1
        f.couleur = NOIR; x.parent.couleur = ROUGE;
        rotationGauche(x.parent);
    } else if (couleur(f.gauche) == NOIR && couleur(f.droit) == NOIR) {
        f.couleur = ROUGE;                            // cas 2 : le déficit remonte
        x = x.parent;
    } else {
        if (couleur(f.droit) == NOIR) {               // cas 3 → cas 4
            f.gauche.couleur = NOIR; f.couleur = ROUGE;
            rotationDroite(f);
        }
        f = frere(x);                                 // cas 4 : absorption
        f.couleur = x.parent.couleur;
        x.parent.couleur = NOIR; f.droit.couleur = NOIR;
        rotationGauche(x.parent);
        x = racine;                                   // terminé
    }
}
x.couleur = NOIR;
```

## Complexité

- Seul le **cas 2** fait remonter la boucle (O(log n) itérations possibles).
- Les cas 1, 3, 4 mènent à la terminaison avec **au plus 3 rotations** au total.
- **Total : O(log n)**, rotations en nombre constant.

Déroule la visualisation ci-dessous : supprime des nœuds et observe quel cas s'applique.

## Pièges d'examen

- La couleur qui compte est celle du nœud **physiquement retiré** (le successeur dans
  le cas à deux enfants), pas celle du nœud dont on a copié la clé.
- Supprimer un nœud **rouge** ne demande jamais de réparation — réponse en une ligne
  si l'énoncé le permet.
- Le « double noir » n'est pas une vraie couleur stockée : c'est un artifice de
  raisonnement pour suivre le déficit de hauteur noire.
- Suppression : au plus **3 rotations** ; insertion : au plus **2**. Comparaison
  classique de cours.
- L'enfant « proche » et « lointain » du frère s'entendent par rapport à `x` :
  proche = du même côté que `x`.
