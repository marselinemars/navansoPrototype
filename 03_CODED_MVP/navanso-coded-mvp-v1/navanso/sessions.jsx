/* NAVANSO — Session entity screens.
   SessionEntry: redesigned attendance flow that captures (a) what was covered
     vs what got deferred, (b) per-student attendance + remarks, (c) to-dos
     for the next session. Replaces the old "attendance is the session" model.
   Group sessions tab is rendered inside group-detail (see tutor1b.jsx update).
*/

function SessionEntry({go, id}){
  useStore();
  const isMobile = useIsMobile();
  const sid = id || (Nav.nextPlannedSession('g1')||{}).id || 'sess1';
  const session = Nav.sessionById(sid);
  if(!session) return <AppShell go={go} active="session-entry" title="Séance"><div className="card pad-24"><span className="muted">Séance introuvable.</span></div></AppShell>;
  const group = Nav.groupById(session.groupId);
  const students = Nav.studentsByGroup(session.groupId);

  const [items, setItems]   = React.useState(()=>session.plannedItems.map(p=>({...p, covered: p.covered===true})));
  const [deferred, setDef]  = React.useState(()=>session.plannedItems.filter(p=>p.deferred).map(p=>p.id));
  const [comments, setCmts] = React.useState(session.comments||'');
  const [homework, setHw]   = React.useState(session.homework||'');
  const [newImprov, setNewImprov] = React.useState('');
  const addImprovisedItem = ()=>{
    if(!newImprov.trim()) return;
    setItems(arr=>[...arr, {id:'pi'+Date.now()+Math.random().toString(36).slice(2,5), text:newImprov.trim(), covered:true, improvised:true}]);
    setNewImprov('');
  };
  const removeItem = (pid)=> setItems(arr=>arr.filter(p=>p.id!==pid));
  // No more separate `todos` state — the "à retenir" block is now a unified
  // ScopedTodos pointing at this group (surfacing in Mes tâches + Group page).
  const [att, setAtt]       = React.useState(()=>{
    const o = {}; students.forEach(s=>{
      const r = (session.attendance||[]).find(a=>a.studentId===s.id);
      o[s.id] = r ? {status:r.status||'present', remark:r.remark||'', score:(r.score==null?'':r.score)}
                  : {status:'present', remark:'', score:''};
    }); return o;
  });
  // carried-over context is now surfaced via ScopedTodos (group scope) and the
  // group-detail "Contexte de la prochaine séance" card. No local state needed.

  const toggleItem = (pid)=> setItems(arr=>arr.map(p=>p.id===pid?{...p,covered:!p.covered}:p));
  const toggleDef  = (pid)=> setDef(arr=> arr.includes(pid)?arr.filter(x=>x!==pid):[...arr,pid]);
  const addTodo = ()=>{ if(!newTodo.trim()) return; setTodos(t=>[...t,{id:'td'+Date.now(),text:newTodo.trim(),done:false,carryToNext:true}]); setNewTodo(''); };
  const rmTodo = (id)=> setTodos(t=>t.filter(x=>x.id!==id));
  const setAttFor = (sid,patch)=> setAtt(a=>({...a, [sid]:{...a[sid], ...patch}}));

  const presentCount = Object.values(att).filter(a=>a.status==='present').length;
  const lateCount    = Object.values(att).filter(a=>a.status==='late').length;
  const absentCount  = Object.values(att).filter(a=>a.status==='absent').length;

  const save = ()=>{
    Nav.upsertSession({...session, status:'completed',
      plannedItems: items.map(p=>({...p, deferred: deferred.includes(p.id)})),
      comments, homework,
      attendance: students.map(s=>{
        const a = att[s.id];
        const score = a.score===''||a.score==null ? null : (isNaN(+a.score)?a.score:+a.score);
        return {studentId:s.id, status:a.status, remark:a.remark, flags:[], score};
      }),
    });
    // also push remarks into the per-student remark store so points-of-follow-up update
    students.forEach(s=>{ const r=att[s.id]; if((r.remark && r.remark.trim()) || (r.score!==''&&r.score!=null)){
      const scoreNum = r.score===''||r.score==null ? null : (isNaN(+r.score)?null:+r.score);
      addRemark(s.id,{date:fmtFr(session.date), topic:session.plannedTopic||'', present:r.status!=='absent',
        text:(r.remark||'').trim(), flags:[], score:scoreNum});
    }});
    navToast('Séance enregistrée','green');
    go('group-detail', session.groupId);
  };

  return <AppShell go={go} active="session-entry" title={session.status==='planned'?'Saisie de séance':'Modifier la séance'}
    crumbs={[{t:'Groupes',go:()=>go('groups')},{t:group?.name||'',go:()=>go('group-detail', session.groupId)},{t:session.plannedTopic}]}
    actions={<Btn variant="green" icon="check" onClick={save}>Enregistrer la séance</Btn>}>
    <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 320px',gap:20,alignItems:'start'}}>
      <div className="col gap-18">
        {/* programme covered */}
        <div className="card pad-24 col gap-14">
          <div className="row between">
            <h3 className="row gap-8" style={{fontSize:17}}><Icon name="book" size={18} style={{color:'var(--blue-700)'}}/>Programme prévu</h3>
            <span className="faint t-13 w-600">Date · {fmtFr(session.date)}</span>
          </div>
          <p className="muted t-13" style={{marginTop:-6}}>Cochez ce qui a été traité. Marquez « reporté » ce qui n'a pas pu être fait — ces points seront proposés pour la prochaine séance.</p>
          <div className="col gap-8">
            {items.map(p=>{
              const isDef = deferred.includes(p.id);
              return <div key={p.id} className="row between" style={{padding:'10px 12px',border:'1px solid '+(p.covered?'var(--green-100)':isDef?'var(--orange-100)':'var(--line)'),borderRadius:10,background:p.covered?'var(--green-50)':isDef?'var(--orange-50)':'#fff',gap:10}}>
                <label className="row gap-10" style={{cursor:'pointer',flex:'1 1 auto'}}>
                  <input type="checkbox" checked={p.covered} onChange={()=>toggleItem(p.id)} style={{accentColor:'var(--green-600)',width:18,height:18}}/>
                  <span className="t-14" style={{color: p.covered?'var(--green-700)':'var(--ink)', textDecoration: p.covered?'':isDef?'line-through':'none', opacity: isDef?.7:1}}>{p.text}</span>
                  {p.improvised && <span className="chip chip-blue" style={{fontSize:10.5,padding:'2px 6px'}}>improvisé</span>}
                </label>
                <div className="row gap-7">
                  {!p.covered && <button className={`pick ${isDef?'on':''}`} style={isDef?{background:'var(--orange-500)',borderColor:'var(--orange-500)',color:'#fff'}:{}} onClick={()=>toggleDef(p.id)}>{isDef?'Reporté ✓':'Reporter →'}</button>}
                  {p.improvised && <button className="btn btn-ghost btn-sm btn-icon" onClick={()=>removeItem(p.id)}><Icon name="x" size={13}/></button>}
                </div>
              </div>;
            })}
            {/* Improvised item composer — for things tackled in-session that
                weren't in the original plan. Items added here are marked
                covered:true and tagged "improvisé". */}
            <div className="card-flat" style={{padding:'10px 12px',borderRadius:10,background:'var(--blue-50)',border:'1px dashed var(--blue-100)',marginTop:4}}>
              <div className="row gap-8" style={{marginBottom:6}}>
                <Icon name="sparkle" size={14} style={{color:'var(--blue-700)'}}/>
                <span className="t-12 w-700" style={{color:'var(--blue-800)'}}>Ajouter ce qu'on a fait en plus</span>
              </div>
              <div className="row gap-8">
                <input className="input" style={{fontSize:13}} placeholder="Ex : exercice improvisé sur les fractions" value={newImprov} onChange={e=>setNewImprov(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')addImprovisedItem();}}/>
                <Btn variant="soft" size="sm" icon="plus" onClick={addImprovisedItem}>Ajouter</Btn>
              </div>
              <span className="faint t-11" style={{display:'block',marginTop:4}}>Sera ajouté au programme avec un tag « improvisé » et coché comme fait.</span>
            </div>
          </div>
        </div>
        {/* attendance */}
        <div className="card" style={{overflow:'hidden'}}>
          <div className="row between" style={{padding:'14px 18px',borderBottom:'1px solid var(--line-2)'}}>
            <h3 className="row gap-8" style={{fontSize:16}}><Icon name="users" size={17} style={{color:'var(--green-700)'}}/>Présence & remarques · {students.length} élèves</h3>
            <div className="row gap-7 wrap">
              <span className="chip chip-green">{presentCount} présent{presentCount>1?'s':''}</span>
              <span className="chip chip-orange">{lateCount} retard</span>
              <span className="chip chip-weak" style={{background:'rgba(216,99,46,.15)'}}>{absentCount} absent{absentCount>1?'s':''}</span>
            </div>
          </div>
          <div className="col">
            {students.map((s,idx)=>{
              const a = att[s.id];
              const canScore = a.status==='present' || a.status==='late';
              return <div key={s.id} style={{padding:'12px 18px',borderTop:idx>0?'1px solid var(--line-2)':'none'}}>
                <div className="row between wrap" style={{gap:10}}>
                  <div className="row gap-12" style={{minWidth:180}}>
                    <Avatar initials={s.initials} cls={s.av} size={34}/>
                    <div className="col" style={{gap:1}}><span className="w-600 t-14">{s.name}</span><span className="faint t-12">{s.parent}</span></div>
                  </div>
                  <div className="seg" style={{background:'var(--bg)'}}>
                    {[['present','Présent','green'],['late','Retard','orange'],['absent','Absent','alert'],['excused','Excusé','blue']].map(([k,lab,tn])=>{
                      const on = a.status===k;
                      const bg = on ? (tn==='green'?'var(--green-600)':tn==='orange'?'var(--orange-500)':tn==='alert'?'var(--alert)':'var(--blue-600)') : 'transparent';
                      return <button key={k} onClick={()=>setAttFor(s.id,{status:k})} style={{border:'none',background:bg,color:on?'#fff':'var(--muted)',borderRadius:8,padding:'7px 10px',fontWeight:600,fontSize:12.5,cursor:'pointer'}}>{lab}</button>;
                    })}
                  </div>
                </div>
                <input className="input" style={{marginTop:8,fontSize:13}} placeholder="Remarque rapide (optionnel) — ex : a bien progressé sur les signes" value={a.remark} onChange={e=>setAttFor(s.id,{remark:e.target.value})}/>
                {canScore && <div className="row gap-8 wrap" style={{marginTop:8,alignItems:'center'}}>
                  <span className="t-11 faint w-700" style={{textTransform:'uppercase',letterSpacing:'.04em'}}>Note (optionnel)</span>
                  <div className="row gap-5 wrap">
                    {[8,10,12,14,16,18].map(n=>{
                      const on = String(a.score)===String(n);
                      return <button key={n} onClick={()=>setAttFor(s.id,{score: on?'':n})} style={{border:'1px solid '+(on?'var(--blue-700)':'var(--line)'),background:on?'var(--blue-700)':'#fff',color:on?'#fff':'var(--ink-2)',borderRadius:8,padding:'4px 9px',fontSize:12,fontWeight:700,cursor:'pointer'}}>{n}/20</button>;
                    })}
                  </div>
                  <input className="input" style={{width:80,padding:'4px 8px',fontSize:12.5}} placeholder="autre" inputMode="decimal" value={[8,10,12,14,16,18].includes(+a.score)?'':a.score} onChange={e=>setAttFor(s.id,{score: e.target.value.trim()===''?'':+e.target.value || e.target.value})}/>
                  {a.score!=='' && <span className="chip chip-blue w-700" style={{fontSize:11}}>Note : {a.score}/20</span>}
                </div>}
              </div>;
            })}
          </div>
        </div>
        {/* comments + homework */}
        <div className="card pad-24 col gap-14">
          <h3 className="row gap-8" style={{fontSize:16}}><Icon name="clipboard" size={17} style={{color:'var(--blue-700)'}}/>Bilan de la séance</h3>
          <Field label="Commentaire général (pour vous-même)">
            <textarea className="textarea" placeholder="Ex : le groupe a bien suivi sur la première moitié, plus distrait sur la seconde…" value={comments} onChange={e=>setCmts(e.target.value)} style={{minHeight:80}}/>
          </Field>
          <Field label="Devoirs donnés">
            <input className="input" placeholder="Ex : exercices 12 à 18 p.42" value={homework} onChange={e=>setHw(e.target.value)}/>
          </Field>
        </div>
        {/* À retenir — unified to-dos for this group (carry-over + new) */}
        <ScopedTodos groupId={session.groupId} title="À retenir pour la prochaine séance"
          defaultTag="lesson-prep"
          emptyHint="Notez ici ce que vous voulez préparer ou ne pas oublier avant la prochaine séance — fiche à chercher, exemple à revoir, élève à reprendre, etc."/>
      </div>
      {/* side */}
      <div className="col gap-14" style={{position:'sticky',top:90}}>
        <div className="card pad-20 col gap-12">
          <h3 style={{fontSize:16}}>Résumé</h3>
          <div className="row between"><span className="muted t-13">Programme traité</span><span className="w-700 t-15">{items.filter(p=>p.covered).length}/{items.length}</span></div>
          <div className="row between"><span className="muted t-13">Reporté</span><span className="w-700 t-15" style={{color:'var(--orange-600)'}}>{deferred.length}</span></div>
          <div className="row between"><span className="muted t-13">Présence</span><span className="w-700 t-15" style={{color:'var(--green-700)'}}>{Math.round(((presentCount+lateCount)/students.length)*100)||0}%</span></div>
          <div className="row between"><span className="muted t-13">Remarques saisies</span><span className="w-700 t-15">{Object.values(att).filter(a=>a.remark.trim()).length}/{students.length}</span></div>
          <div className="row between"><span className="muted t-13">Notes saisies</span><span className="w-700 t-15">{Object.values(att).filter(a=>a.score!==''&&a.score!=null).length}/{students.length}</span></div>
          <div className="row between"><span className="muted t-13">À retenir</span><span className="w-700 t-15">{Nav.todosByGroup(session.groupId).length}</span></div>
        </div>
        <Btn variant="green" icon="check" block onClick={save}>Enregistrer la séance</Btn>
        <Btn variant="ghost" icon="arrowl" block onClick={()=>go('group-detail', session.groupId)}>Annuler</Btn>
      </div>
    </div>
  </AppShell>;
}

function fmtFr(d){ if(!d) return ''; const x=new Date(d); if(isNaN(x)) return d; return x.toLocaleDateString('fr-FR',{day:'2-digit',month:'short',year:'numeric'}); }

/* Demo "today" anchor — used to decide whether a planned session is in the
   future ("Préparer") or today ("Saisir"). Single source of truth. */
const NAV_TODAY = '2026-05-22';
function todayDate(){ const d=new Date(NAV_TODAY); d.setHours(0,0,0,0); return d; }
// Returns {label, screen, param, primary} for any action on a session.
function sessionAction(sess){
  if(!sess) return {label:'Saisir la séance', screen:'attendance', param:null, primary:true};
  if(sess.status==='completed') return {label:'Voir le détail', screen:'session-entry', param:sess.id, primary:false};
  const today = todayDate();
  const sd = sess.date ? new Date(sess.date) : null;
  if(sd && !isNaN(sd) && sd.getTime() > today.getTime()){
    return {label:'Préparer la séance', screen:'session-plan', param:sess.id, primary:true};
  }
  return {label:'Saisir la séance', screen:'session-entry', param:sess.id, primary:true};
}
window.NAV_TODAY = NAV_TODAY;
window.todayDate = todayDate;
window.sessionAction = sessionAction;

/* ============================================================
   SessionPlan — lighter screen used BEFORE the session happens.
   Used to schedule a brand-new session or edit a planned one.
   Once the session day comes, the tutor flips into SessionEntry
   (the "saisie" mode with attendance, remarks, what got covered).
   ============================================================ */
function SessionPlan({go, id}){
  useStore();
  const isMobile = useIsMobile();
  // id can be: an existing session id (edit), or "new/<groupId>" (create)
  const isNew = !id || (id||'').startsWith('new');
  const newGroupId = isNew ? (id||'').replace(/^new\/?/,'') || (Nav.groupsAll()[0]||{}).id : null;
  const existing = !isNew ? Nav.sessionById(id) : null;
  const session = existing || {id:'sess'+Date.now(), groupId:newGroupId, date:'', plannedTopic:'', plannedItems:[], comments:'', homework:'', todos:[], attendance:[], status:'planned'};

  const [date, setDate] = React.useState(()=> session.date || nextLikelyDate(session.groupId));
  const [topic, setTopic] = React.useState(session.plannedTopic||'');
  const [items, setItems] = React.useState(()=>session.plannedItems||[]);
  const [comments, setCmts] = React.useState(session.comments||'');
  const [homework, setHw] = React.useState(session.homework||'');
  const [newItem, setNewItem] = React.useState('');
  const [groupId, setGroupId] = React.useState(session.groupId);
  // For new sessions, offer a "Reprendre la dernière séance" affordance.
  const lastCompletedSession = isNew ? Nav.lastCompletedSession(groupId) : null;
  const cloneFromLast = ()=>{
    if(!lastCompletedSession) return;
    // Carry over: topic suffix, planned items (uncovered + deferred ones especially),
    // homework hint. Don't carry comments/attendance.
    setTopic((lastCompletedSession.plannedTopic||'') + ' — suite');
    const carriedItems = (lastCompletedSession.plannedItems||[])
      .filter(p=>p.deferred || !p.covered)
      .map(p=>({id:'pi'+Date.now()+Math.random().toString(36).slice(2,5), text:p.text, covered:false}));
    // Plus a "Reprise" first item if there were deferred items
    if(carriedItems.length>0){
      setItems([
        {id:'pi'+Date.now()+'_intro', text:'Reprendre les points reportés de la dernière séance', covered:false},
        ...carriedItems,
      ]);
    } else {
      // Just clone the items list as-is (un-covered) so structure is reusable
      setItems((lastCompletedSession.plannedItems||[]).map(p=>({id:'pi'+Date.now()+Math.random().toString(36).slice(2,5), text:p.text, covered:false})));
    }
    setHw(lastCompletedSession.homework||'');
    navToast('Séance importée — modifiez ce que vous voulez','blue');
  };

  const addItem = ()=>{ if(!newItem.trim()) return; setItems(arr=>[...arr,{id:'pi'+Date.now(),text:newItem.trim(),covered:false}]); setNewItem(''); };
  const rmItem = (pid)=> setItems(arr=>arr.filter(p=>p.id!==pid));
  const moveItem = (idx, dir)=> setItems(arr=>{const c=[...arr]; const j=idx+dir; if(j<0||j>=c.length)return c; [c[idx],c[j]]=[c[j],c[idx]]; return c;});

  const group = Nav.groupById(groupId);
  const carriedTodos = Nav.todosBySession(session.id).concat(Nav.todosByGroup(groupId).filter(t=>!t.sessionId));

  const save = ()=>{
    Nav.upsertSession({...session, groupId, date, plannedTopic:topic, plannedItems:items, comments, homework, status:'planned'});
    navToast(isNew?'Séance planifiée':'Planification mise à jour','green');
    go('group-detail', groupId);
  };
  const startEntry = ()=>{
    // ensure saved first
    Nav.upsertSession({...session, groupId, date, plannedTopic:topic, plannedItems:items, comments, homework, status:'planned'});
    go('session-entry', session.id);
  };

  return <AppShell go={go} active="session-plan" title={isNew?'Nouvelle séance':'Planifier la séance'}
    crumbs={[{t:'Groupes',go:()=>go('groups')},{t:group?.name||'',go:()=>go('group-detail', groupId)},{t:isNew?'Nouvelle séance':'Planification'}]}
    actions={<>
      {!isNew && <Btn variant="ghost" icon="x" onClick={()=>{ if(confirm('Supprimer cette séance planifiée ?')){
        NavStore.set(d=>{const list=d.sessions||JSON.parse(JSON.stringify(NAV.sessions)); d.sessions=list.filter(s=>s.id!==session.id); return d;});
        navToast('Séance supprimée','orange'); go('group-detail', groupId);
      }}}>Supprimer</Btn>}
      <Btn variant="ghost" icon="check" onClick={save}>Enregistrer la planification</Btn>
      <Btn variant="primary" icon="arrow" onClick={startEntry}>Passer à la saisie</Btn>
    </>}>
    <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 320px',gap:20,alignItems:'start'}}>
      <div className="col gap-18">
        {isNew && lastCompletedSession && <div className="card pad-16 row between wrap" style={{background:'var(--blue-50)',border:'1px solid var(--blue-100)',gap:14}}>
          <div className="row gap-10">
            <div className="icn" style={{width:36,height:36,borderRadius:10,background:'var(--blue-700)',color:'#fff',display:'grid',placeItems:'center'}}><Icon name="clipboard" size={17}/></div>
            <div className="col" style={{gap:2}}>
              <span className="w-700 t-14">Reprendre la dernière séance</span>
              <span className="faint t-12">« {lastCompletedSession.plannedTopic} » — {(lastCompletedSession.plannedItems||[]).length} points, dont {(lastCompletedSession.plannedItems||[]).filter(p=>p.deferred||!p.covered).length} non traités</span>
            </div>
          </div>
          <Btn variant="soft" size="sm" icon="check" onClick={cloneFromLast}>Importer comme base</Btn>
        </div>}
        <div className="card pad-24 col gap-14">
          <h3 className="row gap-8" style={{fontSize:17}}><Icon name="calendar" size={18} style={{color:'var(--blue-700)'}}/>Quand & quoi</h3>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
            <Field label="Date"><input type="date" className="input" value={date} onChange={e=>setDate(e.target.value)}/></Field>
            <Field label="Groupe">
              <select className="select" value={groupId} onChange={e=>setGroupId(e.target.value)}>
                {Nav.groupsAll().map(g=><option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Sujet / chapitre" hint="Ce que vous prévoyez d'enseigner.">
            <input className="input" placeholder="Ex : Inéquations du 1er degré" value={topic} onChange={e=>setTopic(e.target.value)}/>
          </Field>
        </div>
        {/* planned items */}
        <div className="card pad-24 col gap-14">
          <div className="row between">
            <h3 className="row gap-8" style={{fontSize:17}}><Icon name="book" size={18} style={{color:'var(--blue-700)'}}/>Points prévus</h3>
            <span className="faint t-13 w-600">{items.length} point{items.length>1?'s':''}</span>
          </div>
          <p className="muted t-13" style={{marginTop:-6}}>La liste des choses à couvrir. Au moment de la séance, vous cocherez celles qui ont été traitées et marquerez celles qui ont été reportées.</p>
          <div className="col gap-8">
            {items.map((p,idx)=>
              <div key={p.id} className="row gap-8" style={{padding:'10px 12px',background:'#fff',border:'1px solid var(--line-2)',borderRadius:10}}>
                <span className="faint t-12 w-700 tnum" style={{minWidth:18}}>{idx+1}.</span>
                <input className="input" style={{flex:1,padding:'4px 8px',border:'none',background:'transparent',fontSize:14}} value={p.text} onChange={e=>setItems(arr=>arr.map(x=>x.id===p.id?{...x,text:e.target.value}:x))}/>
                <button className="btn btn-ghost btn-sm btn-icon" disabled={idx===0} onClick={()=>moveItem(idx,-1)} style={{opacity:idx===0?.3:1}}><Icon name="arrowl" size={13} style={{transform:'rotate(90deg)'}}/></button>
                <button className="btn btn-ghost btn-sm btn-icon" disabled={idx===items.length-1} onClick={()=>moveItem(idx,+1)} style={{opacity:idx===items.length-1?.3:1}}><Icon name="arrow" size={13} style={{transform:'rotate(90deg)'}}/></button>
                <button className="btn btn-ghost btn-sm btn-icon" onClick={()=>rmItem(p.id)}><Icon name="x" size={13}/></button>
              </div>
            )}
            <div className="row gap-8">
              <input className="input" placeholder="Ajouter un point au programme…" value={newItem} onChange={e=>setNewItem(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')addItem();}}/>
              <Btn variant="ghost" size="sm" icon="plus" onClick={addItem}>Ajouter</Btn>
            </div>
          </div>
        </div>
        {/* notes + homework target */}
        <div className="card pad-24 col gap-14">
          <h3 className="row gap-8" style={{fontSize:17}}><Icon name="clipboard" size={18} style={{color:'var(--blue-700)'}}/>Notes de préparation</h3>
          <Field label="Commentaire / objectifs">
            <textarea className="textarea" placeholder="Ex : Bien insister sur la traduction des énoncés. Quelques exercices simples avant les plus durs." value={comments} onChange={e=>setCmts(e.target.value)} style={{minHeight:80}}/>
          </Field>
          <Field label="Devoirs envisagés">
            <input className="input" placeholder="Ex : Fiche d'exercices 1 à 8" value={homework} onChange={e=>setHw(e.target.value)}/>
          </Field>
        </div>
        {/* prep todos */}
        <ScopedTodos groupId={groupId} sessionId={session.id} title="Tâches de préparation"
          defaultTag="lesson-prep"
          emptyHint="Ajoutez ici ce que vous voulez préparer avant cette séance (chercher un exemple, trouver une fiche, etc.)."/>
      </div>
      <div className="col gap-14" style={{position:'sticky',top:90}}>
        <div className="card pad-20 col gap-16">
          <span className="eyebrow">Récapitulatif</span>
          <div className="col gap-14">
            <div className="col gap-4"><span className="t-12 faint w-700" style={{textTransform:'uppercase',letterSpacing:'.04em'}}>Date</span><span className="w-700 t-14">{date?fmtFr(date):'—'}</span></div>
            <div className="col gap-4"><span className="t-12 faint w-700" style={{textTransform:'uppercase',letterSpacing:'.04em'}}>Groupe</span><span className="w-700 t-14">{group?.name||'—'}</span></div>
            <div className="col gap-4"><span className="t-12 faint w-700" style={{textTransform:'uppercase',letterSpacing:'.04em'}}>Sujet</span><span className="w-700 t-14">{topic||'—'}</span></div>
            <div className="col gap-4"><span className="t-12 faint w-700" style={{textTransform:'uppercase',letterSpacing:'.04em'}}>Points prévus</span><span className="w-700 t-14">{items.length}</span></div>
          </div>
        </div>
        <Btn variant="ghost" icon="check" block onClick={save}>Enregistrer la planification</Btn>
        <Btn variant="primary" icon="arrow" block onClick={startEntry}>Passer à la saisie</Btn>
        <Btn variant="ghost" block onClick={()=>go('group-detail', groupId)}>Annuler</Btn>
      </div>
    </div>
  </AppShell>;
}

// pick a plausible "next date" — today if today is a session day for this
// group's schedule, else tomorrow. Demo-grade only.
function nextLikelyDate(gid){
  const t = new Date('2026-05-22'); // demo time anchor
  return t.toISOString().slice(0,10);
}

window.SessionEntry = SessionEntry;
window.SessionPlan = SessionPlan;
window.fmtFr = fmtFr;
