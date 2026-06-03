/* NAVANSO — Parent screens: Search/discovery + Tutor public profile */

function TutorCard({t:tu, go, featured}){
  useStore(); useLang();
  const isAr = NavI18n.lang === 'ar';
  const saved = Nav.shortlistHas(tu.id);
  const lineAr = {
    'Suivi mensuel avec rapport parent':'متابعة شهرية مع تقرير للوالد',
    'Préparation intensive au BEM':'تحضير مكثّف لشهادة BEM',
    'Méthode progressive, groupes réduits':'طريقة تدريجية وأفواج صغيرة',
    'Ancien enseignant, 12 ans d’expérience':'أستاذ سابق، 12 سنة خبرة',
  };
  return <div className="card" style={{padding:18,borderRadius:16,display:'flex',flexDirection:'column',gap:14,
    border:featured?'1.5px solid var(--blue-200,var(--blue-100))':'1px solid var(--line)',
    boxShadow:featured?'var(--sh-3)':'var(--sh-2)',position:'relative'}}>
    {/* Heart toggle — top-right corner */}
    <button title={saved?t('tc.tip.remove'):t('tc.tip.add')}
      onClick={(e)=>{e.stopPropagation(); Nav.shortlistToggle(tu.id); navToast(saved?t('tc.toast.removed'):t('tc.toast.added'),'green');}}
      style={{position:'absolute',top:12,right:12,width:34,height:34,borderRadius:99,
        background: saved?'var(--green-50)':'#fff', border:'1px solid '+(saved?'var(--green-500)':'var(--line)'),
        display:'grid',placeItems:'center',cursor:'pointer',color: saved?'var(--green-700)':'var(--faint)',
        boxShadow:'var(--sh-1)',zIndex:2}}>
      <Icon name="heart" size={17} style={saved?{fill:'var(--green-600)'}:{}}/>
    </button>
    {featured && <span className="badge badge-new" style={{position:'absolute',top:14,right:54}}>{t('tc.recommended')}</span>}
    <div className="row gap-12">
      <Avatar initials={tu.initials} cls={tu.av} size={52} ring/>
      <div className="col" style={{gap:3}}>
        <span className="w-700 t-17" style={{fontSize:17}}>{isAr?txData(tu.name):tu.name}</span>
        <div className="row gap-8 wrap">
          <span className="chip chip-blue">{txData?txData(tu.subject):tu.subject}</span>
          <span className="chip chip-gray">{txData?txData(tu.level):tu.level}</span>
        </div>
      </div>
    </div>
    <div className="row gap-16 wrap">
      <div className="row gap-6"><Icon name="pin" size={15} style={{color:'var(--faint)'}}/><span className="t-13 muted w-600">{tu.loc}</span></div>
      <div className="row gap-6"><Icon name="users" size={15} style={{color:'var(--faint)'}}/><span className="t-13 muted w-600">{txData?txData(tu.mode):tu.mode}</span></div>
      <span className="row gap-6"><Stars rating={tu.rating} reviews={tu.reviews} size={13}/><DemoTag style={{fontSize:10,padding:'2px 6px'}}/></span>
    </div>
    {/* GROUP SIZE + PLACES — emphasised */}
    <div className="card-flat" style={{padding:14,background:'var(--bg)',border:'none',borderRadius:12}}>
      <div className="row between" style={{marginBottom:10,gap:8}}>
        <span className="t-12 faint w-700" style={{textTransform:'uppercase',letterSpacing:'.04em',fontSize:10.5,whiteSpace:'nowrap'}}>{t('tc.smallGroup')}</span>
        <Places places={tu.places} cap={tu.cap}/>
      </div>
      <div className="row between" style={{marginBottom:9}}>
        <span className="w-700 t-15" style={{whiteSpace:'nowrap'}}>{t('tc.maxStudents',{n:tu.cap})}</span>
        <span className="faint t-13 w-600 tnum">{tu.students}/{tu.cap}</span>
      </div>
      <SeatRow cap={tu.cap} students={tu.students}/>
    </div>
    {/* Price + trial badge */}
    {(tu.price || tu.trial) && <div className="row gap-10 wrap" style={{alignItems:'baseline',rowGap:6}}>
      {tu.price && <div className="col" style={{gap:0}}>
        <span className="t-11 faint w-700" style={{textTransform:'uppercase',letterSpacing:'.04em'}}>{t('tc.price.label')}</span>
        <span className="w-700 t-15" style={{color:'var(--ink)'}}>{t('tc.price.from')} {tu.price.toLocaleString('fr-FR')} DZD<span className="faint t-12 w-600"> / {isAr?'شهر':(tu.priceUnit||t('tc.price.unit.month'))}</span></span>
      </div>}
      <span style={{flex:1}}/>
      {tu.trial && <span className="chip chip-green w-700" style={{fontSize:11}}><Icon name="checkc" size={12}/>{t('tc.trial')}</span>}
    </div>}
    <p className="t-14 lh-14" style={{color:'var(--ink-2)'}}><Icon name="check" size={15} style={{color:'var(--green-600)',verticalAlign:'-2px',marginRight:5}}/>{isAr?(lineAr[tu.line]||tu.line):tu.line}</p>
    {/* trust indicators (safer than ratings) */}
    <div className="row gap-6 wrap">
      <span className="chip chip-green"><Icon name="checkc" size={12}/>{t('tc.profilComplete')}</span>
      <span className="chip chip-blue"><Icon name="file" size={12}/>{t('tc.followReports')}</span>
      <span className="chip chip-gray"><Icon name="wa" size={12}/>{t('tc.whatsappDirect')}</span>
    </div>
    <div className="row gap-10">
      <Btn variant="ghost" size="sm" style={{flex:1}} onClick={()=>go('tutor-profile', tu.id)}>{t('tc.btn.profile')}</Btn>
      <Btn variant="green" size="sm" icon="wa" style={{flex:1}} onClick={()=>go('inquiry', tu.id)}>{t('tc.btn.contact')}</Btn>
    </div>
  </div>;
}

function FilterChip({children, active, onClick, tone}){
  return <button className={`pick ${active?'on':''} ${tone==='g'?'g':''}`} onClick={onClick}>{children}</button>;
}

function ParentSearch({go}){
  useStore(); useLang();
  const isAr = NavI18n.lang === 'ar';
  const isMobile = useIsNarrow();
  const shortlistCount = Nav.shortlistAll().length;
  const DEFAULTS = {subject:'Mathématiques', level:'4e AM', size:'Petit groupe', mode:'Tous', onlyPlaces:true,
    qSubject:'Mathématiques', qLevel:'4e année moyenne', qLoc:'Ouargla'};
  const [subject,setSubject]=React.useState(DEFAULTS.subject);
  const [level,setLevel]=React.useState(DEFAULTS.level);
  const [size,setSize]=React.useState(DEFAULTS.size);
  const [onlyPlaces,setOnlyPlaces]=React.useState(DEFAULTS.onlyPlaces);
  const [mode,setMode]=React.useState(DEFAULTS.mode);
  // header search inputs — now controlled
  const [qSubject,setQSubject]=React.useState(DEFAULTS.qSubject);
  const [qLevel,setQLevel]=React.useState(DEFAULTS.qLevel);
  const [qLoc,setQLoc]=React.useState(DEFAULTS.qLoc);
  // criteria actually applied (only updated when "Rechercher" pressed)
  const [applied,setApplied]=React.useState({qSubject:DEFAULTS.qSubject, qLevel:DEFAULTS.qLevel, qLoc:DEFAULTS.qLoc});
  const reset = ()=>{
    setSubject(DEFAULTS.subject); setLevel(DEFAULTS.level); setSize(DEFAULTS.size); setMode(DEFAULTS.mode); setOnlyPlaces(DEFAULTS.onlyPlaces);
    setQSubject(DEFAULTS.qSubject); setQLevel(DEFAULTS.qLevel); setQLoc(DEFAULTS.qLoc);
    setApplied({qSubject:DEFAULTS.qSubject, qLevel:DEFAULTS.qLevel, qLoc:DEFAULTS.qLoc});
    navToast(isAr?'تمّت إعادة ضبط الفلاتر':'Filtres réinitialisés','blue');
  };
  const runSearch = ()=>{
    setApplied({qSubject, qLevel, qLoc});
    navToast(isAr?'تمّ تحديث البحث':'Recherche actualisée','blue');
  };
  const matchMode = (t)=>{
    if(!mode || mode==='Tous') return true;
    const tm=(t.mode||'').toLowerCase();
    if(mode==='Présentiel') return tm.includes('présentiel');
    if(mode==='En ligne') return tm.includes('en ligne');
    return true;
  };
  // Resolve effective filters: header search inputs are the source of truth.
  // The chips in the sidebar mirror header values; both stay in sync via
  // `subject`/`level` state. We avoid double-filtering on subject/level.
  let list=NAV.searchTutors
    .filter(t=>onlyPlaces?t.places>0:true)
    // header subject (applied) — primary
    .filter(t=> !applied.qSubject || (t.subject||'').toLowerCase().includes(applied.qSubject.toLowerCase()))
    // header level (applied) — primary
    .filter(t=> !applied.qLevel || (t.level||'').toLowerCase().includes(applied.qLevel.toLowerCase().slice(0,4)))
    // location — only from header
    .filter(t=> !applied.qLoc || (t.loc||'').toLowerCase().includes(applied.qLoc.toLowerCase()))
    // mode chip — independent dimension
    .filter(matchMode);
  return <div className="screen-anim" style={{minHeight:'100%'}}>
    <MarketingNav go={go} active="parent-search"/>
    {/* "Mes présélections" entry point.
       Desktop: floating pill bottom-left (doesn't compete with table layout).
       Mobile: inline banner at top of content (no overlap with search cards). */}
    {shortlistCount>0 && !isMobile && <button onClick={()=>go('shortlist')} style={{position:'fixed',bottom:24,left:24,zIndex:60,
      background:'var(--green-600)',color:'#fff',border:'none',borderRadius:99,padding:'12px 18px',
      boxShadow:'0 12px 28px -8px rgba(20,90,60,.45), 0 2px 8px rgba(16,24,40,.08)',cursor:'pointer',
      display:'inline-flex',alignItems:'center',gap:10,fontWeight:700,fontSize:14}}>
      <Icon name="heart" size={16} style={{fill:'#fff'}}/>
      {t('ps.shortlistPill')} · {shortlistCount}
      <Icon name="arrow" size={14}/>
    </button>}
    {/* search header */}
    <div style={{background:'linear-gradient(180deg,#fff,var(--bg))',borderBottom:'1px solid var(--line)'}}>
      <div style={{maxWidth:1180,margin:'0 auto',padding:'34px 40px 28px'}}>
        <h1 style={{fontSize:30,marginBottom:10}}>{t('ps.title')}</h1>
        <div className="row gap-8 wrap" style={{marginBottom:14}}>
          <span className="chip chip-green w-700"><Icon name="users" size={13}/>{t('ps.chip.smallGroups')}</span>
          <span className="chip chip-blue w-700"><Icon name="grid" size={13}/>{t('ps.chip.places')}</span>
        </div>
        <p className="muted t-16" style={{marginBottom:22}}>{t('ps.desc')}</p>
        <div className="card" style={{padding:10,borderRadius:14,display:'grid',gridTemplateColumns:'2fr 1.2fr 1.2fr auto',gap:10,alignItems:'center',boxShadow:'var(--sh-3)'}}>
          <div className="input-icon"><Icon name="book"/><input className="input" value={qSubject} onChange={e=>setQSubject(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')runSearch();}} placeholder={t('ps.input.subject')}/></div>
          <div className="input-icon"><Icon name="chart"/><input className="input" value={qLevel} onChange={e=>setQLevel(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')runSearch();}} placeholder={t('ps.input.level')}/></div>
          <div className="input-icon"><Icon name="pin"/><input className="input" value={qLoc} onChange={e=>setQLoc(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')runSearch();}} placeholder={t('ps.input.loc')}/></div>
          <Btn variant="primary" icon="search" onClick={runSearch}>{t('ps.btn.search')}</Btn>
        </div>
        <div className="row gap-10 wrap" style={{marginTop:16,alignItems:'center'}}>
          <FutureTag>{t('ps.futureTag')}</FutureTag>
          <span className="faint t-13 lh-14" style={{flex:'1 1 320px'}} dangerouslySetInnerHTML={{__html:t('ps.notice')}}/>
        </div>
      </div>
    </div>
    {/* layout: filters + results */}
    <div style={{maxWidth:1180,margin:'0 auto',padding:isMobile?'16px':'24px 40px 64px',display:'grid',gridTemplateColumns:isMobile?'1fr':'248px 1fr',gap:isMobile?16:28,alignItems:'start'}}>
      {/* FILTERS */}
      <div className="card pad-20 col gap-18" style={{position:'sticky',top:90}}>
        <div className="row between"><span className="w-700 t-15 row gap-8"><Icon name="filter" size={17}/>{t('ps.filters')}</span><span className="faint t-12 w-600" style={{cursor:'pointer'}} onClick={reset}>{t('ps.reset')}</span></div>
        <div className="hr"></div>
        <div className="col gap-9">
          <span className="label">{t('ps.filter.subject')}</span>
          <div className="row gap-7 wrap">{['Mathématiques','Physique','Arabe','Sciences'].map(s=><FilterChip key={s} active={subject===s} onClick={()=>{setSubject(s); setQSubject(s); setApplied(a=>({...a,qSubject:s}));}}>{s}</FilterChip>)}</div>
        </div>
        <div className="col gap-9">
          <span className="label">{t('ps.filter.level')}</span>
          <div className="row gap-7 wrap">{['3e AM','4e AM','1AS','Primaire'].map(s=><FilterChip key={s} active={level===s} onClick={()=>{setLevel(s); setQLevel(s); setApplied(a=>({...a,qLevel:s}));}}>{s}</FilterChip>)}</div>
        </div>
        <div className="col gap-9">
          <span className="label">{t('ps.filter.format')}</span>
          <div className="row gap-7 wrap">{[['Individuel',t('ps.opt.individual')],['Petit groupe',t('ps.opt.smallGroup')]].map(([k,lbl])=><FilterChip key={k} tone="g" active={size===k} onClick={()=>setSize(k)}>{lbl}</FilterChip>)}</div>
        </div>
        <div className="col gap-9">
          <span className="label">{t('ps.filter.mode')}</span>
          <div className="row gap-7 wrap">{[['Tous',t('ps.opt.all')],['Présentiel',t('ps.opt.presential')],['En ligne',t('ps.opt.online')]].map(([k,lbl])=><FilterChip key={k} active={mode===k} onClick={()=>setMode(k)}>{lbl}</FilterChip>)}</div>
        </div>
        <div className="hr"></div>
        <label className="row between" style={{cursor:'pointer'}}>
          <span className="col" style={{gap:1}}><span className="w-600 t-14">{t('ps.toggle.places')}</span><span className="faint t-12">{t('ps.toggle.placesDesc')}</span></span>
          <span onClick={()=>setOnlyPlaces(v=>!v)} style={{width:42,height:24,borderRadius:99,background:onlyPlaces?'var(--green-500)':'var(--bg-2)',position:'relative',transition:'.15s',flex:'none'}}>
            <span style={{position:'absolute',top:3,left:onlyPlaces?21:3,width:18,height:18,borderRadius:99,background:'#fff',transition:'.15s',boxShadow:'var(--sh-1)'}}></span>
          </span>
        </label>
      </div>
      {/* RESULTS */}
      <div className="col gap-16">
        <div className="row between">
          <span className="t-15 w-600 muted">{t('ps.results.count',{n:list.length,s:list.length>1?'s':'',loc:applied.qLoc||'—',sub:applied.qSubject||'—',lvl:applied.qLevel||'—'})}</span>
          <div className="seg"><button className="on">{t('ps.seg.smallGroups')}</button><button>{t('ps.seg.individual')}</button></div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:18}}>
          {list.map(tu=><TutorCard key={tu.id} t={tu} go={go} featured={tu.featured}/>)}
        </div>
        <div className="card pad-20 row between" style={{background:'var(--blue-50)',border:'1px solid var(--blue-100)'}}>
          <span className="row gap-10"><Icon name="users" size={20} style={{color:'var(--blue-700)'}}/><span className="t-14 w-600" style={{color:'var(--blue-800)'}}>{t('ps.banner.visibility')}</span></span>
        </div>
      </div>
    </div>
    <Footer go={go}/>
  </div>;
}

Object.assign(window,{ParentSearch,TutorCard});
