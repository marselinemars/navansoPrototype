/* NAVANSO — Minimal parent surface.
   - ParentHome: shows all reports for that parent's children + one thread
     per tutor. Accessed via a token link (param = parentId for the demo).
   - ParentThread: mobile-shaped thread view a parent can reply in.
*/

function ParentHome({go, id}){
  useStore();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [expandedKid, setExpandedKid] = React.useState(null); // kid id -> show all reports
  const pid = id || 'pa1';
  const parent = Nav.parentById(pid);
  if(!parent) return <div style={{padding:40}} className="muted">Espace parent introuvable.</div>;
  const kids = Nav.studentsByParent(pid);
  const reports = Nav.reportsByParent(pid);
  const threads = Nav.threadsByParent(pid);
  return <div className="screen-anim" style={{minHeight:'100%',background:'var(--bg)'}}>
    {/* Sticky parent header — logo + name + kebab menu */}
    <div style={{position:'sticky',top:0,zIndex:30,background:'#fff',borderBottom:'1px solid var(--line)'}}>
      <div style={{maxWidth:560,margin:'0 auto',padding:'12px 16px',display:'flex',alignItems:'center',gap:12}}>
        <LogoMark size={32}/>
        <div className="col grow" style={{gap:0,minWidth:0}}>
          <span className="w-700 t-14">Espace parent</span>
          <span className="faint t-12" style={{whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{parent.name}</span>
        </div>
        <div style={{position:'relative'}}>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={()=>setMenuOpen(o=>!o)} title="Menu"><Icon name="settings" size={17}/></button>
          {menuOpen && <>
            <div onClick={()=>setMenuOpen(false)} style={{position:'fixed',inset:0,zIndex:40}}/>
            <div className="card" style={{position:'absolute',right:0,top:'calc(100% + 6px)',zIndex:50,padding:6,boxShadow:'var(--sh-3)',minWidth:240,display:'flex',flexDirection:'column',gap:2}}>
              {[
                ['search','Trouver un autre enseignant', ()=>go('parent-search')],
                ['plus','Ajouter un enfant', ()=>{ Nav.shortlistClear(); go('parent-search'); navToast('Choisissez un enseignant pour votre autre enfant','blue'); }],
                ['heart','Mes présélections ('+Nav.shortlistAll().length+')', ()=>go('shortlist')],
                ['user','Mes informations', ()=>navToast('Édition du profil — bientôt','blue')],
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
      <PrivacyNote>Accès privé · partagé uniquement avec vous.</PrivacyNote>
      {/* MES DEMANDES — pending inquiries (only shown when there are some) */}
      {(()=>{const inqs = Nav.inquiriesByParent(pid).filter(x=>x.status.status!=='accepted'); if(inqs.length===0) return null;
        return <div className="col gap-10" style={{marginTop:18}}>
          <h2 style={{fontSize:22,margin:'0 0 2px'}}>Mes demandes</h2>
          <span className="muted t-13" style={{marginTop:-4,marginBottom:6}}>Vos demandes envoyées et leur statut.</span>
          {inqs.map(({thread,status})=>{
            const tutorName = NAV.tutor.short;
            const ps = thread.prospectiveStudent||{};
            return <div key={thread.id} className="card pad-14 row between wrap" style={{gap:10,rowGap:10}}>
              <div className="col" style={{gap:2,minWidth:0}}>
                <span className="w-700 t-14">Demande à {tutorName}</span>
                <span className="faint t-12">Pour {ps.name||'votre enfant'} · {ps.subject||''} {ps.level?`(${ps.level})`:''}</span>
              </div>
              <div className="row gap-8">
                {status.status==='pending' && <span className="chip chip-orange w-700"><Icon name="clock" size={12}/>En attente</span>}
                {status.status==='declined' && <span className="chip chip-gray w-700">Refusée</span>}
                <Btn variant="ghost" size="sm" iconR="arrow" onClick={()=>go('parent-thread', thread.id)}>Voir conversation</Btn>
              </div>
            </div>;
          })}
        </div>;
      })()}
      <h2 style={{fontSize:22,margin:'24px 0 6px'}}>Vos enfants</h2>
      <div className="col gap-14">
        {kids.length===0 && <span className="muted t-14">Aucun enfant lié à votre compte pour l'instant.</span>}
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
                <div className="col" style={{gap:1}}><span className="w-700 t-15">{k.name}</span><span className="faint t-12">{k.subject} · {k.level}{group?` · ${group.name.split('—')[0].trim()}`:''}</span></div>
              </div>
              <span className="chip chip-green w-700">{k.att}% présence</span>
            </div>
            {/* next session card */}
            {nextSess && <div className="card-flat" style={{padding:'10px 12px',borderRadius:10,background:'var(--green-50)',border:'1px solid var(--green-100)'}}>
              <span className="t-11 w-700" style={{color:'var(--green-700)',textTransform:'uppercase',letterSpacing:'.04em'}}>Prochaine séance</span>
              <div className="row between" style={{marginTop:4,gap:8}}>
                <div className="col" style={{gap:1,minWidth:0}}>
                  <span className="w-700 t-13">{nextSess.plannedTopic||'À définir'}</span>
                  <span className="faint t-12">{fmtFr(nextSess.date)}</span>
                </div>
              </div>
            </div>}
            {/* Payment status — current month */}
            {(()=>{const ps=Nav.paymentStatusFor(k.id); if(ps.status==='missing') return null;
              const month = Nav.currentMonth();
              const monthLabel = (window.fmtMonthFr?window.fmtMonthFr(month):month);
              const cfg = ps.status==='paid'?['var(--green-50)','var(--green-100)','var(--green-700)','✓ Payé']
                       :ps.status==='overdue'?['var(--orange-50)','var(--orange-100)','var(--alert)','⚠ En retard']
                       :['#FFF7E6','#FBE3B5','#9A7400','En attente'];
              return <div className="row between wrap" style={{padding:'8px 12px',borderRadius:10,background:cfg[0],border:'1px solid '+cfg[1],gap:8}}>
                <span className="t-11 w-700" style={{color:cfg[2],textTransform:'uppercase',letterSpacing:'.04em'}}>Paiement {monthLabel}</span>
                <span className="w-700 t-13" style={{color:cfg[2]}}>{cfg[3]}{ps.paidAt?` · ${fmtFr(ps.paidAt)}`:''}</span>
              </div>;
            })()}
            {/* reports list */}
            {childReports.length===0 ? <span className="faint t-13">Aucun rapport pour l'instant.</span> :
              <div className="col gap-7">
                <div className="row between" style={{alignItems:'baseline'}}>
                  <span className="t-12 w-700 muted" style={{textTransform:'uppercase',letterSpacing:'.04em'}}>Rapports{expanded?` (${childReports.length})`:''}</span>
                  {childReports.length>3 && <button onClick={()=>setExpandedKid(expanded?null:k.id)} className="t-12 w-700" style={{background:'none',border:'none',color:'var(--blue-700)',cursor:'pointer',padding:0}}>{expanded?'Voir moins':`Voir tous les ${childReports.length} rapports`}</button>}
                </div>
                {visibleReports.map(r=><button key={r.id} onClick={()=>go('parent-report', r.token)} className="card-flat" style={{padding:'10px 12px',borderRadius:10,background:'var(--blue-50)',border:'1px solid var(--blue-100)',textAlign:'left',cursor:'pointer'}}>
                  <div className="row between"><span className="w-700 t-13" style={{color:'var(--blue-800)'}}>Rapport du {fmtFr(r.date)}</span><Icon name="arrow" size={14} style={{color:'var(--blue-700)'}}/></div>
                  <span className="t-12 muted">{r.summary?.topic||'—'}</span>
                </button>)}
              </div>}
          </div>;
        })}
      </div>
      <h2 style={{fontSize:22,margin:'24px 0 6px'}}>Messages</h2>
      <div className="col gap-10">
        {threads.length===0 && <span className="muted t-14">Aucun message.</span>}
        {threads.map(t=>{
          const child = t.studentId ? Nav.studentById(t.studentId) : (t.prospectiveStudent||{name:'—'});
          const msgs = Nav.messagesOfThread(t.id);
          const last = msgs[msgs.length-1];
          return <button key={t.id} onClick={()=>go('parent-thread', t.id)} className="card pad-14 col gap-6" style={{textAlign:'left',cursor:'pointer'}}>
            <div className="row between"><span className="w-700 t-14">{NAV.tutor.short} · {child.name||'—'}</span><span className="faint t-12">{fmtAgo(t.lastMessageAt)}</span></div>
            <span className="t-13 muted" style={{whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{last?(last.direction==='out'?'Enseignante : ':'Vous : ')+(last.text||''):'—'}</span>
          </button>;
        })}
      </div>
      <div className="card pad-16 col gap-8" style={{marginTop:18}}>
        <span className="t-12 faint w-700" style={{textTransform:'uppercase',letterSpacing:'.04em'}}>Préférence de langue</span>
        <div className="seg"><button className={parent.langPref==='fr'?'on':''}>Français</button><button className={parent.langPref==='ar-fr'?'on':''}>Arabe / Français</button></div>
        <span className="faint t-11">Détermine la langue par défaut des rapports et messages.</span>
      </div>
    </div>
  </div>;
}

function ParentThread({go, id}){
  useStore();
  const t = Nav.threadById(id);
  // Parent opening this thread marks the tutor's outbound messages as read.
  React.useEffect(()=>{ if(t) Nav.markOutboundReadByParent(t.id); }, [t?.id]);
  if(!t) return <div style={{padding:40}} className="muted">Conversation introuvable.</div>;
  const parent = Nav.parentById(t.parentId);
  const child = t.studentId ? Nav.studentById(t.studentId) : (t.prospectiveStudent||{});
  const msgs = Nav.messagesOfThread(t.id);
  const [text, setText] = React.useState('');
  const onSend = ()=>{
    if(!text.trim()) return;
    Nav.sendMessage({threadId:t.id, direction:'in', text, channel:'parent-app'});
    setText('');
    navToast('Message envoyé à l\'enseignante','green');
  };
  return <div className="screen-anim col" style={{minHeight:'100vh',background:'var(--bg)'}}>
    <div className="row gap-10" style={{padding:'14px 16px',borderBottom:'1px solid var(--line)',background:'#fff'}}>
      <button className="btn btn-ghost btn-sm btn-icon" onClick={()=>go('parent-home', parent.id)}><Icon name="arrowl" size={16}/></button>
      <Avatar initials="AB" cls="av-b" size={36}/>
      <div className="col"><span className="w-700 t-14">{NAV.tutor.short}</span><span className="faint t-12">Au sujet de {child.name||'votre enfant'}</span></div>
    </div>
    <div className="grow scroll col gap-10" style={{padding:'14px 16px'}}>
      {msgs.map(m=>{
        const me = m.direction==='in'; // parent side: 'in' = parent
        return <div key={m.id} style={{display:'flex',justifyContent:me?'flex-end':'flex-start'}}>
          <div className="col" style={{maxWidth:'82%',gap:2}}>
            <div className="card" style={{padding:'9px 12px',borderRadius:14, background:me?'var(--blue-700)':'#fff',color:me?'#fff':'var(--ink)',border:me?'none':'1px solid var(--line)',whiteSpace:'pre-wrap'}}>{m.text}</div>
            <span className="faint t-11" style={{alignSelf:me?'flex-end':'flex-start'}}>{fmtTime(m.createdAt)}</span>
          </div>
        </div>;
      })}
    </div>
    <div className="col gap-8" style={{padding:'12px 16px',borderTop:'1px solid var(--line)',background:'#fff'}}>
      <textarea className="textarea" style={{minHeight:60}} placeholder="Écrire à l'enseignante…" value={text} onChange={e=>setText(e.target.value)}/>
      <Btn variant="green" icon="check" block onClick={onSend}>Envoyer</Btn>
    </div>
  </div>;
}

window.ParentHome = ParentHome;
window.ParentThread = ParentThread;
