# Audit — retour de l'agent de conception

Pour chaque recommandation de l'agent : ce qui existe déjà dans le code, ce qui manque, et ma reco.

---

## 1. Landing — « 4 cartes du parcours »

**Recommandation agent**
Quatre cartes : Je trouve · Je demande une séance d'essai · L'enseignant suit · Je reçois un rapport.

**Existe**
Section `LE PARCOURS` dans `marketing.jsx` (lignes 388–405). Quatre cartes actuelles :
1. Le parent découvre — voit profil/groupe/places
2. Le parent consulte le profil — méthode/groupes/dispos
3. L'enseignant suit — présence/évaluations/points faibles
4. Le parent reçoit — rapport validé via WhatsApp

**Gap**
- Cartes 1 et 2 se chevauchent (toutes les deux dans la phase « découverte »).
- La **séance d'essai** n'apparaît nulle part dans cette section — c'est pourtant l'ancrage émotionnel central de l'agent (« plus réaliste que la réservation instantanée »).

**Reco**
Remplacer la carte 2 par « Je demande une séance d'essai » (icône `checkc` ou `calendar`). Renuméroter les 4 cartes en first-person (« Je trouve », « Je demande », « L'enseignant suit », « Je reçois »).

**Effort** : 10 minutes. **Impact jury** : haut.

---

## 2. Parent report — « 7 blocs émotionnels »

**Recommandation agent**
Header validé → Ce mois en 1 phrase → Présence + Score → Progrès → À travailler → À la maison → Note de l'enseignant → Contact.

**Existe** (`parent-report.jsx`, lignes 53–149)
Header avec badge Validé, présence/note en stat-cards, dernière leçon, points forts (puces), progrès (conditionnel si `pts.resolved`), à travailler (chips), recommandation maison (carte verte), prochaine étape, note enseignante, accusé réception, contact, télécharger/imprimer.

**Gap**
- Pas de **« Ce mois en 1 phrase »** synthèse en tête.
- **Ordre** : « Dernière leçon » + « Points forts » apparaissent AVANT « Progrès ce mois-ci », alors que l'agent veut Progrès en premier après les stats.
- **Doublons** : « Dernière leçon » + « Prochaine étape » + « Recommandation pour la maison » se chevauchent — l'agent propose un seul bloc « À la maison ».

**Reco**
- Ajouter un bloc « Ce mois en une phrase » juste après les stats (1 ligne, ton chaleureux, généré).
- Réordonner : stats → 1-phrase → progrès → à travailler → à la maison → note → ack/contact.
- Fusionner « Dernière leçon » dans le 1-phrase ; fusionner « Prochaine étape » dans « Recommandation maison ».

**Effort** : 25 minutes. **Impact jury** : haut (c'est *la* screen de preuve).

---

## 3. Sidebar tuteur — hiérarchie primaire/secondaire

**Recommandation agent**
Primaire : Tableau · Groupes · Élèves · Séances · Rapports · Messages.
Secondaire : Planning · Tâches · Tarifs · Vision.

**Existe** (`tutor.jsx`, lignes 13–27)
Deux groupes :
- **Espace** : Tableau, Groupes, Élèves, Messages, Tâches, Planning
- **Suivi** : Évaluations, Rapports, Paiements

**Gap**
- Tâches et Planning sont dans le groupe primaire (« Espace ») — l'agent les veut secondaires.
- Paiements est dans « Suivi » — l'agent les veut secondaires aussi (« pas l'âme de Navanso »).
- Pas de « Séances » comme item dédié (c'est accessible via Groupes → groupe → séances).

**Reco**
Renommer les groupes et déplacer :
- **Espace** : Tableau · Groupes · Élèves · Messages · Rapports · Évaluations
- **Outils** (nouveau, ton plus discret) : Planning · Tâches · Paiements

Ne pas créer un item « Séances » top-level — il vit naturellement dans Groupes.

**Effort** : 10 minutes. **Impact jury** : moyen (allège la sensation « heavy admin »).

---

## 4. Shortlist — note contextuelle algérienne

**Recommandation agent**
Ajouter une note culturelle (« les parents comparent souvent plusieurs enseignants avant d'appeler »).

**Existe** (`shortlist.jsx`)
- Sous-titre ligne 31–33 : « Comparez vos candidats avant de décider. Vous pouvez d'abord en appeler plusieurs via WhatsApp, puis demander une séance d'essai chez celui qui vous convient. »
- Carte conseil lignes 87–95 : « Beaucoup de parents préfèrent appeler 2 ou 3 enseignants par WhatsApp avant de choisir. »

**Gap** : **Aucun**. Déjà conforme.

**Reco** : aucune action. Possiblement renforcer le ton émotionnel en remplaçant « Beaucoup de parents » par « En Algérie, beaucoup de parents… » pour ancrer culturellement. **Optionnel.**

---

## 5. Vitrine externe — label « preuves fournies »

**Recommandation agent**
Relabeller en « preuves fournies par l'enseignant » (pas vérification officielle).

**Existe** (`parent2.jsx`, lignes 114–134)
- Titre section : « Vitrine — preuves fournies par l'enseignante »
- Chip dans la section : « Fourni par l'enseignante »
- `FutureTag` séparé sur l'en-tête : « Vérification d'identité · à venir »

**Gap** : **Aucun**. Déjà conforme.

**Reco** : aucune action.

---

## 6. Session entry — simplicité

**Recommandation agent**
Par élève : Présent/Retard/Absent · score optionnel · remarque · weak-point chips · save. Pas plus.

**Existe** (`sessions.jsx`, lignes 113–155)
Par élève : 4 boutons statut (Présent/Retard/Absent/Excusé) · champ remarque · 6 boutons one-tap pour la note (8/10/12/14/16/18) + champ libre. Plus, en sections séparées : Programme prévu (cochage des items), Composer item improvisé, Commentaire général, Devoirs, À retenir (todos).

**Gap mineur**
- **Pas de chips points-faibles** par élève (l'agent les mentionne — actuellement ils sont déduits côté report).
- Le composer « item improvisé » et la section « À retenir » alourdissent visuellement.

**Reco**
- **Garder tel quel** la partie principale par élève — elle correspond exactement à ce que l'agent veut.
- **Optionnel** : ajouter un picker de chips points-faibles inline (Signes / Fractions / Géométrie…) par élève qui se présente quand on saisit une remarque. Bonus narratif pour le rapport généré ensuite.
- **Optionnel** : replier « item improvisé » derrière un bouton « + improvisé » (collapsed par défaut).

**Effort** : 20 min pour chips, 5 min pour collapse improvisé. **Impact jury** : faible (cette screen marche déjà bien).

---

## Verdict synthèse

| # | Item | Action | Effort | Impact |
|---|------|--------|--------|--------|
| 1 | Landing 4 cartes | **À faire** | 10 min | Haut |
| 2 | Parent report 7 blocs | **À faire** | 25 min | Haut |
| 3 | Sidebar primaire/Outils | **À faire** | 10 min | Moyen |
| 4 | Shortlist note culturelle | Optionnel (1 mot) | 1 min | Faible |
| 5 | Vitrine label | Déjà fait | — | — |
| 6 | Session entry chips | Optionnel | 25 min | Faible |

**Recommandation** : faire les items 1, 2, 3 (45 min cumulés, deux haut-impact + un nettoyage de navigation). Skip 4-5-6 pour l'instant — ils n'ajoutent rien au jury.

Items 4 et 6 peuvent être tranchés après les screenshots, quand on saura ce qui se voit le plus.
