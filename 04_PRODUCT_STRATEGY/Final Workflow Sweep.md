# Navanso — Final Workflow Sweep

End-to-end audit from both POVs. Each workflow scored: **✓** = solid, **⚠** = works but has a gap, **✗** = broken or missing. Issues tagged: **L** = logic gap, **A** = asymmetry between sides, **D** = dead-end, **N** = missing notification/event, **E** = edge case unhandled, **B** = bug, **C** = consistency/label issue.

---

# TUTOR POV — 13 workflows

## W1 · Sign up / sign in ✓ ⚠

- LoginOverlay appears on tutor-side route when `NavAuth.isLoggedIn()` is false → "Continuer en tant que Mme Amina" → dashboard.
- Logout works (sidebar bottom arrow icon).
- ⚠ **L** — No real signup. A new tutor who lands on `#tutor-onboarding` from the marketing nav goes straight to a profile form with Mme Amina's data already in some fields (uncontrolled `defaultValue`). Confusing for someone fresh.
- ⚠ **L** — "Publier le profil" toasts + navigates to public profile, but nothing persisted to the NavStore for the new tutor. Mock-auth always returns Mme Amina.
- ⚠ **L** — Sidebar "Espace enseignant" link is labeled the same in marketing nav whether logged in or out — could read "Se connecter" when logged out.

## W2 · Daily start — dashboard ✓

- Hero "Prochaine séance" with smart CTA (Préparer vs Saisir).
- 3 quick actions, suivi list promoted, compact groups strip, week summary.
- Bell with Nouveau / En cours.
- ⚠ **L** — "Élèves à suivre" auto-includes anyone <85% attendance OR pending report. Mohamed (75%), Yacine (87% but pending), Anis (83%). The threshold should be configurable per tutor or at least more conservative — 83% is borderline normal.
- ⚠ **E** — No empty state for a tutor with 0 students yet — the page will look broken on day 1.

## W3 · Manage groups ✓

- Groups list with working segment filter.
- "Créer un nouveau groupe" + "Modifier" + Plus menu with 5 secondary actions.
- Tabs inside group: Élèves / Séances / Paiements.
- ⚠ **L** — No way to **archive** a finished group (e.g. last year's class). Only delete, which is blocked if students are still enrolled.
- ⚠ **L** — No **transfer student between groups**. Common case: student moves from 3AM to 4AM mid-year.
- ⚠ **L** — No **duplicate group** for next year setup ("rentrée" scenario).
- ⚠ **E** — Group with 0 students: "Générer les rapports" doesn't disable or warn.

## W4 · Plan a session ✓

- SessionPlan with reorderable items + clone-from-last + prep todos.
- "Passer à la saisie" handoff.
- ⚠ **L** — Recurring generator creates "À définir" empty sessions. Tutor still has to fill each one. No way to apply a pattern across all generated sessions at once.
- ⚠ **L** — Can't **clone a session into a different group** (useful when teaching same content to two parallel groups).

## W5 · Record a session ✓ ⚠

- Programme prévu with covered/deferred toggles + improvised composer.
- Per-student attendance + remark + score chips.
- Bilan + homework + à retenir.
- ⚠ **L** — Date defaults to the planned date. If recording 2 days late, the entry is dated wrong and no warning surfaces.
- ⚠ **E** — No way to mark **"séance n'a pas eu lieu"** (everyone absent vs class cancelled — semantically different).
- ⚠ **L** — **No auto-save.** Closing the tab mid-entry loses everything. Real risk on phone if a call interrupts.

## W6 · Generate reports ✓

- Three entry points (ReportsHub, ReportsBatch, ReportGen single).
- Validation flow + token generation + share via WhatsApp wired.
- "Vu par le parent" status flows back when parent opens the link.
- ⚠ **L** — **No "schedule report send for later"** option. Tutor validates a Saturday-evening report but might want it sent Sunday morning.
- ⚠ **L** — No per-group **report template** (some tutors might want to always include "exercices à faire à la maison" with specific format).
- ⚠ **L** — **No "revoke / correct" a sent report.** If tutor realizes a mistake after sending, can't fix it cleanly — only generate a new one.

## W7 · Respond to messages ✓

- Inbox with filters + thread view with rich context panel (student stats, last remarks, linked report).
- Quick reply templates auto-generated from context.
- Send via WhatsApp opens wa.me + logs the outbound.
- Vu/Lu status flows on outbound (read when parent opens linked report).
- ⚠ **L** — No "marquer comme résolu" / archive a thread.
- ⚠ **L** — No file/photo attachment.
- ⚠ **L** — No search inside thread or across messages.

## W8 · Convert inquiries ✓ ⚠

- ConvertProspectCard inside thread view lets tutor pick group + inscribe.
- ⚠ **N** — When tutor converts an inquiry to a student, **the parent receives no notification** that they've been enrolled. They'd be confused: "did Mme Amina accept me?"
- ⚠ **L** — **No séance d'essai concept** as a first-class state — parent enrolled = parent paying full. In reality there's an intermediate "essai" state.
- ⚠ **L** — Once converted, the thread switches to `kind:'follow-up'` and the "Inscrire" card disappears. No way to undo the inscription if it was a mistake.

## W9 · Track payments ✓

- Payments screen with filters + per-row mark-paid + bulk + WhatsApp reminder.
- Group-detail Paiements tab.
- Student-profile shows current month status.
- ⚠ **A** — **Parent doesn't see their own payment history.** The platform tracks it but never surfaces to them. Real parent will ask "did I pay last month?".
- ⚠ **L** — No partial payments / installments.
- ⚠ **L** — No "credit" or "advance" — what if parent pays 2 months upfront?
- ⚠ **N** — No automatic reminder schedule for overdue. Tutor must remember to send each one manually.

## W10 · Manage to-dos ✓

- Mes tâches global view with filters.
- ScopedTodos on Group / Student / Session pages.
- Add from anywhere, see everywhere.
- ⚠ **L** — Due dates exist in the data model but aren't displayed anywhere on the UI.
- ⚠ **L** — No reminders ("rappelle-moi mardi matin").
- ⚠ **L** — No sub-tasks.

## W11 · Planning calendar ✓

- Weekly view, ven-sam weekend correctly tagged, prev/next/today nav.
- "Nouvelle séance" button.
- ⚠ **L** — No drag-to-reschedule a session.
- ⚠ **L** — No day or month views.
- ⚠ **L** — No print / export weekly plan.

## W12 · Group broadcast ✓

- 4 templates (Annulée / Reportée / Rappel / Devoirs) + libre.
- Per-parent or bulk WhatsApp.
- ⚠ **N** — **No "cancelled session" record** anywhere after a broadcast. Parent opens parent-home tomorrow: still shows "Prochaine séance samedi" because nothing changed in the data. The broadcast was a one-off message, not a state change.

## W13 · Edit profile ✓ ⚠

- Onboarding screen reused for edit.
- ⚠ **L** — Some inputs still uncontrolled (bio textarea, disponibilité) — typing changes nothing in the live preview.
- ⚠ **L** — No real photo upload (the button toasts only).
- ⚠ **L** — "Disponibilité" is free text — should be structured time slots.
- ⚠ **L** — Vitrine externe items exist as seed data only — no way for tutor to add/edit/remove them from the UI.

---

# PARENT POV — 8 workflows

## W14 · Discover platform ✓

- New isolated NavHero (B15.4) with orbital composition.
- Smooth hero→Aperçu transition (B15.5).
- Marketing nav has 3 CTAs balanced across audiences.
- ⚠ **L** — Pricing page CTAs still unwired ("Commencer", "Choisir ce plan", "Nous contacter") — anyone clicking them gets nothing.

## W15 · Search for a tutor ✓ ⚠

- Filters working (chip clicks sync to header + applied state).
- Each card shows price, places, trial badge, trust chips, ratings.
- "Recherche complète à venir" honesty tag.
- ⚠ **L** — Filter chips include "Format: Individuel / Petit groupe" but **no seed tutor has Individuel format**, so clicking Individuel returns 0 results without an empty state explanation.
- ⚠ **L** — No **distance / commune filter**. The 4 seed tutors all show "Ouargla" but their commune varies (Ouargla centre / Hassi Messaoud / En ligne).
- ⚠ **L** — No **sort options** (by price, rating, places).
- ⚠ **L** — No **favorite / save tutor** for browse-then-decide.

## W16 · View tutor profile ✓

- Identity + chips + trust badges + price + trial.
- Available groups with per-group contact CTA.
- Méthode + Vitrine externe (4 mock items) + Avis dans l'app (with honest empty-state ready).
- Sticky contact rail.
- ⚠ **L** — No way to **compare two tutors** side-by-side.
- ⚠ **L** — "Demander des informations" CTA renamed to "Voir un exemple de rapport" (clearer) but the per-group "Contacter l'enseignant" + sticky "Contacter via WhatsApp" both go to the same inquiry form. Could be: per-group button mentions "Demande pour ce groupe" so the inquiry pre-fills group selection.
- ⚠ **L** — Vitrine externe is read-only seed data. In a real product the tutor's curated proof should be reviewed/moderated before display.

## W17 · Submit inquiry ✓

- Form fields validated (name + phone + child name + message required).
- Submit → confirmation with 3 follow-up CTAs.
- Creates a Thread in the tutor's inbox, marked as "Demande".
- ⚠ **L** — Phone format isn't validated (could be empty string with spaces, will still submit).
- ⚠ **L** — No multi-child (single inquiry = single child).
- ⚠ **L** — No upload of school report card for context.
- ⚠ **L** — No preferred contact time / available trial date.

## W18 · Access parent home ✓ ⚠

- Inquiry confirmation → "Aller à mon espace parent" → ParentHome.
- OR direct URL `#parent-home/pa1`.
- Sticky header with logo + name + kebab menu (Trouver un autre enseignant works; rest toast "Bientôt disponible").
- Per-child: avatar + presence + Prochaine séance card + reports archive (expandable when >3).
- Messages thread list.
- Language preference toggle.
- ⚠ **B** — `#parent-home/pa1` has **no token validation**. Anyone with the URL gets in. Real privacy hole that wouldn't survive a production launch.
- ⚠ **D** — Kebab menu has 4 items that toast "Bientôt disponible" — visible dead-ends.
- ⚠ **A** — Parent doesn't see their own **payment history** on this page even though we have all the data.
- ⚠ **L** — No way to register/edit their own profile (phone, language) directly.

## W19 · Read report ✓

- ParentReport with all sections.
- Validation badge + privacy note.
- "Contacter l'enseignant" routes to the relevant thread (B14.3).
- "Télécharger" + "Imprimer" → window.print() (B14.2).
- Tutor-side "Revenir à la génération" hidden when not logged in (B14.1).
- ⚠ **L** — **No "compare to previous report"** view — parents care about trends not absolutes.
- ⚠ **L** — **No one-tap acknowledgment** ("✓ Bien reçu" / "👍 Merci") that the tutor would see.
- ⚠ **L** — **No navigate between reports** within the report view itself — must go back to parent-home.

## W20 · Reply to tutor ✓ ⚠

- ParentThread mobile-shaped, bubbles, composer.
- ⚠ **L** — No file/photo attachment.
- ⚠ **L** — No read receipt visible to parent ("did Mme Amina see this?").
- ⚠ **L** — No link from the thread header to the related report.
- ⚠ **L** — No date separators for long conversations.

## W21 · Find another tutor / W22 · Add another child

- W21: parent-home kebab → "Trouver un autre enseignant" → parent-search ✓
- W22: parent-home kebab → "Ajouter un enfant" → toast "Bientôt disponible" ✗
- ⚠ **L** — Common case (parents with 2+ kids) blocked. Even just routing to a new inquiry form with parent info pre-filled would be enough.

---

# CROSS-CUTTING ISSUES

## A. Asymmetry between tutor and parent sides

| Topic | Tutor side | Parent side | Gap |
|---|---|---|---|
| Payment status | Sees everything | Sees nothing | A1 |
| Read receipts | Sees parent's "Lu" via report-open | No reciprocal "tutor read your reply" | A2 |
| Notifications | Bell with new events | No notification mechanism at all | A3 |
| Session changes | Can broadcast cancellation | No state change reflected on parent side | A4 |
| Profile editing | Onboarding screen exists | No parent profile editor | A5 |
| Reviews | (No tutor-side rating of parents — fine) | No way for parent to rate after a few months | A6 |

## B. Dead-ends and unwired CTAs

- **Pricing page**: all 4 plan CTAs unwired.
- **Parent home menu**: 4 of 6 items dead.
- **Onboarding "Publier le profil"**: persists nothing.
- **Tutor profile photo upload**: button toasts only.
- **Onboarding "Ajouter une photo"**: same.
- **Vitrine externe**: read-only seed; no add/edit/remove from UI.

## C. Logic gaps that bridge both sides

- **C1 — Conversion silent**: tutor converts inquiry → student, parent never told. (Re W8 / W18)
- **C2 — Cancellation invisible**: tutor broadcasts cancel, parent's home still says "Prochaine séance". (Re W12 / W18)
- **C3 — Report acknowledgment loop incomplete**: parent opens report → tutor sees Lu, but parent has no way to actively send "merci". (Re W19 / W7)
- **C4 — Payment silent**: tutor marks payment, parent has no visibility. (Re W9 / W18)
- **C5 — Séance d'essai**: missing as a first-class entity, distorts inquiry/payment/report semantics for trial sessions.

## D. Edge cases unhandled

- **D1** — Past planned session never recorded → remains "planned" forever, polluting "Prochaine séance" logic.
- **D2** — 0-student group → "Générer les rapports" should be disabled.
- **D3** — 0-group tutor (day 1) → Dashboard hero "Prochaine séance" absent → 3-tile actions point to nothing useful.
- **D4** — Multiple kids of same parent in same group → currently each is independent, but a "famille" grouping would help.
- **D5** — Tutor invalidates a report after sending (typo, mistake) → no "revoke" concept.
- **D6** — Two tutors with the same group name in the city → currently irrelevant (single-tutor demo) but production needs handling.
- **D7** — Parent submits inquiry, then tries to submit again for same child → would create a duplicate thread.

## E. Labels & consistency

- **C** — Mobile breakpoint asymmetry: tutor side at 640px, marketing at 860px. At 700-859px viewport, marketing is mobile but tutor is desktop. If a tutor browses their own marketing page in that range, they'd see two different UI styles in the same session. Acceptable for prototype but worth flagging.
- **C** — "Voir profil public" sidebar link sends the tutor to their own marketing-style profile — but on mobile they see a phone-shaped wrapper because of the marketing CSS — slightly disorienting.
- **C** — "Espace enseignant" appears in both the marketing nav (as login) and the parent-home kebab (no, actually the kebab has logout — they don't conflict, good).

## F. Privacy / production-readiness

- **F1** — `parent-home/pa1` URL: no token. Same for `parent-thread/th*`.
- **F2** — `parent-report/<token>` is the only properly tokenized route. Even there, tokens are predictable (`r-yacine-mai-2026` is guessable).
- **F3** — Tutor-side screens are gated by `NavAuth.isLoggedIn()` but it's a single boolean — no per-tutor identity. Anyone who logs in sees Mme Amina's data.
- **F4** — No GDPR-equivalent consent dialogs for the parent inquiry form.

---

# RECOMMENDED NEXT WAVES

## Wave 1 — Close the cross-side loops (highest leverage)

Fixes that touch both POVs and close a real workflow:

1. **C1 — Inquiry conversion notification**: when tutor inscribes a prospect, drop a message in the new thread saying "Vous avez été inscrit·e. Votre première séance est X. Voici votre espace parent : [lien]." Parent sees this in their thread + parent-home.
2. **C2 — Session cancellation as data**: change the broadcast tool so that picking "Séance annulée" template also sets `session.status='cancelled'`. Parent home reads from this — "Séance du X annulée par l'enseignante" appears instead of "Prochaine séance".
3. **C3 — Report acknowledgment**: add a "✓ Bien reçu, merci" button on parent-report. Records `acknowledgedAt` on the report. Tutor bell event: "Mme Benali a accusé réception du rapport Yacine."
4. **C4 — Payment status to parent**: surface "Paiement [mois] : Payé / En attente / En retard" on parent-home per child. Read from existing data.
5. **C5 — Séance d'essai as a first-class state**: extend the Inquiry → "Inscription" / "Essai" branch. Trial sessions don't appear in payment tracking until converted.

## Wave 2 — Dead-end cleanup

6. Wire Pricing CTAs (or honestly tag them "Bientôt disponible").
7. Parent profile editor (Mes informations from kebab).
8. "Ajouter un enfant" flow (reuse inquiry form with pre-filled parent).
9. Tutor profile editor with real photo upload (mock file-picker → object URL → display).
10. Vitrine externe: add/edit/remove from tutor onboarding.

## Wave 3 — Logic-gap and edge-case fixes

11. Date validation on SessionEntry ("Cette séance était prévue le 22, vous saisissez le 24 — confirmer ?").
12. Auto-save draft on SessionEntry every 5s to localStorage; restore on reopen.
13. Configurable suivi threshold per tutor (default 80% instead of 85%).
14. "Marquer comme résolu / archiver" on threads.
15. File attachments in threads (image preview, native file picker, base64 stored in NavStore).
16. Read receipts on parent → tutor messages too (symmetric to existing tutor → parent).
17. Empty states everywhere (0 students, 0 groups, 0 reports, 0 threads).

## Wave 4 — Privacy and production hygiene

18. Proper token validation for `parent-home/<token>` and `parent-thread/<token>`.
19. Per-tutor identity in NavAuth (replace single boolean with `{tutorId}`).
20. GDPR/local-consent banner on first parent inquiry submission.
21. SMS fallback for sharing the report link (alongside WhatsApp).

---

# Status by audit dimension

| Dimension | Score | Notes |
|---|---|---|
| Tutor primary flows | **9/10** | Polished, except session-entry edge cases. |
| Parent primary flows | **6/10** | Core flow works but parent home is still thin on agency. |
| Cross-side loops | **4/10** | Most events on one side don't propagate to the other. |
| Notifications | **5/10** | Bell on tutor side good. Parent side has no notification surface. |
| Privacy/auth | **3/10** | Mock auth + unvalidated tokens — prototype-acceptable, production-blocking. |
| Visual cohesion | **9/10** | Post-hero transition smoothed (B15.5), spacing consistent (B7/B8). |
| Mobile responsive | **8/10** | Two-threshold approach works well; intermediate width is a minor visual inconsistency. |
| Algerian context fit | **8/10** | Weekend ✓, DZD pricing ✓, WhatsApp first ✓, Darija-écrite still missing. |

The prototype is now at a stage where I'd be comfortable demoing it to a real Ouargla tutor and 2-3 parents for user testing. Wave 1 above is what they would flag in the first 10 minutes — and the only items that meaningfully degrade the demo experience.
