/* NAVANSO — Tutor onboarding + Attendance/session entry */

function OnbSection({n, title, desc, children, done}){
  return <div className="card pad-24 col gap-16">
    <div className="row gap-12">
      <div className="icn" style={{width:34,height:34,borderRadius:99,background:done?'var(--green-600)':'var(--blue-700)',color:'#fff',display:'grid',placeItems:'center',flex:'none',fontFamily:'var(--font-d)',fontWeight:700}}>{done?<Icon name="check" size={17}/>:n}</div>
      <div className="col" style={{gap:2}}><h3 style={{fontSize:17}}>{title}</h3>{desc&&<span className="muted t-13">{desc}</span>}</div>
    </div>
    {children}
  </div>;
}
function Multi({options, value, set, tone}){
  const isAr = typeof NavI18n !== 'undefined' && NavI18n.lang === 'ar';
  const labels = {
    'Mathématiques':'الرياضيات', Physique:'الفيزياء', Arabe:'العربية', Sciences:'العلوم', Français:'الفرنسية', Anglais:'الإنجليزية',
    Primaire:'ابتدائي', '1AM':'1 متوسط', '2AM':'2 متوسط', '3e AM':'3 متوسط', '4e AM (BEM)':'4 متوسط (BEM)', '1AS':'1 ثانوي',
    Individuel:'فردي', 'Petit groupe':'فوج صغير', 'En ligne':'عن بعد', 'À domicile':'في المنزل', 'Salle louée':'قاعة مؤجّرة', Centre:'مركز',
  };
  return <div className="row gap-8 wrap">
    {options.map(o=><button key={o} className={`pick ${value.includes(o)?'on':''} ${tone==='g'?'g':''}`}
      onClick={()=>set(value.includes(o)?value.filter(x=>x!==o):[...value,o])}>{value.includes(o)&&<Icon name="check" size={14}/>}{isAr?(labels[o]||o):o}</button>)}
  </div>;
}

function Onboarding({go}){
  useLang();
  const isAr = NavI18n.lang==='ar';
  const isMobile = useIsNarrow();
  const [subjects,setSubjects]=React.useState(['Mathématiques']);
  const [levels,setLevels]=React.useState(['4e AM (BEM)']);
  const [formats,setFormats]=React.useState(['Petit groupe','Présentiel']);
  const [cap,setCap]=React.useState(8);
  /* B21 — l'onboarding s'adresse à un futur enseignant qui n'a encore ni
     groupes, ni élèves, ni messages : on bascule de l'AppShell (sidebar du
     dashboard) vers la nav marketing publique, plus cohérente avec un flow
     d'inscription. */
  return <div className="screen-anim" style={{minHeight:'100%',background:'var(--bg)'}}>
    <MarketingNav go={go}/>
    <div style={{maxWidth:1100,margin:'0 auto',padding:isMobile?'20px 16px 56px':'30px 40px 72px'}}>
      <div className="row between wrap" style={{marginBottom:isMobile?16:22,gap:14,alignItems:'flex-end'}}>
        <div className="col gap-4">
          <span className="eyebrow" style={{color:'var(--blue-700)'}}>{isAr?'أصبح أستاذاً':'Devenir enseignant'}</span>
          <h1 style={{fontSize:isMobile?22:28,lineHeight:1.15}}>{isAr?'إنشاء ملفّي كأستاذ':'Créer mon profil enseignant'}</h1>
        </div>
        <Btn variant="primary" icon="check" onClick={()=>{navToast(isAr?'تمّ نشر الملف':'Profil publié');go('tutor-profile');}}>{isAr?'نشر الملف':'Publier le profil'}</Btn>
      </div>
      {/* callout */}
      <div className="card pad-20 row gap-14" style={{marginBottom:20,background:'var(--blue-50)',border:'1px solid var(--blue-100)'}}>
        <div className="icn" style={{width:40,height:40,borderRadius:12,background:'#fff',color:'var(--blue-700)',display:'grid',placeItems:'center',boxShadow:'var(--sh-1)',flex:'none'}}><Icon name="heart" size={20}/></div>
        <p className="t-15 lh-14" style={{color:'var(--blue-900)'}}>{isAr?'يساعد ملفّك الأولياء على فهم طريقتك وأفواجك وجديّتك ': 'Votre profil aide les parents à comprendre votre méthode, vos groupes et votre sérieux '}<b>{isAr?'قبل التواصل معك':'avant de vous contacter'}</b>.</p>
      </div>
      <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 320px',gap:20,alignItems:'start'}}>
      <div className="col gap-18">
        <OnbSection n="1" title={isAr?'معلومات أساسية':'Informations de base'} desc={isAr?'كيف يتعرّف عليك الأولياء.':'Comment les parents vous identifient.'} done>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
            <Field label={isAr?'الاسم الكامل':'Nom complet'}><input className="input" defaultValue="Amina Belkacem"/></Field>
            <Field label={isAr?'الهاتف / WhatsApp':'Téléphone / WhatsApp'}><input className="input" defaultValue="0661 23 45 67"/></Field>
            <Field label="Wilaya"><input className="input" defaultValue="Ouargla"/></Field>
            <Field label="Commune"><input className="input" defaultValue="Ouargla centre"/></Field>
          </div>
          <div className="row gap-14" style={{alignItems:'center'}}>
            <Avatar initials="AB" cls="av-b" size={56}/>
            <Btn variant="ghost" size="sm" icon="user">{isAr?'إضافة صورة':'Ajouter une photo'}</Btn>
            <span className="faint t-12">{isAr?'اختياري · الصورة تعزّز الثقة':'Optionnel · une photo renforce la confiance'}</span>
          </div>
        </OnbSection>
        <OnbSection n="2" title={isAr?'المواد والمستويات':'Matières et niveaux'} desc={isAr?'ما الذي تدرّسه.':'Ce que vous enseignez.'}>
          <Field label={isAr?'المواد التي تدرّسها':'Matières enseignées'}><Multi options={['Mathématiques','Physique','Arabe','Sciences','Français','Anglais']} value={subjects} set={setSubjects}/></Field>
          <Field label={isAr?'المستويات':'Niveaux'}><Multi options={['Primaire','1AM','2AM','3e AM','4e AM (BEM)','1AS']} value={levels} set={setLevels} tone="g"/></Field>
        </OnbSection>
        <OnbSection n="3" title={isAr?'صيغة الدروس':'Format des cours'} desc={isAr?'كيف تقدّم الدروس.':'Comment vous enseignez.'}>
          <Field label={isAr?'الصيغة':'Format'}><Multi options={['Individuel','Petit groupe','En ligne','À domicile','Salle louée','Centre']} value={formats} set={setFormats}/></Field>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
            <Field label={isAr?'سعة الفوج':'Capacité d’un groupe'}>
              <div className="row gap-12" style={{alignItems:'center'}}>
                <input type="range" min="2" max="12" value={cap} onChange={e=>setCap(+e.target.value)} style={{flex:1,accentColor:'var(--blue-600)'}}/>
                <span className="chip chip-blue w-700" style={{minWidth:64,justifyContent:'center'}}>{cap} {isAr?'تلاميذ':'élèves'}</span>
              </div>
            </Field>
            <Field label={isAr?'الخبرة':'Expérience'}><input className="input" defaultValue={isAr?'5 سنوات في الدعم المدرسي':'5 ans en soutien scolaire'}/></Field>
          </div>
        </OnbSection>
        <OnbSection n="4" title={isAr?'التعريف والتوفر':'Présentation & disponibilité'} desc={isAr?'طريقتك في بضع كلمات.':'Votre méthode en quelques mots.'}>
          <Field label={isAr?'تعريف قصير':'Courte présentation'}><textarea className="textarea" defaultValue={isAr?'أستاذة رياضيات متخصّصة في التحضير لشهادة BEM. أعمل مع أفواج صغيرة لمتابعة كل تلميذ عن قرب وإطلاع الأولياء على تقدّمه الحقيقي.':NAV.tutor.bio}/></Field>
          <Field label={isAr?'أوقات التوفر':'Disponibilité'}><input className="input" defaultValue={isAr?'السبت، الثلاثاء، الخميس · بعد الظهر':'Samedi, Mardi, Jeudi · après-midi'}/></Field>
        </OnbSection>
      </div>
      {/* live preview */}
      <div className="col gap-14" style={{position:'sticky',top:90}}>
        <span className="eyebrow">{isAr?'معاينة الملف':'Aperçu du profil'}</span>
        <div className="card pad-20 col gap-12">
          <div className="row gap-12"><Avatar initials="AB" cls="av-b" size={48} ring/>
            <div className="col" style={{gap:3}}><span className="w-700 t-16">{isAr?'الأستاذة أمينة':'Mme Amina'}</span><Stars rating={4.8} reviews={23} size={12}/></div></div>
          <div className="row gap-7 wrap">{subjects.slice(0,2).map(s=><span key={s} className="chip chip-blue">{txData?txData(s):s}</span>)}{levels.slice(0,1).map(s=><span key={s} className="chip chip-gray">{txData?txData(s):s}</span>)}</div>
          <div className="card-flat" style={{padding:12,borderRadius:11,background:'var(--bg)',border:'none'}}>
            <div className="row between"><span className="t-12 w-700 muted">{isAr?'فوج صغير · الحد الأقصى':'Petit groupe · max'} {cap}</span><Places places={2} cap={cap}/></div>
            <div className="row gap-8" style={{marginTop:8}}><SeatRow cap={cap} students={Math.max(0,cap-2)}/></div>
          </div>
          <div className="row gap-7 wrap">{formats.slice(0,2).map(f=><span key={f} className="chip chip-green">{txData?txData(f):f}</span>)}</div>
          <Btn variant="green" size="sm" icon="wa" block>{isAr?'التواصل عبر WhatsApp':'Contacter via WhatsApp'}</Btn>
        </div>
        <div className="card pad-16 col gap-8" style={{background:'var(--green-50)',border:'1px solid var(--green-100)'}}>
          <span className="row gap-8 w-700 t-13" style={{color:'var(--green-700)'}}><Icon name="check" size={16}/>{isAr?'الملف مكتمل بنسبة 80%':'Profil complété à 80%'}</span>
          <Bar pct={80}/>
          <span className="faint t-12">{isAr?'أضف صورة للوصول إلى 100%.':'Ajoutez une photo pour atteindre 100%.'}</span>
        </div>
      </div>
    </div>
    </div>
    <Footer go={go}/>
  </div>;
}

/* ---------------- ATTENDANCE ---------------- */
const QUICK_SCORES=[8,10,12,14,16];
const QUICK_WEAK=['Signes','Problèmes','Fractions','Équations','Lecture d’énoncé'];

function QuickEval({s, ev, set, onSave, go}){
  useLang();
  const isAr = NavI18n.lang==='ar';
  const weak=ev.weak||[];
  const tw=(w)=>set({weak:weak.includes(w)?weak.filter(x=>x!==w):[...weak,w]});
  const weakLabel = (w)=> isAr ? ({Signes:'الإشارات','Problèmes':'المسائل',Fractions:'الكسور','Équations':'المعادلات','Lecture d’énoncé':'قراءة نص المسألة'}[w]||w) : w;
  return <div style={{padding:'2px 18px 16px',background:'var(--blue-50)'}}>
    <div className="card" style={{padding:14,borderRadius:12,boxShadow:'var(--sh-1)'}}>
      <div className="row between wrap" style={{marginBottom:12,gap:8}}>
        <span className="row gap-8 w-700 t-13"><Icon name="clipboard" size={16} style={{color:'var(--blue-700)'}}/>{isAr?'ملاحظة الحصة':'Remarque de séance'} — {s.name}</span>
        <a className="row gap-5 t-12 w-600" style={{color:'var(--blue-700)',cursor:'pointer'}} onClick={()=>go('assessment')}>{isAr?'تقييم مفصّل':'Évaluation détaillée'}<Icon name="arrow" size={13}/></a>
      </div>
      {/* the quick free-text remark — the main thing a teacher jots after a session */}
      <Field label={isAr?'ملاحظة سريعة عن التلميذ':'Remarque rapide sur l’élève'}>
        <textarea className="textarea" style={{minHeight:64}} value={ev.remark||''} onChange={e=>set({remark:e.target.value})}
          placeholder={isAr?'مثال: لم يتابع جيداً في نهاية الحصة · يتعثر في الكسور · تحسّن في الإشارات…':'Ex : n’a pas suivi en fin de séance · bloque sur les fractions · a bien progressé sur les signes…'}></textarea>
      </Field>
      <div className="row gap-24 wrap" style={{margin:'12px 0'}}>
        <div className="col gap-7">
          <span className="label">{isAr?'العلامة (اختياري)':'Note (optionnel)'}</span>
          <div className="row gap-6 wrap">
            {QUICK_SCORES.map(n=><button key={n} className="pick" style={ev.score===n?{background:'var(--blue-700)',borderColor:'var(--blue-700)',color:'#fff'}:{}} onClick={()=>set({score:ev.score===n?null:n})}>{n}/20</button>)}
          </div>
        </div>
        <div className="col gap-7 grow" style={{minWidth:220}}>
          <span className="label">{isAr?'نقاط ملاحظة':'Points observés'} <span className="faint w-500">{isAr?'(تُمرّر إلى المساعد · للتأكيد)':'(transmis à l’assistant · à confirmer)'}</span></span>
          <div className="row gap-6 wrap">
            {QUICK_WEAK.map(w=><button key={w} className="pick" style={weak.includes(w)?{background:'var(--orange-500)',borderColor:'var(--orange-500)',color:'#fff'}:{}} onClick={()=>tw(w)}>{weak.includes(w)&&<Icon name="check" size={13}/>}{weakLabel(w)}</button>)}
          </div>
        </div>
      </div>
      <div className="row between wrap gap-10" style={{alignItems:'center'}}>
        <span className="faint t-12 row gap-6"><Icon name="clock" size={13}/>{isAr?'تُضاف إلى سجل التلميذ':'Ajouté à l’historique de l’élève'}</span>
        <Btn variant="green" size="sm" icon="check" onClick={onSave}>{isAr?'حفظ الملاحظة':'Enregistrer la remarque'}</Btn>
      </div>
    </div>
  </div>;
}

function Attendance({go}){
  useLang();
  const isAr = NavI18n.lang === 'ar';
  const isMobile = useIsMobile();
  const states=['present','late','absent','excused'];
  const [att,setAtt]=React.useState(()=>{const o={};NAV.students.forEach((s,i)=>o[s.id]=i===2?'late':i===4?'absent':'present');return o;});
  const cfg = isAr ? {
    present:['حاضر','green','check'],
    late:['متأخّر','orange','clock'],
    absent:['غائب','alert','x'],
    excused:['بعذر','blue','file']
  } : {
    present:['Présent','green','check'],
    late:['Retard','orange','clock'],
    absent:['Absent','alert','x'],
    excused:['Excusé','blue','file']
  };
  const count=st=>Object.values(att).filter(v=>v===st).length;
  const [openEval,setOpenEval]=React.useState(null);
  const [evals,setEvals]=React.useState({});
  const setEval=(id,patch)=>setEvals(e=>({...e,[id]:{...e[id],...patch}}));
  const evalCount=Object.values(evals).filter(e=>e&&e.done).length;
  const [topic,setTopic]=React.useState(isAr?'معادلات من الدّرجة الأولى':'Équations du 1er degré');
  return <AppShell go={go} active="attendance" title={isAr?'تسجيل حصّة':'Saisir une séance'} maxw={1080}
    crumbs={[{t:'Math 4AM',go:()=>go('group-detail')},{t:isAr?'حصّة جديدة':'Nouvelle séance'}]}
    actions={<Btn variant="green" icon="check" onClick={()=>{navToast(isAr?'تمّ تسجيل الحصّة':'Séance enregistrée');go('group-detail');}}>{isAr?'تسجيل الحصّة':'Enregistrer la séance'}</Btn>}>
    <div className="card pad-16 row gap-10" style={{marginBottom:18,background:'var(--green-50)',border:'1px solid var(--green-100)'}}>
      <Icon name="clock" size={18} style={{color:'var(--green-700)'}}/><span className="t-14 w-600" style={{color:'var(--green-800,var(--green-700))'}}>{isAr?'تسجيل سريع بعد الحصّة — أشّر على الحضور، ثمّ أضف تقييماً سريعاً لكلّ تلميذ.':'Saisie rapide après la séance — marquez la présence, puis ajoutez une évaluation rapide à chaque élève.'}</span>
    </div>
    <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 300px',gap:20,alignItems:'start'}}>
      <div className="col gap-18">
        {/* session info */}
        <div className="card pad-20 col gap-14">
          <h3 style={{fontSize:16}}>{isAr?'تفاصيل الحصّة':'Détails de la séance'}</h3>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
            <Field label={isAr?'التّاريخ':'Date'}><input className="input" type="date" defaultValue="2026-05-20"/></Field>
            <Field label={isAr?'الفوج':'Groupe'}><select className="select" defaultValue="g1">{NAV.tutorGroups.map(g=><option key={g.id} value={g.id}>{g.name}</option>)}</select></Field>
          </div>
          <Field label={isAr?'الموضوع المُعالَج':'Sujet traité'}><input className="input" value={topic} onChange={e=>setTopic(e.target.value)}/></Field>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
            <Field label={isAr?'الواجبات':'Devoirs'}><input className="input" placeholder={isAr?'5 تمارين ص. 42':'5 exercices p. 42'}/></Field>
            <Field label={isAr?'ملاحظة عامّة':'Note générale'}><input className="input" placeholder={isAr?'مشاركة جيّدة من الفوج':'Bonne participation du groupe'}/></Field>
          </div>
        </div>
        {/* attendance + quick evaluation table */}
        <div className="card" style={{overflow:'hidden'}}>
          <div className="row between wrap" style={{padding:'16px 18px',gap:10}}>
            <h3 style={{fontSize:16}}>{isAr?`الحضور والملاحظات · ${NAV.students.length} تلميذاً`:`Présence & remarques · ${NAV.students.length} élèves`}</h3>
            <div className="row gap-8 wrap">
              {evalCount>0 && <span className="chip chip-green" style={{fontWeight:700}}><Icon name="clipboard" size={13}/>{evalCount} {isAr?'ملاحظة':`remarque${evalCount>1?'s':''}`}</span>}
              {states.map(st=><span key={st} className={`chip chip-${cfg[st][1]==='alert'?'orange':cfg[st][1]}`} style={{fontWeight:700}}>{count(st)} {isAr?cfg[st][0]:cfg[st][0].toLowerCase()}</span>)}
            </div>
          </div>
          <div className="col">
            {NAV.students.map((s,idx)=>{
              const ev=evals[s.id]||{};
              const open=openEval===s.id;
              return <div key={s.id} style={{borderTop:'1px solid var(--line-2)',background:open?'var(--blue-50)':'transparent',transition:'background .15s'}}>
                <div className="row between wrap" style={{padding:'12px 18px',gap:10}}>
                  <div className="row gap-12" style={{minWidth:170}}><Avatar initials={s.initials} cls={s.av} size={34}/><div className="col" style={{gap:1}}><span className="w-600 t-14">{s.name}</span><span className="faint t-12">{isAr?txData(s.parent):s.parent}</span></div></div>
                  <div className="row gap-10 wrap" style={{alignItems:'center'}}>
                    <div className="seg" style={{background:'var(--bg)'}}>
                      {states.map(st=>{const[lab,tn,ic]=cfg[st];const on=att[s.id]===st;
                        const bg=on?(tn==='green'?'var(--green-600)':tn==='orange'?'var(--orange-500)':tn==='alert'?'var(--alert)':'var(--blue-600)'):'transparent';
                        return <button key={st} onClick={()=>setAtt(a=>({...a,[s.id]:st}))}
                          style={{border:'none',background:bg,color:on?'#fff':'var(--muted)',borderRadius:8,padding:'7px 11px',fontWeight:600,fontSize:12.5,cursor:'pointer',display:'flex',alignItems:'center',gap:5}}>
                          <Icon name={ic} size={13}/>{lab}</button>;})}
                    </div>
                    {ev.done && !open
                      ? <button className="btn btn-sm" style={{background:'var(--green-50)',color:'var(--green-700)',border:'1px solid var(--green-100)'}} onClick={()=>setOpenEval(s.id)}><Icon name="checkc" size={15}/>{isAr?'ملاحظة':'Remarque'}{ev.score?` · ${ev.score}/20`:''}</button>
                      : <button className={`btn btn-sm ${open?'btn-soft':'btn-ghost'}`} onClick={()=>setOpenEval(open?null:s.id)}><Icon name={open?'x':'clipboard'} size={15}/>{open?(isAr?'إغلاق':'Fermer'):(isAr?'ملاحظة':'Remarque')}</button>}
                  </div>
                </div>
                {open && <QuickEval s={s} ev={ev} set={(p)=>setEval(s.id,p)} go={go}
                  onSave={()=>{
                    const e=evals[s.id]||{};
                    if(!e.done) addRemark(s.id,{date:isAr?'20 ماي':'20 mai', topic, present: att[s.id]!=='absent', text:e.remark||'', flags:e.weak||[], score:e.score||null});
                    setEval(s.id,{done:true}); setOpenEval(null); navToast(isAr?'تمّ تسجيل الملاحظة':'Remarque enregistrée');
                  }}/>}
              </div>;
            })}
          </div>
        </div>
      </div>
      {/* side */}
      <div className="col gap-18" style={{position:'sticky',top:90}}>
        <div className="card pad-20 col gap-12">
          <h3 style={{fontSize:16}}>{isAr?'ملخّص':'Résumé'}</h3>
          <div className="row between"><span className="muted t-14">{isAr?'نسبة الحضور':'Taux de présence'}</span><span className="w-700 t-16" style={{color:'var(--green-700)'}}>{Math.round((count('present')+count('late'))/NAV.students.length*100)}%</span></div>
          <Bar pct={Math.round((count('present')+count('late'))/NAV.students.length*100)}/>
          <div className="row between"><span className="muted t-14">{isAr?'ملاحظات مُضافة':'Remarques ajoutées'}</span><span className="w-700 t-15" style={{color:evalCount?'var(--blue-700)':'var(--faint)'}}>{evalCount} / {NAV.students.length}</span></div>
          <div className="hr"></div>
          <div className="col gap-8">
            {states.map(st=><div key={st} className="row between"><span className="row gap-8 t-13 muted w-600"><span style={{width:8,height:8,borderRadius:9,background:cfg[st][1]==='green'?'var(--green-500)':cfg[st][1]==='orange'?'var(--orange-500)':cfg[st][1]==='alert'?'var(--alert)':'var(--blue-500)'}}></span>{cfg[st][0]}</span><span className="w-700 t-14 tnum">{count(st)}</span></div>)}
          </div>
        </div>
        <Btn variant="green" icon="check" block onClick={()=>{navToast(isAr?'تمّ تسجيل الحصّة':'Séance enregistrée');go('group-detail');}}>{isAr?'تسجيل الحصّة':'Enregistrer la séance'}</Btn>
        <Btn variant="ghost" icon="clipboard" block onClick={()=>go('assessment')}>{isAr?'تقييم مُفصَّل لتلميذ':'Évaluation détaillée d’un élève'}</Btn>
      </div>
    </div>
  </AppShell>;
}

Object.assign(window,{Onboarding,Attendance});
