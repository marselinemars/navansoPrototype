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

/* Set initial document direction on first load (before React mounts).
   Hides the FOUC of LTR layout flashing for AR users on refresh. */
document.documentElement.dir = NavI18n.lang === 'ar' ? 'rtl' : 'ltr';
document.documentElement.lang = NavI18n.lang;

Object.assign(window, { NavI18n, t, setLang, getLang, useLang });
