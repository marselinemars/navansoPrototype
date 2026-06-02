/* NAVANSO — Planning view: weekly calendar of all sessions across groups. */

function Planning({go}){
  useStore();
  // Demo "today" anchor. Algerian week starts Sunday; weekend = Fri+Sat.
  const todayAnchor = new Date('2026-05-20');
  const anchorSunday = (()=>{ const d=new Date(todayAnchor); d.setDate(d.getDate()-d.getDay()); d.setHours(0,0,0,0); return d; })();
  // weekOffset in weeks vs the anchor week
  const [weekOffset, setWeekOffset] = React.useState(0);
  const sunday = (()=>{ const d=new Date(anchorSunday); d.setDate(d.getDate() + weekOffset*7); return d; })();
  const days = Array.from({length:7}).map((_,i)=>{ const d=new Date(sunday); d.setDate(d.getDate()+i); return d; });
  const sessions = Nav.sessionsAll();
  const groups = Nav.groupsAll();
  const byDate = (d)=>{
    const iso = d.toISOString().slice(0,10);
    return sessions.filter(s=> (s.date||'').slice(0,10)===iso);
  };
  const next = (()=>{
    const list = sessions.filter(s=>s.status==='planned').sort((a,b)=>(a.date||'').localeCompare(b.date||''));
    return list[0]||null;
  })();
  return <AppShell go={go} active="planning" title="Planning de la semaine"
    crumbs={[{t:'Espace',go:()=>go('dashboard')},{t:'Planning'}]}
    actions={<Btn variant="primary" icon="plus" onClick={()=>go('session-plan','new/'+(Nav.groupsAll()[0]||{}).id)}>Nouvelle séance</Btn>}>
    {next && <div className="card pad-18 row between wrap" style={{marginBottom:20,background:'var(--green-50)',border:'1px solid var(--green-100)',gap:14}}>
      <div className="row gap-12">
        <div className="icn" style={{width:40,height:40,borderRadius:12,background:'var(--green-600)',color:'#fff',display:'grid',placeItems:'center'}}><Icon name="clock" size={20}/></div>
        <div className="col" style={{gap:2}}>
          <span className="w-700 t-15">Prochaine séance · {fmtFr(next.date)}</span>
          <span className="muted t-13">{groups.find(g=>g.id===next.groupId)?.name} — {next.plannedTopic}</span>
        </div>
      </div>
      <Btn variant="green" icon="arrow" onClick={()=>go('session-entry', next.id)}>Préparer / saisir</Btn>
    </div>}
    <div className="card" style={{overflow:'hidden'}}>
      <div className="row between wrap" style={{padding:'12px 18px',borderBottom:'1px solid var(--line-2)',gap:10}}>
        <div className="row gap-8">
          <button className="btn btn-ghost btn-sm btn-icon" onClick={()=>setWeekOffset(w=>w-1)} title="Semaine précédente"><Icon name="arrowl" size={15}/></button>
          <button className="btn btn-ghost btn-sm" onClick={()=>setWeekOffset(0)} style={weekOffset===0?{background:'var(--blue-50)',color:'var(--blue-700)',fontWeight:700}:{}}>Aujourd'hui</button>
          <button className="btn btn-ghost btn-sm btn-icon" onClick={()=>setWeekOffset(w=>w+1)} title="Semaine suivante"><Icon name="arrow" size={15}/></button>
          <span className="w-700 t-14" style={{marginLeft:8}}>Semaine du {fmtFr(sunday.toISOString())}</span>
          {weekOffset!==0 && <span className="chip chip-gray" style={{fontSize:11}}>{weekOffset>0?'+':''}{weekOffset} sem.</span>}
        </div>
        <div className="row gap-7 wrap">
          {groups.map(g=><span key={g.id} className="row gap-5 t-12 w-600" style={{color:'var(--muted)'}}>
            <span style={{width:8,height:8,borderRadius:99,background:g.subject==='Physique'?'var(--orange-500)':'var(--blue-600)'}}></span>{g.name.split('—')[0].trim()}</span>)}
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(7,minmax(100px,1fr))',gap:0,padding:0,overflowX:'auto'}}>
        {days.map((d,i)=>{
          const list = byDate(d);
          // Algerian weekend: vendredi + samedi (day indices 5 and 6 in our Sun-Sat row)
          const isWeekend = i===5 || i===6;
          const labels = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'];
          return <div key={i} style={{minHeight:170,borderLeft:i>0?'1px solid var(--line-2)':'none',borderTop:'1px solid var(--line-2)',padding:10,background:isWeekend?'var(--bg)':'#fff'}}>
            <div className="col" style={{gap:1,marginBottom:8}}>
              <span className="t-11 faint w-700" style={{textTransform:'uppercase',letterSpacing:'.04em'}}>{labels[d.getDay()]}{isWeekend && <span style={{marginLeft:4,opacity:.7}}>· weekend</span>}</span>
              <span className="w-700 t-15">{d.getDate()}</span>
            </div>
            <div className="col gap-6">
              {list.map(s=>{
                const g = groups.find(gg=>gg.id===s.groupId);
                const tone = s.status==='planned'?'orange':'green';
                return <div key={s.id} onClick={()=>go('session-entry', s.id)} className="card-flat" style={{cursor:'pointer',padding:'7px 9px',borderRadius:8,background: tone==='orange'?'var(--orange-50)':'var(--green-50)',border:'1px solid '+(tone==='orange'?'var(--orange-100)':'var(--green-100)')}}>
                  <span className="t-11 w-700" style={{color: tone==='orange'?'var(--orange-600)':'var(--green-700)'}}>{g?.name.split('—')[0].trim()}</span>
                  <div className="t-12 lh-13" style={{color:'var(--ink-2)'}}>{s.plannedTopic||'—'}</div>
                </div>;
              })}
              {list.length===0 && <span className="faint t-12">—</span>}
            </div>
          </div>;
        })}
      </div>
    </div>
    <div className="card pad-20 col gap-14" style={{marginTop:18}}>
      <h3 style={{fontSize:16}}>Récap des groupes</h3>
      <div className="col">
        {groups.map((g,i)=><div key={g.id} className="row between wrap" style={{padding:'12px 0',borderTop:i>0?'1px solid var(--line-2)':'none',gap:10,rowGap:4}}>
          <span className="row gap-10"><span style={{width:8,height:8,borderRadius:99,background:g.subject==='Physique'?'var(--orange-500)':'var(--blue-600)',flex:'none'}}></span><span className="w-600 t-14">{g.name}</span></span>
          <span className="muted t-13">{g.schedule}</span>
        </div>)}
      </div>
    </div>
  </AppShell>;
}

window.Planning = Planning;
