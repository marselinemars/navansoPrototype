/* NAVANSO — CreateGroup + AddStudent forms (P0 fixes from audit). */

function CreateGroup({go, id}){
  useStore();
  const isMobile = useIsMobile();
  const editing = !!id;
  const existing = editing ? Nav.groupById(id) : null;
  const [name, setName] = React.useState(existing?.name || '');
  const [subject, setSubject] = React.useState(existing?.subject || 'Mathématiques');
  const [level, setLevel] = React.useState(existing?.level || '4e AM');
  const [cap, setCap] = React.useState(existing?.cap || 8);
  const [schedule, setSchedule] = React.useState(existing?.schedule || 'Samedi & Mardi · 16h–17h30');
  const [loc, setLoc] = React.useState(existing?.loc || 'Ouargla centre');
  const [mode, setMode] = React.useState(existing?.mode || 'Présentiel');
  const studentCount = editing ? Nav.studentsByGroup(id).length : 0;
  const valid = name.trim() && subject && level && cap >= studentCount;
  const submit = ()=>{
    if(!valid) return;
    if(editing){
      Nav.updateGroup(id, {name:name.trim(), subject, level, cap, schedule, loc, mode});
      navToast('Groupe mis à jour','green');
      go('group-detail', id);
    } else {
      const gid = Nav.addGroup({name:name.trim(), subject, level, cap, schedule, loc, mode});
      navToast('Groupe créé','green');
      go('group-detail', gid);
    }
  };
  const onDelete = ()=>{
    if(studentCount>0){ navToast('Retirez d\'abord les élèves de ce groupe','orange'); return; }
    if(confirm('Supprimer ce groupe définitivement ?')){
      Nav.deleteGroup(id); navToast('Groupe supprimé','orange'); go('groups');
    }
  };
  return <AppShell go={go} active="create-group" title={editing?'Modifier le groupe':'Nouveau groupe'}
    crumbs={[{t:'Groupes',go:()=>go('groups')},
      editing?{t:existing?.name||'',go:()=>go('group-detail', id)}:null,
      {t:editing?'Modifier':'Nouveau'}].filter(Boolean)}
    actions={<>
      {editing && <Btn variant="ghost" icon="x" onClick={onDelete}>Supprimer</Btn>}
      <Btn variant="primary" icon="check" onClick={submit} style={valid?{}:{opacity:.5,pointerEvents:'none'}}>{editing?'Enregistrer les modifications':'Créer le groupe'}</Btn>
    </>}>
    <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 320px',gap:20,alignItems:'start'}}>
      <div className="col gap-18">
        <div className="card pad-24 col gap-14">
          <h3 style={{fontSize:17}}>Informations principales</h3>
          <Field label="Nom du groupe (visible par les parents)">
            <input className="input" placeholder="Ex : Math 4AM — Préparation BEM" value={name} onChange={e=>setName(e.target.value)}/>
          </Field>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
            <Field label="Matière">
              <select className="select" value={subject} onChange={e=>setSubject(e.target.value)}>{['Mathématiques','Physique','Arabe','Sciences','Français','Anglais'].map(s=><option key={s}>{s}</option>)}</select>
            </Field>
            <Field label="Niveau">
              <select className="select" value={level} onChange={e=>setLevel(e.target.value)}>{['Primaire','1AM','2AM','3e AM','4e AM','1AS'].map(s=><option key={s}>{s}</option>)}</select>
            </Field>
          </div>
        </div>
        <div className="card pad-24 col gap-14">
          <h3 style={{fontSize:17}}>Capacité & format</h3>
          <Field label="Capacité maximale" hint={editing && studentCount>0 ? `Ce groupe a ${studentCount} élève${studentCount>1?'s':''} inscrit${studentCount>1?'s':''} — la capacité ne peut pas descendre en dessous.`:undefined}>
            <div className="row gap-12" style={{alignItems:'center'}}>
              <input type="range" min={Math.max(2, studentCount)} max="14" value={cap} onChange={e=>setCap(+e.target.value)} style={{flex:1,accentColor:'var(--blue-600)'}}/>
              <span className="chip chip-blue w-700" style={{minWidth:74,justifyContent:'center'}}>{cap} élèves</span>
            </div>
          </Field>
          <Field label="Format">
            <div className="seg" style={{alignSelf:'flex-start'}}>
              {['Présentiel','En ligne','Hybride'].map(m=><button key={m} className={mode===m?'on':''} onClick={()=>setMode(m)}>{m}</button>)}
            </div>
          </Field>
        </div>
        <div className="card pad-24 col gap-14">
          <h3 style={{fontSize:17}}>Horaire & lieu</h3>
          <Field label="Créneaux (texte libre pour le MVP)">
            <input className="input" value={schedule} onChange={e=>setSchedule(e.target.value)}/>
          </Field>
          <Field label="Lieu / commune">
            <input className="input" value={loc} onChange={e=>setLoc(e.target.value)}/>
          </Field>
        </div>
      </div>
      <div className="col gap-14" style={{position:'sticky',top:90}}>
        <span className="eyebrow">Aperçu</span>
        <div className="card pad-18 col gap-10">
          <span className="w-700 t-16">{name||'Nom du groupe'}</span>
          <div className="row gap-7 wrap"><span className="chip chip-blue">{subject}</span><span className="chip chip-gray">{level}</span></div>
          <div className="card-flat" style={{padding:10,borderRadius:10,background:'var(--bg)',border:'none'}}>
            <div className="row between"><span className="t-12 w-700 muted">Capacité</span><Places places={cap} cap={cap}/></div>
            <div style={{marginTop:8}}><SeatRow cap={cap} students={0}/></div>
          </div>
          <span className="faint t-12">{schedule} · {loc}</span>
        </div>
        <Btn variant="primary" icon="check" block onClick={submit} style={valid?{}:{opacity:.5,pointerEvents:'none'}}>{editing?'Enregistrer les modifications':'Créer le groupe'}</Btn>
        <Btn variant="ghost" block onClick={()=>editing?go('group-detail', id):go('groups')}>Annuler</Btn>
      </div>
    </div>
  </AppShell>;
}

function AddStudent({go, id}){
  const isMobile = useIsMobile();
  // id may be the destination groupId
  const gid = id || (Nav.groupsAll()[0]||{}).id;
  const [name, setName] = React.useState('');
  const [level, setLevel] = React.useState('4e AM');
  const [parentName, setParentName] = React.useState('');
  const [parentPhone, setParentPhone] = React.useState('');
  const [subject, setSubject] = React.useState('Mathématiques');
  const [groupId, setGroupId] = React.useState(gid);
  const groups = Nav.groupsAll();
  // sibling check: if phone matches an existing parent, surface their other kids
  const matchedParent = parentPhone ? Nav.parentByPhone(parentPhone) : null;
  const siblings = matchedParent ? matchedParent.children.map(cid=>Nav.studentById(cid)).filter(Boolean) : [];
  const valid = name.trim() && parentName.trim() && parentPhone.trim() && groupId;
  const submit = ()=>{
    if(!valid) return;
    const sid = Nav.addStudent({name:name.trim(), level, parentName:parentName.trim(), parentPhone:parentPhone.trim(), groupId, subject});
    navToast(matchedParent?`Élève ajouté · lié au parent existant`:'Élève ajouté','green');
    go('student-profile', sid);
  };
  return <AppShell go={go} active="add-student" title="Ajouter un élève"
    crumbs={[{t:'Groupes',go:()=>go('groups')},{t:'Ajouter un élève'}]}
    actions={<Btn variant="primary" icon="check" onClick={submit} style={valid?{}:{opacity:.5,pointerEvents:'none'}}>Ajouter l'élève</Btn>}>
    <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 320px',gap:20,alignItems:'start'}}>
      <div className="col gap-18">
        <div className="card pad-24 col gap-14">
          <h3 style={{fontSize:17}}>Élève</h3>
          <Field label="Nom complet"><input className="input" placeholder="Ex : Yasmine Tahar" value={name} onChange={e=>setName(e.target.value)}/></Field>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
            <Field label="Niveau">
              <select className="select" value={level} onChange={e=>setLevel(e.target.value)}>{['Primaire','1AM','2AM','3e AM','4e AM','1AS'].map(s=><option key={s}>{s}</option>)}</select>
            </Field>
            <Field label="Matière principale">
              <select className="select" value={subject} onChange={e=>setSubject(e.target.value)}>{['Mathématiques','Physique','Arabe','Sciences','Français','Anglais'].map(s=><option key={s}>{s}</option>)}</select>
            </Field>
          </div>
          <Field label="Groupe">
            <select className="select" value={groupId} onChange={e=>setGroupId(e.target.value)}>{groups.map(g=><option key={g.id} value={g.id}>{g.name} — {g.places} place{g.places>1?'s':''}</option>)}</select>
          </Field>
        </div>
        <div className="card pad-24 col gap-14">
          <h3 style={{fontSize:17}}>Parent</h3>
          <Field label="Téléphone / WhatsApp du parent" hint="Si ce numéro est déjà connu, l'élève sera lié au même parent que ses frères et sœurs.">
            <input className="input" placeholder="+213 …" value={parentPhone} onChange={e=>setParentPhone(e.target.value)}/>
          </Field>
          {matchedParent && <div className="card-flat" style={{padding:'10px 12px',borderRadius:10,background:'var(--green-50)',border:'1px solid var(--green-100)'}}>
            <span className="row gap-8 t-13 w-700" style={{color:'var(--green-700)'}}><Icon name="checkc" size={14}/>Parent existant : {matchedParent.name}</span>
            {siblings.length>0 && <span className="t-12 muted" style={{display:'block',marginTop:4}}>Frère(s) / sœur(s) déjà inscrit(e)(s) : {siblings.map(s=>s.name.split(' ')[0]).join(', ')}</span>}
          </div>}
          <Field label="Nom du parent"><input className="input" placeholder="Ex : Mme Tahar" value={parentName} onChange={e=>setParentName(e.target.value)}/></Field>
        </div>
      </div>
      <div className="col gap-14" style={{position:'sticky',top:90}}>
        <PrivacyNote/>
        <div className="card pad-16 col gap-8" style={{background:'var(--blue-50)',border:'1px solid var(--blue-100)'}}>
          <span className="row gap-8 w-700 t-13" style={{color:'var(--blue-800)'}}><Icon name="shield" size={15}/>Liaison parent ↔ enfant</span>
          <span className="t-12 lh-14" style={{color:'var(--blue-900)'}}>Le téléphone est la clé : il évite les doublons quand un même parent a plusieurs enfants en cours.</span>
        </div>
        <Btn variant="primary" icon="check" block onClick={submit} style={valid?{}:{opacity:.5,pointerEvents:'none'}}>Ajouter l'élève</Btn>
        <Btn variant="ghost" block onClick={()=>go('group-detail', gid)}>Annuler</Btn>
      </div>
    </div>
  </AppShell>;
}

window.CreateGroup = CreateGroup;
window.AddStudent = AddStudent;
