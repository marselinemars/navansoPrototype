/* NAVANSO — Tutor public profile (parent-facing, trust before contact) */

function ProfSection({title, children, id}){
  return <div className="card pad-24 col gap-16" id={id}>
    <h3 style={{fontSize:18}}>{title}</h3>
    {children}
  </div>;
}

function AvailGroupRow({g, go}){
  return <div className="card-flat" style={{padding:16,borderRadius:12,border:'1px solid var(--line)'}}>
    <div className="row between wrap" style={{gap:12}}>
      <div className="col gap-7">
        <div className="row gap-8">
          <span className="w-700 t-15">{g.subject} · {g.level}</span>
          {g.places>0 ? <Places places={g.places} cap={g.cap}/> : <span className="places places-full"><span className="dot"></span>Complet</span>}
        </div>
        <div className="row gap-16 wrap">
          <span className="row gap-6 t-13 muted w-600"><Icon name="calendar" size={14}/>{g.schedule}</span>
          <span className="row gap-6 t-13 muted w-600"><Icon name="pin" size={14}/>{g.loc}</span>
          <span className="row gap-6 t-13 muted w-600"><Icon name="users" size={14}/>{g.mode}</span>
        </div>
        <div className="row gap-10" style={{marginTop:2}}>
          <SeatRow cap={g.cap} students={g.students}/>
          <span className="faint t-12 w-600">{g.students} / {g.cap} élèves · max {g.cap}</span>
        </div>
      </div>
      <Btn variant={g.places>0?'green':'ghost'} size="sm" icon={g.places>0?'wa':'bell'} onClick={()=>g.places>0?go('inquiry','t1'):navToast('Vous serez prévenu·e dès qu\'une place se libère','blue')}>
        {g.places>0?'Contacter l’enseignant':'M’avertir d’une place'}
      </Btn>
    </div>
  </div>;
}

function TutorProfile({go}){
  const isMobile = useIsNarrow();
  const t=NAV.tutor;
  return <div className="screen-anim" style={{minHeight:'100%'}}>
    <MarketingNav go={go} active="parent-search"/>
    {/* back */}
    <div style={{maxWidth:1100,margin:'0 auto',padding:'18px 40px 0'}}>
      <button className="btn btn-ghost btn-sm" onClick={()=>go('parent-search')}><Icon name="arrowl" size={16}/>Retour aux résultats</button>
    </div>
    {/* header */}
    <div style={{maxWidth:1100,margin:'0 auto',padding:'16px 40px 0'}}>
      <div className="card" style={{padding:26,borderRadius:18,display:'flex',gap:22,alignItems:'center',flexWrap:'wrap'}}>
        <Avatar initials={t.initials} cls={t.av} size={84} ring/>
        <div className="col gap-8 grow" style={{minWidth:260}}>
          <div className="row gap-12 wrap" style={{alignItems:'center'}}>
            <h1 style={{fontSize:28}}>{t.name}</h1>
            <Stars rating={t.rating} reviews={t.reviews}/>
            <DemoTag>Note démo</DemoTag>
          </div>
          <div className="row gap-8 wrap">
            <span className="chip chip-blue"><Icon name="book" size={13}/>{t.subjects.join(' · ')}</span>
            <span className="chip chip-gray">{t.levels.join(' · ')}</span>
            <span className="chip chip-gray"><Icon name="pin" size={13}/>{t.wilaya}</span>
            <span className="chip chip-green"><Icon name="users" size={13}/>{t.format}</span>
          </div>
          <div className="row gap-10 wrap" style={{marginTop:4}}>
            {NAV.tutorTrust.map((x,i)=><span key={i} className="badge badge-verified"><Icon name={x.icon==='check'?'checkc':x.icon} size={14}/>{x.label}</span>)}
            <FutureTag icon="shield">Vérification d’identité · à venir</FutureTag>
          </div>
          {(t.price || t.trial) && <div className="row gap-12 wrap" style={{marginTop:8,alignItems:'baseline'}}>
            {t.price && <span className="t-15 w-700">À partir de {t.price.toLocaleString('fr-FR')} DZD<span className="faint t-13 w-600"> / {t.priceUnit||'mois'}</span></span>}
            {t.trial && <span className="chip chip-green w-700"><Icon name="checkc" size={13}/>Séance d'essai gratuite</span>}
          </div>}
        </div>
        <div className="col gap-10" style={{minWidth:200}}>
          <Btn variant="green" icon="wa" block onClick={()=>go('inquiry','t1')}>Contacter via WhatsApp</Btn>
          <Btn variant="ghost" icon="file" block onClick={()=>go('parent-report','r-yacine-mai-2026')}>Voir un exemple de rapport</Btn>
        </div>
      </div>
    </div>
    {/* body grid */}
    <div style={{maxWidth:1100,margin:'0 auto',padding:isMobile?'16px':'20px 40px 64px',display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 320px',gap:isMobile?16:22,alignItems:'start'}}>
      <div className="col gap-18">
        <ProfSection title="À propos de l’enseignante">
          <p className="t-15 lh-15" style={{color:'var(--ink-2)'}}>{t.bio}</p>
          <div className="row gap-20 wrap">
            <div className="row gap-8"><Icon name="clock" size={18} style={{color:'var(--blue-600)'}}/><span className="t-14 w-600">{t.experience}</span></div>
            <div className="row gap-8"><Icon name="users" size={18} style={{color:'var(--green-600)'}}/><span className="t-14 w-600">Groupes de {t.capacity} élèves max</span></div>
          </div>
        </ProfSection>
        <ProfSection title="Matières et niveaux">
          <div className="row gap-16 wrap">
            <div className="card-flat" style={{padding:14,borderRadius:12,border:'1px solid var(--line)',flex:'1 1 200px'}}>
              <span className="t-12 faint w-700" style={{textTransform:'uppercase',letterSpacing:'.04em'}}>Matières</span>
              <div className="row gap-7 wrap" style={{marginTop:8}}>{t.subjects.map(s=><span key={s} className="chip chip-blue">{s}</span>)}</div>
            </div>
            <div className="card-flat" style={{padding:14,borderRadius:12,border:'1px solid var(--line)',flex:'1 1 200px'}}>
              <span className="t-12 faint w-700" style={{textTransform:'uppercase',letterSpacing:'.04em'}}>Niveaux</span>
              <div className="row gap-7 wrap" style={{marginTop:8}}>{t.levels.map(s=><span key={s} className="chip chip-gray">{s}</span>)}</div>
            </div>
          </div>
        </ProfSection>
        <ProfSection title="Groupes disponibles">
          <div className="row gap-10 wrap" style={{alignItems:'center',marginTop:-4}}>
            <FutureTag icon="calendar">Réservation en ligne à venir</FutureTag>
            <span className="faint t-13">Aujourd’hui, le contact se fait via WhatsApp — la réservation et le paiement en ligne sont des fonctionnalités futures.</span>
          </div>
          <div className="col gap-12">
            {NAV.tutorGroups.map(g=><AvailGroupRow key={g.id} g={g} go={go}/>)}
          </div>
        </ProfSection>
        <ProfSection title="Méthode d’enseignement">
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            {t.method.map((m,i)=><div key={i} className="row gap-10" style={{alignItems:'flex-start'}}>
              <div className="icn" style={{width:30,height:30,borderRadius:9,background:'var(--green-50)',color:'var(--green-700)',display:'grid',placeItems:'center',flex:'none'}}><Icon name="check" size={16}/></div>
              <span className="t-14 lh-14" style={{color:'var(--ink-2)',paddingTop:3}}>{m}</span>
            </div>)}
          </div>
        </ProfSection>
        <ProfSection title="Vitrine — preuves fournies par l'enseignante">
          <div className="row gap-10 wrap" style={{alignItems:'center',rowGap:6}}>
            <span className="chip chip-blue w-700"><Icon name="shield" size={13}/>Fourni par l'enseignante</span>
            <span className="faint t-13">Photos, messages et diplômes que l'enseignante a choisi de partager.</span>
          </div>
          <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:12}}>
            {(t.vitrineExterne||[]).map(item=>{
              const iconName = item.type==='whatsapp'?'wa':item.type==='diploma'?'file':item.type==='notebook'?'book':'clipboard';
              const tone = item.type==='whatsapp'?'green':item.type==='diploma'?'blue':'orange';
              const bg = {green:'var(--green-50)',blue:'var(--blue-50)',orange:'var(--orange-50)'}[tone];
              const fg = {green:'var(--green-700)',blue:'var(--blue-700)',orange:'var(--orange-600)'}[tone];
              return <div key={item.id} className="card-flat" style={{padding:14,borderRadius:12,border:'1px solid var(--line)'}}>
                <div className="row gap-10" style={{marginBottom:10}}>
                  <div className="icn" style={{width:34,height:34,borderRadius:10,background:bg,color:fg,display:'grid',placeItems:'center',flex:'none'}}><Icon name={iconName} size={17}/></div>
                  <div className="col" style={{gap:1,minWidth:0}}><span className="w-700 t-14">{item.caption}</span><span className="faint t-11">{item.meta}</span></div>
                </div>
                <p className="t-13 lh-15" style={{color:'var(--ink-2)',background:'var(--bg)',padding:'10px 12px',borderRadius:9,fontStyle:'italic'}}>« {item.preview} »</p>
              </div>;
            })}
          </div>
        </ProfSection>
        <ProfSection title="Avis dans l'application">
          {NAV.testimonials.length===0
            ? <div className="card-flat" style={{padding:14,borderRadius:12,background:'var(--bg)',border:'none',textAlign:'center'}}>
                <span className="muted t-14">Pas encore d'avis dans l'application. Vous serez parmi les premiers à laisser le vôtre après quelques séances.</span>
              </div>
            : <>
              <DemoTag style={{alignSelf:'flex-start'}}>Données démo · témoignages illustratifs</DemoTag>
              <div className="col gap-14">
                {NAV.testimonials.map((x,i)=><div key={i} className="card-flat" style={{padding:16,borderRadius:12,background:'var(--bg)',border:'none'}}>
                  <p className="t-15 lh-15" style={{color:'var(--ink-2)',marginBottom:10}}>“{x.text}”</p>
                  <div className="row gap-10"><Avatar initials={x.initials} cls={x.av} size={32}/><span className="w-700 t-13">{x.name}</span><span className="faint t-12">· {x.role}</span></div>
                </div>)}
              </div>
            </>}
        </ProfSection>
      </div>
      {/* sticky contact rail */}
      <div className="col gap-16" style={{position:'sticky',top:90}}>
        <div className="card pad-20 col gap-14">
          <span className="eyebrow">Contact</span>
          <h3 style={{fontSize:17}}>Prête à suivre votre enfant</h3>
          <div className="card-flat" style={{padding:'14px 14px',borderRadius:12,background:'var(--green-50)',border:'1px solid var(--green-100)'}}>
            <div className="row between wrap" style={{gap:10,rowGap:8}}>
              <span className="t-13 w-600" style={{color:'var(--green-800,var(--green-700))'}}>Groupe Math 4AM</span>
              <Places places={2} cap={8}/>
            </div>
            <p className="t-12 muted" style={{marginTop:8}}>Préparation BEM · Samedi & Mardi</p>
          </div>
          <div className="col gap-10">
            <Btn variant="green" icon="wa" block onClick={()=>go('inquiry','t1')}>Contacter via WhatsApp</Btn>
            <Btn variant="ghost" icon="file" block onClick={()=>go('parent-report')}>Voir un exemple de rapport</Btn>
          </div>
          <p className="faint t-12 lh-14" style={{textAlign:'center',marginTop:2}}>Le contact se fait via WhatsApp — le canal que vous utilisez déjà.</p>
        </div>
      </div>
    </div>
    <Footer go={go}/>
  </div>;
}

Object.assign(window,{TutorProfile});
