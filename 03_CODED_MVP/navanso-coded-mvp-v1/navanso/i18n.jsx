/* NAVANSO — i18n infrastructure (FR / AR).
   Loaded right after data.jsx so every component can read the active language.

   Strategy:
   - `NavI18n.lang` is the source of truth (read from localStorage, defaults to 'fr')
   - `NavI18n.setLang(l)` writes localStorage, flips <html dir/lang>, dispatches
     a custom event so React subscribers re-render
   - `t(key, vars)` looks up the active language; falls back to FR if missing,
     then to the key itself. Supports {placeholder} substitution.
   - `useLang()` returns [lang, setLang] for React components

   Arabic register: Modern Standard Arabic (MSA), localised — not literal
   machine translation. Keep proper names + 4AM / BEM / wilaya names in Latin. */

const NAV_STRINGS = {
  fr: {
    /* ───── Brand / navigation ───── */
    'brand.tagline':              'Nous progressons ensemble',
    'nav.home':                   'Accueil',
    'nav.findTutor':              'Trouver un enseignant',
    'nav.pricing':                'Tarifs',
    'nav.roadmap':                'Vision',
    'nav.tutorSpace':             'Espace enseignant',
    'nav.becomeTutor':            'Devenir enseignant',
    'lang.toggle.fr':             'Français',
    'lang.toggle.ar':             'العربية',
    'lang.partial':               'Cette page n\'est temporairement disponible qu\'en français.',

    /* ───── Hero ───── */
    'hero.eyebrow':               'Soutien scolaire en Algérie',
    'hero.h1.lead':               'Une seule boucle entre le',
    'hero.h1.parent':             'parent',
    'hero.h1.and':                ' et l\'',
    'hero.h1.tutor':              'enseignant',
    'hero.tagline':               'Nous progressons ensemble.',
    'hero.lede.before':           'Chaque séance nourrit un suivi clair pour',
    'hero.lede.student':          'l\'élève',
    'hero.lede.after':            ' : présence, progrès et rapports validés — partagés là où les parents sont déjà, sur WhatsApp.',
    'hero.point.smallGroups':    'Groupes < 10 élèves',
    'hero.point.validatedReports':'Rapports validés',
    'hero.cta.find':              'Trouver un enseignant',
    'hero.cta.become':            'Devenir enseignant',
    'hero.node.parent.title':     'Le parent',
    'hero.node.parent.sub':       'voit les progrès',
    'hero.node.tutor.title':      'L\'enseignant',
    'hero.node.tutor.sub':        'gère ses groupes',
    'hero.node.report.title':     'Rapport partagé',
    'hero.node.report.sub':       'validé · WhatsApp',
    'hero.chip.points':           '+3 pts',

    /* ───── Aperçu section ───── */
    'aperçu.eyebrow':             'Aperçu de la plateforme',
    'aperçu.title':               'Le suivi côté enseignant, le rapport côté parent',
    'aperçu.desc':                'L\'enseignant gère ses groupes et ses séances ; le parent reçoit un rapport clair et validé. Tout est lié.',
    'aperçu.preview.group':       'Math 4AM — Préparation BEM',
    'aperçu.preview.schedule':    'Samedi & Mardi · Ouargla',
    'aperçu.preview.places':      '6 / 8 élèves',
    'aperçu.preview.reportTitle': 'Yacine — Rapport de suivi',
    'aperçu.preview.validated':   'Validé',
    'aperçu.preview.attendance':  'Présence',
    'aperçu.preview.lastScore':   'Dernière note',
    'aperçu.preview.weakPoints':  'Points faibles',
    'aperçu.preview.weak.signs':  'Signes',
    'aperçu.preview.weak.problems':'Problèmes',
    'aperçu.preview.weak.fractions':'Fractions',
    'aperçu.preview.trend':       '+3 pts ce mois',
    'aperçu.preview.shared':      'Partagé aux parents',

    /* ───── Trust strip ───── */
    'trust.smallGroup':           'Trouvez un petit groupe de confiance',
    'trust.realProgress':         'Suivez les progrès réels',
    'trust.clearReports':         'Recevez des rapports clairs',
    'trust.whatsapp':             'Partagez via WhatsApp',

    /* ───── Avant / Avec Navanso ───── */
    'avant.eyebrow':              'Le changement',
    'avant.title':                'Avant Navanso, et avec Navanso',
    'avant.desc':                 'Navanso ne remplace pas la façon de travailler de l\'enseignant — il structure ce qui existe déjà et le rend lisible pour le parent.',
    'avant.before.label':         'Avant Navanso',
    'avant.before.now':           'Aujourd\'hui',
    'avant.before.1':             'Cahier papier difficile à retrouver',
    'avant.before.2':             'Messages WhatsApp dispersés',
    'avant.before.3':             'Remarques surtout verbales',
    'avant.before.4':             'Suivi des progrès difficile à reconstituer',
    'avant.after.label':          'Avec Navanso',
    'avant.after.prototype':      'Le prototype',
    'avant.after.1':              'Historique élève structuré, séance après séance',
    'avant.after.2':              'Rapport parent clair et validé',
    'avant.after.3':              'WhatsApp enrichi par un rapport validé',
    'avant.after.4':              'Progrès visibles dans le temps',

    /* ───── For tutors / For parents ───── */
    'twoSides.eyebrow':           'Une plateforme, deux côtés',
    'twoSides.title':             'Le suivi qui relie l\'enseignant et le parent',
    'twoSides.desc':              'Navanso n\'est pas une application scolaire générique. C\'est une plateforme de confiance et de suivi pour le soutien en petits groupes.',
    'twoSides.tutor.kicker':      'Pour les enseignants',
    'twoSides.tutor.title':       'Organisez vos petits groupes',
    'twoSides.tutor.1':           'Profil professionnel : matières, niveaux, lieu, horaires, capacité.',
    'twoSides.tutor.2':           'Gérez les groupes, la présence et les évaluations.',
    'twoSides.tutor.3':           'Identifiez les points faibles de chaque élève.',
    'twoSides.tutor.4':           'Réduisez les messages répétitifs aux parents.',
    'twoSides.parent.kicker':     'Pour les parents',
    'twoSides.parent.title':      'Comprenez les progrès réels',
    'twoSides.parent.1':          'Découvrez des enseignants de confiance près de chez vous.',
    'twoSides.parent.2':          'Voyez la taille du groupe et les places disponibles.',
    'twoSides.parent.3':          'Suivez si votre enfant progresse vraiment.',
    'twoSides.parent.4':          'Recevez des recommandations claires pour la maison.',

    /* ───── Small group + Reports + Assistant ───── */
    'features.smallGroup.title':  'Petits groupes lisibles',
    'features.smallGroup.1':      'Capacité maximale claire pour chaque groupe.',
    'features.smallGroup.2':      'Places disponibles visibles avant le contact.',
    'features.smallGroup.3':      'Moins de 10 élèves pour un meilleur suivi.',
    'features.reports.title':     'Rapports & suivi',
    'features.reports.1':         'Présence, dernière note, points faibles.',
    'features.reports.2':         'Recommandations concrètes pour la maison.',
    'features.reports.3':         'Historique des rapports conservé.',
    'features.assistant.title':   'Assistant de rédaction',
    'features.assistant.1':       'Aide à reformuler les observations de l\'enseignant.',
    'features.assistant.2':       'Toujours relu et validé par l\'enseignant.',
    'features.assistant.3':       'L\'enseignant reste au contrôle, jamais remplacé.',

    /* ───── Assistant clarification banner ───── */
    'banner.assistant.title':     'L\'assistant aide, l\'enseignant décide',
    'banner.assistant.desc':      'Navanso peut aider à reformuler les observations en un rapport clair. Chaque rapport est relu et validé par l\'enseignant avant l\'envoi — aucune évaluation automatique.',

    /* ───── The loop (4 cards) ───── */
    'loop.eyebrow':               'Le parcours, vu par le parent',
    'loop.title':                 'De la recherche d\'un enseignant à la preuve du progrès',
    'loop.desc':                  'Quatre étapes simples — chacune renforce la confiance avant la suivante.',
    'loop.step1.title':           'Je trouve un enseignant',
    'loop.step1.desc':            'Près de chez moi, avec la taille du groupe et les places restantes visibles avant le contact.',
    'loop.step2.title':           'Je demande une séance d\'essai',
    'loop.step2.desc':            'Avant de m\'engager, je rencontre l\'enseignant — souvent gratuitement.',
    'loop.step3.title':           'L\'enseignant suit mon enfant',
    'loop.step3.desc':            'Présence, évaluations et points faibles enregistrés après chaque séance.',
    'loop.step4.title':           'Je reçois un rapport clair',
    'loop.step4.desc':            'Validé par l\'enseignant et partagé via WhatsApp — je sais ce qui progresse.',

    /* ───── Testimonials + CTA ───── */
    'testimonials.title':         'Ce que disent les parents',
    'testimonials.demoTag':       'Données démo · témoignages illustratifs',
    'cta.title':                  'Le suivi qui relie l\'enseignant et le parent.',
    'cta.desc':                   'Que vous soyez parent à la recherche d\'un enseignant de confiance ou enseignant qui veut mieux organiser son suivi, Navanso vous accompagne.',

    /* ───── Footer ───── */
    'footer.copyright':           '© 2026 Navanso. Tous droits réservés.',

    /* ───── Parent search + TutorCard ───── */
    'ps.title':                   'Trouvez un enseignant de confiance',
    'ps.chip.smallGroups':        'Petits groupes : moins de 10 élèves',
    'ps.chip.places':              'Places disponibles visibles',
    'ps.desc':                    'Cherchez par matière, niveau et commune. Voyez la taille du groupe et les places disponibles avant de contacter.',
    'ps.input.subject':           'Matière',
    'ps.input.level':             'Niveau',
    'ps.input.loc':               'Commune / Wilaya',
    'ps.btn.search':              'Rechercher',
    'ps.futureTag':               'Recherche complète à venir',
    'ps.notice':                  'Cet écran montre la <b>visibilité des profils</b> et la taille des groupes. La recherche avancée, les avis et la réservation en ligne sont des fonctionnalités futures.',
    'ps.filters':                 'Filtres',
    'ps.reset':                   'Réinitialiser',
    'ps.filter.subject':          'Matière',
    'ps.filter.level':            'Niveau',
    'ps.filter.format':           'Format',
    'ps.filter.mode':             'Mode',
    'ps.opt.all':                 'Tous',
    'ps.opt.presential':          'Présentiel',
    'ps.opt.online':              'En ligne',
    'ps.opt.smallGroup':          'Petit groupe',
    'ps.opt.individual':          'Individuel',
    'ps.toggle.places':           'Places disponibles',
    'ps.toggle.placesDesc':       'Masquer les groupes complets',
    'ps.results.count':           '{n} enseignant{s} à {loc} · {sub} · {lvl}',
    'ps.seg.smallGroups':         'Petits groupes',
    'ps.seg.individual':          'Individuel',
    'ps.banner.visibility':       'La taille du groupe et les places restantes sont toujours visibles — une préférence forte des parents.',
    'ps.shortlistPill':           'Mes présélections',
    'tc.tip.add':                 'Ajouter à ma présélection',
    'tc.tip.remove':              'Retirer de la présélection',
    'tc.toast.added':             'Ajouté à votre présélection',
    'tc.toast.removed':           'Retiré de votre présélection',
    'tc.recommended':             '★ Recommandé',
    'tc.smallGroup':              'Petit groupe',
    'tc.maxStudents':             'Maximum {n} élèves',
    'tc.price.label':             'Tarif',
    'tc.price.from':              'À partir de',
    'tc.price.unit.month':        'mois',
    'tc.trial':                   'Séance d\'essai',
    'tc.profilComplete':          'Profil complété',
    'tc.followReports':           'Rapports de suivi',
    'tc.whatsappDirect':          'WhatsApp direct',
    'tc.btn.profile':             'Voir profil',
    'tc.btn.contact':             'Contacter',

    /* ───── Parent report ───── */
    'pr.validated':               'Validé',
    'pr.thisMonth':               'Ce mois en une phrase',
    'pr.attendance':              'Présence',
    'pr.lastScore':               'Dernière note',
    'pr.previous':                'précédent {x}',
    'pr.progress':                'Progrès ce mois-ci',
    'pr.toWork':                  'À travailler',
    'pr.atHome.title':            'À faire à la maison',
    'pr.atHome.sub':              'Avant la prochaine séance — sujet en cours : {topic}',
    'pr.teacherNote':             'Note de l\'enseignante',
    'pr.priv':                    'Rapport privé accessible uniquement via ce lien.',
    'pr.ack.btn':                 '✓ Bien reçu, merci',
    'pr.ack.toast':               'Merci ! L\'enseignante a été notifiée.',
    'pr.ack.confirmed':           'Vous avez accusé réception · {date}',
    'pr.contact':                 'Contacter l\'enseignant',
    'pr.download':                'Télécharger',
    'pr.print':                   'Imprimer',
    'pr.stage.eyebrow':           'Écran parent · mobile',
    'pr.stage.title':             'Ce que le parent reçoit',
    'pr.stage.desc':              'Clair, rassurant et validé par l\'enseignant — présence, note, points faibles et recommandation pour la maison.',

    /* ───── WhatsApp share ───── */
    'wa.parentRole':              'Parent de Yacine · en ligne',
    'wa.greeting':                'Bonjour, comment va Yacine ce mois-ci ?',
    'wa.cardTitle':               'Rapport · Yacine',
    'wa.cardSubject':             'Mathématiques · mai 2026',
    'wa.viewFull':                'Voir le rapport complet',
    'wa.langFr':                  'Français',
    'wa.langMix':                 'Arabe / Français',
    'wa.messageGen':              'Message généré',
    'wa.send':                    'Envoyer via WhatsApp',
    'wa.toast.opened':            'WhatsApp ouvert avec le message prérempli',

    /* ───── Tutor profile ───── */
    'tp.back':                    'Retour aux résultats',
    'tp.contact':                 'Contacter via WhatsApp',
    'tp.seeReport':               'Voir un exemple de rapport',
    'tp.about':                   'À propos de l\'enseignante',
    'tp.subjectsLevels':          'Matières et niveaux',
    'tp.subjects':                'Matières',
    'tp.levels':                  'Niveaux',
    'tp.groupsAvail':             'Groupes disponibles',
    'tp.futureBooking':           'Réservation en ligne à venir',
    'tp.todayContact':            'Aujourd\'hui, le contact se fait via WhatsApp — la réservation et le paiement en ligne sont des fonctionnalités futures.',
    'tp.contactBtn':              'Contacter l\'enseignant',
    'tp.notifyPlace':             'M\'avertir d\'une place',
    'tp.method':                  'Méthode d\'enseignement',
    'tp.showcase':                'Vitrine — preuves fournies par l\'enseignante',
    'tp.showcase.chip':           'Fourni par l\'enseignante',
    'tp.showcase.desc':           'Photos, messages et diplômes que l\'enseignante a choisi de partager.',
    'tp.reviews':                 'Avis dans l\'application',
    'tp.noReviews':               'Pas encore d\'avis dans l\'application.',
    'tp.rail.title':              'Prête à suivre votre enfant',

    /* ───── Shortlist ───── */
    'sl.back':                    'Retour à la recherche',
    'sl.eyebrow':                 'Présélection',
    'sl.title':                   'Mes enseignants sauvegardés',
    'sl.desc':                    'Comparez vos candidats avant de décider. Vous pouvez d\'abord en appeler plusieurs via WhatsApp, puis demander une séance d\'essai chez celui qui vous convient.',
    'sl.row.price':               'Tarif',
    'sl.row.places':              'Places',
    'sl.row.full':                'Complet',
    'sl.row.capacity':            'Taille max',
    'sl.row.format':              'Format',
    'sl.row.location':            'Localisation',
    'sl.row.rating':              'Note',
    'sl.row.trial':               'Séance d\'essai',
    'sl.contact':                 'Contacter',
    'sl.profile':                 'Voir profil',
    'sl.tip.title':               'Conseil — appelez d\'abord',
    'sl.tip.desc':                'Beaucoup de parents préfèrent appeler 2 ou 3 enseignants par WhatsApp avant de choisir.',

    /* ───── Walkthrough shell ───── */
    'wt.topbar.title':            'Parcours commenté',
    'wt.topbar.help':             '⌨ Raccourcis',
    'wt.topbar.picker':           'Aller à un écran',
    'wt.mode.defense':            'Défense',
    'wt.mode.parent':             'Parent',
    'wt.mode.tutor':              'Enseignant',
    'wt.mode.full':               'Complet',
    'wt.prev':                    '← Précédent',
    'wt.next':                    'Suivant →',
    'wt.progress':                'Slide {n} sur {total} — {act}',
    'wt.mobileHint':              'Faites défiler ou touchez l\'écran pour interagir comme dans l\'application.',
    'wt.frame.loading':           'Chargement…',
    'wt.help.title':              'Raccourcis clavier',
    'wt.act.intro':               'Avant-propos',
    'wt.act.a1':                  'Acte 1 · Le parent cherche un enseignant',
    'wt.act.a2':                  'Acte 2 · L\'enseignant organise son suivi',
    'wt.act.a3':                  'Acte 3 · Le progrès devient visible',
    'wt.act.outils':              'Outils complémentaires',
    'wt.act.close':               'Synthèse · trois couches, une boucle',
    'wt.act.validParent':         'Validation · côté parent',
    'wt.act.validTutor':          'Validation · côté enseignant',
    'wt.why':                     'Pourquoi ça compte',
    'wt.quote':                   'En une phrase',
    'wt.layer.1.title':           'Promesse cœur — confiance & progrès',
    'wt.layer.1.desc':            'Trouver un enseignant de confiance et prouver le progrès de l\'élève.',
    'wt.layer.2.title':           'Suivi opérationnel',
    'wt.layer.2.desc':            'Groupes · séances · attendance · remarques · rapports.',
    'wt.layer.3.title':           'Outils complémentaires',
    'wt.layer.3.desc':            'Paiements · planning · tâches · broadcasts.',
  },

  ar: {
    /* ───── Brand / navigation ───── */
    'brand.tagline':              'نتقدّم معاً',
    'nav.home':                   'الرئيسية',
    'nav.findTutor':              'البحث عن أستاذ',
    'nav.pricing':                'الأسعار',
    'nav.roadmap':                'رؤيتنا',
    'nav.tutorSpace':             'فضاء الأستاذ',
    'nav.becomeTutor':            'أنا أستاذ',
    'lang.toggle.fr':             'Français',
    'lang.toggle.ar':             'العربية',
    'lang.partial':               'هذه الصفحة متوفّرة باللغة الفرنسية مؤقّتاً.',

    /* ───── Hero ───── */
    'hero.eyebrow':               'الدّعم المدرسي في الجزائر',
    'hero.h1.lead':               'حلقة واحدة تجمع',
    'hero.h1.parent':             'الوالد',
    'hero.h1.and':                ' و',
    'hero.h1.tutor':              'الأستاذ',
    'hero.tagline':               'نتقدّم معاً.',
    'hero.lede.before':           'كلّ حصّة تُغذّي متابعة واضحة',
    'hero.lede.student':          'للتلميذ',
    'hero.lede.after':            ' : الحضور، التقدّم، وتقارير موثّقة — تُشارَك حيث يتواجد الأولياء فعلاً، على WhatsApp.',
    'hero.point.smallGroups':    'أفواج أقلّ من 10 تلاميذ',
    'hero.point.validatedReports':'تقارير موثّقة',
    'hero.cta.find':              'البحث عن أستاذ',
    'hero.cta.become':            'أنا أستاذ',
    'hero.node.parent.title':     'الوالد',
    'hero.node.parent.sub':       'يرى التقدّم',
    'hero.node.tutor.title':      'الأستاذ',
    'hero.node.tutor.sub':        'يُدير أفواجه',
    'hero.node.report.title':     'تقرير مُرسَل',
    'hero.node.report.sub':       'موثّق · WhatsApp',
    'hero.chip.points':           '+3 نقاط',

    /* ───── Aperçu section ───── */
    'aperçu.eyebrow':             'نظرة على المنصّة',
    'aperçu.title':               'المتابعة من جهة الأستاذ، التقرير من جهة الوالد',
    'aperçu.desc':                'الأستاذ يُدير أفواجه وحصصه ؛ والوالد يتلقّى تقريراً واضحاً وموثّقاً. كلّ شيء مترابط.',
    'aperçu.preview.group':       'رياضيات 4 متوسط — التحضير لـ BEM',
    'aperçu.preview.schedule':    'السبت والثلاثاء · ورقلة',
    'aperçu.preview.places':      '6 / 8 تلاميذ',
    'aperçu.preview.reportTitle': 'ياسين — تقرير المتابعة',
    'aperçu.preview.validated':   'موثّق',
    'aperçu.preview.attendance':  'الحضور',
    'aperçu.preview.lastScore':   'آخر علامة',
    'aperçu.preview.weakPoints':  'نقاط تحتاج إلى مراجعة',
    'aperçu.preview.weak.signs':  'الإشارات',
    'aperçu.preview.weak.problems':'المسائل',
    'aperçu.preview.weak.fractions':'الكسور',
    'aperçu.preview.trend':       '+3 نقاط هذا الشهر',
    'aperçu.preview.shared':      'مُرسَل للأولياء',

    /* ───── Trust strip ───── */
    'trust.smallGroup':           'اعثر على فوج صغير تثق به',
    'trust.realProgress':         'تابع التقدّم الحقيقي',
    'trust.clearReports':         'استلم تقارير واضحة',
    'trust.whatsapp':             'شارك عبر WhatsApp',

    /* ───── Avant / Avec Navanso ───── */
    'avant.eyebrow':              'التغيير',
    'avant.title':                'قبل Navanso، ومع Navanso',
    'avant.desc':                 'Navanso لا تُغيّر طريقة عمل الأستاذ — بل تُنظّم ما هو موجود فعلاً وتجعله واضحاً للوالد.',
    'avant.before.label':         'قبل Navanso',
    'avant.before.now':           'اليوم',
    'avant.before.1':             'كرّاس ورقي يصعب الرجوع إليه',
    'avant.before.2':             'رسائل WhatsApp متفرّقة',
    'avant.before.3':             'الملاحظات شفهية في الغالب',
    'avant.before.4':             'متابعة التقدّم يصعب جمعها لاحقاً',
    'avant.after.label':          'مع Navanso',
    'avant.after.prototype':      'النموذج التجريبي',
    'avant.after.1':              'سجلّ تلميذ منظّم، حصّةً بعد حصّة',
    'avant.after.2':              'تقرير واضح وموثّق للوالد',
    'avant.after.3':              'WhatsApp مدعوم بتقرير موثّق',
    'avant.after.4':              'تقدّم واضح عبر الزمن',

    /* ───── For tutors / For parents ───── */
    'twoSides.eyebrow':           'منصّة واحدة، جانبان',
    'twoSides.title':             'المتابعة التي تربط بين الأستاذ والوالد',
    'twoSides.desc':              'Navanso ليست تطبيقاً مدرسياً عاماً. إنّها منصّة ثقة ومتابعة للدّعم في أفواج صغيرة.',
    'twoSides.tutor.kicker':      'للأساتذة',
    'twoSides.tutor.title':       'نظّم أفواجك الصغيرة',
    'twoSides.tutor.1':           'ملف شخصي احترافي : المواد، المستويات، المكان، التوقيت، السعة.',
    'twoSides.tutor.2':           'إدارة الأفواج، الحضور، والتقييمات.',
    'twoSides.tutor.3':           'تحديد النقاط التي يحتاجها كلّ تلميذ.',
    'twoSides.tutor.4':           'تقليل الرسائل المتكرّرة للأولياء.',
    'twoSides.parent.kicker':     'للأولياء',
    'twoSides.parent.title':      'افهم التقدّم الحقيقي لطفلك',
    'twoSides.parent.1':          'اكتشف أساتذة موثوقين قريبين منك.',
    'twoSides.parent.2':          'شاهد حجم الفوج والأماكن المتوفّرة.',
    'twoSides.parent.3':          'تابع إن كان طفلك يتقدّم فعلاً.',
    'twoSides.parent.4':          'استلم توصيات واضحة للعمل في البيت.',

    /* ───── Small group + Reports + Assistant ───── */
    'features.smallGroup.title':  'أفواج صغيرة واضحة',
    'features.smallGroup.1':      'سعة قصوى واضحة لكلّ فوج.',
    'features.smallGroup.2':      'الأماكن المتوفّرة مرئيّة قبل التواصل.',
    'features.smallGroup.3':      'أقلّ من 10 تلاميذ لمتابعة أفضل.',
    'features.reports.title':     'التقارير والمتابعة',
    'features.reports.1':         'الحضور، آخر علامة، نقاط تحتاج إلى مراجعة.',
    'features.reports.2':         'توصيات عمليّة للبيت.',
    'features.reports.3':         'سجلّ التقارير محفوظ.',
    'features.assistant.title':   'مساعد لإعداد التقارير',
    'features.assistant.1':       'يُساعد على صياغة ملاحظات الأستاذ.',
    'features.assistant.2':       'الأستاذ يُراجع ويوثّق كلّ تقرير.',
    'features.assistant.3':       'الأستاذ هو من يتحكّم دائماً.',

    /* ───── Assistant clarification banner ───── */
    'banner.assistant.title':     'المساعد يُساعد، والأستاذ هو من يُقرّر',
    'banner.assistant.desc':      'Navanso تُساعد على صياغة الملاحظات في تقرير واضح. كلّ تقرير يُراجَع ويُوثَّق من طرف الأستاذ قبل الإرسال — لا تقييم آليّ.',

    /* ───── The loop (4 cards) ───── */
    'loop.eyebrow':               'المسار، كما يراه الوالد',
    'loop.title':                 'من البحث عن أستاذ إلى إثبات التقدّم',
    'loop.desc':                  'أربع خطوات بسيطة — كلّ واحدة تُعزّز الثقة قبل التي تليها.',
    'loop.step1.title':           'أبحث عن أستاذ',
    'loop.step1.desc':            'قريب منّي، مع رؤية حجم الفوج والأماكن المتوفّرة قبل التواصل.',
    'loop.step2.title':           'أطلب حصّة تجريبيّة',
    'loop.step2.desc':            'قبل أن ألتزم، ألتقي بالأستاذ — مجاناً في أغلب الأحيان.',
    'loop.step3.title':           'الأستاذ يتابع طفلي',
    'loop.step3.desc':            'الحضور، التقييمات والنقاط تُسجَّل بعد كلّ حصّة.',
    'loop.step4.title':           'أستلم تقريراً واضحاً',
    'loop.step4.desc':            'موثّقاً من طرف الأستاذ ومُرسَلاً عبر WhatsApp — أعرف ما يتقدّم.',

    /* ───── Testimonials + CTA ───── */
    'testimonials.title':         'ما يقوله الأولياء',
    'testimonials.demoTag':       'بيانات تجريبية · شهادات للتوضيح',
    'cta.title':                  'المتابعة التي تربط بين الأستاذ والوالد.',
    'cta.desc':                   'سواء كنت وليّاً تبحث عن أستاذ موثوق أو أستاذاً يريد تنظيم متابعته بشكل أفضل، Navanso ترافقك.',

    /* ───── Footer ───── */
    'footer.copyright':           '© 2026 Navanso. جميع الحقوق محفوظة.',

    /* ───── Parent search + TutorCard ───── */
    'ps.title':                   'ابحث عن أستاذ موثوق',
    'ps.chip.smallGroups':        'أفواج صغيرة : أقلّ من 10 تلاميذ',
    'ps.chip.places':              'الأماكن المتوفّرة ظاهرة',
    'ps.desc':                    'ابحث حسب المادة، المستوى والبلديّة. شاهد حجم الفوج والأماكن المتوفّرة قبل التواصل.',
    'ps.input.subject':           'المادة',
    'ps.input.level':             'المستوى',
    'ps.input.loc':               'البلديّة / الولاية',
    'ps.btn.search':              'بحث',
    'ps.futureTag':               'بحث كامل قريباً',
    'ps.notice':                  'هذه الشاشة تُظهر <b>وضوح الملفّات الشخصيّة</b> وحجم الأفواج. البحث المتقدّم، التقييمات، والحجز عبر الإنترنت ميزات مستقبليّة.',
    'ps.filters':                 'المرشّحات',
    'ps.reset':                   'إعادة تعيين',
    'ps.filter.subject':          'المادة',
    'ps.filter.level':            'المستوى',
    'ps.filter.format':           'الصّيغة',
    'ps.filter.mode':             'النّمط',
    'ps.opt.all':                 'الكلّ',
    'ps.opt.presential':          'حضوري',
    'ps.opt.online':              'عن بُعد',
    'ps.opt.smallGroup':          'فوج صغير',
    'ps.opt.individual':          'فردي',
    'ps.toggle.places':           'الأماكن المتوفّرة',
    'ps.toggle.placesDesc':       'إخفاء الأفواج الكاملة',
    'ps.results.count':           '{n} أستاذ في {loc} · {sub} · {lvl}',
    'ps.seg.smallGroups':         'أفواج صغيرة',
    'ps.seg.individual':          'فردي',
    'ps.banner.visibility':       'حجم الفوج والأماكن المتبقّية ظاهرة دائماً — تفضيل قوي للأولياء.',
    'ps.shortlistPill':           'قائمتي المختصرة',
    'tc.tip.add':                 'إضافة إلى قائمتي المختصرة',
    'tc.tip.remove':              'إزالة من القائمة المختصرة',
    'tc.toast.added':             'أُضيف إلى قائمتك المختصرة',
    'tc.toast.removed':           'أُزيل من قائمتك المختصرة',
    'tc.recommended':             '★ موصى به',
    'tc.smallGroup':              'فوج صغير',
    'tc.maxStudents':             'بحدّ أقصى {n} تلاميذ',
    'tc.price.label':             'السّعر',
    'tc.price.from':              'ابتداءً من',
    'tc.price.unit.month':        'شهر',
    'tc.trial':                   'حصّة تجريبيّة',
    'tc.profilComplete':          'ملف مكتمل',
    'tc.followReports':           'تقارير المتابعة',
    'tc.whatsappDirect':          'WhatsApp مباشر',
    'tc.btn.profile':             'عرض الملف',
    'tc.btn.contact':             'تواصل',

    /* ───── Parent report ───── */
    'pr.validated':               'موثّق',
    'pr.thisMonth':               'هذا الشّهر في جملة',
    'pr.attendance':              'الحضور',
    'pr.lastScore':               'آخر علامة',
    'pr.previous':                'سابقاً {x}',
    'pr.progress':                'تقدّم هذا الشّهر',
    'pr.toWork':                  'يحتاج إلى مراجعة',
    'pr.atHome.title':            'ما يجب فعله في البيت',
    'pr.atHome.sub':              'قبل الحصّة القادمة — الموضوع الحالي : {topic}',
    'pr.teacherNote':             'ملاحظة الأستاذة',
    'pr.priv':                    'تقرير خاص يمكن الوصول إليه فقط عبر هذا الرّابط.',
    'pr.ack.btn':                 '✓ تمّ الاستلام، شكراً',
    'pr.ack.toast':               'شكراً ! تمّ إخطار الأستاذة.',
    'pr.ack.confirmed':           'لقد أكّدت الاستلام · {date}',
    'pr.contact':                 'تواصل مع الأستاذ',
    'pr.download':                'تنزيل',
    'pr.print':                   'طباعة',
    'pr.stage.eyebrow':           'شاشة الوالد · الهاتف',
    'pr.stage.title':             'ما يستلمه الوالد',
    'pr.stage.desc':              'واضح، مُطمئن وموثّق من طرف الأستاذ — حضور، علامة، نقاط تحتاج إلى مراجعة، وتوصية للبيت.',

    /* ───── WhatsApp share ───── */
    'wa.parentRole':              'وليّ ياسين · متّصل',
    'wa.greeting':                'مرحباً، كيف حال ياسين هذا الشّهر؟',
    'wa.cardTitle':               'تقرير · ياسين',
    'wa.cardSubject':             'الرّياضيات · ماي 2026',
    'wa.viewFull':                'عرض التّقرير الكامل',
    'wa.langFr':                  'فرنسي',
    'wa.langMix':                 'عربي / فرنسي',
    'wa.messageGen':              'الرّسالة المُولَّدة',
    'wa.send':                    'إرسال عبر WhatsApp',
    'wa.toast.opened':            'فُتح WhatsApp برسالة جاهزة',

    /* ───── Tutor profile ───── */
    'tp.back':                    'العودة إلى النّتائج',
    'tp.contact':                 'تواصل عبر WhatsApp',
    'tp.seeReport':               'مشاهدة نموذج تقرير',
    'tp.about':                   'عن الأستاذة',
    'tp.subjectsLevels':          'المواد والمستويات',
    'tp.subjects':                'المواد',
    'tp.levels':                  'المستويات',
    'tp.groupsAvail':             'الأفواج المتوفّرة',
    'tp.futureBooking':           'الحجز عبر الإنترنت قريباً',
    'tp.todayContact':            'حاليّاً، التّواصل يتمّ عبر WhatsApp — الحجز والدّفع عبر الإنترنت ميزات مستقبليّة.',
    'tp.contactBtn':              'تواصل مع الأستاذ',
    'tp.notifyPlace':             'أخبرني عند توفّر مكان',
    'tp.method':                  'طريقة التّدريس',
    'tp.showcase':                'واجهة العرض — أدلّة مُقدَّمة من طرف الأستاذة',
    'tp.showcase.chip':           'مُقدَّم من الأستاذة',
    'tp.showcase.desc':           'صور، رسائل وشهادات اختارت الأستاذة مشاركتها.',
    'tp.reviews':                 'التّقييمات داخل التّطبيق',
    'tp.noReviews':               'لا توجد تقييمات بعد داخل التّطبيق.',
    'tp.rail.title':              'مستعدّة لمتابعة طفلك',

    /* ───── Shortlist ───── */
    'sl.back':                    'العودة إلى البحث',
    'sl.eyebrow':                 'القائمة المختصرة',
    'sl.title':                   'الأساتذة الذين حفظتهم',
    'sl.desc':                    'قارن مرشّحيك قبل اتّخاذ القرار. يُمكنك أوّلاً الاتّصال بالعديد منهم عبر WhatsApp، ثمّ طلب حصّة تجريبيّة لدى من يُناسبك.',
    'sl.row.price':               'السّعر',
    'sl.row.places':              'الأماكن',
    'sl.row.full':                'كامل',
    'sl.row.capacity':            'السّعة القصوى',
    'sl.row.format':              'الصّيغة',
    'sl.row.location':            'الموقع',
    'sl.row.rating':              'التّقييم',
    'sl.row.trial':               'حصّة تجريبيّة',
    'sl.contact':                 'تواصل',
    'sl.profile':                 'عرض الملف',
    'sl.tip.title':               'نصيحة — اتّصل أوّلاً',
    'sl.tip.desc':                'الكثير من الأولياء يُفضّلون الاتّصال باثنين أو ثلاثة أساتذة عبر WhatsApp قبل الاختيار.',

    /* ───── Walkthrough shell ───── */
    'wt.topbar.title':            'عرض مع الشرح',
    'wt.topbar.help':             '⌨ اختصارات',
    'wt.topbar.picker':           'الانتقال إلى شاشة',
    'wt.mode.defense':            'الدّفاع',
    'wt.mode.parent':             'وليّ',
    'wt.mode.tutor':              'أستاذ',
    'wt.mode.full':               'كامل',
    'wt.prev':                    '→ السّابق',
    'wt.next':                    'التّالي ←',
    'wt.progress':                'الشّريحة {n} من {total} — {act}',
    'wt.mobileHint':              'مرّر الشّاشة أو المسها للتفاعل مع التطبيق.',
    'wt.frame.loading':           'جاري التحميل…',
    'wt.help.title':              'اختصارات لوحة المفاتيح',
    'wt.act.intro':               'تمهيد',
    'wt.act.a1':                  'الفصل 1 · الوالد يبحث عن أستاذ',
    'wt.act.a2':                  'الفصل 2 · الأستاذ يُنظّم متابعته',
    'wt.act.a3':                  'الفصل 3 · التقدّم يصبح واضحاً',
    'wt.act.outils':              'أدوات تكميليّة',
    'wt.act.close':               'الخلاصة · ثلاث طبقات، حلقة واحدة',
    'wt.act.validParent':         'التحقّق · من جانب الوالد',
    'wt.act.validTutor':          'التحقّق · من جانب الأستاذ',
    'wt.why':                     'لماذا هذا مهم',
    'wt.quote':                   'في جملة واحدة',
    'wt.layer.1.title':           'الوعد الجوهري — الثقة والتقدّم',
    'wt.layer.1.desc':            'إيجاد أستاذ موثوق وإثبات تقدّم التلميذ.',
    'wt.layer.2.title':           'المتابعة العمليّة',
    'wt.layer.2.desc':            'أفواج · حصص · حضور · ملاحظات · تقارير.',
    'wt.layer.3.title':           'أدوات تكميليّة',
    'wt.layer.3.desc':            'مدفوعات · جدول · مهام · رسائل جماعيّة.',
  },
};

/* ───── runtime ───── */
const NavI18n = {
  lang: (localStorage.getItem('nv_lang') === 'ar') ? 'ar' : 'fr',
  strings: NAV_STRINGS,
  subscribers: new Set(),
};

function t(key, vars) {
  const dict = NAV_STRINGS[NavI18n.lang] || NAV_STRINGS.fr;
  let str = dict[key];
  if (str === undefined) str = NAV_STRINGS.fr[key];
  if (str === undefined) str = key;
  if (!vars) return str;
  return Object.keys(vars).reduce(
    (s, k) => s.replace(new RegExp('\\{' + k + '\\}', 'g'), vars[k]),
    str
  );
}

function setLang(lang) {
  if (lang !== 'fr' && lang !== 'ar') return;
  if (NavI18n.lang === lang) return;
  NavI18n.lang = lang;
  localStorage.setItem('nv_lang', lang);
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;
  window.dispatchEvent(new CustomEvent('nv-lang', { detail: lang }));
}

function getLang() { return NavI18n.lang; }

function useLang() {
  const [lang, setStateLang] = React.useState(NavI18n.lang);
  React.useEffect(() => {
    const fn = (e) => setStateLang(e.detail || NavI18n.lang);
    window.addEventListener('nv-lang', fn);
    return () => window.removeEventListener('nv-lang', fn);
  }, []);
  return [lang, setLang];
}

/* ───── Data-layer translation map ─────
   Seed data (NAV.yacine, sessions, etc.) is stored in French. This map
   translates known French strings to Arabic for display. Falls back to
   the original string if no translation is found. Used via txData(s). */
const NAV_DATA_AR = {
  /* Lesson topics */
  'Équations du 1er degré':                                                   'معادلات من الدّرجة الأولى',
  'Inéquations du 1er degré':                                                 'متراجحات من الدّرجة الأولى',
  'Équations et problèmes':                                                   'معادلات ومسائل',
  'Calcul littéral':                                                          'الحساب الحرفيّ',
  'Nombres relatifs':                                                         'الأعداد النّسبيّة',
  'Théorème de Pythagore':                                                    'نظريّة فيثاغورس',
  'Les circuits électriques':                                                 'الدّارات الكهربائيّة',
  /* Plan items */
  'Méthode de résolution étape par étape':                                    'طريقة الحلّ خطوة بخطوة',
  'Vérification de la solution':                                              'التّحقّق من الحلّ',
  '5 exercices types BEM':                                                    '5 تمارين نموذجيّة BEM',
  'Problèmes de mise en équation':                                            'مسائل صياغة المعادلة',
  'Développer et factoriser':                                                 'النّشر والتّحليل',
  'Identités remarquables':                                                   'المتطابقات الشّهيرة',
  'Exercices d\'application':                                                 'تمارين تطبيقيّة',
  'Règles de signes':                                                         'قواعد الإشارات',
  'Opérations sur les relatifs':                                              'العمليّات على الأعداد النّسبيّة',
  'Énoncé et démonstration':                                                  'النّصّ والبرهنة',
  'Applications':                                                             'تطبيقات',
  /* Strengths */
  'Comprend les étapes de résolution d\'une équation':                        'يفهم خطوات حلّ المعادلة',
  'Comprend les etapes de resolution d\'une equation':                        'يفهم خطوات حلّ المعادلة',
  'Bonne participation en groupe':                                            'مشاركة جيّدة في الفوج',
  'Participation régulière':                                                  'مشاركة منتظمة',
  'Méthode de travail':                                                       'منهج عمل سليم',
  /* Point/weakness labels */
  'Concentration':                                                            'التّركيز',
  'Fractions':                                                                'الكسور',
  'Traduction des énoncés':                                                   'ترجمة المسائل',
  'Participation orale':                                                      'المشاركة الشّفويّة',
  'Problèmes':                                                                'المسائل',
  'Géométrie':                                                                'الهندسة',
  /* Plan carry-over items */
  'Reprendre la traduction des énoncés en début de prochaine séance':         'إعادة ترجمة المسائل في بداية الحصّة القادمة',
  'Reprendre la traduction des énoncés (reporté)':                            'إعادة ترجمة المسائل (مُؤجَّل)',
  'Évaluation rapide sur les signes (à préparer)':                            'تقييم سريع على الإشارات (للتّحضير)',
  'Introduction aux inéquations':                                             'تقديم المتراجحات',
  'Résolution graphique':                                                     'الحلّ البيانيّ',
  'Préparer une évaluation rapide sur les règles de signes':                  'تحضير تقييم سريع على قواعد الإشارات',
  /* Devoirs / homework */
  '5 exercices p.42 + 3 problèmes guidés':                                    '5 تمارين ص. 42 + 3 مسائل موجَّهة',
  'Exercices 12 à 18 p.38':                                                   'التّمارين 12 إلى 18 ص. 38',
  'Fiche de révision signes':                                                 'ورقة مراجعة الإشارات',
  'Exercices 4 à 10 p.55':                                                    'التّمارين 4 إلى 10 ص. 55',
  /* Comments (session) */
  'Les élèves ont compris la méthode mais bloquent sur la traduction des énoncés en équations.': 'فهم التّلاميذ الطّريقة لكنّهم يجدون صعوبة في ترجمة النّصوص إلى معادلات.',
  'Bon rythme. Quelques élèves ont eu du mal avec les identités remarquables.': 'وتيرة جيّدة. واجه بعض التّلاميذ صعوبة مع المتطابقات الشّهيرة.',
  'Séance dense. La moitié du groupe a encore besoin de pratique sur les signes.': 'حصّة مكثّفة. لا يزال نصف الفوج يحتاج إلى التّدرّب على الإشارات.',
  'Bonne séance, les élèves ont accroché.':                                   'حصّة جيّدة، تفاعل التّلاميذ بشكل ملحوظ.',
  /* Remark texts (Yacine history) */
  'Confond numérateur et dénominateur. Participe bien mais manque de méthode.': 'يخلط بين البسط والمقام. يشارك جيّداً لكن ينقصه المنهج.',
  'Grosse difficulté avec les signes dans les calculs. Distrait en fin de séance.': 'صعوبة كبيرة مع الإشارات في الحسابات. شُرود في نهاية الحصّة.',
  'Comprend mieux les fractions maintenant. Encore des erreurs de signes.':    'يفهم الكسور أحسن الآن. ولكن لا تزال هناك أخطاء في الإشارات.',
  'Bonne participation, plus concentré. Bloque pour traduire un énoncé en équation.': 'مشاركة جيّدة، أكثر تركيزاً. يجد صعوبة في ترجمة المسائل إلى معادلات.',
  /* Notes */
  'Yacine progresse bien mais a besoin de plus de pratique sur l\'interprétation des problèmes.': 'ياسين يتقدّم جيّداً لكن يحتاج إلى تدريب أكثر على فهم المسائل.',
  'Élève suivi.':                                                             'تلميذ تحت المتابعة.',
  /* Recommendations */
  'Suivre le rythme du groupe, exercices de révision avant la prochaine séance.': 'مواكبة وتيرة الفوج، تمارين مراجعة قبل الحصّة القادمة.',
  'Suivre le rythme du groupe.':                                              'مواكبة وتيرة الفوج.',
  'Quelques exercices courts avant la prochaine séance.':                     'بعض التّمارين القصيرة قبل الحصّة القادمة.',
  'Je recommande de refaire 5 exercices courts sur les règles de signes, puis 3 problèmes guidés à la maison avant la prochaine séance.': 'أنصح بإعادة 5 تمارين قصيرة على قواعد الإشارات، ثمّ 3 مسائل موجَّهة في البيت قبل الحصّة القادمة.',
  'Continuer sur sa lancée. Exercices d\'approfondissement disponibles à la maison si elle le souhaite.': 'مواصلة هذا التّقدّم. تمارين معمَّقة متوفّرة في البيت إذا رغبت.',
  'Continuer les exercices de la fiche fournie.':                             'مواصلة تمارين الورقة المُسلَّمة.',
  /* Testimonials */
  'Parent de Yacine, 4AM':                                                    'وليّة ياسين، 4 متوسّط',
  'Parent de Lina, 4AM':                                                      'وليّ لينا، 4 متوسّط',
  /* Subjects */
  'Mathématiques':                                                            'الرّياضيّات',
  'Physique':                                                                 'الفيزياء',
  'Sciences':                                                                 'العلوم',
  'Arabe':                                                                    'العربيّة',
  'Français':                                                                 'الفرنسيّة',
  'Anglais':                                                                  'الإنجليزيّة',
  /* Demo people / honorifics */
  'Mme Amina':                                                                'الأستاذة أمينة',
  'Mme Amina Belkacem':                                                       'الأستاذة أمينة بلقاسم',
  'Mme Benali':                                                               'السيدة بن علي',
  'M. Benali':                                                                'السيد بن علي',
  'M. Haddad':                                                                'السيد حدّاد',
  'Mme Cherif':                                                               'السيدة شريف',
  'Mme Mansouri':                                                             'السيدة منصوري',
  'M. Kaddour':                                                               'السيد قدور',
  'Mme Brahimi':                                                              'السيدة براهمي',
  'M. Saadi':                                                                 'السيد سعدي',
  'Mme Lounis':                                                               'السيدة لونيس',
  'Mme Tahar':                                                                'السيدة طاهر',
  'M. Karim':                                                                 'الأستاذ كريم',
  'Mme Sofia':                                                                'الأستاذة صوفيا',
  'M. Idir':                                                                  'الأستاذ إدير',
  /* Levels */
  '4e année moyenne':                                                         'السّنة الرّابعة متوسّط',
  '3e AM':                                                                    '3 متوسّط',
  '4e AM':                                                                    '4 متوسّط',
  '1AS':                                                                      '1 ثانوي',
  '1AM':                                                                      '1 متوسّط',
  '2AM':                                                                      '2 متوسّط',
  'Primaire':                                                                 'ابتدائي',
  /* Group schedules */
  'Samedi & Mardi · 16h–17h30':                                               'السّبت والثّلاثاء · 16:00–17:30',
  'Lundi & Jeudi · 17h–18h30':                                                'الإثنين والخميس · 17:00–18:30',
  'Vendredi · 10h–11h30':                                                     'الجمعة · 10:00–11:30',
  /* Group locations */
  'Ouargla centre':                                                           'وسط ورقلة',
  /* Group modes */
  'Présentiel':                                                               'حضوريّ',
  'En ligne':                                                                 'عن بُعد',
  'Hybride':                                                                  'هجين',
  /* Tutor todos (seed) */
  'Préparer le chapitre sur les inéquations':                                 'تحضير فصل المتراجحات',
  'Chercher un meilleur exemple pour la traduction des énoncés':              'البحث عن مثال أحسن لترجمة المسائل',
  'Appeler Mme Cherif au sujet des absences de Mohamed':                      'الاتّصال بالسّيّدة شريف بخصوص غيابات محمّد',
  'Mettre à jour mon profil avec une photo':                                  'تحديث ملفّي الشّخصيّ بصورة',
  'Acheter des feutres pour le tableau':                                      'شراء أقلام للسّبّورة',
  'Préparer fiche de révisions BEM blanc':                                    'تحضير ورقة مراجعات BEM التّجريبيّ',
  'Féliciter Lina pour sa note de 15/20':                                     'تهنئة لينا على علامتها 15/20',
  /* Messages (parent inbox) */
  'Bonjour Mme Amina, merci pour le rapport de Yacine. Pouvez-vous m\'expliquer comment l\'aider sur les règles de signes à la maison ?': 'السّلام عليكم سيّدة أمينة، شكراً على تقرير ياسين. هل يمكنكم شرح كيفيّة مساعدته في قواعد الإشارات في البيت؟',
  'Bonjour, Mohamed n\'a pas pu venir mardi. Pouvez-vous me dire ce qu\'il a manqué ?': 'السّلام عليكم، لم يتمكّن محمّد من الحضور يوم الثّلاثاء. هل يمكنكم إخباري بما فاته؟',
  'Et est-ce qu\'il faut rattraper quelque chose à la maison ?':               'وهل يجب تدارك شيء في البيت؟',
  'Excellente note pour Lina, merci !':                                       'علامة ممتازة للينا، شكراً!',
  'Merci à vous M. Haddad. Lina fait un travail régulier, c\'est ce qui paie.': 'الشّكر لكم سيّد حدّاد. لينا تعمل بانتظام، وهذا ما يُؤتي ثماره.',
  'Bonjour, je cherche un soutien en maths pour ma fille Yasmine en 4AM. Reste-t-il une place dans votre groupe ?': 'السّلام عليكم، أبحث عن دعم في الرّياضيّات لابنتي ياسمين في السّنة الرّابعة متوسّط. هل لا يزال هناك مكان في فوجكم؟',
  /* Status / generic labels often hit */
  '—':                                                                        '—',
};
/* txData: translate a known FR string to AR if NavI18n.lang==='ar'; else return as-is.
   Also normalizes curly apostrophes so seed strings match. */
function txData(s) {
  if (s == null) return s;
  if (NavI18n.lang !== 'ar') return s;
  if (NAV_DATA_AR[s] !== undefined) return NAV_DATA_AR[s];
  // try with normalized apostrophes
  const norm = String(s).replace(/[’‘]/g, "'");
  if (NAV_DATA_AR[norm] !== undefined) return NAV_DATA_AR[norm];
  return s;
}

/* fmt date with Algerian Arabic months when in AR mode */
const NAV_AR_MONTHS_SHORT = ['','جانفي','فيفري','مارس','أفريل','ماي','جوان','جويلية','أوت','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
function fmtDateLoc(iso) {
  if (!iso) return '';
  // try YYYY-MM-DD
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (m && NavI18n.lang === 'ar') {
    return `${parseInt(m[3],10)} ${NAV_AR_MONTHS_SHORT[parseInt(m[2],10)]} ${m[1]}`;
  }
  // Already a French short date like "18 mai" → translate month word
  if (NavI18n.lang === 'ar' && typeof iso === 'string') {
    const FR_MO = {janvier:1,'janv.':1,février:2,'févr.':2,fevrier:2,mars:3,avril:4,mai:5,juin:6,juillet:7,août:8,aout:8,septembre:9,'sept.':9,octobre:10,'oct.':10,novembre:11,'nov.':11,décembre:12,'déc.':12,decembre:12};
    const parts = iso.trim().split(/\s+/);
    if (parts.length >= 2) {
      const day = parseInt(parts[0],10);
      const moKey = parts[1].toLowerCase();
      const moIdx = FR_MO[moKey];
      if (!isNaN(day) && moIdx) {
        const year = parts[2] || '';
        return `${day} ${NAV_AR_MONTHS_SHORT[moIdx]}${year?' '+year:''}`;
      }
    }
  }
  return iso;
}

/* Set initial document direction on first load (before React mounts).
   Hides the FOUC of LTR layout flashing for AR users on refresh. */
document.documentElement.dir = NavI18n.lang === 'ar' ? 'rtl' : 'ltr';
document.documentElement.lang = NavI18n.lang;

/* attFrac like "5 séances sur 6" → "5 حصص من 6" in AR */
function attFracLoc(s) {
  if (!s || NavI18n.lang !== 'ar') return s||'';
  const m = /^(\d+)\s*séances?\s*sur\s*(\d+)/i.exec(s);
  if (m) return `${m[1]} حصص من ${m[2]}`;
  return s;
}

Object.assign(window, { NavI18n, t, txData, fmtDateLoc, attFracLoc, setLang, getLang, useLang });
