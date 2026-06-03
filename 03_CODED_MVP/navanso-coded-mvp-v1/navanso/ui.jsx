/* NAVANSO — UI primitives */

function LogoMark({size=34}){
  return <div className="mark" style={{width:size,height:size,boxShadow:'inset 0 0 0 1px var(--line-2)'}}>
    <img src="assets/navanso-mark.png" alt="Navanso" style={{width:'86%',height:'86%',objectFit:'contain'}}/>
  </div>;
}
function Logo({size=34, sub=false, name=true}){
  useLang();
  const isAr = NavI18n.lang === 'ar';
  return <div className="logo">
    <LogoMark size={size}/>
    {name && <div className="col" style={{gap:1}}>
      <span className="logo-name" style={{fontSize:size*0.6}}>Navanso</span>
      {sub && <span className="logo-sub">{isAr?'نتقدّم معاً.':'Nous progressons, ensemble.'}</span>}
    </div>}
  </div>;
}

function Avatar({initials, cls='av-b', size=40, ring=false}){
  return <div className={`av ${cls} ${ring?'av-ring':''}`} style={{width:size,height:size,fontSize:size*0.4}}>{initials}</div>;
}

function Chip({children, tone='gray', icon}){
  return <span className={`chip chip-${tone}`}>{icon && <Icon name={icon} size={13}/>}{children}</span>;
}

function Places({places, cap}){
  if(typeof useLang === 'function') useLang();
  const isAr = (typeof NavI18n !== 'undefined') && NavI18n.lang === 'ar';
  const tone = places===0?'full':places<=2?'low':'open';
  const label = places===0 ? (isAr?'كامل':'Complet') : (isAr?`${places} مكان متوفّر`:`${places} place${places>1?'s':''} disponible${places>1?'s':''}`);
  return <span className={`places places-${tone}`}><span className="dot"></span>{label}</span>;
}

function SeatRow({cap, students}){
  return <div className="seatrow">
    {Array.from({length:cap}).map((_,i)=>
      <span key={i} className={`seat ${i<students?'filled':'open'}`}></span>)}
  </div>;
}

function Bar({pct, tone=''}){
  return <div className={`bar ${tone}`}><i style={{width:pct+'%'}}></i></div>;
}

function Kpi({icon, label, value, tone='blue', sub}){
  const bg={blue:'var(--blue-50)',green:'var(--green-50)',orange:'var(--orange-50)'}[tone];
  const fg={blue:'var(--blue-700)',green:'var(--green-700)',orange:'var(--orange-600)'}[tone];
  return <div className="kpi">
    <div className="row between">
      <div className="icn" style={{background:bg,color:fg}}><Icon name={icon} size={20}/></div>
      {sub && <span className="t-12 w-600" style={{color:fg}}>{sub}</span>}
    </div>
    <div>
      <div className="stat-num" style={{fontSize:30}}>{value}</div>
      <div className="t-13 muted w-600" style={{marginTop:2}}>{label}</div>
    </div>
  </div>;
}

function Field({label, children, hint}){
  return <label className="field">
    {label && <span className="label">{label}</span>}
    {children}
    {hint && <span className="t-12 faint">{hint}</span>}
  </label>;
}

function Btn({children, variant='primary', size, icon, iconR, block, onClick, style}){
  const cls=`btn btn-${variant} ${size?'btn-'+size:''} ${block?'btn-block':''}`;
  return <button className={cls} style={style} onClick={onClick}>
    {icon && <Icon name={icon} size={size==='sm'?16:18}/>}
    {children}
    {iconR && <Icon name={iconR} size={size==='sm'?16:18}/>}
  </button>;
}

function Stars({rating, reviews, size=14}){
  if(typeof useLang === 'function') useLang();
  const isAr = (typeof NavI18n !== 'undefined') && NavI18n.lang === 'ar';
  return <span className="row gap-6">
    <span className="row gap-2" style={{color:'var(--orange-500)'}}>
      <Icon name="star" size={size} strokeWidth={1.6} style={{fill:'var(--orange-500)'}}/>
    </span>
    <span className="w-700 t-14">{rating}</span>
    {reviews!=null && <span className="faint t-13">({reviews} {isAr?'تقييم':'avis'})</span>}
  </span>;
}

function Ph({label, h=160, style}){
  return <div className="ph" style={{height:h, ...style}}>{label}</div>;
}

/* validated-report seal */
function ValidSeal({small}){
  if(typeof useLang === 'function') useLang();
  const isAr = (typeof NavI18n !== 'undefined') && NavI18n.lang === 'ar';
  return <span className="badge badge-verified" style={small?{}:{padding:'7px 12px',fontSize:13}}>
    <Icon name="checkc" size={small?14:16}/> {isAr?'تقرير موثّق من طرف الأستاذ':'Rapport validé par l’enseignant'}
  </span>;
}

/* phone frame */
function Phone({children, time='9:41'}){
  return <div className="phone">
    <div className="phone-screen">
      <div className="phone-notch"></div>
      <div className="phone-status">
        <span>{time}</span>
        <span className="row gap-6" style={{fontSize:12}}>
          <Icon name="chart" size={14}/><Icon name="phone" size={13}/><span>100%</span>
        </span>
      </div>
      <div className="phone-body scroll">{children}</div>
    </div>
  </div>;
}

/* toast — vanilla so any screen can fire confirmations without context plumbing */
function navToast(msg, tone='green'){
  let host=document.getElementById('nav-toasts');
  if(!host){host=document.createElement('div');host.id='nav-toasts';document.body.appendChild(host);}
  const el=document.createElement('div');
  el.className='nav-toast nav-toast-'+tone;
  el.innerHTML='<span class="nt-dot"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5 10 17l9-10"/></svg></span><span>'+msg+'</span>';
  host.appendChild(el);
  setTimeout(()=>{el.classList.add('out');setTimeout(()=>el.remove(),260);},2600);
}

/* report-flow step indicator */
function Stepper({steps, current}){
  return <div className="row gap-6 wrap" style={{alignItems:'center'}}>
    {steps.map((s,i)=>{
      const state = i<current?'done':i===current?'now':'todo';
      const bg = state==='done'?'var(--green-600)':state==='now'?'var(--blue-700)':'var(--bg-2)';
      const fg = state==='todo'?'var(--faint)':'#fff';
      const tc = state==='todo'?'var(--faint)':state==='done'?'var(--green-700)':'var(--blue-700)';
      return <React.Fragment key={i}>
        <div className="row gap-8" style={{alignItems:'center'}}>
          <span style={{width:24,height:24,borderRadius:99,background:bg,color:fg,display:'grid',placeItems:'center',
            fontFamily:'var(--font-d)',fontWeight:700,fontSize:12,flex:'none'}}>{state==='done'?<Icon name="check" size={14}/>:i+1}</span>
          <span className="t-13 w-700" style={{color:tc,whiteSpace:'nowrap'}}>{s}</span>
        </div>
        {i<steps.length-1 && <span style={{width:22,height:2,borderRadius:2,background:i<current?'var(--green-500)':'var(--line)',flex:'none'}}></span>}
      </React.Fragment>;
    })}
  </div>;
}

/* ===== PROTOTYPE SCOPE LABELS ===== */
/* "Fonctionnalité future" — marks marketplace-like elements not in the MVP */
function FutureTag({children='Fonctionnalité future', icon='clock', style}){
  if(typeof useLang === 'function') useLang();
  const isAr = (typeof NavI18n !== 'undefined') && NavI18n.lang === 'ar';
  const label = children === 'Fonctionnalité future' && isAr ? 'وظيفة مستقبلية' : children;
  return <span className="scope scope-future" style={style}><Icon name={icon} size={12}/>{label}</span>;
}
/* "Données démo" — marks illustrative ratings / testimonials */
function DemoTag({children, style}){
  if(typeof useLang === 'function') useLang();
  const isAr = (typeof NavI18n !== 'undefined') && NavI18n.lang === 'ar';
  const label = children !== undefined ? children : (isAr?'بيانات تجريبيّة':'Données démo');
  return <span className="scope scope-demo" style={style}><span className="dot"></span>{label}</span>;
}
/* privacy reassurance strip */
function PrivacyNote({children, style}){
  if(typeof useLang === 'function') useLang();
  const isAr = (typeof NavI18n !== 'undefined') && NavI18n.lang === 'ar';
  const label = children !== undefined ? children : (isAr?'بيانات التّلميذ خاصّة — مرئيّة فقط للأستاذ والوالد المُرخَّص له.':'Données élève privées — visibles uniquement par l’enseignant et le parent autorisé.');
  return <div className="privacy" style={style}><Icon name="lock" size={15}/><span>{label}</span></div>;
}
/* time-saving microcopy */
function TimeSave({children, icon='clock', style}){
  return <div className="timesave" style={style}><Icon name={icon} size={15}/><span>{children}</span></div>;
}

/* simple section header with eyebrow */
function SecHead({eyebrow, title, desc, center, style}){
  return <div className="col gap-10" style={{maxWidth:680, ...(center?{textAlign:'center',margin:'0 auto'}:{}) , ...style}}>
    {eyebrow && <span className="eyebrow">{eyebrow}</span>}
    <h2 style={{fontSize:30, lineHeight:1.15}}>{title}</h2>
    {desc && <p className="muted t-16 lh-15">{desc}</p>}
  </div>;
}

Object.assign(window,{LogoMark,Logo,Avatar,Chip,Places,SeatRow,Bar,Kpi,Field,Btn,Stars,Ph,ValidSeal,Phone,SecHead,navToast,Stepper,FutureTag,DemoTag,PrivacyNote,TimeSave});
