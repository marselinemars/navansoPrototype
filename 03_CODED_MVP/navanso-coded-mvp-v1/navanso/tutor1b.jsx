/* NAVANSO — Group detail + Student profile/progress */

function GroupDetail({go, id}){
  useStore(); useLang();
  const isAr = NavI18n.lang==='ar';
  const isMobile = useIsMobile();
  const g = Nav.groupById(id) || Nav.groupsAll()[0];
  const tag={alert:'var(--alert)',orange:'var(--orange-500)',ok:'var(--green-600)'};
  const [tab, setTab] = React.useState('students');
  const sessions = Nav.sessionsByGroup(g.id);
  const groupStudents = Nav.studentsByGroup(g.id);
  const nextSess = Nav.nextPlannedSession(g.id);
  const lastSess = Nav.lastCompletedSession(g.id);
  const avgAtt = Math.round(groupStudents.reduce((s,x)=>s+x.att,0)/(groupStudents.length||1));
  const numericAvg = (()=>{ const ns = groupStudents.map(s=>parseFloat((s.result||'').split('/')[0])).filter(n=>!isNaN(n)); return ns.length?(ns.reduce((a,b)=>a+b,0)/ns.length).toFixed(1):'—'; })();
  const reportsPending = groupStudents.filter(s=>s.status==='pending').length;
  return <AppShell go={go} active="group-detail" title={g.name}
    crumbs={[{t:isAr?'الأفواج':'Groupes',go:()=>go('groups')},{t:g.name.split('—')[0].trim()}]}
    actions={<GroupDetailActions go={go} g={g} nextSess={nextSess}/>}>
    {/* group info bar */}
    <div className="card pad-20" style={{marginBottom:20}}>
      <div className="row between wrap" style={{gap:16}}>
        <div className="row gap-22 wrap">
          {[
            [isAr?'المادة':'Matière',g.subject,'book'],
            [isAr?'المستوى':'Niveau',g.level,'chart'],
            [isAr?'التّوقيت':'Horaire',isAr?'السبت والثلاثاء':'Samedi & Mardi','calendar'],
            [isAr?'المكان':'Lieu',g.loc,'pin']
          ].map(([l,v,ic])=>
            <div key={l} className="row gap-10"><div className="icn" style={{width:36,height:36,borderRadius:10,background:'var(--blue-50)',color:'var(--blue-700)',display:'grid',placeItems:'center'}}><Icon name={ic} size={17}/></div>
              <div className="col" style={{gap:1}}><span className="faint t-12 w-600">{l}</span><span className="w-700 t-14">{v}</span></div></div>)}
        </div>
        <div className="col" style={{alignItems:'flex-end',gap:8}}>
          <Places places={g.places} cap={g.cap}/>
          <div className="row gap-10"><SeatRow cap={g.cap} students={g.students}/><span className="faint t-12 w-600">{g.students}/{g.cap} {isAr?'تلاميذ':'élèves'}</span></div>
        </div>
      </div>
    </div>
    {/* Next session — prominent card with carry-over context */}
    {nextSess && (()=>{const act=sessionAction(nextSess);
      const actLab = isAr ? ({'Préparer la séance':'تحضير الحصّة','Saisir la séance':'تسجيل الحصّة','Voir le détail':'عرض التّفاصيل'}[act.label]||act.label) : act.label;
      return <div className="card pad-18 row between wrap" style={{marginBottom:18,background:'var(--green-50)',border:'1px solid var(--green-100)',gap:14}}>
      <div className="row gap-12">
        <div className="icn" style={{width:42,height:42,borderRadius:12,background:'var(--green-600)',color:'#fff',display:'grid',placeItems:'center',flex:'none'}}><Icon name="clock" size={20}/></div>
        <div className="col" style={{gap:3}}>
          <span className="row gap-8 t-12 faint w-700" style={{textTransform:'uppercase',letterSpacing:'.04em'}}>{isAr?'الحصّة القادمة':'Prochaine séance'} · {fmtDateLoc?fmtDateLoc(nextSess.date):(fmtFr?fmtFr(nextSess.date):nextSess.date)}</span>
          <span className="w-700 t-16">{txData?txData(nextSess.plannedTopic):nextSess.plannedTopic}</span>
          {Nav.carryOverTodos(g.id).length>0 && <span className="t-12 muted">{Nav.carryOverTodos(g.id).length} {isAr?'نقطة لاستئنافها من الحصّة السّابقة':`point${Nav.carryOverTodos(g.id).length>1?'s':''} à reprendre de la séance précédente`}</span>}
        </div>
      </div>
      <Btn variant="green" icon={act.screen==='session-plan'?'edit':'arrow'} onClick={()=>go(act.screen, act.param)}>{actLab}</Btn>
    </div>;})()}
    {/* summary stats — computed from real data */}
    <div style={{display:'grid',gridTemplateColumns:isMobile?'repeat(2,1fr)':'repeat(4,1fr)',gap:14,marginBottom:20}}>
      <Kpi icon="calendar" tone="green" value={avgAtt+'%'} label={isAr?'الحضور المتوسّط':'Présence moyenne'}/>
      <Kpi icon="chart" tone="blue" value={numericAvg} label={isAr?'معدّل الفوج':'Moyenne du groupe'} sub="/20"/>
      <Kpi icon="file" tone="orange" value={reportsPending} label={isAr?'تقارير في الانتظار':'Rapports en attente'}/>
      <Kpi icon="book" tone="blue" value={sessions.filter(s=>s.status==='completed').length} label={isAr?'حصص مُنجَزة':'Séances réalisées'}/>
    </div>
    {/* tabs */}
    {(()=>{const month=Nav.currentMonth();
      const groupPays = Nav.paymentsByGroup(g.id, month);
      const paidN = groupPays.filter(p=>p.status==='paid').length;
      const groupOverdue = groupPays.filter(p=>p.status==='overdue').length;
      return <div className="row gap-14 wrap" style={{marginBottom:18,marginTop:4,borderBottom:'1px solid var(--line-2)',rowGap:0}}>
        {[['students',(isAr?'التّلاميذ':'Élèves')],['sessions',isAr?`الحصص (${sessions.length})`:`Séances (${sessions.length})`],['payments',isAr?`الدّفع (${paidN}/${groupStudents.length})`:`Paiements (${paidN}/${groupStudents.length})`,groupOverdue]].map(([k,lab,badge])=>
          <button key={k} onClick={()=>setTab(k)} style={{border:'none',background:'transparent',padding:'11px 4px',cursor:'pointer',fontWeight:700,fontSize:14,color:tab===k?'var(--blue-700)':'var(--muted)',borderBottom:tab===k?'2px solid var(--blue-700)':'2px solid transparent',marginBottom:-1,display:'inline-flex',alignItems:'center',gap:6}}>
            {lab}{badge?<span className="chip chip-weak" style={{fontSize:10,padding:'1px 5px',background:'rgba(216,99,46,.18)',color:'var(--alert)'}}>{badge}</span>:null}
          </button>
        )}
      </div>;
    })()}
    <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 300px',gap:20,alignItems:'start'}}>
      {/* student table */}
      {tab==='students' && <div className="card" style={{overflow:'hidden'}}>
        <div className="row between" style={{padding:'16px 18px'}}>
          <h3 style={{fontSize:17}}>{isAr?'تلاميذ الفوج':'Élèves du groupe'}</h3>
          <Btn variant="soft" size="sm" icon="plus" onClick={()=>go('add-student', g.id)}>{isAr?'إضافة تلميذ':'Ajouter un élève'}</Btn>
        </div>
        <table className="tbl">
          <thead><tr><th>{isAr?'التّلميذ':'Élève'}</th><th>{isAr?'الوالد':'Parent'}</th><th>{isAr?'الحضور':'Présence'}</th><th>{isAr?'آخر علامة':'Dernière note'}</th><th>{isAr?'نقطة ضعف':'Point faible'}</th><th>{isAr?'تقرير':'Rapport'}</th><th></th></tr></thead>
          <tbody>
            {groupStudents.map(s=>
              <tr key={s.id} style={{cursor:'pointer'}} onClick={()=>go('student-profile', s.id)}>
                <td><div className="row gap-10"><Avatar initials={s.initials} cls={s.av} size={32}/><span className="w-600">{s.name}</span></div></td>
                <td className="muted">{isAr?txData(s.parent):s.parent}</td>
                <td><div className="row gap-8"><div style={{width:54}}><Bar pct={s.att} tone={s.att>=85?'':'orange'}/></div><span className="t-13 w-600 tnum">{s.att}%</span></div></td>
                <td><span className="w-700 tnum">{s.result}</span></td>
                <td>{s.weak==='—'?<span className="faint">—</span>:<span className="chip chip-weak">{txData?txData(s.weak):s.weak}</span>}</td>
                <td>{s.status==='pending'?<span className="badge badge-pending"><Icon name="clock" size={12}/>{isAr?'للإرسال':'À envoyer'}</span>:<span className="badge badge-verified"><Icon name="check" size={12}/>{isAr?'مُرسَل':'Envoyé'}</span>}</td>
                <td><Icon name="chevron" size={16} style={{color:'var(--faint)'}}/></td>
              </tr>)}
          </tbody>
        </table>
      </div>}
      {tab==='payments' && <div className="col gap-12">
        {(()=>{const month=Nav.currentMonth();
          const rows = groupStudents.map(s=>{
            const p = Nav.paymentsAll().find(x=>x.studentId===s.id && x.month===month);
            return {s, p: p || {id:null, studentId:s.id, groupId:s.groupId, month, amount:g.monthlyFee||1500, status:'missing'}};
          });
          const expected = rows.reduce((n,r)=>n+(r.p.amount||0),0);
          const collected = rows.filter(r=>r.p.status==='paid').reduce((n,r)=>n+(r.p.amount||0),0);
          return <>
            <div className="card pad-16 row between wrap" style={{gap:14,background:'var(--blue-50)',border:'1px solid var(--blue-100)'}}>
              <div className="row gap-10">
                <Icon name="file" size={18} style={{color:'var(--blue-700)'}}/>
                <span className="t-14 w-600" style={{color:'var(--blue-800)'}}>{isAr?`دفعات ${fmtMonthFr(month)} · ${fmtMoney(collected)} مُحصَّل من ${fmtMoney(expected)}`:`Paiements de ${fmtMonthFr(month)} · ${fmtMoney(collected)} encaissé sur ${fmtMoney(expected)}`}</span>
              </div>
              <Btn variant="ghost" size="sm" iconR="arrow" onClick={()=>go('payments')}>{isAr?'العرض الكامل':'Vue complète'}</Btn>
            </div>
            <div className="card" style={{overflow:'hidden'}}>
              <table className="tbl">
                <thead><tr><th>{isAr?'التّلميذ':'Élève'}</th><th>{isAr?'الوليّ':'Parent'}</th><th>{isAr?'المبلغ':'Montant'}</th><th>{isAr?'الحالة':'Statut'}</th><th>{isAr?'التّاريخ':'Date'}</th><th></th></tr></thead>
                <tbody>
                  {rows.map(r=>{
                    const parent = Nav.parentById(r.s.parentId);
                    return <tr key={r.s.id} style={r.p.status==='overdue'?{background:'var(--orange-50)'}:{}}>
                      <td><div className="row gap-10"><Avatar initials={r.s.initials} cls={r.s.av} size={28}/><span className="w-600 t-13">{r.s.name}</span></div></td>
                      <td className="muted t-13">{isAr?(txData(parent?.name)||'—'):(parent?.name||'—')}</td>
                      <td className="w-700 t-13 tnum">{fmtMoney(r.p.amount)}</td>
                      <td><PaymentChip status={r.p.status}/></td>
                      <td className="muted t-13">{r.p.paidAt?(fmtDateLoc?fmtDateLoc(r.p.paidAt):fmtFr(r.p.paidAt)):'—'}</td>
                      <td>
                        {r.p.status!=='paid'
                          ? <Btn variant="green" size="sm" icon="check" onClick={()=>{
                              if(r.p.id) Nav.markPaymentPaid(r.p.id);
                              else Nav.recordPayment({studentId:r.s.id, month, amount:r.p.amount, method:'cash'});
                              navToast(isAr?'تمّ تسجيل الدّفع':'Paiement enregistré','green');
                            }}>{isAr?'مدفوع':'Payé'}</Btn>
                          : <Btn variant="ghost" size="sm" onClick={()=>Nav.markPaymentPending(r.p.id)}>{isAr?'إلغاء':'Annuler'}</Btn>}
                      </td>
                    </tr>;
                  })}
                </tbody>
              </table>
            </div>
          </>;
        })()}
      </div>}
      {tab==='sessions' && <div className="col gap-12">
        <div className="row between wrap" style={{marginBottom:4,gap:10}}>
          <span className="muted t-13 w-600">{isAr?`${sessions.length} حصّة إجمالاً · ${sessions.filter(s=>s.status==='planned').length} مُخطَّطة`:`${sessions.length} séance${sessions.length>1?'s':''} au total · ${sessions.filter(s=>s.status==='planned').length} planifiée${sessions.filter(s=>s.status==='planned').length>1?'s':''}`}</span>
          <div className="row gap-7 wrap">
            <RecurringGenerator gid={g.id}/>
            <Btn variant="primary" size="sm" icon="plus" onClick={()=>go('session-plan', 'new/'+g.id)}>{isAr?'حصّة جديدة':'Nouvelle séance'}</Btn>
          </div>
        </div>
        {sessions.length===0 && <div className="card pad-24 col center" style={{gap:10,textAlign:'center',padding:'40px 24px'}}>
          <Icon name="calendar" size={32} style={{color:'var(--faint)'}}/>
          <span className="muted">{isAr?'لا توجد حصّة لهذا الفوج.':'Aucune séance pour ce groupe.'}</span>
          <Btn variant="primary" size="sm" icon="plus" onClick={()=>go('session-plan', 'new/'+g.id)}>{isAr?'إنشاء أوّل حصّة':'Créer la première séance'}</Btn>
        </div>}
        {sessions.map(s=>{
          const planned = s.status==='planned';
          const covered = (s.plannedItems||[]).filter(p=>p.covered).length;
          const total = (s.plannedItems||[]).length;
          const deferred = (s.plannedItems||[]).filter(p=>p.deferred).length;
          const prepTodos = Nav.todosBySession(s.id).length;
          return <div key={s.id} className="card pad-18 col gap-10" style={{border: planned?'1px dashed var(--orange-200, var(--orange-100))':'1px solid var(--line)',background: planned?'var(--orange-50)':'#fff'}}>
            <div className="row between wrap" style={{gap:10}}>
              <div className="col" style={{gap:3}}>
                <div className="row gap-10"><span className="w-700 t-15">{txData?txData(s.plannedTopic||(isAr?'(بدون عنوان)':'(Sans titre)')):(s.plannedTopic||'(Sans titre)')}</span>
                  {planned ? <span className="chip chip-orange w-700"><Icon name="clock" size={12}/>{isAr?'مُخطَّطة':'Planifiée'}</span>
                          : <span className="chip chip-green w-700"><Icon name="check" size={12}/>{isAr?'مُنجَزة':'Réalisée'}</span>}
                  {planned && prepTodos>0 && <span className="chip chip-blue" style={{fontSize:11}}><Icon name="target" size={11}/>{prepTodos} {isAr?'مهمّة تحضير':`tâche${prepTodos>1?'s':''} prépa`}</span>}
                </div>
                <span className="faint t-12">{fmtDateLoc?fmtDateLoc(s.date):(fmtFr?fmtFr(s.date):s.date)}{total>0 && !planned ? (isAr?` · ${total} نقطة في البرنامج`:` · ${total} point${total>1?'s':''} au programme`):''}</span>
              </div>
              <div className="row gap-7">
                {planned
                  ? (()=>{const a=sessionAction(s);
                      const actLab = isAr ? ({'Préparer la séance':'تحضير الحصّة','Saisir la séance':'تسجيل الحصّة','Voir le détail':'عرض التّفاصيل'}[a.label]||a.label) : a.label;
                      return <>
                      <Btn variant="ghost" size="sm" icon="edit" onClick={()=>go('session-plan', s.id)}>{isAr?'تعديل':'Modifier'}</Btn>
                      <Btn variant="primary" size="sm" iconR="arrow" onClick={()=>go(a.screen, a.param)}>{actLab}</Btn>
                    </>;})()
                  : <Btn variant="ghost" size="sm" iconR="arrow" onClick={()=>go('session-entry', s.id)}>{isAr?'عرض التّفاصيل':'Voir le détail'}</Btn>}
              </div>
            </div>
            {!planned && <div className="row gap-12 wrap t-13">
              <span className="row gap-6 muted w-600"><Icon name="check" size={13} style={{color:'var(--green-600)'}}/>{covered}/{total} {isAr?'مُغطّاة':'traités'}</span>
              {deferred>0 && <span className="row gap-6 muted w-600"><Icon name="clock" size={13} style={{color:'var(--orange-600)'}}/>{deferred} {isAr?'مُؤجَّل':`reporté${deferred>1?'s':''}`}</span>}
              {s.todos && s.todos.filter(t=>t.carryToNext && !t.done).length>0 && <span className="row gap-6 muted w-600"><Icon name="target" size={13} style={{color:'var(--blue-600)'}}/>{s.todos.filter(t=>t.carryToNext && !t.done).length} {isAr?'للاستئناف':'à reprendre'}</span>}
              <span className="row gap-6 muted w-600"><Icon name="users" size={13}/>{(s.attendance||[]).filter(a=>a.status==='present'||a.status==='late').length}/{(s.attendance||[]).length} {isAr?'حاضرين':'présents'}</span>
            </div>}
            {s.comments && <p className="t-13 lh-14" style={{color:'var(--ink-2)',fontStyle:'italic'}}>« {txData?txData(s.comments):s.comments} »</p>}
          </div>;
        })}
      </div>}
      {/* side: consolidated session context + group todos */}
      <div className="col gap-18">
        {/* Contexte de la prochaine séance — merges last-session + carry-over */}
        <div className="card pad-20 col gap-12">
          <h3 className="row gap-8" style={{fontSize:15}}><Icon name="clock" size={16} style={{color:'var(--blue-700)'}}/>{isAr?'سياق الحصّة القادمة':'Contexte de la prochaine séance'}</h3>
          {lastSess ? <div className="card-flat" style={{padding:'10px 12px',borderRadius:10,background:'var(--bg)',border:'1px solid var(--line-2)'}}>
            <span className="t-11 faint w-700" style={{textTransform:'uppercase',letterSpacing:'.04em'}}>{isAr?'الحصّة الأخيرة':'Dernière séance'} · {fmtDateLoc?fmtDateLoc(lastSess.date):(fmtFr?fmtFr(lastSess.date):lastSess.date)}</span>
            <div className="w-700 t-14" style={{marginTop:2}}>{txData?txData(lastSess.plannedTopic||'—'):(lastSess.plannedTopic||'—')}</div>
            {lastSess.comments && <p className="t-12 lh-14" style={{color:'var(--ink-2)',fontStyle:'italic',marginTop:6}}>« {txData?txData(lastSess.comments):lastSess.comments} »</p>}
            {lastSess.homework && <div className="t-12 muted" style={{marginTop:4}}><b>{isAr?'الواجبات:':'Devoirs :'}</b> {txData?txData(lastSess.homework):lastSess.homework}</div>}
            <button onClick={()=>go('session-entry', lastSess.id)} className="t-12 w-700" style={{background:'none',border:'none',color:'var(--blue-700)',cursor:'pointer',padding:0,marginTop:6,display:'inline-flex',alignItems:'center',gap:4}}>{isAr?'عرض التّفاصيل':'Voir le détail'} <Icon name="arrow" size={12}/></button>
          </div> : <span className="faint t-13">{isAr?'لا توجد حصّة سابقة.':'Aucune séance antérieure.'}</span>}
          {Nav.carryOverTodos(g.id).length>0 && <div className="card-flat" style={{padding:'10px 12px',borderRadius:10,background:'var(--orange-50)',border:'1px solid var(--orange-100)'}}>
            <span className="row gap-6 t-11 w-700" style={{color:'var(--orange-600)',textTransform:'uppercase',letterSpacing:'.04em'}}><Icon name="target" size={12}/>{isAr?'للاستئناف':'À reprendre'}</span>
            <div className="col gap-2" style={{marginTop:6}}>
              {Nav.carryOverTodos(g.id).map(t=><div key={t.id} className="t-13" style={{color:'var(--ink-2)'}}>• {txData?txData(t.text):t.text}</div>)}
            </div>
          </div>}
        </div>
        {/* Group-scoped to-dos */}
        <ScopedTodos groupId={g.id} title={isAr?'مهامّ هذا الفوج':'Tâches pour ce groupe'} defaultTag="lesson-prep"
          emptyHint={isAr?'أضف مهامّ عامّة: الفصل القادم للتّحضير، ورقة للبحث عنها، إلخ.':'Ajoutez des tâches générales : prochain chapitre à préparer, fiche à chercher, etc.'}/>
      </div>
    </div>
  </AppShell>;
}

/* ---------------- STUDENT PROFILE ---------------- */
function StudentProfile({go, id}){
  useStore(); useLang();
  const isAr = NavI18n.lang==='ar';
  const isMobile = useIsMobile();
  const [tab, setTab] = React.useState('suivi'); // suivi | historique | rapports
  const sid = id || 's1';
  const s = Nav.studentById(sid) || Nav.studentById('s1');
  const parent = Nav.parentById(s.parentId);
  const group = Nav.groupById(s.groupId);
  // Yacine-style demo fields; for non-Yacine students we synthesize a lightweight profile.
  const isYacine = s.id==='s1';
  const y = isYacine ? NAV.yacine : {
    name:s.name, initials:s.initials, av:s.av,
    level:s.level||'4e année moyenne', subject:s.subject||'Mathématiques', group:(group||{}).name||'',
    parent:s.parent, parentContact:'WhatsApp',
    att:s.att, attFrac:`${Math.round((s.att/100)*6)} séances sur 6`,
    result:s.result, prevResult:'—', trend:'+0',
    strengths:['Participation régulière'],
    weak:[s.weak||'—'],
    reco:'Suivre le rythme du groupe.',
    note:'Élève suivi.',
    lastLesson:(Nav.lastCompletedSession(s.groupId)||{}).plannedTopic||'—',
  };
  const store=NavStore.get();
  const pts=pointsOf(sid);
  const remarks=store.remarks[sid]||[];
  // Find or create thread with this parent
  const thread = Nav.threadsAll().find(t=>t.parentId===s.parentId && t.studentId===sid);
  return <AppShell go={go} active="student-profile" title={y.name}
    crumbs={[{t:isAr?'تلاميذي':'Mes élèves',go:()=>go('students')},{t:(group||{}).name||'',go:()=>group?go('group-detail', group.id):null},{t:(s.name||'').split(' ')[0]}].filter(c=>c.t)}
    actions={<><Btn variant="ghost" icon="clipboard" onClick={()=>go('assessment')}>{isAr?'إضافة تقييم':'Ajouter une évaluation'}</Btn><Btn variant="primary" icon="file" onClick={()=>go('report-gen')}>{isAr?'توليد تقرير':'Générer un rapport'}</Btn></>}>
    <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 320px',gap:20,alignItems:'start'}}>
      <div className="col gap-18">
        {/* identity */}
        <div className="card pad-24 row gap-18" style={{alignItems:'center'}}>
          <Avatar initials={y.initials} cls="av-o" size={68} ring/>
          <div className="col gap-7 grow">
            <h2 style={{fontSize:22}}>{y.name}</h2>
            <div className="row gap-7 wrap">
              <span className="chip chip-blue">{txData?txData(y.subject):y.subject}</span>
              <span className="chip chip-gray">{txData?txData(y.level):y.level}</span>
              <span className="chip chip-gray"><Icon name="users" size={13}/>{y.group}</span>
            </div>
          </div>
          <div className="col" style={{alignItems:'flex-end',gap:6}}>
            <span className="faint t-12 w-600">{isAr?'الوليّ':'Parent'} · {y.parent}{parent?.phone?` · ${parent.phone}`:''}</span>
            {(()=>{const ps=Nav.paymentStatusFor(sid); return <div className="row gap-8" style={{alignItems:'center'}}>
              <span className="faint t-12">{isAr?'الدّفع':'Paiement'} {fmtMonthFr?fmtMonthFr(Nav.currentMonth()):''} :</span>
              <PaymentChip status={ps.status}/>
            </div>;})()}
            <div className="row gap-8">
              {thread && <Btn variant="ghost" size="sm" icon="wa" onClick={()=>go('thread', thread.id)}>{isAr?'المحادثة':'Conversation'}</Btn>}
              <Btn variant="green" size="sm" icon="wa" onClick={()=>{
                if(parent?.phone){
                  const msg = isAr
                    ? `السّلام عليكم ${txData(parent.name)}، أنا ${txData(NAV.tutor.short)}. مستجدّات صغيرة بخصوص ${s.name.split(' ')[0]}…`
                    : `Bonjour ${parent.name}, c'est ${NAV.tutor.short}. Petit point sur ${s.name.split(' ')[0]}…`;
                  window.open(`https://wa.me/${(parent.phone||'').replace(/[^0-9]/g,'')}?text=${encodeURIComponent(msg)}`,'_blank');
                } else go('whatsapp-share');
              }}>{isAr?'مراسلة الوليّ':'Contacter le parent'}</Btn>
            </div>
          </div>
        </div>
        <PrivacyNote/>
        {/* progress stats — always visible (stack on narrow phones) */}
        <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'repeat(3,1fr)',gap:14}}>
          <div className="card pad-20 col gap-10">
            <span className="t-12 faint w-700" style={{textTransform:'uppercase',letterSpacing:'.04em'}}>{isAr?'الحضور':'Présence'}</span>
            <div className="row" style={{alignItems:'baseline',gap:6}}><span className="stat-num" style={{fontSize:30,color:'var(--green-700)'}}>{y.att}%</span><span className="faint t-13">{attFracLoc?attFracLoc(y.attFrac):y.attFrac}</span></div>
            <Bar pct={y.att}/>
          </div>
          <div className="card pad-20 col gap-10">
            <span className="t-12 faint w-700" style={{textTransform:'uppercase',letterSpacing:'.04em'}}>{isAr?'آخر علامة':'Dernière note'}</span>
            <div className="row" style={{alignItems:'baseline',gap:8}}><span className="stat-num" style={{fontSize:30,color:'var(--blue-700)'}}>{y.result}</span><span className="chip chip-green"><Icon name="trend" size={13}/>{y.trend} {isAr?'نقطة':'pts'}</span></div>
            <Bar pct={60} tone="blue"/>
          </div>
          <div className="card pad-20 col gap-10">
            <span className="t-12 faint w-700" style={{textTransform:'uppercase',letterSpacing:'.04em'}}>{isAr?'الاتّجاه':'Tendance'}</span>
            <div className="row gap-3" style={{alignItems:'flex-end',height:42}}>
              {[40,32,55,48,70].map((h,i)=><div key={i} style={{flex:1,height:h+'%',borderRadius:4,background:i===4?'var(--green-500)':'var(--blue-100)'}}></div>)}
            </div>
            <span className="faint t-12">{isAr?'آخر 5 تقييمات':'5 dernières évaluations'}</span>
          </div>
        </div>
        {/* Tabs */}
        <div className="row gap-14" style={{borderBottom:'1px solid var(--line-2)',marginTop:6,marginBottom:6}}>
          {[['suivi',(isAr?'المتابعة الحاليّة':'Suivi en cours')],['historique',isAr?`السّجلّ (${remarks.length})`:`Historique (${remarks.length})`],['rapports',isAr?`التّقارير (${Nav.reportsByStudent(sid).filter(r=>r.status!=='draft').length})`:`Rapports (${Nav.reportsByStudent(sid).filter(r=>r.status!=='draft').length})`]].map(([k,lab])=>
            <button key={k} onClick={()=>setTab(k)} style={{border:'none',background:'transparent',padding:'11px 4px',cursor:'pointer',fontWeight:700,fontSize:14,color:tab===k?'var(--blue-700)':'var(--muted)',borderBottom:tab===k?'2px solid var(--blue-700)':'2px solid transparent',marginBottom:-1}}>{lab}</button>
          )}
        </div>
        {tab==='suivi' && <>
        {/* ScopedTodos at top of Suivi — actionable, near the top */}
        <ScopedTodos studentId={sid} title={isAr?'مهامّ هذا التّلميذ':'Tâches pour cet élève'} defaultTag="student-followup"
          emptyHint={isAr?'مثلاً: تذكير الوليّ · تحضير تمرين خاصّ · تهنئة في الحصّة القادمة.':'Ex : rappeler le parent · préparer un exercice spécifique · le féliciter à la prochaine séance.'}/>
        {/* tracked follow-up points — built from session remarks, teacher-controlled */}
        <div className="card pad-24 col gap-16">
          <div className="row between wrap" style={{gap:10}}>
            <div className="col" style={{gap:4}}>
              <h3 className="row gap-8" style={{fontSize:16}}><Icon name="target" size={18} style={{color:'var(--orange-600)'}}/>{isAr?'نقاط المتابعة':'Points de suivi'}</h3>
              <span className="muted t-13 lh-14" style={{maxWidth:380}}>{isAr?'المساعد يقترح نقاط متابعة انطلاقاً من ملاحظات الأستاذ.':'L’assistant propose des points de suivi à partir des remarques de l’enseignant.'}</span>
              <span className="scope scope-future" style={{borderStyle:'solid',background:'var(--orange-50)',color:'var(--orange-600)',borderColor:'var(--orange-100)',alignSelf:'flex-start'}}><Icon name="shield" size={12}/>{isAr?'يحتاج إلى تأكيد الأستاذ':'À confirmer par l’enseignant'}</span>
            </div>
            <Btn variant="soft" size="sm" icon="sparkle" onClick={()=>{analyzeRemarks(sid);navToast(isAr?'نقاط مُقترَحة — تحتاج إلى تأكيد الأستاذ':'Points proposés — à confirmer par l’enseignant','blue');}}>{isAr?'الاقتراح انطلاقاً من الملاحظات':'Proposer à partir des remarques'}</Btn>
          </div>
          <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:16}}>
            <div className="col gap-10">
              <span className="t-11 faint w-700" style={{textTransform:'uppercase',letterSpacing:'.04em'}}>{isAr?`يحتاج إلى مراجعة (${pts.active.length})`:`À travailler (${pts.active.length})`}</span>
              {pts.active.length? pts.active.map(p=>
                <div key={p.id} className="card-flat" style={{padding:'10px 12px',borderRadius:10,border:'1px solid var(--orange-100)',background:'var(--orange-50)'}}>
                  <div className="row between" style={{gap:8}}>
                    <div className="col" style={{gap:1}}><span className="w-700 t-14" style={{color:'var(--orange-600)'}}>{txData?txData(p.label):p.label}</span><span className="faint t-11">{isAr?`منذ ${p.since} · ${p.mentions} ذكر`:`depuis ${p.since} · ${p.mentions} mention${p.mentions>1?'s':''}`}</span></div>
                    <button className="btn btn-sm btn-ghost" style={{flex:'none'}} onClick={()=>{togglePoint(sid,p.id);navToast(isAr?'تمّ تسجيله كمُصحَّح':'Marqué comme corrigé');}}><Icon name="check" size={14}/>{isAr?'مُصحَّح':'Résolu'}</button>
                  </div>
                </div>) : <span className="faint t-13">{isAr?'لا توجد نقطة جارية. 🎉':'Aucun point en cours. 🎉'}</span>}
            </div>
            <div className="col gap-10">
              <span className="t-11 w-700" style={{textTransform:'uppercase',letterSpacing:'.04em',color:'var(--green-700)'}}>{isAr?`مُصحَّح / محسَّن (${pts.resolved.length})`:`Corrigé / amélioré (${pts.resolved.length})`}</span>
              {pts.resolved.length? pts.resolved.map(p=>
                <div key={p.id} className="card-flat" style={{padding:'10px 12px',borderRadius:10,border:'1px solid var(--green-100)',background:'var(--green-50)'}}>
                  <div className="row between" style={{gap:8}}>
                    <div className="row gap-8"><Icon name="checkc" size={16} style={{color:'var(--green-600)',flex:'none'}}/><span className="w-700 t-14" style={{color:'var(--green-700)'}}>{txData?txData(p.label):p.label}</span></div>
                    <button className="btn btn-sm btn-ghost" style={{flex:'none'}} onClick={()=>togglePoint(sid,p.id)}>{isAr?'إعادة فتح':'Rouvrir'}</button>
                  </div>
                </div>) : <span className="faint t-13">{isAr?'لم يُصحَّح شيء حاليّاً.':'Rien de corrigé pour l’instant.'}</span>}
            </div>
          </div>
          <div className="card-flat" style={{padding:'10px 13px',borderRadius:10,background:'var(--blue-50)',border:'none'}}>
            <span className="row gap-8 t-12 w-600" style={{color:'var(--blue-800)'}}><Icon name="shield" size={14}/>{isAr?'النّقاط المُصحَّحة ستُنقَل إلى الوالد كتقدّم في التّقرير القادم.':'Les points corrigés seront communiqués au parent comme des progrès dans le prochain rapport.'}</span>
          </div>
        </div>
        {/* strengths */}
        <div className="card pad-20 col gap-12">
          <h3 className="row gap-8" style={{fontSize:16}}><Icon name="check" size={18} style={{color:'var(--green-600)'}}/>{isAr?'النّقاط القويّة':'Points forts'}</h3>
          <div className="col gap-9">{y.strengths.map((s,i)=><div key={i} className="row gap-9" style={{alignItems:'flex-start'}}><div style={{width:6,height:6,borderRadius:9,background:'var(--green-500)',marginTop:7,flex:'none'}}></div><span className="t-14 lh-14" style={{color:'var(--ink-2)'}}>{txData?txData(s):s}</span></div>)}</div>
        </div>
        {/* recommendation */}
        <div className="card pad-24 col gap-12" style={{background:'var(--green-50)',border:'1px solid var(--green-100)'}}>
          <h3 className="row gap-8" style={{fontSize:16}}><Icon name="flag" size={18} style={{color:'var(--green-700)'}}/>{isAr?'توصية للبيت':'Recommandation pour la maison'}</h3>
          <p className="t-15 lh-15" style={{color:'var(--ink-2)'}}>{txData?txData(y.reco):y.reco}</p>
        </div>
        </>}
        {tab==='historique' && <>
        {/* session remarks history — the simple memory the teacher needs */}
        <div className="card pad-24 col gap-14">
          <div className="row between">
            <h3 className="row gap-8" style={{fontSize:16}}><Icon name="clipboard" size={18} style={{color:'var(--blue-700)'}}/>{isAr?'سجلّ الملاحظات':'Historique des remarques'}</h3>
            <span className="faint t-13 w-600">{remarks.length} {isAr?'حصّة':'séance'}{!isAr&&remarks.length>1?'s':''}</span>
          </div>
          <TimeSave>{isAr?'تتحوّل ملاحظات الحصص تلقائيّاً إلى قاعدة للتّقرير.':'Les remarques de séance deviennent automatiquement une base de rapport.'}</TimeSave>
          {remarks.length===0 && <p className="faint t-14">{isAr?'لا توجد ملاحظات بعد. أضِف بعد كلّ حصّة.':'Aucune remarque pour l’instant. Ajoutez-en après une séance.'}</p>}
          <div className="col">
            {remarks.map((r,i)=>
              <div key={r.id} className="row gap-14" style={{padding:'13px 0',borderTop:i>0?'1px solid var(--line-2)':'none',alignItems:'flex-start'}}>
                <div className="col" style={{width:60,flex:'none',gap:2}}>
                  <span className="w-700 t-13">{fmtDateLoc?fmtDateLoc(r.date):r.date}</span>
                  <span className={`t-11 w-600`} style={{color:r.present===false?'var(--alert)':'var(--green-600)'}}>{r.present===false?(isAr?'غائب':'Absent'):(isAr?'حاضر':'Présent')}</span>
                </div>
                <div className="col grow" style={{gap:6}}>
                  <span className="w-600 t-13 muted">{txData?txData(r.topic):r.topic}</span>
                  <p className="t-14 lh-15" style={{color:'var(--ink-2)'}}>{r.text?(txData?txData(r.text):r.text):<span className="faint">— ({isAr?'لا توجد ملاحظة مكتوبة':'pas de remarque écrite'})</span>}</p>
                  {((r.flags&&r.flags.length)||r.score)?<div className="row gap-6 wrap">
                    {(r.flags||[]).map((f,j)=><span key={j} className="chip chip-weak" style={{fontSize:11}}>{txData?txData(f):f}</span>)}
                    {r.score&&<span className="chip chip-blue" style={{fontSize:11}}>{r.score}/20</span>}
                  </div>:null}
                </div>
              </div>)}
          </div>
        </div>
        {/* assessments history */}
        <div className="card" style={{overflow:'hidden'}}>
          <div className="row between" style={{padding:'16px 18px'}}><h3 style={{fontSize:16}}>{isAr?'سجلّ التّقييمات':'Historique des évaluations'}</h3><Btn variant="soft" size="sm" icon="plus" onClick={()=>go('assessment')}>{isAr?'إضافة':'Ajouter'}</Btn></div>
          <table className="tbl">
            <thead><tr><th>{isAr?'التّاريخ':'Date'}</th><th>{isAr?'الموضوع':'Sujet'}</th><th>{isAr?'العلامة':'Note'}</th><th></th></tr></thead>
            <tbody>{NAV.yacineAssessments.map((a,i)=><tr key={i}><td className="muted w-600">{fmtDateLoc?fmtDateLoc(a.date):a.date}</td><td className="w-600">{txData?txData(a.topic):a.topic}</td><td><span className="chip chip-orange tnum">{a.score}</span></td><td><Icon name="chevron" size={15} style={{color:'var(--faint)'}}/></td></tr>)}</tbody>
          </table>
        </div>
        </>}
        {tab==='rapports' && <>
        <div className="card pad-24 col gap-14">
          <div className="row between">
            <h3 className="row gap-8" style={{fontSize:16}}><Icon name="file" size={18} style={{color:'var(--blue-700)'}}/>{isAr?'سجلّ التّقارير':'Historique des rapports'}</h3>
            <Btn variant="primary" size="sm" icon="file" onClick={()=>go('report-gen', sid)}>{isAr?'إعداد تقرير':'Générer un rapport'}</Btn>
          </div>
          {(()=>{const reps = Nav.reportsByStudent(sid).filter(r=>r.status!=='draft').sort((a,b)=>(b.date||'').localeCompare(a.date||'')); if(reps.length===0) return <span className="faint t-13">{isAr?'لا يوجد تقرير حاليّاً.':'Aucun rapport pour l\'instant.'}</span>;
          return <div className="col gap-8">{reps.map(r=>{
            const viewed = !!r.viewedAt;
            return <div key={r.id} className="card-flat row between" style={{padding:'12px 14px',borderRadius:10,border:'1px solid var(--line-2)',gap:10,cursor:'pointer'}} onClick={()=>go('parent-report', r.token)}>
              <div className="row gap-10">
                <div className="icn" style={{width:34,height:34,borderRadius:10,background:'var(--green-50)',color:'var(--green-700)',display:'grid',placeItems:'center',flex:'none'}}><Icon name="checkc" size={16}/></div>
                <div className="col" style={{gap:1}}>
                  <span className="w-700 t-14">{isAr?`تقرير ${fmtDateLoc?fmtDateLoc(r.date):r.date}`:`Rapport du ${fmtFr?fmtFr(r.date):r.date}`}</span>
                  <span className="faint t-12">{r.summary?.topic?(txData?txData(r.summary.topic):r.summary.topic):'—'}</span>
                </div>
              </div>
              <div className="row gap-7">
                {viewed ? <span className="chip chip-green w-700" style={{fontSize:11}}><Icon name="eye" size={11}/>{isAr?'مقروء':'Vu'}</span>
                       : <span className="chip chip-gray" style={{fontSize:11}}>{isAr?'مُرسَل':'Envoyé'}</span>}
                <Icon name="chevron" size={15} style={{color:'var(--faint)'}}/>
              </div>
            </div>;
          })}</div>;})()}
        </div>
        </>}
      </div>
      {/* side rail — always visible, but slimmed since the per-tab actions live inside */}
      <div className="col gap-18" style={{position:'sticky',top:90}}>
        <div className="card pad-20 col gap-10">
          <h3 style={{fontSize:16}}>{isAr?'إجراءات':'Actions'}</h3>
          <Btn variant="primary" icon="file" block onClick={()=>go('report-gen', sid)}>{isAr?'إعداد تقرير للوليّ':'Générer un rapport parent'}</Btn>
          <Btn variant="ghost" icon="clipboard" block onClick={()=>go('assessment')}>{isAr?'إضافة تقييم':'Ajouter une évaluation'}</Btn>
          <Btn variant="ghost" icon="wa" block onClick={()=>thread?go('thread', thread.id):null} style={thread?{}:{opacity:.5,pointerEvents:'none'}}>{isAr?'فتح المحادثة':'Ouvrir la conversation'}</Btn>
        </div>
        <div className="card pad-20 col gap-8" style={{background:'var(--bg)',border:'none'}}>
          <span className="t-12 faint w-700" style={{textTransform:'uppercase',letterSpacing:'.04em'}}>{isAr?'ملاحظة الأستاذة':'Note de l\'enseignante'}</span>
          <p className="t-14 lh-15" style={{color:'var(--ink-2)'}}>“{txData?txData(y.note):y.note}”</p>
        </div>
      </div>
    </div>
  </AppShell>;
}

function GroupDetailActions({go, g, nextSess}){
  useLang();
  const isAr = NavI18n.lang==='ar';
  const [open, setOpen] = React.useState(false);
  const act = sessionAction(nextSess);
  const actLabel = isAr ? ({'Préparer la séance':'تحضير الحصّة','Saisir la séance':'تسجيل الحصّة','Voir le détail':'عرض التّفاصيل','Nouvelle séance':'حصّة جديدة'}[act.label]||act.label) : act.label;
  return <>
    <Btn variant="primary" icon={act.screen==='session-plan'?'edit':'calendar'} onClick={()=>nextSess?go(act.screen, act.param):go('session-plan','new/'+g.id)}>{actLabel}</Btn>
    <div style={{position:'relative'}}>
      <Btn variant="ghost" iconR="chevron" onClick={()=>setOpen(o=>!o)}>{isAr?'المزيد':'Plus'}</Btn>
      {open && <>
        <div onClick={()=>setOpen(false)} style={{position:'fixed',inset:0,zIndex:20}}/>
        <div className="card" style={{position:'absolute',right:0,top:'calc(100% + 6px)',zIndex:30,padding:6,boxShadow:'var(--sh-3)',minWidth:260,display:'flex',flexDirection:'column',gap:2}}>
          {[
            ['edit',isAr?'تعديل الفوج':'Modifier le groupe', ()=>go('create-group', g.id)],
            ['wa',isAr?'رسالة إلى الفوج':'Message au groupe', ()=>go('group-broadcast', g.id)],
            ['file',isAr?'إعداد التقارير':'Générer les rapports', ()=>go('reports-batch', g.id)],
            ['plus',isAr?'حصة جديدة':'Nouvelle séance', ()=>go('session-plan','new/'+g.id)],
            ['user',isAr?'إضافة تلميذ':'Ajouter un élève', ()=>go('add-student', g.id)],
          ].map(([ic,lab,fn],i)=>
            <button key={i} onClick={()=>{setOpen(false);fn();}} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 12px',border:'none',background:'transparent',cursor:'pointer',borderRadius:8,textAlign:'left',fontSize:13.5,fontWeight:600,color:'var(--ink)'}}>
              <Icon name={ic} size={16} style={{color:'var(--muted)'}}/>{lab}
            </button>)}
        </div>
      </>}
    </div>
  </>;
}

function RecurringGenerator({gid}){
  useLang();
  const isAr = NavI18n.lang==='ar';
  const [open, setOpen] = React.useState(false);
  const [weeks, setWeeks] = React.useState(4);
  const days = Nav.parseScheduleDays((Nav.groupById(gid)||{}).schedule);
  const dayNames = isAr ? ['الأحد','الإثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'] : ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'];
  const submit = ()=>{
    const n = Nav.generateRecurringSessions(gid, weeks);
    if(n<0){ navToast(isAr?'تعذّر اكتشاف الأيام في توقيت الفوج — اكتب مثلاً "Samedi" أو "Mardi".':'Impossible de détecter les jours dans l\'horaire du groupe — précisez "Samedi", "Mardi" etc.','orange'); return; }
    if(n===0){ navToast(isAr?'لم تُضَف أي حصة — الجدول محدّث.':'Aucune séance ajoutée — déjà à jour.','blue'); }
    else navToast(isAr?`تمّت برمجة ${n} حصة خلال ${weeks} أسابيع`:`${n} séance${n>1?'s':''} planifiée${n>1?'s':''} sur ${weeks} semaine${weeks>1?'s':''}`,'green');
    setOpen(false);
  };
  return <div style={{position:'relative'}}>
    <Btn variant="ghost" size="sm" icon="calendar" onClick={()=>setOpen(o=>!o)}>{isAr?'توليد التسلسل':'Générer la séquence'}</Btn>
    {open && <>
      <div onClick={()=>setOpen(false)} style={{position:'fixed',inset:0,zIndex:20}}/>
      <div className="card" style={{position:'absolute',right:0,top:'calc(100% + 6px)',zIndex:30,padding:14,boxShadow:'var(--sh-3)',width:300}}>
        <div className="row between" style={{marginBottom:8}}><span className="w-700 t-14">{isAr?'توليد الحصص القادمة':'Générer les prochaines séances'}</span><button className="btn btn-ghost btn-sm btn-icon" onClick={()=>setOpen(false)}><Icon name="x" size={14}/></button></div>
        <p className="muted t-12 lh-14" style={{marginBottom:10}}>{isAr?'حسب التوقيت':'D’après l’horaire'} « {(Nav.groupById(gid)||{}).schedule} » → {days.length>0?days.map(d=>dayNames[d]).join(', '):(isAr?'لم يُكتشف أي يوم':'aucun jour détecté')}</p>
        <Field label={isAr?'عدد الأسابيع':'Nombre de semaines'}>
          <div className="row gap-7 wrap">
            {[1,2,4,8,12].map(w=><button key={w} className={`pick ${weeks===w?'on':''}`} onClick={()=>setWeeks(w)}>{w} {isAr?'أسبوع':'sem.'}</button>)}
          </div>
        </Field>
        <span className="faint t-11 lh-14" style={{display:'block',marginTop:8}}>{isAr?`≈ ${days.length * weeks} حصة ستُنشأ · سيتم تجاهل التواريخ المشغولة.`:`≈ ${days.length * weeks} séance${days.length*weeks>1?'s':''} à créer · les dates déjà occupées seront ignorées.`}</span>
        <div className="row gap-7" style={{marginTop:10,justifyContent:'flex-end'}}>
          <Btn variant="ghost" size="sm" onClick={()=>setOpen(false)}>{isAr?'إلغاء':'Annuler'}</Btn>
          <Btn variant="primary" size="sm" icon="check" onClick={submit}>{isAr?'توليد':'Générer'}</Btn>
        </div>
      </div>
    </>}
  </div>;
}

Object.assign(window,{GroupDetail,StudentProfile,RecurringGenerator,GroupDetailActions});
