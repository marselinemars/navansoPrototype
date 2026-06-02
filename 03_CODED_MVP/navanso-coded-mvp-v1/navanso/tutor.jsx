/* NAVANSO — Tutor workspace shell + Dashboard, Groups, Group detail, Student profile */

function AppShell({go, active, title, crumbs, actions, children, maxw=1180}){
  useStore();
  const isMobile = useIsMobile();
  const [sideOpen, setSideOpen] = React.useState(false);
  // Auto-close drawer when route changes OR when we transition back to desktop.
  React.useEffect(()=>{ setSideOpen(false); }, [active, isMobile]);
  const unread = Nav.unreadCountForTutor();
  const reportsPending = Nav.reportsPending().length;
  const todosCount = Nav.todosActive().length;
  const overdue = Nav.paymentsOverdueCount();
  /* B17.3 — hiérarchie primaire/secondaire selon le feedback de conception.
     "Espace" = ce qui sert tous les jours et porte la story Navanso
     (confiance, suivi, rapport). "Outils" = utile mais secondaire
     (admin / cadence). Volontairement discret. */
  const nav=[
    ['Espace',null,[
      ['dash','Tableau de bord','dashboard'],
      ['users','Mes groupes','groups'],
      ['user','Mes élèves','students'],
      ['wa','Messages','messages', unread||null],
      ['clipboard','Évaluations','assessment'],
      ['file','Rapports','reports', reportsPending||null],
    ]],
    ['Outils',null,[
      ['calendar','Planning','planning'],
      ['target','Mes tâches','todos', todosCount||null],
      ['chart','Paiements','payments', overdue||null],
    ]],
  ];
  const map={
    dashboard:'dashboard', groups:'groups', 'group-detail':'groups', 'create-group':'groups',
    'add-student':'groups',
    students:'students', 'student-profile':'students',
    attendance:'dashboard', 'session-entry':'groups', 'session-plan':'groups', assessment:'assessment', 'report-gen':'report-gen',
    messages:'messages', thread:'messages', 'group-broadcast':'messages', planning:'planning', todos:'todos',
    'reports-batch':'report-gen', 'reports':'report-gen',
    payments:'payments',
  };
  const cur=map[active]||active;
  // search + bell state
  const [bellOpen, setBellOpen] = React.useState(false);
  const [studentSearch, setStudentSearch] = React.useState('');
  const studentSearchOpen = studentSearch.length>0;
  const matches = studentSearchOpen ? Nav.studentsAll().filter(s=>s.name.toLowerCase().includes(studentSearch.toLowerCase()) || (s.parent||'').toLowerCase().includes(studentSearch.toLowerCase())).slice(0,8) : [];
  // bell state — subscribe to bell-seen events so badge clears immediately
  const [bellTick, setBellTick] = React.useState(0);
  React.useEffect(()=>{ const f=()=>setBellTick(t=>t+1); window.addEventListener('nav-bell-seen',f); return ()=>window.removeEventListener('nav-bell-seen',f); }, []);
  const notifsBundle = Nav.notificationsForTutor();
  const newEvents = notifsBundle.events;   // counted in the badge
  const ongoing = notifsBundle.ongoing;
  return <div className="shell">
    {/* mobile overlay — only mounted on mobile */}
    {isMobile && <div className={`side-overlay ${sideOpen?'open':''}`} onClick={()=>setSideOpen(false)}></div>}
    {/* SIDEBAR */}
    <aside className={`side ${isMobile && sideOpen ? 'open' : ''}`}>
      {isMobile && <div className="side-close">
        <button onClick={()=>setSideOpen(false)} title="Fermer"><Icon name="x" size={18}/></button>
      </div>}
      <div style={{padding:'4px 8px 10px',cursor:'pointer'}} onClick={()=>go('landing')}><Logo size={32}/></div>
      {nav.map(([label,_,items],gi)=><div key={gi}>
        <div className="nav-l">{label}</div>
        {items.map(([ic,lab,id,tag])=>
          <div key={id} className={`nav-i ${cur===id?'on':''}`} onClick={()=>go(id)}>
            <Icon name={ic}/>{lab}{tag?<span className="tag" style={ic==='wa'?{background:'var(--blue-700)',color:'#fff'}:{}}>{tag}</span>:null}
          </div>)}
      </div>)}
      <div style={{marginTop:'auto'}}>
        <div className="nav-i" onClick={()=>go('tutor-onboarding')}><Icon name="settings"/>Mon profil</div>
        <div className="nav-i" onClick={()=>go('tutor-profile')}><Icon name="eye"/>Voir profil public</div>
        <div className="card-flat" style={{marginTop:10,padding:12,borderRadius:12,background:'var(--blue-50)',border:'none'}}>
          <div className="row gap-10">
            <Avatar initials="AB" cls="av-b" size={36}/>
            <div className="col grow" style={{gap:0}}><span className="w-700 t-13">Mme Amina</span><span className="faint t-12">Plan Enseignant</span></div>
            <button title="Se déconnecter" className="btn btn-ghost btn-sm btn-icon" onClick={()=>{ NavAuth.logout(); navToast('Vous êtes déconnectée','blue'); go('landing'); }}><Icon name="arrow" size={14} style={{transform:'rotate(180deg)'}}/></button>
          </div>
        </div>
      </div>
    </aside>
    {/* MAIN */}
    <div className="main">
      <div className="topbar" style={{position:'relative'}}>
        {isMobile && <button className="btn btn-ghost btn-icon" onClick={()=>setSideOpen(true)} title="Menu" style={{flex:'none',alignSelf:'flex-start'}}><Icon name="menu" size={18}/></button>}
        <div className="col" style={{gap:2}}>
          {crumbs && <div className="row gap-6 faint t-12 w-600" style={{whiteSpace:'nowrap'}}>{crumbs.map((c,i)=><React.Fragment key={i}>{i>0&&<Icon name="chevron" size={12}/>}<span style={i===crumbs.length-1?{color:'var(--ink-2)'}:{cursor:'pointer'}} onClick={c.go}>{c.t}</span></React.Fragment>)}</div>}
          <h1 style={{fontSize:21,whiteSpace:'nowrap'}}>{title}</h1>
        </div>
        <div className="row gap-10" style={{marginLeft:'auto',position:'relative'}}>
          <div className="input-icon" style={{width:220,position:'relative'}}>
            <Icon name="search"/>
            <input className="input" style={{padding:'9px 12px 9px 38px',fontSize:13.5}} placeholder="Rechercher un élève…" value={studentSearch} onChange={e=>setStudentSearch(e.target.value)}/>
            {studentSearchOpen && <div className="card" style={{position:'absolute',top:'calc(100% + 6px)',right:0,left:0,boxShadow:'var(--sh-3)',padding:6,zIndex:50,maxHeight:260,overflowY:'auto'}}>
              {matches.length===0 ? <div className="t-13 muted" style={{padding:'10px 12px'}}>Aucun élève</div>
              : matches.map(s=><button key={s.id} onClick={()=>{setStudentSearch('');go('student-profile',s.id);}} style={{display:'flex',width:'100%',gap:10,padding:'8px 10px',border:'none',background:'transparent',cursor:'pointer',borderRadius:8,alignItems:'center'}}>
                <Avatar initials={s.initials} cls={s.av} size={26}/>
                <div className="col" style={{gap:0,textAlign:'left'}}><span className="w-600 t-13">{s.name}</span><span className="faint t-11">{s.parent}</span></div>
              </button>)}
            </div>}
          </div>
          <button className="btn btn-ghost btn-icon" onClick={()=>{setBellOpen(v=>{const next=!v; if(next) Nav.markBellSeen(); return next;});}} style={{position:'relative'}}>
            <Icon name="bell"/>
            {newEvents.length>0 && <span style={{position:'absolute',top:4,right:4,minWidth:16,height:16,padding:'0 4px',borderRadius:99,background:'var(--alert)',color:'#fff',fontSize:10,fontWeight:700,display:'grid',placeItems:'center'}}>{newEvents.length>9?'9+':newEvents.length}</span>}
          </button>
          {bellOpen && <NotifDropdown events={newEvents} ongoing={ongoing} go={(s,p)=>{setBellOpen(false);go(s,p);}} close={()=>setBellOpen(false)}/>}
          {actions}
        </div>
      </div>
      <div className="content scroll screen-anim" style={{maxWidth:maxw}}>{children}</div>
    </div>
  </div>;
}

function NotifDropdown({events, ongoing, go, close}){
  const Item = ({n})=>{
    const bg = n.tone==='orange'?'var(--orange-50)':n.tone==='blue'?'var(--blue-50)':'var(--green-50)';
    const fg = n.tone==='orange'?'var(--orange-600)':n.tone==='blue'?'var(--blue-700)':'var(--green-700)';
    const ic = n.kind==='inquiry'?'search':n.kind==='message'?'wa':n.kind==='report-pending'?'file':n.kind==='report-viewed'?'eye':'clock';
    return <button key={n.id} onClick={()=>go(n.screen,n.param)} style={{display:'flex',width:'100%',gap:10,padding:'12px 14px',border:'none',background:'#fff',cursor:'pointer',borderBottom:'1px solid var(--line-2)',textAlign:'left',alignItems:'flex-start'}}>
      <div className="icn" style={{width:32,height:32,borderRadius:9,background:bg,color:fg,display:'grid',placeItems:'center',flex:'none'}}><Icon name={ic} size={15}/></div>
      <div className="col grow" style={{gap:2,minWidth:0}}>
        <span className="w-700 t-13">{n.label}</span>
        {n.sub && <span className="faint t-12">{n.sub}</span>}
        {n.excerpt && <span className="t-12 muted" style={{whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>« {n.excerpt} »</span>}
      </div>
    </button>;
  };
  return <>
    <div onClick={close} style={{position:'fixed',inset:0,zIndex:40}}/>
    <div className="card" style={{position:'absolute',top:'calc(100% + 6px)',right:90,width:380,boxShadow:'var(--sh-4)',padding:0,zIndex:50,maxHeight:520,overflow:'hidden',display:'flex',flexDirection:'column'}}>
      <div className="row between" style={{padding:'12px 14px',borderBottom:'1px solid var(--line-2)'}}>
        <span className="w-700 t-14">Notifications</span>
        <span className="faint t-12">{events.length} événement{events.length>1?'s':''}</span>
      </div>
      <div className="scroll" style={{flex:1,overflowY:'auto'}}>
        {events.length===0 && ongoing.length===0 && <div className="muted t-14" style={{padding:'40px 20px',textAlign:'center'}}>Tout est à jour 🎉<br/><span className="faint t-12">Aucune nouveauté depuis votre dernière visite.</span></div>}
        {events.length>0 && <>
          <div className="t-11 faint w-700" style={{padding:'10px 14px 4px',textTransform:'uppercase',letterSpacing:'.04em',background:'var(--bg)'}}>Nouveau</div>
          {events.map(n=> <Item key={n.id} n={n}/>)}
        </>}
        {ongoing.length>0 && <>
          <div className="t-11 faint w-700" style={{padding:'12px 14px 4px',textTransform:'uppercase',letterSpacing:'.04em',background:'var(--bg)'}}>En cours</div>
          {ongoing.map(n=> <Item key={n.id} n={n}/>)}
        </>}
      </div>
    </div>
  </>;
}

window.NotifDropdown = NotifDropdown;

/* ---------------- DASHBOARD ---------------- */
function Dashboard({go}){
  useStore();
  const isMobile = useIsMobile();
  // Pick the very next planned session across all groups for the hero card.
  const allSessions = Nav.sessionsAll();
  const upcoming = allSessions.filter(s=>s.status==='planned').sort((a,b)=>(a.date||'').localeCompare(b.date||''));
  const nextSess = upcoming[0] || null;
  const nextGroup = nextSess ? Nav.groupById(nextSess.groupId) : null;
  const nextCarry = nextSess ? Nav.carryOverTodos(nextSess.groupId) : [];
  const nextTodos = nextSess ? Nav.todosBySession(nextSess.id) : [];
  const lastSess = nextSess ? Nav.lastCompletedSession(nextSess.groupId) : null;
  const fmtNextDate = (iso)=>{
    if(!iso) return '';
    const dt = new Date(iso);
    if(isNaN(dt)) return iso;
    const days = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
    return `${days[dt.getDay()]} ${dt.getDate()} ${['janv.','févr.','mars','avr.','mai','juin','juil.','août','sept.','oct.','nov.','déc.'][dt.getMonth()]}`;
  };
  const heroAct = sessionAction(nextSess);
  return <AppShell go={go} active="dashboard" title="Bonjour Amina 👋"
    actions={<Btn variant="primary" icon={heroAct.screen==='session-plan'?'edit':'calendar'} onClick={()=>nextSess?go(heroAct.screen, heroAct.param):go('attendance')}>{heroAct.label}</Btn>}>
    <p className="muted t-15" style={{marginTop:-4,marginBottom:18}}>Vous avez <b style={{color:'var(--ink)'}}>{upcoming.length} séance{upcoming.length>1?'s':''} planifiée{upcoming.length>1?'s':''}</b> et <b style={{color:'var(--orange-600)'}}>{Nav.reportsPending().length} rapport{Nav.reportsPending().length>1?'s':''} à envoyer</b>.</p>
    {/* HERO — prochaine séance */}
    {nextSess && <button onClick={()=>go(heroAct.screen, heroAct.param)} className="card" style={{
      display:'flex',flexDirection:isMobile?'column':'row',alignItems:'stretch',gap:0,padding:0,marginBottom:18,borderRadius:18,overflow:'hidden',
      background:'linear-gradient(135deg,var(--blue-700),var(--blue-600))',
      boxShadow:'var(--sh-3)',border:'none',width:'100%',cursor:'pointer',textAlign:'left'}}>
      <div style={{flex:1,padding:'20px 22px',color:'#fff'}}>
        <div className="row gap-8" style={{marginBottom:4,opacity:.85}}>
          <Icon name="clock" size={14}/>
          <span className="t-12 w-700" style={{textTransform:'uppercase',letterSpacing:'.06em'}}>Prochaine séance · {fmtNextDate(nextSess.date)}</span>
        </div>
        <div className="row gap-10 wrap" style={{alignItems:'baseline',marginBottom:6}}>
          <h2 style={{fontSize:24,color:'#fff'}}>{nextSess.plannedTopic || 'À préparer'}</h2>
          <span style={{fontSize:14,opacity:.85}}>{nextGroup?.name}</span>
        </div>
        <div className="row gap-14 wrap" style={{fontSize:13,opacity:.92,marginTop:8}}>
          <span className="row gap-6"><Icon name="book" size={13}/>{(nextSess.plannedItems||[]).length} point{(nextSess.plannedItems||[]).length>1?'s':''} prévus</span>
          {nextCarry.length>0 && <span className="row gap-6"><Icon name="clock" size={13}/>{nextCarry.length} à reprendre</span>}
          {nextTodos.length>0 && <span className="row gap-6"><Icon name="target" size={13}/>{nextTodos.length} tâche{nextTodos.length>1?'s':''} prépa</span>}
          <span className="row gap-6"><Icon name="pin" size={13}/>{nextGroup?.loc}</span>
        </div>
        {lastSess && <div className="row gap-6 wrap" style={{fontSize:12,marginTop:10,paddingTop:10,borderTop:'1px solid rgba(255,255,255,.18)',opacity:.85}}>
          <Icon name="clipboard" size={12}/>
          <span><b>Dernière séance</b> · {lastSess.plannedTopic||'—'}{lastSess.date?` · ${(new Date(lastSess.date)).toLocaleDateString('fr-FR',{day:'2-digit',month:'short'})}`:''}</span>
        </div>}
      </div>
      <div style={{display:'flex',alignItems:'center',justifyContent:isMobile?'center':'flex-start',padding:isMobile?'14px':'0 24px',background:'rgba(255,255,255,.1)',color:'#fff',fontWeight:700,fontSize:14,gap:8,whiteSpace:'nowrap'}}>
        {heroAct.label} <Icon name="arrow" size={16}/>
      </div>
    </button>}
    {/* SECONDARY QUICK ACTIONS — three pivots after the hero */}
    <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'repeat(3,1fr)',gap:14,marginBottom:14}}>
      {[
        {ic:'user',t:'Ajouter un élève',s:'Dans un de vos groupes',id:'add-student',tn:'blue'},
        {ic:'file',t:'Générer un rapport',s:'À partir des remarques',id:'report-gen',tn:'green'},
        {ic:'target',t:'Élèves à suivre',s:`${Nav.studentsAll().filter(s=>s.status==='pending'||s.att<85).length} à revoir`,id:'__suivi',tn:'orange'},
      ].map(a=>{
        const fg=a.tn==='orange'?'var(--orange-600)':a.tn==='green'?'var(--green-700)':'var(--blue-700)';
        const bg=a.tn==='orange'?'var(--orange-50)':a.tn==='green'?'var(--green-50)':'var(--blue-50)';
        const onClick=a.id==='__suivi'
          ? ()=>{const el=document.getElementById('suivi');const sc=document.querySelector('.content.scroll');if(el&&sc){sc.scrollTo({top:sc.scrollTop+el.getBoundingClientRect().top-sc.getBoundingClientRect().top-16,behavior:'smooth'});}}
          : ()=>go(a.id);
        return <button key={a.t} onClick={onClick} className="card qa-card" style={{
          padding:'16px 18px',borderRadius:14,cursor:'pointer',textAlign:'left',
          display:'flex',alignItems:'center',gap:14,
          background:'#fff',
          border:'1px solid var(--line)',
          boxShadow:'var(--sh-1)'}}>
          <div className="icn" style={{width:42,height:42,borderRadius:12,flex:'none',display:'grid',placeItems:'center',
            background:bg,color:fg}}><Icon name={a.ic} size={21}/></div>
          <div className="col" style={{gap:2,minWidth:0}}>
            <span className="w-700 t-15" style={{color:'var(--ink)'}}>{a.t}</span>
            <span className="t-12 w-600" style={{color:'var(--faint)'}}>{a.s}</span>
          </div>
          <Icon name="arrow" size={17} style={{marginLeft:'auto',flex:'none',color:'var(--faint)'}}/>
        </button>;
      })}
    </div>
    {/* PROMOTED: students needing follow-up — the only truly actionable list */}
    <div id="suivi" className="card pad-20 col gap-14" style={{marginBottom:20,scrollMarginTop:16}}>
      <div className="row between">
        <h3 className="row gap-8" style={{fontSize:17}}><Icon name="target" size={18} style={{color:'var(--orange-600)'}}/>Élèves nécessitant un suivi</h3>
        <Btn variant="soft" size="sm" iconR="arrow" onClick={()=>go('students')}>Tous les élèves</Btn>
      </div>
      <div className="col">
        {Nav.studentsAll().filter(s=>s.status==='pending'||s.att<85).map((s,i,arr)=>{
          const low=s.att<85;
          return <div key={s.id} className="row between wrap" style={{gap:12,padding:'13px 0',borderTop:i>0?'1px solid var(--line-2)':'none',cursor:'pointer'}} onClick={()=>go('student-profile', s.id)}>
            <div className="row gap-12" style={{minWidth:200}}>
              <Avatar initials={s.initials} cls={s.av} size={38}/>
              <div className="col" style={{gap:1}}><span className="w-600 t-14">{s.name}</span><span className="faint t-12">{(Nav.groupById(s.groupId)||{}).name?.split('—')[0]?.trim()||'—'} · {s.parent}</span></div>
            </div>
            <div className="row gap-18 wrap" style={{alignItems:'center'}}>
              <div className="col" style={{gap:3,minWidth:96}}>
                <span className="faint t-11 w-700" style={{textTransform:'uppercase',letterSpacing:'.04em'}}>Présence</span>
                <div className="row gap-7"><div style={{width:48}}><Bar pct={s.att} tone={low?'orange':''}/></div><span className="t-13 w-700 tnum" style={{color:low?'var(--orange-600)':'var(--green-700)'}}>{s.att}%</span></div>
              </div>
              {s.weak!=='—' && <span className="chip chip-weak">{s.weak}</span>}
              {s.status==='pending'
                ? <span className="badge badge-pending"><Icon name="file" size={13}/>Rapport à envoyer</span>
                : <span className="badge badge-new"><Icon name="eye" size={13}/>À surveiller</span>}
              <Btn variant="ghost" size="sm" iconR="chevron" onClick={(e)=>{e.stopPropagation();go('student-profile', s.id);}}>Voir l’élève</Btn>
            </div>
          </div>;
        })}
      </div>
    </div>
    {/* Compact "Mes groupes" strip — horizontal scroll, low-density */}
    <div className="row between" style={{marginBottom:10}}>
      <h3 style={{fontSize:16}}>Mes groupes</h3>
      <Btn variant="ghost" size="sm" iconR="arrow" onClick={()=>go('groups')}>Tout voir</Btn>
    </div>
    <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'repeat(3,1fr)',gap:14,marginBottom:18}}>
      {Nav.groupsAll().map(g=>{
        const next = Nav.nextPlannedSession(g.id);
        return <button key={g.id} onClick={()=>go('group-detail', g.id)} className="card" style={{textAlign:'left',padding:'16px 18px',border:'1px solid var(--line)',cursor:'pointer'}}>
          <div className="row between wrap" style={{marginBottom:12,gap:8,rowGap:6}}>
            <span className="w-700 t-14">{g.name.split('—')[0].trim()}</span>
            {g.places>0?<span className="chip chip-green" style={{fontSize:10.5,padding:'2px 8px'}}>{g.places} place{g.places>1?'s':''}</span>:<span className="chip chip-weak" style={{fontSize:10.5,padding:'2px 8px'}}>Complet</span>}
          </div>
          <SeatRow cap={g.cap} students={g.students}/>
          <div className="row gap-8 wrap" style={{marginTop:12,alignItems:'baseline',rowGap:4}}>
            <span className="t-12 muted w-600">{g.students}/{g.cap} élèves</span>
            <span className="faint t-11">·</span>
            <span className="t-12 muted w-600">{next?`Prochaine ${(new Date(next.date)).toLocaleDateString('fr-FR',{day:'2-digit',month:'short'})}`:'Pas de séance'}</span>
          </div>
        </button>;
      })}
    </div>
    {/* compact week summary — replaces the metrics strip */}
    <div className="card-flat" style={{padding:'10px 14px',borderRadius:10,background:'var(--bg)',border:'1px solid var(--line-2)',marginBottom:8}}>
      <span className="row gap-14 wrap t-13 muted">
        <span className="row gap-6"><Icon name="users" size={13}/><b className="tnum" style={{color:'var(--ink)'}}>{Nav.groupsAll().length}</b> groupes</span>
        <span className="row gap-6"><Icon name="user" size={13}/><b className="tnum" style={{color:'var(--ink)'}}>{Nav.studentsAll().length}</b> élèves</span>
        <span className="row gap-6"><Icon name="calendar" size={13}/><b className="tnum" style={{color:'var(--ink)'}}>{Nav.sessionsAll().filter(s=>s.status==='planned').length}</b> séances à venir</span>
        <span className="row gap-6"><Icon name="file" size={13} style={{color:Nav.reportsPending().length>0?'var(--orange-600)':'var(--faint)'}}/><b className="tnum" style={{color:Nav.reportsPending().length>0?'var(--orange-600)':'var(--ink)'}}>{Nav.reportsPending().length}</b> rapports à envoyer</span>
      </span>
    </div>
  </AppShell>;
}

/* ---------------- GROUPS LIST ---------------- */
function Groups({go}){
  useStore();
  const isMobile = useIsMobile();
  const [segment, setSegment] = React.useState('all'); // all | with-places | full
  const all = Nav.groupsAll();
  const list = segment==='with-places' ? all.filter(g=>g.places>0)
             : segment==='full' ? all.filter(g=>g.places===0)
             : all;
  return <AppShell go={go} active="groups" title="Groupes"
    crumbs={[{t:'Espace',go:()=>go('dashboard')},{t:'Groupes'}]}
    actions={<Btn variant="primary" icon="plus" onClick={()=>go('create-group')}>Ajouter un groupe</Btn>}>
    <div className="row gap-12" style={{marginBottom:18}}>
      <div className="seg">
        <button className={segment==='all'?'on':''} onClick={()=>setSegment('all')}>Tous ({all.length})</button>
        <button className={segment==='with-places'?'on':''} onClick={()=>setSegment('with-places')}>Avec places ({all.filter(g=>g.places>0).length})</button>
        <button className={segment==='full'?'on':''} onClick={()=>setSegment('full')}>Complets ({all.filter(g=>g.places===0).length})</button>
      </div>
      <span className="muted t-14 w-600" style={{marginLeft:'auto'}}>{list.length} groupe{list.length>1?'s':''} · {Nav.studentsAll().length} élèves</span>
    </div>
    <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:18}}>
      {list.map(g=>
        <div key={g.id} className="card pad-20 col gap-14">
          <div className="row between">
            <div className="col gap-6">
              <span className="w-700 t-17" style={{fontSize:17}}>{g.name}</span>
              <div className="row gap-7 wrap"><span className="chip chip-blue">{g.subject}</span><span className="chip chip-gray">{g.level}</span></div>
            </div>
            {g.places>0?<Places places={g.places} cap={g.cap}/>:<span className="places places-full"><span className="dot"></span>Complet</span>}
          </div>
          <div className="row gap-16 wrap faint t-13 w-600">
            <span className="row gap-6"><Icon name="calendar" size={14}/>{g.schedule}</span>
            <span className="row gap-6"><Icon name="pin" size={14}/>{g.loc}</span>
          </div>
          <div className="card-flat" style={{padding:12,borderRadius:11,background:'var(--bg)',border:'none'}}>
            <div className="row between" style={{marginBottom:8}}><span className="t-13 w-600 muted">Capacité du groupe</span><span className="t-13 w-700">{g.students} / {g.cap}</span></div>
            <SeatRow cap={g.cap} students={g.students}/>
            <div className="row between" style={{marginTop:10}}>
              <span className="row gap-6 t-12 muted w-600"><Icon name="book" size={13}/>Dernière séance : {g.last}</span>
              {g.reports>0?<span className="badge badge-pending"><Icon name="file" size={13}/>{g.reports} en attente</span>:<span className="badge badge-verified"><Icon name="check" size={13}/>À jour</span>}
            </div>
          </div>
          <div className="row gap-10 wrap" style={{rowGap:10}}>
            <Btn variant="ghost" size="sm" iconR="arrow" onClick={()=>go('group-detail', g.id)}>Ouvrir le groupe</Btn>
            {(()=>{const next=Nav.nextPlannedSession(g.id); const a=sessionAction(next); return <Btn variant="ghost" size="sm" icon={a.screen==='session-plan'?'edit':'calendar'} onClick={()=>go(a.screen, a.param)}>{a.label}</Btn>;})()}
            <Btn variant="soft" size="sm" icon="file" onClick={()=>go('reports-batch', g.id)}>Rapports</Btn>
          </div>
        </div>)}
      {/* add card */}
      <button className="card" onClick={()=>go('create-group')} style={{padding:20,borderRadius:16,border:'1.5px dashed var(--line)',background:'transparent',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:10,minHeight:160,cursor:'pointer',color:'var(--muted)'}}>
        <div className="icn" style={{width:44,height:44,borderRadius:13,background:'var(--blue-50)',color:'var(--blue-700)',display:'grid',placeItems:'center'}}><Icon name="plus" size={22}/></div>
        <span className="w-600 t-15">Créer un nouveau groupe</span>
      </button>
    </div>
  </AppShell>;
}

Object.assign(window,{AppShell,Dashboard,Groups});
