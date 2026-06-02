# Navanso — Issues & feature checklist

Consolidated from the prototype audit + tutor-perspective walkthrough. Tick items as you fix them. Priority legend:

- **P0** — blocks pilot or breaks credibility (fix first)
- **P1** — clearly missing for real use
- **P2** — quality of life
- **P3** — nice-to-have

---

## UX Review v2 — Consistency (Batch 6 done)

- [x] **C** — Smart session CTA helper (B6.1): "Préparer la séance" if future, "Saisir la séance" if today, "Voir le détail" if completed — applied across dashboard hero, group-detail header/rail, groups list cards, sessions tab rows
- [x] **L** — Sidebar "Élèves" → "Mes élèves" → real Students list screen at `#students` (B6.2/6.3) with search, group filter, status filter, by-group digest sidebar
- [x] **D** — Group-detail header trimmed from 4 buttons to 1 primary "[smart CTA]" + "Plus ▾" overflow menu (Modifier le groupe / Message au groupe / Générer les rapports / Nouvelle séance / Ajouter un élève)
- [x] **N** — Sidebar consistency: "Mes groupes" / "Mes élèves" / "Mes tâches" pattern (B6.3)

Still pending from UX Review:
- [x] **D** — Dashboard density (B7.1): dropped metrics strip + "Rapports récents"; promoted suivi list; compact "Mes groupes" 3-column strip; single-line week summary at bottom
- [x] **L** — Hero card now shows "Dernière séance" context (B7.2)
- [x] **D** — Group-detail right rail: consolidated to "Contexte de la prochaine séance" + ScopedTodos (B7.3)
- [x] **L** — To-do concepts unified (B8.2): SessionEntry "À retenir" now uses ScopedTodos (group-scoped). Carry-over context shown via group-detail "Contexte" card. Session.todos UI retired.
- [x] **D** — Student profile tabs (B8.1): 3 tabs (Suivi / Historique / Rapports). ScopedTodos moved to top of Suivi. Rapports tab lists real Report records with "Vu" status.
- [x] **D** — ThreadView side-panel remarks truncate (B8.3): 70-char preview + per-item "Voir tout / Voir moins" toggle.
- [x] **L** — Reports hub at `#reports` (B9.1): aggregates pending by group + recent sent with Vu/Envoyé status. Sidebar "Rapports" routes here.
- [x] **C** — Bell event semantics (B9.2): events newer than last open are counted in badge + shown under "Nouveau"; ongoing pending stuff under "En cours" without badge weight. `seenAt` persisted in localStorage. New event type "report-viewed by parent".

## Final smoke test (post-batch 11)

End-to-end verification across all major flows. **All passed.**

- [x] Login overlay → "Continuer en tant que Mme Amina" → dashboard
- [x] Sidebar 11 items with correct badges (Messages 4 / Mes tâches 7 / Rapports 2 / Paiements 2)
- [x] Bell with "Nouveau / En cours" two-section dropdown, badge count 8
- [x] Dashboard hero card with smart CTA ("Préparer la séance") + "Dernière séance" context line
- [x] Group-detail: 3 tabs (Élèves / Séances (4) / Paiements (3/6) with overdue badge), header trimmed to 1 primary + Plus menu
- [x] SessionPlan: "Reprendre la dernière séance" callout → import prefilled topic + carried items
- [x] SessionEntry: improvised item composer + score chips (12/20 → "Note: 12/20" chip)
- [x] Student-profile: 3 tabs (Suivi / Historique (4) / Rapports (1)), Payé chip in header, Mes élèves › Group › Student crumbs
- [x] Rapports hub: "À envoyer · 2" + Récemment envoyés with Vu chip
- [x] Thread view: side context panel + "Réponses rapides" templates + CollapsibleRemark "Voir tout"
- [x] Vu/Lu propagation: report-viewed-by-parent flips linked outbound messages to "Lu" ✓
- [x] Paiements: Attendu 11 400 / Encaissé 5 700 DZD, May 2026, Rappel WhatsApp action
- [x] Mes tâches: 7 active + all 5 tag filters
- [x] Planning: vendredi-samedi weekend correctly tagged (2 weekend cells), Aujourd'hui nav button
- [x] Parent-search → inquiry form → submit → new "Mme Khelifi" thread appears in tutor inbox with Demande chip, Demandes filter count → 2

**One bug found and fixed during testing:**
- Sidebar filter chips for Matière/Niveau ANDed with header search inputs → contradictory filtering. Fixed: chips now sync header values + applied state, header search remains the source of truth.

## Cross-cutting / foundation

- [ ] **P0** — Migrate from Babel-in-browser to Vite + TypeScript (first paint 4–8s, screenshots hang, unshippable)
- [x] **P0** — Mobile-responsive tutor shell (B11): sidebar becomes hamburger-triggered slide-over drawer below 900px; topbar trims (no search, no breadcrumbs, smaller title); 2-column grids collapse to single column via useIsMobile() across Dashboard, Groups, Group-detail, Student-profile, Students-list, SessionEntry, SessionPlan, Messages thread, GroupBroadcast, Payments, ReportsBatch, ReportsHub, TodosList, Assessment, ReportGen, Onboarding, Attendance, Tutor-profile, Parent-search. Tables collapse to stacked rows. Planning grid stays horizontally scrollable.
- [ ] **P1** — Auto-save drafts everywhere (closing a tab mid-entry loses data)
- [x] **P1** — Minimal mock auth for "Espace enseignant" (B5.3 — fixed: LoginOverlay on first tutor-screen access, "Continuer en tant que Mme Amina" demo flow, logout button in sidebar)
- [ ] **P1** — Error boundary around screen render
- [ ] **P2** — Skeleton / loading / empty / error states
- [ ] **P2** — Migrate inline styles to utility classes
- [ ] **P2** — Aria-labels on icon-only buttons; focus-visible rings; keyboard navigation
- [ ] **P3** — i18n scaffold (extract French strings to a dictionary)

---

## Dashboard

- [x] **P0** — Hero "Prochaine séance" card top-of-fold (B4.1 — fixed: blue gradient card, weekday + date, group, planned points count, carry-over count, prep todos count, big "Préparer / Saisir" CTA)
- [ ] **P1** — Surface top 3 priority tasks on dashboard (avoid context-switch to Mes tâches)
- [ ] **P1** — Configurable threshold for "Élèves à suivre" (<85% is too jumpy)
- [ ] **P1** — Top-bar student search: recent searches + jump-to-group
- [ ] **P2** — Compress metrics strip (3 actifs / 24 élèves / 5 séances / 3 places + badge → 1 line)
- [ ] **P2** — "Rapports récents" card should show "Vu par le parent" status once implemented

---

## Notifications / Bell

- [ ] **P1** — Dismiss notification without clicking through
- [ ] **P1** — Group by date (Aujourd'hui / Cette semaine)
- [ ] **P1** — De-prioritize "Prochaine séance" notif after first view
- [ ] **P1** — "Tout marquer comme lu" action
- [ ] **P2** — Filter (only messages / only pending reports / only sessions)

---

## Messages / Threads

- [x] **P0** — "Vu" / "Lu" status on outbound messages (B5.1 — fixed: ✓ for sent, ✓✓ "Lu" when parent opens thread or linked report; WhatsApp channel shows honest "Pas de lecture confirmée")
- [x] **P0** — Honest delivery semantics (B5.1 — outbound is marked "Lu (présumé)" only when the parent opens a linked report; raw WhatsApp messages stay "pas de confirmation")
- [ ] **P1** — File / photo attachment (parents send pics constantly in DZ)
- [ ] **P1** — Archive / "Résolu" toggle per thread
- [ ] **P1** — Search inside messages
- [ ] **P1** — Date grouping in inbox
- [ ] **P1** — Séance d'essai concept on inquiry conversion (currently only "Inscrire" exists)
- [ ] **P2** — Editable quick-reply templates
- [ ] **P2** — Drafts saved while typing
- [ ] **P2** — Show which session/report a reply references at send time

---

## Groups (list)

- [x] **P0** — "Tous / Avec places / Complets" segment now filters with counts (B1.5 — fixed)
- [ ] **P1** — Sort options (recent activity, schedule, capacity, fill rate)
- [ ] **P1** — "Next session" on group cards in the list
- [ ] **P1** — Clarify "Présence" button label → "Saisir séance"
- [ ] **P2** — Archive / inactive state for old groups (last year's class)

---

## Group detail

- [x] **P0** — Bulk parent broadcast for a group (B2.2 — fixed: 4 templates, per-parent or bulk WhatsApp, logs to threads)
- [x] **P0** — "Modifier le groupe" entry point (B2.1 — fixed: edit via `#create-group/<gid>`, capacity floor = student count, delete button)
- [x] **P0** — "Générer les rapports" plural → batch mode (B4.2 — fixed: new ReportsBatch screen with multi-select, bulk generate, per-row edit, bulk validate, bulk WhatsApp share)
- [ ] **P1** — Per-row quick actions on student table (call parent, mark absent, quick eval)
- [ ] **P1** — Sessions tab filters (this month / by status / by topic) + calendar timeline view
- [ ] **P1** — KPI trend vs last month
- [ ] **P2** — Tabs could grow: Rapports / Devoirs / Calendrier

---

## Session planning (SessionPlan)

- [x] **P0** — Recurring session support (B3.1 — fixed: parses group schedule, generates 1/2/4/8/12 weeks of planned sessions)
- [x] **P0** — "Copier la dernière séance comme base" (B3.2 — fixed: carries deferred + un-covered items, plus an intro "reprendre les points reportés" row)
- [ ] **P1** — Validate date against group's schedule pattern
- [ ] **P1** — BEM / curriculum presets / "Importer programme officiel"
- [ ] **P2** — Drag-to-reorder planned items (currently up/down buttons only)
- [ ] **P2** — Estimated duration per item

---

## Session entry (SessionEntry)

- [x] **P0** — Add an improvised item retroactively in SessionEntry (B5.2 — fixed: blue-dashed "Ajouter ce qu'on a fait en plus" composer below the items list; new items tagged "improvisé", covered:true by default)
- [x] **P0** — Per-student score entry inline (B3.3 — fixed: chip cluster 8/10/12/14/16/18 + custom input, only shown when status = present/late, syncs to per-student remarks store)
- [ ] **P1** — Auto-save draft mid-entry
- [ ] **P1** — Multi-item "Devoirs" + per-student differentiation
- [ ] **P1** — Date confirmation if entering days late
- [ ] **P1** — Track homework completion ("a fait" / "pas fait" per student)
- [ ] **P2** — Voice-memo attachment for a student remark
- [ ] **P2** — Copy-previous-session-attendance shortcut

---

## Student profile

- [ ] **P1** — Tabs (Suivi en cours / Historique / Rapports) — currently one long scroll
- [ ] **P1** — "Contacter le parent" wa.me message should prefill with student context
- [ ] **P1** — Merge / unmerge students; transfer between groups
- [ ] **P1** — Move "Tâches pour cet élève" composer near the top (actionable area)
- [ ] **P2** — Trend mini-bars derive from real assessment data (currently placeholders)
- [ ] **P2** — "Next session this student will attend"
- [ ] **P2** — Homework completion history / rate

---

## Report generation

- [x] **P0** — Route by `#report-gen/<studentId>` (B1.2 — fixed)
- [x] **P0** — Real report tokens — parent link resolves to a stored Report (B1.3 — fixed)
- [ ] **P1** — Draft text actually templated from the data panel (not static)
- [ ] **P1** — Tone regeneration (formal / encouraging / brief)
- [ ] **P1** — "Vu par le parent" status after share
- [ ] **P1** — "Renvoyer dans 2 semaines" reminder option
- [ ] **P1** — Report archive view (per student / per group)
- [ ] **P1** — Reorder strengths / points faibles in the draft
- [ ] **P2** — PDF export / print-friendly version (Télécharger / Imprimer buttons exist, do nothing)
- [ ] **P2** — Multi-language draft (Fr + Ar-Fr)

---

## Mes tâches

- [ ] **P1** — Display due dates (model supports them)
- [ ] **P1** — Reminders ("rappelle-moi mardi matin")
- [ ] **P1** — Combine filters (Préparation AND Math 4AM)
- [ ] **P1** — Sub-tasks / checklist within a task
- [ ] **P1** — Drag-to-reorder priority
- [ ] **P2** — Recurring tasks
- [ ] **P2** — Bulk actions (mark several done, delete several)

---

## Planning calendar

- [x] **P0** — **Weekend = vendredi-samedi** (B1.1 — fixed)
- [x] **P0** — Prev / next week navigation (B4.3 — fixed: arrow buttons + "Aujourd'hui" reset, week-offset chip when not on current week)
- [ ] **P1** — Day / month view modes
- [ ] **P1** — Drag-to-reschedule
- [ ] **P1** — Empty-slot affordance to create a session at that time
- [ ] **P2** — Print / export weekly plan
- [ ] **P2** — Filter by group ("only Math 4AM" / "only physics")
- [ ] **P3** — Color customization per group

---

## Parent search / inquiry

- [x] **P0** — "Rechercher" button now triggers filtering (B1.4 — fixed)
- [x] **P0** — "Réinitialiser" filter link resets state + inputs (B1.4 — fixed)
- [x] **P0** — Search inputs are controlled + bound to filtering (B1.4 — fixed)
- [ ] **P1** — Sort options on results (rating, places, distance)
- [ ] **P1** — Empty state for no results
- [ ] **P1** — Combined-filter UX clarity (chips visible state)
- [ ] **P1** — Show tutor's group availability inline in inquiry form
- [ ] **P2** — Saved searches / favorite tutors

---

## Tutor profile / Onboarding

- [ ] **P1** — Some onboarding inputs still uncontrolled (bio textarea, disponibilité)
- [ ] **P1** — Photo upload button — wire actual file picker
- [ ] **P1** — Availability as time slots (not free text)
- [ ] **P1** — Required-field validation + phone format check
- [ ] **P1** — Save draft if user walks away
- [ ] **P2** — "Aperçu côté parent" toggle more prominent
- [ ] **P2** — Verified-identity flow (matches the "à venir" promise)

---

## Pricing / Roadmap

- [ ] **P1** — Pricing CTAs (Commencer / Choisir ce plan / Nous contacter) have no handlers
- [ ] **P1** — Monthly / annual toggle on pricing
- [ ] **P1** — FAQ block on pricing page (taxes, refunds, downgrade)
- [ ] **P2** — Roadmap "vote / request this feature" mechanism

---

## Parent side

- [ ] **P1** — Parent home token validation (currently keyed by `parentId` in URL, no auth)
- [ ] **P1** — "Vu" status on messages from tutor
- [ ] **P2** — Language toggle that actually re-renders content
- [ ] **P2** — Parent can request to withdraw kid / change tutor
- [ ] **P2** — Parent sees the full report history for each child

---

## Algerian-context (critical local fit)

- [ ] **P0** — Vendredi-samedi weekend (covered above under Planning)
- [x] **P1** — Payment tracking per student per month (B10): `#payments` sidebar with month + group + status filters, per-row "Marquer payé" + "Rappel WhatsApp", "Tout marquer payé" bulk, résumé sidebar (attendu/encaissé), Group-detail "Paiements" tab, payment status chip on Student-profile header. Sidebar shows overdue badge count. Monthly fee per group (1500/1200 DZD demo).
- [ ] **P1** — Séance d'essai as a first-class concept (standard in DZ tutoring)
- [ ] **P1** — Ramadan / exam-season scheduling awareness
- [ ] **P1** — BEM / Bac-blanc affordances (mock exam date, official program list)
- [ ] **P2** — Darija écrite option for parent messages (only Fr / Ar-Fr today)
- [ ] **P2** — Prepaid voucher / cash receipt workflow

---

## Privacy / data

- [ ] **P1** — Parent-report token validation (URL currently a placeholder)
- [ ] **P1** — GDPR / Algeria Law 18-07 consent affordances
- [ ] **P1** — Data export / delete on request
- [ ] **P2** — Audit log of who accessed what (basic)

---

## Code / build

- [ ] **P1** — Hardcoded `localhost:8000` assumption; production deploy plan
- [ ] **P1** — No tests
- [ ] **P2** — NavStore localStorage has no migration path for schema changes
- [ ] **P2** — Window-global function exports → module imports once on Vite

---

## Summary by priority

| Priority | Count |
|---|---|
| P0 | 22 |
| P1 | 70 |
| P2 | 30 |
| P3 | 2 |
| **Total** | **124** |

## Suggested first wave (knock-out P0s)

If we attack in order of compound impact:

1. Weekend = vendredi-samedi in Planning (1-line cultural fix)
2. Report-gen routing by studentId
3. Real report tokens (data model ready)
4. Wire parent-search "Rechercher" + "Réinitialiser" + bind inputs
5. Groups list segment filter
6. "Modifier le groupe" screen + entry
7. Bulk parent broadcast (group → all parents)
8. Recurring session pattern (define once, sessions auto-generate)
9. "Copier la dernière séance" template button
10. Inline score entry in SessionEntry
11. Mobile responsive: dashboard + session-entry + messages first
12. Babel → Vite migration (separate workstream)

After that, the P1 list mostly stops being blockers and becomes regular sprint work.
