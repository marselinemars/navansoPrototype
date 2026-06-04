/* NAVANSO — Présélection (parent shortlist + comparison).
   Parents in Algeria typically compare 2-3 tutors (often via phone/WhatsApp)
   before deciding. This screen surfaces that real behavior. */

function Shortlist({go}){
  useStore(); useLang();
  const isMobile = useIsNarrow();
  const ids = Nav.shortlistAll();
  const tutors = ids.map(id=>Nav.tutorById(id)).filter(Boolean);
  const empty = tutors.length===0;
  const isAr = NavI18n.lang==='ar';

  const rows = [
    {key:'price',    label:t('sl.row.price'),    fn:tu=>tu.price?`${tu.price.toLocaleString('fr-FR')} DZD / ${tu.priceUnit||(isAr?'شهر':'mois')}`:'—'},
    {key:'places',   label:t('sl.row.places'),   fn:tu=>tu.places>0?(isAr?`${tu.places} متوفّر${tu.places>1?'ة':''}`:`${tu.places} disponible${tu.places>1?'s':''}`):t('sl.row.full')},
    {key:'capacity', label:t('sl.row.capacity'), fn:tu=>isAr?`${tu.cap} تلاميذ`:`${tu.cap} élèves`},
    {key:'mode',     label:t('sl.row.format'),   fn:tu=>txData?txData(tu.mode||'—'):(tu.mode||'—')},
    {key:'commune',  label:t('sl.row.location'), fn:tu=>txData?txData(tu.commune||tu.loc||'—'):(tu.commune||tu.loc||'—')},
    {key:'rating',   label:t('sl.row.rating'),   fn:tu=>isAr?`${tu.rating} (${tu.reviews} تقييم)`:`${tu.rating} (${tu.reviews} avis)`},
    {key:'trial',    label:t('sl.row.trial'),    fn:tu=>tu.trial?(isAr?'✓ نعم':'✓ Oui'):'—'},
  ];

  return <div className="screen-anim" style={{minHeight:'100%',background:'var(--bg)'}}>
    <MarketingNav go={go} active="parent-search"/>
    <div style={{maxWidth:1100,margin:'0 auto',padding:isMobile?'20px 16px 60px':'32px 40px 80px'}}>
      <button className="btn btn-ghost btn-sm" onClick={()=>go('parent-search')} style={{marginBottom:14}}>
        <Icon name="arrowl" size={16}/>{t('sl.back')}
      </button>
      <div className="col gap-6" style={{marginBottom:isMobile?20:28}}>
        <span className="eyebrow" style={{color:'var(--green-700)'}}>{t('sl.eyebrow')}</span>
        <h1 style={{fontSize:isMobile?26:34,lineHeight:1.1}}>{t('sl.title')}</h1>
        <p className="muted t-15 lh-15" style={{maxWidth:640}}>{t('sl.desc')}</p>
      </div>

      {empty ? (
        <div className="card pad-24 col center" style={{gap:14,textAlign:'center',padding:'56px 24px'}}>
          <Icon name="heart" size={32} style={{color:'var(--faint)'}}/>
          <span className="w-700 t-16">{isAr?'لا يوجد أساتذة محفوظون':'Aucun enseignant sauvegardé'}</span>
          <span className="muted t-14" style={{maxWidth:340}}>{isAr?'المس القلب على بطاقة الأستاذ لإضافته إلى قائمتك المختصرة.':'Touchez le cœur sur la carte d\'un enseignant pour l\'ajouter à votre présélection.'}</span>
          <Btn variant="green" icon="search" onClick={()=>go('parent-search')}>{isAr?'البحث عن أستاذ':'Trouver un enseignant'}</Btn>
        </div>
      ) : (
        <div className="col gap-18">
          {isMobile ? (
            /* Mobile — stacked comparison cards, no horizontal scroll. */
            <div className="col gap-14">
              {tutors.map(tu=> (
                <div key={tu.id} className="card" style={{padding:16}}>
                  <div className="row gap-10" style={{marginBottom:12}}>
                    <Avatar initials={tu.initials} cls={tu.av} size={42}/>
                    <div className="col" style={{gap:1,minWidth:0,flex:1}}>
                      <span className="w-700 t-15">{isAr&&txData?txData(tu.name):tu.name}</span>
                      <span className="faint t-12">{txData?txData(tu.subject):tu.subject} · {txData?txData(tu.level):tu.level}</span>
                    </div>
                  </div>
                  <div className="col">
                    {rows.map(r=> (
                      <div key={r.key} className="row between" style={{padding:'8px 0',borderBottom:'1px solid var(--line-2)',gap:10}}>
                        <span className="t-11 faint w-700" style={{textTransform:'uppercase',letterSpacing:'.04em'}}>{r.label}</span>
                        <span className="t-13 w-600" style={{color:'var(--ink-2)',textAlign:'right'}}>{r.fn(tu)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="col gap-8" style={{marginTop:12}}>
                    <Btn variant="green" size="sm" icon="wa" block onClick={()=>go('inquiry', tu.id)}>{t('sl.contact')}</Btn>
                    <Btn variant="ghost" size="sm" iconR="arrow" block onClick={()=>go('tutor-profile', tu.id)}>{t('sl.profile')}</Btn>
                    <button className="t-12 w-700" style={{background:'none',border:'none',color:'var(--alert)',cursor:'pointer',padding:'4px 0'}}
                      onClick={()=>{Nav.shortlistToggle(tu.id); navToast(t('tc.toast.removed'),'blue');}}>
                      {isAr?'إزالة من القائمة المختصرة':'Retirer de la présélection'}
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
                    {tutors.map(tu=> <th key={tu.id} style={{minWidth:180,verticalAlign:'top'}}>
                      <div className="col gap-7" style={{padding:'8px 0'}}>
                        <div className="row gap-10">
                          <Avatar initials={tu.initials} cls={tu.av} size={36}/>
                          <div className="col" style={{gap:1,minWidth:0}}>
                            <span className="w-700 t-14">{isAr&&txData?txData(tu.name):tu.name}</span>
                            <span className="faint t-12">{txData?txData(tu.subject):tu.subject} · {txData?txData(tu.level):tu.level}</span>
                          </div>
                        </div>
                      </div>
                    </th>)}
                  </tr>
                </thead>
                <tbody>
                  {rows.map(r=> <tr key={r.key}>
                    <td className="t-12 faint w-700" style={{textTransform:'uppercase',letterSpacing:'.04em',width:140}}>{r.label}</td>
                    {tutors.map(tu=> <td key={tu.id} className="t-14 w-600">{r.fn(tu)}</td>)}
                  </tr>)}
                  <tr>
                    <td></td>
                    {tutors.map(tu=> <td key={tu.id}>
                      <div className="col gap-7" style={{padding:'10px 0'}}>
                        <Btn variant="green" size="sm" icon="wa" onClick={()=>go('inquiry', tu.id)}>{t('sl.contact')}</Btn>
                        <Btn variant="ghost" size="sm" iconR="arrow" onClick={()=>go('tutor-profile', tu.id)}>{t('sl.profile')}</Btn>
                        <button className="t-12 w-700" style={{background:'none',border:'none',color:'var(--alert)',cursor:'pointer',padding:'4px 0'}}
                          onClick={()=>{Nav.shortlistToggle(tu.id); navToast(t('tc.toast.removed'),'blue');}}>
                          {isAr?'إزالة':'Retirer'}
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
              <span className="w-700 t-14" style={{color:'var(--blue-800)'}}>{t('sl.tip.title')}</span>
              <p className="t-13 lh-14" style={{color:'var(--blue-900)'}}>{t('sl.tip.desc')}</p>
            </div>
          </div>

          <div className="row gap-10 wrap" style={{justifyContent:'flex-end'}}>
            <Btn variant="ghost" onClick={()=>{Nav.shortlistClear(); navToast(isAr?'تمّ تفريغ القائمة المختصرة':'Présélection vidée','blue'); go('parent-search');}}>{isAr?'مسح الكلّ':'Tout effacer'}</Btn>
            <Btn variant="primary" icon="search" onClick={()=>go('parent-search')}>{isAr?'متابعة الاستكشاف':'Continuer à explorer'}</Btn>
          </div>
        </div>
      )}
    </div>
    <Footer go={go}/>
  </div>;
}

window.Shortlist = Shortlist;
