/* NAVANSO — shared sample data (realistic Algerian context) */
const NAV = {};

NAV.tutor = {
  name:'Mme Amina Belkacem', short:'Mme Amina', initials:'AB', av:'av-b',
  subject:'Mathématiques', subjects:['Mathématiques','Physique'],
  level:'4e année moyenne', levels:['3e AM','4e AM (BEM)'],
  wilaya:'Ouargla', commune:'Ouargla centre',
  format:'Petit groupe · Présentiel', experience:'5 ans d’expérience en soutien scolaire',
  capacity:8, rating:4.8, reviews:23,
  price:1500, priceUnit:'mois', trial:true,
  diplomas:['Licence en Mathématiques · Université d\'Ouargla, 2017','Stage pédagogique BEM, Direction de l\'éducation, 2018'],
  bio:"Enseignante de mathématiques spécialisée dans la préparation au BEM. Je travaille en petits groupes pour suivre chaque élève de près, identifier les points faibles et tenir les parents informés des progrès réels.",
  method:["Petits groupes de 8 élèves maximum","Évaluation après chaque chapitre","Rapport de suivi mensuel aux parents","Exercices ciblés sur les points faibles"],
  // Tutor-curated external proof — uploaded by the tutor (not in-app reviews).
  // Bootstrap mechanism for trust before in-app reviews exist.
  vitrineExterne:[
    {id:'ve1', type:'whatsapp', caption:'Message d\'une maman après le BEM 2025', preview:'« Khaled a eu 18/20 en maths au BEM. Merci infiniment Mme Amina pour le travail toute l\'année. »', meta:'Mme Hadj-Ali · juillet 2025'},
    {id:'ve2', type:'notebook', caption:'Cahier d\'exercices corrigés (4AM)', preview:'Photos des fiches travaillées en petit groupe — règles de signes, équations, problèmes.', meta:'Année 2025-2026'},
    {id:'ve3', type:'diploma', caption:'Licence en Mathématiques', preview:'Université Kasdi Merbah · Ouargla, 2017. Mention Bien.', meta:'Diplôme officiel'},
    {id:'ve4', type:'whatsapp', caption:'Retour d\'un papa en cours d\'année', preview:'« Yacine est plus motivé depuis qu\'il est avec vous. Les rapports nous aident beaucoup à la maison. »', meta:'M. Benali · avril 2026'},
  ],
};

NAV.tutorTrust = [
  {icon:'check', label:'Profil complété'},
  {icon:'file', label:'Rapports de suivi disponibles'},
  {icon:'users', label:'Petits groupes'},
];

NAV.tutorGroups = [
  {id:'g1', name:'Math 4AM — Préparation BEM', subject:'Mathématiques', level:'4e AM',
   schedule:'Samedi & Mardi · 16h–17h30', cap:8, students:6, places:2, mode:'Présentiel',
   loc:'Ouargla centre', last:'Équations du 1er degré', reports:2, monthlyFee:1500},
  {id:'g2', name:'Math 3AM — Soutien', subject:'Mathématiques', level:'3e AM',
   schedule:'Lundi & Jeudi · 17h–18h30', cap:8, students:8, places:0, mode:'Présentiel',
   loc:'Ouargla centre', last:'Théorème de Pythagore', reports:0, monthlyFee:1200},
  {id:'g3', name:'Physique 4AM — BEM', subject:'Physique', level:'4e AM',
   schedule:'Vendredi · 10h–11h30', cap:6, students:5, places:1, mode:'Présentiel',
   loc:'Ouargla centre', last:'Les circuits électriques', reports:0, monthlyFee:1500},
];

NAV.students = [
  {id:'s1', name:'Yacine Benali', initials:'YB', av:'av-o', parent:'Mme Benali', parentId:'pa1', groupId:'g1',
   level:'4e année moyenne', subject:'Mathématiques',
   att:87, result:'12/20', weak:'Problèmes', status:'pending'},
  {id:'s2', name:'Lina Haddad', initials:'LH', av:'av-g', parent:'M. Haddad', parentId:'pa2', groupId:'g1',
   level:'4e année moyenne', subject:'Mathématiques',
   att:100, result:'15/20', weak:'Fractions', status:'sent'},
  {id:'s3', name:'Mohamed Cherif', initials:'MC', av:'av-b', parent:'Mme Cherif', parentId:'pa3', groupId:'g1',
   level:'4e année moyenne', subject:'Mathématiques',
   att:75, result:'10/20', weak:'Signes', status:'pending'},
  {id:'s4', name:'Sara Mansouri', initials:'SM', av:'av-g', parent:'Mme Mansouri', parentId:'pa4', groupId:'g1',
   level:'4e année moyenne', subject:'Mathématiques',
   att:92, result:'14/20', weak:'Équations', status:'sent'},
  {id:'s5', name:'Anis Kaddour', initials:'AK', av:'av-b', parent:'M. Kaddour', parentId:'pa5', groupId:'g1',
   level:'4e année moyenne', subject:'Mathématiques',
   att:83, result:'11/20', weak:'Problèmes', status:'sent'},
  {id:'s6', name:'Nour Brahimi', initials:'NB', av:'av-o', parent:'Mme Brahimi', parentId:'pa6', groupId:'g1',
   level:'4e année moyenne', subject:'Mathématiques',
   att:96, result:'16/20', weak:'—', status:'sent'},
  // 3AM students
  {id:'s7', name:'Rayan Saadi', initials:'RS', av:'av-b', parent:'M. Saadi', parentId:'pa7', groupId:'g2',
   level:'3e année moyenne', subject:'Mathématiques',
   att:88, result:'13/20', weak:'Géométrie', status:'sent'},
  {id:'s8', name:'Imane Lounis', initials:'IL', av:'av-o', parent:'Mme Lounis', parentId:'pa8', groupId:'g2',
   level:'3e année moyenne', subject:'Mathématiques',
   att:94, result:'14/20', weak:'—', status:'sent'},
];

// ---- PARENTS (new entity) ----
// One parent ↔ many children (siblings supported). Phone is the unique key.
NAV.parents = [
  {id:'pa1', name:'Mme Benali', phone:'+213 661 23 45 67', wilaya:'Ouargla', langPref:'fr', children:['s1'], createdVia:'tutor-added'},
  {id:'pa2', name:'M. Haddad', phone:'+213 770 11 22 33', wilaya:'Ouargla', langPref:'ar-fr', children:['s2'], createdVia:'tutor-added'},
  {id:'pa3', name:'Mme Cherif', phone:'+213 555 99 88 77', wilaya:'Ouargla', langPref:'fr', children:['s3'], createdVia:'tutor-added'},
  {id:'pa4', name:'Mme Mansouri', phone:'+213 770 44 55 66', wilaya:'Ouargla', langPref:'fr', children:['s4'], createdVia:'tutor-added'},
  {id:'pa5', name:'M. Kaddour', phone:'+213 661 77 88 99', wilaya:'Ouargla', langPref:'fr', children:['s5'], createdVia:'tutor-added'},
  {id:'pa6', name:'Mme Brahimi', phone:'+213 555 33 22 11', wilaya:'Ouargla', langPref:'fr', children:['s6'], createdVia:'tutor-added'},
  {id:'pa7', name:'M. Saadi',    phone:'+213 661 12 34 56', wilaya:'Ouargla', langPref:'fr', children:['s7'], createdVia:'tutor-added'},
  {id:'pa8', name:'Mme Lounis',  phone:'+213 770 88 99 00', wilaya:'Ouargla', langPref:'fr', children:['s8'], createdVia:'tutor-added'},
];

NAV.yacine = {
  name:'Yacine Benali', initials:'YB', av:'av-o',
  level:'4e année moyenne', subject:'Mathématiques', group:'Math 4AM — Préparation BEM',
  parent:'Mme Benali', parentContact:'WhatsApp',
  att:87, attFrac:'5 séances sur 6', result:'12/20', prevResult:'9/20', trend:'+3',
  strengths:['Comprend les étapes de résolution d’une équation','Bonne participation en groupe'],
  weak:['Erreurs de signes','Difficulté à traduire les énoncés','Fractions'],
  reco:'Je recommande de refaire 5 exercices courts sur les règles de signes, puis 3 problèmes guidés à la maison avant la prochaine séance.',
  note:'Yacine progresse bien mais a besoin de plus de pratique sur l’interprétation des problèmes.',
  lastLesson:'Équations et problèmes',
};

NAV.yacineAssessments = [
  {date:'18 mai', topic:'Équations du 1er degré', score:'12/20', tag:'orange'},
  {date:'04 mai', topic:'Calcul littéral', score:'11/20', tag:'orange'},
  {date:'20 avr', topic:'Nombres relatifs', score:'9/20', tag:'alert'},
  {date:'06 avr', topic:'Fractions', score:'10/20', tag:'orange'},
];

NAV.searchTutors = [
  {id:'t1', name:'Mme Amina', initials:'A', av:'av-b', subject:'Mathématiques', level:'4e AM',
   loc:'Ouargla', commune:'Ouargla centre', cap:8, students:6, places:2, line:'Suivi mensuel avec rapport parent',
   rating:4.8, reviews:23, mode:'Présentiel', featured:true, price:1500, priceUnit:'mois', trial:true},
  {id:'t2', name:'M. Karim', initials:'K', av:'av-g', subject:'Physique', level:'4e AM',
   loc:'Ouargla', commune:'Ouargla centre', cap:6, students:6, places:0, line:'Préparation intensive au BEM',
   rating:4.6, reviews:14, mode:'Présentiel', price:1800, priceUnit:'mois', trial:false},
  {id:'t3', name:'Mme Sofia', initials:'S', av:'av-o', subject:'Mathématiques', level:'3e AM',
   loc:'Ouargla', commune:'Hassi Messaoud', cap:8, students:3, places:5, line:'Méthode progressive, groupes réduits',
   rating:4.9, reviews:31, mode:'Présentiel', price:1200, priceUnit:'mois', trial:true},
  {id:'t4', name:'M. Idir', initials:'I', av:'av-b', subject:'Mathématiques', level:'4e AM',
   loc:'Ouargla', commune:'En ligne', cap:10, students:8, places:2, line:'Ancien enseignant, 12 ans d’expérience',
   rating:4.7, reviews:42, mode:'En ligne & présentiel', price:1400, priceUnit:'mois', trial:true},
];

NAV.weakChips = ['Fractions','Équations','Problèmes','Règles de signes','Nombres relatifs','Calcul littéral','Lecture d’énoncé','Géométrie'];

NAV.dashboard = {
  groups:3, students:24, sessionsWeek:5, sessionToday:1, reportsPending:2, places:3,
  recent:[
    {student:'Lina Haddad', av:'av-g', initials:'LH', action:'Rapport envoyé', when:'il y a 2 h', subject:'Math 4AM'},
    {student:'Sara Mansouri', av:'av-g', initials:'SM', action:'Rapport envoyé', when:'hier', subject:'Math 4AM'},
    {student:'Mohamed Cherif', av:'av-b', initials:'MC', action:'Évaluation ajoutée', when:'hier', subject:'Math 4AM'},
  ],
};

NAV.plans = [
  {id:'free', name:'Gratuit', tag:'Pour débuter', price:'0', unit:'DZD', accent:'gray',
   desc:'Pour les nouveaux enseignants qui créent leur profil.',
   feats:['Profil de base','1 groupe','Jusqu’à 10 élèves','Rapports limités','Partage WhatsApp'],
   cta:'Commencer'},
  {id:'basic', name:'Enseignant', tag:'Le plus choisi', price:'990', unit:'DZD / mois', accent:'blue', popular:true,
   desc:'Pour l’enseignant indépendant qui gère plusieurs groupes.',
   feats:['Plusieurs groupes','Gestion des élèves','Suivi de présence','Rapports parents illimités','Partage WhatsApp','Historique des rapports'],
   cta:'Choisir ce plan'},
  {id:'premium', name:'Enseignant Premium', tag:'Pour aller plus loin', price:'1 990', unit:'DZD / mois', accent:'green',
   desc:'Pour l’enseignant actif qui veut plus de visibilité.',
   feats:['Visibilité renforcée du profil','Assistant de rédaction des rapports','Plus de groupes & d’élèves','Suivi avancé des points faibles','Statistiques de progression'],
   cta:'Choisir ce plan'},
  {id:'center', name:'Centre', tag:'Pour les structures', price:'Sur devis', unit:'à valider', accent:'orange',
   desc:'Pour les petits centres de soutien.',
   feats:['Gestion multi-groupes','Comptes enseignants','Rapports parents','Tableau de présence','Identité du centre'],
   cta:'Nous contacter'},
];

NAV.roadmap = [
  {phase:'Bientôt', when:'Prochaine étape', accent:'green', items:[
    {t:'Comptes parents', d:'Un espace parent pour suivre tous ses enfants au même endroit.'},
    {t:'Profils enseignants vérifiés', d:'Vérification d’identité gérée par Navanso pour renforcer la confiance.'},
    {t:'Système d’avis parents', d:'Avis et témoignages structurés après le suivi.'},
  ]},
  {phase:'En exploration', when:'Vision produit', accent:'blue', items:[
    {t:'Réservation en ligne', d:'Réserver une place dans un groupe directement depuis le profil.'},
    {t:'Tableau de bord centre', d:'Gestion des enseignants, groupes et présences pour les centres.'},
    {t:'Statistiques avancées', d:'Analyse fine des progrès et points faibles par groupe.'},
  ]},
  {phase:'Plus tard', when:'Long terme', accent:'orange', items:[
    {t:'Paiement en ligne', d:'Paiement des cours intégré, adapté au marché local.'},
    {t:'Application mobile', d:'Application native pour enseignants et parents.'},
    {t:'Marketplace complète', d:'Découverte et mise en relation à plus grande échelle.'},
  ]},
];

NAV.testimonials = [
  {name:'Mme Benali', role:'Parent de Yacine, 4AM', initials:'B', av:'av-o',
   text:"Je reçois un rapport clair chaque mois. Je sais enfin sur quoi mon fils doit travailler à la maison."},
  {name:'M. Haddad', role:'Parent de Lina, 4AM', initials:'H', av:'av-g',
   text:"Le petit groupe et le suivi font la différence. Les places limitées montrent que l’enseignante prend le sérieux."},
];

// ---- SESSIONS (new entity — per group, real teaching log) ----
// Each session has a planned topic + actually-covered items + deferred items
// + to-dos that carry to next session + per-student attendance summary.
NAV.sessions = [
  {id:'sess1', groupId:'g1', date:'2026-05-18', status:'completed',
   plannedTopic:'Équations du 1er degré',
   plannedItems:[
     {id:'pi1', text:'Méthode de résolution étape par étape', covered:true},
     {id:'pi2', text:'Vérification de la solution', covered:true},
     {id:'pi3', text:'5 exercices types BEM', covered:'partial'},
     {id:'pi4', text:'Problèmes de mise en équation', covered:false, deferred:true},
   ],
   comments:'Les élèves ont compris la méthode mais bloquent sur la traduction des énoncés en équations.',
   homework:'5 exercices p.42 + 3 problèmes guidés',
   todos:[
     {id:'td1', text:'Reprendre la traduction des énoncés en début de prochaine séance', done:false, carryToNext:true},
     {id:'td2', text:'Préparer une évaluation rapide sur les règles de signes', done:false, carryToNext:true},
   ],
   attendance:[
     {studentId:'s1', status:'present', remark:'Bonne participation, plus concentré. Bloque sur la traduction des énoncés.', flags:['Traduction des énoncés'], score:12},
     {studentId:'s2', status:'present', remark:'Excellente comme d\'habitude.', flags:[], score:15},
     {studentId:'s3', status:'present', remark:'Toujours des erreurs de signes.', flags:['Règles de signes'], score:10},
     {studentId:'s4', status:'present', remark:'Bonne progression.', flags:[], score:14},
     {studentId:'s5', status:'late',    remark:'Arrivé 15 min en retard. A suivi quand même.', flags:[], score:11},
     {studentId:'s6', status:'present', remark:'Très bon niveau.', flags:[], score:16},
   ],
  },
  {id:'sess2', groupId:'g1', date:'2026-05-14', status:'completed',
   plannedTopic:'Calcul littéral',
   plannedItems:[
     {id:'pi5', text:'Développer et factoriser', covered:true},
     {id:'pi6', text:'Identités remarquables', covered:true},
     {id:'pi7', text:'Exercices d\'application', covered:'partial'},
   ],
   comments:'Bon rythme. Quelques élèves ont eu du mal avec les identités remarquables.',
   homework:'Exercices 12 à 18 p.38',
   todos:[],
   attendance:[
     {studentId:'s1', status:'present', remark:'', flags:[], score:null},
     {studentId:'s2', status:'present', remark:'', flags:[], score:null},
     {studentId:'s3', status:'absent',  remark:'Absent — parent à contacter.', flags:[], score:null},
     {studentId:'s4', status:'present', remark:'', flags:[], score:null},
     {studentId:'s5', status:'present', remark:'', flags:[], score:null},
     {studentId:'s6', status:'present', remark:'', flags:[], score:null},
   ],
  },
  {id:'sess3', groupId:'g1', date:'2026-05-11', status:'completed',
   plannedTopic:'Nombres relatifs',
   plannedItems:[
     {id:'pi8', text:'Règles de signes', covered:true},
     {id:'pi9', text:'Opérations sur les relatifs', covered:true},
   ],
   comments:'Séance dense. La moitié du groupe a encore besoin de pratique sur les signes.',
   homework:'Fiche de révision signes',
   todos:[],
   attendance:NAV.students.filter(s=>s.groupId==='g1').map(s=>({studentId:s.id,status:'present',remark:'',flags:[],score:null})),
  },
  // next planned session (status:planned)
  {id:'sess4', groupId:'g1', date:'2026-05-22', status:'planned',
   plannedTopic:'Inéquations du 1er degré',
   plannedItems:[
     {id:'pi10', text:'Reprendre la traduction des énoncés (reporté)', covered:false},
     {id:'pi11', text:'Évaluation rapide sur les signes (à préparer)', covered:false},
     {id:'pi12', text:'Introduction aux inéquations', covered:false},
     {id:'pi13', text:'Résolution graphique', covered:false},
   ],
   comments:'',
   homework:'',
   todos:[],
   attendance:[],
   carriedFrom:'sess1', // session id that contributed deferred items / todos
  },
  // 3AM group sessions
  {id:'sess5', groupId:'g2', date:'2026-05-19', status:'completed',
   plannedTopic:'Théorème de Pythagore',
   plannedItems:[
     {id:'pi14', text:'Énoncé et démonstration', covered:true},
     {id:'pi15', text:'Applications', covered:true},
   ],
   comments:'Bonne séance, les élèves ont accroché.',
   homework:'Exercices 4 à 10 p.55',
   todos:[],
   attendance:[
     {studentId:'s7', status:'present', remark:'', flags:[], score:13},
     {studentId:'s8', status:'present', remark:'', flags:[], score:14},
   ],
  },
];

// ---- REPORTS (now a first-class entity with tokens) ----
NAV.reports = [
  {id:'rep1', studentId:'s1', groupId:'g1', date:'2026-05-20', token:'r-yacine-mai-2026',
   status:'validated_sent', viewedAt:'2026-05-21T08:42:00',
   tutorId:'t1',
   summary:{att:'87%', attFrac:'5 séances sur 6', result:'12/20', trend:'+3',
     topic:'Équations et problèmes',
     strengths:['Comprend les étapes de résolution d\'une équation','Bonne participation en groupe'],
     improved:['Fractions','Concentration'],
     toWork:['Règles de signes','Traduction des énoncés'],
     reco:'Je recommande de refaire 5 exercices courts sur les règles de signes, puis 3 problèmes guidés à la maison avant la prochaine séance.',
     nextStep:'Refaire les exercices de signes, puis évaluation courte la prochaine séance.',
     note:'Yacine progresse bien mais a besoin de plus de pratique sur l\'interprétation des problèmes.',
   }},
  {id:'rep2', studentId:'s2', groupId:'g1', date:'2026-05-20', token:'r-lina-mai-2026',
   status:'validated_sent', viewedAt:'2026-05-20T14:15:00',
   tutorId:'t1',
   summary:{att:'100%', attFrac:'6 séances sur 6', result:'15/20', trend:'+1',
     topic:'Équations et problèmes',
     strengths:['Très autonome','Aide ses camarades'],
     improved:[],
     toWork:['Fractions complexes'],
     reco:'Continuer sur sa lancée. Exercices d\'approfondissement disponibles à la maison si elle le souhaite.',
     nextStep:'Préparation BEM blanc dans 2 semaines.',
     note:'Lina maintient un excellent niveau.',
   }},
  {id:'rep3', studentId:'s4', groupId:'g1', date:'2026-04-18', token:'r-sara-avr-2026',
   status:'validated_sent', viewedAt:'2026-04-19T09:00:00',
   tutorId:'t1',
   summary:{att:'92%', attFrac:'5 séances sur 6', result:'14/20', trend:'+2',
     topic:'Calcul littéral',
     strengths:['Bonne méthode'],
     improved:['Calcul mental'],
     toWork:['Équations complexes'],
     reco:'Continuer les exercices de la fiche fournie.',
     nextStep:'Évaluation prévue la semaine prochaine.',
     note:'Sara progresse régulièrement.',
   }},
  // pending — not yet validated
  {id:'rep4', studentId:'s1', groupId:'g1', date:null, token:null,
   status:'draft', viewedAt:null,
   tutorId:'t1',
   summary:null,
  },
  {id:'rep5', studentId:'s3', groupId:'g1', date:null, token:null,
   status:'draft', viewedAt:null,
   tutorId:'t1',
   summary:null,
  },
];

// ---- PAYMENTS (per student per month — DZ cash culture) ----
// status: 'paid' | 'pending' | 'overdue'. Amount in DZD.
NAV.payments = [
  // April — most paid, two pending then overdue
  {id:'pay-s1-2026-04', studentId:'s1', groupId:'g1', month:'2026-04', amount:1500, status:'paid', method:'cash', paidAt:'2026-04-05'},
  {id:'pay-s2-2026-04', studentId:'s2', groupId:'g1', month:'2026-04', amount:1500, status:'paid', method:'cash', paidAt:'2026-04-03'},
  {id:'pay-s3-2026-04', studentId:'s3', groupId:'g1', month:'2026-04', amount:1500, status:'overdue', method:null, paidAt:null, notes:'Parent contacté le 18 avril'},
  {id:'pay-s4-2026-04', studentId:'s4', groupId:'g1', month:'2026-04', amount:1500, status:'paid', method:'cash', paidAt:'2026-04-07'},
  {id:'pay-s5-2026-04', studentId:'s5', groupId:'g1', month:'2026-04', amount:1500, status:'paid', method:'cash', paidAt:'2026-04-10'},
  {id:'pay-s6-2026-04', studentId:'s6', groupId:'g1', month:'2026-04', amount:1500, status:'paid', method:'cash', paidAt:'2026-04-02'},
  {id:'pay-s7-2026-04', studentId:'s7', groupId:'g2', month:'2026-04', amount:1200, status:'paid', method:'cash', paidAt:'2026-04-04'},
  {id:'pay-s8-2026-04', studentId:'s8', groupId:'g2', month:'2026-04', amount:1200, status:'paid', method:'cash', paidAt:'2026-04-06'},
  // May — half paid, others pending
  {id:'pay-s1-2026-05', studentId:'s1', groupId:'g1', month:'2026-05', amount:1500, status:'paid', method:'cash', paidAt:'2026-05-04'},
  {id:'pay-s2-2026-05', studentId:'s2', groupId:'g1', month:'2026-05', amount:1500, status:'paid', method:'transfer', paidAt:'2026-05-02'},
  {id:'pay-s3-2026-05', studentId:'s3', groupId:'g1', month:'2026-05', amount:1500, status:'overdue', method:null, paidAt:null, notes:'2e mois consécutif — relance prévue'},
  {id:'pay-s4-2026-05', studentId:'s4', groupId:'g1', month:'2026-05', amount:1500, status:'pending', method:null, paidAt:null},
  {id:'pay-s5-2026-05', studentId:'s5', groupId:'g1', month:'2026-05', amount:1500, status:'pending', method:null, paidAt:null},
  {id:'pay-s6-2026-05', studentId:'s6', groupId:'g1', month:'2026-05', amount:1500, status:'paid', method:'cash', paidAt:'2026-05-01'},
  {id:'pay-s7-2026-05', studentId:'s7', groupId:'g2', month:'2026-05', amount:1200, status:'paid', method:'cash', paidAt:'2026-05-03'},
  {id:'pay-s8-2026-05', studentId:'s8', groupId:'g2', month:'2026-05', amount:1200, status:'pending', method:null, paidAt:null},
];

// ---- PARENT SHORTLIST (présélection) — saved tutors per anonymous parent ----
// Persisted in localStorage under a single anonymous "current parent" key.
// For the demo, this is just an array of tutorIds.
NAV.shortlist = [];

// Inquiry status tracking for the parent side. Each entry mirrors a thread but
// from the parent's POV: pending / accepted / declined. After acceptance, the
// child appears under "Vos enfants" on parent-home.
NAV.inquiryStatus = {
  // threadId → { status: 'pending'|'accepted'|'declined', kind:'inquiry'|'essai' }
};

// ---- TODOS (tutor's personal task list — global, optionally scoped) ----
// Tags drive grouping/filtering: 'lesson-prep' | 'parent-followup' | 'student-followup' | 'admin' | 'general'
NAV.todos = [
  {id:'tdg1', text:'Préparer le chapitre sur les inéquations', tag:'lesson-prep', priority:'high',
   groupId:'g1', sessionId:'sess4', done:false, createdAt:'2026-05-18T10:00:00'},
  {id:'tdg2', text:'Chercher un meilleur exemple pour la traduction des énoncés', tag:'lesson-prep', priority:'normal',
   groupId:'g1', sessionId:'sess4', done:false, createdAt:'2026-05-18T10:01:00'},
  {id:'tdg3', text:'Appeler Mme Cherif au sujet des absences de Mohamed', tag:'parent-followup', priority:'high',
   groupId:'g1', studentId:'s3', done:false, createdAt:'2026-05-20T18:00:00'},
  {id:'tdg4', text:'Préparer une évaluation rapide sur les règles de signes', tag:'lesson-prep', priority:'normal',
   groupId:'g1', sessionId:'sess4', done:false, createdAt:'2026-05-18T10:02:00'},
  {id:'tdg5', text:'Mettre à jour mon profil avec une photo', tag:'admin', priority:'low',
   done:false, createdAt:'2026-05-10T12:00:00'},
  {id:'tdg6', text:'Acheter des feutres pour le tableau', tag:'general', priority:'low',
   done:false, createdAt:'2026-05-15T09:00:00'},
  {id:'tdg7', text:'Préparer fiche de révisions BEM blanc', tag:'lesson-prep', priority:'normal',
   groupId:'g1', done:false, createdAt:'2026-05-19T08:00:00'},
  {id:'tdg8', text:'Féliciter Lina pour sa note de 15/20', tag:'student-followup', priority:'low',
   studentId:'s2', done:true, doneAt:'2026-05-20T16:05:00', createdAt:'2026-05-20T15:50:00'},
];

// ---- THREADS + MESSAGES (parent ↔ tutor) ----
// A Thread is one conversation between a parent and a tutor about one student.
// Messages can be inbound (parent → tutor) or outbound (tutor → parent).
NAV.threads = [
  {id:'th1', parentId:'pa1', studentId:'s1', tutorId:'t1',
   lastMessageAt:'2026-05-22T10:30:00', unreadCount:1, linkedReportId:'rep1', kind:'follow-up'},
  {id:'th2', parentId:'pa3', studentId:'s3', tutorId:'t1',
   lastMessageAt:'2026-05-21T18:12:00', unreadCount:2, linkedReportId:null, kind:'follow-up'},
  {id:'th3', parentId:'pa2', studentId:'s2', tutorId:'t1',
   lastMessageAt:'2026-05-20T15:40:00', unreadCount:0, linkedReportId:'rep2', kind:'follow-up'},
  // a parent inquiry from public search (no student yet — uses prospectiveStudent)
  {id:'th4', parentId:'pa9', studentId:null, tutorId:'t1',
   lastMessageAt:'2026-05-22T16:05:00', unreadCount:1, linkedReportId:null, kind:'inquiry',
   prospectiveStudent:{name:'Yasmine Tahar', level:'4e AM (BEM)', subject:'Mathématiques'}},
];

// A 9th parent — prospective, has no kid in our system yet
NAV.parents.push({id:'pa9', name:'Mme Tahar', phone:'+213 770 99 88 77', wilaya:'Ouargla',
  langPref:'fr', children:[], createdVia:'public-inquiry'});

NAV.messages = [
  // th1 (Mme Benali about Yacine)
  {id:'m1', threadId:'th1', direction:'in', text:'Bonjour Mme Amina, merci pour le rapport de Yacine. Pouvez-vous m\'expliquer comment l\'aider sur les règles de signes à la maison ?',
   createdAt:'2026-05-22T10:30:00', channel:'whatsapp', linkedReportId:'rep1', status:'unread'},
  // th2 (Mme Cherif about Mohamed — absent issue)
  {id:'m2', threadId:'th2', direction:'in', text:'Bonjour, Mohamed n\'a pas pu venir mardi. Pouvez-vous me dire ce qu\'il a manqué ?',
   createdAt:'2026-05-21T18:00:00', channel:'whatsapp', status:'unread'},
  {id:'m3', threadId:'th2', direction:'in', text:'Et est-ce qu\'il faut rattraper quelque chose à la maison ?',
   createdAt:'2026-05-21T18:12:00', channel:'whatsapp', status:'unread'},
  // th3 (M. Haddad about Lina — already replied)
  {id:'m4', threadId:'th3', direction:'in', text:'Excellente note pour Lina, merci !',
   createdAt:'2026-05-20T15:40:00', channel:'whatsapp', linkedReportId:'rep2', status:'read'},
  {id:'m5', threadId:'th3', direction:'out', text:'Merci à vous M. Haddad. Lina fait un travail régulier, c\'est ce qui paie.',
   createdAt:'2026-05-20T16:02:00', channel:'whatsapp', status:'sent'},
  // th4 (public inquiry from Mme Tahar)
  {id:'m6', threadId:'th4', direction:'in',
   text:'Bonjour, je cherche un soutien en maths pour ma fille Yasmine en 4AM. Reste-t-il une place dans votre groupe ?',
   createdAt:'2026-05-22T16:05:00', channel:'platform-inquiry', status:'unread',
   meta:{source:'parent-search', tutorCardClicked:'t1'}},
];

window.NAV = NAV;

/* =======================================================================
   NavStore — reactive store for session remarks + tracked follow-up points.
   Persists to localStorage so the demo keeps a real history across reloads.
   ======================================================================= */
const NAV_SEED = {
  remarks: {
    s1: [
      {id:'r1', date:'06 avr', topic:'Fractions', present:true,
       text:'Confond numérateur et dénominateur. Participe bien mais manque de méthode.', flags:['Fractions']},
      {id:'r2', date:'20 avr', topic:'Nombres relatifs', present:true,
       text:'Grosse difficulté avec les signes dans les calculs. Distrait en fin de séance.', flags:['Règles de signes','Concentration']},
      {id:'r3', date:'04 mai', topic:'Calcul littéral', present:true,
       text:'Comprend mieux les fractions maintenant. Encore des erreurs de signes.', flags:['Règles de signes']},
      {id:'r4', date:'18 mai', topic:'Équations du 1er degré', present:true,
       text:'Bonne participation, plus concentré. Bloque pour traduire un énoncé en équation.', flags:['Traduction des énoncés']},
    ],
  },
  points: {
    s1: [
      {id:'p1', label:'Règles de signes', status:'active',   since:'20 avr', mentions:2},
      {id:'p2', label:'Traduction des énoncés', status:'active', since:'18 mai', mentions:1},
      {id:'p3', label:'Fractions', status:'resolved', since:'06 avr', mentions:2},
      {id:'p4', label:'Concentration', status:'resolved', since:'20 avr', mentions:1},
    ],
  },
  // ---- new in v2: persisted dynamic state for sessions, threads, messages, reports, parents, students, groups ----
  sessions:  null,   // null = use NAV.sessions seed (cloned on first write)
  threads:   null,
  messages:  null,
  reports:   null,
  parents:   null,
  students:  null,
  groups:    null,
  notifsReadAt: null, // ISO timestamp — anything older than this is "read"
};

const NavStore = {
  _d: (()=>{ try{ return JSON.parse(localStorage.getItem('nav_store'))||null; }catch(e){ return null; } })() || JSON.parse(JSON.stringify(NAV_SEED)),
  _ls: [],
  get(){ return this._d; },
  set(fn){ this._d = fn(JSON.parse(JSON.stringify(this._d))); try{localStorage.setItem('nav_store',JSON.stringify(this._d));}catch(e){} this._ls.forEach(f=>f()); },
  reset(){ this._d = JSON.parse(JSON.stringify(NAV_SEED)); try{localStorage.removeItem('nav_store');}catch(e){} this._ls.forEach(f=>f()); },
  sub(f){ this._ls.push(f); return ()=>{ this._ls = this._ls.filter(x=>x!==f); }; },
};
function useStore(){
  const [,force] = React.useState(0);
  React.useEffect(()=> NavStore.sub(()=>force(x=>x+1)), []);
  return NavStore.get();
}
// Tracks viewport width vs the ~mobile threshold. Used by screens with
// inline grid layouts that need to collapse on small screens.
function useIsMobile(){
  const [m, setM] = React.useState(()=> typeof window!=='undefined' && window.innerWidth < 640);
  React.useEffect(()=>{ const f=()=>setM(window.innerWidth < 640); window.addEventListener('resize',f); return ()=>window.removeEventListener('resize',f); }, []);
  return m;
}
// Marketing / parent-facing screens flip to mobile-style earlier (phones are
// the natural viewport for these). Tutor screens stay on the tighter 640px.
function useIsNarrow(){
  const [m, setM] = React.useState(()=> typeof window!=='undefined' && window.innerWidth < 860);
  React.useEffect(()=>{ const f=()=>setM(window.innerWidth < 860); window.addEventListener('resize',f); return ()=>window.removeEventListener('resize',f); }, []);
  return m;
}
window.useIsMobile = useIsMobile;
window.useIsNarrow = useIsNarrow;
function addRemark(sid, remark){
  NavStore.set(d=>{ d.remarks[sid] = d.remarks[sid]||[]; d.remarks[sid].unshift({id:'r'+Date.now(), ...remark}); return d; });
}
function togglePoint(sid, pid){
  NavStore.set(d=>{ d.points[sid] = (d.points[sid]||[]).map(p=> p.id===pid ? {...p, status: p.status==='active'?'resolved':'active'} : p); return d; });
}
function pointsOf(sid){ const p=NavStore.get().points[sid]||[]; return {active:p.filter(x=>x.status==='active'), resolved:p.filter(x=>x.status==='resolved'), all:p}; }

/* assistant — distil free-text remarks into problem keywords (deterministic,
   teacher-validated; no automatic diagnosis) */
const NAV_KEYWORDS = [
  {re:/sign/i,                         label:'Règles de signes'},
  {re:/fraction/i,                     label:'Fractions'},
  {re:/énonc|probl|traduire|traduction/i, label:'Traduction des énoncés'},
  {re:/équation/i,                     label:'Équations'},
  {re:/distrait|concentr|attention|focus|bavard/i, label:'Concentration'},
  {re:/lecture|lit\b|écrit|orthograph/i, label:'Lecture / écriture'},
  {re:/géométr|figure|angle/i,         label:'Géométrie'},
  {re:/calcul|opérat/i,                label:'Calcul'},
];
function analyzeRemarks(sid){
  const remarks = NavStore.get().remarks[sid]||[];
  const found = {};
  remarks.forEach(r=>{
    const hay = (r.text||'') + ' ' + (r.flags||[]).join(' ');
    NAV_KEYWORDS.forEach(k=>{ if(k.re.test(hay)) found[k.label]=(found[k.label]||0)+1; });
    (r.flags||[]).forEach(f=>{ if(!NAV_KEYWORDS.some(k=>k.label===f)) found[f]=(found[f]||0)+1; });
  });
  NavStore.set(d=>{
    const ex = d.points[sid] || [];
    const byLabel = Object.fromEntries(ex.map(p=>[p.label,p]));
    Object.entries(found).forEach(([label,n])=>{
      if(byLabel[label]){ byLabel[label].mentions = n; }
      else ex.push({id:'p'+Date.now()+Math.random().toString(36).slice(2,5), label, status:'active', since:'récent', mentions:n});
    });
    d.points[sid] = ex; return d;
  });
}

// ---- AUTH (mock for prototype) ------------------------------------------
// We keep a tiny session marker in its own localStorage key so logout clears
// it without wiping the demo's persisted data.
const _AUTH_KEY = 'nav_auth';
const NavAuth = {
  isLoggedIn(){ try { return localStorage.getItem(_AUTH_KEY)==='1'; } catch(e){ return false; } },
  user(){ return NAV.tutor; }, // single-tutor demo
  login(){ try{ localStorage.setItem(_AUTH_KEY,'1'); }catch(e){} window.dispatchEvent(new Event('nav-auth-change')); },
  logout(){ try{ localStorage.removeItem(_AUTH_KEY); }catch(e){} window.dispatchEvent(new Event('nav-auth-change')); },
};
function useAuth(){
  const [v,setV] = React.useState(0);
  React.useEffect(()=>{ const f=()=>setV(x=>x+1); window.addEventListener('nav-auth-change',f); return ()=>window.removeEventListener('nav-auth-change',f); }, []);
  return NavAuth.isLoggedIn();
}
window.NavAuth = NavAuth;
window.useAuth = useAuth;

window.NavStore = NavStore;
Object.assign(window,{useStore,addRemark,togglePoint,pointsOf,analyzeRemarks});

/* =======================================================================
   v2 entity helpers — Parents, Sessions, Threads, Messages, Reports.
   Each helper lazily clones the NAV.* seed on first write so unchanged
   collections stay shared and small. After a write the entity lives in
   the persisted store.
   ======================================================================= */
// Map entity names to NAV.* fallback (some collections use legacy keys).
const _ENTITY_FALLBACK = {parents:'parents', students:'students', groups:'tutorGroups',
  sessions:'sessions', threads:'threads', messages:'messages', reports:'reports', todos:'todos', payments:'payments'};
function _entity(key){
  const d=NavStore.get();
  if(d[key]!=null) return d[key];
  return NAV[_ENTITY_FALLBACK[key]||key];
}

// PARENTS ---------------------------------------------------------
function parentsAll(){ return _entity('parents'); }
function parentById(id){ return parentsAll().find(p=>p.id===id); }
function parentByPhone(phone){ const p=(phone||'').replace(/\s+/g,''); return parentsAll().find(x=>(x.phone||'').replace(/\s+/g,'')===p); }
function parentOfStudent(sid){ const s=studentById(sid); return s? parentById(s.parentId||(parentsAll().find(p=>p.children.includes(sid))||{}).id) : null; }
function upsertParent({name,phone,wilaya,langPref,childId,createdVia}){
  NavStore.set(d=>{
    const list = d.parents || JSON.parse(JSON.stringify(NAV.parents));
    let p = list.find(x=>(x.phone||'').replace(/\s+/g,'')===(phone||'').replace(/\s+/g,''));
    if(!p){ p = {id:'pa'+Date.now(), name, phone, wilaya:wilaya||'Ouargla', langPref:langPref||'fr', children:[], createdVia:createdVia||'tutor-added'}; list.push(p); }
    else { p.name = name||p.name; if(wilaya) p.wilaya=wilaya; if(langPref) p.langPref=langPref; }
    if(childId && !p.children.includes(childId)) p.children.push(childId);
    d.parents = list; return d;
  });
  return parentByPhone(phone);
}

// STUDENTS --------------------------------------------------------
function studentsAll(){ return _entity('students'); }
function studentById(id){ return studentsAll().find(s=>s.id===id); }
function studentsByGroup(gid){ return studentsAll().filter(s=>s.groupId===gid); }
function studentsByParent(pid){ return studentsAll().filter(s=>s.parentId===pid); }
function addStudent({name, level, parentName, parentPhone, groupId, subject, initials, av}){
  const pa = upsertParent({name:parentName, phone:parentPhone});
  const sid = 's'+Date.now();
  NavStore.set(d=>{
    const list = d.students || JSON.parse(JSON.stringify(NAV.students));
    list.push({id:sid, name, initials: initials||(name||'').split(' ').map(p=>p[0]).join('').slice(0,2).toUpperCase(),
      av: av||'av-b', parent: parentName, parentId: pa.id, groupId, level, subject:subject||'Mathématiques',
      att:0, result:'—', weak:'—', status:'new'});
    d.students = list;
    // also push the student onto the parent's children
    const parents = d.parents || JSON.parse(JSON.stringify(NAV.parents));
    const p = parents.find(x=>x.id===pa.id); if(p && !p.children.includes(sid)) p.children.push(sid);
    d.parents = parents;
    return d;
  });
  return sid;
}

// GROUPS ----------------------------------------------------------
function groupsAll(){ return _entity('groups'); }
function groupById(id){ return groupsAll().find(g=>g.id===id) || groupsAll()[0]; }
function addGroup({name, subject, level, schedule, loc, cap, mode}){
  const gid = 'g'+Date.now();
  NavStore.set(d=>{
    const list = d.groups || JSON.parse(JSON.stringify(NAV.tutorGroups));
    list.push({id:gid, name, subject, level, schedule, loc:loc||'Ouargla centre', cap:cap||8, students:0, places:cap||8,
      mode:mode||'Présentiel', last:'—', reports:0});
    d.groups = list; return d;
  });
  return gid;
}
function updateGroup(gid, patch){
  NavStore.set(d=>{
    const list = d.groups || JSON.parse(JSON.stringify(NAV.tutorGroups));
    const g = list.find(x=>x.id===gid); if(!g) return d;
    Object.assign(g, patch);
    // keep places consistent if cap changed
    if(patch.cap!=null) g.places = Math.max(0, g.cap - (g.students||0));
    d.groups = list; return d;
  });
}
function deleteGroup(gid){
  NavStore.set(d=>{
    const list = d.groups || JSON.parse(JSON.stringify(NAV.tutorGroups));
    d.groups = list.filter(x=>x.id!==gid); return d;
  });
}
// keep NAV.tutorGroups in sync alias for older code
Object.defineProperty(NAV,'_groups',{get:groupsAll});

// SESSIONS --------------------------------------------------------
function sessionsAll(){ return _entity('sessions'); }
function sessionsByGroup(gid){ return sessionsAll().filter(s=>s.groupId===gid).sort((a,b)=>(b.date||'').localeCompare(a.date||'')); }
function sessionById(id){ return sessionsAll().find(s=>s.id===id); }
function nextPlannedSession(gid){
  const list = sessionsByGroup(gid).filter(s=>s.status==='planned').sort((a,b)=>(a.date||'').localeCompare(b.date||''));
  return list[0] || null;
}
function lastCompletedSession(gid){
  const list = sessionsByGroup(gid).filter(s=>s.status==='completed');
  return list[0] || null; // already sorted desc
}
function carryOverTodos(gid){
  // pull undone todos from the most recent completed session
  const last = lastCompletedSession(gid);
  if(!last) return [];
  return (last.todos||[]).filter(t=>!t.done && t.carryToNext);
}
function upsertSession(sess){
  NavStore.set(d=>{
    const list = d.sessions || JSON.parse(JSON.stringify(NAV.sessions));
    const i = list.findIndex(s=>s.id===sess.id);
    if(i>=0) list[i] = {...list[i], ...sess};
    else list.push({...sess, id: sess.id || 'sess'+Date.now()});
    d.sessions = list; return d;
  });
}

// Parse a group.schedule string ("Samedi & Mardi · 16h–17h30") for French day
// names → array of day-of-week indices (0=Sun … 6=Sat).
const _FR_DAYS = {dimanche:0, lundi:1, mardi:2, mercredi:3, jeudi:4, vendredi:5, samedi:6};
function parseScheduleDays(schedule){
  const s = (schedule||'').toLowerCase();
  const out = [];
  Object.entries(_FR_DAYS).forEach(([name,n])=>{ if(s.includes(name)) out.push(n); });
  return out.sort();
}
// Generate `weeks` weeks of planned sessions matching the group's schedule pattern.
// Skips dates that already have a session for this group. Returns the count created.
function generateRecurringSessions(gid, weeks){
  weeks = weeks || 4;
  const g = groupById(gid);
  if(!g) return 0;
  const days = parseScheduleDays(g.schedule);
  if(days.length===0) return -1; // sentinel: no parseable pattern
  const existing = sessionsByGroup(gid);
  const existingDates = new Set(existing.map(s=>(s.date||'').slice(0,10)));
  // anchor: latest existing session date, else demo "today"
  const latestIso = existing.length ? (existing[0].date||'2026-05-22') : '2026-05-22';
  const anchor = new Date(latestIso);
  // walk weeks from anchor's week's Sunday
  const sunday = new Date(anchor); sunday.setDate(sunday.getDate() - sunday.getDay()); sunday.setHours(0,0,0,0);
  const created = [];
  for(let w=0; w<weeks; w++){
    days.forEach(dow=>{
      const d = new Date(sunday);
      d.setDate(d.getDate() + w*7 + dow);
      if(d <= anchor) return;
      const iso = d.toISOString().slice(0,10);
      if(existingDates.has(iso)) return;
      existingDates.add(iso);
      created.push({
        id:'sess'+Date.now()+'_'+w+'_'+dow,
        groupId:gid, date:iso, status:'planned',
        plannedTopic:'À définir',
        plannedItems:[], comments:'', homework:'', todos:[], attendance:[],
      });
    });
  }
  if(created.length){
    NavStore.set(d=>{
      const list = d.sessions || JSON.parse(JSON.stringify(NAV.sessions));
      d.sessions = [...list, ...created]; return d;
    });
  }
  return created.length;
}

// REPORTS ---------------------------------------------------------
function reportsAll(){ return _entity('reports'); }
function reportById(id){ return reportsAll().find(r=>r.id===id); }
function reportByToken(token){ return reportsAll().find(r=>r.token===token); }
function reportsByStudent(sid){ return reportsAll().filter(r=>r.studentId===sid); }
function reportsByParent(pid){
  const kids = studentsByParent(pid).map(s=>s.id);
  return reportsAll().filter(r=>kids.includes(r.studentId) && r.status!=='draft');
}
function reportsPending(){ return reportsAll().filter(r=>r.status==='draft'); }

// THREADS / MESSAGES ----------------------------------------------
function threadsAll(){ return _entity('threads'); }
function threadById(id){ return threadsAll().find(t=>t.id===id); }
function threadsByTutor(){ return threadsAll().sort((a,b)=>(b.lastMessageAt||'').localeCompare(a.lastMessageAt||'')); }
function threadsByParent(pid){ return threadsAll().filter(t=>t.parentId===pid).sort((a,b)=>(b.lastMessageAt||'').localeCompare(a.lastMessageAt||'')); }
function messagesAll(){ return _entity('messages'); }
function messagesOfThread(tid){ return messagesAll().filter(m=>m.threadId===tid).sort((a,b)=>(a.createdAt||'').localeCompare(b.createdAt||'')); }
function unreadCountForTutor(){ return threadsAll().reduce((n,t)=>n+(t.unreadCount||0),0); }
function unreadCountForParent(pid){ return threadsByParent(pid).reduce((n,t)=>{
  // for parent side, "unread" = outbound msgs in last 24h or new replies after their last open
  return n + messagesOfThread(t.id).filter(m=>m.direction==='out' && m.status==='sent').length;
},0); }

function markThreadRead(tid){
  NavStore.set(d=>{
    const ts = d.threads || JSON.parse(JSON.stringify(NAV.threads));
    const t = ts.find(x=>x.id===tid); if(t) t.unreadCount = 0;
    const ms = d.messages || JSON.parse(JSON.stringify(NAV.messages));
    ms.forEach(m=>{ if(m.threadId===tid && m.direction==='in' && m.status==='unread') m.status='read'; });
    d.threads = ts; d.messages = ms; return d;
  });
}

// Mark a tutor's outbound messages in this thread as "read by parent". Called
// when the parent opens the thread or a report tied to one of those messages.
function markOutboundReadByParent(tid, opts){
  opts = opts||{};
  NavStore.set(d=>{
    const ms = d.messages || JSON.parse(JSON.stringify(NAV.messages));
    const now = new Date().toISOString();
    ms.forEach(m=>{
      if(m.threadId!==tid || m.direction!=='out') return;
      // Only platform-channel messages get a real "read" stamp; WhatsApp can't be
      // confirmed unless the parent opened a linked report (acts as a proxy).
      if(m.channel==='platform' || m.channel==='parent-app' || opts.viaReport){
        if(m.status!=='read'){ m.status='read'; m.readAt=now; }
      }
    });
    d.messages = ms; return d;
  });
}
// When a report token is viewed, also mark outbound messages that referenced it
// (in any thread for that student) as read.
function markOutboundReadByReportToken(token){
  if(!token) return;
  const rep = reportByToken(token); if(!rep) return;
  NavStore.set(d=>{
    const ms = d.messages || JSON.parse(JSON.stringify(NAV.messages));
    const now = new Date().toISOString();
    ms.forEach(m=>{
      if(m.direction!=='out') return;
      if(m.linkedReportId===rep.id && m.status!=='read'){ m.status='read'; m.readAt=now; m.readVia='report'; }
    });
    d.messages = ms; return d;
  });
}

function sendMessage({threadId, direction, text, channel, linkedReportId, fromMeta}){
  if(!text || !text.trim()) return;
  NavStore.set(d=>{
    const ms = d.messages || JSON.parse(JSON.stringify(NAV.messages));
    const ts = d.threads  || JSON.parse(JSON.stringify(NAV.threads));
    const now = new Date().toISOString();
    ms.push({id:'m'+Date.now(), threadId, direction, text:text.trim(),
      channel:channel||'whatsapp', linkedReportId:linkedReportId||null,
      status: direction==='out' ? 'sent' : 'unread',
      createdAt: now, meta:fromMeta||null});
    const t = ts.find(x=>x.id===threadId);
    if(t){
      t.lastMessageAt = now;
      if(direction==='in') t.unreadCount = (t.unreadCount||0) + 1;
    }
    d.messages = ms; d.threads = ts; return d;
  });
}

// Create a thread for a parent inquiry coming from public search.
function createInquiry({tutorId, parentName, parentPhone, childName, childLevel, subject, message, langPref}){
  const pa = upsertParent({name:parentName, phone:parentPhone, langPref, createdVia:'public-inquiry'});
  const threadId = 'th'+Date.now();
  NavStore.set(d=>{
    const ts = d.threads || JSON.parse(JSON.stringify(NAV.threads));
    ts.push({id:threadId, parentId:pa.id, studentId:null, tutorId:tutorId||'t1',
      lastMessageAt:new Date().toISOString(), unreadCount:1, linkedReportId:null,
      kind:'inquiry', prospectiveStudent:{name:childName, level:childLevel, subject:subject||'Mathématiques'}});
    d.threads = ts; return d;
  });
  sendMessage({threadId, direction:'in', text:message, channel:'platform-inquiry',
    fromMeta:{source:'parent-search', tutorCardClicked:tutorId||'t1'}});
  return threadId;
}

// TODOS -----------------------------------------------------------
function todosAll(){ return _entity('todos'); }
function todosActive(){ return todosAll().filter(t=>!t.done); }
function todosDone(){ return todosAll().filter(t=>t.done); }
function todosByGroup(gid){ return todosAll().filter(t=>t.groupId===gid && !t.done); }
function todosByStudent(sid){ return todosAll().filter(t=>t.studentId===sid && !t.done); }
function todosBySession(sid){ return todosAll().filter(t=>t.sessionId===sid && !t.done); }
function todosUnscoped(){ return todosAll().filter(t=>!t.done && !t.groupId && !t.studentId && !t.sessionId); }
function addTodo({text, tag, priority, groupId, studentId, sessionId, dueDate}){
  if(!text || !text.trim()) return null;
  const id = 'td'+Date.now()+Math.random().toString(36).slice(2,5);
  NavStore.set(d=>{
    const list = d.todos || JSON.parse(JSON.stringify(NAV.todos));
    list.unshift({id, text:text.trim(), tag:tag||'general', priority:priority||'normal',
      groupId:groupId||null, studentId:studentId||null, sessionId:sessionId||null,
      dueDate:dueDate||null, done:false, createdAt:new Date().toISOString()});
    d.todos = list; return d;
  });
  return id;
}
function toggleTodo(id){
  NavStore.set(d=>{
    const list = d.todos || JSON.parse(JSON.stringify(NAV.todos));
    const t = list.find(x=>x.id===id); if(!t) return d;
    t.done = !t.done; t.doneAt = t.done ? new Date().toISOString() : null;
    d.todos = list; return d;
  });
}
function updateTodo(id, patch){
  NavStore.set(d=>{
    const list = d.todos || JSON.parse(JSON.stringify(NAV.todos));
    const t = list.find(x=>x.id===id); if(!t) return d;
    Object.assign(t, patch);
    d.todos = list; return d;
  });
}
function removeTodo(id){
  NavStore.set(d=>{
    const list = d.todos || JSON.parse(JSON.stringify(NAV.todos));
    d.todos = list.filter(x=>x.id!==id); return d;
  });
}

// SHORTLIST / PRÉSÉLECTION ---------------------------------------
function shortlistAll(){ const d=NavStore.get(); return d.shortlist || []; }
function shortlistHas(tutorId){ return shortlistAll().includes(tutorId); }
function shortlistToggle(tutorId){
  NavStore.set(d=>{
    const list = d.shortlist || [];
    d.shortlist = list.includes(tutorId) ? list.filter(x=>x!==tutorId) : [...list, tutorId];
    return d;
  });
}
function shortlistClear(){ NavStore.set(d=>{ d.shortlist = []; return d; }); }
function tutorById(id){ return (NAV.searchTutors||[]).find(t=>t.id===id); }

// INQUIRY STATUS -------------------------------------------------
// Status flows: pending → accepted (= the tutor inscribed the child) or declined.
function inquiryStatusFor(threadId){
  const d=NavStore.get(); const map=d.inquiryStatus||{};
  return map[threadId] || {status:'pending', kind:'inquiry'};
}
function setInquiryStatus(threadId, patch){
  NavStore.set(d=>{
    const map = d.inquiryStatus || {};
    map[threadId] = {...(map[threadId]||{status:'pending',kind:'inquiry'}), ...patch};
    d.inquiryStatus = map;
    return d;
  });
}
function inquiriesByParent(parentId){
  // returns thread + status, filtered to inquiry-kind threads belonging to the parent
  const threads = threadsAll().filter(t=>t.parentId===parentId && t.kind==='inquiry');
  return threads.map(t=>({thread:t, status:inquiryStatusFor(t.id)}));
}

// PAYMENTS --------------------------------------------------------
function paymentsAll(){ return _entity('payments'); }
function paymentsByStudent(sid){ return paymentsAll().filter(p=>p.studentId===sid).sort((a,b)=>(b.month||'').localeCompare(a.month||'')); }
function paymentsByGroup(gid, month){ return paymentsAll().filter(p=>p.groupId===gid && (!month||p.month===month)); }
function paymentsByMonth(month){ return paymentsAll().filter(p=>p.month===month); }
function currentMonth(){
  // demo "today" anchor
  const d = (window.todayDate?window.todayDate():new Date('2026-05-22'));
  return d.toISOString().slice(0,7);
}
function paymentStatusFor(sid, month){
  const m = month || currentMonth();
  const p = paymentsAll().find(x=>x.studentId===sid && x.month===m);
  if(!p) return {status:'missing', amount:null};
  return p;
}
function paymentsOverdueCount(){ return paymentsAll().filter(p=>p.status==='overdue').length; }
function paymentsPendingCount(month){
  const m = month || currentMonth();
  return paymentsAll().filter(p=>p.month===m && (p.status==='pending'||p.status==='overdue')).length;
}
function markPaymentPaid(id, method){
  NavStore.set(d=>{
    const list = d.payments || JSON.parse(JSON.stringify(NAV.payments));
    const p = list.find(x=>x.id===id); if(!p) return d;
    p.status = 'paid'; p.method = method||p.method||'cash'; p.paidAt = new Date().toISOString().slice(0,10);
    d.payments = list; return d;
  });
}
function markPaymentPending(id){
  NavStore.set(d=>{
    const list = d.payments || JSON.parse(JSON.stringify(NAV.payments));
    const p = list.find(x=>x.id===id); if(!p) return d;
    p.status = 'pending'; p.paidAt = null;
    d.payments = list; return d;
  });
}
function markPaymentOverdue(id){
  NavStore.set(d=>{
    const list = d.payments || JSON.parse(JSON.stringify(NAV.payments));
    const p = list.find(x=>x.id===id); if(!p) return d;
    p.status = 'overdue'; p.paidAt = null;
    d.payments = list; return d;
  });
}
function recordPayment({studentId, month, amount, method, notes}){
  NavStore.set(d=>{
    const list = d.payments || JSON.parse(JSON.stringify(NAV.payments));
    const s = (d.students || NAV.students).find(x=>x.id===studentId) || studentById(studentId);
    const id = `pay-${studentId}-${month}`;
    const existing = list.find(p=>p.id===id);
    if(existing){
      existing.status='paid'; existing.method=method||'cash'; existing.paidAt=new Date().toISOString().slice(0,10);
      if(amount) existing.amount=amount; if(notes) existing.notes=notes;
    } else {
      list.push({id, studentId, groupId:s?.groupId, month, amount:amount||1500, status:'paid', method:method||'cash',
        paidAt:new Date().toISOString().slice(0,10), notes:notes||null});
    }
    d.payments = list; return d;
  });
}

// NOTIFICATIONS ---------------------------------------------------
// Bell shows EVENTS (things that happened since the user last opened it),
// not persistent state. Pending reports + unread message counts already
// live in the sidebar badges; the bell surfaces "what's new for me".
const _BELL_KEY = 'nav_bell_seen';
function bellSeenAt(){ try{ return localStorage.getItem(_BELL_KEY) || '2026-01-01T00:00:00Z'; }catch(e){ return '2026-01-01T00:00:00Z'; } }
function markBellSeen(){ try{ localStorage.setItem(_BELL_KEY, new Date().toISOString()); }catch(e){} window.dispatchEvent(new Event('nav-bell-seen')); }

// Returns {events, ongoing}. `events` are the new-since-last-open items the
// badge counts; `ongoing` are action items always worth surfacing.
function notificationsForTutor(){
  const seen = bellSeenAt();
  const events = [];
  const ongoing = [];

  // 1) New unread inbound messages (parent → tutor) since last bell open
  messagesAll().forEach(m=>{
    if(m.direction!=='in' || m.status==='read') return;
    if((m.createdAt||'') <= seen) return; // already seen
    const t = threadById(m.threadId); if(!t) return;
    const who = (parentById(t.parentId)||{}).name || 'Parent';
    const aboutChild = t.studentId ? (studentById(t.studentId)||{}).name : ((t.prospectiveStudent||{}).name||'');
    const isInquiry = t.kind==='inquiry';
    events.push({id:'n-msg-'+m.id, kind: isInquiry?'inquiry':'message',
      label: isInquiry ? `Nouvelle demande de ${who}` : `${who} a écrit`,
      sub: aboutChild ? `Au sujet de ${aboutChild}` : '',
      excerpt: (m.text||'').slice(0,80),
      at: m.createdAt, screen:'thread', param:t.id, tone: isInquiry?'orange':'blue'});
  });

  // 2) Parents who opened a report since last bell open
  reportsAll().forEach(r=>{
    if(!r.viewedAt) return;
    if((r.viewedAt||'') <= seen) return;
    const s = studentById(r.studentId)||{};
    events.push({id:'n-vu-'+r.id, kind:'report-viewed',
      label:`${s.name||'Le parent'} · rapport ouvert`,
      sub:`Le parent a consulté le rapport du ${r.date||''}`,
      at:r.viewedAt, screen:'parent-report', param:r.token, tone:'green'});
  });

  // 2b) Parents who explicitly acknowledged a report since last bell open
  reportsAll().forEach(r=>{
    if(!r.acknowledgedAt) return;
    if((r.acknowledgedAt||'') <= seen) return;
    const s = studentById(r.studentId)||{};
    const parent = parentOfStudent(s.id);
    events.push({id:'n-ack-'+r.id, kind:'report-ack',
      label:`${(parent||{}).name || 'Le parent'} · accusé de réception`,
      sub:`A confirmé la lecture du rapport de ${s.name||''}`,
      at:r.acknowledgedAt, screen:'parent-report', param:r.token, tone:'green'});
  });

  // 3) Sessions starting within the next 24h (newish — show on the day-of)
  const today = todayDate ? todayDate() : new Date();
  groupsAll().forEach(g=>{
    const next = nextPlannedSession(g.id);
    if(!next || !next.date) return;
    const sd = new Date(next.date);
    if(isNaN(sd)) return;
    const diff = (sd.getTime()-today.getTime())/86400000;
    if(diff>=0 && diff<=1){
      events.push({id:'n-sess-'+next.id, kind:'next-session',
        label:`Séance aujourd'hui · ${g.name}`,
        sub:`${next.plannedTopic||'Programme à préparer'}`,
        at:next.date, screen:'session-entry', param:next.id, tone:'green'});
    }
  });

  // 4) Ongoing action items — always shown but NOT counted in the badge
  reportsPending().forEach(r=>{
    const s = studentById(r.studentId)||{};
    ongoing.push({id:'n-rep-'+r.id, kind:'report-pending',
      label:`Rapport à envoyer · ${s.name||''}`,
      sub:'Données collectées, prêt à valider.', at:null,
      screen:'report-gen', param:r.studentId, tone:'orange'});
  });

  // sort events newest first
  events.sort((a,b)=>(b.at||'').localeCompare(a.at||''));
  return {events, ongoing, seenAt: seen};
}

window.Nav = window.Nav || {};
Object.assign(window.Nav, {
  parentsAll, parentById, parentByPhone, parentOfStudent, upsertParent,
  studentsAll, studentById, studentsByGroup, studentsByParent, addStudent,
  groupsAll, groupById, addGroup, updateGroup, deleteGroup,
  sessionsAll, sessionsByGroup, sessionById, nextPlannedSession, lastCompletedSession, carryOverTodos, upsertSession,
  parseScheduleDays, generateRecurringSessions,
  reportsAll, reportById, reportByToken, reportsByStudent, reportsByParent, reportsPending,
  threadsAll, threadById, threadsByTutor, threadsByParent, messagesAll, messagesOfThread,
  unreadCountForTutor, unreadCountForParent, markThreadRead, markOutboundReadByParent, markOutboundReadByReportToken, sendMessage, createInquiry,
  notificationsForTutor, bellSeenAt, markBellSeen,
  todosAll, todosActive, todosDone, todosByGroup, todosByStudent, todosBySession, todosUnscoped,
  addTodo, toggleTodo, updateTodo, removeTodo,
  paymentsAll, paymentsByStudent, paymentsByGroup, paymentsByMonth, currentMonth,
  paymentStatusFor, paymentsOverdueCount, paymentsPendingCount,
  markPaymentPaid, markPaymentPending, markPaymentOverdue, recordPayment,
  shortlistAll, shortlistHas, shortlistToggle, shortlistClear, tutorById,
  inquiryStatusFor, setInquiryStatus, inquiriesByParent,
});

/* small util: parse '#screen/param' hashes */
window.parseHash = function(){
  const h = (location.hash||'').replace(/^#/,'');
  const [screen, ...rest] = h.split('/');
  const param = rest.join('/') || null;
  return {screen: screen||'', param};
};
