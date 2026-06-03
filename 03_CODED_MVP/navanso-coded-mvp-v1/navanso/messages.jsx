/* NAVANSO — Messages inbox + Thread view + Parent inquiry form.
   Solves: tutor used to get random WhatsApp pings with no context. Now every
   parent message has a thread, a linked student, and a side panel with the
   student's progress so the tutor can answer informed. */

/* --------------- helpers --------------- */
function fmtAgo(iso){
  if(!iso) return '';
  const isAr = typeof NavI18n !== 'undefined' && NavI18n.lang === 'ar';
  const t = new Date(iso).getTime(); if(isNaN(t)) return iso;
  const m = Math.floor((Date.now()-t)/60000);
  if(m<1) return isAr?'الآن':'à l\'instant';
  if(m<60) return isAr?`منذ ${m} د`:`il y a ${m} min`;
  if(m<60*24) return isAr?`منذ ${Math.floor(m/60)} س`:`il y a ${Math.floor(m/60)} h`;
  if(m<60*24*7) return isAr?`منذ ${Math.floor(m/(60*24))} ي`:`il y a ${Math.floor(m/(60*24))} j`;
  return new Date(iso).toLocaleDateString('fr-FR',{day:'2-digit',month:'short'});
}
function fmtTime(iso){ if(!iso) return ''; const d=new Date(iso); if(isNaN(d)) return ''; return d.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'}); }
function digits(p){ return (p||'').replace(/[^0-9+]/g,''); }
function waLink(phone, text){ return `https://wa.me/${digits(phone).replace(/^\+/,'')}?text=${encodeURIComponent(text||'')}`; }

/* --------------- MessagesInbox --------------- */
function MessagesInbox({go}){
  useStore();
  useLang();
  const isAr = NavI18n.lang === 'ar';
  const [filter, setFilter] = React.useState('all'); // all | unread | inquiries
  const all = Nav.threadsByTutor();
  const list = all.filter(t => {
    if(filter==='unread') return (t.unreadCount||0) > 0;
    if(filter==='inquiries') return t.kind==='inquiry';
    return true;
  });
  const unreadTotal = Nav.unreadCountForTutor();
  const inquiriesCount = all.filter(t=>t.kind==='inquiry').length;
  return <AppShell go={go} active="messages" title={isAr?'رسائل الأولياء':'Messages parents'}
    crumbs={[{t:isAr?'الفضاء':'Espace',go:()=>go('dashboard')},{t:isAr?'الرّسائل':'Messages'}]}
    actions={<Btn variant="ghost" icon="user" onClick={()=>go('parent-search')}>{isAr?'فضاء الوالد':'Espace parent'}</Btn>}>
    <div className="card pad-16 row gap-10 wrap" style={{marginBottom:18,background:'var(--blue-50)',border:'1px solid var(--blue-100)'}}>
      <Icon name="wa" size={18} style={{color:'var(--green-700)'}}/>
      <span className="t-14 w-600" style={{color:'var(--blue-800)',flex:'1 1 320px'}}>
        {isAr?'كلّ رسالة من وليّ مرتبطة بملفّ التّلميذ. ترى آخر علامة، الحضور، ونقاط المتابعة قبل أن تردّ.':'Chaque message parent est lié au profil de l\'élève. Vous voyez la dernière note, la présence et les points de suivi avant de répondre.'}
      </span>
    </div>
    <div className="row gap-12 wrap" style={{marginBottom:18,alignItems:'center',rowGap:10}}>
      <div className="seg">
        <button className={filter==='all'?'on':''} onClick={()=>setFilter('all')}>{isAr?'الكلّ':'Tous'} ({all.length})</button>
        <button className={filter==='unread'?'on':''} onClick={()=>setFilter('unread')}>{isAr?'غير مقروءة':'Non lus'} ({unreadTotal})</button>
        <button className={filter==='inquiries'?'on':''} onClick={()=>setFilter('inquiries')}>{isAr?'طلبات':'Demandes'} ({inquiriesCount})</button>
      </div>
      <span className="muted t-14 w-600" style={{marginLeft:'auto'}}>{list.length} {isAr?'محادثة':'conversation'}{!isAr&&list.length>1?'s':''}</span>
    </div>
    {list.length===0 ? (
      <div className="card pad-24 col center" style={{gap:12,textAlign:'center',padding:'48px 24px'}}>
        <div className="icn" style={{width:54,height:54,borderRadius:16,background:'var(--bg)',color:'var(--faint)',display:'grid',placeItems:'center'}}><Icon name="wa" size={26}/></div>
        <span className="muted t-15">{isAr?'لا توجد رسالة لهذا الفلتر.':'Aucun message pour ce filtre.'}</span>
      </div>
    ) : (
      <div className="card" style={{overflow:'hidden'}}>
        {list.map((t,i)=> <ThreadRow key={t.id} t={t} last={i===list.length-1} go={go}/>)}
      </div>
    )}
  </AppShell>;
}

function ThreadRow({t, last, go}){
  useLang();
  const isAr = NavI18n.lang === 'ar';
  const parent = Nav.parentById(t.parentId)||{};
  const student = t.studentId ? Nav.studentById(t.studentId) : null;
  const prospective = !student && t.prospectiveStudent;
  const msgs = Nav.messagesOfThread(t.id);
  const lastMsg = msgs[msgs.length-1];
  const unread = (t.unreadCount||0) > 0;
  const ini = (parent.name||'').split(' ').map(p=>p[0]).join('').slice(0,2).toUpperCase();
  return <div onClick={()=>go('thread', t.id)} className="row gap-14" style={{
    padding:'14px 18px', borderBottom: last?'none':'1px solid var(--line-2)', cursor:'pointer',
    background: unread ? 'var(--blue-50)' : '#fff'}}>
    <Avatar initials={ini||'?'} cls={t.kind==='inquiry'?'av-o':'av-b'} size={40}/>
    <div className="col grow" style={{gap:3, minWidth:0}}>
      <div className="row gap-8" style={{alignItems:'center'}}>
        <span className="w-700 t-14">{isAr?(txData(parent.name)||'وليّ'):(parent.name||'Parent')}</span>
        {t.kind==='inquiry' && (Nav.inquiryStatusFor(t.id).kind==='essai'
          ? <span className="chip chip-green" style={{fontSize:10.5,padding:'2px 6px'}}><Icon name="checkc" size={11}/>{isAr?'طلب حصّة تجريبيّة':'Demande d\'essai'}</span>
          : <span className="chip chip-orange" style={{fontSize:10.5,padding:'2px 6px'}}><Icon name="search" size={11}/>{isAr?'طلب':'Demande'}</span>)}
        {student && <span className="chip chip-gray" style={{fontSize:11}}>{isAr?'بخصوص':'Au sujet de'} {student.name.split(' ')[0]}</span>}
        {prospective && <span className="chip chip-gray" style={{fontSize:11}}>{isAr?'الطّفل:':'Enfant :'} {prospective.name}</span>}
        {t.linkedReportId && <span className="chip chip-blue" style={{fontSize:11}}><Icon name="file" size={11}/>{isAr?'مرتبط بتقرير':'Réf. rapport'}</span>}
      </div>
      <span className="t-13 muted" style={{whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',maxWidth:'58vw'}}>
        {lastMsg ? (lastMsg.direction==='out'?(isAr?'أنت: ':'Vous : '):'') + (txData?txData(lastMsg.text||''):(lastMsg.text||'')) : '—'}
      </span>
    </div>
    <div className="col" style={{alignItems:'flex-end',gap:4,flex:'none'}}>
      <span className="faint t-12 w-600">{fmtAgo(t.lastMessageAt)}</span>
      {unread && <span className="badge badge-pending" style={{background:'var(--blue-700)',color:'#fff',padding:'1px 7px',borderRadius:99,fontSize:11}}>{t.unreadCount}</span>}
    </div>
  </div>;
}

/* --------------- ThreadView --------------- */
function ThreadView({go, id}){
  useStore();
  useLang();
  const isAr = NavI18n.lang === 'ar';
  const isMobile = useIsMobile();
  const tid = id || (Nav.threadsByTutor()[0]||{}).id;
  const t = Nav.threadById(tid);
  const [text, setText] = React.useState('');
  React.useEffect(()=>{ if(t && t.unreadCount>0) Nav.markThreadRead(t.id); }, [tid]);
  if(!t) return <AppShell go={go} active="messages" title={isAr?'محادثة':'Conversation'}><div className="card pad-24"><span className="muted">{isAr?'محادثة غير موجودة.':'Conversation introuvable.'}</span></div></AppShell>;

  const parent = Nav.parentById(t.parentId)||{};
  const student = t.studentId ? Nav.studentById(t.studentId) : null;
  const prospective = !student && t.prospectiveStudent;
  const msgs = Nav.messagesOfThread(t.id);
  const linkedReport = t.linkedReportId ? Nav.reportById(t.linkedReportId) : null;
  const group = student ? Nav.groupsAll().find(g=>g.id===student.groupId) : null;
  const points = student ? pointsOf(student.id) : {active:[],resolved:[]};
  const parentName = isAr ? txData(parent.name) : parent.name;
  const tutorName = isAr ? txData(NAV.tutor.short) : NAV.tutor.short;

  const onSend = (channel)=>{
    if(!text.trim()) return;
    Nav.sendMessage({threadId:t.id, direction:'out', text, channel:channel||'whatsapp', linkedReportId:t.linkedReportId});
    if(channel==='whatsapp' && parent.phone){
      const msg = text + (student?`\n— ${tutorName} (${student.name.split(' ')[0]})`:'');
      window.open(waLink(parent.phone, msg), '_blank');
    }
    setText('');
    navToast(isAr?'تمّ إرسال الرّسالة':'Message envoyé','green');
  };

  // Quick-insert templates
  const templates = [];
  if(linkedReport){
    templates.push({label: isAr?'إعادة إرسال التّقرير':'Renvoyer le rapport', text: isAr?`السّلام عليكم ${parentName}، إليكم مجدّداً تقرير ${student?.name.split(' ')[0]}: https://navanso.dz/r/${linkedReport.token}`:`Bonjour ${parent.name}, voici à nouveau le rapport de ${student?.name.split(' ')[0]} : https://navanso.dz/r/${linkedReport.token}`});
  }
  if(student && points.active.length){
    templates.push({label: isAr?'نصيحة للبيت':'Conseil pour la maison',
      text: isAr?`السّلام عليكم ${parentName}، لمساعدة ${student.name.split(' ')[0]} في البيت: مراجعة ${points.active.map(p=>txData(p.label)).slice(0,2).join(' و')}. بعض التّمارين القصيرة تكفي.`:`Bonjour ${parent.name}, pour aider ${student.name.split(' ')[0]} à la maison : revoir ${points.active.map(p=>p.label.toLowerCase()).slice(0,2).join(' et ')}. Quelques exercices courts suffisent.`});
  }
  if(t.kind==='inquiry' && prospective){
    const inqStatus = Nav.inquiryStatusFor(t.id);
    if(inqStatus.kind==='essai'){
      templates.push({label: isAr?'تأكيد الحصّة التّجريبيّة':'Confirmer la séance d\'essai', text: isAr?`السّلام عليكم ${parentName}، يمكنني استقبال ${prospective.name} في حصّة تجريبيّة. هل أنتم متفرّغون السّبت على السّاعة 16:00؟ الحصّة التّجريبيّة مجّانيّة.`:`Bonjour ${parent.name}, je peux accueillir ${prospective.name} pour une séance d'essai. Êtes-vous disponible ce samedi à 16h ? La séance d'essai est gratuite.`});
    } else {
      templates.push({label: isAr?'اقتراح حصّة تجريبيّة':'Proposer un essai', text: isAr?`السّلام عليكم ${parentName}، نعم يوجد مكان في فوج ${txData(prospective.subject)} ${txData(prospective.level)}. هل تودّون حصّة تجريبيّة مجّانيّة هذا الأسبوع؟`:`Bonjour ${parent.name}, oui il reste de la place dans le groupe ${prospective.subject} ${prospective.level}. Souhaitez-vous une séance d'essai gratuite cette semaine ?`});
    }
    templates.push({label: isAr?'طلب معلومات إضافيّة':'Demander plus d\'info', text: isAr?`السّلام عليكم ${parentName}، شكراً على رسالتكم. ما هو المستوى الحاليّ ل${prospective.name} وما هي نقاط الصّعوبة؟`:`Bonjour ${parent.name}, merci pour votre message. Quel est le niveau actuel de ${prospective.name} et ses points de difficulté ?`});
  }

  return <AppShell go={go} active="messages" title={parentName||(isAr?'محادثة':'Conversation')}
    crumbs={[{t:isAr?'الرّسائل':'Messages',go:()=>go('messages')},{t: parentName||''}]}
    actions={<>
      {parent.phone && <Btn variant="ghost" icon="wa" onClick={()=>window.open(waLink(parent.phone,''),'_blank')}>{isAr?'واتساب مباشر':'WhatsApp brut'}</Btn>}
      {student && <Btn variant="primary" icon="user" onClick={()=>go('student-profile', student.id)}>{isAr?'عرض التّلميذ':'Voir l\'élève'}</Btn>}
    </>}>
    <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 320px',gap:20,alignItems:'start'}}>
      {/* conversation */}
      <div className="card" style={{display:'flex',flexDirection:'column',minHeight:520,maxHeight:'calc(100vh - 200px)'}}>
        {/* header strip */}
        <div className="row between" style={{padding:'14px 18px',borderBottom:'1px solid var(--line-2)',gap:10}}>
          <div className="row gap-12">
            <Avatar initials={(parent.name||'?').split(' ').map(p=>p[0]).join('').slice(0,2).toUpperCase()} cls={t.kind==='inquiry'?'av-o':'av-b'} size={40}/>
            <div className="col" style={{gap:1}}>
              <span className="w-700 t-15">{parentName}</span>
              <span className="faint t-12">{parent.phone} · {parent.langPref==='ar-fr'?(isAr?'عربي / فرنسي':'Arabe / Français'):(isAr?'فرنسي':'Français')}</span>
            </div>
          </div>
          {t.kind==='inquiry'
            ? <span className="chip chip-orange w-700"><Icon name="search" size={13}/>{isAr?'طلب جديد':'Nouvelle demande'}</span>
            : (student ? <span className="chip chip-blue w-700"><Icon name="users" size={13}/>{student.name}</span> : null)}
        </div>
        {/* messages list */}
        <div className="scroll" style={{flex:1,padding:'18px',display:'flex',flexDirection:'column',gap:10,background:'var(--bg)'}}>
          {msgs.length===0 && <span className="faint t-13" style={{textAlign:'center',padding:'40px 0'}}>{isAr?'لا توجد رسائل بعد.':'Pas encore de message.'}</span>}
          {msgs.map(m=> <Bubble key={m.id} m={m}/>)}
        </div>
        {/* templates */}
        {templates.length>0 && <div className="row gap-7 wrap" style={{padding:'10px 18px',borderTop:'1px solid var(--line-2)',background:'var(--blue-50)'}}>
          <span className="t-12 faint w-700" style={{textTransform:'uppercase',letterSpacing:'.04em'}}>{isAr?'ردود سريعة:':'Réponses rapides :'}</span>
          {templates.map((tpl,i)=><button key={i} className="pick" onClick={()=>setText(tpl.text)}>{tpl.label}</button>)}
        </div>}
        {/* composer */}
        <div className="col gap-8" style={{padding:'12px 18px 14px',borderTop:'1px solid var(--line-2)'}}>
          <textarea className="textarea" style={{minHeight:64}} placeholder={isAr?'اكتب ردّك…':'Tapez votre réponse…'} value={text} onChange={e=>setText(e.target.value)}/>
          <div className="row gap-8 wrap" style={{justifyContent:'flex-end'}}>
            <Btn variant="ghost" size="sm" icon="check" onClick={()=>onSend('platform')}>{isAr?'حفظ (دون إرسال)':'Enregistrer (sans envoyer)'}</Btn>
            <Btn variant="green" size="sm" icon="wa" onClick={()=>onSend('whatsapp')}>{isAr?'إرسال عبر واتساب':'Envoyer via WhatsApp'}</Btn>
          </div>
          <span className="faint t-11" style={{textAlign:'right'}}>{isAr?'تُفتح الرّسالة جاهزة على واتساب — تبقى أنت من يُرسل.':'Le message s\'ouvre dans WhatsApp prérempli — vous restez maître de l\'envoi final.'}</span>
        </div>
      </div>
      {/* context side panel — the whole point of this screen */}
      <div className="col gap-14" style={{position:'sticky',top:90}}>
        {student ? <StudentContextCard student={student} group={group} points={points} linkedReport={linkedReport} go={go}/>
                 : <ProspectContextCard t={t} go={go}/>}
        {t.kind==='inquiry' && prospective && <ConvertProspectCard t={t} go={go}/>}
      </div>
    </div>
  </AppShell>;
}

function Bubble({m}){
  useLang();
  const me = m.direction==='out';
  // Status icons for outbound: single check = sent, double check = read by parent.
  // For WhatsApp channel, we're honest: "envoyé via WhatsApp · pas de confirmation".
  const isRead = me && m.status==='read';
  return <div style={{display:'flex',justifyContent:me?'flex-end':'flex-start'}}>
    <div className="col" style={{maxWidth:'78%',gap:3}}>
      <div className="card" style={{padding:'9px 12px',borderRadius:14,
        background: me?'var(--blue-700)':'#fff', color: me?'#fff':'var(--ink)',
        border: me?'none':'1px solid var(--line)', whiteSpace:'pre-wrap', fontSize:14, lineHeight:1.45}}>{txData?txData(m.text):m.text}</div>
      <div className="row gap-6" style={{justifyContent:me?'flex-end':'flex-start',padding:'0 4px'}}>
        <span className="faint t-11">{fmtTime(m.createdAt)}</span>
        {m.channel==='whatsapp' && <Icon name="wa" size={11} style={{color:'var(--green-600)'}}/>}
        {m.channel==='platform-inquiry' && <span className="chip chip-orange" style={{fontSize:9.5,padding:'1px 5px'}}>{isAr?'عبر البحث':'via recherche'}</span>}
        {m.linkedReportId && <Icon name="file" size={11} style={{color:'var(--blue-600)'}}/>}
        {me && <DeliveryStatus m={m} isRead={isRead}/>}
      </div>
    </div>
  </div>;
}

function DeliveryStatus({m, isRead}){
  const isAr = typeof NavI18n !== 'undefined' && NavI18n.lang === 'ar';
  const color = isRead ? 'var(--blue-600)' : 'var(--faint)';
  if(isRead){
    const subtitle = m.readVia==='report' ? (isAr?'فُتح التّقرير من طرف الوليّ':'Rapport ouvert par le parent') :
                     m.channel==='whatsapp' ? (isAr?'مرئيّ (مفترض — فُتح التّقرير)':'Vu (présumé — rapport ouvert)') : (isAr?'قُرئ من طرف الوليّ':'Lu par le parent');
    return <span title={subtitle + (m.readAt?` · ${fmtTime(m.readAt)}`:'')} className="row" style={{gap:1,alignItems:'center',color}}>
      <Icon name="check" size={11}/><Icon name="check" size={11} style={{marginLeft:-7}}/>
      <span className="t-11 w-700" style={{marginLeft:3}}>{isAr?'مقروء':'Lu'}</span>
    </span>;
  }
  const subtitle = m.channel==='whatsapp' ? (isAr?'مُرسَل عبر واتساب · لا تأكيد قراءة':'Envoyé via WhatsApp · pas de confirmation de lecture')
    : m.channel==='platform' || m.channel==='parent-app' ? (isAr?'مُرسَل · في انتظار القراءة':'Envoyé · en attente de lecture')
    : (isAr?'مُرسَل':'Envoyé');
  return <span title={subtitle} className="row" style={{gap:2,alignItems:'center',color}}>
    <Icon name="check" size={11}/>
    {m.channel==='whatsapp' && <span className="t-11" style={{color:'var(--faint)'}}>{isAr?'لا تأكيد قراءة':'Pas de lecture confirmée'}</span>}
  </span>;
}

function StudentContextCard({student, group, points, linkedReport, go}){
  useLang();
  const isAr = NavI18n.lang === 'ar';
  const recentRemarks = (NavStore.get().remarks[student.id]||[]).slice(0,3);
  const sid = student.id;
  return <div className="card pad-18 col gap-12">
    <div className="row between">
      <span className="eyebrow">{isAr?'سياق التّلميذ':'Contexte élève'}</span>
      <Btn variant="ghost" size="sm" iconR="arrow" onClick={()=>go('student-profile', sid)}>{isAr?'الملفّ':'Profil'}</Btn>
    </div>
    <div className="row gap-12">
      <Avatar initials={student.initials} cls={student.av} size={46}/>
      <div className="col" style={{gap:2,minWidth:0}}>
        <span className="w-700 t-15">{student.name}</span>
        <span className="faint t-12">{group?.name||student.subject}</span>
      </div>
    </div>
    <div className="row gap-10 wrap">
      <div className="card-flat" style={{padding:'8px 12px',borderRadius:10,background:'var(--green-50)',border:'1px solid var(--green-100)',flex:'1 1 100px'}}>
        <span className="t-11 faint w-700">{isAr?'الحضور':'PRÉSENCE'}</span>
        <div className="w-700 t-16" style={{color:'var(--green-700)'}}>{student.att}%</div>
      </div>
      <div className="card-flat" style={{padding:'8px 12px',borderRadius:10,background:'var(--blue-50)',border:'1px solid var(--blue-100)',flex:'1 1 100px'}}>
        <span className="t-11 faint w-700">{isAr?'آخر علامة':'DERNIÈRE NOTE'}</span>
        <div className="w-700 t-16" style={{color:'var(--blue-700)'}}>{student.result}</div>
      </div>
    </div>
    {points.active.length>0 && <div className="col gap-6">
      <span className="t-11 faint w-700" style={{textTransform:'uppercase',letterSpacing:'.04em'}}>{isAr?'يحتاج إلى مراجعة':'À travailler'}</span>
      <div className="row gap-6 wrap">{points.active.map(p=><span key={p.id} className="chip chip-weak" style={{fontSize:11}}>{p.label}</span>)}</div>
    </div>}
    {recentRemarks.length>0 && <div className="col gap-6">
      <span className="t-11 faint w-700" style={{textTransform:'uppercase',letterSpacing:'.04em'}}>{isAr?'آخر الملاحظات':'Dernières remarques'}</span>
      {recentRemarks.map(r=> <CollapsibleRemark key={r.id} r={r}/>)}
    </div>}
    {linkedReport && <Btn variant="soft" size="sm" icon="file" block onClick={()=>go('parent-report', linkedReport.token)}>{isAr?'عرض التّقرير المرتبط':'Voir le rapport lié'}</Btn>}
    <PrivacyNote/>
  </div>;
}

function CollapsibleRemark({r}){
  useLang();
  const isAr = NavI18n.lang === 'ar';
  const [open, setOpen] = React.useState(false);
  const txt = r.text||'';
  const max = 70;
  const isLong = txt.length > max;
  const preview = isLong && !open ? (txt.slice(0,max).trim()+'…') : txt;
  return <div className="card-flat" style={{padding:'8px 10px',borderRadius:9,background:'var(--bg)',border:'none'}}>
    <div className="row between" style={{gap:8}}>
      <span className="t-12 w-700 muted">{r.date} · {r.topic}</span>
      {isLong && <button className="t-11 w-700" style={{background:'none',border:'none',color:'var(--blue-700)',cursor:'pointer',padding:0}} onClick={()=>setOpen(o=>!o)}>{open?(isAr?'عرض أقلّ':'Voir moins'):(isAr?'عرض الكلّ':'Voir tout')}</button>}
    </div>
    <p className="t-13 lh-14" style={{color:'var(--ink-2)',marginTop:3}}>{preview||'—'}</p>
  </div>;
}

function ProspectContextCard({t, go}){
  useLang();
  const isAr = NavI18n.lang === 'ar';
  const ps = t.prospectiveStudent||{};
  const matchingGroup = Nav.groupsAll().find(g=>g.level && ps.level && g.level.includes(ps.level.split(' ')[0]) && g.subject===ps.subject);
  return <div className="card pad-18 col gap-12">
    <span className="eyebrow">{isAr?'سياق الطّلب':'Contexte demande'}</span>
    <div className="card-flat" style={{padding:'12px',borderRadius:10,background:'var(--orange-50)',border:'1px solid var(--orange-100)'}}>
      <span className="t-11 faint w-700" style={{textTransform:'uppercase',letterSpacing:'.04em'}}>{isAr?'الطّفل المعنيّ':'Enfant concerné'}</span>
      <div className="w-700 t-15" style={{color:'var(--ink)'}}>{ps.name||'—'}</div>
      <span className="t-12 muted">{ps.level} · {ps.subject}</span>
    </div>
    {matchingGroup ? <div className="col gap-8">
      <span className="t-11 faint w-700" style={{textTransform:'uppercase',letterSpacing:'.04em'}}>{isAr?'الفوج المناسب':'Groupe correspondant'}</span>
      <div className="card-flat" style={{padding:'12px',borderRadius:10,border:'1px solid var(--line)'}}>
        <div className="row between"><span className="w-700 t-14">{matchingGroup.name}</span>
          <Places places={matchingGroup.places} cap={matchingGroup.cap}/></div>
        <span className="faint t-12">{matchingGroup.schedule}</span>
      </div>
    </div> : <span className="faint t-13">{isAr?'لا يوجد فوج مطابق تماماً. يمكنك إنشاء واحد.':'Aucun groupe ne correspond exactement. Vous pouvez en créer un.'}</span>}
    <span className="faint t-12 lh-14">{isAr?'إن نجحت المحادثة، حوّل هذا الوليّ إلى تلميذ (البطاقة أدناه).':'Si la conversation aboutit, transformez ce parent en élève (carte ci-dessous).'}</span>
  </div>;
}

function ConvertProspectCard({t, go}){
  useLang();
  const isAr = NavI18n.lang === 'ar';
  const ps = t.prospectiveStudent||{};
  const parent = Nav.parentById(t.parentId)||{};
  const groups = Nav.groupsAll();
  const [gid, setGid] = React.useState(() => {
    const g = groups.find(g=>g.subject===(ps.subject||'Mathématiques') && (ps.level||'').includes((g.level||'').split(' ')[0]));
    return g ? g.id : groups[0]?.id;
  });
  const onConvert = ()=>{
    const sid = Nav.addStudent({name:ps.name||'Élève', level:ps.level, parentName:parent.name, parentPhone:parent.phone, groupId:gid, subject:ps.subject});
    const group = Nav.groupById(gid);
    const nextSess = Nav.nextPlannedSession(gid);
    const fn = (ps.name||'votre enfant').split(' ')[0];
    // Promote thread to follow-up with linked student
    NavStore.set(d=>{
      const ts = d.threads || JSON.parse(JSON.stringify(NAV.threads));
      const th = ts.find(x=>x.id===t.id); if(th){ th.studentId = sid; th.kind='follow-up'; th.prospectiveStudent=null; }
      d.threads = ts; return d;
    });
    // Mark inquiry as accepted (parent home tracking)
    Nav.setInquiryStatus(t.id, {status:'accepted', acceptedAt: new Date().toISOString(), groupId:gid, studentId:sid});
    // Auto-welcome message in the thread — the parent sees this in their app + bell
    const welcome = isAr
      ? `السّلام عليكم ${isAr?txData(parent.name):parent.name||''}، يسعدني استقبال ${fn} في فوج ${group?.name||''}.${nextSess?` الحصّة الأولى مقرّرة في ${fmtDateLoc?fmtDateLoc(nextSess.date):(fmtFr?fmtFr(nextSess.date):nextSess.date)} — ${txData(nextSess.plannedTopic||'')}.`:''} ستجدون كلّ تقارير المتابعة في فضاء الوالد.\n— ${txData(NAV.tutor.short)}`
      : `Bonjour ${parent.name||''}, je suis ravie d'accueillir ${fn} dans le groupe ${group?.name||''}.${nextSess?` La première séance est prévue le ${fmtFr?fmtFr(nextSess.date):nextSess.date} — ${nextSess.plannedTopic||''}.`:''} Vous retrouverez tous les rapports de suivi dans votre espace parent.\n— ${NAV.tutor.short}`;
    Nav.sendMessage({threadId:t.id, direction:'out', text:welcome, channel:'platform'});
    navToast(isAr?`تمّ تسجيل ${ps.name} في الفوج · رسالة ترحيب أُرسلت`:`${ps.name} ajouté(e) au groupe · message de bienvenue envoyé`,'green');
  };
  return <div className="card pad-18 col gap-10" style={{background:'var(--green-50)',border:'1px solid var(--green-100)'}}>
    <span className="row gap-8 w-700 t-14" style={{color:'var(--green-700)'}}><Icon name="plus" size={16}/>{isAr?`تسجيل ${ps.name||'التّلميذ'}`:`Inscrire ${ps.name||'l\'élève'}`}</span>
    <Field label={isAr?'الفوج المُستهدف':'Groupe de destination'}>
      <select className="select" value={gid} onChange={e=>setGid(e.target.value)}>
        {groups.map(g=><option key={g.id} value={g.id}>{g.name} — {g.places} {isAr?'مكان':'place'}{!isAr&&g.places>1?'s':''}</option>)}
      </select>
    </Field>
    <Btn variant="green" icon="check" block onClick={onConvert}>{isAr?'تأكيد التّسجيل':'Confirmer l\'inscription'}</Btn>
    <span className="faint t-11 lh-14">{isAr?'يُنشئ التّلميذ، يربطه بالوليّ الموجود، ويحوّل هذه المحادثة إلى متابعة عاديّة.':'Crée l\'élève, le lie au parent existant, et bascule cette conversation en suivi standard.'}</span>
  </div>;
}

/* --------------- InquiryForm (parent → tutor from public search) --------------- */
function InquiryForm({go, id}){
  // id = tutorId from the search card. (only one tutor in this prototype: t1)
  const tutorId = id || 't1';
  useStore(); useLang();
  const isAr = NavI18n.lang==='ar';
  const isMobile = useIsNarrow();
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [childName, setChildName] = React.useState('');
  const [level, setLevel] = React.useState('4e AM');
  const [subject, setSubject] = React.useState('Mathématiques');
  const [message, setMessage] = React.useState('');
  const [lang, setLang] = React.useState('fr');
  const [kind, setKind] = React.useState('inquiry'); // inquiry | essai
  const [sent, setSent] = React.useState(null);
  const valid = name && phone && childName && message.trim();
  const onSubmit = ()=>{
    if(!valid) return;
    const finalMessage = kind==='essai'
      ? `[Demande de séance d'essai] ${message}`
      : message;
    const threadId = Nav.createInquiry({tutorId, parentName:name, parentPhone:phone, childName, childLevel:level, subject, message:finalMessage, langPref:lang});
    Nav.setInquiryStatus(threadId, {status:'pending', kind});
    setSent(threadId);
    navToast(kind==='essai'?(isAr?'تمّ إرسال طلب الحصّة التجريبيّة':'Votre demande d\'essai a été envoyée'):(isAr?'تمّ إرسال طلبك إلى الأستاذة':'Votre demande a été envoyée à l\'enseignante'),'green');
  };
  if(sent){
    const pa = Nav.threadById(sent).parentId;
    return <div className="screen-anim" style={{minHeight:'100%'}}>
      <MarketingNav go={go} active="parent-search"/>
      <div style={{maxWidth:720,margin:'0 auto',padding:'40px 24px'}}>
        <div className="card pad-24 col gap-14" style={{background:'var(--green-50)',border:'1px solid var(--green-100)'}}>
          <div className="row gap-12"><div className="icn" style={{width:44,height:44,borderRadius:13,background:'var(--green-600)',color:'#fff',display:'grid',placeItems:'center'}}><Icon name="checkc" size={22}/></div>
            <div className="col"><h2 style={{fontSize:22}}>{isAr?'تمّ إرسال الطّلب':'Demande envoyée'}</h2>
              <span className="muted t-14">{isAr?`سيتمّ إخطار ${txData(NAV.tutor.short)} وستردّ عليك عبر WhatsApp.`:`${NAV.tutor.short} sera notifiée et vous répondra via WhatsApp.`}</span></div></div>
          <p className="t-14 lh-15" style={{color:'var(--ink-2)'}}>{isAr?'في انتظار ذلك، يمكنك الاطّلاع على نموذج تقرير لفهم طريقة المتابعة بشكل أفضل.':'En attendant, vous pouvez consulter un exemple de rapport pour mieux comprendre la méthode de suivi.'}</p>
          <div className="row gap-10 wrap">
            <Btn variant="primary" icon="file" onClick={()=>go('parent-report','r-yacine-mai-2026')}>{isAr?'مشاهدة نموذج تقرير':'Voir un exemple de rapport'}</Btn>
            <Btn variant="ghost" icon="user" onClick={()=>go('parent-home', pa)}>{isAr?'الانتقال إلى فضائي الوالد':'Aller à mon espace parent'}</Btn>
            <Btn variant="ghost" onClick={()=>go('parent-search')}>{isAr?'العودة إلى البحث':'Retour à la recherche'}</Btn>
          </div>
        </div>
      </div>
      <Footer go={go}/>
    </div>;
  }
  return <div className="screen-anim" style={{minHeight:'100%'}}>
    <MarketingNav go={go} active="parent-search"/>
    <div style={{maxWidth:720,margin:'0 auto',padding:'30px 24px'}}>
      <button className="btn btn-ghost btn-sm" onClick={()=>go('tutor-profile')}><Icon name="arrowl" size={16}/>{isAr?'العودة إلى الملف':'Retour au profil'}</button>
      <h1 style={{fontSize:28,marginTop:12,marginBottom:8}}>{isAr?`طلب مكان لدى ${txData(NAV.tutor.short)}`:`Demander une place chez ${NAV.tutor.short}`}</h1>
      <p className="muted t-15" style={{marginBottom:22}}>{isAr?'هذه المعلومات تُساعد الأستاذة على الرّدّ بسياق واضح. تبقى خاصّة.':'Ces informations aident l\'enseignante à répondre avec un contexte clair. Elles restent privées.'}</p>
      <div className="card pad-24 col gap-14">
        {/* Inquiry type — distinguish a first contact from a trial-session request */}
        <Field label={isAr?'نوع الطّلب':'Type de demande'} hint={isAr?'يمكن للأستاذ اقتراح حصّة تجريبيّة في جميع الحالات.':'L\'enseignant pourra vous proposer une séance d\'essai dans tous les cas.'}>
          <div className="row gap-8 wrap">
            {[
              ['inquiry',(isAr?'أوّل تواصل':'Première prise de contact'),'file'],
              ['essai',(isAr?'طلب حصّة تجريبيّة':'Demande de séance d\'essai'),'checkc'],
            ].map(([k,lab,ic])=> <button key={k} onClick={()=>setKind(k)}
              className={`pick ${kind===k?'on':''}`} style={kind===k?{background:k==='essai'?'var(--green-600)':'var(--blue-700)',borderColor:k==='essai'?'var(--green-600)':'var(--blue-700)',color:'#fff'}:{}}>
              <Icon name={ic} size={14}/>{lab}
            </button>)}
          </div>
        </Field>
        <div className="hr"/>
        <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:14}}>
          <Field label={isAr?'اسمك':'Votre nom'}><input className="input" placeholder={isAr?'مثال : السيدة طاهر':'Ex : Mme Tahar'} value={name} onChange={e=>setName(e.target.value)}/></Field>
          <Field label={isAr?'الهاتف / WhatsApp':'Téléphone / WhatsApp'}><input className="input" placeholder="+213 …" value={phone} onChange={e=>setPhone(e.target.value)}/></Field>
        </div>
        <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'2fr 1fr 1fr',gap:14}}>
          <Field label={isAr?'اسم الطّفل':'Prénom de l\'enfant'}><input className="input" placeholder={isAr?'مثال : ياسمين':'Ex : Yasmine'} value={childName} onChange={e=>setChildName(e.target.value)}/></Field>
          <Field label={isAr?'المستوى':'Niveau'}>
            <select className="select" value={level} onChange={e=>setLevel(e.target.value)}>
              {['3e AM','4e AM','1AS','Primaire'].map(l=><option key={l}>{l}</option>)}
            </select>
          </Field>
          <Field label={isAr?'المادة':'Matière'}>
            <select className="select" value={subject} onChange={e=>setSubject(e.target.value)}>
              {['Mathématiques','Physique','Arabe','Sciences'].map(l=><option key={l}>{l}</option>)}
            </select>
          </Field>
        </div>
        <Field label={isAr?'سؤالك أو حاجتك':'Votre question ou besoin'}>
          <textarea className="textarea" placeholder={isAr?'مثال : ابنتي تجد صعوبة في الكسور وفي ترجمة المسائل. هل لا يزال هناك مكان في فوج 4 متوسط ؟':'Ex : ma fille a des difficultés avec les fractions et la traduction des énoncés. Reste-t-il de la place dans votre groupe 4AM ?'} value={message} onChange={e=>setMessage(e.target.value)} style={{minHeight:110}}/>
        </Field>
        <Field label={isAr?'اللّغة المُفضّلة للتّقارير':'Langue préférée pour les rapports'}>
          <div className="seg" style={{alignSelf:'flex-start'}}>
            <button className={lang==='fr'?'on':''} onClick={()=>setLang('fr')}>{isAr?'فرنسي':'Français'}</button>
            <button className={lang==='ar-fr'?'on':''} onClick={()=>setLang('ar-fr')}>{isAr?'عربي / فرنسي':'Arabe / Français'}</button>
          </div>
        </Field>
        <div className="row gap-10 wrap" style={{justifyContent:'flex-end',marginTop:6}}>
          <Btn variant="ghost" onClick={()=>go('tutor-profile')}>{isAr?'إلغاء':'Annuler'}</Btn>
          <Btn variant="primary" icon="check" onClick={onSubmit} style={valid?{}:{opacity:.5,pointerEvents:'none'}}>{isAr?'إرسال الطّلب':'Envoyer la demande'}</Btn>
        </div>
        <PrivacyNote>{isAr?'بياناتك وبيانات طفلك مرئيّة فقط للأستاذة.':'Vos coordonnées et celles de votre enfant ne sont visibles que par l\'enseignante.'}</PrivacyNote>
      </div>
    </div>
    <Footer go={go}/>
  </div>;
}

/* --------------- GroupBroadcast — message all parents of a group --------------- */
function GroupBroadcast({go, id}){
  useStore();
  useLang();
  const isAr = NavI18n.lang === 'ar';
  const isMobile = useIsMobile();
  const gid = id || (Nav.groupsAll()[0]||{}).id;
  const group = Nav.groupById(gid);
  if(!group) return <AppShell go={go} active="messages" title={isAr?'رسالة إلى الفوج':'Message au groupe'}><div className="card pad-24"><span className="muted">{isAr?'فوج غير موجود.':'Groupe introuvable.'}</span></div></AppShell>;
  const students = Nav.studentsByGroup(gid);
  const nextSess = Nav.nextPlannedSession(gid);
  const lastSess = Nav.lastCompletedSession(gid);

  const TEMPLATES = isAr ? {
    annulee: { label:'إلغاء حصّة',
      build: ()=>`السّلام عليكم، حصّة ${nextSess?(fmtDateLoc?fmtDateLoc(nextSess.date):(fmtFr?fmtFr(nextSess.date):nextSess.date)):''} لفوج ${group.name} مُلغاة. سأخبركم بتاريخ التّعويض. شكراً على تفهّمكم.\n— ${txData(NAV.tutor.short)}` },
    reportee: { label:'تأجيل حصّة',
      build: ()=>`السّلام عليكم، حصّة ${nextSess?(fmtDateLoc?fmtDateLoc(nextSess.date):(fmtFr?fmtFr(nextSess.date):nextSess.date)):''} لفوج ${group.name} مُؤجَّلة. سأبلّغكم بالتّاريخ الجديد قريباً.\n— ${txData(NAV.tutor.short)}` },
    rappel: { label:'تذكير بالحصّة',
      build: ()=>`السّلام عليكم، تذكير بسيط: حصّة ${group.name} ${nextSess?(fmtDateLoc?fmtDateLoc(nextSess.date):(fmtFr?fmtFr(nextSess.date):nextSess.date)):''}${nextSess?.plannedTopic?' — '+txData(nextSess.plannedTopic):''}. في ${txData(group.loc||'')}.\n— ${txData(NAV.tutor.short)}` },
    devoirs: { label:'تذكير بالواجبات',
      build: ()=>`السّلام عليكم، تذكير بواجبات ${group.name}${lastSess?.homework?': '+txData(lastSess.homework):''}. شكراً على مراجعة طفلكم.\n— ${txData(NAV.tutor.short)}` },
    libre: { label:'رسالة حرّة', build: ()=>'' },
  } : {
    annulee: {
      label:'Séance annulée',
      build: ()=>`Bonjour, la séance ${nextSess?'du '+(fmtFr?fmtFr(nextSess.date):nextSess.date):''} de ${group.name} est annulée. Je vous communiquerai la date de rattrapage. Merci de votre compréhension.\n— ${NAV.tutor.short}`,
    },
    reportee: {
      label:'Séance reportée',
      build: ()=>`Bonjour, la séance ${nextSess?'du '+(fmtFr?fmtFr(nextSess.date):nextSess.date):''} de ${group.name} est reportée. Je vous précise la nouvelle date dès que possible.\n— ${NAV.tutor.short}`,
    },
    rappel: {
      label:'Rappel de séance',
      build: ()=>`Bonjour, petit rappel : séance de ${group.name} ${nextSess?(fmtFr?fmtFr(nextSess.date):nextSess.date):''}${nextSess?.plannedTopic?' — '+nextSess.plannedTopic:''}. À ${group.loc||''}.\n— ${NAV.tutor.short}`,
    },
    devoirs: {
      label:'Rappel devoirs',
      build: ()=>`Bonjour, petit rappel pour les devoirs de ${group.name}${lastSess?.homework?': '+lastSess.homework:''}. Merci de vérifier avec votre enfant.\n— ${NAV.tutor.short}`,
    },
    libre: {
      label:'Message libre',
      build: ()=>'',
    },
  };
  const [tpl, setTpl] = React.useState('rappel');
  const [text, setText] = React.useState(()=>TEMPLATES.rappel.build());
  const [selected, setSelected] = React.useState(()=>new Set(students.map(s=>s.id)));
  const [sentTo, setSentTo] = React.useState(new Set());

  const pickTemplate = (k)=>{ setTpl(k); setText(TEMPLATES[k].build()); };
  const toggle = (sid)=> setSelected(s=>{const n=new Set(s); n.has(sid)?n.delete(sid):n.add(sid); return n;});
  const selectAll = ()=> setSelected(new Set(students.map(s=>s.id)));
  const selectNone = ()=> setSelected(new Set());

  const personalize = (s, parent)=>{
    let out = text;
    out = out.replace(/Bonjour,/i, `Bonjour ${parent.name||''},`);
    out = out.replace(/السّلام عليكم،/g, `السّلام عليكم ${txData(parent.name)||''}،`);
    out = out.replace(/votre enfant/g, s.name.split(' ')[0]);
    out = out.replace(/طفلكم/g, s.name.split(' ')[0]);
    return out;
  };

  const sendOne = (sid, channel)=>{
    const s = Nav.studentById(sid); if(!s) return;
    const parent = Nav.parentById(s.parentId); if(!parent) return;
    const msg = personalize(s, parent);
    // find or create the thread for parent↔tutor about this student
    let thread = Nav.threadsAll().find(t=>t.parentId===parent.id && t.studentId===s.id);
    if(!thread){
      const tid = 'th'+Date.now()+Math.random().toString(36).slice(2,5);
      NavStore.set(d=>{const ts = d.threads || JSON.parse(JSON.stringify(NAV.threads));
        ts.push({id:tid, parentId:parent.id, studentId:s.id, tutorId:'t1',
          lastMessageAt:new Date().toISOString(), unreadCount:0, linkedReportId:null, kind:'follow-up'});
        d.threads = ts; return d;});
      thread = Nav.threadById(tid);
    }
    Nav.sendMessage({threadId:thread.id, direction:'out', text:msg, channel: channel==='wa'?'whatsapp':'platform'});
    if(channel==='wa'){
      const phone = (parent.phone||'').replace(/[^0-9]/g,'');
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
    }
    setSentTo(s=>new Set([...s, sid]));
  };
  const sendAll = (channel)=>{
    const list = [...selected].filter(sid=>!sentTo.has(sid));
    list.forEach(sid=>sendOne(sid, channel));
    navToast(isAr?`إرسال إلى ${list.length} وليّ`:`Envoi à ${list.length} parent${list.length>1?'s':''}`,'green');
  };

  return <AppShell go={go} active="messages" title={isAr?`رسالة إلى الفوج · ${group.name}`:`Message au groupe · ${group.name}`}
    crumbs={[{t:isAr?'الأفواج':'Groupes',go:()=>go('groups')},{t:group.name,go:()=>go('group-detail', gid)},{t:isAr?'رسالة إلى الفوج':'Message au groupe'}]}
    actions={<Btn variant="ghost" onClick={()=>go('group-detail', gid)}>{isAr?'العودة إلى الفوج':'Retour au groupe'}</Btn>}>
    <div className="card pad-16 row gap-10 wrap" style={{marginBottom:18,background:'var(--blue-50)',border:'1px solid var(--blue-100)'}}>
      <Icon name="wa" size={18} style={{color:'var(--green-700)'}}/>
      <span className="t-14 w-600" style={{color:'var(--blue-800)',flex:'1 1 320px'}}>
        {isAr?'أرسِل نفس الرّسالة إلى عدّة أولياء في الفوج. كلّ إرسال على واتساب يُفتح جاهزاً مع إدراج اسم الطّفل تلقائيّاً.':'Envoyez le même message à plusieurs parents du groupe. Chaque envoi WhatsApp s\'ouvre prérempli avec le prénom de l\'enfant inséré automatiquement.'}
      </span>
    </div>
    <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 380px',gap:20,alignItems:'start'}}>
      {/* composer */}
      <div className="col gap-18">
        <div className="card pad-20 col gap-12">
          <h3 className="row gap-8" style={{fontSize:16}}><Icon name="edit" size={17} style={{color:'var(--blue-700)'}}/>{isAr?'اختر نموذجاً':'Choisir un modèle'}</h3>
          <div className="row gap-7 wrap">
            {Object.entries(TEMPLATES).map(([k,t])=>
              <button key={k} className={`pick ${tpl===k?'on':''}`} onClick={()=>pickTemplate(k)}>{t.label}</button>
            )}
          </div>
          <Field label={isAr?'الرّسالة':'Message'}>
            <textarea className="textarea" style={{minHeight:140,fontSize:14,lineHeight:1.5}} value={text} onChange={e=>setText(e.target.value)} placeholder={isAr?'اكتب رسالتك…':'Écrivez votre message…'}/>
          </Field>
          <span className="faint t-12">{isAr?'تُدرَج أسماء الأطفال تلقائيّاً عند الإرسال. تُصبح "السّلام عليكم،" "السّلام عليكم سيّدة فلان،" لكلّ وليّ.':'Les prénoms des enfants seront insérés automatiquement à l\'envoi. « Bonjour, » devient « Bonjour Mme Untel, » pour chaque parent.'}</span>
        </div>
        {/* recipients */}
        <div className="card" style={{overflow:'hidden'}}>
          <div className="row between" style={{padding:'14px 18px',borderBottom:'1px solid var(--line-2)'}}>
            <h3 className="row gap-8" style={{fontSize:16}}><Icon name="users" size={17} style={{color:'var(--blue-700)'}}/>{isAr?`المُستقبلون · ${selected.size}/${students.length} مُختار`:`Destinataires · ${selected.size}/${students.length} sélectionné${selected.size>1?'s':''}`}</h3>
            <div className="row gap-7"><Btn variant="ghost" size="sm" onClick={selectAll}>{isAr?'الكلّ':'Tout'}</Btn><Btn variant="ghost" size="sm" onClick={selectNone}>{isAr?'لا شيء':'Rien'}</Btn></div>
          </div>
          <div className="col">
            {students.map((s,i)=>{
              const parent = Nav.parentById(s.parentId)||{};
              const isSel = selected.has(s.id);
              const isSent = sentTo.has(s.id);
              return <div key={s.id} className="row between wrap" style={{padding:'12px 18px',gap:10,borderTop:i>0?'1px solid var(--line-2)':'none',background:isSent?'var(--green-50)':isSel?'#fff':'var(--bg)'}}>
                <label className="row gap-10" style={{cursor:'pointer',flex:'1 1 auto',minWidth:240}}>
                  <input type="checkbox" checked={isSel} onChange={()=>toggle(s.id)} style={{accentColor:'var(--blue-600)',width:18,height:18}}/>
                  <Avatar initials={s.initials} cls={s.av} size={32}/>
                  <div className="col" style={{gap:0}}><span className="w-600 t-13">{s.name}</span><span className="faint t-12">{isAr?txData(parent.name):parent.name||'—'} · {parent.phone||'—'}</span></div>
                </label>
                <div className="row gap-7">
                  {isSent ? <span className="chip chip-green w-700"><Icon name="checkc" size={12}/>{isAr?'تمّ الإرسال':'Envoyé'}</span>
                    : <Btn variant="green" size="sm" icon="wa" onClick={()=>sendOne(s.id,'wa')}>{isAr?'واتساب':'WhatsApp'}</Btn>}
                </div>
              </div>;
            })}
          </div>
        </div>
      </div>
      {/* side */}
      <div className="col gap-14" style={{position:'sticky',top:90}}>
        <div className="card pad-18 col gap-10">
          <span className="eyebrow">{isAr?'معاينة':'Aperçu'}</span>
          <div className="card-flat" style={{padding:'10px 12px',borderRadius:10,background:'var(--bg)',border:'none',whiteSpace:'pre-wrap',fontSize:13.5,lineHeight:1.5}}>
            {students[0] ? personalize(students[0], Nav.parentById(students[0].parentId)||{}) : (text||'—')}
          </div>
          <span className="faint t-12">{isAr?`هذا ما سيستلمه ${students[0]?.parent||'الوليّ الأوّل'}.`:`Voilà ce que recevra ${students[0]?.parent||'le premier parent'}.`}</span>
        </div>
        <div className="card pad-18 col gap-10">
          <h3 style={{fontSize:15}}>{isAr?'الإرسال':'Envoyer'}</h3>
          <Btn variant="green" icon="wa" block onClick={()=>sendAll('wa')} style={selected.size===0?{opacity:.5,pointerEvents:'none'}:{}}>{isAr?'إرسال الكلّ عبر واتساب':'Tout envoyer via WhatsApp'} ({selected.size})</Btn>
          <Btn variant="ghost" icon="check" block onClick={()=>sendAll('platform')} style={selected.size===0?{opacity:.5,pointerEvents:'none'}:{}}>{isAr?'حفظ في المحادثات (دون إرسال)':'Enregistrer dans les conversations (sans envoyer)'}</Btn>
          <span className="faint t-11 lh-14">{isAr?'خيار "واتساب" يفتح نافذة واتساب جاهزة لكلّ وليّ. تبقى أنت من يُرسل.':'L\'option "WhatsApp" ouvre une fenêtre WhatsApp prérempli par parent. Vous restez maître de l\'envoi final.'}</span>
        </div>
        {sentTo.size>0 && <div className="card pad-16 col gap-6" style={{background:'var(--green-50)',border:'1px solid var(--green-100)'}}>
          <span className="row gap-8 w-700 t-13" style={{color:'var(--green-700)'}}><Icon name="checkc" size={14}/>{isAr?`${sentTo.size} عمليّة إرسال تمّت`:`${sentTo.size} envoi${sentTo.size>1?'s':''} effectué${sentTo.size>1?'s':''}`}</span>
          <span className="faint t-12">{isAr?'ستجدها في المحادثات المعنيّة.':'Vous retrouverez ces messages dans les conversations correspondantes.'}</span>
        </div>}
      </div>
    </div>
  </AppShell>;
}

Object.assign(window, {MessagesInbox, ThreadView, InquiryForm, GroupBroadcast});
