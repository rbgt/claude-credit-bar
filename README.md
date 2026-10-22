# claude-credit-bar

Mod pour [Claude Code](https://claude.com/claude-code) qui affiche en continu, dans la ligne de statut, le **modèle en cours** et le **pourcentage d'usage restant** de ton abonnement.

```
🤖 Sonnet 5.5  │  🟢 Session 5h ██████░░░░ 62% restant · reset dans 2h15  │  🟢 Hebdo ████████░░ 81% restant · reset dans 4j
```

## Ce que la barre affiche

| Élément | Signification |
| --- | --- |
| `🤖 Sonnet 5.5` | Le modèle utilisé par la session (celui de `/model`). |
| `Session 5h` | Limite d'usage sur une fenêtre de **5 heures**. Elle peut se remettre à zéro plusieurs fois par jour. |
| `Hebdo` | Limite d'usage sur **7 jours**. |
| `crédit` | Limite de dépense, affichée seulement si ton compte en a une. |
| `62% restant` | Part de la fenêtre encore disponible (100 % − usage). |
| `reset dans 2h15` | Temps avant la remise à zéro de la fenêtre (`m`, `h`, ou `j`). |

Couleur de l'indicateur : 🟢 plus de 30 % restant, 🟠 entre 10 et 30 %, 🔴 10 % ou moins.

Tu es bloqué dès que **l'une** des fenêtres arrive à 0 %, même si l'autre est encore pleine.

### Limites à connaître

- Les fenêtres d'usage n'existent **qu'avec un abonnement Claude**. Sans abonnement, ou avant la première réponse de la session, la barre affiche « en attente de la 1re réponse… ».
- La barre donne des **pourcentages, pas des tokens** : Claude Code ne transmet pas de nombre de tokens pour ces limites.
- Elle est rafraîchie **après chaque réponse** de Claude, ou quand un pourcentage bouge d'un point. Après un changement de modèle avec `/model`, le nouveau nom apparaît donc à la réponse suivante.

## Installation

Dans une session Claude Code (terminal) :

```
/plugin install credit-bar --marketplace rbgt/claude-credit-bar
```

1. Réponds `y` à la question « Add marketplace? ».
2. Choisis la portée **user** : la barre sera alors chargée dans toutes tes sessions, quel que soit le projet.

Équivalent en ligne de commande :

```
claude plugin install credit-bar --marketplace rbgt/claude-credit-bar
```

L'installation est faite **une seule fois par PC**. Elle est ensuite active à chaque nouvelle session, y compris après une reconnexion.

### Changer de PC

Les mods ne sont pas synchronisés avec ton compte Claude. Sur chaque nouveau poste, relance simplement la commande d'installation ci-dessus. Il faut que Claude Code y soit installé et que tu sois connecté avec ton compte (les limites dépendent de l'abonnement).

## Mise à jour

```
claude plugin update credit-bar
```

Puis `/reload-plugins` dans une session ouverte, ou relance Claude Code.

## Désinstallation

Utilise le menu `/plugin` dans Claude Code, ou :

```
claude plugin uninstall credit-bar
```

## Personnaliser

Tout est dans [`hooks/register.ts`](hooks/register.ts) :

- `LABELS` : les noms affichés pour chaque fenêtre (`Session 5h`, `Hebdo`).
- `WIDTH` : la longueur de la barre (10 caractères par défaut).
- Les seuils de couleur (10 % et 30 %) dans la fonction `format`.
- `modelName` : la mise en forme du nom du modèle.

Un plugin installé est copié par Claude Code : pour garder tes réglages après une mise à jour, fais un **fork** de ce dépôt, modifie-le, puis installe depuis ton fork :

```
/plugin install credit-bar --marketplace <ton-compte>/claude-credit-bar
```

Pour tester une modification sans installer, charge le dossier directement :

```
claude --plugin-dir /chemin/vers/claude-credit-bar
```

Vérification avant de publier :

```
claude plugin validate /chemin/vers/claude-credit-bar
```

## Comment ça marche

Le mod s'abonne à deux événements de Claude Code :

- `session.start` : première lecture au démarrage de la session.
- `session.measure` : déclenché après chaque tour et quand une fenêtre d'usage bouge d'un point.

À chaque événement il lit le modèle actif (`$.session.model()`) et les fenêtres d'usage (`rateLimits`), puis met à jour la ligne de statut avec `$.ui.status()`. Il n'envoie aucune donnée à l'extérieur et ne stocke rien.

## Structure du dépôt

```
.claude-plugin/
  marketplace.json   # fait de ce dépôt un marketplace installable
  plugin.json        # manifeste du mod
hooks/
  hooks.json         # déclare le module
  register.ts        # le code de la barre
```

## Dépannage

| Symptôme | Cause probable |
| --- | --- |
| « en attente de la 1re réponse… » | Aucune réponse reçue encore dans la session, ou compte sans abonnement Claude. |
| Pas de barre du tout | Le mod n'est pas installé sur ce PC, ou n'est pas activé : vérifie avec `/plugin`. |
| La barre apparaît en double | Le mod est chargé deux fois (installé **et** déclaré dans `CLAUDE_CODE_PLUGIN_DIRS`). Retire l'une des deux. |
| Le modèle affiché est ancien | Il se met à jour à la réponse suivante après un `/model`. |
