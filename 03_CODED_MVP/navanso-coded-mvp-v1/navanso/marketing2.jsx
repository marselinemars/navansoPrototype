/* NAVANSO — Pricing & Roadmap */

function Pricing({go}){
  const isMobile = useIsNarrow();
  const accent={gray:['var(--bg-2)','var(--ink-2)'],blue:['var(--blue-50)','var(--blue-700)'],
    green:['var(--green-50)','var(--green-700)'],orange:['var(--orange-50)','var(--orange-600)']};
  return <div className="screen-anim" style={{minHeight:'100%'}}>
    <MarketingNav go={go} active="pricing"/>
    <div style={{maxWidth:1200,margin:'0 auto',padding:isMobile?'24px 18px 16px':'56px 40px 24px'}}>
      <SecHead center eyebrow="Tarifs" title="Des plans simples, adaptés au marché local"
        desc="Commencez gratuitement. Passez à un plan payant quand vos groupes grandissent. Tarifs en DZD — certains montants sont encore à valider."/>
      <div className="row center" style={{marginTop:18}}>
        <span className="chip chip-orange"><Icon name="flag" size={13}/>Tarifs indicatifs · à valider</span>
      </div>
    </div>
    <div style={{maxWidth:1200,margin:'0 auto',padding:isMobile?'8px 18px 24px':'8px 40px 24px',display:'grid',gridTemplateColumns:isMobile?'1fr':'repeat(4,1fr)',gap:isMobile?14:18,alignItems:'stretch'}}>
      {NAV.plans.map(p=>{
        const [bg,fg]=accent[p.accent];
        return <div key={p.id} className="card" style={{padding:'24px 22px',borderRadius:18,position:'relative',
          display:'flex',flexDirection:'column',gap:16,
          border:p.popular?'1.5px solid var(--blue-600)':'1px solid var(--line)',
          boxShadow:p.popular?'var(--sh-3)':'var(--sh-2)'}}>
          {p.popular && <span className="badge badge-new" style={{position:'absolute',top:-11,left:22,background:'var(--blue-700)',color:'#fff'}}>{p.tag}</span>}
          <div className="col gap-4">
            <span className="chip" style={{background:bg,color:fg,alignSelf:'flex-start'}}>{p.popular?'Recommandé':p.tag}</span>
            {p.id==='center' && <FutureTag icon="grid" style={{alignSelf:'flex-start',marginTop:4}}>Fonctionnalité future</FutureTag>}
            <h3 style={{fontSize:20,marginTop:8}}>{p.name}</h3>
            <p className="muted t-13 lh-14" style={{minHeight:38}}>{p.desc}</p>
          </div>
          <div className="row" style={{alignItems:'baseline',gap:6}}>
            <span className="stat-num" style={{fontSize:32}}>{p.price}</span>
            <span className="faint t-13 w-600">{p.unit}</span>
          </div>
          <Btn variant={p.popular?'primary':'ghost'} block onClick={()=>go(p.id==='center'?'roadmap':'tutor-onboarding')}>{p.cta}</Btn>
          <div className="hr"></div>
          <div className="col gap-10">
            {p.feats.map((f,i)=><div key={i} className="row gap-9" style={{alignItems:'flex-start'}}>
              <Icon name="check" size={16} style={{color:fg,flex:'none',marginTop:2}}/>
              <span className="t-13 lh-14" style={{color:'var(--ink-2)'}}>{f}</span>
            </div>)}
          </div>
        </div>;
      })}
    </div>
    <div style={{maxWidth:1200,margin:'0 auto',padding:'18px 40px 64px'}}>
      <div className="card pad-24 row between wrap" style={{gap:18}}>
        <div className="row gap-14">
          <div className="icn" style={{width:44,height:44,borderRadius:13,background:'var(--green-50)',color:'var(--green-700)',display:'grid',placeItems:'center'}}><Icon name="wa" size={22}/></div>
          <div className="col" style={{gap:2}}><span className="w-700 t-16">Le partage WhatsApp est inclus dans tous les plans</span>
          <span className="muted t-14">Navanso ne remplace pas WhatsApp — il organise le suivi et partage des rapports validés via vos canaux habituels.</span></div>
        </div>
        <Btn variant="soft" iconR="arrow" onClick={()=>go('parent-report')}>Voir un exemple de rapport</Btn>
      </div>
    </div>
    <Footer go={go}/>
  </div>;
}

function Roadmap({go}){
  const isMobile = useIsNarrow();
  const accent={green:['var(--green-50)','var(--green-700)','var(--green-500)'],
    blue:['var(--blue-50)','var(--blue-700)','var(--blue-500)'],
    orange:['var(--orange-50)','var(--orange-600)','var(--orange-500)']};
  return <div className="screen-anim" style={{minHeight:'100%'}}>
    <MarketingNav go={go} active="roadmap"/>
    <div style={{maxWidth:1100,margin:'0 auto',padding:'56px 40px 24px'}}>
      <SecHead center eyebrow="Fonctionnalités futures"
        title="Le produit grandit, mais le cœur reste focalisé"
        desc="Aujourd’hui, Navanso se concentre sur la boucle enseignant–parent : visibilité, gestion des petits groupes et rapports de suivi. Voici la suite."/>
    </div>
    <div style={{maxWidth:1100,margin:'0 auto',padding:isMobile?'12px 18px 24px':'16px 40px 24px',display:'grid',gridTemplateColumns:isMobile?'1fr':'repeat(3,1fr)',gap:isMobile?14:18}}>
      {NAV.roadmap.map((col,ci)=>{
        const [bg,fg,dot]=accent[col.accent];
        return <div key={ci} className="col gap-14">
          <div className="row between">
            <span className="chip" style={{background:bg,color:fg,fontWeight:700}}><span style={{width:7,height:7,borderRadius:99,background:dot}}></span>{col.phase}</span>
            <span className="faint t-12 w-600">{col.when}</span>
          </div>
          {col.items.map((it,i)=>
            <div key={i} className="card pad-20 col gap-7">
              <div className="row gap-10">
                <div style={{width:8,height:8,borderRadius:99,background:dot,flex:'none'}}></div>
                <h3 style={{fontSize:16}}>{it.t}</h3>
              </div>
              <p className="muted t-14 lh-14" style={{paddingLeft:18}}>{it.d}</p>
            </div>)}
        </div>;
      })}
    </div>
    <div style={{maxWidth:1100,margin:'0 auto',padding:'24px 40px 64px'}}>
      <div className="card pad-24 row between wrap" style={{gap:18,background:'var(--blue-50)',border:'1px solid var(--blue-100)'}}>
        <div className="row gap-14">
          <div className="icn" style={{width:44,height:44,borderRadius:13,background:'#fff',color:'var(--blue-700)',display:'grid',placeItems:'center',boxShadow:'var(--sh-1)'}}><Icon name="target" size={22}/></div>
          <div className="col" style={{gap:2}}><span className="w-700 t-16">Le MVP reste centré sur le suivi</span>
          <span className="muted t-14" style={{maxWidth:560}}>Ces fonctionnalités sont une vision, pas le produit d’aujourd’hui. Nous ajoutons d’abord ce qui renforce la confiance et le suivi des petits groupes.</span></div>
        </div>
        <Btn variant="primary" iconR="arrow" onClick={()=>go('dashboard')}>Essayer l’espace enseignant</Btn>
      </div>
    </div>
    <Footer go={go}/>
  </div>;
}

Object.assign(window,{Pricing,Roadmap});
