/* NAVANSO — Minimal parent surface.
   - ParentHome: shows all reports for that parent's children + one thread
     per tutor. Accessed via a token link (param = parentId for the demo).
   - ParentThread: mobile-shaped thread view a parent can reply in.
*/

function ParentHome({go, id}){
  useStore(); useLang();
  const isAr = NavI18n.lang==='ar';
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [expandedKid, setExpandedKid] = React.useState(null); // kid id -> show all reports
  const pid = id || 'pa1';
  const parent = Nav.parentById(pid);
  if(!parent) return <div style={{padding:40}} className="muted">{isAr?'فضاء الوالد غير موجود.':'Espace parent introuvable.'}</div>;
  const kids = Nav.studentsByParent(pid);
  const reports = Nav.reportsByParent(pid);
  const threads = Nav.threadsByParent(pid);
  return <div className="screen-anim" style={{minHeight:'100%',background:'var(--bg)'}}>
    {/* Sticky parent header — logo + name + kebab menu */}
    <div style={{position:'sticky',top:0,zIndex:30,background:'#fff',borderBottom:'1px solid var(--line)'}}>
      <div style={{maxWidth:560,margin:'0 auto',padding:'12px 16px',display:'flex',alignItems:'center',gap:12}}>
        <LogoMark size={32}/>
        <div className="col grow" style={{gap:0,minWidth:0}}>
          <span className="w-700 t-14">{isAr?'فضاء الوالد':'Espace parent'}</span>
          <span className="faint t-12" style={{whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{isAr?txData(parent.name):parent.name}</span>
        </div>
        <div style={{position:'relative'}}>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={()=>setMenuOpen(o=>!o)} title="Menu"><Icon name="settings" size={17}/></button>
          {menuOpen && <>
            <div onClick={()=>setMenuOpen(false)} style={{position:'fixed',inset:0,zIndex:40}}/>
            <div className="card" style={{position:'absolute',right:0,top:'calc(100% + 6px)',zIndex:50,padding:6,boxShadow:'var(--sh-3)',minWidth:240,display:'flex',flexDirection:'column',gap:2}}>
              {[
                ['search',(isAr?'البحث عن أستاذ آخر':'Trouver un autre enseignant'), ()=>go('parent-search')],
                ['plus',(isAr?'إضافة طفل':'Ajouter un enfant'), ()=>{ Nav.shortlistClear(); go('parent-search'); navToast(isAr?'اختر أستاذاً لطفلك الآخر':'Choisissez un enseignant pour votre autre enfant','blue'); }],
                ['heart',(isAr?`قائمتي المختصرة (${Nav.shortlistAll().length})`:'Mes présélections ('+Nav.shortlistAll().length+')'), ()=>go('shortlist')],
                ['user',(isAr?'بياناتي':'Mes informations'), ()=>navToast(isAr?'تعديل الملف — قريباً':'Édition du profil — bientôt','blue')],
              ].map(([ic,lab,fn],i)=>
                <button key={i} onClick={()=>{setMenuOpen(false);fn();}} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 12px',border:'none',background:'transparent',cursor:'pointer',borderRadius:8,textAlign:'left',fontSize:13.5,fontWeight:600,color:'var(--ink)'}}>
                  <Icon name={ic} size={15} style={{color:'var(--muted)'}}/>{lab}
                </button>)}
            </div>
          </>}
        </div>
      </div>
    </div>
    <div style={{maxWidth:560,margin:'0 auto',padding:'18px 16px 80px'}}>
      <PrivacyNote>{isAr?'وصول خاص · لا يُشارَك إلّا معك.':'Accès privé · partagé uniquement avec vous.'}</PrivacyNote>
      {/* MES DEMANDES — pending inquiries (only shown when there are some) */}
      {(()=>{const inqs = Nav.inquiriesByParent(pid).filter(x=>x.status.status!=='accepted'); if(inqs.length===0) return null;
        return <div className="col gap-10" style={{marginTop:18}}>
          <h2 style={{fontSize:22,margin:'0 0 2px'}}>{isAr?'طلباتي':'Mes demandes'}</h2>
          <span className="muted t-13" style={{marginTop:-4,marginBottom:6}}>{isAr?'الطّلبات التي أرسلتها وحالتها.':'Vos demandes envoyées et leur statut.'}</span>
          {inqs.map(({thread,status})=>{
            const tutorName = isAr ? txData(NAV.tutor.short) : NAV.tutor.short;
            const ps = thread.prospectiveStudent||{};
            return <div key={thread.id} className="card pad-14 row between wrap" style={{gap:10,rowGap:10}}>
              <div className="col" style={{gap:2,minWidth:0}}>
                <span className="w-700 t-14">{isAr?`طلب إلى ${tutorName}`:`Demande à ${tutorName}`}</span>
                <span className="faint t-12">{isAr?`من أجل ${ps.name||'طفلك'} · ${ps.subject||''} ${ps.level?`(${ps.level})`:''}`:`Pour ${ps.name||'votre enfant'} · ${ps.subject||''} ${ps.level?`(${ps.level})`:''}`}</span>
              </div>
              <div className="row gap-8">
                {status.status==='pending' && <span className="chip chip-orange w-700"><Icon name="clock" size={12}/>{isAr?'في الانتظار':'En attente'}</span>}
                {status.status==='declined' && <span className="chip chip-gray w-700">{isAr?'مرفوض':'Refusée'}</span>}
                <Btn variant="ghost" size="sm" iconR="arrow" onClick={()=>go('parent-thread', thread.id)}>{isAr?'عرض المحادثة':'Voir conversation'}</Btn>
              </div>
            </div>;
          })}
        </div>;
      })()}
      <h2 style={{fontSize:22,margin:'24px 0 6px'}}>{isAr?'أطفالك':'Vos enfants'}</h2>
      <div className="col gap-14">
        {kids.length===0 && <span className="muted t-14">{isAr?'لا يوجد طفل مرتبط بحسابك حالياً.':'Aucun enfant lié à votre compte pour l\'instant.'}</span>}
        {kids.map(k=>{
          const childReports = reports.filter(r=>r.studentId===k.id).sort((a,b)=>(b.date||'').localeCompare(a.date||''));
          const group = Nav.groupById(k.groupId);
          const nextSess = Nav.nextPlannedSession(k.groupId);
          const expanded = expandedKid===k.id;
          const visibleReports = expanded ? childReports : childReports.slice(0,3);
          return <div key={k.id} className="card pad-16 col gap-12">
            {/* identity row */}
            <div className="row between wrap" style={{gap:10,rowGap:8}}>
              <div className="row gap-10"><Avatar initials={k.initials} cls={k.av} size={42}/>
                <div className="col" style={{gap:1}}><span className="w-700 t-15">{k.name}</span><span className="faint t-12">{txData?txData(k.subject):k.subject} · {txData?txData(k.level):k.level}{group?` · ${group.name.split('—')[0].trim()}`:''}</span></div>
              </div>
              <span className="chip chip-green w-700">{k.att}% {isAr?'حضور':'présence'}</span>
            </div>
            {/* next session card */}
            {nextSess && <div className="card-flat" style={{padding:'10px 12px',borderRadius:10,background:'var(--green-50)',border:'1px solid var(--green-100)'}}>
              <span className="t-11 w-700" style={{color:'var(--green-700)',textTransform:'uppercase',letterSpacing:'.04em'}}>{isAr?'الحصّة القادمة':'Prochaine séance'}</span>
              <div className="row between" style={{marginTop:4,gap:8}}>
                <div className="col" style={{gap:1,minWidth:0}}>
                  <span className="w-700 t-13">{nextSess.plannedTopic?(txData?txData(nextSess.plannedTopic):nextSess.plannedTopic):(isAr?'يُحدَّد لاحقاً':'À définir')}</span>
                  <span className="faint t-12">{fmtDateLoc?fmtDateLoc(nextSess.date):fmtFr(nextSess.date)}</span>
                </div>
              </div>
            </div>}
            {/* Payment status — current month */}
            {(()=>{const ps=Nav.paymentStatusFor(k.id); if(ps.status==='missing') return null;
              const month = Nav.currentMonth();
              const monthLabel = (window.fmtMonthFr?window.fmtMonthFr(month):month);
              const cfg = ps.status==='paid'?['var(--green-50)','var(--green-100)','var(--green-700)',(isAr?'✓ مدفوع':'✓ Payé')]
                       :ps.status==='overdue'?['var(--orange-50)','var(--orange-100)','var(--alert)',(isAr?'⚠ متأخّر':'⚠ En retard')]
                       :['#FFF7E6','#FBE3B5','#9A7400',(isAr?'في الانتظار':'En attente')];
              return <div className="row between wrap" style={{padding:'8px 12px',borderRadius:10,background:cfg[0],border:'1px solid '+cfg[1],gap:8}}>
                <span className="t-11 w-700" style={{color:cfg[2],textTransform:'uppercase',letterSpacing:'.04em'}}>{isAr?'دفع':'Paiement'} {monthLabel}</span>
                <span className="w-700 t-13" style={{color:cfg[2]}}>{cfg[3]}{ps.paidAt?` · ${fmtDateLoc?fmtDateLoc(ps.paidAt):fmtFr(ps.paidAt)}`:''}</span>
              </div>;
            })()}
            {/* reports list */}
            {childReports.length===0 ? <span className="faint t-13">{isAr?'لا يوجد تقرير حاليّاً.':'Aucun rapport pour l\'instant.'}</span> :
              <div className="col gap-7">
                <div className="row between" style={{alignItems:'baseline'}}>
                  <span className="t-12 w-700 muted" style={{textTransform:'uppercase',letterSpacing:'.04em'}}>{isAr?'التّقارير':'Rapports'}{expanded?` (${childReports.length})`:''}</span>
                  {childReports.length>3 && <button onClick={()=>setExpandedKid(expanded?null:k.id)} className="t-12 w-700" style={{background:'none',border:'none',color:'var(--blue-700)',cursor:'pointer',padding:0}}>{expanded?(isAr?'عرض أقلّ':'Voir moins'):(isAr?`عرض كلّ ${childReports.length} تقرير`:`Voir tous les ${childReports.length} rapports`)}</button>}
                </div>
                {visibleReports.map(r=><button key={r.id} onClick={()=>go('parent-report', r.token)} className="card-flat" style={{padding:'10px 12px',borderRadius:10,background:'var(--blue-50)',border:'1px solid var(--blue-100)',textAlign:'left',cursor:'pointer'}}>
                  <div className="row between"><span className="w-700 t-13" style={{color:'var(--blue-800)'}}>{isAr?`تقرير ${fmtDateLoc?fmtDateLoc(r.date):fmtFr(r.date)}`:`Rapport du ${fmtFr(r.date)}`}</span><Icon name="arrow" size={14} style={{color:'var(--blue-700)'}}/></div>
                  <span className="t-12 muted">{r.summary?.topic?(txData?txData(r.summary.topic):r.summary.topic):'—'}</span>
                </button>)}
              </div>}
          </div>;
        })}
      </div>
      <h2 style={{fontSize:22,margin:'24px 0 6px'}}>{isAr?'الرّسائل':'Messages'}</h2>
      <div className="col gap-10">
        {threads.length===0 && <span className="muted t-14">{isAr?'لا توجد رسائل.':'Aucun message.'}</span>}
        {threads.map(th=>{
          const child = th.studentId ? Nav.studentById(th.studentId) : (th.prospectiveStudent||{name:'—'});
          const msgs = Nav.messagesOfThread(th.id);
          const last = msgs[msgs.length-1];
          return <button key={th.id} onClick={()=>go('parent-thread', th.id)} className="card pad-14 col gap-6" style={{textAlign:'left',cursor:'pointer'}}>
            <div className="row between"><span className="w-700 t-14">{isAr?txData(NAV.tutor.short):NAV.tutor.short} · {child.name||'—'}</span><span className="faint t-12">{fmtAgo(th.lastMessageAt)}</span></div>
            <span className="t-13 muted" style={{whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{last?(last.direction==='out'?(isAr?'الأستاذة : ':'Enseignante : '):(isAr?'أنت : ':'Vous : '))+(txData?txData(last.text||''):(last.text||'')):'—'}</span>
          </button>;
        })}
      </div>
      <div className="card pad-16 col gap-8" style={{marginTop:18}}>
        <span className="t-12 faint w-700" style={{textTransform:'uppercase',letterSpacing:'.04em'}}>{isAr?'تفضيل اللّغة':'Préférence de langue'}</span>
        <div className="seg"><button className={parent.langPref==='fr'?'on':''}>{isAr?'فرنسي':'Français'}</button><button className={parent.langPref==='ar-fr'?'on':''}>{isAr?'عربي / فرنسي':'Arabe / Français'}</button></div>
        <span className="faint t-11">{isAr?'يُحدّد اللّغة الافتراضيّة للتّقارير والرّسائل.':'Détermine la langue par défaut des rapports et messages.'}</span>
      </div>
    </div>
  </div>;
}

function ParentThread({go, id}){
  useStore(); useLang();
  const isAr = NavI18n.lang==='ar';
  const t = Nav.threadById(id);
  // Parent opening this thread marks the tutor's outbound messages as read.
  React.useEffect(()=>{ if(t) Nav.markOutboundReadByParent(t.id); }, [t?.id]);
  if(!t) return <div style={{padding:40}} className="muted">{isAr?'المحادثة غير موجودة.':'Conversation introuvable.'}</div>;
  const parent = Nav.parentById(t.parentId);
  const child = t.studentId ? Nav.studentById(t.studentId) : (t.prospectiveStudent||{});
  const msgs = Nav.messagesOfThread(t.id);
  const [text, setText] = React.useState('');
  const onSend = ()=>{
    if(!text.trim()) return;
    Nav.sendMessage({threadId:t.id, direction:'in', text, channel:'parent-app'});
    setText('');
    navToast(isAr?'تمّ إرسال الرّسالة إلى الأستاذة':'Message envoyé à l\'enseignante','green');
  };
  return <div className="screen-anim col" style={{minHeight:'100vh',background:'var(--bg)'}}>
    <div className="row gap-10" style={{padding:'14px 16px',borderBottom:'1px solid var(--line)',background:'#fff'}}>
      <button className="btn btn-ghost btn-sm btn-icon" onClick={()=>go('parent-home', parent.id)}><Icon name="arrowl" size={16}/></button>
      <Avatar initials="AB" cls="av-b" size={36}/>
      <div className="col"><span className="w-700 t-14">{isAr?txData(NAV.tutor.short):NAV.tutor.short}</span><span className="faint t-12">{isAr?'بخصوص':'Au sujet de'} {child.name||(isAr?'طفلك':'votre enfant')}</span></div>
    </div>
    <div className="grow scroll col gap-10" style={{padding:'14px 16px'}}>
      {msgs.map(m=>{
        const me = m.direction==='in'; // parent side: 'in' = parent
        return <div key={m.id} style={{display:'flex',justifyContent:me?'flex-end':'flex-start'}}>
          <div className="col" style={{maxWidth:'82%',gap:2}}>
            <div className="card" style={{padding:'9px 12px',borderRadius:14, background:me?'var(--blue-700)':'#fff',color:me?'#fff':'var(--ink)',border:me?'none':'1px solid var(--line)',whiteSpace:'pre-wrap'}}>{txData?txData(m.text):m.text}</div>
            <span className="faint t-11" style={{alignSelf:me?'flex-end':'flex-start'}}>{fmtTime(m.createdAt)}</span>
          </div>
        </div>;
      })}
    </div>
    <div className="col gap-8" style={{padding:'12px 16px',borderTop:'1px solid var(--line)',background:'#fff'}}>
      <textarea className="textarea" style={{minHeight:60}} placeholder={isAr?'اكتب إلى الأستاذة…':"Écrire à l'enseignante…"} value={text} onChange={e=>setText(e.target.value)}/>
      <Btn variant="green" icon="check" block onClick={onSend}>{isAr?'إرسال':'Envoyer'}</Btn>
    </div>
  </div>;
}

window.ParentHome = ParentHome;
window.ParentThread = ParentThread;
