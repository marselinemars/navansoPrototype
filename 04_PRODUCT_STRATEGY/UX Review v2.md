# Navanso — UX & Workflow Consistency Review (after 5 batches of fixes)

A second-pass review focused on **inconsistencies**, **crowding**, and **logic of the tutorat workflow**. Many of these are not bugs — they're places where the prototype has accreted features without re-aligning. Each item is tagged for prioritization.

Priority: **C** = consistency, **D** = density/crowding, **L** = logic mismatch, **N** = naming.

---

## 1. The "prepare vs record" split is right, but the entry points conflate them

A session has two distinct modes: **planning** (before it happens) and **saisie** (recording what happened). I built SessionPlan + SessionEntry to reflect that. But the entry points still mix them.

| Surface | Currently routes to | Should route to |
|---|---|---|
| Dashboard hero "Préparer / Saisir" | always SessionEntry | SessionPlan if date > today; SessionEntry if date ≤ today |
| Group-detail header "Saisir séance" | next planned → SessionEntry | same — but label should be "Saisir la séance d'aujourd'hui" if date===today, else "Préparer la prochaine séance" |
| Groups list card "Séance" button | next planned → SessionEntry | conditional like above |
| Bell "Prochaine séance" notification | SessionEntry | SessionPlan if future, SessionEntry if today |

**Tag: L + N**. The word "Préparer" implies SessionPlan but lands on SessionEntry — a real tutor clicking "Préparer" on Wednesday for Saturday's session will be confused they're already on the attendance screen.

**Fix**: introduce a single helper `sessionAction(sess)` that decides label + destination based on date relative to today. Use it everywhere.

---

## 2. Sidebar "Élèves" goes to a single profile, not a list

Click "Élèves" in the sidebar → you land on Yacine (or whoever was last viewed). There is no Students list screen. This is the clearest navigation bug remaining.

**Tag: L**. Fix: build a `#students` screen with a searchable, filterable table (by group, by status, by attendance bucket). Rename sidebar entry to "Mes élèves" to match "Mes groupes" / "Mes tâches" pattern.

---

## 3. Three overlapping to-do concepts

We have:
- **`session.todos`** — the "À retenir pour la prochaine séance" block inside SessionEntry, with carry-over from previous session
- **`Nav.todos`** (scope: groupId / studentId / sessionId / none) — the global "Mes tâches" plus the embedded ScopedTodos widgets
- **Carry-over** — a derivation that reads previous-session.todos and surfaces them as "Reporté de la séance précédente"

I sync `session.todos` → `Nav.todos` on save, but the UI shows both, and the tutor doesn't know which to use when. In SessionEntry, "À retenir" and the scoped todos for that session are different cards with the same purpose.

**Tag: L + D**. Fix: pick `Nav.todos` as canonical. Drop `session.todos` from the UI (keep it in the data layer for migration). Render the "À retenir" block as `<ScopedTodos sessionId={nextSession.id} groupId={groupId}/>` so it's the same widget used everywhere.

---

## 4. Button labels for the same action vary across the app

| Action | Variants seen |
|---|---|
| Open the next session entry | "Saisir une séance", "Saisir séance", "Saisir", "Préparer / Saisir", "Nouvelle séance" (top-bar dashboard) |
| Edit a group | "Modifier" (group-detail), no entry from Groups list cards |
| Edit a planned session | "Modifier" (in Sessions tab row), no entry from anywhere else |
| Edit a student | nowhere — there's no edit-student flow at all |
| Generate report(s) | "Générer un rapport" (dashboard quick action), "Générer les rapports" (group-detail), "Rapports" (group card), bell label |

**Tag: N**. Fix: a short vocabulary doc, then mass-replace:
- "Saisir la séance" (verb for recording attendance + remarks)
- "Planifier la séance" (verb for SessionPlan)
- "Nouvelle séance" (only for the empty-state create button)
- "Modifier" (consistent edit verb everywhere)
- "Voir le détail" (consistent for read-only deep dive)

---

## 5. Dashboard is too dense — five sections vertically

Current order:
1. Hero "Prochaine séance" (added in B4.1)
2. 3 quick action tiles
3. Metrics strip (3 groupes · 24 élèves · 5 séances · 3 places + Rapports en attente badge)
4. Two-column: Mes groupes / Rapports récents aux parents
5. "Élèves nécessitant un suivi"

**Tag: D**. There's duplication:
- Hero already tells me what's next; the metrics strip is now decorative.
- "Rapports récents aux parents" shows past sends — interesting but not actionable; it could collapse into a single chip on the suivi card.
- "Mes groupes" repeats Groups list visually.

**Proposed re-org**:
1. Hero
2. 3 quick actions
3. **Élèves nécessitant un suivi** (the only truly actionable section)
4. **Cette semaine** (compact line summary: 3 groupes · 5 séances · 2 rapports à envoyer)
5. Mes groupes (collapsed to a single horizontal scroll strip)

Drop "Rapports récents aux parents" entirely — that data lives in Reports and in threads.

---

## 6. Group-detail right rail has 4 stacked cards

Current right rail:
1. Actions du groupe (4 button list)
2. À reprendre la prochaine séance (carry-over, only if any)
3. Dernière séance (preview)
4. Tâches pour ce groupe (ScopedTodos)

**Tag: D**. The "Actions" card is redundant with the header's primary buttons. The "Dernière séance" card is useful but rarely actionable.

**Proposed re-org**:
1. Carry-over + last-session context merged into one card "Contexte de la prochaine séance"
2. ScopedTodos
3. Drop "Actions du groupe" (header already exposes them)

---

## 7. Student profile is one endless scroll

Current sections in order:
1. Identity + contact
2. Privacy note
3. Three stats (Présence, Note, Tendance mini-bars)
4. Points de suivi (Active / Resolved)
5. Strengths
6. Recommendation
7. Historique des remarques
8. Historique des évaluations
9. (right rail) Suivi / Rapports / Note enseignante / ScopedTodos

**Tag: D + L**. The mental model is "I want to see how this student is doing" — but I have to scroll through 9 sections.

**Proposed re-org**: 3 tabs.
- **Suivi en cours** — Identity, stats, Points de suivi (active), Recommendation, Strengths
- **Historique** — Remarques + Évaluations + Strengths (resolved)
- **Rapports** — Reports list with statuses + "Générer un rapport" CTA

Move ScopedTodos to a sticky band at the top of "Suivi en cours" — it's actionable, shouldn't be at the bottom.

---

## 8. ThreadView side panel is dense but useful — keep but trim

Current side panel for a known-student thread:
- Identity row + "Profil" button
- 2 stats (Présence, Dernière note)
- À travailler tags
- Last 3 remarks (full text)
- Linked report button
- Privacy note

**Tag: D (mild)**. Last 3 remarks each show full text — 3 paragraphs is a lot. Truncate to 1 line each with "Voir tout" expander. Otherwise keep — it's the differentiator.

---

## 9. Two reports paths (single + batch) with no canonical hub

We have:
- `#report-gen/<sid>` — single student, full editor
- `#reports-batch/<gid>` — group-level batch

Sidebar "Rapports" → ReportGen for first pending student. Confusing if a user thinks "I want to do my monthly rapports" — they expect a hub showing all pending reports across groups.

**Tag: L**. Fix: make sidebar "Rapports" land on a new `#reports-hub` showing all pending reports grouped by group, with two big CTAs per group ("Faire en lot" → batch / "Voir un par un" → single).

---

## 10. Notifications bell + sidebar badges + topbar search = redundancy

Right now, on every screen:
- Sidebar Messages shows unread count
- Sidebar Rapports shows pending count
- Sidebar Mes tâches shows active count
- Bell dropdown lists: pending reports + unread messages + next sessions
- Topbar search for students

The bell repeats what the sidebar already badges. The bell becomes noisy.

**Tag: C**. Fix: bell should be for **events** (new things since last opened), not state. Items the sidebar already badges shouldn't appear in the bell unless they're new. Add a `seenAt` timestamp to messages/reports and only surface those newer than the last bell-open.

---

## 11. Naming inconsistencies (small but accumulate)

| | Used | Should be |
|---|---|---|
| Sidebar | "Élèves" | "Mes élèves" |
| Group-detail header | "Saisir séance" | "Saisir la séance" |
| Dashboard quick action | "Saisir une séance" | (matches group-detail) |
| Bell notification | "Prochaine séance · Math 4AM" | OK, but be honest about whether it's today or in N days |
| Profile editing | "Mon profil" | "Mes informations" or keep "Mon profil" but consistent across sidebar + page header |
| Status chips | "Validé · envoyé" / "Envoyé" / "À envoyer" | pick one verb tense + add iconography consistency |

**Tag: N**.

---

## 12. Modal vs full-screen patterns are inconsistent

| Pattern | Used for |
|---|---|
| Full screen | CreateGroup, AddStudent, ReportGen, SessionPlan, SessionEntry, ReportsBatch, GroupBroadcast |
| Popover (anchored to button) | RecurringGenerator on Sessions tab |
| Inline card (in main flow) | ConvertProspectCard inside ThreadView |
| Inline composer | ScopedTodos add field |

**Tag: C**. There's no rule. Loose rule I'd propose:
- **Full screen** when the action requires >5 fields or affects multiple records
- **Popover** when the action is configurable but quick (RecurringGenerator)
- **Inline** when it's a sub-decision inside a larger task (ConvertProspectCard)
- **Composer band** for additive lists (ScopedTodos, items list)

RecurringGenerator and ConvertProspectCard both feel right. The rest could be reviewed case-by-case.

---

## 13. Group-detail header has 4 actions — too many primary

Header: Modifier · Message au groupe · Saisir séance · **Générer les rapports** (primary).

**Tag: D**. With 4 buttons, none feels primary — the rightmost being styled primary loses meaning.

Fix: keep only "Saisir séance" (next session-aware, primary) and "Plus ▾" overflow menu for Modifier / Message au groupe / Générer les rapports / Supprimer.

---

## 14. Onboarding has stale demo defaults

`#tutor-onboarding` still uses uncontrolled `defaultValue` on bio and disponibilité, prefilled with Mme Amina's data. For a tutor coming in fresh (post-login), the form would already have Amina's bio in it. Confusing.

**Tag: L**. Fix: detect "fresh profile" vs "edit existing" via NavAuth user identity; pre-fill only when editing.

---

## 15. Logic-of-tutorat gaps

What the workflow doesn't yet capture:

- **The tutor's day starts before the session**. The hero card surfaces the next session well, but the "I'm reviewing my prep 30 min before" moment has no dedicated quick path. A "Mode séance" toggle on the planned session card that opens a stripped-down full-screen "objectifs du jour" view would solve this — opening it on a phone before walking into the class.

- **Cash collection isn't anywhere**. Still missing. Even a single "Paiements" sidebar entry with per-student "Payé / En attente" toggles per month would unblock the most common admin task.

- **"What did we cover last time?"** — the tutor needs this 30 seconds before each session. It's buried in Group-detail → Sessions tab → Voir le détail. Should be on the hero card on dashboard ("Dernière séance : Équations · 18 mai") below the "Prochaine séance" headline.

- **Bulk attendance for a multi-week catch-up**. If a tutor forgot to enter 2 sessions, there's no "bulk fill" path. Each session is entered individually.

- **A "student is leaving the group" flow**. No way to mark a student as inactive without deleting them.

---

# Recommended fix order (Batch 6 = "Consistency pass")

These are bunched because they share a vocabulary and a small set of screens. Three sub-batches of mostly low-risk surgery.

**B6 — Vocabulary & sidebar (small)**
- Standardize button labels (`Saisir la séance` / `Planifier la séance` / `Modifier` / `Voir le détail`)
- Sidebar "Élèves" → "Mes élèves" + build a real Students list screen
- Sidebar "Mon profil" → consistent header on that page

**B7 — Dashboard + Group-detail trim**
- Drop redundant Dashboard sections (metrics strip, Rapports récents)
- Compact Mes groupes into horizontal strip
- Group-detail: collapse Actions + Carry-over into one "Contexte" card; trim header to 1 primary + overflow menu
- Hero CTA: smart label + destination (Préparer if future, Saisir if today)

**B8 — Student profile tabs + unify todos**
- Three tabs on Student profile
- Move ScopedTodos to top of Suivi tab
- Drop `session.todos` UI in favor of ScopedTodos with sessionId
- ThreadView side panel: collapse remarks to 1-liner + expand

**B9 — Reports hub + Bell semantics**
- New `#reports-hub` aggregating pending reports across groups
- Sidebar "Rapports" → reports-hub
- Bell only surfaces events newer than last open (add `lastOpenedBellAt`)

After this consistency pass, the prototype is meaningfully tighter and the remaining P1s feel like the right scope of work to keep building on top.
