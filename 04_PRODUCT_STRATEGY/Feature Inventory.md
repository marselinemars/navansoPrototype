# Navanso — Prototype Feature Inventory

A complete catalogue of every feature in the current coded prototype, organized by audience and by workflow. Built to be handed to a design / conception partner for further iteration.

**Tagline:** *Navanso — Nous progressons, ensemble.*
**One-liner:** A platform for small-group support tutoring in Algeria that connects parents and tutors around the real progress of the student — through structured follow-up, validated reports, and WhatsApp.

**Brand color semantics (used consistently across the app):**
- 🟦 **Blue** — the tutor (Mme Amina), tutor-side actions
- 🟩 **Green** — the parent (Mme Benali), parent-side actions, WhatsApp / sharing
- 🟧 **Orange** — the student (Yacine), the platform's reason for being
- ⚪ Grey/white — neutral chrome

---

## Architecture in one paragraph

Single-page React app, no backend. State persisted to `localStorage` via a custom `NavStore` reducer (12 collections: Tutor, Parent, Student, Group, Session, Report, Thread, Message, Todo, Payment, Shortlist, InquiryStatus). Two breakpoints: tutor shell collapses below 640px, marketing/parent below 860px. Mock auth — one tutor (Mme Amina). All WhatsApp sends open the real `wa.me/<phone>?text=...` scheme in a new tab. Report links are tokenized (`/r/<token>`) and resolve to real Report records.

---

# Part 1 — TUTOR side

The tutor space (`grp:'Enseignant'` in the router) is **auth-gated**. First visit to any tutor route shows a `LoginOverlay`; "Continuer en tant que Mme Amina" enters the app.

## 1.1 — Dashboard (`#dashboard`)

The morning-coffee screen. Top-of-fold answers *"what's next, who needs me, what's pending?"*

**Features:**
- **Hero "Prochaine séance" card** — blue gradient card with weekday + date, planned topic, group name, count of planned points + carry-over to-dos + prep todos, location. Includes a **last-session context line** ("Dernière séance · Calcul littéral · 14 mai"). CTA label adapts via `sessionAction()`:
  - `"Préparer la séance"` if the next planned session is in the future → goes to **SessionPlan**
  - `"Saisir la séance"` if today or past → goes to **SessionEntry**
  - `"Voir le détail"` if completed
- **3 secondary quick actions** — Ajouter un élève / Générer un rapport / Élèves à suivre.
- **"Élèves nécessitant un suivi"** section (promoted high) — auto-flags students with pending reports OR attendance < 85%. Per-row: présence bar, point faible chip, status badge, "Voir l'élève" link.
- **"Mes groupes"** — compact 3-column horizontal strip. Each card shows group abbrev, seat row, students/cap, next session date.
- **Week summary** — single muted line at the bottom: groupes · élèves · séances à venir · rapports à envoyer.

## 1.2 — Sidebar shell + Topbar

**Sidebar** (collapsible drawer on mobile):
- Tableau de bord
- Mes groupes
- Mes élèves
- Messages [unread badge]
- Mes tâches [active badge]
- Planning
- Évaluations
- Rapports [pending badge]
- Paiements [overdue badge]
- Mon profil / Voir profil public
- User card with logout

**Topbar**:
- Breadcrumbs + page title
- Student search with autocomplete dropdown (fuzzy match name + parent)
- **Bell** with badge counting *new events since last open*. Dropdown has two sections: **"Nouveau"** (unread inbound messages, new parent inquiries, parents who opened a report, sessions starting within 24h, parents who acknowledged a report) and **"En cours"** (pending reports — ambient state).
- Page-specific action buttons (primary CTA + "Plus ▾" overflow menu where applicable)

## 1.3 — Groups list (`#groups`)

- Card grid with seat-row visuals and per-card actions
- Working segment filter: **Tous / Avec places / Complets** with live counts
- "Créer un nouveau groupe" plus-card

## 1.4 — Group detail (`#group-detail/<gid>`)

Routed by group ID (Math 4AM ≠ Math 3AM ≠ Physique 4AM).

- **Header**: smart primary CTA (Préparer/Saisir la séance) + **"Plus ▾"** overflow menu (Modifier le groupe / Message au groupe / Générer les rapports / Nouvelle séance / Ajouter un élève)
- **"Prochaine séance" callout** at top with carry-over count from previous session
- **KPI strip** (4 cards): présence moyenne, moyenne /20, rapports en attente, séances réalisées — all computed from live data
- **3 tabs:**
  - **Élèves** — student table with quick view
  - **Séances** — full session list with **"Générer la séquence"** popover (1/2/4/8/12 weeks) + "Nouvelle séance" button. Each session row shows planned/completed status, items covered/deferred count, attendance count, comments, with **Modifier / Saisir** buttons for planned and **Voir le détail** for completed
  - **Paiements** — current month status per student, mark-paid buttons
- **Right rail:**
  - "Contexte de la prochaine séance" — merges last-session preview + carry-over to-dos
  - ScopedTodos — "Tâches pour ce groupe" composer

## 1.5 — Create / Edit Group (`#create-group` and `#create-group/<gid>`)

Same screen serves both modes (via `id` param).
- Fields: name, subject, level, capacity slider (clamped to current student count when editing), schedule, location, mode
- Live preview card on the right
- Delete with confirm (blocked if students enrolled)

## 1.6 — Add Student (`#add-student/<gid>?`)

- Fields: name, level, subject, group, parent phone, parent name
- **Sibling detection**: if phone matches existing parent, surfaces their other kids ("Frère(s) / sœur(s) déjà inscrit(e)(s)")
- Privacy callout explaining the phone-as-key model

## 1.7 — Mes élèves (`#students`)

Real students list. Search by name or parent. Filter by group + status segment (Tous / Rapport à envoyer / Présence < 85% / Rapport envoyé) with live counts. Right rail: by-group digest with pending count chips.

## 1.8 — Student profile (`#student-profile/<sid>`)

Routed by student ID. Three tabs.

**Identity card always visible:**
- Avatar + name + chips (subject, level, group)
- Parent name + phone
- **Payment status chip** for the current month (✓ Payé / En attente / ⚠ En retard)
- "Contacter le parent" (wa.me prefilled) + "Conversation" (opens thread)

**3 tabs:**
- **Suivi en cours** — ScopedTodos at top, then Points de suivi (active/resolved with toggle), strengths, recommandation pour la maison
- **Historique (N)** — Historique des remarques (timeline of session-by-session entries), Historique des évaluations table
- **Rapports (N)** — full list of validated reports with **Vu** chip if parent opened it; tap to see parent-side view

**Right rail:** Actions (Générer un rapport / Ajouter une évaluation / Conversation) + Note de l'enseignante card.

## 1.9 — Session planning (`#session-plan/<sid>` or `#session-plan/new/<gid>`)

Lightweight planning screen.
- Fields: date, group (dropdown), sujet/chapitre, planned items (reorderable + delete), comments, devoirs target
- **"Reprendre la dernière séance"** callout for new sessions — clones topic + carries over uncovered/deferred items + adds an auto "Reprendre les points reportés" first item
- **ScopedTodos** at the bottom — "Tâches de préparation" scoped to the session
- Delete planned session button (with confirm)
- "Passer à la saisie" handoff to SessionEntry

## 1.10 — Session entry (`#session-entry/<sid>`)

The recording flow — supports both completing a planned session and editing a completed one.

**Sections:**
- **Programme prévu** — checkbox + "Reporter →" toggle per planned item. **"Ajouter ce qu'on a fait en plus"** composer at bottom — adds an item marked `improvised: true, covered: true` with a small "improvisé" chip.
- **Présence & remarques** — per-student row with: status segment (Présent / Retard / Absent / Excusé), free-text remark input, **score chip cluster** (8/10/12/14/16/18 + custom input). Score only shown when status = présent/retard.
- **Bilan de la séance** — commentaire général + devoirs.
- **À retenir pour la prochaine séance** — uses `ScopedTodos` scoped to the group. Carry-overs from prior sessions surface here automatically.

**Right rail:** Live résumé (programme traité, reporté, présence%, remarques, notes, à retenir count) + Enregistrer/Annuler.

On save: marks session `completed`, pushes per-student remarks into the `remarks` store (which feeds the points-of-follow-up engine on student profile), persists scores into `attendance[].score`.

## 1.11 — Assessment (`#assessment`)

Stand-alone evaluation entry (rich version of inline scores). Note/Qualitatif toggle, concepts compris chip picker, points faibles chip cluster + free-text errors, recommandation textarea. Right-rail "Résumé de la saisie" preview. "Générer un brouillon" → ReportGen.

## 1.12 — Reports hub (`#reports`)

Aggregated entry point for the reports workflow. **Sidebar "Rapports" lands here.**

- **À envoyer · N** — groups with pending reports, each with "Faire en lot" CTA and per-student "Un par un" rows
- **Récemment envoyés** — last 10 validated reports across all groups, with **Vu** / **Envoyé** status chips per row
- If only one group has pending reports, header has a direct "Faire les rapports en attente" primary CTA

## 1.13 — Reports batch (`#reports-batch/<gid>`)

Multi-student end-of-month workflow.
- Step indicator: Sélection → Brouillons → Validation → Envoi
- Student rows with multi-select (auto-selects students with pending status)
- **"Générer les brouillons"** creates editable draft text per student
- Per-row state machine: pending → has draft → validated → sent
- **"Tout valider"** + **"Tout partager via WhatsApp"** bulk actions — bulk WhatsApp opens one wa.me tab per parent
- Right rail récap: Sélectionnés / Brouillons / Validés / Envoyés

## 1.14 — Single report generation (`#report-gen/<sid>`)

Deep-edit flow per student.
- 4-step Stepper: Données saisies → Brouillon généré → Validation enseignant → Partage parent
- "L'assistant ne remplace pas l'enseignant" caveat banner
- Data summary panel on the left (présence, dernière note, points forts, améliorations, à travailler from real data)
- Generate draft → editable textarea → next-step input → personal note input → **Valider** creates a real Report record with token → **Partager via WhatsApp** opens wa.me / **Voir l'aperçu** opens the parent-side view

## 1.15 — Messages inbox (`#messages`)

- Tabs: **Tous / Non lus / Demandes** with live counts
- Thread rows show: avatar, parent name, **inquiry chip** (green "Demande d'essai" or orange "Demande" depending on inquiry kind), student context chip, last message preview, time ago, unread badge

## 1.16 — Thread view (`#thread/<tid>`)

The screen that solves the "random WhatsApp message" problem.

**Main column:** thread header (avatar, name, phone, language preference) + message bubbles + **Réponses rapides** templates (auto-generated from context: "Renvoyer le rapport" if there's a linkedReportId, "Conseil pour la maison" if there are active points de suivi, "Proposer un essai" or "Confirmer la séance d'essai" for inquiries depending on inquiry kind) + composer with "Enregistrer (sans envoyer)" + "Envoyer via WhatsApp" actions.

**Side panel (the differentiator):**
- For known-student threads: identity, group, présence + dernière note KPI cards, "À travailler" chips, last 3 remarks (each with **"Voir tout"** expander for long text), **"Voir le rapport lié"** if linkedReportId
- For prospective-student inquiries: identity, prospective student info, **matching group** found (if any), and a **"Convert prospect"** card with group selection and **"Confirmer l'inscription"** action

**Vu/Lu status on outbound:**
- Single ✓ — sent
- Double ✓✓ "Lu" in blue — read (flips when parent opens a linked report, or when parent uses the in-platform thread for platform-channel messages)
- WhatsApp channel messages show honest "Pas de lecture confirmée" until a linked report is opened

## 1.17 — Inquiry → enrollment loop (in Thread view)

When tutor uses the **ConvertProspectCard**:
- Creates the student record (adds to NavStore)
- Links the thread to the new student
- Auto-sends a **welcome message** in the thread ("Bonjour [parent], je suis ravie d'accueillir [child] dans le groupe [name]. La première séance est prévue le [date] — [topic]...")
- Sets inquiry status to `accepted` with timestamp
- The parent sees the welcome message in their thread + the child appears under "Vos enfants" on parent home + the entry disappears from their "Mes demandes" list

## 1.18 — Group broadcast (`#group-broadcast/<gid>`)

- 4 templates with smart placeholders: **Séance annulée**, **Séance reportée**, **Rappel de séance** (auto-pulls next session date+topic), **Rappel devoirs** (auto-pulls last session's homework), plus **Message libre**
- Recipients table with multi-select (Tous / Rien quick-picks)
- Personalization at send: "Bonjour" → "Bonjour Mme Untel", "votre enfant" → child's first name
- Two send modes per parent: WhatsApp (wa.me + log) or Platform (log only)
- Bulk versions on the right rail
- Sent rows turn green with "Envoyé" chip

## 1.19 — Mes tâches (`#todos`)

The tutor's personal task list with optional scope.

- **5 tags**: Préparation (blue), Parent (green), Élève (orange), Admin (gray), Général (gray) + priority flag
- **Scope filters**: Toutes / Sans portée / Liées à un groupe / Liées à un élève / Liées à une séance
- **Tabs**: En cours (N) / Terminées (N)
- Right rail: "Par groupe" digest + "Suivis parents en attente" focused view
- Same `ScopedTodos` widget is embedded on Group / Student profile / SessionPlan / SessionEntry — adding a task there is visible everywhere

## 1.20 — Planning calendar (`#planning`)

- Weekly grid, **vendredi-samedi weekend** (Algerian convention) tagged
- Prev / Aujourd'hui / Next nav buttons; week-offset chip when not on current week
- Session cards within day cells, color-coded by group, clickable
- "Prochaine séance" callout at top
- "Récap des groupes" below

## 1.21 — Paiements (`#payments`)

Per-student per-month tracking. DZ cash culture aware.

- Filters: month dropdown, group dropdown, status segment (Tous / Payés / En attente / En retard / Aucun) with counts
- Per-row: status chip, mark paid (auto cash) / cancel toggle, **"Rappel WhatsApp"** for overdue (wa.me with prefilled reminder message)
- Bulk **"Tout marquer payé"**
- Per-group monthly fee on Group entity (1500 DZD for 4AM, 1200 for 3AM in seed)
- Right rail résumé: Attendu / Encaissé / Payés ratio + bar / overdue + pending counts
- Group-detail Paiements tab is a compact version of this scoped to one group
- Student profile shows current-month payment chip in the identity row

## 1.22 — Mon profil / Onboarding (`#tutor-onboarding`)

4-step profile builder reused for edit.
- Informations de base (name, phone, wilaya, commune)
- Matières et niveaux (chip multi-select)
- Format des cours (chip multi-select) + capacity slider
- Présentation & disponibilité (bio + dispo)
- Live preview card on the right
- "Profil complété à X%" gamification card

---

# Part 2 — PARENT side

Parent surfaces. Public-discovery (landing, pricing, vision, search, profile, inquiry) + authenticated-by-token (parent-home, parent-thread, parent-report).

## 2.1 — Landing page (`#landing`)

**New isolated hero (NavHero):**
- Soutien scolaire en Algérie chip
- Headline addressing both audiences with colored words: *"Une seule boucle entre le **parent** (green) et l'**enseignant** (blue)"*
- Lede explaining the platform's purpose
- 2 reassurance points (Groupes < 10 / Rapports validés)
- Two CTAs side-by-side: **Trouver un enseignant** (green) + **Devenir enseignant** (blue)
- **Right column — orbital composition**: animated rotating ring with the Navanso mark at the center labeled "L'élève au centre", floating cards around it:
  - **Parent** (top-left, green) — "voit les progrès"
  - **L'enseignant** (top-right, blue) — "gère ses groupes"
  - **Rapport partagé** (bottom-center, green) — "validé · WhatsApp"
  - Orange "+3 pts" floating chip
- Pure CSS animations, respects `prefers-reduced-motion`
- Smooth gradient fade into the next section

**Below the hero:**
- "Aperçu de la plateforme" — dashboard preview card
- Trust strip
- "Avant Navanso, et avec Navanso" comparison
- "Pour les enseignants / Pour les parents" feature cards
- "Assistant de rédaction" note + Rapport validé seal
- "Le parcours" 4-step
- Testimonials
- **Bottom CTA** — balanced gradient (blue → green) with two centered CTAs

## 2.2 — Marketing nav (top bar on all public screens)

- Logo + 4 nav links (Accueil / Trouver un enseignant / Tarifs / Vision)
- 3 right-side CTAs: **Espace enseignant** (ghost — tutor login), **Trouver un enseignant** (green — parent flow), **Devenir enseignant** (blue — tutor signup)
- Mobile: hamburger drawer with same items as block CTAs

## 2.3 — Pricing (`#pricing`)

4 plan cards: Gratuit / Enseignant 990 DZD / Enseignant Premium 1990 DZD / Centre (sur devis). Each with feature list + CTA. "Tarifs indicatifs · à valider" honesty badge.

## 2.4 — Vision / Roadmap (`#roadmap`)

3 horizons: Bientôt / En exploration / Plus tard. Each with 3 items.

## 2.5 — Parent search (`#parent-search`)

The discovery surface.

**Header bar:**
- 3 controlled search inputs: Matière / Niveau / Commune (Ouargla)
- **Rechercher** button (applies filters)
- "Recherche complète à venir" honesty tag

**Sidebar filters:**
- Matière chips (Mathématiques / Physique / Arabe / Sciences) — sync with header
- Niveau chips (3e AM / 4e AM / 1AS / Primaire) — sync with header
- Format chips (Individuel / Petit groupe)
- Mode chips (Tous / Présentiel / En ligne)
- **"Masquer les groupes complets"** toggle
- **Réinitialiser** link (clears all)

**Results — TutorCard:**
- Avatar + name + featured "★ Recommandé" badge
- Subject + level chips
- Location + format + rating + reviews
- **"Petit groupe · 2 places disponibles · 6/8"** dense block with seat row
- **Tarif: À partir de 1 500 DZD / mois** + green **"Séance d'essai"** chip if applicable
- One-line tagline
- Trust chips (Profil complété / Rapports de suivi / WhatsApp direct)
- **Heart button (top-right)** — toggles add/remove from shortlist with toast
- "Voir profil" + **"Contacter"** CTAs

**Floating "Mes présélections · N" pill** (bottom-left) appears when shortlist non-empty → opens `/shortlist`.

## 2.6 — Shortlist / Présélection (`#shortlist`) — NEW THIS SESSION

The realistic "compare 2-3 tutors before deciding" flow.

- Intro explaining the phone-first / compare-first parent behavior
- **Side-by-side comparison table** with rows for: Tarif / Places / Taille max / Format / Localisation / Note / Séance d'essai
- Per-tutor action column: Contacter (→ inquiry) / Voir profil / Retirer
- "Conseil — appelez d'abord" tip card
- "Tout effacer" + "Continuer à explorer" actions
- Empty state for new visitors

## 2.7 — Tutor profile (`#tutor-profile/<tid>`)

Full public profile.

- Identity header: avatar + name + rating + chips (subjects, levels, wilaya, format) + trust badges
- **Price strip**: "À partir de 1 500 DZD / mois" + Séance d'essai gratuite chip
- "Contacter via WhatsApp" + "Demander des informations" CTAs (top + sticky rail)
- "Retour aux résultats" back link
- **À propos** + 5 ans d'expérience + Groupes de 8 élèves max
- Matières / Niveaux chip blocks
- **Groupes disponibles** — full group list, each with seat row + per-group "Contacter l'enseignant" (or "M'avertir d'une place" if full) → routes to inquiry
- Méthode d'enseignement (4 bullets)
- **NEW THIS SESSION — Vitrine externe** (tutor-curated proof):
  - "Fourni par l'enseignante" chip + description
  - 4 cards with type-specific icons: 💚 **whatsapp** screenshots, 🟦 **diploma**, 🟧 **notebook** photos, more whatsapp, etc.
  - Each: caption, meta (date/source), preview quote/description
- **Avis dans l'application** — honest empty-state ready for new tutors (currently shows 2 demo testimonials)
- Sticky right rail: contact card with featured group + CTAs

## 2.8 — Inquiry form (`#inquiry/<tid>`) — NEW WITH SÉANCE D'ESSAI

- "Retour au profil" back link
- **NEW — Type de demande toggle**: **Première prise de contact** (blue) vs **Demande de séance d'essai** (green) — affects downstream behavior (inbox chip color, tutor templates)
- Fields: name, phone (+213…), child first name, level, subject, language preference (Français / Arabe-Français)
- Required-field validation (visual opacity on submit)
- Privacy reassurance

**Confirmation screen:** "Demande envoyée" with green check + 3 follow-up CTAs (Voir un exemple de rapport / Aller à mon espace parent / Retour à la recherche).

## 2.9 — Parent home (`#parent-home/<pid>`)

The post-enrollment dashboard for the parent.

**Sticky header bar:**
- Logo + "Espace parent · [Parent name]" + **kebab menu** (4 items, all wired: Trouver un autre enseignant / Ajouter un enfant / Mes présélections (N) / Mes informations)

**Body:**
- Privacy note
- **NEW — "Mes demandes"** section (only when there are pending inquiries) — each row shows tutor name + prospective child + status chip (En attente / Refusée) + "Voir conversation"
- **"Vos enfants"** — per-child card:
  - Avatar + name + chips + présence chip
  - **Green "Prochaine séance" mini-card** with date + topic
  - **NEW — Colored payment status strip** (Payé / En attente / En retard) with date
  - **Reports list** showing 3 most recent + "Voir tous les X rapports" expander for full archive
- **Messages** thread list
- Language preference toggle

## 2.10 — Parent thread (`#parent-thread/<tid>`)

Mobile-shaped thread view.
- Sticky header: back arrow + tutor avatar + "Au sujet de [student]"
- Message bubbles (parent's = right/blue, tutor's = left/white)
- **Marking outbound (tutor → parent) messages as read** on open — this propagates to the tutor side
- Composer + Send

## 2.11 — Parent report (`#parent-report/<token>`)

The flagship deliverable. **Token-based access**; tutor-side controls hidden when not logged in.

- Phone-frame on desktop, full-screen on mobile (responsive)
- Header: Navanso logo + **Validé** badge + student identity + subject/level + tutor name + report date
- **Highlights row**: Présence % + sub (5 séances sur 6) | Dernière note 12/20 + +3 trend chip + previous note
- "Dernière leçon" panel
- **Points forts** (green) / **Progrès ce mois-ci** (improved chips) / **À travailler** (orange chips)
- **Recommandation pour la maison** (green callout)
- **Prochaine étape** (blue callout)
- **Note de l'enseignante** (quoted)
- "Rapport validé par l'enseignant" seal
- "Données élève privées" note
- **Actions strip** (sticky bottom):
  - **NEW — "✓ Bien reçu, merci" green button** — fires `acknowledgedAt`, triggers tutor bell event. Becomes a green confirmation strip once tapped.
  - **"Contacter l'enseignant"** → opens the relevant parent-thread
  - **"Télécharger" + "Imprimer"** → both call `window.print()` (browser PDF/print dialog)
- Tutor-side "Revenir à la génération du rapport" link only shows when logged in as tutor

## 2.12 — WhatsApp share preview (`#whatsapp-share`)

Phone-shaped mockup showing a parent-tutor chat with the generated message ("Bonjour Mme Benali, voici le rapport...") + Français / Arabe-Français toggle + "Envoyer via WhatsApp" button that opens the real wa.me link.

---

# Part 3 — Cross-side wiring

Mechanisms that connect the two sides into one loop.

## 3.1 — Inquiry → enrollment loop

| Step | Side | What happens |
|---|---|---|
| 1 | Parent | Submits inquiry form (inquiry or essai kind) |
| 2 | System | Creates Thread, Parent, sets InquiryStatus = pending |
| 3 | Tutor | Sees in inbox with green/orange "Demande" chip |
| 4 | Tutor | Opens thread → uses template ("Confirmer essai" or "Proposer essai") |
| 5 | Tutor | Uses ConvertProspectCard → picks group → inscribe |
| 6 | System | Adds Student, links Thread, sends welcome message, sets InquiryStatus = accepted |
| 7 | Parent | Sees welcome message in thread + child under "Vos enfants" + demande disappears from "Mes demandes" |

## 3.2 — Vu/Lu propagation

| Trigger | Effect |
|---|---|
| Parent opens parent-thread | All tutor's outbound messages in that thread (platform-channel) marked read |
| Parent opens parent-report | Any outbound message with `linkedReportId === thisReport.id` marked read (proxy for WhatsApp read confirmation) |
| Result | Tutor sees ✓✓ "Lu" with tooltip "Vu (présumé — rapport ouvert)" |

## 3.3 — Acknowledgment loop (NEW THIS SESSION)

| Step | Side |
|---|---|
| Parent opens report and taps "✓ Bien reçu, merci" | Parent |
| System sets `report.acknowledgedAt` | — |
| Tutor bell shows new event "report-ack: Mme Benali · accusé de réception" | Tutor |

## 3.4 — Payment loop (NEW THIS SESSION)

| Step | Side |
|---|---|
| Tutor marks paiement = paid | Tutor |
| Parent home shows green "✓ Payé · [date]" strip per child for current month | Parent |
| If overdue, tutor can send Rappel WhatsApp from Paiements screen | Tutor → Parent (WhatsApp) |

## 3.5 — Group broadcast loop

Tutor uses Group-detail → Plus → Message au groupe → picks a template → personalized messages sent per parent via wa.me + logged in each thread. Parents see in their threads on the parent side.

---

# Part 4 — Notable design decisions

## 4.1 — Two breakpoint strategy

- **Tutor shell**: 640px (lower threshold) — tutor uses desktop primarily, narrow dev-windows stay desktop
- **Marketing / parent**: 860px (higher threshold) — phones and narrow windows are the natural viewport
- Independent toggles via `useIsMobile()` and `useIsNarrow()`

## 4.2 — Smart `sessionAction(sess)` helper

Returns `{label, screen, param}` based on session date vs today. Single source of truth used on dashboard hero, group-detail header + rail, groups list cards, sessions tab rows. Eliminates the 5+ variant labels that used to exist.

## 4.3 — Notification semantics: events vs state

Bell shows **new events since last open** in "Nouveau", **persistent action items** in "En cours". Badge counts only new events. Sidebar badges show state (unread / pending). Avoids the bell becoming noisy.

## 4.4 — Unified to-do system

One `Nav.todos` collection with optional scope (groupId / studentId / sessionId / unscoped). Surfaces in three places — global Mes tâches list, ScopedTodos widget on Group/Student/Session pages, and pre-session "À retenir" — without sync logic.

## 4.5 — Honest copy

Throughout, the prototype labels what's mocked or coming-later: "Données démo · témoignages illustratifs", "Recherche complète à venir", "Vérification d'identité · à venir", "Tarifs indicatifs · à valider", "Prototype expérimental · parcours principal simulé". Trust posture.

## 4.6 — Algerian context

- Vendredi-samedi weekend in Planning
- DZD pricing
- WhatsApp as a first-class channel (not an afterthought)
- French primary + Ar-Fr toggle visible on parent message
- Demo data uses real Ouargla communes (Ouargla centre, Hassi Messaoud)
- Demo characters: Mme Amina Belkacem (tutor), Mme Benali, M. Haddad, Mme Cherif, M. Kaddour, etc. (parents), Yacine, Lina, Mohamed, Sara, Anis, Nour (students)

---

# Part 5 — What's NOT in the prototype

Important to call out for the conception agent so they don't assume features.

## Out of scope (deliberate — prototype only)

- Real backend / database
- Real authentication (single mock tutor — Mme Amina)
- Real PDF generation (Télécharger uses `window.print()`)
- Real file uploads (photo upload buttons toast only; Vitrine externe items are seed data only)
- SMS/email channel
- Multiple wilayas in data (Ouargla only)
- Multiple tutors in NAV (4 search results but only Mme Amina has a full profile)
- Token validation on parent screens (URLs are guessable)
- Recurring sessions auto-fill (generated as empty "À définir")
- Actual report templating engine (current draft is template-based interpolation)
- Real review system (in-app reviews show 2 demo testimonials)
- Editor UI for Vitrine externe (read-only)
- Multi-tutor families (one parent ↔ multiple tutors)

## Known gaps from the Final Workflow Sweep

The companion doc `Final Workflow Sweep.md` lists workflow-level gaps not closed in this session: edge cases (0-student group, late session entry, session cancellation as a state), date validation, auto-save drafts, archived groups, transfer students, etc. These are all intentionally **deferred for jury demo scope** per user direction.

---

# Part 6 — Suggested demo paths

For the jury / conception review.

## 6.1 — The "complete loop" 8-minute demo

> 1. **Landing** → new hero with orbital animation → click **Trouver un enseignant**
> 2. **Parent search** → heart Mme Amina + M. Idir + Mme Sofia → floating pill **Mes présélections · 3**
> 3. **Shortlist** → side-by-side comparison → "Conseil — appelez d'abord" → click Contacter on Mme Amina
> 4. **Inquiry form** → toggle to **"Demande de séance d'essai"** (green) → fill + submit
> 5. **Confirmation** → "Aller à mon espace parent"
> 6. **Parent home** for new prospect → see **"Mes demandes · En attente"** chip
> 7. Switch side: click **Espace enseignant** → **LoginOverlay** → enter
> 8. **Dashboard** → bell badge shows new event → click bell → see "Nouvelle demande de [Parent]"
> 9. **Messages** → green "Demande d'essai" chip on the inquiry → open thread
> 10. Right side panel shows prospective student context + matching group → use template **"Confirmer la séance d'essai"** → send via WhatsApp
> 11. Click **ConvertProspectCard** → pick group → Confirmer inscription
> 12. Welcome message auto-appears in thread
> 13. Switch back to parent: **Parent home** → demande gone, child now under "Vos enfants" with **Prochaine séance** card
> 14. Tutor records session: Group-detail → Sessions tab → Saisir on planned session → fill programme + attendance + scores → save
> 15. Tutor generates report: Group-detail → Générer les rapports → ReportsBatch → Générer brouillons → Valider → Partager via WhatsApp (wa.me opens with prefilled message)
> 16. Parent opens report link → **Parent report** → tap **"✓ Bien reçu, merci"**
> 17. Tutor sees acknowledgment in bell ("Mme Benali · accusé de réception")
> 18. Tutor opens **Paiements** → marks May as Payé for the student
> 19. Parent home now shows green **"✓ Payé"** strip on that child

Every link in this chain is wired. No "bientôt" interruptions.

## 6.2 — The "tutor day" 4-minute demo

> 1. Dashboard → hero card "Prochaine séance" + "Dernière séance" context → click
> 2. SessionEntry → check items covered, mark Anis as Retard, score Yacine 14/20, write a remark → save
> 3. Student profile Yacine → tab Suivi → see Points de suivi updated from the remark
> 4. Tab Rapports → see existing report with Vu chip
> 5. Sidebar Mes tâches → add task "Préparer fiche de signes pour samedi" → tag Préparation → priority haute
> 6. Sidebar Paiements → filter En retard → use Rappel WhatsApp on Mohamed Cherif (wa.me opens)
> 7. Sidebar Messages → reply to Mme Cherif using the auto-context side panel

## 6.3 — The "parent day" 3-minute demo

> 1. Parent home → see Yacine + Lina cards (if multi-child) with next session + payment + reports
> 2. Tap a recent report → ParentReport → tap "Bien reçu, merci"
> 3. Tap "Contacter l'enseignant" → ParentThread → send a message
> 4. Kebab → Trouver un autre enseignant → parent-search (with the shortlist still there)

---

# Part 7 — Source file map

For reference if the conception partner wants to dig in.

| File | Contains |
|---|---|
| `Navanso Prototype.html` | App router, screen registry, login overlay, mountApp |
| `navanso/styles.css` | Design tokens, components, nv-hero, mobile media-queries |
| `navanso/data.jsx` | All entity definitions, NavStore, all `Nav.*` helpers, NavAuth |
| `navanso/icons.jsx` | SVG icon library |
| `navanso/ui.jsx` | Reusable primitives (Btn, Avatar, Chip, Places, SeatRow, Bar, Field, Stepper, etc.) |
| `navanso/marketing.jsx` | MarketingNav, Landing, NavHero, BrandBridge (legacy), HeroPreview, Footer |
| `navanso/marketing2.jsx` | Pricing, Roadmap |
| `navanso/parent.jsx` | ParentSearch, TutorCard, FilterChip |
| `navanso/parent2.jsx` | TutorProfile (public), AvailGroupRow, ProfSection |
| `navanso/parent-report.jsx` | ParentReport, WhatsAppShare, PhoneStage |
| `navanso/parent-home.jsx` | ParentHome (sticky header, mes demandes, kids cards), ParentThread |
| `navanso/tutor.jsx` | AppShell (sidebar + topbar + bell), NotifDropdown, Dashboard, Groups |
| `navanso/tutor1b.jsx` | GroupDetail (tabs + actions menu), StudentProfile (tabs), RecurringGenerator |
| `navanso/tutor2.jsx` | Onboarding, Attendance (legacy) |
| `navanso/tutor3.jsx` | Assessment, ReportGen |
| `navanso/messages.jsx` | MessagesInbox, ThreadView, ConvertProspectCard, InquiryForm, GroupBroadcast, CollapsibleRemark |
| `navanso/sessions.jsx` | SessionEntry, SessionPlan, sessionAction helper |
| `navanso/planning.jsx` | Planning calendar |
| `navanso/todos.jsx` | TodosList, TodoComposer, TodoRow, ScopedTodos |
| `navanso/payments.jsx` | Payments screen, PaymentChip |
| `navanso/reports-batch.jsx` | ReportsBatch, ReportsHub |
| `navanso/students-list.jsx` | StudentsList |
| `navanso/shortlist.jsx` | Shortlist comparison (NEW THIS SESSION) |
| `navanso/create-forms.jsx` | CreateGroup (also serves edit), AddStudent |

---

# Part 8 — Companion documents in this folder

- `Navanso Prototype Audit.docx` — initial audit at the start of the session
- `Issues Checklist.md` — running task checklist
- `UX Review v2.md` — second-pass consistency review
- `Parent UX Critique.md` — parent-side walkthrough audit
- `Final Workflow Sweep.md` — end-to-end audit from both POVs
- `Feature Inventory.md` — this document
