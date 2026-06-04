/* NAVANSO — Tutor to-do list (global, optionally scoped).
   Different from session "à retenir" (which is per-session); this is the
   tutor's overall personal task list. Items can be scoped to a group, a
   student, or a session — and they show up in both this global view and
   inline on the relevant scope page. */

function _isArTodo(){ return typeof NavI18n !== 'undefined' && NavI18n.lang === 'ar'; }
function todoTagLabel(k){
  const isAr = _isArTodo();
  const m = {
    'lesson-prep':       isAr?'تحضير':'Préparation',
    'parent-followup':   isAr?'وليّ':'Parent',
    'student-followup':  isAr?'تلميذ':'Élève',
    'admin':             isAr?'إدارة':'Admin',
    'general':           isAr?'عامّ':'Général',
  };
  return m[k]||m.general;
}
const TODO_TAGS = {
  'lesson-prep':       {get label(){return todoTagLabel('lesson-prep');},      icon:'book',     color:'blue'},
  'parent-followup':   {get label(){return todoTagLabel('parent-followup');},  icon:'wa',       color:'green'},
  'student-followup':  {get label(){return todoTagLabel('student-followup');}, icon:'user',     color:'orange'},
  'admin':             {get label(){return todoTagLabel('admin');},            icon:'settings', color:'gray'},
  'general':           {get label(){return todoTagLabel('general');},          icon:'clipboard',color:'gray'},
};

function todoChipBg(tag){
  const c=(TODO_TAGS[tag]||TODO_TAGS.general).color;
  return c==='blue'?'var(--blue-50)':c==='green'?'var(--green-50)':c==='orange'?'var(--orange-50)':'var(--bg)';
}
function todoChipFg(tag){
  const c=(TODO_TAGS[tag]||TODO_TAGS.general).color;
  return c==='blue'?'var(--blue-700)':c==='green'?'var(--green-700)':c==='orange'?'var(--orange-600)':'var(--muted)';
}

/* ----- the row used in the list + inline cards ----- */
function TodoRow({t, compact}){
  useStore();
  useLang();
  const isAr = NavI18n.lang === 'ar';
  const group = t.groupId ? Nav.groupById(t.groupId) : null;
  const student = t.studentId ? Nav.studentById(t.studentId) : null;
  const session = t.sessionId ? Nav.sessionById(t.sessionId) : null;
  const meta = TODO_TAGS[t.tag]||TODO_TAGS.general;
  const prio = t.priority||'normal';
  return <div className="row gap-12" style={{padding:compact?'10px 12px':'14px 16px',borderRadius:10,background:t.done?'var(--bg)':'#fff',border:'1px solid var(--line-2)',opacity:t.done?.6:1,alignItems:'flex-start'}}>
    <button onClick={()=>Nav.toggleTodo(t.id)} style={{flex:'none',width:22,height:22,borderRadius:8,border:'2px solid '+(t.done?'var(--green-600)':'var(--line)'),background:t.done?'var(--green-600)':'#fff',display:'grid',placeItems:'center',cursor:'pointer',marginTop:1}}>
      {t.done && <Icon name="check" size={13} style={{color:'#fff'}}/>}
    </button>
    <div className="col grow" style={{gap:6,minWidth:0}}>
      <span className={`w-600 t-${compact?'13':'14'}`} style={{textDecoration:t.done?'line-through':'none',color:'var(--ink)',lineHeight:1.35}}>{txData?txData(t.text):t.text}</span>
      <div className="row gap-8 wrap" style={{alignItems:'center',rowGap:6}}>
        <span className="chip" style={{background:todoChipBg(t.tag),color:todoChipFg(t.tag),fontSize:10.5,padding:'3px 8px',fontWeight:700}}><Icon name={meta.icon} size={11}/>{meta.label}</span>
        {prio==='high' && <span className="chip chip-weak" style={{fontSize:10.5,padding:'3px 7px'}}>⚡ {isAr?'أولويّة':'Priorité'}</span>}
        {group && <span className="faint t-11">· {group.name}</span>}
        {student && <span className="faint t-11">· {student.name}</span>}
        {session && <span className="faint t-11">· {isAr?'حصّة':'séance'} {fmtFr?fmtFr(session.date):session.date}</span>}
      </div>
    </div>
    {!compact && <button className="btn btn-ghost btn-sm btn-icon" onClick={()=>Nav.removeTodo(t.id)}><Icon name="x" size={13}/></button>}
  </div>;
}

/* ----- compact inline composer reused on group / student / session ----- */
function TodoComposer({defaultTag, groupId, studentId, sessionId, placeholder, onAdded}){
  useLang();
  const isAr = NavI18n.lang === 'ar';
  const [text, setText] = React.useState('');
  const [tag, setTag] = React.useState(defaultTag||'lesson-prep');
  const [prio, setPrio] = React.useState('normal');
  const submit = ()=>{ if(!text.trim()) return;
    Nav.addTodo({text, tag, priority:prio, groupId, studentId, sessionId});
    setText(''); navToast(isAr?'تمّت إضافة المهمّة':'Tâche ajoutée','green'); onAdded&&onAdded();
  };
  return <div className="col gap-10">
    <div className="row gap-10 wrap" style={{alignItems:'stretch',rowGap:10}}>
      <input className="input" style={{flex:'1 1 240px'}} placeholder={placeholder||(isAr?'إضافة مهمّة…':'Ajouter une tâche…')} value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')submit();}}/>
      <Btn variant="primary" size="sm" icon="plus" onClick={submit}>{isAr?'إضافة':'Ajouter'}</Btn>
    </div>
    <div className="row gap-7 wrap" style={{rowGap:8,alignItems:'center'}}>
      {Object.entries(TODO_TAGS).map(([k,m])=> <button key={k} className={`pick ${tag===k?'on':''}`} onClick={()=>setTag(k)} style={{fontSize:11.5,padding:'5px 10px'}}><Icon name={m.icon} size={11}/>{m.label}</button>)}
      <span style={{flex:1}}/>
      <button className={`pick ${prio==='high'?'on':''}`} onClick={()=>setPrio(prio==='high'?'normal':'high')} style={{fontSize:11.5,padding:'5px 10px',color: prio==='high'?'#fff':'var(--muted)', background: prio==='high'?'var(--alert)':'transparent', borderColor: prio==='high'?'var(--alert)':'var(--line)'}}>⚡ {isAr?'أولويّة':'Priorité'}</button>
    </div>
  </div>;
}

/* ----- a tiny card variant used as an embed on Group / Student / SessionEntry ----- */
function ScopedTodos({groupId, studentId, sessionId, title, defaultTag, emptyHint}){
  useStore();
  useLang();
  const isAr = NavI18n.lang === 'ar';
  const list = (groupId? Nav.todosByGroup(groupId)
              : studentId? Nav.todosByStudent(studentId)
              : sessionId? Nav.todosBySession(sessionId)
              : []);
  const titleText = title || (isAr?'مهامّي في هذه الصّفحة':'Mes tâches sur cette page');
  return <div className="card pad-20 col gap-14">
    <div className="row between wrap" style={{gap:8}}>
      <h3 className="row gap-8" style={{fontSize:15}}><Icon name="target" size={16} style={{color:'var(--blue-700)'}}/>{titleText}</h3>
      <span className="faint t-12 w-600">{list.length} {isAr?'جارية':'en cours'}</span>
    </div>
    <TodoComposer defaultTag={defaultTag} groupId={groupId} studentId={studentId} sessionId={sessionId}
      placeholder={studentId?(isAr?'مثلاً: تحضير ورقة لهذا التّلميذ…':'Ex : préparer une fiche pour cet élève…'):sessionId?(isAr?'مثلاً: مراجعة مثال الإشارات…':'Ex : revoir l\'exemple des signes…'):(isAr?'مثلاً: تحضير الفصل القادم…':'Ex : préparer le prochain chapitre…')}/>
    <div className="col gap-8">
      {list.length===0 && <span className="faint t-13">{emptyHint||(isAr?'لا توجد مهمّة حاليّاً.':'Aucune tâche pour l\'instant.')}</span>}
      {list.map(t=> <TodoRow key={t.id} t={t} compact/>)}
    </div>
  </div>;
}

/* ----- the full "Mes tâches" screen in the sidebar ----- */
function TodosList({go}){
  useStore();
  useLang();
  const isAr = NavI18n.lang === 'ar';
  const isMobile = useIsMobile();
  const [tab, setTab] = React.useState('active');
  const [filterTag, setFilterTag] = React.useState('all');
  const [filterScope, setFilterScope] = React.useState('all');
  const all = Nav.todosAll();
  let list = tab==='done' ? all.filter(t=>t.done) : all.filter(t=>!t.done);
  if(filterTag!=='all') list = list.filter(t=>t.tag===filterTag);
  if(filterScope==='group') list = list.filter(t=>t.groupId);
  if(filterScope==='student') list = list.filter(t=>t.studentId);
  if(filterScope==='session') list = list.filter(t=>t.sessionId);
  if(filterScope==='unscoped') list = list.filter(t=>!t.groupId && !t.studentId && !t.sessionId);
  // sort: priority high first, then by createdAt desc
  list = [...list].sort((a,b)=>{
    if((a.priority==='high'?0:1)!==(b.priority==='high'?0:1)) return (a.priority==='high'?0:1)-(b.priority==='high'?0:1);
    return (b.createdAt||'').localeCompare(a.createdAt||'');
  });
  const counts = {
    all: Nav.todosActive().length,
    'lesson-prep': Nav.todosActive().filter(t=>t.tag==='lesson-prep').length,
    'parent-followup': Nav.todosActive().filter(t=>t.tag==='parent-followup').length,
    'student-followup': Nav.todosActive().filter(t=>t.tag==='student-followup').length,
    'admin': Nav.todosActive().filter(t=>t.tag==='admin').length,
    'general': Nav.todosActive().filter(t=>t.tag==='general').length,
    done: Nav.todosDone().length,
  };
  return <AppShell go={go} active="todos" title={isAr?'مهامّي':'Mes tâches'}
    crumbs={[{t:isAr?'الفضاء':'Espace',go:()=>go('dashboard')},{t:isAr?'مهامّي':'Mes tâches'}]}
    actions={null}>
    <div className="card pad-16 row gap-10 wrap" style={{marginBottom:18,background:'var(--blue-50)',border:'1px solid var(--blue-100)'}}>
      <Icon name="target" size={18} style={{color:'var(--blue-700)'}}/>
      <span className="t-14 w-600" style={{color:'var(--blue-800)',flex:'1 1 320px'}}>
        {isAr?'مهامّك الشّخصيّة — تحضير الدّروس، متابعة الوالدين، أمور لا تُنسى. يمكن أيضاً إضافة مهمّة مباشرةً من فوج أو تلميذ أو حصّة.':'Vos tâches personnelles — préparation de cours, suivis parents, choses à ne pas oublier. Vous pouvez aussi ajouter une tâche directement depuis un groupe, un élève ou une séance.'}
      </span>
    </div>
    <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 320px',gap:20,alignItems:'start'}}>
      <div className="col gap-14">
        {/* quick add — unscoped */}
        <div className="card pad-18 col gap-10">
          <h3 className="row gap-8" style={{fontSize:16}}><Icon name="plus" size={17} style={{color:'var(--blue-700)'}}/>{isAr?'مهمّة جديدة':'Nouvelle tâche'}</h3>
          <TodoComposer placeholder={isAr?'مثلاً: تحضير ورقة لشهادة BEM التّجريبيّة…':'Ex : préparer une fiche pour le BEM blanc…'}/>
        </div>
        {/* tabs */}
        <div className="row gap-12" style={{borderBottom:'1px solid var(--line-2)',marginTop:4,marginBottom:6}}>
          {[['active', isAr?`جارية (${counts.all})`:`En cours (${counts.all})`], ['done', isAr?`منتهية (${counts.done})`:`Terminées (${counts.done})`]].map(([k,lab])=>
            <button key={k} onClick={()=>setTab(k)} style={{border:'none',background:'transparent',padding:'10px 4px',cursor:'pointer',fontWeight:700,fontSize:14,color:tab===k?'var(--blue-700)':'var(--muted)',borderBottom:tab===k?'2px solid var(--blue-700)':'2px solid transparent',marginBottom:-1}}>{lab}</button>
          )}
        </div>
        {/* filters */}
        <div className="row gap-8 wrap" style={{rowGap:10}}>
          {[['all',isAr?'الكلّ':'Toutes', counts.all], ...Object.entries(TODO_TAGS).map(([k,m])=>[k,m.label,counts[k]])].map(([k,lab,n])=>
            <button key={k} className={`pick ${filterTag===k?'on':''}`} onClick={()=>setFilterTag(k)}>{lab}{n!=null?` (${n})`:''}</button>
          )}
        </div>
        <div className="row gap-8 wrap" style={{rowGap:10,alignItems:'center'}}>
          <span className="faint t-12 w-700" style={{marginRight:2}}>{isAr?'النّطاق:':'Portée :'}</span>
          {[
            ['all',isAr?'الكلّ':'Toutes'],
            ['unscoped',isAr?'عامّة':'Sans portée'],
            ['group',isAr?'تخصّ فوجاً':'Liées à un groupe'],
            ['student',isAr?'تخصّ تلميذاً':'Liées à un élève'],
            ['session',isAr?'تخصّ حصّة':'Liées à une séance']
          ].map(([k,lab])=>
            <button key={k} className={`pick ${filterScope===k?'on':''}`} onClick={()=>setFilterScope(k)} style={{fontSize:11.5,padding:'4px 10px'}}>{lab}</button>
          )}
        </div>
        {/* list */}
        <div className="col gap-8">
          {list.length===0 && <div className="card pad-24 col center" style={{gap:8,textAlign:'center'}}><Icon name="check" size={26} style={{color:'var(--green-600)'}}/><span className="muted">{isAr?'لا توجد مهمّة في هذا التّصنيف.':'Aucune tâche dans cette catégorie.'}</span></div>}
          {list.map(t=> <TodoRow key={t.id} t={t}/>)}
        </div>
      </div>
      {/* side: by-scope quick navigation */}
      <div className="col gap-14" style={{position:'sticky',top:90}}>
        <div className="card pad-20 col gap-14">
          <h3 style={{fontSize:15}}>{isAr?'حسب الفوج':'Par groupe'}</h3>
          <div className="col gap-10">
            {Nav.groupsAll().map(g=>{const n=Nav.todosByGroup(g.id).length; return <div key={g.id} className="row between" style={{cursor:n?'pointer':'default',gap:10}} onClick={()=>n&&go('group-detail',g.id)}><span className="t-13 w-600 muted" style={{flex:'1 1 auto',minWidth:0}}>{g.name}</span><span className={`chip ${n>0?'chip-blue':'chip-gray'}`} style={{fontSize:11,padding:'3px 9px'}}>{n}</span></div>;})}
          </div>
        </div>
        <div className="card pad-20 col gap-14">
          <h3 style={{fontSize:15}}>{isAr?'متابعات الوالدين المنتظِرة':'Suivis parents en attente'}</h3>
          <div className="col gap-12">
            {(()=>{const list=Nav.todosActive().filter(t=>t.tag==='parent-followup'); return list.length===0?<span className="faint t-13">{isAr?'لا شيء.':'Aucun.'}</span>:list.map(t=><div key={t.id} className="col" style={{gap:3}}>
              <span className="w-600 t-13" style={{lineHeight:1.35}}>{txData?txData(t.text):t.text}</span>
              {t.studentId && <span className="faint t-12">{Nav.studentById(t.studentId)?.name}</span>}
            </div>);})()}
          </div>
        </div>
      </div>
    </div>
  </AppShell>;
}

window.TodoRow = TodoRow;
window.TodoComposer = TodoComposer;
window.ScopedTodos = ScopedTodos;
window.TodosList = TodosList;
window.TODO_TAGS = TODO_TAGS;
