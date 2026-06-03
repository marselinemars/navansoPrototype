/* NAVANSO — Mes élèves : real list across groups with search + filters. */

function StudentsList({go}){
  useStore();
  useLang();
  const isAr = NavI18n.lang === 'ar';
  const isMobile = useIsMobile();
  const all = Nav.studentsAll();
  const groups = Nav.groupsAll();
  const [q, setQ] = React.useState('');
  const [groupId, setGroupId] = React.useState('all');
  const [status, setStatus] = React.useState('all'); // all | pending | low-att | sent

  let list = all;
  if(q.trim()){
    const t = q.toLowerCase();
    list = list.filter(s=> s.name.toLowerCase().includes(t) || (s.parent||'').toLowerCase().includes(t));
  }
  if(groupId!=='all') list = list.filter(s=>s.groupId===groupId);
  if(status==='pending')  list = list.filter(s=>s.status==='pending');
  if(status==='sent')     list = list.filter(s=>s.status==='sent');
  if(status==='low-att')  list = list.filter(s=>s.att<85);
  list = [...list].sort((a,b)=>a.name.localeCompare(b.name));

  const counts = {
    all: all.length,
    pending: all.filter(s=>s.status==='pending').length,
    'low-att': all.filter(s=>s.att<85).length,
    sent: all.filter(s=>s.status==='sent').length,
  };

  return <AppShell go={go} active="students" title={isAr?'تلاميذي':'Mes élèves'}
    crumbs={[{t:isAr?'الفضاء':'Espace',go:()=>go('dashboard')},{t:isAr?'تلاميذي':'Mes élèves'}]}
    actions={<Btn variant="primary" icon="plus" onClick={()=>go('add-student')}>{isAr?'إضافة تلميذ':'Ajouter un élève'}</Btn>}>
    <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 280px',gap:20,alignItems:'start'}}>
      <div className="col gap-14">
        {/* search + filters */}
        <div className="card pad-16 col gap-14">
          <div className="row gap-12 wrap" style={{rowGap:10}}>
            <div className="input-icon" style={{flex:'1 1 240px'}}><Icon name="search"/><input className="input" style={{padding:'9px 12px 9px 38px'}} placeholder={isAr?'بحث عن تلميذ أو والد…':'Rechercher un élève ou un parent…'} value={q} onChange={e=>setQ(e.target.value)}/></div>
            <select className="select" value={groupId} onChange={e=>setGroupId(e.target.value)} style={{minWidth:200}}>
              <option value="all">{isAr?'كلّ الأفواج':'Tous les groupes'}</option>
              {groups.map(g=><option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
          </div>
          <div className="row gap-8 wrap" style={{rowGap:10}}>
            {[
              ['all',isAr?'الكلّ':'Tous',counts.all],
              ['pending',isAr?'تقرير للإرسال':'Rapport à envoyer',counts.pending],
              ['low-att',isAr?'حضور < 85%':'Présence < 85%',counts['low-att']],
              ['sent',isAr?'تقرير مُرسَل':'Rapport envoyé',counts.sent]
            ].map(([k,lab,n])=>
              <button key={k} className={`pick ${status===k?'on':''}`} onClick={()=>setStatus(k)}>{lab} ({n})</button>)}
          </div>
        </div>

        {/* table */}
        {list.length===0 ? (
          <div className="card pad-24 col center" style={{gap:10,textAlign:'center',padding:'48px 24px'}}>
            <Icon name="users" size={32} style={{color:'var(--faint)'}}/>
            <span className="muted">{isAr?'لا يوجد تلميذ في هذا التّصنيف.':'Aucun élève dans cette catégorie.'}</span>
          </div>
        ) : (
          <div className="card" style={{overflow:'hidden'}}>
            <div className="row between" style={{padding:'12px 18px',borderBottom:'1px solid var(--line-2)'}}>
              <span className="w-700 t-14">{list.length} {isAr?'تلميذ':'élève'}{!isAr&&list.length>1?'s':''}</span>
              <span className="faint t-12 w-600">{isAr?'انقر على تلميذ لرؤية ملفّه':'Cliquez sur un élève pour voir son profil'}</span>
            </div>
            <table className="tbl">
              <thead><tr><th>{isAr?'التّلميذ':'Élève'}</th><th>{isAr?'الفوج':'Groupe'}</th><th>{isAr?'الوليّ':'Parent'}</th><th>{isAr?'الحضور':'Présence'}</th><th>{isAr?'آخر علامة':'Dernière note'}</th><th>{isAr?'نقطة ضعف':'Point faible'}</th><th>{isAr?'التّقرير':'Rapport'}</th><th></th></tr></thead>
              <tbody>
                {list.map(s=>{
                  const g = groups.find(x=>x.id===s.groupId);
                  return <tr key={s.id} style={{cursor:'pointer'}} onClick={()=>go('student-profile', s.id)}>
                    <td><div className="row gap-10"><Avatar initials={s.initials} cls={s.av} size={32}/><span className="w-600">{s.name}</span></div></td>
                    <td className="muted t-13">{g?.name||'—'}</td>
                    <td className="muted t-13">{isAr?txData(s.parent):s.parent}</td>
                    <td><div className="row gap-8"><div style={{width:54}}><Bar pct={s.att} tone={s.att>=85?'':'orange'}/></div><span className="t-13 w-600 tnum">{s.att}%</span></div></td>
                    <td><span className="w-700 tnum">{s.result}</span></td>
                    <td>{s.weak==='—'?<span className="faint">—</span>:<span className="chip chip-weak">{s.weak}</span>}</td>
                    <td>{s.status==='pending'?<span className="badge badge-pending"><Icon name="clock" size={12}/>{isAr?'للإرسال':'À envoyer'}</span>:s.status==='sent'?<span className="badge badge-verified"><Icon name="check" size={12}/>{isAr?'مُرسَل':'Envoyé'}</span>:<span className="chip chip-gray" style={{fontSize:11}}>{isAr?'جديد':'Nouveau'}</span>}</td>
                    <td><Icon name="chevron" size={16} style={{color:'var(--faint)'}}/></td>
                  </tr>;
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* side: by-group digest + privacy */}
      <div className="col gap-14" style={{position:'sticky',top:90}}>
        <div className="card pad-18 col gap-10">
          <h3 style={{fontSize:15}}>{isAr?'حسب الفوج':'Par groupe'}</h3>
          {groups.map(g=>{
            const n = all.filter(s=>s.groupId===g.id).length;
            const pending = all.filter(s=>s.groupId===g.id && s.status==='pending').length;
            return <div key={g.id} className="row between" style={{cursor:'pointer'}} onClick={()=>setGroupId(g.id)}>
              <span className="t-13 w-600 muted">{g.name}</span>
              <span className="row gap-6">
                {pending>0 && <span className="chip chip-orange" style={{fontSize:10.5,padding:'1px 6px'}}>{pending}</span>}
                <span className={`chip ${groupId===g.id?'chip-blue':'chip-gray'}`} style={{fontSize:11}}>{n}</span>
              </span>
            </div>;
          })}
        </div>
        <PrivacyNote/>
      </div>
    </div>
  </AppShell>;
}

window.StudentsList = StudentsList;
