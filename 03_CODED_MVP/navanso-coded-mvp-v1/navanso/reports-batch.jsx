/* NAVANSO — Bulk report generation for a group.
   End-of-month workflow: pick students → generate drafts in one click →
   review each as a card → validate all, share via WhatsApp per parent. */

function ReportsBatch({go, id}){
  useStore();
  useLang();
  const isAr = NavI18n.lang === 'ar';
  const isMobile = useIsMobile();
  const gid = id || (Nav.groupsAll()[0]||{}).id;
  const group = Nav.groupById(gid);
  if(!group) return <AppShell go={go} active="report-gen" title={isAr?'التّقارير':'Rapports'}><div className="card pad-24"><span className="muted">{isAr?'فوج غير موجود.':'Groupe introuvable.'}</span></div></AppShell>;
  const students = Nav.studentsByGroup(gid);

  // Selection state: default-select students whose status is "pending"
  const [selected, setSelected] = React.useState(()=>new Set(students.filter(s=>s.status==='pending').map(s=>s.id)));
  // Per-student local state: status (untouched / drafted / validated / sent)
  const [generated, setGenerated] = React.useState({}); // sid → draft text
  const [validated, setValidated] = React.useState({}); // sid → token
  const [sent, setSent] = React.useState({});           // sid → true

  const toggle = (sid)=> setSelected(s=>{const n=new Set(s); n.has(sid)?n.delete(sid):n.add(sid); return n;});
  const selectAll = ()=> setSelected(new Set(students.map(s=>s.id)));
  const selectPending = ()=> setSelected(new Set(students.filter(s=>s.status==='pending').map(s=>s.id)));
  const selectNone = ()=> setSelected(new Set());

  const buildDraft = (s)=>{
    const pts = pointsOf(s.id);
    const improv = pts.resolved.map(p=>isAr?txData(p.label):p.label.toLowerCase());
    const actives = pts.active.map(p=>isAr?txData(p.label):p.label.toLowerCase());
    const fn = s.name.split(' ')[0];
    const fl = (arr)=>{ if(!arr.length)return ''; if(arr.length===1)return arr[0]; return arr.slice(0,-1).join(', ')+' et '+arr[arr.length-1]; };
    const fla = (arr)=>{ if(!arr.length)return ''; if(arr.length===1)return arr[0]; return arr.slice(0,-1).join('، ')+' و'+arr[arr.length-1]; };
    if(isAr){
      return `هذا الشّهر، ${fn} حضوره ${s.att}% وآخر علامة له ${s.result}.`
        + (improv.length?` خبر سارّ: تطوّر في ${fla(improv)}.`:``)
        + ` يبقى العمل على ${actives.length?fla(actives):'بعض النّقاط'}. تمارين قصيرة في البيت تساعد قبل الحصّة القادمة.`;
    }
    return `Ce mois-ci, ${fn} a une présence de ${s.att}% et une dernière note de ${s.result}.`
      + (improv.length?` Bonne nouvelle : il/elle a progressé sur ${fl(improv)}.`:``)
      + ` Il reste à travailler ${actives.length?fl(actives):'quelques points'}. Quelques exercices courts à la maison aideront avant la prochaine séance.`;
  };

  const genAll = ()=>{
    const next = {...generated};
    [...selected].forEach(sid=>{
      const s = Nav.studentById(sid); if(!s) return;
      next[sid] = buildDraft(s);
    });
    setGenerated(next);
    navToast(isAr?`تمّ إعداد ${selected.size} مسوّدة`:`${selected.size} brouillon${selected.size>1?'s':''} généré${selected.size>1?'s':''}`,'blue');
  };

  const validateOne = (sid)=>{
    const s = Nav.studentById(sid); if(!s) return;
    const fn = s.name.split(' ')[0].toLowerCase().replace(/[^a-z]/g,'');
    const token = 'r-'+fn+'-'+Date.now().toString(36);
    const pts = pointsOf(sid);
    const summary = {
      att: s.att+'%', attFrac:`${Math.round((s.att/100)*6)} séances sur 6`,
      result: s.result, trend:'+0',
      topic: (Nav.lastCompletedSession(s.groupId)||{}).plannedTopic||'—',
      strengths:['Participation régulière'],
      improved: pts.resolved.map(p=>p.label),
      toWork: pts.active.map(p=>p.label),
      reco:'Quelques exercices courts avant la prochaine séance.',
      nextStep:'À évaluer la prochaine séance.',
      note: generated[sid] || '',
    };
    NavStore.set(d=>{
      const list = d.reports || JSON.parse(JSON.stringify(NAV.reports));
      // remove draft if any
      const idx = list.findIndex(r=>r.studentId===sid && r.status==='draft');
      if(idx>=0) list.splice(idx,1);
      list.unshift({id:'rep'+Date.now()+sid, studentId:sid, groupId:s.groupId, date:new Date().toISOString().slice(0,10),
        token, status:'validated_sent', viewedAt:null, tutorId:'t1', summary});
      d.students = (d.students||JSON.parse(JSON.stringify(NAV.students))).map(x=>x.id===sid?{...x,status:'sent'}:x);
      d.reports = list; return d;
    });
    setValidated(v=>({...v, [sid]: token}));
    return token;
  };

  const validateAll = ()=>{
    const next = {...validated};
    [...selected].forEach(sid=>{
      if(generated[sid] && !validated[sid]){
        const tok = validateOne(sid);
        if(tok) next[sid] = tok;
      }
    });
    setValidated(next);
    navToast(isAr?`تمّت المصادقة على ${Object.keys(next).length} تقرير`:`${Object.keys(next).length} rapport${Object.keys(next).length>1?'s':''} validé${Object.keys(next).length>1?'s':''}`,'green');
  };

  const shareOne = (sid)=>{
    const s = Nav.studentById(sid); if(!s) return;
    const parent = Nav.parentById(s.parentId); if(!parent) return;
    const token = validated[sid];
    if(!token){ navToast(isAr?'صادِق على التّقرير أوّلاً':'Validez d\'abord ce rapport','orange'); return; }
    const msg = isAr
      ? `السّلام عليكم ${txData(parent.name)}، إليكم تقرير متابعة ${s.name.split(' ')[0]} في ${txData(s.subject)||'الرّياضيّات'}. الحضور ${s.att}%، آخر علامة ${s.result}. التّقرير الكامل: https://navanso.dz/r/${token}`
      : `Bonjour ${parent.name}, voici le rapport de suivi de ${s.name.split(' ')[0]} en ${s.subject||'mathématiques'}. Présence ${s.att}%, dernière note ${s.result}. Rapport complet : https://navanso.dz/r/${token}`;
    // log in thread
    let thread = Nav.threadsAll().find(t=>t.parentId===parent.id && t.studentId===sid);
    if(!thread){
      const tid = 'th'+Date.now()+sid;
      NavStore.set(d=>{const ts=d.threads||JSON.parse(JSON.stringify(NAV.threads));
        ts.push({id:tid,parentId:parent.id,studentId:sid,tutorId:'t1',lastMessageAt:new Date().toISOString(),unreadCount:0,linkedReportId:null,kind:'follow-up'});
        d.threads=ts; return d;});
      thread = Nav.threadById(tid);
    }
    Nav.sendMessage({threadId:thread.id, direction:'out', text:msg, channel:'whatsapp', linkedReportId: Nav.reportByToken(token)?.id});
    const phone = (parent.phone||'').replace(/[^0-9]/g,'');
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
    setSent(s=>({...s, [sid]: true}));
  };

  const shareAll = ()=>{
    [...selected].forEach(sid=>{ if(validated[sid] && !sent[sid]) shareOne(sid); });
  };

  const draftCount = Object.keys(generated).length;
  const validatedCount = Object.keys(validated).length;
  const sentCount = Object.keys(sent).length;

  return <AppShell go={go} active="report-gen" title={isAr?`تقارير دفعة · ${group.name}`:`Rapports en lot · ${group.name}`}
    crumbs={[{t:isAr?'الأفواج':'Groupes',go:()=>go('groups')},{t:group.name,go:()=>go('group-detail', gid)},{t:isAr?'تقارير دفعة':'Rapports en lot'}]}
    actions={<>
      <Btn variant="ghost" onClick={()=>go('group-detail', gid)}>{isAr?'العودة إلى الفوج':'Retour au groupe'}</Btn>
    </>}>
    <div className="card pad-16 row gap-10 wrap" style={{marginBottom:18,background:'var(--blue-50)',border:'1px solid var(--blue-100)'}}>
      <Icon name="file" size={18} style={{color:'var(--blue-700)'}}/>
      <span className="t-14 w-600" style={{color:'var(--blue-800)',flex:'1 1 320px'}}>
        {isAr?'أعِدّ عدّة تقارير دفعةً واحدة انطلاقاً من ملاحظاتك وعلاماتك. تبقى كلّ مسوّدة قابلة للتّعديل قبل المصادقة، وكلّ إرسال على واتساب يُفتَح جاهزاً.':'Générez plusieurs rapports d\'un coup à partir de vos remarques et notes. Chaque brouillon reste modifiable avant validation, et chaque envoi WhatsApp s\'ouvre prérempli.'}
      </span>
    </div>
    {/* Step indicator */}
    <div className="card pad-12 row" style={{marginBottom:18,justifyContent:'center'}}>
      <Stepper steps={isAr?['الاختيار','المسوّدات','المصادقة','الإرسال']:['Sélection','Brouillons','Validation','Envoi']}
        current={ sentCount>0?3 : validatedCount>0?2 : draftCount>0?1 : 0 }/>
    </div>

    <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 320px',gap:20,alignItems:'start'}}>
      <div className="col gap-14">
        {/* selection bar */}
        <div className="card pad-14 row between wrap" style={{gap:10}}>
          <div className="row gap-10">
            <span className="w-700 t-14">{isAr?`${selected.size}/${students.length} تلميذ مُختار`:`${selected.size}/${students.length} élève${selected.size>1?'s':''} sélectionné${selected.size>1?'s':''}`}</span>
            <div className="row gap-5">
              <Btn variant="ghost" size="sm" onClick={selectAll}>{isAr?'الكلّ':'Tous'}</Btn>
              <Btn variant="ghost" size="sm" onClick={selectPending}>{isAr?'تقارير في الانتظار':'Rapports en attente'}</Btn>
              <Btn variant="ghost" size="sm" onClick={selectNone}>{isAr?'لا أحد':'Aucun'}</Btn>
            </div>
          </div>
          <Btn variant="primary" icon="sparkle" size="sm" onClick={genAll} style={selected.size===0?{opacity:.5,pointerEvents:'none'}:{}}>{isAr?'إعداد المسوّدات':'Générer les brouillons'}</Btn>
        </div>

        {/* student rows */}
        <div className="col gap-10">
          {students.map(s=>{
            const isSel = selected.has(s.id);
            const draft = generated[s.id];
            const tok = validated[s.id];
            const isSent = sent[s.id];
            const parent = Nav.parentById(s.parentId)||{};
            return <div key={s.id} className="card" style={{padding:0,overflow:'hidden',border: tok?'1px solid var(--green-200, var(--green-100))':'1px solid var(--line)'}}>
              {/* header row */}
              <div className="row between wrap" style={{padding:'12px 16px',gap:10,background: tok?'var(--green-50)':isSel?'#fff':'var(--bg)',borderBottom: draft?'1px solid var(--line-2)':'none'}}>
                <label className="row gap-10" style={{cursor:'pointer',flex:'1 1 auto'}}>
                  <input type="checkbox" checked={isSel} onChange={()=>toggle(s.id)} style={{accentColor:'var(--blue-600)',width:18,height:18}}/>
                  <Avatar initials={s.initials} cls={s.av} size={36}/>
                  <div className="col" style={{gap:1}}>
                    <span className="w-700 t-14">{s.name}</span>
                    <span className="faint t-12">{isAr?txData(parent.name):parent.name} · {isAr?`الحضور ${s.att}% · آخر علامة ${s.result}`:`Présence ${s.att}% · Dernière note ${s.result}`}</span>
                  </div>
                </label>
                <div className="row gap-7">
                  {isSent ? <span className="chip chip-green w-700"><Icon name="checkc" size={12}/>{isAr?'تمّ الإرسال':'Envoyé'}</span>
                    : tok ? <Btn variant="green" size="sm" icon="wa" onClick={()=>shareOne(s.id)}>{isAr?'مشاركة':'Partager'}</Btn>
                    : draft ? <Btn variant="primary" size="sm" icon="check" onClick={()=>validateOne(s.id)}>{isAr?'مصادقة':'Valider'}</Btn>
                    : s.status==='pending' ? <span className="chip chip-orange w-700"><Icon name="clock" size={12}/>{isAr?'للإرسال':'À envoyer'}</span>
                    : <span className="chip chip-gray" style={{fontSize:11}}>{isAr?'حديث':'Récent'}</span>}
                  <Btn variant="ghost" size="sm" icon="edit" onClick={()=>go('report-gen', s.id)}>{isAr?'التّفاصيل':'Détail'}</Btn>
                </div>
              </div>
              {/* draft preview, only when generated */}
              {draft && <div style={{padding:'12px 16px'}}>
                <span className="t-11 faint w-700" style={{textTransform:'uppercase',letterSpacing:'.04em'}}>{isAr?'مسوّدة':'Brouillon'}</span>
                <textarea className="textarea" style={{marginTop:6,minHeight:90,fontSize:13.5,lineHeight:1.5}} value={draft} onChange={e=>setGenerated(g=>({...g,[s.id]:e.target.value}))} disabled={!!tok}/>
                {tok && <span className="faint t-11 lh-14" style={{display:'block',marginTop:6}}>{isAr?'تقرير مُصادَق عليه · رمز':'Rapport validé · token'} <code style={{fontSize:10.5}}>{tok}</code></span>}
              </div>}
            </div>;
          })}
        </div>
      </div>
      {/* sidebar — bulk actions */}
      <div className="col gap-14" style={{position:'sticky',top:90}}>
        <div className="card pad-18 col gap-10">
          <h3 style={{fontSize:15}}>{isAr?'أعمال دفعة':'Actions en lot'}</h3>
          <Btn variant="primary" icon="sparkle" block onClick={genAll} style={selected.size===0?{opacity:.5,pointerEvents:'none'}:{}}>
            {isAr?'إعداد المسوّدات':'Générer les brouillons'} ({selected.size})
          </Btn>
          <Btn variant="green" icon="check" block onClick={validateAll} style={draftCount===0?{opacity:.5,pointerEvents:'none'}:{}}>
            {isAr?'مصادقة الكلّ':'Tout valider'} ({draftCount - validatedCount})
          </Btn>
          <Btn variant="wa" icon="wa" block onClick={shareAll} style={validatedCount===0?{opacity:.5,pointerEvents:'none'}:{}}>
            {isAr?'مشاركة الكلّ عبر واتساب':'Tout partager via WhatsApp'} ({validatedCount - sentCount})
          </Btn>
        </div>
        <div className="card pad-18 col gap-10">
          <span className="eyebrow">{isAr?'ملخّص':'Récap'}</span>
          <div className="row between"><span className="muted t-13">{isAr?'المُختارون':'Sélectionnés'}</span><span className="w-700 t-14">{selected.size}</span></div>
          <div className="row between"><span className="muted t-13">{isAr?'مسوّدات':'Brouillons'}</span><span className="w-700 t-14" style={{color:'var(--blue-700)'}}>{draftCount}</span></div>
          <div className="row between"><span className="muted t-13">{isAr?'مُصادَق عليها':'Validés'}</span><span className="w-700 t-14" style={{color:'var(--green-700)'}}>{validatedCount}</span></div>
          <div className="row between"><span className="muted t-13">{isAr?'مُرسَلة':'Envoyés'}</span><span className="w-700 t-14" style={{color:'var(--green-700)'}}>{sentCount}</span></div>
        </div>
        <PrivacyNote/>
      </div>
    </div>
  </AppShell>;
}

window.ReportsBatch = ReportsBatch;

/* ============================================================
   ReportsHub — sidebar "Rapports" lands here. Shows pending
   reports aggregated across all groups, plus recently sent
   reports with their parent-view status. Single starting
   point for the monthly reports workflow.
   ============================================================ */
function ReportsHub({go}){
  useStore();
  useLang();
  const isAr = NavI18n.lang === 'ar';
  const isMobile = useIsMobile();
  const groups = Nav.groupsAll();
  const allStudents = Nav.studentsAll();
  // pending = student.status==='pending' (rapport non envoyé ce mois)
  const pendingByGroup = groups.map(g=>({
    group: g,
    students: allStudents.filter(s=>s.groupId===g.id && s.status==='pending'),
  })).filter(b=>b.students.length>0);
  const pendingTotal = pendingByGroup.reduce((n,b)=>n+b.students.length,0);
  // recent validated reports — last 10
  const recent = Nav.reportsAll().filter(r=>r.status!=='draft').sort((a,b)=>(b.date||'').localeCompare(a.date||'')).slice(0,10);
  const viewed = recent.filter(r=>r.viewedAt).length;
  return <AppShell go={go} active="report-gen" title={isAr?'التّقارير':'Rapports'}
    crumbs={[{t:isAr?'الفضاء':'Espace',go:()=>go('dashboard')},{t:isAr?'التّقارير':'Rapports'}]}
    actions={pendingTotal>0 && pendingByGroup.length===1 ? <Btn variant="primary" icon="sparkle" onClick={()=>go('reports-batch', pendingByGroup[0].group.id)}>{isAr?'إنجاز التّقارير المنتظِرة':'Faire les rapports en attente'}</Btn> : null}>
    <div className="card pad-16 row gap-10 wrap" style={{marginBottom:18,background:'var(--blue-50)',border:'1px solid var(--blue-100)'}}>
      <Icon name="file" size={18} style={{color:'var(--blue-700)'}}/>
      <span className="t-14 w-600" style={{color:'var(--blue-800)',flex:'1 1 320px'}}>
        {isAr?'يجمع المركز كلّ تقاريرك: المنتظِرة حسب الفوج، والأرشيف الحديث مع حالة قراءة الوالد.':'Le hub regroupe tous vos rapports : en attente par groupe, et historique récent avec le statut de lecture parent.'}
      </span>
    </div>
    <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:20,alignItems:'start'}}>
      {/* PENDING */}
      <div className="col gap-14">
        <div className="row between">
          <h3 style={{fontSize:17}}>{isAr?'للإرسال':'À envoyer'} · {pendingTotal}</h3>
          {pendingTotal>0 && <span className="chip chip-orange w-700"><Icon name="clock" size={12}/>{pendingTotal} {isAr?'في الانتظار':'en attente'}</span>}
        </div>
        {pendingTotal===0 && <div className="card pad-24 col center" style={{gap:8,textAlign:'center',padding:'48px 24px'}}>
          <Icon name="checkc" size={28} style={{color:'var(--green-600)'}}/>
          <span className="muted">{isAr?'كلّ شيء محدّث 🎉':'Tout est à jour 🎉'}</span>
          <span className="faint t-13">{isAr?'لا يوجد تقرير في انتظار الإرسال.':'Aucun rapport en attente d\'envoi.'}</span>
        </div>}
        {pendingByGroup.map(b=>
          <div key={b.group.id} className="card pad-20 col gap-14">
            <div className="row between wrap" style={{gap:10}}>
              <div className="col" style={{gap:3}}>
                <span className="w-700 t-15">{b.group.name}</span>
                <span className="faint t-12">{isAr?`${b.students.length} تقرير في الانتظار`:`${b.students.length} rapport${b.students.length>1?'s':''} en attente`}</span>
              </div>
              <Btn variant="primary" size="sm" icon="sparkle" onClick={()=>go('reports-batch', b.group.id)}>{isAr?'إنجاز دفعة':'Faire en lot'}</Btn>
            </div>
            <div className="col gap-8">
              {b.students.map(s=>
                <div key={s.id} className="row between wrap" style={{padding:'10px 12px',background:'var(--bg)',borderRadius:10,gap:10,rowGap:8}}>
                  <div className="row gap-10">
                    <Avatar initials={s.initials} cls={s.av} size={30}/>
                    <div className="col" style={{gap:1}}><span className="w-600 t-13">{s.name}</span><span className="faint t-11">{isAr?`الحضور ${s.att}% · ${s.result}`:`Présence ${s.att}% · ${s.result}`}</span></div>
                  </div>
                  <Btn variant="ghost" size="sm" iconR="arrow" onClick={()=>go('report-gen', s.id)}>{isAr?'واحداً واحداً':'Un par un'}</Btn>
                </div>)}
            </div>
          </div>)}
      </div>
      {/* RECENT */}
      <div className="col gap-14">
        <div className="row between">
          <h3 style={{fontSize:17}}>{isAr?'مُرسَلة حديثاً':'Récemment envoyés'}</h3>
          {recent.length>0 && <span className="chip chip-green w-700" style={{fontSize:11}}><Icon name="eye" size={12}/>{viewed}/{recent.length} {isAr?'مقروء':'vus'}</span>}
        </div>
        {recent.length===0 && <div className="card pad-24"><span className="faint t-14">{isAr?'لا يوجد تقرير مُرسَل.':'Aucun rapport envoyé.'}</span></div>}
        {recent.length>0 && <div className="card" style={{overflow:'hidden'}}>
          {recent.map((r,i)=>{
            const s = Nav.studentById(r.studentId)||{};
            const g = Nav.groupById(r.groupId)||{};
            return <div key={r.id} onClick={()=>go('parent-report', r.token)} className="row gap-10" style={{padding:'12px 14px',borderTop:i>0?'1px solid var(--line-2)':'none',cursor:'pointer'}}>
              <Avatar initials={s.initials||'?'} cls={s.av||'av-b'} size={32}/>
              <div className="col grow" style={{gap:1,minWidth:0}}>
                <span className="w-700 t-13">{s.name||'—'}</span>
                <span className="faint t-12">{g.name||'—'} · {fmtDateLoc?fmtDateLoc(r.date):(fmtFr?fmtFr(r.date):r.date)}</span>
              </div>
              {r.viewedAt ? <span className="chip chip-green w-700" style={{fontSize:10.5,padding:'2px 6px'}}><Icon name="eye" size={11}/>{isAr?'مقروء':'Vu'}</span>
                          : <span className="chip chip-gray" style={{fontSize:10.5,padding:'2px 6px'}}>{isAr?'مُرسَل':'Envoyé'}</span>}
            </div>;
          })}
        </div>}
      </div>
    </div>
  </AppShell>;
}

window.ReportsHub = ReportsHub;
