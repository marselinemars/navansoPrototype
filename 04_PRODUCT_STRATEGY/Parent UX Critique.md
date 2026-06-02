# Navanso — Parent UX Critique

A walkthrough of the prototype acting as **Mme Benali**, a parent in Ouargla looking for help with her son Yacine in math. Findings are tagged: **L** = logic/wrong, **M** = missing, **C** = crowded/confusing, **B** = bug.

---

## 1. Landing page (parent arriving from word-of-mouth)

The page sells the platform well but is **weighted toward the tutor side**:

- **M** — The headline talks about *tutor* outcomes ("aide les enseignants à gérer leurs petits groupes"). For a parent, "Trouvez un enseignant de confiance, suivez les progrès réels de votre enfant" would convert better.
- **L** — The two hero CTAs are "Démarrer la démo" and "Voir un exemple de rapport parent". A parent should see "Trouver un enseignant près de chez moi" as a primary CTA. The current parent-facing CTA is buried below the fold.
- **L** — Top-right has **"Devenir enseignant"** (new label, good) but no symmetric **"Trouver un enseignant"** primary CTA — just a left-side nav link that's easy to miss.
- **L** — Hero dashboard preview shows a *tutor's* view (Math 4AM, capacity, group dashboard). A parent doesn't see themselves in this. Should alternate or show the parent-report mockup.
- **C** — The "Avant Navanso / Avec Navanso" comparison block, the "Pour enseignants / Pour parents" block, and the "Parcours" steps all overlap conceptually. Three sections explaining the same value. Trim to one.

**Quick wins:**
- Add a prominent "**Trouver un enseignant** →" CTA in the hero, paired with "Devenir enseignant".
- Lead with the parent benefit in the headline; the tutor benefit comes second on the page.
- Swap the hero preview to a parent-report mockup, or alternate between the two on scroll.

---

## 2. Parent search (`#parent-search`)

The strongest parent-facing screen but has gaps a real parent will hit immediately:

**Works:**
- Group size + places restantes prominent on every card ✓
- Trust chips (Profil complété / Rapports / WhatsApp) reassuring ✓
- "Recherche complète à venir" honesty tag ✓
- Filter chips functional ✓ (after our fixes)

**Missing — a parent will ask for these in the first 30 seconds:**
- **M** — **Price** per session or per month. The single biggest decision factor and we hide it entirely. Even "Tarifs à partir de 1 500 DZD/mois" per tutor card would close the gap.
- **M** — **Séance d'essai disponible** filter / badge. Almost every Algerian parent expects a trial before committing.
- **M** — **Distance from home** or commune-level filter. "Ouargla" alone is too broad — parents in El Hadeb don't want a tutor in Mekhadma.
- **M** — **Sort options**: rating, places restantes, prix, distance.
- **M** — **Favorite / save tutor** so a parent can browse 3-4 and compare before contacting.
- **M** — **"Trouver un autre enseignant"** if all visible are full — currently dead end.

**Confusing:**
- **C** — Defaults are "Mathématiques · 4e AM · Ouargla". A parent of a primary-school kid sees results that don't match their situation before they've even searched. Defaults should be empty placeholders.
- **C** — Two side-by-side concepts: Format (Individuel / Petit groupe) and Mode (Tous / Présentiel / En ligne). "Format" is unclear — most parents would expect "Type de cours".

---

## 3. Tutor public profile (`#tutor-profile/t1`)

**Works:**
- Clear identity, subjects, levels, location, format, trust badges, WhatsApp CTA at top
- Available groups with seat row + per-group "Contacter" or "M'avertir d'une place"
- Method block (4 bullets)
- Testimonials (2 quotes)
- Sticky right rail "Prête à suivre votre enfant"

**Missing:**
- **M** — **Price** (still hidden — must be on the profile if not on search results).
- **M** — **Diplômes / parcours académique** (degree from where? years teaching?).
- **M** — **Photos** of the teaching space if at-tutor's-home; relevant for safety.
- **M** — **Vidéo de présentation** (90 seconds, parent watches before contacting — standard on tutor marketplaces globally).
- **M** — **In-app reviews** — 2 demo testimonials aren't enough. Need a "Voir tous les avis (23)" link. *(Caveat: in-app reviews won't exist on day 1 for new tutors — see "Vitrine externe" below.)*
- **M** — **Vitrine externe / preuve hors plateforme** *(critical for bootstrap)* — A dedicated section where the **tutor curates external proof**: screenshots of WhatsApp threads with previous parents, photos of student notebooks / corrected exam papers, copies of diplomas, written testimonials parents handed over, photos from a tutoring session. This solves the cold-start problem: new tutors have no in-app reviews, and parents rarely leave reviews organically. Tutor uploads → moderation flag → displayed in a "Témoignages externes" gallery on the profile. Distinguishes itself from in-app reviews with a visual marker ("Fourni par l'enseignant").
- **M** — **Calendrier de disponibilité** — when can the tutor take new students? "Samedi & Mardi" only says when current groups meet.
- **M** — **Réponse moyenne en …h** — sets expectations.
- **M** — **"Dernière activité il y a 2 jours"** — confirms the profile is alive.
- **M** — **Number of students currently** — already shown per group, but a profile-level total would be nice for credibility.

**Confusing:**
- **C** — "Demander des informations" is a separate CTA from "Contacter via WhatsApp" — both look like Contact buttons. The first goes to whatsapp-share (?) which is confusing.
- **L** — Bottom contact card hardcodes "Groupe Math 4AM" — fine for demo, but in reality should reflect the group the parent showed interest in.
- **L** — "Contacter via WhatsApp" on the per-group buttons jumps to `whatsapp-share` (a tutor preview screen), not the inquiry form. Inconsistent with the parent-search "Contacter" button which goes to `#inquiry/...`.

---

## 4. Inquiry form (`#inquiry/t1`)

**Works:**
- Form is short and clear: name, phone, child name, level, subject, message, language pref
- Submit → confirmation with three follow-up CTAs (sample report, parent home, back to search)
- "Données privées" reassurance at the bottom

**Missing:**
- **M** — **Plusieurs enfants** — parent can only ask about one child at a time. Common case: "I have 2 kids in different levels".
- **M** — **Group selection** — if the tutor has 3 groups, the parent isn't told which one they're inquiring about. Should default to the group they clicked.
- **M** — **Preferred contact time** ("matin / après-midi / soir") so the tutor doesn't call during work.
- **M** — **Available dates for a trial** ("Je suis disponible samedi prochain"). Speeds up scheduling.
- **M** — **Upload child's last report card** or note from school — context for the tutor.
- **M** — **Acceptance of CGU / privacy policy** — minor legal hygiene.

**Confusing:**
- **C** — The form is on a public URL — anyone can spam it. No CAPTCHA or rate-limit indication (prototype-fine, but worth noting).

---

## 5. "Demande envoyée" confirmation

**Works:**
- Clear success message
- Three CTAs (Voir un exemple de rapport, Aller à mon espace parent, Retour à la recherche) — good post-action paths

**Missing:**
- **M** — **What happens next** — set expectations. "Mme Amina vous répondra via WhatsApp dans les 24h" or similar.
- **M** — **SMS / email backup** — if the parent doesn't save the link to their parent home, they lose access to messages and reports. Should at minimum offer to send the link by SMS.
- **M** — **No tutor reads in real-time** — there's no indication that the tutor saw the inquiry yet (no read receipt for an inquiry).

---

## 6. Parent home (`#parent-home/pa1`) — **THINNEST screen, biggest gap**

This is what a real parent will live on after enrollment. Currently it's a stub.

**Works (barely):**
- Lists the parent's children
- Shows last report per child
- Shows messages threads
- Has a language preference toggle

**Critical missing:**

- **M** — **No header / navigation**. No way to log out, no settings, no help. Feels orphan.
- **M** — **No way to find another tutor** (parent might want to add Physics tutor while keeping the Math one).
- **M** — **No profile management** — change phone number, language, preferred contact method, password.
- **M** — **Add another child** — common case for families with 2-3 kids.
- **M** — **Notification preferences** — "tell me by SMS / WhatsApp when a new report is ready".
- **M** — **Reports archive** — only the latest report per kid shown. Where's the history?
- **M** — **Payment history** — "did I pay last month? what do I owe?" — completely absent.
- **M** — **Calendar / next session** — when is Yacine's next class? Parents care.
- **M** — **Send a question (not tied to a specific report)** — currently you can only continue an existing thread; no "ask a general question" button.
- **M** — **Devoirs à la maison** — what's the current homework? Currently visible only in the latest session's "Devoirs" field on the tutor side; never surfaced to the parent.

**Confusing / wrong:**
- **L** — URL is `#parent-home/pa1` — `pa1` is the parent ID. Anyone with this URL gets access. **No token validation.** Real production would need a token.
- **L** — "Espace parent" header has no logo, no link back to anything. Disorienting.
- **L** — The thread row says "Mme Amina · Yacine Benali" — but the *parent's* last message preview is shown as "Enseignante: …" which is grammatically the tutor's voice. The preview should match the actual last message direction.

---

## 7. Parent thread (`#parent-thread/th1`)

**Works:**
- Mobile-shaped layout, header with back + tutor identity
- Bubbles distinguish parent (right, blue) from tutor (left, white)
- Composer at bottom

**Critical missing:**

- **M** — **File / photo attachment**. Parents send pictures of homework, exam papers, school notes constantly. Without this, they'll keep using WhatsApp instead of the app.
- **M** — **Read receipts visible to parent** — when did the tutor read my message?
- **M** — **Voice memo** — DZ parents send voice notes more than text.
- **M** — **Quick replies** — "Merci !", "Bien reçu", "OK" — one tap.
- **M** — **Link to the relevant report** — the thread is *about* a specific report; should link to it from the header.
- **M** — **Link to the tutor's profile** — "see who you're talking to" — tap the tutor avatar.
- **M** — **Group / student context chip** — "À propos de Yacine · Math 4AM" — currently says just "Au sujet de Yacine Benali".
- **M** — **Date separators** in long conversations ("— hier —", "— il y a 3 jours —").
- **M** — **Search in conversation**.
- **M** — **No way to silence / mute** the tutor (if conflict arises).

**Confusing:**
- **C** — No indication of which channel the message went through (WhatsApp vs in-app). The parent might be confused why a message they sent on WhatsApp doesn't appear here.

---

## 8. Parent report (`#parent-report/r-yacine-mai-2026`) — **POLISHED but has bugs**

**Works (this is the strongest parent-facing screen):**
- Beautiful header with logo + validated badge + student info + tutor + report date
- Two-column highlights (Présence / Dernière note + trend)
- Dernière leçon · Points forts · Progrès du mois · À travailler · Recommandation · Prochaine étape · Note enseignante
- Validation badge
- Privacy note
- "Contacter l'enseignant" CTA at the bottom

**Bugs:**

- **B** — "**Revenir à la génération du rapport**" link at the bottom — this is a TUTOR-SIDE action and should NOT appear when a parent opens the link via token. Real parent sees a button that takes them to tutor screens.
- **B** — "Télécharger" and "Imprimer" buttons are decorative — they do nothing. Either wire them or hide them.

**Missing:**
- **M** — **Compare to previous report** — "vs avril 2026: présence +5%, note +2 pts". Parents care about *trends* not absolutes.
- **M** — **Specific exercises** — "5 exercices courts sur les signes" is vague. Could link to a page suggesting exact textbook exercises (e.g., "Mathématiques 4AM, p. 42, ex 1-5").
- **M** — **One-tap acknowledgment** — "✓ J'ai bien reçu" or "👍 Merci" button so the tutor knows the parent read it.
- **M** — **Navigate to other reports** of this child — currently parent has to go back to parent-home.
- **M** — **Share with the other parent** — "Envoyer une copie au père / à la mère via WhatsApp".
- **M** — **Save as PDF** — the Télécharger button should produce a PDF, not just sit there.

---

## Cross-cutting issues

- **B/L** — **No real authentication for parent** — the URL `parent-home/pa1` has no token. In production this is a privacy hole.
- **M** — **No multi-tutor support visible** in parent home — what if Mme Benali has Yacine with Mme Amina AND a French tutor at another address?
- **M** — **No registration flow** for a parent who wants to use the platform proactively (currently can only enter via an inquiry submission or a token link).
- **M** — **No Arabic language support yet** — parents who don't read French well are excluded. (B13 will address.)
- **M** — **No SMS fallback** — the entire system assumes the parent has WhatsApp and the link in WhatsApp. SMS fallback would broaden reach.
- **M** — **No "leave this tutor" flow** — parent can't end the relationship cleanly.

---

## Prioritized fix list — for the parent side

### P0 — Must fix before any pilot

1. **B** — Remove "Revenir à la génération du rapport" from the parent-report view.
2. **B** — Hide / wire "Télécharger" + "Imprimer" on parent-report.
3. **L** — Wire all "Contacter via WhatsApp" buttons on `tutor-profile` to go to `#inquiry/<tutorId>`, not to `whatsapp-share` (which is a tutor preview screen).
4. **M** — Add a **Trouver un enseignant** primary CTA in the marketing nav (parallel to "Devenir enseignant").
5. **M** — Show **price** on parent-search cards and on tutor profiles. Even "Sur demande" is better than hidden.
6. **L** — Parent home: add a header (logo + parent name + a kebab/settings menu) so it doesn't feel orphan.
7. **M** — Parent-home: show **next session** date per child.
8. **M** — Parent-home: link to find-another-tutor + "ajouter un enfant".

### P1 — Critical for real parent use

9. **M** — Inquiry form: multi-child + preferred group + preferred contact time.
10. **M** — Parent thread: file/photo attachment.
11. **M** — Parent thread: read receipts visible to parent + date separators + link to related report.
12. **M** — Parent home: reports archive (full history per child, not just last).
13. **M** — Parent home: payment history view (we already have the data — just expose it).
14. **M** — Parent home: notification preferences.
15. **M** — Tutor profile: vidéo + diplômes + calendrier de dispo + temps de réponse moyen.
16. **M** — Tutor profile: **Vitrine externe** — tutor-curated gallery (WhatsApp screenshots, student work photos, diplomas, external testimonials). Solves the cold-start trust problem. Should be a P1, not P2.
17. **M** — Tutor profile: full reviews list once in-app reviews exist (later — won't have content on day 1).
18. **M** — Parent search: distance / commune-level filter + price filter + séance d'essai filter + sort options.
19. **M** — Parent report: one-tap acknowledgment + link to previous/next reports.
20. **M** — SMS backup of the report link.

### P2 — Quality

21. **M** — Save favorite tutors (browse-then-decide flow).
22. **M** — Compare reports across months (trend view).
23. **M** — Specific exercise suggestions tied to curriculum.
24. **M** — Voice memos in threads.
25. **M** — Multi-tutor support (parent has kid in math AND physics with different tutors).
26. **M** — "How did you hear about us?" on inquiry.

---

## Note on items removed after review with user

- **Langues parlées** filter / display: deprioritized. The public program in Algeria is in Arabic, so most tutors of school subjects (math, physics, science) teach in Arabic/Darija by default. Only relevant for the small private-French-school segment in major cities — niche feature, not P0/P1.

---

## Recommended first wave for the parent side (Batch B14)

Pick 9 items that compound:

1. Bug fix: hide tutor-side "Revenir à la génération" on parent-report (P0 #1)
2. Bug fix: wire Télécharger / Imprimer (P0 #2 — or hide for now)
3. Routing fix: Contacter buttons → inquiry, not whatsapp-share (P0 #3)
4. **Trouver un enseignant** CTA in marketing nav (P0 #4)
5. **Price** on tutor cards + profile (P0 #5)
6. **Parent home header** + logo + menu (P0 #6)
7. **Next session** per child on parent home (P0 #7)
8. **Reports archive** per child (P1 #12) — biggest jump in parent-side completeness
9. **Vitrine externe** on tutor profile (new P1 #16) — solves the cold-start trust problem; tutors can populate this on day 1 without waiting for in-app reviews.

This brings the parent side from "minimal viable preview" to "actually navigable as a parent in pilot", and gives new tutors a credible profile from day 1.

---

After these, the language toggle (B13 / Ar-Fr) becomes meaningful because we'll have stable parent screens worth translating.
