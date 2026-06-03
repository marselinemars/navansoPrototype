/* NAVANSO — Parent report (mobile) + WhatsApp share (mobile) */

function PhoneStage({children, caption}){
  return <div className="screen-anim" style={{minHeight:'100%',background:'radial-gradient(900px 500px at 50% -10%, var(--blue-50), var(--bg) 60%)',
    display:'flex',flexDirection:'column',alignItems:'center',padding:'36px 20px 56px',gap:18}}>
    {caption}
    {children}
  </div>;
}

function RepRow({icon, tone, label, children, big}){
  const fg={blue:'var(--blue-700)',green:'var(--green-700)',orange:'var(--orange-600)'}[tone];
  const bg={blue:'var(--blue-50)',green:'var(--green-50)',orange:'var(--orange-50)'}[tone];
  return <div className="row gap-12" style={{alignItems:'flex-start',padding:'14px 0',borderBottom:'1px solid var(--line-2)'}}>
    <div className="icn" style={{width:34,height:34,borderRadius:10,background:bg,color:fg,display:'grid',placeItems:'center',flex:'none'}}><Icon name={icon} size={17}/></div>
    <div className="col grow" style={{gap:4}}>
      <span className="t-12 faint w-700" style={{textTransform:'uppercase',letterSpacing:'.04em',fontSize:10.5}}>{label}</span>
      <div className={big?'w-700':'t-14'} style={big?{fontSize:16}:{color:'var(--ink-2)',lineHeight:1.45}}>{children}</div>
    </div>
  </div>;
}

/* Helper — generates a warm, single-sentence summary of the month from
   existing data. The sentence sits at the top of the report (B17.2) and
   contextualizes the numbers that follow. */
function monthOneLiner(y, pts, isAr){
  const first = (y.name||'').split(' ')[0] || (isAr?'التّلميذ':'L\'élève');
  const progressed = (pts?.resolved||[]).length > 0;
  const hasWeak    = (pts?.active||[]).length > 0;
  const trend = (y.trend||'').toString();
  const trendUp = trend.startsWith('+') && trend !== '+0';
  const progressLabel = progressed ? (isAr?txData(pts.resolved[0].label):pts.resolved[0].label.toLowerCase()) : '';
  const weakLabel = hasWeak ? (isAr?txData(pts.active[0].label):pts.active[0].label.toLowerCase()) : '';
  if(isAr && progressed && hasWeak){
    return `هذا الشّهر، أحرز ${first} تقدّماً في ${progressLabel} — وتبقى ${weakLabel} للتّعزيز.`;
  }
  if(isAr && progressed){
    return `شهر جيّد جداً لـ ${first}: تقدّم واضح في ${progressLabel}.`;
  }
  if(isAr && hasWeak && trendUp){
    return `${first} تابع جيّداً هذا الشّهر (${trend} نقاط) — التّركيز القادم على ${weakLabel}.`;
  }
  if(isAr && hasWeak){
    return `${first} بقي متفاعلاً — الأولويّة الآن هي تعزيز ${weakLabel}.`;
  }
  if(isAr){
    return `${first} بقي منتظماً ومتفاعلاً — شهر مستقرّ.`;
  }
  if(progressed && hasWeak){
    return `Ce mois, ${first} a progressé sur ${progressLabel} — il reste ${weakLabel} à consolider.`;
  }
  if(progressed){
    return `Très bon mois pour ${first} : nets progrès sur ${progressLabel}.`;
  }
  if(hasWeak && trendUp){
    return `${first} a bien suivi ce mois (${trend} pts) — focus à venir sur ${weakLabel}.`;
  }
  if(hasWeak){
    return `${first} reste impliqué — point à travailler en priorité : ${weakLabel}.`;
  }
  return `${first} reste régulier et impliqué — un mois solide.`;
}

function ParentReport({go, embed, id}){
  useStore(); useLang();
  const isAr = NavI18n.lang==='ar';
  // id is the report token (e.g. "r-yacine-mai-2026"). If absent, default to Yacine's seeded one.
  const token = id || 'r-yacine-mai-2026';
  const reportRec = Nav.reportByToken(token) || Nav.reportByToken('r-yacine-mai-2026');
  // mark this report viewed (once) + flip any outbound message that linked here to "read"
  React.useEffect(()=>{
    if(reportRec){
      if(!reportRec.viewedAt){
        NavStore.set(d=>{const list=d.reports||JSON.parse(JSON.stringify(NAV.reports));
          const r=list.find(x=>x.id===reportRec.id); if(r) r.viewedAt=new Date().toISOString();
          d.reports=list; return d;});
      }
      Nav.markOutboundReadByReportToken(reportRec.token);
    }
  }, [reportRec?.id]);
  const student = reportRec ? Nav.studentById(reportRec.studentId) : null;
  const summary = reportRec?.summary || {};
  // Build the on-screen y object from the report or fall back to NAV.yacine for the demo
  const isYacine = reportRec?.studentId==='s1';
  const y = isYacine ? NAV.yacine : (student ? {
    name: student.name, initials: student.initials, av: student.av,
    level: student.level, subject: student.subject,
    att: parseInt(summary.att||'0')||student.att, attFrac: summary.attFrac||'',
    result: summary.result||student.result, prevResult:'—', trend: summary.trend||'+0',
    strengths: summary.strengths||[], weak: summary.toWork||[],
    reco: summary.reco||'', note: summary.note||'', lastLesson: summary.topic||'—',
  } : NAV.yacine);
  const pts=pointsOf(reportRec?.studentId||'s1');
  /* Algerian Arabic month names (transliterated from French calendar). */
  const AR_MONTHS = ['جانفي','فيفري','مارس','أفريل','ماي','جوان','جويلية','أوت','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
  const reportDate = reportRec?.date
    ? (isAr
        ? `${parseInt(reportRec.date.slice(8,10))} ${AR_MONTHS[parseInt(reportRec.date.slice(5,7))-1]} ${reportRec.date.slice(0,4)}`
        : new Date(reportRec.date).toLocaleDateString('fr-FR',{day:'2-digit',month:'long',year:'numeric'}))
    : (isAr?'20 ماي 2026':'20 mai 2026');
  /* Translation map for common point labels + strengths (used in the report). */
  const POINT_AR = {
    'Concentration':'التّركيز','Fractions':'الكسور','Signes':'قواعد الإشارات',
    'Problèmes':'المسائل','Équations':'المعادلات','Géométrie':'الهندسة',
    'Lecture d\'énoncé':'قراءة النّص','Traduction des énoncés':'ترجمة المسائل',
    'Règles de signes':'قواعد الإشارات',
  };
  const trPt = (lbl) => isAr ? txData(lbl) : lbl;
  /* Match both ASCII (') and curly (’) apostrophes — NAV.yacine stores
     the curly one in data.jsx, our map uses ASCII. Normalise before lookup. */
  const STRENGTH_AR = {
    'Comprend les etapes de resolution dune equation':'يفهم خطوات حلّ المعادلة',
    'Bonne participation en groupe':'مشاركة جيّدة في الفوج',
    'Tres autonome':'مستقلّ جدّاً',
    'Aide ses camarades':'يُساعد زملاءه',
    'Bonne methode':'منهجيّة جيّدة',
  };
  const _normStr = s => (s||'').replace(/['’‘]/g,'').replace(/[éèêë]/g,'e').replace(/[àâä]/g,'a').replace(/[îï]/g,'i').replace(/[ôö]/g,'o').replace(/[ûü]/g,'u').replace(/[ç]/g,'c');
  const trStrength = (s) => { if(!isAr) return s; const k = _normStr(s); return STRENGTH_AR[k] || txData(s); };
  const arOr = (value, fallback) => {
    if(!isAr) return value;
    const translated = txData(value);
    return translated && translated !== value ? translated : fallback;
  };
  const reportSubject = isAr ? txData(y.subject) : y.subject;
  const reportLevel = isAr ? txData(y.level) : y.level;
  const reportLesson = isAr ? txData(y.lastLesson) : y.lastLesson;
  const reportReco = arOr(y.reco, 'ركّز معه على قواعد الإشارات في عمليّات الجمع والطّرح — تمارين قصيرة كلّ يوم لمدّة 10 دقائق.');
  const reportNote = arOr(y.note, 'تلميذ منتبه ومُتجاوب، يطرح أسئلة جيّدة في الفوج. حافظوا على وتيرة المراجعة في البيت.');
  const teacherName = isAr ? 'الأستاذة أمينة' : 'Mme Amina';
  const report = <div style={{background:'#fff',minHeight:'100%'}}>
    {/* report header */}
    <div style={{background:'linear-gradient(150deg, var(--blue-700), var(--blue-600))',color:'#fff',padding:'20px 20px 22px'}}>
      <div className="row between" style={{marginBottom:16}}>
        <div className="logo" style={{color:'#fff'}}>
          <div className="mark" style={{width:30,height:30}}><img src="assets/navanso-mark.png" style={{width:'86%',height:'86%',objectFit:'contain'}}/></div>
          <span style={{fontFamily:'var(--font-d)',fontWeight:800,fontSize:18}}>Navanso</span>
        </div>
        <span className="badge" style={{background:'rgba(255,255,255,.16)',color:'#fff'}}><Icon name="checkc" size={14}/>{t('pr.validated')}</span>
      </div>
      <div className="row gap-12">
        <Avatar initials={y.initials} cls="av-o" size={48} ring/>
        <div className="col" style={{gap:3}}>
          <span className="w-800" style={{fontSize:20,fontFamily:'var(--font-d)'}}>{y.name}</span>
          <span style={{opacity:.85,fontSize:13}}>{reportSubject} · {reportLevel}</span>
        </div>
      </div>
      <div className="row gap-16" style={{marginTop:14,opacity:.9,fontSize:12.5}}>
        <span className="row gap-6"><Icon name="user" size={14}/>{teacherName}</span>
        <span className="row gap-6"><Icon name="calendar" size={14}/>{isAr?`تقرير ${reportDate}`:`Rapport du ${reportDate}`}</span>
      </div>
    </div>
    {/* B17.2 — 7 blocs émotionnels selon le feedback de conception :
        ce mois en 1 phrase → présence/score → progrès → à travailler
        → à la maison (fusionné) → note enseignante → ack/contact */}
    {/* 1. Ce mois en une phrase — synthèse chaleureuse */}
    <div style={{padding:'16px 18px 0'}}>
      <div className="card-flat" style={{padding:'14px 16px',borderRadius:14,background:'linear-gradient(140deg, var(--blue-50), #fff 70%)',border:'1px solid var(--blue-100)'}}>
        <span className="t-11 faint w-700" style={{textTransform:'uppercase',letterSpacing:'.05em',color:'var(--blue-700)'}}>{t('pr.thisMonth')}</span>
        <p className="t-15 lh-15 w-600" style={{color:'var(--ink)',marginTop:6}}>{monthOneLiner(y,pts,isAr)}</p>
      </div>
    </div>
    {/* 2. Présence + dernière note */}
    <div style={{padding:'14px 18px 0'}}>
      <div className="row gap-10">
        <div className="card-flat grow" style={{padding:'12px 14px',borderRadius:12,background:'var(--green-50)',border:'1px solid var(--green-100)'}}>
          <div className="row between"><span className="t-12 w-700" style={{color:'var(--green-700)'}}>{t('pr.attendance')}</span><Icon name="check" size={15} style={{color:'var(--green-600)'}}/></div>
          <div className="stat-num" style={{fontSize:24,color:'var(--green-700)',marginTop:4}}>{y.att}%</div>
          <span className="t-11 faint">{isAr?attFracLoc(y.attFrac):y.attFrac}</span>
        </div>
        <div className="card-flat grow" style={{padding:'12px 14px',borderRadius:12,background:'var(--blue-50)',border:'1px solid var(--blue-100)'}}>
          <div className="row between" style={{gap:6}}><span className="t-12 w-700" style={{color:'var(--blue-700)',whiteSpace:'nowrap'}}>{t('pr.lastScore')}</span><span className="chip chip-green" style={{padding:'2px 7px',fontSize:11,flex:'none'}}><Icon name="trend" size={12}/>{y.trend}</span></div>
          <div className="stat-num" style={{fontSize:24,color:'var(--blue-700)',marginTop:4}}>{y.result}</div>
          <span className="t-11 faint">{t('pr.previous',{x:y.prevResult})}</span>
        </div>
      </div>
    </div>
    {/* sections */}
    <div style={{padding:'8px 18px 18px'}}>
      {/* 3. Progrès ce mois-ci — combine resolved points + strengths
          (auparavant deux blocs séparés). */}
      {(pts.resolved.length>0 || (y.strengths||[]).length>0) && <RepRow icon="trend" tone="green" label={t('pr.progress')}>
        {pts.resolved.length>0 && <div className="row gap-7 wrap" style={{marginTop:2,marginBottom:(y.strengths||[]).length>0?8:0}}>
          {pts.resolved.map((p,i)=><span key={i} className="chip chip-green"><Icon name="check" size={12}/>{trPt(p.label)}</span>)}
        </div>}
        {(y.strengths||[]).length>0 && <ul style={{margin:0,paddingLeft:16,paddingRight:isAr?16:0}}>
          {y.strengths.map((s,i)=><li key={i} style={{marginBottom:3,color:'var(--ink-2)'}}>{trStrength(s)}</li>)}
        </ul>}
      </RepRow>}
      {/* 4. À travailler */}
      <RepRow icon="target" tone="orange" label={t('pr.toWork')}>
        <div className="row gap-7 wrap" style={{marginTop:2}}>{(pts.active.length?pts.active.map(p=>p.label):y.weak).map((w,i)=><span key={i} className="chip chip-weak">{trPt(w)}</span>)}</div>
      </RepRow>
      {/* 5. À la maison — fusionne recommandation + prochaine étape + leçon en cours */}
      <div className="card-flat" style={{padding:16,borderRadius:14,background:'var(--green-50)',border:'1px solid var(--green-100)',margin:'14px 0 6px'}}>
        <div className="row gap-10" style={{marginBottom:9}}>
          <div className="icn" style={{width:32,height:32,borderRadius:9,background:'var(--green-600)',color:'#fff',display:'grid',placeItems:'center',flex:'none'}}><Icon name="flag" size={17}/></div>
          <div className="col" style={{gap:1}}>
            <span className="w-800 t-14" style={{color:'var(--green-700)',fontFamily:'var(--font-d)'}}>{t('pr.atHome.title')}</span>
            <span className="t-11 faint">{t('pr.atHome.sub',{topic:reportLesson})}</span>
          </div>
        </div>
        <p className="t-15 lh-15 w-500" style={{color:'var(--ink)'}}>{isAr?reportReco:y.reco}</p>
      </div>
      {/* 6. Note de l'enseignante */}
      <div className="card-flat" style={{padding:14,borderRadius:12,background:'var(--bg)',border:'none',marginTop:14}}>
        <span className="t-12 faint w-700" style={{textTransform:'uppercase',letterSpacing:'.04em'}}>{t('pr.teacherNote')}</span>
        <p className="t-14 lh-15" style={{color:'var(--ink-2)',marginTop:6}}>“{isAr?reportNote:y.note}”</p>
        <div className="row gap-8" style={{marginTop:10}}><Avatar initials="AB" cls="av-b" size={26}/><span className="t-12 w-600">{teacherName} · {isAr?'الرّياضيات':'Mathématiques'}</span></div>
      </div>
      <div className="row center" style={{marginTop:14}}><ValidSeal/></div>
      <PrivacyNote style={{marginTop:12}}/>
    </div>
    {/* actions */}
    <div style={{padding:'4px 18px 22px',position:'sticky',bottom:0,background:'linear-gradient(180deg,transparent,#fff 24%)'}}>
      <div className="col gap-10">
        <div className="row gap-6 center" style={{color:'var(--faint)'}}><Icon name="lock" size={13}/><span className="t-12 w-600">{t('pr.priv')}</span></div>
        {/* Acknowledgment — parent confirms they read the report. Sets
            acknowledgedAt on the report; the tutor sees it in their bell. */}
        {reportRec && (reportRec.acknowledgedAt
          ? <div className="card-flat row gap-10" style={{padding:'10px 12px',borderRadius:10,background:'var(--green-50)',border:'1px solid var(--green-100)',justifyContent:'center'}}>
              <Icon name="checkc" size={16} style={{color:'var(--green-700)'}}/>
              <span className="w-700 t-13" style={{color:'var(--green-700)'}}>{t('pr.ack.confirmed',{date:fmtFr?fmtFr(reportRec.acknowledgedAt.slice(0,10)):''})}</span>
            </div>
          : <Btn variant="green" icon="checkc" block onClick={()=>{
              NavStore.set(d=>{const list=d.reports||JSON.parse(JSON.stringify(NAV.reports));
                const r=list.find(x=>x.id===reportRec.id); if(r) r.acknowledgedAt=new Date().toISOString();
                d.reports=list; return d;});
              navToast(t('pr.ack.toast'),'green');
            }}>{t('pr.ack.btn')}</Btn>)}
        <Btn variant="wa" icon="wa" block onClick={()=>{
          const parent = student ? Nav.parentOfStudent(student.id) : Nav.parentById('pa1');
          // find or open the relevant thread
          const thread = parent ? Nav.threadsAll().find(t=>t.parentId===parent.id && t.studentId===(student?.id)) : null;
          if(thread) go('parent-thread', thread.id);
          else if(parent) go('parent-thread', thread?.id);
          else go('whatsapp-share');
        }}>{t('pr.contact')}</Btn>
        <div className="row gap-10">
          <Btn variant="ghost" size="sm" icon="download" style={{flex:1}} onClick={()=>{window.print();}}>{t('pr.download')}</Btn>
          <Btn variant="ghost" size="sm" icon="print" style={{flex:1}} onClick={()=>{window.print();}}>{t('pr.print')}</Btn>
        </div>
      </div>
    </div>
  </div>;

  if(embed) return report;

  return <PhoneStage caption={
    <div className="col gap-6" style={{textAlign:'center',maxWidth:560}}>
      <span className="eyebrow">{t('pr.stage.eyebrow')}</span>
      <h2 style={{fontSize:24}}>{t('pr.stage.title')}</h2>
      <p className="muted t-15">{t('pr.stage.desc')}</p>
    </div>
  }>
    <Phone>{report}</Phone>
    {NavAuth.isLoggedIn() && <Btn variant="ghost" icon="arrowl" onClick={()=>go('report-gen')}>{isAr?'العودة إلى توليد التّقرير':'Revenir à la génération du rapport'}</Btn>}
  </PhoneStage>;
}

function WhatsAppShare({go, embed}){
  useLang();
  const isAr = NavI18n.lang==='ar';
  const [lang,setLang]=React.useState(isAr?'mix':'fr');
  const msgFr="Bonjour Mme Benali, voici le rapport de suivi de Yacine en mathématiques. Présence 87%, dernière note 12/20, à travailler : les règles de signes. Rapport complet : https://navanso.dz/r/yacine-mai";
  const msgMix="السلام عليكم، هذا تقرير متابعة ياسين في مادة الرّياضيات. الحضور 87%، آخر علامة 12/20. التّقرير الكامل: https://navanso.dz/r/yacine-mai";
  const msg=lang==='fr'?msgFr:msgMix;
  /* Build the chat content once; in embed mode (walkthrough/iframe) we return
     just that, without the outer PhoneStage caption + Phone bezel + back btn —
     because the walkthrough already provides commentary and a phone frame. */
  const chat = (
    <div style={{minHeight:'100%',display:'flex',flexDirection:'column',background:'#E9EDF2'}}>
        {/* chat header */}
        <div className="row gap-12" style={{padding:'12px 16px',background:'#fff',borderBottom:'1px solid var(--line)'}}>
          <Icon name="arrowl" size={20} style={{color:'var(--muted)'}}/>
          <Avatar initials="B" cls="av-o" size={36}/>
          <div className="col" style={{gap:1}}><span className="w-700 t-14">{isAr?'السيدة بن علي':'Mme Benali'}</span><span className="faint t-12">{t('wa.parentRole')}</span></div>
          <Icon name="phone" size={18} style={{color:'var(--green-600)',marginLeft:'auto'}}/>
        </div>
        {/* chat body */}
        <div className="grow col gap-10" style={{padding:'16px',justifyContent:'flex-end'}}>
          <div style={{alignSelf:'flex-start',background:'#fff',borderRadius:'14px 14px 14px 4px',padding:'10px 13px',maxWidth:'78%',boxShadow:'var(--sh-1)'}}>
            <span className="t-14">{t('wa.greeting')}</span>
            <div className="faint t-11" style={{textAlign:'right',marginTop:3}}>14:02</div>
          </div>
          {/* report card bubble */}
          <div style={{alignSelf:'flex-end',background:'#DCF7E3',borderRadius:'14px 14px 4px 14px',padding:'8px',maxWidth:'86%',boxShadow:'var(--sh-1)'}}>
            <div className="card-flat" style={{background:'#fff',borderRadius:10,padding:12,border:'none',marginBottom:6}}>
              <div className="row gap-8" style={{marginBottom:8}}>
                <div className="mark" style={{width:28,height:28}}><img src="assets/navanso-mark.png" style={{width:'86%',height:'86%',objectFit:'contain'}}/></div>
                <div className="col" style={{gap:0}}><span className="w-700 t-13">{t('wa.cardTitle')}</span><span className="faint t-11">{t('wa.cardSubject')}</span></div>
              </div>
              <div className="row gap-8">
                <span className="chip chip-green" style={{fontSize:11}}>{isAr?'الحضور 87%':'Présence 87%'}</span>
                <span className="chip chip-blue" style={{fontSize:11}}>12/20</span>
              </div>
              <div className="row gap-6" style={{marginTop:8,color:'var(--blue-700)'}}><Icon name="file" size={14}/><span className="t-12 w-600">{t('wa.viewFull')}</span></div>
            </div>
            <span className="t-13" style={{display:'block',padding:'0 4px',color:'var(--ink-2)',lineHeight:1.4}}>{msg}</span>
            <div className="row gap-4" style={{justifyContent:'flex-end',marginTop:4,color:'#1FA855'}}>
              <span className="faint t-11">14:05</span><Icon name="check" size={14}/>
            </div>
          </div>
        </div>
        {/* composer */}
        <div style={{background:'#fff',borderTop:'1px solid var(--line)',padding:'12px 14px'}}>
          <div className="seg" style={{width:'100%',marginBottom:10}}>
            <button className={lang==='fr'?'on':''} style={{flex:1}} onClick={()=>setLang('fr')}>{t('wa.langFr')}</button>
            <button className={lang==='mix'?'on':''} style={{flex:1}} onClick={()=>setLang('mix')}>{t('wa.langMix')}</button>
          </div>
          <div className="card-flat" style={{padding:10,borderRadius:12,background:'var(--bg)',border:'1px solid var(--line)',marginBottom:10}}>
            <span className="t-12 faint w-700" style={{textTransform:'uppercase',letterSpacing:'.04em'}}>{t('wa.messageGen')}</span>
            <p className="t-13 lh-14" style={{color:'var(--ink-2)',marginTop:6,direction:lang==='mix'?'rtl':'ltr'}}>{msg}</p>
          </div>
          <Btn variant="wa" icon="send" block onClick={()=>{
            const parent = Nav.parentOfStudent('s1') || Nav.parentById('pa1') || {};
            const phone = (parent.phone||'').replace(/[^0-9]/g,'');
            const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
            window.open(url,'_blank');
            navToast(t('wa.toast.opened'),'green');
          }}>{t('wa.send')}</Btn>
        </div>
      </div>
  );

  if(embed) return chat;

  return <PhoneStage caption={
    <div className="col gap-6" style={{textAlign:'center',maxWidth:560}}>
      <span className="eyebrow">{isAr?'مشاركة · WhatsApp':'Partage · WhatsApp'}</span>
      <h2 style={{fontSize:24}}>{isAr?'المشاركة عبر قناة مألوفة':'Partager via un canal familier'}</h2>
      <p className="muted t-15">{isAr?'Navanso لا تحلّ محلّ WhatsApp. تُعدّ تقريراً واضحاً وموثّقاً ثمّ تشاركه على القناة التي يستعملها الأولياء فعلاً — بالفرنسيّة أو بمزيج عربي/فرنسي.':'Navanso ne remplace pas WhatsApp. Il prépare un rapport clair et validé, puis le partage sur le canal que les parents utilisent déjà — en français ou en mélange arabe/français.'}</p>
    </div>
  }>
    <Phone>{chat}</Phone>
    <Btn variant="ghost" icon="arrowl" onClick={()=>go('tutor-profile')}>{isAr?'العودة إلى ملف الأستاذ':'Revenir au profil enseignant'}</Btn>
  </PhoneStage>;
}

Object.assign(window,{ParentReport,WhatsAppShare,PhoneStage});
