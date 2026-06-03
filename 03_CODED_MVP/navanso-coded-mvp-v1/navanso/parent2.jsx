/* NAVANSO — Tutor public profile (parent-facing, trust before contact) */

function ProfSection({title, children, id}){
  return <div className="card pad-24 col gap-16" id={id}>
    <h3 style={{fontSize:18}}>{title}</h3>
    {children}
  </div>;
}

function AvailGroupRow({g, go}){
  useLang();
  const isAr = NavI18n.lang==='ar';
  return <div className="card-flat" style={{padding:16,borderRadius:12,border:'1px solid var(--line)'}}>
    <div className="row between wrap" style={{gap:12}}>
      <div className="col gap-7">
        <div className="row gap-8">
          <span className="w-700 t-15">{txData?txData(g.subject):g.subject} · {txData?txData(g.level):g.level}</span>
          {g.places>0 ? <Places places={g.places} cap={g.cap}/> : <span className="places places-full"><span className="dot"></span>{isAr?'كامل':'Complet'}</span>}
        </div>
        <div className="row gap-16 wrap">
          <span className="row gap-6 t-13 muted w-600"><Icon name="calendar" size={14}/>{txData?txData(g.schedule):g.schedule}</span>
          <span className="row gap-6 t-13 muted w-600"><Icon name="pin" size={14}/>{txData?txData(g.loc):g.loc}</span>
          <span className="row gap-6 t-13 muted w-600"><Icon name="users" size={14}/>{txData?txData(g.mode):g.mode}</span>
        </div>
        <div className="row gap-10" style={{marginTop:2}}>
          <SeatRow cap={g.cap} students={g.students}/>
          <span className="faint t-12 w-600">{g.students} / {g.cap} {isAr?`تلاميذ · بحدّ أقصى ${g.cap}`:`élèves · max ${g.cap}`}</span>
        </div>
      </div>
      <Btn variant={g.places>0?'green':'ghost'} size="sm" icon={g.places>0?'wa':'bell'} onClick={()=>g.places>0?go('inquiry','t1'):navToast(isAr?'سيصلك إشعار فور توفّر مكان':'Vous serez prévenu·e dès qu\'une place se libère','blue')}>
        {g.places>0?(isAr?'تواصل مع الأستاذ':'Contacter l\'enseignant'):(isAr?'أخبرني عند توفّر مكان':'M\'avertir d\'une place')}
      </Btn>
    </div>
  </div>;
}

function TutorProfile({go}){
  useLang();
  const isMobile = useIsNarrow();
  const tu=NAV.tutor;
  const isAr = NavI18n.lang==='ar';
  /* Localised tutor bio + method (kept inline rather than in data.jsx
     to minimise the change surface for Phase 1). */
  const bioAr = "أستاذة رياضيات متخصّصة في التّحضير لشهادة BEM. أعمل في أفواج صغيرة لمتابعة كلّ تلميذ عن قرب، تحديد النّقاط التي تحتاج إلى مراجعة، وإبقاء الأولياء على اطّلاع بالتّقدّم الفعلي.";
  const methodAr = ["أفواج صغيرة بـ 8 تلاميذ كحدّ أقصى","تقييم بعد كلّ فصل","تقرير متابعة شهري للأولياء","تمارين موجَّهة على النّقاط التي تحتاج إلى مراجعة"];
  const expAr = "5 سنوات خبرة في الدّعم المدرسي";
  const trustAr = {'Profil complété':'ملف مكتمل','Rapports de suivi disponibles':'تقارير متابعة متوفّرة','Petits groupes':'أفواج صغيرة'};
  const formatAr = 'فوج صغير · حضوري';
  const showcaseAr = {
    ve1:{caption:'رسالة من أم بعد BEM 2025', preview:'تحصّل خالد على 18/20 في الرياضيات في BEM. شكراً جزيلاً أستاذة أمينة على العمل طوال السنة.', meta:'السيدة حاج علي · جويلية 2025'},
    ve2:{caption:'كراس تمارين مصحّحة (4 متوسط)', preview:'صور لبطاقات العمل في الفوج الصغير — قواعد الإشارات، المعادلات، المسائل.', meta:'السنة 2025-2026'},
    ve3:{caption:'ليسانس في الرياضيات', preview:'جامعة قاصدي مرباح · ورقلة، 2017. تقدير جيد.', meta:'شهادة رسمية'},
    ve4:{caption:'رأي أب أثناء السنة', preview:'ياسين أصبح أكثر حماساً منذ أن بدأ معك. التقارير تساعدنا كثيراً في البيت.', meta:'السيد بن علي · أفريل 2026'},
  };
  const testimonialAr = [
    {text:'أتلقى تقريراً واضحاً كل شهر. أخيراً أعرف ما الذي يجب أن يعمل عليه ابني في البيت.', role:'ولي ياسين، 4 متوسط'},
    {text:'الفوج الصغير والمتابعة يصنعان الفرق. الأماكن المحدودة تبين أن الأستاذة تأخذ الأمر بجدية.', role:'ولي لينا، 4 متوسط'},
  ];
  return <div className="screen-anim" style={{minHeight:'100%'}}>
    <MarketingNav go={go} active="parent-search"/>
    {/* back */}
    <div style={{maxWidth:1100,margin:'0 auto',padding:'18px 40px 0'}}>
      <button className="btn btn-ghost btn-sm" onClick={()=>go('parent-search')}><Icon name="arrowl" size={16}/>{t('tp.back')}</button>
    </div>
    {/* header */}
    <div style={{maxWidth:1100,margin:'0 auto',padding:'16px 40px 0'}}>
      <div className="card" style={{padding:26,borderRadius:18,display:'flex',gap:22,alignItems:'center',flexWrap:'wrap'}}>
        <Avatar initials={tu.initials} cls={tu.av} size={84} ring/>
        <div className="col gap-8 grow" style={{minWidth:260}}>
          <div className="row gap-12 wrap" style={{alignItems:'center'}}>
            <h1 style={{fontSize:28}}>{isAr?txData(tu.name):tu.name}</h1>
            <Stars rating={tu.rating} reviews={tu.reviews}/>
            <DemoTag>{isAr?'تقييم تجريبي':'Note démo'}</DemoTag>
          </div>
          <div className="row gap-8 wrap">
            <span className="chip chip-blue"><Icon name="book" size={13}/>{tu.subjects.map(s=>txData?txData(s):s).join(' · ')}</span>
            <span className="chip chip-gray">{tu.levels.map(s=>txData?txData(s):s).join(' · ')}</span>
            <span className="chip chip-gray"><Icon name="pin" size={13}/>{tu.wilaya}</span>
            <span className="chip chip-green"><Icon name="users" size={13}/>{isAr?formatAr:tu.format}</span>
          </div>
          <div className="row gap-10 wrap" style={{marginTop:4}}>
            {NAV.tutorTrust.map((x,i)=><span key={i} className="badge badge-verified"><Icon name={x.icon==='check'?'checkc':x.icon} size={14}/>{isAr?(trustAr[x.label]||x.label):x.label}</span>)}
            <FutureTag icon="shield">{isAr?'التحقّق من الهويّة · قريباً':'Vérification d\'identité · à venir'}</FutureTag>
          </div>
          {(tu.price || tu.trial) && <div className="row gap-12 wrap" style={{marginTop:8,alignItems:'baseline'}}>
            {tu.price && <span className="t-15 w-700">{isAr?'ابتداءً من ':'À partir de '}{tu.price.toLocaleString('fr-FR')} DZD<span className="faint t-13 w-600"> / {isAr?'شهر':(tu.priceUnit||'mois')}</span></span>}
            {tu.trial && <span className="chip chip-green w-700"><Icon name="checkc" size={13}/>{isAr?'حصّة تجريبيّة مجانيّة':'Séance d\'essai gratuite'}</span>}
          </div>}
        </div>
        <div className="col gap-10" style={{minWidth:200}}>
          <Btn variant="green" icon="wa" block onClick={()=>go('inquiry','t1')}>{t('tp.contact')}</Btn>
          <Btn variant="ghost" icon="file" block onClick={()=>go('parent-report','r-yacine-mai-2026')}>{t('tp.seeReport')}</Btn>
        </div>
      </div>
    </div>
    {/* body grid */}
    <div style={{maxWidth:1100,margin:'0 auto',padding:isMobile?'16px':'20px 40px 64px',display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 320px',gap:isMobile?16:22,alignItems:'start'}}>
      <div className="col gap-18">
        <ProfSection title={t('tp.about')}>
          <p className="t-15 lh-15" style={{color:'var(--ink-2)'}}>{isAr?bioAr:tu.bio}</p>
          <div className="row gap-20 wrap">
            <div className="row gap-8"><Icon name="clock" size={18} style={{color:'var(--blue-600)'}}/><span className="t-14 w-600">{isAr?expAr:tu.experience}</span></div>
            <div className="row gap-8"><Icon name="users" size={18} style={{color:'var(--green-600)'}}/><span className="t-14 w-600">{isAr?`أفواج بـ ${tu.capacity} تلاميذ كحدّ أقصى`:`Groupes de ${tu.capacity} élèves max`}</span></div>
          </div>
        </ProfSection>
        <ProfSection title={t('tp.subjectsLevels')}>
          <div className="row gap-16 wrap">
            <div className="card-flat" style={{padding:14,borderRadius:12,border:'1px solid var(--line)',flex:'1 1 200px'}}>
              <span className="t-12 faint w-700" style={{textTransform:'uppercase',letterSpacing:'.04em'}}>{t('tp.subjects')}</span>
              <div className="row gap-7 wrap" style={{marginTop:8}}>{tu.subjects.map(s=><span key={s} className="chip chip-blue">{txData?txData(s):s}</span>)}</div>
            </div>
            <div className="card-flat" style={{padding:14,borderRadius:12,border:'1px solid var(--line)',flex:'1 1 200px'}}>
              <span className="t-12 faint w-700" style={{textTransform:'uppercase',letterSpacing:'.04em'}}>{t('tp.levels')}</span>
              <div className="row gap-7 wrap" style={{marginTop:8}}>{tu.levels.map(s=><span key={s} className="chip chip-gray">{txData?txData(s):s}</span>)}</div>
            </div>
          </div>
        </ProfSection>
        <ProfSection title={t('tp.groupsAvail')}>
          <div className="row gap-10 wrap" style={{alignItems:'center',marginTop:-4}}>
            <FutureTag icon="calendar">{t('tp.futureBooking')}</FutureTag>
            <span className="faint t-13">{t('tp.todayContact')}</span>
          </div>
          <div className="col gap-12">
            {NAV.tutorGroups.map(g=><AvailGroupRow key={g.id} g={g} go={go}/>)}
          </div>
        </ProfSection>
        <ProfSection title={t('tp.method')}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            {(isAr?methodAr:tu.method).map((m,i)=><div key={i} className="row gap-10" style={{alignItems:'flex-start'}}>
              <div className="icn" style={{width:30,height:30,borderRadius:9,background:'var(--green-50)',color:'var(--green-700)',display:'grid',placeItems:'center',flex:'none'}}><Icon name="check" size={16}/></div>
              <span className="t-14 lh-14" style={{color:'var(--ink-2)',paddingTop:3}}>{m}</span>
            </div>)}
          </div>
        </ProfSection>
        <ProfSection title={t('tp.showcase')}>
          <div className="row gap-10 wrap" style={{alignItems:'center',rowGap:6}}>
            <span className="chip chip-blue w-700"><Icon name="shield" size={13}/>{t('tp.showcase.chip')}</span>
            <span className="faint t-13">{t('tp.showcase.desc')}</span>
          </div>
          <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:12}}>
            {(t.vitrineExterne||[]).map(item=>{
              const locItem = isAr ? (showcaseAr[item.id]||{}) : {};
              const iconName = item.type==='whatsapp'?'wa':item.type==='diploma'?'file':item.type==='notebook'?'book':'clipboard';
              const tone = item.type==='whatsapp'?'green':item.type==='diploma'?'blue':'orange';
              const bg = {green:'var(--green-50)',blue:'var(--blue-50)',orange:'var(--orange-50)'}[tone];
              const fg = {green:'var(--green-700)',blue:'var(--blue-700)',orange:'var(--orange-600)'}[tone];
              return <div key={item.id} className="card-flat" style={{padding:14,borderRadius:12,border:'1px solid var(--line)'}}>
                <div className="row gap-10" style={{marginBottom:10}}>
                  <div className="icn" style={{width:34,height:34,borderRadius:10,background:bg,color:fg,display:'grid',placeItems:'center',flex:'none'}}><Icon name={iconName} size={17}/></div>
                  <div className="col" style={{gap:1,minWidth:0}}><span className="w-700 t-14">{locItem.caption||item.caption}</span><span className="faint t-11">{locItem.meta||item.meta}</span></div>
                </div>
                <p className="t-13 lh-15" style={{color:'var(--ink-2)',background:'var(--bg)',padding:'10px 12px',borderRadius:9,fontStyle:'italic'}}>« {locItem.preview||item.preview} »</p>
              </div>;
            })}
          </div>
        </ProfSection>
        <ProfSection title={t('tp.reviews')}>
          {NAV.testimonials.length===0
            ? <div className="card-flat" style={{padding:14,borderRadius:12,background:'var(--bg)',border:'none',textAlign:'center'}}>
                <span className="muted t-14">{t('tp.noReviews')}</span>
              </div>
            : <>
              <DemoTag style={{alignSelf:'flex-start'}}>{isAr?'بيانات تجريبيّة · شهادات للتّوضيح':'Données démo · témoignages illustratifs'}</DemoTag>
              <div className="col gap-14">
                {NAV.testimonials.map((x,i)=><div key={i} className="card-flat" style={{padding:16,borderRadius:12,background:'var(--bg)',border:'none'}}>
                  <p className="t-15 lh-15" style={{color:'var(--ink-2)',marginBottom:10}}>“{isAr?(testimonialAr[i]?.text||x.text):x.text}”</p>
                  <div className="row gap-10"><Avatar initials={x.initials} cls={x.av} size={32}/><span className="w-700 t-13">{x.name}</span><span className="faint t-12">· {isAr?(testimonialAr[i]?.role||x.role):x.role}</span></div>
                </div>)}
              </div>
            </>}
        </ProfSection>
      </div>
      {/* sticky contact rail */}
      <div className="col gap-16" style={{position:'sticky',top:90}}>
        <div className="card pad-20 col gap-14">
          <span className="eyebrow">{isAr?'تواصل':'Contact'}</span>
          <h3 style={{fontSize:17}}>{t('tp.rail.title')}</h3>
          <div className="card-flat" style={{padding:'14px 14px',borderRadius:12,background:'var(--green-50)',border:'1px solid var(--green-100)'}}>
            <div className="row between wrap" style={{gap:10,rowGap:8}}>
              <span className="t-13 w-600" style={{color:'var(--green-800,var(--green-700))'}}>{isAr?'فوج رياضيات 4 متوسط':'Groupe Math 4AM'}</span>
              <Places places={2} cap={8}/>
            </div>
            <p className="t-12 muted" style={{marginTop:8}}>{isAr?'التحضير لـ BEM · السبت والثلاثاء':'Préparation BEM · Samedi & Mardi'}</p>
          </div>
          <div className="col gap-10">
            <Btn variant="green" icon="wa" block onClick={()=>go('inquiry','t1')}>{t('tp.contact')}</Btn>
            <Btn variant="ghost" icon="file" block onClick={()=>go('parent-report')}>{t('tp.seeReport')}</Btn>
          </div>
          <p className="faint t-12 lh-14" style={{textAlign:'center',marginTop:2}}>{isAr?'التّواصل يتمّ عبر WhatsApp — القناة التي تستعملها بالفعل.':'Le contact se fait via WhatsApp — le canal que vous utilisez déjà.'}</p>
        </div>
      </div>
    </div>
    <Footer go={go}/>
  </div>;
}

Object.assign(window,{TutorProfile});
