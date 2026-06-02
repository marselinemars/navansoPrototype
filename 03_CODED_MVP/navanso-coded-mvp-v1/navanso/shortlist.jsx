/* NAVANSO — Présélection (parent shortlist + comparison).
   Parents in Algeria typically compare 2-3 tutors (often via phone/WhatsApp)
   before deciding. This screen surfaces that real behavior. */

function Shortlist({go}){
  useStore();
  const isMobile = useIsNarrow();
  const ids = Nav.shortlistAll();
  const tutors = ids.map(id=>Nav.tutorById(id)).filter(Boolean);
  const empty = tutors.length===0;

  const rows = [
    {key:'price',    label:'Tarif',         fn:t=>t.price?`${t.price.toLocaleString('fr-FR')} DZD / ${t.priceUnit||'mois'}`:'—'},
    {key:'places',   label:'Places',        fn:t=>t.places>0?`${t.places} disponible${t.places>1?'s':''}`:'Complet'},
    {key:'capacity', label:'Taille max',    fn:t=>`${t.cap} élèves`},
    {key:'mode',     label:'Format',        fn:t=>t.mode||'—'},
    {key:'commune',  label:'Localisation',  fn:t=>t.commune||t.loc||'—'},
    {key:'rating',   label:'Note',          fn:t=>`${t.rating} (${t.reviews} avis)`},
    {key:'trial',    label:'Séance d\'essai',fn:t=>t.trial?'✓ Oui':'—'},
  ];

  return <div className="screen-anim" style={{minHeight:'100%',background:'var(--bg)'}}>
    <MarketingNav go={go} active="parent-search"/>
    <div style={{maxWidth:1100,margin:'0 auto',padding:isMobile?'20px 16px 60px':'32px 40px 80px'}}>
      <button className="btn btn-ghost btn-sm" onClick={()=>go('parent-search')} style={{marginBottom:14}}>
        <Icon name="arrowl" size={16}/>Retour à la recherche
      </button>
      <div className="col gap-6" style={{marginBottom:isMobile?20:28}}>
        <span className="eyebrow" style={{color:'var(--green-700)'}}>Présélection</span>
        <h1 style={{fontSize:isMobile?26:34,lineHeight:1.1}}>Mes enseignants sauvegardés</h1>
        <p className="muted t-15 lh-15" style={{maxWidth:640}}>
          Comparez vos candidats avant de décider. Vous pouvez d'abord en appeler plusieurs via WhatsApp, puis demander une séance d'essai chez celui qui vous convient.
        </p>
      </div>

      {empty ? (
        <div className="card pad-24 col center" style={{gap:14,textAlign:'center',padding:'56px 24px'}}>
          <Icon name="heart" size={32} style={{color:'var(--faint)'}}/>
          <span className="w-700 t-16">Aucun enseignant sauvegardé</span>
          <span className="muted t-14" style={{maxWidth:340}}>Touchez le cœur sur la carte d'un enseignant pour l'ajouter à votre présélection.</span>
          <Btn variant="green" icon="search" onClick={()=>go('parent-search')}>Trouver un enseignant</Btn>
        </div>
      ) : (
        <div className="col gap-18">
          {isMobile ? (
            /* Mobile — stacked comparison cards, no horizontal scroll. */
            <div className="col gap-14">
              {tutors.map(t=> (
                <div key={t.id} className="card" style={{padding:16}}>
                  <div className="row gap-10" style={{marginBottom:12}}>
                    <Avatar initials={t.initials} cls={t.av} size={42}/>
                    <div className="col" style={{gap:1,minWidth:0,flex:1}}>
                      <span className="w-700 t-15">{t.name}</span>
                      <span className="faint t-12">{t.subject} · {t.level}</span>
                    </div>
                  </div>
                  <div className="col">
                    {rows.map(r=> (
                      <div key={r.key} className="row between" style={{padding:'8px 0',borderBottom:'1px solid var(--line-2)',gap:10}}>
                        <span className="t-11 faint w-700" style={{textTransform:'uppercase',letterSpacing:'.04em'}}>{r.label}</span>
                        <span className="t-13 w-600" style={{color:'var(--ink-2)',textAlign:'right'}}>{r.fn(t)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="col gap-8" style={{marginTop:12}}>
                    <Btn variant="green" size="sm" icon="wa" block onClick={()=>go('inquiry', t.id)}>Contacter</Btn>
                    <Btn variant="ghost" size="sm" iconR="arrow" block onClick={()=>go('tutor-profile', t.id)}>Voir profil</Btn>
                    <button className="t-12 w-700" style={{background:'none',border:'none',color:'var(--alert)',cursor:'pointer',padding:'4px 0'}}
                      onClick={()=>{Nav.shortlistToggle(t.id); navToast('Retiré de votre présélection','blue');}}>
                      Retirer de la présélection
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Desktop — side-by-side comparison table. */
            <div className="card" style={{overflow:'auto',padding:0}}>
              <table className="tbl">
                <thead>
                  <tr>
                    <th style={{minWidth:140}}></th>
                    {tutors.map(t=> <th key={t.id} style={{minWidth:180,verticalAlign:'top'}}>
                      <div className="col gap-7" style={{padding:'8px 0'}}>
                        <div className="row gap-10">
                          <Avatar initials={t.initials} cls={t.av} size={36}/>
                          <div className="col" style={{gap:1,minWidth:0}}>
                            <span className="w-700 t-14">{t.name}</span>
                            <span className="faint t-12">{t.subject} · {t.level}</span>
                          </div>
                        </div>
                      </div>
                    </th>)}
                  </tr>
                </thead>
                <tbody>
                  {rows.map(r=> <tr key={r.key}>
                    <td className="t-12 faint w-700" style={{textTransform:'uppercase',letterSpacing:'.04em',width:140}}>{r.label}</td>
                    {tutors.map(t=> <td key={t.id} className="t-14 w-600">{r.fn(t)}</td>)}
                  </tr>)}
                  <tr>
                    <td></td>
                    {tutors.map(t=> <td key={t.id}>
                      <div className="col gap-7" style={{padding:'10px 0'}}>
                        <Btn variant="green" size="sm" icon="wa" onClick={()=>go('inquiry', t.id)}>Contacter</Btn>
                        <Btn variant="ghost" size="sm" iconR="arrow" onClick={()=>go('tutor-profile', t.id)}>Voir profil</Btn>
                        <button className="t-12 w-700" style={{background:'none',border:'none',color:'var(--alert)',cursor:'pointer',padding:'4px 0'}}
                          onClick={()=>{Nav.shortlistToggle(t.id); navToast('Retiré de votre présélection','blue');}}>
                          Retirer
                        </button>
                      </div>
                    </td>)}
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Tip card (shared mobile + desktop) */}
          <div className="card pad-18 row gap-12" style={{background:'var(--blue-50)',border:'1px solid var(--blue-100)',alignItems:'flex-start'}}>
            <div className="icn" style={{width:36,height:36,borderRadius:10,background:'#fff',color:'var(--blue-700)',display:'grid',placeItems:'center',flex:'none'}}><Icon name="wa" size={17}/></div>
            <div className="col" style={{gap:4}}>
              <span className="w-700 t-14" style={{color:'var(--blue-800)'}}>Conseil — appelez d'abord</span>
              <p className="t-13 lh-14" style={{color:'var(--blue-900)'}}>
                Beaucoup de parents préfèrent appeler 2 ou 3 enseignants par WhatsApp avant de choisir. Le bouton « Contacter » envoie une demande structurée à l'enseignant — la conversation peut continuer sur WhatsApp.
              </p>
            </div>
          </div>

          <div className="row gap-10 wrap" style={{justifyContent:'flex-end'}}>
            <Btn variant="ghost" onClick={()=>{Nav.shortlistClear(); navToast('Présélection vidée','blue'); go('parent-search');}}>Tout effacer</Btn>
            <Btn variant="primary" icon="search" onClick={()=>go('parent-search')}>Continuer à explorer</Btn>
          </div>
        </div>
      )}
    </div>
    <Footer go={go}/>
  </div>;
}

window.Shortlist = Shortlist;
