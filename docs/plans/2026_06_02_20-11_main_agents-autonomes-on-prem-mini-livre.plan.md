---
name: agents-autonomes-on-prem-mini-livre
overview: Créer une nouvelle section du vault sur les agents autonomes on-premise, centrée sur la maintenance souveraine d'un vault Markdown avec boucle human-in-the-loop.
todos:
  - id: structure-section
    content: Créer l'arborescence 05-agents-autonomes-on-prem et la page d'entrée
    status: pending
  - id: cadrage-editorial
    content: Rédiger les pages de vision, souveraineté, architectures et workflow human-in-the-loop
    status: pending
  - id: fiches-solutions
    content: Créer les fiches solutions pour Cursor CLI, Aider, OpenHands, Ollama, LiteLLM, SearXNG/Tavily et projets LLM Wiki
    status: pending
  - id: comparatif
    content: Rédiger le comparatif argumenté et la recommandation d'architecture cible
    status: pending
  - id: lexique
    content: Identifier puis créer ou mettre à jour les fiches lexique nécessaires
    status: pending
  - id: validation
    content: Vérifier sources, maillage, build Starlight et append le rapport d'implémentation
    status: pending
isProject: false
---

# Agents autonomes on-premise - mini-livre

## Objectif

Créer une nouvelle section éditoriale du vault consacrée aux **agents autonomes on-premise** capables d'auditer, maintenir et proposer des mises à jour sur un vault Markdown/Obsidian, avec un circuit de validation humaine.

Cette section doit prolonger le parcours initial du vault :

- `01-fondations/` - physique de l'IA
- `02-materiel/` - architectures matérielles
- `03-stack-logicielle/` - moteurs et frameworks
- `04-blueprints/` - scénarios d'architecture
- `05-agents-autonomes-on-prem/` - agents autonomes, souveraineté et maintenance continue

Le fil conducteur est le **custodian agent** : un agent qui surveille le vault, détecte les connaissances obsolètes, propose des corrections sourcées, travaille en branches/PR et laisse l'humain valider.

## Position éditoriale

La souveraineté est un critère majeur.

La section présentera Cursor CLI et Cursor Automations comme solutions simples et puissantes, mais expliquera pourquoi elles ne sont pas l'architecture cible souveraine : choix des modèles limité par Cursor, dépendance à Cursor Cloud selon les modes, et incertitudes de confidentialité quand les données transitent par leurs services.

L'architecture cible à étudier privilégie :

- runner VPS ou VM Proxmox
- agent CLI ou orchestrateur open source
- modèles locaux via Ollama ou modèles externes via LiteLLM
- recherche web contrôlée via SearXNG ou Tavily
- travail Git en branches datées
- PR ou rapport, jamais push direct sur `main`
- notifications email/webhook
- boucle `human-in-the-loop` ou `human-on-the-loop`

## Arborescence cible

```text
05-agents-autonomes-on-prem/
  index.md
  vision-agent-custodian.md
  souverainete-et-confidentialite.md
  architectures-possibles.md
  comparatif-cursor-cli-aider-openhands.md
  workflow-human-in-the-loop.md
  github-branches-pr-notifications.md
  recherche-web-et-sources.md
  recommandation-architecture-cible.md

  solutions/
    index-solutions-agentiques.md
    cursor-cli.md
    aider.md
    openhands.md
    ollama.md
    litellm.md
    searxng.md
    tavily.md
    markdown-vault-mcp.md
    obsidian-vault-intelligence.md
    llm-wiki.md
    ai-assisted-docs.md
```

## Structure des fiches solution

Chaque fiche dans `05-agents-autonomes-on-prem/solutions/` doit suivre une structure souple mais comparable :

```markdown
## Présentation rapide

## Pourquoi cette solution nous intéresse

## Avantages

## Limites et risques

## Souveraineté et confidentialité

## Intégration possible avec le vault

## Maturité du projet

## Sources

## Verdict provisoire
```

Les chiffres de popularité, dates, fonctionnalités et claims de maturité doivent être sourcés ou formulés prudemment.

## Phases

### Phase 1 - Structure et page d'entrée

**Files:**

- Create: `05-agents-autonomes-on-prem/index.md`
- Create: `05-agents-autonomes-on-prem/solutions/index-solutions-agentiques.md`
- Modify: `site.config.json` si nécessaire pour ajouter la section au sidebar

**Steps:**

- [ ] Créer le dossier `05-agents-autonomes-on-prem/`.
- [ ] Créer une page `index.md` qui explique le but de la section et propose un plan de navigation.
- [ ] Créer `solutions/index-solutions-agentiques.md` comme index des projets et outils étudiés.
- [ ] Ajouter la section au sidebar du vault si elle doit apparaître dans la navigation publiée.

### Phase 2 - Cadrage transversal

**Files:**

- Create: `05-agents-autonomes-on-prem/vision-agent-custodian.md`
- Create: `05-agents-autonomes-on-prem/souverainete-et-confidentialite.md`
- Create: `05-agents-autonomes-on-prem/architectures-possibles.md`
- Create: `05-agents-autonomes-on-prem/workflow-human-in-the-loop.md`
- Create: `05-agents-autonomes-on-prem/github-branches-pr-notifications.md`
- Create: `05-agents-autonomes-on-prem/recherche-web-et-sources.md`

**Steps:**

- [ ] Définir la vision du custodian agent.
- [ ] Décrire les enjeux de souveraineté, privacy, choix des modèles et transit des données.
- [ ] Comparer les architectures VPS, Proxmox, Cursor CLI, Aider, OpenHands et custodian maison.
- [ ] Décrire le workflow rapport → branche → PR → review humaine → merge → publication.
- [ ] Décrire les stratégies GitHub : compte bot, GitHub App, branches datées, PR, email/webhook.
- [ ] Décrire les briques de recherche web : Cursor web tools, SearXNG, Tavily, logs de sources et budgets.

### Phase 3 - Fiches solutions

**Files:**

- Create: `05-agents-autonomes-on-prem/solutions/cursor-cli.md`
- Create: `05-agents-autonomes-on-prem/solutions/aider.md`
- Create: `05-agents-autonomes-on-prem/solutions/openhands.md`
- Create: `05-agents-autonomes-on-prem/solutions/ollama.md`
- Create: `05-agents-autonomes-on-prem/solutions/litellm.md`
- Create: `05-agents-autonomes-on-prem/solutions/searxng.md`
- Create: `05-agents-autonomes-on-prem/solutions/tavily.md`
- Create: `05-agents-autonomes-on-prem/solutions/markdown-vault-mcp.md`
- Create: `05-agents-autonomes-on-prem/solutions/obsidian-vault-intelligence.md`
- Create: `05-agents-autonomes-on-prem/solutions/llm-wiki.md`
- Create: `05-agents-autonomes-on-prem/solutions/ai-assisted-docs.md`

**Steps:**

- [ ] Pour chaque solution, récupérer les sources primaires : repo officiel, docs, README, release/stars si pertinent.
- [ ] Rédiger une fiche courte, sourcée et comparable.
- [ ] Séparer clairement les faits vérifiés des hypothèses ou limites à auditer plus tard.
- [ ] Relier chaque fiche aux pages transverses et au lexique.

### Phase 4 - Comparatif et recommandation

**Files:**

- Create: `05-agents-autonomes-on-prem/comparatif-cursor-cli-aider-openhands.md`
- Create: `05-agents-autonomes-on-prem/recommandation-architecture-cible.md`

**Steps:**

- [ ] Comparer Cursor CLI, Aider et OpenHands selon : simplicité, souveraineté, choix des modèles, intégration Git, web search, maturité, coût, risques.
- [ ] Expliquer pourquoi Cursor CLI est intéressant pour un MVP mais pas idéal comme cible souveraine.
- [ ] Proposer une trajectoire : MVP simple → runner model-agnostic → custodian maison.
- [ ] Définir des niveaux d'autonomie : report-only, branche, PR, review humaine, staging, publication.

### Phase 5 - Lexique

**Files:**

- Potential create/update under `00-lexique/`

**Terms to evaluate:**

- `agent-autonome`
- `agent-custodian`
- `human-in-the-loop`
- `human-on-the-loop`
- `mcp`
- `litellm`
- `ollama`
- `searxng`
- `tavily`
- `github-app`
- `pat`
- `systemd-timer`
- `agent-cli`
- `llm-wiki`

**Steps:**

- [ ] Identifier les termes déjà couverts par le lexique.
- [ ] Créer les fiches manquantes avec `_templates/_Terme Lexique.md`.
- [ ] Ajouter des liens `Voir aussi` entre les fiches lexique et la nouvelle section.
- [ ] Mettre à jour `00-lexique/glossaire-ia.md` si certains termes doivent rejoindre les parcours recommandés ou l'index des acronymes.

### Phase 6 - Vérification et publication

**Files:**

- Modify: created pages
- Modify: this plan, append implementation report after execution

**Steps:**

- [ ] Lancer le skill `vault-verify-content` sur les pages principales.
- [ ] Vérifier les sources externes, surtout les claims sur maturité, modèles supportés, privacy et automatisation.
- [ ] Vérifier que `docs/plans/**`, `.agents/**` et `.cursor/**` restent exclus de la publication via `publish.exclude`.
- [ ] Lancer le build Starlight via l'engine.
- [ ] Ajouter le compte rendu d'implémentation/build à la fin de ce plan.

## Critères de réussite

- La section `05-agents-autonomes-on-prem/` existe et possède une page d'entrée navigable.
- Chaque fiche solution distingue faits, limites, intérêt pour le vault et niveau de souveraineté.
- Les claims de maturité et de fonctionnalités sont sourcés.
- Le comparatif explique clairement pourquoi Cursor CLI peut servir de MVP mais n'est pas la cible souveraine.
- La recommandation d'architecture cible propose une trajectoire pragmatique.
- Les termes importants sont reliés au lexique ou listés pour création.
- Le build Starlight passe après création de la section.

