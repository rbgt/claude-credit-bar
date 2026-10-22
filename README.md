# claude-credit-bar

Mod Claude Code : une barre persistante dans la ligne de statut avec le modèle en cours et le pourcentage d'usage restant.

```
🤖 Sonnet 5.5  │  🟢 Session 5h ██████░░░░ 62% restant · reset dans 2h15  │  🟢 Hebdo ████████░░ 81% restant · reset dans 4j
```

- **Session 5h** : limite sur une fenêtre de 5 heures.
- **Hebdo** : limite sur 7 jours.
- Couleurs : 🟢 > 30 %, 🟠 10–30 %, 🔴 ≤ 10 %.
- Les limites n'existent qu'avec un abonnement Claude. Mise à jour après chaque réponse.

## Installation

Dans une session Claude Code (terminal) :

```
/plugin install credit-bar --marketplace rbgt/claude-credit-bar
```

Répondre `y` à l'ajout du marketplace, puis choisir la portée « user » pour l'avoir dans toutes les sessions.

Équivalent en ligne de commande :

```
claude plugin install credit-bar --marketplace rbgt/claude-credit-bar
```
