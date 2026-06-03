/* NAVANSO — Paiements : per-student per-month tracking.
   DZ cash culture: most payments are mensuel cash + occasional bank transfer.
   Goal: tutor sees in one glance who paid, who's en attente, who's en retard. */

function fmtMonthFr(month){
  if(!month) return '';
  const [y,m] = month.split('-');
  const isAr = typeof NavI18n !== 'undefined' && NavI18n.lang === 'ar';
  const names = isAr
    ? ['','جانفي','فيفري','مارس','أفريل','ماي','جوان','جويلية','أوت','سبتمبر','أكتوبر','نوفمبر','ديسمبر']
    : ['','janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
  return `${names[+m]||m} ${y}`;
}
function fmtMoney(n){ if(n==null||isNaN(n)) return '—'; const isAr = typeof NavI18n !== 'undefined' && NavI18n.lang === 'ar'; return n.toLocaleString('fr-FR').replace(/ /g,' ')+(isAr?' دج':' DZD'); }
function digits(s){ return (s||'').replace(/[^0-9]/g,''); }

function PaymentChip({status}){
  const isAr = typeof NavI18n !== 'undefined' && NavI18n.lang === 'ar';
  if(status==='paid')    return <span className="chip chip-green w-700" style={{fontSize:11}}><Icon name="checkc" size={11}/>{isAr?'مدفوع':'Payé'}</span>;
  if(status==='overdue') return <span className="chip chip-weak w-700" style={{fontSize:11,background:'rgba(216,99,46,.15)',color:'var(--alert)'}}>⚠ {isAr?'متأخّر':'En retard'}</span>;
  if(status==='missing') return <span className="chip chip-gray" style={{fontSize:11}}>—</span>;
  return <span className="chip chip-orange w-700" style={{fontSize:11}}>{isAr?'في الانتظار':'En attente'}</span>;
}

function Payments({go}){
  useStore();
  useLang();
  const isAr = NavI18n.lang === 'ar';
  const isMobile = useIsMobile();
  const allMonths = [...new Set(Nav.paymentsAll().map(p=>p.month))].sort().reverse();
  const groups = Nav.groupsAll();
  const [month, setMonth] = React.useState(Nav.currentMonth());
  const [groupId, setGroupId] = React.useState('all');
  const [statusFilter, setStatusFilter] = React.useState('all'); // all | paid | pending | overdue

  const allStudents = Nav.studentsAll();
  // Build a row per (student, month) — synthesize a 'missing' row if no payment recorded.
  let rows = allStudents.map(s=>{
    const existing = Nav.paymentsAll().find(p=>p.studentId===s.id && p.month===month);
    const g = Nav.groupById(s.groupId);
    return {
      student: s, group: g, parent: Nav.parentById(s.parentId),
      payment: existing || {id:null, studentId:s.id, groupId:s.groupId, month, amount:g?.monthlyFee||1500, status:'missing', method:null, paidAt:null},
    };
  });
  if(groupId!=='all') rows = rows.filter(r=>r.student.groupId===groupId);
  if(statusFilter!=='all') rows = rows.filter(r=>r.payment.status===statusFilter);

  const counts = {
    paid:    rows.filter(r=>r.payment.status==='paid').length,
    pending: rows.filter(r=>r.payment.status==='pending').length,
    overdue: rows.filter(r=>r.payment.status==='overdue').length,
    missing: rows.filter(r=>r.payment.status==='missing').length,
  };
  const expected = rows.reduce((n,r)=>n + (r.payment.amount||0), 0);
  const collected = rows.filter(r=>r.payment.status==='paid').reduce((n,r)=>n+(r.payment.amount||0),0);

  const ensurePayment = (r)=>{
    // If the row is 'missing', create a pending payment record first so we have an id.
    if(r.payment.id) return r.payment;
    Nav.recordPayment({studentId:r.student.id, month, amount:r.payment.amount, method:'cash'});
    // recordPayment marks as paid — to get a pending record, set it back:
    const id = `pay-${r.student.id}-${month}`;
    Nav.markPaymentPending(id);
    return {...r.payment, id};
  };
  const togglePaid = (r)=>{
    if(r.payment.status==='paid'){ Nav.markPaymentPending(r.payment.id); }
    else if(r.payment.id){ Nav.markPaymentPaid(r.payment.id); }
    else { Nav.recordPayment({studentId:r.student.id, month, amount:r.payment.amount, method:'cash'}); }
  };
  const sendReminder = (r)=>{
    if(!r.parent?.phone) return;
    const due = fmtMoney(r.payment.amount);
    const fn = r.student.name.split(' ')[0];
    const msg = isAr
      ? `السّلام عليكم ${txData(r.parent.name)}، تذكير صغير لدفع شهر ${fmtMonthFr(month)} ل${fn} (${due}). شكراً!\n— ${txData(NAV.tutor.short)}`
      : `Bonjour ${r.parent.name}, petit rappel pour le paiement du mois de ${fmtMonthFr(month)} pour ${fn} (${due}). Merci !\n— ${NAV.tutor.short}`;
    window.open(`https://wa.me/${digits(r.parent.phone)}?text=${encodeURIComponent(msg)}`, '_blank');
    navToast(isAr?'فُتح التّذكير على واتساب':'Rappel WhatsApp ouvert','green');
  };

  const markAllPaid = ()=>{
    const targets = rows.filter(r=>r.payment.status!=='paid');
    if(targets.length===0) return;
    if(!confirm(isAr?`تسجيل ${targets.length} تلميذ كمدفوع لشهر ${fmtMonthFr(month)}؟`:`Marquer ${targets.length} élève${targets.length>1?'s':''} comme payé${targets.length>1?'s':''} pour ${fmtMonthFr(month)} ?`)) return;
    targets.forEach(r=>{
      if(r.payment.id) Nav.markPaymentPaid(r.payment.id);
      else Nav.recordPayment({studentId:r.student.id, month, amount:r.payment.amount, method:'cash'});
    });
    navToast(isAr?`تمّ تسجيل ${targets.length} دفعة`:`${targets.length} paiement${targets.length>1?'s':''} enregistré${targets.length>1?'s':''}`,'green');
  };

  return <AppShell go={go} active="payments" title={isAr?'المدفوعات':'Paiements'}
    crumbs={[{t:isAr?'الفضاء':'Espace',go:()=>go('dashboard')},{t:isAr?'المدفوعات':'Paiements'}]}
    actions={<Btn variant="primary" icon="check" onClick={markAllPaid} style={counts.paid===rows.length?{opacity:.5,pointerEvents:'none'}:{}}>{isAr?'تسجيل الكلّ كمدفوع':'Tout marquer payé'}</Btn>}>
    <div className="card pad-16 row gap-10 wrap" style={{marginBottom:18,background:'var(--blue-50)',border:'1px solid var(--blue-100)'}}>
      <Icon name="file" size={18} style={{color:'var(--blue-700)'}}/>
      <span className="t-14 w-600" style={{color:'var(--blue-800)',flex:'1 1 320px'}}>
        {isAr?'متابعة بسيطة للدّفع الشّهريّ. تُفتح التّذكيرات على واتساب بنصّ جاهز. الدّفع نقداً يبقى الخيار الافتراضيّ.':'Suivi simple des paiements mensuels. Les rappels s\'ouvrent via WhatsApp avec un message prérempli. Les paiements en espèces (cash) restent l\'option par défaut.'}
      </span>
    </div>
    <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 300px',gap:20,alignItems:'start'}}>
      <div className="col gap-14">
        {/* filters */}
        <div className="card pad-14 col gap-10">
          <div className="row gap-10 wrap" style={{alignItems:'center'}}>
            <Field label={isAr?'الشّهر':'Mois'}>
              <select className="select" value={month} onChange={e=>setMonth(e.target.value)} style={{minWidth:170}}>
                {allMonths.map(m=><option key={m} value={m}>{fmtMonthFr(m)}</option>)}
              </select>
            </Field>
            <Field label={isAr?'الفوج':'Groupe'}>
              <select className="select" value={groupId} onChange={e=>setGroupId(e.target.value)} style={{minWidth:200}}>
                <option value="all">{isAr?'كلّ الأفواج':'Tous les groupes'}</option>
                {groups.map(g=><option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </Field>
          </div>
          <div className="row gap-7 wrap">
            {[
              ['all',isAr?'الكلّ':'Tous',rows.length],
              ['paid',isAr?'مدفوع':'Payés',counts.paid],
              ['pending',isAr?'في الانتظار':'En attente',counts.pending],
              ['overdue',isAr?'متأخّر':'En retard',counts.overdue],
              ['missing',isAr?'لا شيء':'Aucun',counts.missing]
            ].map(([k,lab,n])=>
              <button key={k} className={`pick ${statusFilter===k?'on':''}`} onClick={()=>setStatusFilter(k)}>{lab} ({n})</button>)}
          </div>
        </div>

        {/* table */}
        {rows.length===0 ? (
          <div className="card pad-24 col center" style={{gap:8,textAlign:'center'}}><span className="muted">{isAr?'لا توجد دفعات لهذا الفلتر.':'Aucun paiement pour ce filtre.'}</span></div>
        ) : <div className="card" style={{overflow:'hidden'}}>
          <table className="tbl">
            <thead><tr>
              <th>{isAr?'التّلميذ':'Élève'}</th><th>{isAr?'الفوج':'Groupe'}</th><th>{isAr?'المبلغ':'Montant'}</th><th>{isAr?'الحالة':'Statut'}</th><th>{isAr?'تاريخ الدّفع':'Date paiement'}</th><th>{isAr?'الطّريقة':'Mode'}</th><th></th>
            </tr></thead>
            <tbody>
              {rows.map(r=>{
                const overdue = r.payment.status==='overdue';
                return <tr key={r.student.id} style={overdue?{background:'var(--orange-50)'}:{}}>
                  <td>
                    <div className="row gap-10" style={{cursor:'pointer'}} onClick={()=>go('student-profile', r.student.id)}>
                      <Avatar initials={r.student.initials} cls={r.student.av} size={30}/>
                      <div className="col" style={{gap:0}}><span className="w-600 t-13">{r.student.name}</span><span className="faint t-11">{isAr?txData(r.parent?.name):r.parent?.name||'—'}</span></div>
                    </div>
                  </td>
                  <td className="muted t-13">{r.group?.name.split('—')[0]?.trim()||'—'}</td>
                  <td className="w-700 t-13 tnum">{fmtMoney(r.payment.amount)}</td>
                  <td><PaymentChip status={r.payment.status}/></td>
                  <td className="muted t-13">{r.payment.paidAt ? fmtFr(r.payment.paidAt) : '—'}</td>
                  <td className="muted t-13">{r.payment.method==='cash'?(isAr?'نقداً':'Espèces'):r.payment.method==='transfer'?(isAr?'تحويل':'Virement'):r.payment.method||'—'}</td>
                  <td>
                    <div className="row gap-6" style={{justifyContent:'flex-end'}}>
                      {r.payment.status!=='paid'
                        ? <Btn variant="green" size="sm" icon="check" onClick={()=>togglePaid(r)}>{isAr?'تسجيل كمدفوع':'Marquer payé'}</Btn>
                        : <Btn variant="ghost" size="sm" icon="arrowl" onClick={()=>togglePaid(r)}>{isAr?'إلغاء':'Annuler'}</Btn>}
                      {(r.payment.status==='overdue'||r.payment.status==='pending') && r.parent?.phone &&
                        <Btn variant="ghost" size="sm" icon="wa" onClick={()=>sendReminder(r)}>{isAr?'تذكير':'Rappel'}</Btn>}
                    </div>
                  </td>
                </tr>;
              })}
            </tbody>
          </table>
        </div>}
      </div>

      {/* side: summary cards */}
      <div className="col gap-14" style={{position:'sticky',top:90}}>
        <div className="card pad-20 col gap-14">
          <span className="eyebrow">{isAr?'ملخّص':'Résumé'} · {fmtMonthFr(month)}</span>
          <div className="col gap-10">
            <div className="row between"><span className="muted t-13">{isAr?'المتوقَّع':'Attendu'}</span><span className="w-700 t-15 tnum">{fmtMoney(expected)}</span></div>
            <div className="row between"><span className="muted t-13">{isAr?'المُحصَّل':'Encaissé'}</span><span className="w-700 t-15 tnum" style={{color:'var(--green-700)'}}>{fmtMoney(collected)}</span></div>
          </div>
          <div className="hr"></div>
          <div className="col gap-8">
            <div className="row between"><span className="muted t-13">{isAr?'مدفوع':'Payés'}</span><span className="w-700 t-15 tnum">{counts.paid}/{rows.length}</span></div>
            <Bar pct={Math.round(counts.paid/(rows.length||1)*100)}/>
          </div>
          {(counts.overdue>0||counts.pending>0) && <div className="col gap-8" style={{paddingTop:4}}>
            {counts.overdue>0 && <div className="row between"><span className="muted t-13">{isAr?'متأخّر':'En retard'}</span><span className="w-700 t-15 tnum" style={{color:'var(--alert)'}}>{counts.overdue}</span></div>}
            {counts.pending>0 && <div className="row between"><span className="muted t-13">{isAr?'في الانتظار':'En attente'}</span><span className="w-700 t-15 tnum" style={{color:'var(--orange-600)'}}>{counts.pending}</span></div>}
          </div>}
        </div>
        <div className="card pad-16 col gap-8" style={{background:'var(--blue-50)',border:'1px solid var(--blue-100)'}}>
          <span className="row gap-8 w-700 t-13" style={{color:'var(--blue-800)'}}><Icon name="shield" size={15}/>{isAr?'الخصوصيّة':'Confidentialité'}</span>
          <span className="t-12 lh-14" style={{color:'var(--blue-900)'}}>{isAr?'المبالغ مرئيّة لك وحدك. لا يرى الوالدون القائمة، فقط دفعاتهم عبر رابط خاصّ (قريباً).':'Les montants ne sont visibles que par vous. Les parents ne voient pas la liste, seulement leurs propres paiements via leur lien privé (à venir).'}</span>
        </div>
      </div>
    </div>
  </AppShell>;
}

window.Payments = Payments;
window.PaymentChip = PaymentChip;
window.fmtMonthFr = fmtMonthFr;
window.fmtMoney = fmtMoney;
