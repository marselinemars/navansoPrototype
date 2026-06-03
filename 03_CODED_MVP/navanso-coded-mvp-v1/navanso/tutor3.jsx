/* NAVANSO — Assessment/weak-point entry + Report generation (core value) */

function Assessment({go}){
  const isMobile = useIsMobile();
  useLang();
  const isAr = NavI18n.lang === 'ar';
  const [weak,setWeak]=React.useState(isAr?['قواعد الإشارات','المسائل']:['Règles de signes','Problèmes']);
  const [understood,setUnderstood]=React.useState(isAr?['خطوات الحلّ']:['Étapes de résolution']);
  const [score,setScore]=React.useState(12);
  const [mode,setMode]=React.useState('note');
  const QUAL = isAr?['غير كافٍ','يحتاج تعزيزاً','مكتسَب','متمكّن']:['Insuffisant','À renforcer','Acquis','Maîtrisé'];
  const [qual,setQual]=React.useState(QUAL[2]);
  const toggle=(arr,set,v)=>set(arr.includes(v)?arr.filter(x=>x!==v):[...arr,v]);
  return <AppShell go={go} active="assessment" title={isAr?'تقييم جديد':'Nouvelle évaluation'} maxw={1080}
    crumbs={[{t:'Yacine',go:()=>go('student-profile')},{t:isAr?'تقييم':'Évaluation'}]}
    actions={<><Btn variant="ghost" icon="check" onClick={()=>{navToast(isAr?'تمّ تسجيل التّقييم':'Évaluation enregistrée');go('student-profile');}}>{isAr?'حفظ':'Enregistrer'}</Btn><Btn variant="primary" icon="sparkle" onClick={()=>go('report-gen')}>{isAr?'إعداد مسوّدة التّقرير':'Générer un brouillon de rapport'}</Btn></>}>
    <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 320px',gap:20,alignItems:'start'}}>
      <div className="col gap-18">
        <div className="card pad-24 col gap-16">
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
            <Field label={isAr?'التّلميذ':'Élève'}><div className="row gap-10 input" style={{alignItems:'center',padding:'8px 12px'}}><Avatar initials="YB" cls="av-o" size={26}/><span className="w-600 t-14">Yacine Benali</span></div></Field>
            <Field label={isAr?'الموضوع / الفصل':'Sujet / chapitre'}><input className="input" defaultValue={isAr?'معادلات من الدّرجة الأولى':'Équations du 1er degré'}/></Field>
          </div>
          {/* score */}
          <Field label={isAr?'العلامة أو المستوى':'Note ou niveau'}>
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
                <button className={mode==='note'?'on':''} onClick={()=>setMode('note')}>{isAr?'علامة':'Note'}</button>
                <button className={mode==='qual'?'on':''} onClick={()=>setMode('qual')}>{isAr?'وصفي':'Qualitatif'}</button>
              </div>
            </div>
          </Field>
        </div>
        {/* concepts understood */}
        <div className="card pad-24 col gap-14">
          <h3 className="row gap-8" style={{fontSize:16}}><Icon name="check" size={18} style={{color:'var(--green-600)'}}/>{isAr?'المفاهيم المُكتسَبة':'Concepts compris'}</h3>
          <div className="row gap-8 wrap">
            {(isAr
              ? ['خطوات الحلّ','الحساب الحرفيّ','وضع المعادلة','التّحقّق','المشاركة']
              : ['Étapes de résolution','Calcul littéral','Mise en équation','Vérification','Participation']
            ).map(c=>
              <button key={c} className={`pick g ${understood.includes(c)?'on':''}`} onClick={()=>toggle(understood,setUnderstood,c)}>{understood.includes(c)&&<Icon name="check" size={14}/>}{c}</button>)}
          </div>
        </div>
        {/* weak points — chips */}
        <div className="card pad-24 col gap-14" style={{border:'1px solid var(--orange-100)'}}>
          <div className="row between">
            <h3 className="row gap-8" style={{fontSize:16}}><Icon name="target" size={18} style={{color:'var(--orange-600)'}}/>{isAr?'النّقاط الضّعيفة':'Points faibles'}</h3>
            <span className="faint t-12">{isAr?'اختر أو أضف وسومك الخاصّة':'Choisissez ou ajoutez vos propres tags'}</span>
          </div>
          <div className="row gap-8 wrap">
            {(isAr
              ? ['قواعد الإشارات','المسائل','الكسور','الهندسة','التّركيز']
              : NAV.weakChips
            ).map(c=>
              <button key={c} className="pick" style={weak.includes(c)?{background:'var(--orange-500)',borderColor:'var(--orange-500)',color:'#fff'}:{}} onClick={()=>toggle(weak,setWeak,c)}>
                {weak.includes(c)&&<Icon name="check" size={14}/>}{c}</button>)}
            <button className="pick" style={{borderStyle:'dashed',color:'var(--muted)'}}><Icon name="plus" size={14}/>{isAr?'إضافة':'Ajouter'}</button>
          </div>
          <Field label={isAr?'الأخطاء المتكرّرة (نصّ حرّ)':'Erreurs répétées (texte libre)'}><textarea className="textarea" defaultValue={isAr?'يخلط بين الإشارات عند نقل حدّ من جهة إلى أخرى. صعوبة في صياغة معادلة من نصّ.':'Confond les signes lors du passage d’un terme de l’autre côté de l’égalité. Difficulté à traduire un énoncé en équation.'}/></Field>
        </div>
        {/* recommendation */}
        <div className="card pad-24 col gap-14">
          <h3 className="row gap-8" style={{fontSize:16}}><Icon name="flag" size={18} style={{color:'var(--green-700)'}}/>{isAr?'توصية الأستاذ':'Recommandation de l’enseignant'}</h3>
          <Field><textarea className="textarea" defaultValue={isAr?'تمارين قصيرة في البيت قبل الحصّة المقبلة، مع تركيز على قواعد الإشارات.':NAV.yacine.reco}/></Field>
        </div>
      </div>
      {/* side preview */}
      <div className="col gap-18" style={{position:'sticky',top:90}}>
        <div className="card pad-20 col gap-12">
          <h3 style={{fontSize:16}}>{isAr?'ملخّص الإدخال':'Résumé de la saisie'}</h3>
          <div className="row between"><span className="muted t-14">{mode==='note'?(isAr?'علامة':'Note'):(isAr?'مستوى':'Niveau')}</span>{mode==='note'?<span className="chip chip-blue w-700 tnum">{score}/20</span>:<span className="chip chip-green w-700">{qual}</span>}</div>
          <div className="col gap-7">
            <span className="t-12 faint w-700" style={{textTransform:'uppercase',letterSpacing:'.04em'}}>{isAr?'مكتسَب':'Compris'}</span>
            <div className="row gap-6 wrap">{understood.length?understood.map(c=><span key={c} className="chip chip-green" style={{fontSize:11.5}}>{c}</span>):<span className="faint t-13">—</span>}</div>
          </div>
          <div className="col gap-7">
            <span className="t-12 faint w-700" style={{textTransform:'uppercase',letterSpacing:'.04em'}}>{isAr?'نقاط ضعيفة':'Points faibles'}</span>
            <div className="row gap-6 wrap">{weak.length?weak.map(c=><span key={c} className="chip chip-weak" style={{fontSize:11.5}}>{c}</span>):<span className="faint t-13">—</span>}</div>
          </div>
          <div className="hr"></div>
          <Btn variant="primary" icon="sparkle" block onClick={()=>go('report-gen')}>{isAr?'إعداد المسوّدة':'Générer un brouillon'}</Btn>
          <p className="faint t-12 lh-14" style={{textAlign:'center'}}>{isAr?'تُراجَع المسوّدة وتُصادَق من طرفك قبل أيّ إرسال.':'Le brouillon sera relu et validé par vous avant tout envoi.'}</p>
        </div>
      </div>
    </div>
  </AppShell>;
}

/* ---------------- REPORT GENERATION ---------------- */
function frenchList(arr){ if(!arr.length)return ''; if(arr.length===1)return arr[0]; return arr.slice(0,-1).join(', ')+' et '+arr[arr.length-1]; }
function ReportGen({go, id}){
  useStore();
  useLang();
  const isAr = NavI18n.lang === 'ar';
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
  const improv=pts.resolved.map(p=>isAr?txData(p.label):p.label.toLowerCase());
  const actives=pts.active.map(p=>isAr?txData(p.label):p.label.toLowerCase());
  const firstName = (y.name||'').split(' ')[0] || (isAr?'التّلميذ':'l\'élève');
  const arabicList = arr => { if(!arr.length) return ''; if(arr.length===1) return arr[0]; return arr.slice(0,-1).join('، ')+' و'+arr[arr.length-1]; };
  const attFracDisplay = isAr ? attFracLoc(y.attFrac) : y.attFrac;
  const recoText = isAr ? txData(y.reco) : y.reco;
  const topicText = isAr ? txData(y.lastLesson) : y.lastLesson;
  const strengthText = s => isAr ? txData(s) : s;
  const pointText = p => isAr ? txData(p.label) : p.label;
  const draft = isAr
    ? `هذا الشّهر، حضر ${firstName} ${attFracDisplay||(y.att+'%')} وأبدى مشاركة جيّدة داخل الفوج (آخر علامة: ${y.result}${y.trend && y.trend!=='+0'?'، بتقدّم قدره '+y.trend+' نقاط':''}).`
      + (improv.length?` خبر سارّ: تطوّر في ${arabicList(improv)}.`:``)
      + `\n\nيبقى العمل على ${actives.length?arabicList(actives):'بعض النّقاط'}. ${recoText||'أنصح ببعض التّمارين القصيرة في البيت قبل الحصّة القادمة.'}`
    : `Ce mois-ci, ${firstName} a assisté à ${y.attFrac||(y.att+'%')} et montre une bonne implication en groupe (dernière note : ${y.result}${y.trend && y.trend!=='+0'?', en progression de '+y.trend+' points':''}).`
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
    navToast(isAr?'تمّت المصادقة على التّقرير. يمكنك مشاركته الآن.':'Rapport validé. Vous pouvez maintenant le partager.','green');
    return token;
  };

  return <AppShell go={go} active="report-gen" title={isAr?`تقرير · ${y.name}`:`Rapport · ${y.name}`} maxw={1120}
    crumbs={[{t:firstName,go:()=>go('student-profile', sid)},{t:isAr?'تقرير':'Rapport'}]}
    actions={validated
      ? <Btn variant="wa" icon="wa" onClick={()=>{
          const r = Nav.reportsByStudent(sid).find(x=>x.status==='validated_sent');
          go('parent-report', r?.token);
        }}>{isAr?'معاينة / مشاركة':'Voir aperçu / Partager'}</Btn>
      : <Btn variant="primary" icon="check" onClick={()=>{if(generated) onValidate();}} style={generated?{}:{opacity:.5,pointerEvents:'none'}}>{isAr?'المصادقة على التّقرير':'Valider le rapport'}</Btn>}>
    {/* step indicator */}
    <div className="card pad-16" style={{marginBottom:16,display:'flex',justifyContent:'center'}}>
      <Stepper steps={isAr?['البيانات المُدخلة','المسوّدة مُعدّة','مصادقة الأستاذ','مشاركة الوالد']:['Données saisies','Brouillon généré','Validation enseignant','Partage parent']} current={!generated?1:!validated?2:3}/>
    </div>
    {/* assistant framing banner — teacher-controlled */}
    <div className="card pad-20 row gap-14" style={{marginBottom:20,background:'linear-gradient(100deg,var(--blue-50),#fff 70%)',border:'1px solid var(--blue-100)'}}>
      <div className="icn" style={{width:42,height:42,borderRadius:12,background:'#fff',color:'var(--blue-700)',display:'grid',placeItems:'center',boxShadow:'var(--sh-1)',flex:'none'}}><Icon name="shield" size={21}/></div>
      <div className="grow"><span className="w-700 t-15">{isAr?'المساعد لا يحلّ محلّ الأستاذ':'L’assistant ne remplace pas l’enseignant'}</span>
        <p className="muted t-14 lh-14" style={{marginTop:2}}>{isAr?'يقوم فقط بإعادة صياغة البيانات المُدخَلة. التّقرير يُراجَع ويُصادَق قبل الإرسال.':'Il reformule uniquement les données saisies. Le rapport doit être relu et validé avant envoi.'}</p></div>
    </div>
    <div className="row gap-12 wrap" style={{marginBottom:20}}>
      <TimeSave icon="clock" style={{flex:'1 1 280px'}}>{isAr?'تقرير يُعَدّ في دقيقة واحدة انطلاقاً من الملاحظات المُدخَلة.':'Rapport généré en 1 minute à partir des remarques déjà saisies.'}</TimeSave>
      <PrivacyNote style={{flex:'1 1 280px'}}/>
    </div>
    <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'320px 1fr',gap:20,alignItems:'start'}}>
      {/* data summary */}
      <div className="card pad-20 col gap-14" style={{position:'sticky',top:90}}>
        <h3 style={{fontSize:16}}>{isAr?'بيانات الإدخال':'Données de la saisie'}</h3>
        <p className="faint t-12" style={{marginTop:-6}}>{isAr?'بيانات مأخوذة من إدخالات الحضور والتّقييم.':'Données issues de vos saisies de présence et d’évaluation.'}</p>
        {[
          [isAr?'الحضور':'Présence',`${y.att} % — ${attFracDisplay}`,'green'],
          [isAr?'آخر موضوع':'Dernier sujet',topicText,'blue'],
          [isAr?'آخر علامة':'Dernière note',`${y.result} (${y.trend})`,'blue']
        ].map(([l,v,t])=>
          <div key={l} className="col gap-2"><span className="faint t-11 w-700" style={{textTransform:'uppercase',letterSpacing:'.04em'}}>{l}</span><span className="w-700 t-14" style={{color:`var(--${t==='green'?'green-700':'blue-700'})`}}>{v}</span></div>)}
        <div className="col gap-7"><span className="t-12 faint w-700" style={{textTransform:'uppercase',letterSpacing:'.04em'}}>{isAr?'النّقاط القويّة':'Points forts'}</span>{y.strengths.map((s,i)=><span key={i} className="t-13 lh-14" style={{color:'var(--ink-2)'}}>• {strengthText(s)}</span>)}</div>
        {pts.resolved.length>0 && <div className="col gap-7"><span className="t-12 w-700" style={{textTransform:'uppercase',letterSpacing:'.04em',color:'var(--green-700)'}}>{isAr?'تحسّنات':'Améliorations'}</span><div className="row gap-6 wrap">{pts.resolved.map((p,i)=><span key={i} className="chip chip-green" style={{fontSize:11.5}}><Icon name="check" size={12}/>{pointText(p)}</span>)}</div></div>}
        <div className="col gap-7"><span className="t-12 faint w-700" style={{textTransform:'uppercase',letterSpacing:'.04em'}}>{isAr?'يحتاج إلى مراجعة':'À travailler'}</span><div className="row gap-6 wrap">{pts.active.length?pts.active.map((p,i)=><span key={i} className="chip chip-weak" style={{fontSize:11.5}}>{pointText(p)}</span>):<span className="faint t-13">—</span>}</div></div>
      </div>
      {/* draft + edit + validation */}
      <div className="col gap-18">
        {/* step generate */}
        {!generated ? (
          <div className="card" style={{padding:'40px 28px',display:'flex',flexDirection:'column',alignItems:'center',gap:16,textAlign:'center'}}>
            <div className="icn" style={{width:60,height:60,borderRadius:18,background:'var(--blue-50)',color:'var(--blue-700)',display:'grid',placeItems:'center'}}><Icon name="sparkle" size={28}/></div>
            <div className="col gap-6" style={{maxWidth:420}}><h3 style={{fontSize:19}}>{isAr?'إعداد مسوّدة التّقرير':'Générer un brouillon de rapport'}</h3><p className="muted t-15 lh-14">{isAr?'يقوم المساعد بإعادة صياغة ملاحظاتك في نصّ واضح للوالدين. يمكنك تعديله بحرّيّة.':'L’assistant reformule vos observations en un texte clair pour les parents. Vous pourrez le modifier librement.'}</p></div>
            <Btn variant="primary" size="lg" icon="sparkle" onClick={()=>{setGenerated(true);navToast(isAr?'تمّ إعداد المسوّدة':'Brouillon généré','blue');}}>{isAr?'إعداد المسوّدة':'Générer le brouillon'}</Btn>
          </div>
        ) : (
          <>
            <div className="card pad-24 col gap-14">
              <div className="row between">
                <h3 className="row gap-8" style={{fontSize:16}}><Icon name="edit" size={17} style={{color:'var(--blue-700)'}}/>{isAr?'مسوّدة — قابلة للتّعديل من طرف الأستاذ':'Brouillon — modifiable par l’enseignant'}</h3>
                <button className="btn btn-ghost btn-sm" onClick={()=>{setGenerated(true);navToast(isAr?'تمّت إعادة الصّياغة':'Brouillon régénéré','blue');}}><Icon name="sparkle" size={15}/>{isAr?'إعادة صياغة':'Reformuler'}</button>
              </div>
              <textarea key={isAr?'ar':'fr'} className="textarea" style={{minHeight:170,fontSize:14.5,lineHeight:1.6}} defaultValue={draft}></textarea>
              <Field label={isAr?'الخطوة المقبلة':'Prochaine étape'}><input key={isAr?'ar':'fr'} className="input" defaultValue={isAr?'تقييم قصير على قواعد الإشارات في الحصّة القادمة.':'Évaluation courte sur les signes à la prochaine séance.'}/></Field>
              <Field label={isAr?'ملاحظة شخصيّة من الأستاذ':'Note personnelle de l’enseignant'}><input key={isAr?'ar':'fr'} className="input" defaultValue={isAr?(y.noteAr||'تلميذ مجتهد، يحتاج إلى مرافقة دقيقة.'):y.note}/></Field>
            </div>
            {/* validation strip */}
            <div className="card pad-20 row between wrap" style={{gap:14,background:validated?'var(--green-50)':'#fff',border:validated?'1px solid var(--green-100)':'1px solid var(--line)'}}>
              <div className="row gap-12">
                <div className="icn" style={{width:40,height:40,borderRadius:12,background:validated?'var(--green-600)':'var(--bg-2)',color:validated?'#fff':'var(--muted)',display:'grid',placeItems:'center'}}><Icon name={validated?'checkc':'shield'} size={20}/></div>
                <div className="col" style={{gap:2}}>
                  <span className="w-700 t-15">{validated?(isAr?'تقرير مُراجَع ومُصادَق عليه من طرف الأستاذ':'Rapport relu et validé par l’enseignant'):(isAr?'راجِع قبل المصادقة':'Relisez avant de valider')}</span>
                  <span className="muted t-13">{validated?(isAr?'جاهز للمشاركة مع الوالد عبر واتساب.':'Prêt à être partagé avec le parent via WhatsApp.'):(isAr?'لن يُرسَل التّقرير ما لم تُصادق عليه.':'Le rapport ne sera pas envoyé tant que vous ne l’aurez pas validé.')}</span>
                </div>
              </div>
              {validated
                ? <Btn variant="wa" icon="wa" onClick={()=>go('whatsapp-share')}>{isAr?'مشاركة عبر واتساب':'Partager via WhatsApp'}</Btn>
                : <Btn variant="primary" icon="check" onClick={onValidate}>{isAr?'المصادقة على التّقرير':'Valider le rapport'}</Btn>}
            </div>
            {/* preview link */}
            <div className="card pad-20 row between" style={{borderStyle:'dashed'}}>
              <div className="row gap-12"><div className="icn" style={{width:38,height:38,borderRadius:11,background:'var(--orange-50)',color:'var(--orange-600)',display:'grid',placeItems:'center'}}><Icon name="phone" size={18}/></div>
                <div className="col" style={{gap:1}}><span className="w-700 t-14">{isAr?'معاينة من جهة الوالد':'Aperçu côté parent'}</span><span className="faint t-13">{isAr?'مشاهدة التّقرير كما سيستلمه الوالد (هاتف).':'Voir le rapport tel que le parent le recevra (mobile).'}</span></div></div>
              <Btn variant="ghost" size="sm" iconR="arrow" onClick={()=>{
                const r = Nav.reportsByStudent(sid).find(x=>x.status==='validated_sent');
                go('parent-report', r?.token);
              }}>{isAr?'عرض المعاينة':'Voir l’aperçu'}</Btn>
            </div>
          </>
        )}
      </div>
    </div>
  </AppShell>;
}

Object.assign(window,{Assessment,ReportGen});
