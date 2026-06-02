/* NAVANSO — Marketing screens: Landing, Pricing, Roadmap */

function MarketingNav({go, active}){
  const isMobile = useIsNarrow();
  const [open, setOpen] = React.useState(false);
  const items=[['landing','Accueil'],['parent-search','Trouver un enseignant'],['pricing','Tarifs'],['roadmap','Vision']];
  if(isMobile){
    return <>
      <div className="mnav" style={{padding:'0 16px',gap:10,height:60}}>
        <div onClick={()=>go('landing')} style={{cursor:'pointer'}}><Logo size={28}/></div>
        <div style={{flex:1}}/>
        <Btn variant="primary" size="sm" icon="user" onClick={()=>go('tutor-onboarding')}>Devenir enseignant</Btn>
        <button className="btn btn-ghost btn-icon" onClick={()=>setOpen(true)} title="Menu"><Icon name="menu" size={18}/></button>
      </div>
      {open && <>
        <div onClick={()=>setOpen(false)} style={{position:'fixed',inset:0,background:'rgba(16,24,40,.45)',zIndex:110}}/>
        <div className="card" style={{position:'fixed',top:0,right:0,bottom:0,width:280,zIndex:120,padding:18,display:'flex',flexDirection:'column',gap:6,borderRadius:0,boxShadow:'var(--sh-4)'}}>
          <div className="row between" style={{marginBottom:8}}>
            <Logo size={28}/>
            <button className="btn btn-ghost btn-icon btn-sm" onClick={()=>setOpen(false)}><Icon name="x" size={16}/></button>
          </div>
          {items.map(([id,l])=><button key={id} className="nav-i" style={{background: active===id?'var(--blue-50)':'transparent',color: active===id?'var(--blue-700)':'var(--ink)',fontWeight:600,textAlign:'left'}} onClick={()=>{setOpen(false);go(id);}}>{l}</button>)}
          <div className="hr" style={{margin:'10px 0'}}/>
          <Btn variant="green" size="sm" icon="search" block onClick={()=>{setOpen(false);go('parent-search');}}>Trouver un enseignant</Btn>
          <Btn variant="primary" size="sm" icon="user" block onClick={()=>{setOpen(false);go('tutor-onboarding');}}>Devenir enseignant</Btn>
          <Btn variant="ghost" size="sm" block onClick={()=>{setOpen(false);go('dashboard');}}>Espace enseignant</Btn>
        </div>
      </>}
    </>;
  }
  return <div className="mnav">
    <div onClick={()=>go('landing')} style={{cursor:'pointer'}}><Logo size={34}/></div>
    <div className="row gap-6" style={{marginLeft:18}}>
      {items.map(([id,l])=><a key={id} className="link" onClick={()=>go(id)}
        style={active===id?{color:'var(--blue-700)'}:{}}>{l}</a>)}
    </div>
    <div className="row gap-10" style={{marginLeft:'auto'}}>
      <Btn variant="ghost" size="sm" onClick={()=>go('dashboard')}>Espace enseignant</Btn>
      <Btn variant="green" size="sm" icon="search" onClick={()=>go('parent-search')}>Trouver un enseignant</Btn>
      <Btn variant="primary" size="sm" icon="user" onClick={()=>go('tutor-onboarding')}>Devenir enseignant</Btn>
    </div>
  </div>;
}

/* ---- mini dashboard preview used in hero ---- */
function HeroPreview(){
  return <div className="card" style={{padding:18, borderRadius:20, boxShadow:'var(--sh-3)', position:'relative', overflow:'hidden'}}>
    <div className="row between" style={{marginBottom:14,gap:10}}>
      <div className="row gap-10" style={{minWidth:0}}>
        <Avatar initials="AB" cls="av-b" size={36}/>
        <div className="col" style={{gap:1,minWidth:0}}>
          <span className="w-700 t-14" style={{whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>Math 4AM — Préparation BEM</span>
          <span className="faint t-12">Samedi & Mardi · Ouargla</span>
        </div>
      </div>
      <div style={{flex:'none'}}><Places places={2} cap={8}/></div>
    </div>
    <div className="row gap-8" style={{marginBottom:14}}>
      <SeatRow cap={8} students={6}/>
      <span className="faint t-12 w-600" style={{marginLeft:2}}>6 / 8 élèves</span>
    </div>
    <div className="card-flat" style={{padding:14, background:'var(--bg)', border:'none'}}>
      <div className="row between" style={{marginBottom:10}}>
        <div className="row gap-8"><Avatar initials="YB" cls="av-o" size={28}/><span className="w-700 t-13">Yacine — Rapport de suivi</span></div>
        <span className="badge badge-verified" style={{fontSize:11,padding:'3px 7px'}}><Icon name="checkc" size={12}/>Validé</span>
      </div>
      <div className="row gap-10" style={{marginBottom:10}}>
        <div className="grow">
          <div className="row between t-12 muted w-600" style={{marginBottom:5}}><span>Présence</span><span className="w-700" style={{color:'var(--green-700)'}}>87%</span></div>
          <Bar pct={87}/>
        </div>
        <div className="grow">
          <div className="row between t-12 muted w-600" style={{marginBottom:5}}><span>Dernière note</span><span className="w-700" style={{color:'var(--blue-700)'}}>12/20</span></div>
          <Bar pct={60} tone="blue"/>
        </div>
      </div>
      <div className="col gap-6">
        <span className="t-11 w-700 faint" style={{letterSpacing:'.05em',textTransform:'uppercase',fontSize:10.5}}>Points faibles</span>
        <div className="row gap-6 wrap">
          <span className="chip chip-weak" style={{fontSize:11.5,padding:'4px 9px'}}>Signes</span>
          <span className="chip chip-weak" style={{fontSize:11.5,padding:'4px 9px'}}>Problèmes</span>
          <span className="chip chip-weak" style={{fontSize:11.5,padding:'4px 9px'}}>Fractions</span>
        </div>
      </div>
    </div>
    <div className="row gap-8" style={{marginTop:12}}>
      <div className="chip chip-green" style={{fontWeight:700}}><Icon name="trend" size={13}/>+3 pts ce mois</div>
      <div className="chip chip-blue"><Icon name="wa" size={13}/>Partagé aux parents</div>
    </div>
  </div>;
}

function FeatureCard({icon, tone, title, items, kicker}){
  const bg={blue:'var(--blue-50)',green:'var(--green-50)',orange:'var(--orange-50)'}[tone];
  const fg={blue:'var(--blue-700)',green:'var(--green-700)',orange:'var(--orange-600)'}[tone];
  return <div className="card pad-24 col gap-14" style={{height:'100%'}}>
    <div className="icn" style={{width:44,height:44,borderRadius:13,background:bg,color:fg,display:'grid',placeItems:'center'}}>
      <Icon name={icon} size={22}/>
    </div>
    {kicker && <span className="eyebrow" style={{color:fg}}>{kicker}</span>}
    <h3 style={{fontSize:19}}>{title}</h3>
    <div className="col gap-9">
      {items.map((t,i)=><div key={i} className="row gap-9" style={{alignItems:'flex-start'}}>
        <Icon name="check" size={17} style={{color:fg,flex:'none',marginTop:1}}/>
        <span className="t-14 muted lh-14">{t}</span>
      </div>)}
    </div>
  </div>;
}

/* ============================================================
   NavHero — the integrated isolated hero (B15.4).
   Pure-CSS orbital composition. The styles live under .nv-hero
   / .nvh-* in styles.css, namespaced so they can't collide with
   the rest of the design system. SVG icons are inlined here so
   the component remains self-contained.
   ============================================================ */
function NavHero({go}){
  return <section className="nv-hero">
    <div className="nvh-bg base"></div>
    <div className="nvh-bg color"></div>
    <div className="nvh-bg aurora"></div>
    <div className="nvh-inner">
      {/* LEFT — message */}
      <div className="nvh-copy">
        <span className="nvh-eyebrow nvh-up">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z"/><path d="M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/></svg>
          Soutien scolaire en Algérie
        </span>
        <h1 className="nvh-h1 nvh-up d1">
          Une seule boucle entre le <span className="g">parent</span> et l'<span className="b">enseignant</span>.
        </h1>
        <p className="nvh-lede nvh-up d2">
          Chaque séance nourrit un suivi clair pour l'élève : présence, progrès et rapports validés — partagés là où les parents sont déjà, sur WhatsApp.
        </p>
        <div className="nvh-points nvh-up d3">
          <span className="nvh-point">
            <svg viewBox="0 0 24 24" fill="none" stroke="#2456B5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M16 18v-1.5a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4V18"/><path d="M9 9.5A3.25 3.25 0 1 0 9 3a3.25 3.25 0 0 0 0 6.5Z"/><path d="M22 18v-1.5a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            Groupes &lt; 10 élèves
          </span>
          <span className="nvh-point">
            <svg viewBox="0 0 24 24" fill="none" stroke="#1F8A6D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z"/><path d="M9.5 12l1.8 1.8L15 10"/></svg>
            Rapports validés
          </span>
        </div>
        <div className="nvh-cta nvh-up d4">
          <button className="nvh-btn green" onClick={()=>go('parent-search')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"/><path d="M21 21l-4.3-4.3"/></svg>
            Trouver un enseignant
          </button>
          <button className="nvh-btn primary" onClick={()=>go('tutor-onboarding')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 20v-2a5 5 0 0 0-5-5H9a5 5 0 0 0-5 5v2"/><path d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"/></svg>
            Devenir enseignant
          </button>
        </div>
      </div>
      {/* RIGHT — orbital loop */}
      <div className="nvh-orbit nvh-up d5">
        <div className="nvh-glow"></div>
        <div className="nvh-ring"></div>
        <div className="nvh-ring-dash"></div>
        <div className="nvh-bead"><i></i></div>
        {/* Center = the student (the Navanso mark anchored at the middle).
            The caption is removed — the orbital composition already conveys
            that the student (logo) is at the centre of the loop. */}
        <div className="nvh-center">
          <div className="disc">
            <div className="halo"></div>
            <img className="nvh-logo" src="assets/navanso-mark.png" alt="Navanso"/>
          </div>
        </div>
        {/* PARENT node */}
        <div className="nvh-node parent">
          <div className="nbg"></div>
          <div className="card">
            <div className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20s-7-4.5-9-9a4.5 4.5 0 0 1 8-3 4.5 4.5 0 0 1 8 3c-1.5 4.5-7 9-7 9Z"/></svg></div>
            <div className="tx"><b>Le parent</b><span>voit les progrès</span></div>
          </div>
        </div>
        {/* TEACHER node */}
        <div className="nvh-node teacher">
          <div className="nbg"></div>
          <div className="card">
            <div className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M16 18v-1.5a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4V18"/><path d="M9 9.5A3.25 3.25 0 1 0 9 3a3.25 3.25 0 0 0 0 6.5Z"/><path d="M22 18v-1.5a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
            <div className="tx"><b>L'enseignant</b><span>gère ses groupes</span></div>
          </div>
        </div>
        {/* WhatsApp report node */}
        <div className="nvh-node report">
          <div className="nbg"></div>
          <div className="card">
            <div className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a9 9 0 0 0-7.7 13.6L3 21l4.5-1.2A9 9 0 1 0 12 3Z"/><path d="M9 8.5c.2-.5.4-.5.6-.5h.5c.2 0 .4 0 .6.5l.7 1.6c.1.2.1.4 0 .6l-.5.7c-.1.2-.2.3 0 .6a6 6 0 0 0 2.7 2.4c.3.2.5.1.6 0l.7-.8c.2-.2.3-.2.6-.1l1.6.8c.2.1.3.2.3.4 0 .6-.4 1.4-1.2 1.6-.8.2-1.8.2-3.6-.7a9 9 0 0 1-3.7-3.6c-.6-1.1-.8-2-.7-2.6Z"/></svg></div>
            <div className="tx"><b>Rapport partagé</b><span>validé · WhatsApp</span></div>
          </div>
        </div>
        {/* progress chip */}
        <span className="nvh-chip">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 17l6-6 4 4 7-7"/><path d="M14 8h6v6"/></svg>
          +3 pts
        </span>
      </div>
    </div>
  </section>;
}

/* ============================================================
   (Legacy) BrandBridge — kept in case we want to reuse the
   trinity composition later. Not rendered by Landing anymore.
   ============================================================ */
function BrandBridge({isMobile}){
  const avSize = isMobile ? 54 : 68;
  const markSize = isMobile ? 86 : 116;
  // The "card" widths are flexible — on mobile the three figures stack vertically.
  if(isMobile){
    return <div className="col" style={{alignItems:'center',gap:14,maxWidth:340,margin:'0 auto'}}>
      {/* Mark + brand */}
      <div className="col" style={{alignItems:'center',gap:4}}>
        <div className="mark" style={{width:markSize,height:markSize,boxShadow:'0 8px 28px rgba(30,58,138,.14), inset 0 0 0 1px var(--line-2)',borderRadius:22,background:'#fff',display:'grid',placeItems:'center'}}>
          <img src="assets/navanso-mark.png" alt="Navanso" style={{width:'86%',height:'86%',objectFit:'contain'}}/>
        </div>
        <span style={{fontFamily:'var(--font-d)',fontWeight:800,letterSpacing:'-.02em',fontSize:28,color:'var(--blue-700)'}}>Navanso</span>
        <span style={{color:'var(--green-600)',fontWeight:600,fontSize:12}}>Nous progressons, ensemble.</span>
      </div>
      {/* Vertical bridge: three rows with downward arrows */}
      <BridgeFigure tone="green" label="Le parent" name="Mme Benali" avInitials="MB" avCls="av-g" caption="Reçoit le rapport" iconName="heart" size={avSize}/>
      <Connector vertical/>
      <BridgeFigure tone="orange" label="L'élève" name="Yacine, 4AM" avInitials="YB" avCls="av-o" caption="Au centre" iconName="users" size={avSize} central/>
      <Connector vertical/>
      <BridgeFigure tone="blue" label="L'enseignant" name="Mme Amina" avInitials="AB" avCls="av-b" caption="Envoie le rapport" iconName="user" size={avSize}/>
    </div>;
  }
  // Desktop: horizontal scene
  return <div style={{position:'relative',maxWidth:920,margin:'0 auto'}}>
    {/* Mark + brand above the bridge */}
    <div className="col" style={{alignItems:'center',gap:4,marginBottom:30}}>
      <div className="mark" style={{width:markSize,height:markSize,boxShadow:'0 10px 32px rgba(30,58,138,.14), inset 0 0 0 1px var(--line-2)',borderRadius:26,background:'#fff',display:'grid',placeItems:'center'}}>
        <img src="assets/navanso-mark.png" alt="Navanso" style={{width:'86%',height:'86%',objectFit:'contain'}}/>
      </div>
      <span style={{fontFamily:'var(--font-d)',fontWeight:800,letterSpacing:'-.02em',fontSize:32,color:'var(--blue-700)',marginTop:6}}>Navanso</span>
      <span style={{color:'var(--green-600)',fontWeight:600,fontSize:13}}>Nous progressons, ensemble.</span>
    </div>
    {/* Horizontal trinity */}
    <div style={{display:'grid',gridTemplateColumns:'1fr auto 1fr auto 1fr',gap:0,alignItems:'center'}}>
      <BridgeFigure tone="green"  label="Le parent"     name="Mme Benali" avInitials="MB" avCls="av-g" caption="Reçoit le rapport"  iconName="heart" size={avSize} align="right"/>
      <Connector caption="Rapport · WhatsApp" direction="right" tone="green"/>
      <BridgeFigure tone="orange" label="L'élève"      name="Yacine, 4AM" avInitials="YB" avCls="av-o" iconName="users" size={avSize} central/>
      <Connector caption="Suivi · présence" direction="left" tone="blue"/>
      <BridgeFigure tone="blue"   label="L'enseignant"  name="Mme Amina" avInitials="AB" avCls="av-b" caption="Envoie le rapport"  iconName="user" size={avSize} align="left"/>
    </div>
  </div>;
}

function BridgeFigure({tone, label, name, avInitials, avCls, caption, iconName, size, central, align}){
  const fg = tone==='green'?'var(--green-700)':tone==='blue'?'var(--blue-700)':'var(--orange-600)';
  const bg = tone==='green'?'var(--green-50)':tone==='blue'?'var(--blue-50)':'var(--orange-50)';
  const border = tone==='green'?'var(--green-100)':tone==='blue'?'var(--blue-100)':'var(--orange-100)';
  // Each figure: chip label on top, avatar in the middle, name below, optional caption.
  return <div className="col" style={{alignItems:align==='left'?'flex-start':align==='right'?'flex-end':'center',gap:6,textAlign:align==='left'?'left':align==='right'?'right':'center'}}>
    <span className="chip w-700" style={{background:bg,color:fg,border:'1px solid '+border,fontSize:11.5,padding:'4px 10px'}}><Icon name={iconName} size={12}/>{label}</span>
    <div style={{position:'relative'}}>
      <Avatar initials={avInitials} cls={avCls} size={size} ring/>
      {central && <span style={{position:'absolute',right:-6,bottom:-6,background:'#fff',borderRadius:99,padding:3,boxShadow:'var(--sh-2)'}}>
        <Icon name="star" size={14} style={{color:'var(--orange-500)',fill:'var(--orange-500)'}}/>
      </span>}
    </div>
    <span className="w-700 t-13" style={{color:'var(--ink)'}}>{name}</span>
    {caption && <span className="faint t-11">{caption}</span>}
  </div>;
}

function Connector({caption, direction, tone, vertical}){
  const color = tone==='green'?'var(--green-500)':tone==='blue'?'var(--blue-500)':'var(--faint)';
  if(vertical){
    return <div className="col" style={{alignItems:'center',gap:2,padding:'2px 0'}}>
      <div style={{width:2,height:18,background:`linear-gradient(${color}, var(--line))`,borderRadius:2}}></div>
      <Icon name="arrow" size={14} style={{color, transform:'rotate(90deg)'}}/>
    </div>;
  }
  return <div className="col" style={{alignItems:'center',gap:6,padding:'0 12px',minWidth:130}}>
    {caption && <span className="t-11 w-700 faint" style={{textTransform:'uppercase',letterSpacing:'.04em',color}}>{caption}</span>}
    <div style={{position:'relative',width:'100%',height:2}}>
      <div style={{position:'absolute',inset:0,background:`linear-gradient(${direction==='left'?'to left':'to right'}, transparent, ${color}, transparent)`,borderRadius:2}}></div>
      <Icon name="arrow" size={16} style={{position:'absolute',top:-7,[direction==='left'?'left':'right']:0,color,transform:direction==='left'?'rotate(180deg)':'none',background:'var(--bg)',borderRadius:99,padding:0}}/>
    </div>
  </div>;
}

function Landing({go}){
  const isMobile = useIsNarrow();
  return <div className="screen-anim" style={{background:'var(--bg)',minHeight:'100%'}}>
    <MarketingNav go={go} active="landing"/>

    {/* HERO — new isolated design (B15.4). Namespaced .nv-hero CSS lives
        in styles.css. Orbit composition: logo at center as the student,
        floating parent/teacher/report nodes around. Pure CSS animations. */}
    <NavHero go={go}/>

    {/* APERÇU — the dashboard preview, now its own section.
        Subtle continuation of the hero's color palette so the seam between
        hero and content disappears. The radials echo the hero's warm tones
        but at a much lower opacity. */}
    <div style={{position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',inset:0,pointerEvents:'none',
        background:'radial-gradient(700px 380px at 10% 0%, rgba(46,168,108,.10), transparent 60%), radial-gradient(700px 380px at 92% 100%, rgba(58,118,232,.10), transparent 60%)'}}></div>
      <div style={{position:'relative',maxWidth:1200,margin:'0 auto',padding:isMobile?'24px 18px 36px':'56px 40px 56px'}}>
        <SecHead center eyebrow="Aperçu de la plateforme"
          title="Le suivi côté enseignant, le rapport côté parent"
          desc="L'enseignant gère ses groupes et ses séances ; le parent reçoit un rapport clair et validé. Tout est lié."/>
        <div style={{marginTop:isMobile?22:36,maxWidth:560,marginLeft:'auto',marginRight:'auto'}}>
          <HeroPreview/>
        </div>
      </div>
    </div>

    {/* TRUST STRIP */}
    <div style={{borderTop:'1px solid var(--line)',borderBottom:'1px solid var(--line)',background:'#fff'}}>
      <div style={{maxWidth:1200,margin:'0 auto',padding:'22px 40px',display:'flex',gap:40,flexWrap:'wrap',justifyContent:'space-between'}}>
        {[['Trouvez un petit groupe de confiance','users'],['Suivez les progrès réels','trend'],['Recevez des rapports clairs','file'],['Partagez via WhatsApp','wa']].map(([t,ic],i)=>
          <div key={i} className="row gap-10"><Icon name={ic} size={20} style={{color:'var(--blue-600)'}}/><span className="w-600 t-15">{t}</span></div>)}
      </div>
    </div>

    {/* AVANT / AVEC NAVANSO */}
    <div style={{maxWidth:1200,margin:'0 auto',padding:'56px 40px 8px'}}>
      <SecHead center eyebrow="Le changement"
        title="Avant Navanso, et avec Navanso"
        desc="Navanso ne remplace pas la façon de travailler de l’enseignant — il structure ce qui existe déjà et le rend lisible pour le parent."/>
      <div className="cmp" style={{marginTop:36,display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr'}}>
        <div className="cmp-col cmp-before">
          <div className="row between" style={{marginBottom:10}}>
            <span className="w-800 t-16" style={{color:'var(--ink-2)'}}>Avant Navanso</span>
            <span className="chip chip-gray">Aujourd’hui</span>
          </div>
          {['Cahier papier difficile à retrouver','Messages WhatsApp dispersés','Remarques surtout verbales','Suivi des progrès difficile à reconstituer'].map((t,i)=>
            <div key={i} className="cmp-row">
              <span className="ci" style={{background:'#fff',color:'var(--faint)'}}><Icon name="x" size={13}/></span>
              <span className="t-14 lh-14" style={{color:'var(--muted)'}}>{t}</span>
            </div>)}
        </div>
        <div className="cmp-col cmp-after">
          <div className="row between" style={{marginBottom:10}}>
            <span className="w-800 t-16" style={{color:'var(--blue-800,var(--blue-700))'}}>Avec Navanso</span>
            <span className="chip chip-blue">Le prototype</span>
          </div>
          {['Historique élève structuré, séance après séance','Rapport parent clair et validé','WhatsApp enrichi par un rapport validé','Progrès visibles dans le temps'].map((t,i)=>
            <div key={i} className="cmp-row">
              <span className="ci" style={{background:'var(--green-600)',color:'#fff'}}><Icon name="check" size={13}/></span>
              <span className="t-14 lh-14" style={{color:'var(--ink)'}}>{t}</span>
            </div>)}
        </div>
      </div>
    </div>

    {/* FOR TUTORS / FOR PARENTS */}
    <div style={{maxWidth:1200,margin:'0 auto',padding:'64px 40px 20px'}}>
      <SecHead center eyebrow="Une plateforme, deux côtés"
        title="Le suivi qui relie l’enseignant et le parent"
        desc="Navanso n’est pas une application scolaire générique. C’est une plateforme de confiance et de suivi pour le soutien en petits groupes."/>
      <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:isMobile?16:22,marginTop:isMobile?28:38}}>
        <FeatureCard tone="blue" icon="users" kicker="Pour les enseignants" title="Organisez vos petits groupes"
          items={['Profil professionnel : matières, niveaux, lieu, horaires, capacité.','Gérez les groupes, la présence et les évaluations.','Identifiez les points faibles de chaque élève.','Réduisez les messages répétitifs aux parents.']}/>
        <FeatureCard tone="green" icon="heart" kicker="Pour les parents" title="Comprenez les progrès réels"
          items={['Découvrez des enseignants de confiance près de chez vous.','Voyez la taille du groupe et les places disponibles.','Suivez si votre enfant progresse vraiment.','Recevez des recommandations claires pour la maison.']}/>
      </div>
    </div>

    {/* SMALL GROUP + REPORTS + ASSISTANT */}
    <div style={{maxWidth:1200,margin:'0 auto',padding:isMobile?'24px 18px 8px':'40px 40px 8px',display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr 1fr',gap:isMobile?16:22}}>
      <FeatureCard tone="blue" icon="grid" title="Petits groupes lisibles"
        items={['Capacité maximale claire pour chaque groupe.','Places disponibles visibles avant le contact.','Moins de 10 élèves pour un meilleur suivi.']}/>
      <FeatureCard tone="green" icon="file" title="Rapports & suivi"
        items={['Présence, dernière note, points faibles.','Recommandations concrètes pour la maison.','Historique des rapports conservé.']}/>
      <FeatureCard tone="orange" icon="sparkle" title="Assistant de rédaction"
        items={['Aide à reformuler les observations de l’enseignant.','Toujours relu et validé par l’enseignant.','L’enseignant reste au contrôle, jamais remplacé.']}/>
    </div>

    {/* ASSISTANT CLARIFICATION BANNER */}
    <div style={{maxWidth:1200,margin:'40px auto 0',padding:'0 40px'}}>
      <div className="card" style={{padding:'24px 28px',borderRadius:18,background:'linear-gradient(100deg, var(--blue-50), #fff 70%)',border:'1px solid var(--blue-100)',display:'flex',gap:18,alignItems:'center',flexWrap:'wrap'}}>
        <div className="icn" style={{width:48,height:48,borderRadius:14,background:'#fff',color:'var(--blue-700)',display:'grid',placeItems:'center',boxShadow:'var(--sh-1)',flex:'none'}}><Icon name="shield" size={24}/></div>
        <div className="grow" style={{minWidth:280}}>
          <h3 style={{fontSize:18,marginBottom:4}}>L’assistant aide, l’enseignant décide</h3>
          <p className="muted t-15 lh-14">Navanso peut aider à reformuler les observations en un rapport clair. Chaque rapport est relu et validé par l’enseignant avant l’envoi — aucune évaluation automatique.</p>
        </div>
        <ValidSeal/>
      </div>
    </div>

    {/* THE LOOP — 4 cartes en first-person, le parcours parent.
        B17.1: refonte selon le feedback de conception. La séance d'essai
        remplace l'ancien doublon "consulte le profil" pour ancrer la
        confiance avant l'engagement. */}
    <div style={{maxWidth:1200,margin:'0 auto',padding:'64px 40px 20px'}}>
      <SecHead center eyebrow="Le parcours, vu par le parent"
        title="De la recherche d’un enseignant à la preuve du progrès"
        desc="Quatre étapes simples — chacune renforce la confiance avant la suivante."/>
      <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr 1fr':'repeat(4,1fr)',gap:16,marginTop:isMobile?24:36}}>
        {[['search','Je trouve un enseignant','Près de chez moi, avec la taille du groupe et les places restantes visibles avant le contact.','green'],
          ['checkc','Je demande une séance d’essai','Avant de m’engager, je rencontre l’enseignant — souvent gratuitement.','orange'],
          ['clipboard','L’enseignant suit mon enfant','Présence, évaluations et points faibles enregistrés après chaque séance.','blue'],
          ['file','Je reçois un rapport clair','Validé par l’enseignant et partagé via WhatsApp — je sais ce qui progresse.','green']].map(([ic,t,d,tn],i)=>
          <div key={i} className="card pad-20 col gap-12" style={{position:'relative'}}>
            <div className="row between">
              <div className="icn" style={{width:40,height:40,borderRadius:11,background:`var(--${tn==='orange'?'orange':tn==='green'?'green':'blue'}-50)`,color:`var(--${tn==='orange'?'orange-600':tn==='green'?'green-700':'blue-700'})`,display:'grid',placeItems:'center'}}><Icon name={ic} size={20}/></div>
              <span className="stat-num faint" style={{fontSize:26,opacity:.4}}>{i+1}</span>
            </div>
            <h3 style={{fontSize:16}}>{t}</h3>
            <p className="muted t-14 lh-14">{d}</p>
          </div>)}
      </div>
    </div>

    {/* TESTIMONIALS */}
    <div style={{maxWidth:1200,margin:'0 auto',padding:'56px 40px 20px'}}>
      <div className="row between wrap" style={{marginBottom:18,gap:12}}>
        <h2 style={{fontSize:24}}>Ce que disent les parents</h2>
        <DemoTag>Données démo · témoignages illustratifs</DemoTag>
      </div>
      <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:isMobile?16:22}}>
        {NAV.testimonials.map((t,i)=>
          <div key={i} className="card pad-24 col gap-14">
            <Icon name="star" size={20} style={{color:'var(--orange-500)',fill:'var(--orange-500)'}}/>
            <p className="t-17 lh-15" style={{fontSize:17,color:'var(--ink-2)'}}>“{t.text}”</p>
            <div className="row gap-10"><Avatar initials={t.initials} cls={t.av} size={38}/>
              <div className="col" style={{gap:1}}><span className="w-700 t-14">{t.name}</span><span className="faint t-13">{t.role}</span></div>
            </div>
          </div>)}
      </div>
    </div>

    {/* CTA — balanced both audiences */}
    <div style={{maxWidth:1200,margin:'0 auto',padding:isMobile?'24px 18px 48px':'40px 40px 72px'}}>
      <div style={{borderRadius:24,padding:isMobile?'32px 22px':'52px 48px',background:'linear-gradient(120deg, var(--blue-800), var(--green-700))',color:'#fff',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',right:-40,top:-40,width:280,height:280,borderRadius:'50%',background:'rgba(255,255,255,.06)'}}></div>
        <div style={{position:'relative',maxWidth:820,textAlign:'center',margin:'0 auto'}}>
          <h2 style={{color:'#fff',fontSize:isMobile?26:34,lineHeight:1.15,marginBottom:14}}>Le suivi qui relie l'enseignant et le parent.</h2>
          <p style={{color:'rgba(255,255,255,.85)',fontSize:isMobile?15:17,marginBottom:isMobile?22:30,maxWidth:600,marginLeft:'auto',marginRight:'auto'}}>Que vous soyez parent à la recherche d'un enseignant de confiance ou enseignant qui veut mieux organiser son suivi, Navanso vous accompagne.</p>
          <div className="row gap-12 wrap" style={{justifyContent:'center'}}>
            <Btn variant="green" size="lg" icon="search" onClick={()=>go('parent-search')}>Trouver un enseignant</Btn>
            <Btn variant="primary" size="lg" icon="user" onClick={()=>go('tutor-onboarding')} style={{background:'#fff',color:'var(--blue-700)',borderColor:'#fff'}}>Devenir enseignant</Btn>
          </div>
        </div>
      </div>
    </div>

    <Footer go={go}/>
  </div>;
}

function Footer({go}){
  /* Minimal footer — the header already carries the navigation, so the
     footer just anchors the brand and shows a copyright line. */
  return <div style={{borderTop:'1px solid var(--line)',background:'#fff'}}>
    <div style={{maxWidth:1200,margin:'0 auto',padding:'28px 40px',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:16}}>
      <Logo size={32} sub/>
      <span className="faint t-13">© 2026 Navanso. Tous droits réservés.</span>
    </div>
  </div>;
}

Object.assign(window,{Landing,MarketingNav,Footer,HeroPreview,FeatureCard});
