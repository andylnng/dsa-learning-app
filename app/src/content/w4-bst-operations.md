# Arbre binaire de recherche : opérations de base et recherche

## Intuition

Un **arbre binaire de recherche** (ABR / *BST*) est un arbre binaire qui maintient un
invariant simple mais puissant, la **propriété d'ordre** :

> Pour chaque nœud de clé `k` : toutes les clés du sous-arbre **gauche** sont `< k`,
> toutes celles du sous-arbre **droit** sont `> k`.

Conséquence directe : à chaque nœud, une comparaison élimine tout un sous-arbre —
comme la recherche binaire, mais dans une structure *dynamique* où l'on peut aussi
insérer et supprimer.

## Le nœud en Java

```java
class Noeud {
    int cle;
    Noeud gauche, droit;

    Noeud(int cle) { this.cle = cle; }
}
```

## Recherche

On descend depuis la racine : plus petit → à gauche, plus grand → à droite.

```java
public static Noeud chercher(Noeud racine, int cle) {
    Noeud courant = racine;
    while (courant != null && courant.cle != cle) {
        courant = (cle < courant.cle) ? courant.gauche : courant.droit;
    }
    return courant;   // le nœud, ou null si absent
}
```

## Minimum, maximum, parcours

- **Minimum** : descendre tout à gauche. **Maximum** : tout à droite.
- **Parcours en ordre** (gauche, nœud, droite) : visite les clés **en ordre croissant**
  — c'est le test classique pour vérifier qu'un arbre est bien un ABR.

```java
public static void enOrdre(Noeud n) {
    if (n == null) return;
    enOrdre(n.gauche);
    System.out.println(n.cle);   // clés produites en ordre croissant
    enOrdre(n.droit);
}
```

- **Successeur** d'un nœud `x` : le minimum de son sous-arbre droit s'il existe ;
  sinon le premier ancêtre dont `x` est dans le sous-arbre gauche.

## Complexité : tout dépend de la hauteur

Toutes les opérations (recherche, min, max, successeur, insertion, suppression)
coûtent **O(h)** où `h` est la hauteur de l'arbre.

| Forme de l'arbre | Hauteur | Recherche |
|------------------|---------|-----------|
| équilibré | Θ(log n) | Θ(log n) |
| dégénéré (clés insérées en ordre croissant) | Θ(n) | Θ(n) — une liste chaînée déguisée ! |

C'est exactement le problème que les arbres **rouge-noir** (sections suivantes)
résolvent : garantir h = O(log n) quoi qu'il arrive.

## Pièges d'examen

- La propriété d'ordre porte sur **tout le sous-arbre**, pas seulement les enfants
  directs. Un nœud peut respecter ses enfants et violer quand même l'invariant plus
  bas — le piège classique des questions « cet arbre est-il un ABR ? ».
- Le parcours **en ordre** donne les clés triées ; préordre et postordre, non.
- « La recherche dans un ABR est O(log n) » — faux en général : c'est O(h), et h peut
  valoir n. O(log n) exige un arbre équilibré.
- Le successeur d'un nœud qui a un sous-arbre droit n'est **jamais** son parent :
  c'est le min du sous-arbre droit.
