/* NAVANSO — Assessment/weak-point entry + Report generation (core value) */

function Assessment({go}){
  const isMobile = useIsMobile();
  const [weak,setWeak]=React.useState(['Règles de signes','Problèmes']);
  const [understood,setUnderstood]=React.useState(['Étapes de résolution']);
  const [score,setScore]=React.useState(12);
  const [mode,setMode]=React.useState('note');
  const QUAL=['Insuffisant','À renforcer','Acquis','Maîtrisé'];
  const [qual,setQual]=React.useState('Acquis');
  const toggle=(arr,set,v)=>set(arr.includes(v)?arr.filter(x=>x!==v):[...arr,v]);
  return <AppShell go={go} active="assessment" title="Nouvelle évaluation" maxw={1080}
    crumbs={[{t:'Yacine',go:()=>go('student-profile')},{t:'Évaluation'}]}
    actions={<><Btn variant="ghost" icon="check" onClick={()=>{navToast('Évaluation enregistrée');go('student-profile');}}>Enregistrer</Btn><Btn variant="primary" icon="sparkle" onClick={()=>go('report-gen')}>Générer un brouillon de rapport</Btn></>}>
    <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 320px',gap:20,alignItems:'start'}}>
      <div className="col gap-18">
        <div className="card pad-24 col gap-16">
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
            <Field label="Élève"><div className="row gap-10 input" style={{alignItems:'center',padding:'8px 12px'}}><Avatar initials="YB" cls="av-o" size={26}/><span className="w-600 t-14">Yacine Benali</span></div></Field>
            <Field label="Sujet / chapitre"><input className="input" defaultValue="Équations du 1er degré"/></Field>
          </div>
          {/* score */}
          <Field label="Note ou niveau">
            <div className="row gap-16 wrap" style={{alignItems:'center'}}>
              {mode==='note'
                ? <div className="row gap-10 grow" style={{minWidth:240}}>
                    <input type="range" min="0" max="20" value={score} onChange={e=>setScore(+e.target.value)} style={{flex:1,accentColor:'var(--blue-600)'}}/>
                    <span className="chip chip-blue w-700" style={{minWidth:62,justifyContent:'center',fontSize:14}}>{score}/20</span>
                  </div>
                : <div className="row gap-7 wrap grow" style={{minWidth:240}}>
                    {QUAL.map((q,i)=>{const on=qual===q;
                      const tone=i<=1?'orange':'green';
                      return <button key={q} className="pick" onClick={()=>setQual(q)}
                        style={on?{background:`var(--${tone==='orange'?'orange-500':'green-600'})`,borderColor:`var(--${tone==='orange'?'orange-500':'green-600'})`,color:'#fff'}:{}}>
                        {on&&<Icon name="check" size={14}/>}{q}</button>;})}
                  </div>}
              <div className="seg" style={{flex:'none'}}>
                <button className={mode==='note'?'on':''} onClick={()=>setMode('note')}>Note</button>
                <button className={mode==='qual'?'on':''} onClick={()=>setMode('qual')}>Qualitatif</button>
              </div>
            </div>
          </Field>
        </div>
        {/* concepts understood */}
        <div className="card pad-24 col gap-14">
          <h3 className="row gap-8" style={{fontSize:16}}><Icon name="check" size={18} style={{color:'var(--green-600)'}}/>Concepts compris</h3>
          <div className="row gap-8 wrap">
            {['Étapes de résolution','Calcul littéral','Mise en équation','Vérification','Participation'].map(c=>
              <button key={c} className={`pick g ${understood.includes(c)?'on':''}`} onClick={()=>toggle(understood,setUnderstood,c)}>{understood.includes(c)&&<Icon name="check" size={14}/>}{c}</button>)}
          </div>
        </div>
        {/* weak points — chips */}
        <div className="card pad-24 col gap-14" style={{border:'1px solid var(--orange-100)'}}>
          <div className="row between">
            <h3 className="row gap-8" style={{fontSize:16}}><Icon name="target" size={18} style={{color:'var(--orange-600)'}}/>Points faibles</h3>
            <span className="faint t-12">Choisissez ou ajoutez vos propres tags</span>
          </div>
          <div className="row gap-8 wrap">
            {NAV.weakChips.map(c=>
              <button key={c} className="pick" style={weak.includes(c)?{background:'var(--orange-500)',borderColor:'var(--orange-500)',color:'#fff'}:{}} onClick={()=>toggle(weak,setWeak,c)}>
                {weak.includes(c)&&<Icon name="check" size={14}/>}{c}</button>)}
            <button className="pick" style={{borderStyle:'dashed',color:'var(--muted)'}}><Icon name="plus" size={14}/>Ajouter</button>
          </div>
          <Field label="Erreurs répétées (texte libre)"><textarea className="textarea" defaultValue="Confond les signes lors du passage d’un terme de l’autre côté de l’égalité. Difficulté à traduire un énoncé en équation."/></Field>
        </div>
        {/* recommendation */}
        <div className="card pad-24 col gap-14">
          <h3 className="row gap-8" style={{fontSize:16}}><Icon name="flag" size={18} style={{color:'var(--green-700)'}}/>Recommandation de l’enseignant</h3>
          <Field><textarea className="textarea" defaultValue={NAV.yacine.reco}/></Field>
        </div>
      </div>
      {/* side preview */}
      <div className="col gap-18" style={{position:'sticky',top:90}}>
        <div className="card pad-20 col gap-12">
          <h3 style={{fontSize:16}}>Résumé de la saisie</h3>
          <div className="row between"><span className="muted t-14">{mode==='note'?'Note':'Niveau'}</span>{mode==='note'?<span className="chip chip-blue w-700 tnum">{score}/20</span>:<span className="chip chip-green w-700">{qual}</span>}</div>
          <div className="col gap-7">
            <span className="t-12 faint w-700" style={{textTransform:'uppercase',letterSpacing:'.04em'}}>Compris</span>
            <div className="row gap-6 wrap">{understood.length?understood.map(c=><span key={c} className="chip chip-green" style={{fontSize:11.5}}>{c}</span>):<span className="faint t-13">—</span>}</div>
          </div>
          <div className="col gap-7">
            <span className="t-12 faint w-700" style={{textTransform:'uppercase',letterSpacing:'.04em'}}>Points faibles</span>
            <div className="row gap-6 wrap">{weak.length?weak.map(c=><span key={c} className="chip chip-weak" style={{fontSize:11.5}}>{c}</span>):<span className="faint t-13">—</span>}</div>
          </div>
          <div className="hr"></div>
          <Btn variant="primary" icon="sparkle" block onClick={()=>go('report-gen')}>Générer un brouillon</Btn>
          <p className="faint t-12 lh-14" style={{textAlign:'center'}}>Le brouillon sera relu et validé par vous avant tout envoi.</p>
        </div>
      </div>
    </div>
  </AppShell>;
}

/* ---------------- REPORT GENERATION ---------------- */
function frenchList(arr){ if(!arr.length)return ''; if(arr.length===1)return arr[0]; return arr.slice(0,-1).join(', ')+' et '+arr[arr.length-1]; }
function ReportGen({go, id}){
  useStore();
  const isMobile = useIsMobile();
  // resolve the target student. If no id, default to first pending report's student, else first student.
  const sid = id || (Nav.reportsPending()[0]||{}).studentId || 's1';
  const s = Nav.studentById(sid) || Nav.studentById('s1');
  const isYacine = s.id==='s1';
  const y = isYacine ? NAV.yacine : (()=>{
    const lastSess = Nav.lastCompletedSession(s.groupId);
    const att = (lastSess?.attendance||[]).find(a=>a.studentId===s.id);
    return {
      name:s.name, initials:s.initials, av:s.av,
      level:s.level||'4e année moyenne', subject:s.subject||'Mathématiques',
      group:(Nav.groupById(s.groupId)||{}).name||'',
      parent:s.parent, parentContact:'WhatsApp',
      att:s.att, attFrac:`${Math.round((s.att/100)*6)} séances sur 6`,
      result:s.result, prevResult:'—', trend:'+0',
      strengths:['Participation régulière','Méthode de travail'],
      weak:[s.weak||'À identifier'],
      reco:'Suivre le rythme du groupe, exercices de révision avant la prochaine séance.',
      note:'Élève suivi.',
      lastLesson: lastSess?.plannedTopic || '—',
    };
  })();
  const pts=pointsOf(sid);
  const [generated,setGenerated]=React.useState(false);
  const [validated,setValidated]=React.useState(false);
  const improv=pts.resolved.map(p=>p.label.toLowerCase());
  const actives=pts.active.map(p=>p.label.toLowerCase());
  const firstName = (y.name||'').split(' ')[0] || 'l\'élève';
  const draft=`Ce mois-ci, ${firstName} a assisté à ${y.attFrac||(y.att+'%')} et montre une bonne implication en groupe (dernière note : ${y.result}${y.trend && y.trend!=='+0'?', en progression de '+y.trend+' points':''}).`
    + (improv.length?` Bonne nouvelle : il/elle a progressé sur ${frenchList(improv)}.`:``)
    + `\n\nIl reste à travailler ${actives.length?frenchList(actives):'quelques points'}. ${y.reco||'Je recommande quelques exercices courts à la maison avant la prochaine séance.'}`;

  const onValidate = ()=>{
    // create or update a Report record with token, mark as validated_sent
    const existing = (Nav.reportsByStudent(sid)||[]).find(r=>r.status==='draft');
    const token = 'r-'+firstName.toLowerCase().replace(/[^a-z]/g,'')+'-'+Date.now().toString(36);
    const today = new Date().toISOString().slice(0,10);
    const summary = {
      att: (y.att||0)+'%', attFrac:y.attFrac, result:y.result, trend:y.trend,
      topic:y.lastLesson, strengths:y.strengths, improved:improv, toWork:actives,
      reco:y.reco, nextStep:'À évaluer la prochaine séance.', note:y.note,
    };
    NavStore.set(d=>{
      const list = d.reports || JSON.parse(JSON.stringify(NAV.reports));
      if(existing){
        const r = list.find(x=>x.id===existing.id);
        if(r){ r.status='validated_sent'; r.date=today; r.token=token; r.summary=summary; r.viewedAt=null; }
      } else {
        list.unshift({id:'rep'+Date.now(), studentId:sid, groupId:s.groupId, date:today,
          token, status:'validated_sent', viewedAt:null, tutorId:'t1', summary});
      }
      d.reports = list; return d;
    });
    setValidated(true);
    navToast('Rapport validé. Vous pouvez maintenant le partager.','green');
    return token;
  };

  return <AppShell go={go} active="report-gen" title={`Rapport · ${y.name}`} maxw={1120}
    crumbs={[{t:firstName,go:()=>go('student-profile', sid)},{t:'Rapport'}]}
    actions={validated
      ? <Btn variant="wa" icon="wa" onClick={()=>{
          const r = Nav.reportsByStudent(sid).find(x=>x.status==='validated_sent');
          go('parent-report', r?.token);
        }}>Voir aperçu / Partager</Btn>
      : <Btn variant="primary" icon="check" onClick={()=>{if(generated) onValidate();}} style={generated?{}:{opacity:.5,pointerEvents:'none'}}>Valider le rapport</Btn>}>
    {/* step indicator */}
    <div className="card pad-16" style={{marginBottom:16,display:'flex',justifyContent:'center'}}>
      <Stepper steps={['Données saisies','Brouillon généré','Validation enseignant','Partage parent']} current={!generated?1:!validated?2:3}/>
    </div>
    {/* assistant framing banner — teacher-controlled */}
    <div className="card pad-20 row gap-14" style={{marginBottom:20,background:'linear-gradient(100deg,var(--blue-50),#fff 70%)',border:'1px solid var(--blue-100)'}}>
      <div className="icn" style={{width:42,height:42,borderRadius:12,background:'#fff',color:'var(--blue-700)',display:'grid',placeItems:'center',boxShadow:'var(--sh-1)',flex:'none'}}><Icon name="shield" size={21}/></div>
      <div className="grow"><span className="w-700 t-15">L’assistant ne remplace pas l’enseignant</span>
        <p className="muted t-14 lh-14" style={{marginTop:2}}>Il reformule uniquement les données saisies. Le rapport doit être relu et validé avant envoi.</p></div>
    </div>
    <div className="row gap-12 wrap" style={{marginBottom:20}}>
      <TimeSave icon="clock" style={{flex:'1 1 280px'}}>Rapport généré en 1 minute à partir des remarques déjà saisies.</TimeSave>
      <PrivacyNote style={{flex:'1 1 280px'}}/>
    </div>
    <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'320px 1fr',gap:20,alignItems:'start'}}>
      {/* data summary */}
      <div className="card pad-20 col gap-14" style={{position:'sticky',top:90}}>
        <h3 style={{fontSize:16}}>Données de la saisie</h3>
        <p className="faint t-12" style={{marginTop:-6}}>Données issues de vos saisies de présence et d’évaluation.</p>
        {[['Présence',`${y.att} % — ${y.attFrac}`,'green'],['Dernier sujet',y.lastLesson,'blue'],['Dernière note',`${y.result} (${y.trend})`,'blue']].map(([l,v,t])=>
          <div key={l} className="col gap-2"><span className="faint t-11 w-700" style={{textTransform:'uppercase',letterSpacing:'.04em'}}>{l}</span><span className="w-700 t-14" style={{color:`var(--${t==='green'?'green-700':'blue-700'})`}}>{v}</span></div>)}
        <div className="col gap-7"><span className="t-12 faint w-700" style={{textTransform:'uppercase',letterSpacing:'.04em'}}>Points forts</span>{y.strengths.map((s,i)=><span key={i} className="t-13 lh-14" style={{color:'var(--ink-2)'}}>• {s}</span>)}</div>
        {pts.resolved.length>0 && <div className="col gap-7"><span className="t-12 w-700" style={{textTransform:'uppercase',letterSpacing:'.04em',color:'var(--green-700)'}}>Améliorations</span><div className="row gap-6 wrap">{pts.resolved.map((p,i)=><span key={i} className="chip chip-green" style={{fontSize:11.5}}><Icon name="check" size={12}/>{p.label}</span>)}</div></div>}
        <div className="col gap-7"><span className="t-12 faint w-700" style={{textTransform:'uppercase',letterSpacing:'.04em'}}>À travailler</span><div className="row gap-6 wrap">{pts.active.length?pts.active.map((p,i)=><span key={i} className="chip chip-weak" style={{fontSize:11.5}}>{p.label}</span>):<span className="faint t-13">—</span>}</div></div>
      </div>
      {/* draft + edit + validation */}
      <div className="col gap-18">
        {/* step generate */}
        {!generated ? (
          <div className="card" style={{padding:'40px 28px',display:'flex',flexDirection:'column',alignItems:'center',gap:16,textAlign:'center'}}>
            <div className="icn" style={{width:60,height:60,borderRadius:18,background:'var(--blue-50)',color:'var(--blue-700)',display:'grid',placeItems:'center'}}><Icon name="sparkle" size={28}/></div>
            <div className="col gap-6" style={{maxWidth:420}}><h3 style={{fontSize:19}}>Générer un brouillon de rapport</h3><p className="muted t-15 lh-14">L’assistant reformule vos observations en un texte clair pour les parents. Vous pourrez le modifier librement.</p></div>
            <Btn variant="primary" size="lg" icon="sparkle" onClick={()=>{setGenerated(true);navToast('Brouillon généré','blue');}}>Générer le brouillon</Btn>
          </div>
        ) : (
          <>
            <div className="card pad-24 col gap-14">
              <div className="row between">
                <h3 className="row gap-8" style={{fontSize:16}}><Icon name="edit" size={17} style={{color:'var(--blue-700)'}}/>Brouillon — modifiable par l’enseignant</h3>
                <button className="btn btn-ghost btn-sm" onClick={()=>{setGenerated(true);navToast('Brouillon régénéré','blue');}}><Icon name="sparkle" size={15}/>Reformuler</button>
              </div>
              <textarea className="textarea" style={{minHeight:170,fontSize:14.5,lineHeight:1.6}} defaultValue={draft}></textarea>
              <Field label="Prochaine étape"><input className="input" defaultValue="Évaluation courte sur les signes à la prochaine séance."/></Field>
              <Field label="Note personnelle de l’enseignant"><input className="input" defaultValue={y.note}/></Field>
            </div>
            {/* validation strip */}
            <div className="card pad-20 row between wrap" style={{gap:14,background:validated?'var(--green-50)':'#fff',border:validated?'1px solid var(--green-100)':'1px solid var(--line)'}}>
              <div className="row gap-12">
                <div className="icn" style={{width:40,height:40,borderRadius:12,background:validated?'var(--green-600)':'var(--bg-2)',color:validated?'#fff':'var(--muted)',display:'grid',placeItems:'center'}}><Icon name={validated?'checkc':'shield'} size={20}/></div>
                <div className="col" style={{gap:2}}>
                  <span className="w-700 t-15">{validated?'Rapport relu et validé par l’enseignant':'Relisez avant de valider'}</span>
                  <span className="muted t-13">{validated?'Prêt à être partagé avec le parent via WhatsApp.':'Le rapport ne sera pas envoyé tant que vous ne l’aurez pas validé.'}</span>
                </div>
              </div>
              {validated
                ? <Btn variant="wa" icon="wa" onClick={()=>go('whatsapp-share')}>Partager via WhatsApp</Btn>
                : <Btn variant="primary" icon="check" onClick={onValidate}>Valider le rapport</Btn>}
            </div>
            {/* preview link */}
            <div className="card pad-20 row between" style={{borderStyle:'dashed'}}>
              <div className="row gap-12"><div className="icn" style={{width:38,height:38,borderRadius:11,background:'var(--orange-50)',color:'var(--orange-600)',display:'grid',placeItems:'center'}}><Icon name="phone" size={18}/></div>
                <div className="col" style={{gap:1}}><span className="w-700 t-14">Aperçu côté parent</span><span className="faint t-13">Voir le rapport tel que le parent le recevra (mobile).</span></div></div>
              <Btn variant="ghost" size="sm" iconR="arrow" onClick={()=>{
                const r = Nav.reportsByStudent(sid).find(x=>x.status==='validated_sent');
                go('parent-report', r?.token);
              }}>Voir l’aperçu</Btn>
            </div>
          </>
        )}
      </div>
    </div>
  </AppShell>;
}

Object.assign(window,{Assessment,ReportGen});
