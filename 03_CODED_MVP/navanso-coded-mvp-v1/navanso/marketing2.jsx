/* NAVANSO — Pricing & Roadmap */

function Pricing({go}){
  useLang();
  const isAr = NavI18n.lang === 'ar';
  const isMobile = useIsNarrow();
  const accent={gray:['var(--bg-2)','var(--ink-2)'],blue:['var(--blue-50)','var(--blue-700)'],
    green:['var(--green-50)','var(--green-700)'],orange:['var(--orange-50)','var(--orange-600)']};
  const plansAr = {
    free:{name:'مجاني', tag:'للبداية', unit:'DZD', desc:'للأساتذة الجدد الذين ينشئون ملفهم.', cta:'ابدأ',
      feats:['ملف أساسي','فوج واحد','حتى 10 تلاميذ','تقارير محدودة','مشاركة عبر WhatsApp']},
    basic:{name:'أستاذ', tag:'الأكثر اختياراً', unit:'DZD / شهر', desc:'للأستاذ المستقل الذي يدير عدة أفواج.', cta:'اختيار هذا العرض',
      feats:['عدة أفواج','إدارة التلاميذ','متابعة الحضور','تقارير غير محدودة للأولياء','مشاركة عبر WhatsApp','سجل التقارير']},
    premium:{name:'أستاذ Premium', tag:'للتوسّع أكثر', unit:'DZD / شهر', desc:'للأستاذ النشط الذي يريد ظهوراً أقوى.', cta:'اختيار هذا العرض',
      feats:['ظهور أقوى للملف','مساعد صياغة التقارير','أفواج وتلاميذ أكثر','متابعة متقدمة لنقاط الضعف','إحصاءات التقدم']},
    center:{name:'مركز', tag:'للهياكل', unit:'يُحدّد لاحقاً', desc:'لمراكز الدعم الصغيرة.', cta:'تواصل معنا',
      feats:['إدارة متعددة الأفواج','حسابات أساتذة','تقارير للأولياء','جدول حضور','هوية المركز']},
  };
  return <div className="screen-anim" style={{minHeight:'100%'}}>
    <MarketingNav go={go} active="pricing"/>
    <div style={{maxWidth:1200,margin:'0 auto',padding:isMobile?'24px 18px 16px':'56px 40px 24px'}}>
      <SecHead center eyebrow={isAr?'الأسعار':'Tarifs'} title={isAr?'عروض بسيطة تناسب السوق المحلي':'Des plans simples, adaptés au marché local'}
        desc={isAr?'ابدأ مجاناً. انتقل إلى عرض مدفوع عندما تكبر أفواجك. الأسعار بالدينار الجزائري — بعض المبالغ لا تزال قابلة للمراجعة.':"Commencez gratuitement. Passez à un plan payant quand vos groupes grandissent. Tarifs en DZD — certains montants sont encore à valider."}/>
      <div className="row center" style={{marginTop:18}}>
        <span className="chip chip-orange"><Icon name="flag" size={13}/>{isAr?'أسعار إرشادية · للتأكيد':'Tarifs indicatifs · à valider'}</span>
      </div>
    </div>
    <div style={{maxWidth:1200,margin:'0 auto',padding:isMobile?'8px 18px 24px':'8px 40px 24px',display:'grid',gridTemplateColumns:isMobile?'1fr':'repeat(4,1fr)',gap:isMobile?14:18,alignItems:'stretch'}}>
      {NAV.plans.map(p=>{
        const pa = isAr ? plansAr[p.id] : null;
        const [bg,fg]=accent[p.accent];
        return <div key={p.id} className="card" style={{padding:'24px 22px',borderRadius:18,position:'relative',
          display:'flex',flexDirection:'column',gap:16,
          border:p.popular?'1.5px solid var(--blue-600)':'1px solid var(--line)',
          boxShadow:p.popular?'var(--sh-3)':'var(--sh-2)'}}>
          {p.popular && <span className="badge badge-new" style={{position:'absolute',top:-11,left:22,background:'var(--blue-700)',color:'#fff'}}>{pa?.tag||p.tag}</span>}
          <div className="col gap-4">
            <span className="chip" style={{background:bg,color:fg,alignSelf:'flex-start'}}>{p.popular?(isAr?'مُقترح':"Recommandé"):(pa?.tag||p.tag)}</span>
            {p.id==='center' && <FutureTag icon="grid" style={{alignSelf:'flex-start',marginTop:4}}>{isAr?'وظيفة مستقبلية':'Fonctionnalité future'}</FutureTag>}
            <h3 style={{fontSize:20,marginTop:8}}>{pa?.name||p.name}</h3>
            <p className="muted t-13 lh-14" style={{minHeight:38}}>{pa?.desc||p.desc}</p>
          </div>
          <div className="row" style={{alignItems:'baseline',gap:6}}>
            <span className="stat-num" style={{fontSize:32}}>{p.price}</span>
            <span className="faint t-13 w-600">{pa?.unit||p.unit}</span>
          </div>
          <Btn variant={p.popular?'primary':'ghost'} block onClick={()=>go(p.id==='center'?'roadmap':'tutor-onboarding')}>{pa?.cta||p.cta}</Btn>
          <div className="hr"></div>
          <div className="col gap-10">
            {(pa?.feats||p.feats).map((f,i)=><div key={i} className="row gap-9" style={{alignItems:'flex-start'}}>
              <Icon name="check" size={16} style={{color:fg,flex:'none',marginTop:2}}/>
              <span className="t-13 lh-14" style={{color:'var(--ink-2)'}}>{f}</span>
            </div>)}
          </div>
        </div>;
      })}
    </div>
    <div style={{maxWidth:1200,margin:'0 auto',padding:'18px 40px 64px'}}>
      <div className="card pad-24 row between wrap" style={{gap:18}}>
        <div className="row gap-14">
          <div className="icn" style={{width:44,height:44,borderRadius:13,background:'var(--green-50)',color:'var(--green-700)',display:'grid',placeItems:'center'}}><Icon name="wa" size={22}/></div>
          <div className="col" style={{gap:2}}><span className="w-700 t-16">{isAr?'مشاركة WhatsApp مدمجة في كل العروض':'Le partage WhatsApp est inclus dans tous les plans'}</span>
          <span className="muted t-14">{isAr?'Navanso لا يعوّض WhatsApp — بل ينظّم المتابعة ويشارك التقارير الموثّقة عبر قنواتك المعتادة.':'Navanso ne remplace pas WhatsApp — il organise le suivi et partage des rapports validés via vos canaux habituels.'}</span></div>
        </div>
        <Btn variant="soft" iconR="arrow" onClick={()=>go('parent-report')}>{isAr?'عرض مثال تقرير':'Voir un exemple de rapport'}</Btn>
      </div>
    </div>
    <Footer go={go}/>
  </div>;
}

function Roadmap({go}){
  useLang();
  const isAr = NavI18n.lang === 'ar';
  const isMobile = useIsNarrow();
  const accent={green:['var(--green-50)','var(--green-700)','var(--green-500)'],
    blue:['var(--blue-50)','var(--blue-700)','var(--blue-500)'],
    orange:['var(--orange-50)','var(--orange-600)','var(--orange-500)']};
  const roadmapAr = [
    {phase:'قريباً', when:'الخطوة القادمة', items:[
      {t:'حسابات الأولياء', d:'فضاء للوالد لمتابعة كل أطفاله في مكان واحد.'},
      {t:'ملفات أساتذة موثّقة', d:'توثيق الهوية من طرف Navanso لتعزيز الثقة.'},
      {t:'نظام آراء الأولياء', d:'آراء وشهادات منظّمة بعد المتابعة.'},
    ]},
    {phase:'قيد الاستكشاف', when:'رؤية المنتج', items:[
      {t:'الحجز عبر الإنترنت', d:'حجز مكان في الفوج مباشرة من ملف الأستاذ.'},
      {t:'لوحة تحكم للمركز', d:'إدارة الأساتذة والأفواج والحضور للمراكز.'},
      {t:'إحصاءات متقدمة', d:'تحليل أدق للتقدم ونقاط الضعف حسب الفوج.'},
    ]},
    {phase:'لاحقاً', when:'على المدى الطويل', items:[
      {t:'الدفع عبر الإنترنت', d:'دفع الدروس داخل المنصة بما يناسب السوق المحلي.'},
      {t:'تطبيق هاتف', d:'تطبيق أصلي للأساتذة والأولياء.'},
      {t:'سوق كامل', d:'اكتشاف وربط على نطاق أوسع.'},
    ]},
  ];
  return <div className="screen-anim" style={{minHeight:'100%'}}>
    <MarketingNav go={go} active="roadmap"/>
    <div style={{maxWidth:1100,margin:'0 auto',padding:'56px 40px 24px'}}>
      <SecHead center eyebrow={isAr?'وظائف مستقبلية':'Fonctionnalités futures'}
        title={isAr?'المنتج يكبر، لكن القلب يبقى واضحاً':'Le produit grandit, mais le cœur reste focalisé'}
        desc={isAr?'حالياً يركّز Navanso على حلقة الأستاذ والوالد: الظهور، إدارة الأفواج الصغيرة، وتقارير المتابعة. هذه هي الخطوات القادمة.':'Aujourd’hui, Navanso se concentre sur la boucle enseignant–parent : visibilité, gestion des petits groupes et rapports de suivi. Voici la suite.'}/>
    </div>
    <div style={{maxWidth:1100,margin:'0 auto',padding:isMobile?'12px 18px 24px':'16px 40px 24px',display:'grid',gridTemplateColumns:isMobile?'1fr':'repeat(3,1fr)',gap:isMobile?14:18}}>
      {NAV.roadmap.map((col,ci)=>{
        const ca = isAr ? roadmapAr[ci] : null;
        const [bg,fg,dot]=accent[col.accent];
        return <div key={ci} className="col gap-14">
          <div className="row between">
            <span className="chip" style={{background:bg,color:fg,fontWeight:700}}><span style={{width:7,height:7,borderRadius:99,background:dot}}></span>{ca?.phase||col.phase}</span>
            <span className="faint t-12 w-600">{ca?.when||col.when}</span>
          </div>
          {(ca?.items||col.items).map((it,i)=>
            <div key={i} className="card pad-20 col gap-7">
              <div className="row gap-10">
                <div style={{width:8,height:8,borderRadius:99,background:dot,flex:'none'}}></div>
                <h3 style={{fontSize:16}}>{it.t}</h3>
              </div>
              <p className="muted t-14 lh-14" style={{paddingLeft:18}}>{it.d}</p>
            </div>)}
        </div>;
      })}
    </div>
    <div style={{maxWidth:1100,margin:'0 auto',padding:'24px 40px 64px'}}>
      <div className="card pad-24 row between wrap" style={{gap:18,background:'var(--blue-50)',border:'1px solid var(--blue-100)'}}>
        <div className="row gap-14">
          <div className="icn" style={{width:44,height:44,borderRadius:13,background:'#fff',color:'var(--blue-700)',display:'grid',placeItems:'center',boxShadow:'var(--sh-1)'}}><Icon name="target" size={22}/></div>
          <div className="col" style={{gap:2}}><span className="w-700 t-16">{isAr?'يبقى MVP مركّزاً على المتابعة':'Le MVP reste centré sur le suivi'}</span>
          <span className="muted t-14" style={{maxWidth:560}}>{isAr?'هذه الوظائف رؤية مستقبلية، وليست منتج اليوم. نضيف أولاً ما يعزّز الثقة ومتابعة الأفواج الصغيرة.':'Ces fonctionnalités sont une vision, pas le produit d’aujourd’hui. Nous ajoutons d’abord ce qui renforce la confiance et le suivi des petits groupes.'}</span></div>
        </div>
        <Btn variant="primary" iconR="arrow" onClick={()=>go('dashboard')}>{isAr?'تجربة فضاء الأستاذ':'Essayer l’espace enseignant'}</Btn>
      </div>
    </div>
    <Footer go={go}/>
  </div>;
}

Object.assign(window,{Pricing,Roadmap});
