import { t } from '../i18n';
import { useStore } from '../store/Store';
import { Link } from '../store/router';
import { TopBar } from '../components/UI';
import { REGION_INFO } from '../data/mock';
import { ago, ne, rs } from '../utils';

const DAY = 86400000;
const SLA = 2 * 3600000; // 신고 1차 조치 목표: 2시간 (사업기획서 8장)

// 운영 대시보드 (데모): 사업기획서의 KPI와 신고 처리 대기열
export default function Admin() {
  const { state, dispatch, showToast } = useStore();
  const now = Date.now();
  const weekly = state.products.filter((p) => now - p.createdAt < 7 * DAY).length;
  const active = state.products.filter((p) => p.status !== 'sold');
  const withChat = active.filter((p) => p.chatCount > 0).length;
  const chatRate = active.length ? Math.round((withChat / active.length) * 100) : 0;
  const open = state.reports.filter((r) => r.status === 'open');
  const revenue = state.payments.reduce((n, p) => n + p.amount, 0);
  const byKind = state.payments.reduce((m, p) => ({ ...m, [p.item]: (m[p.item] || 0) + p.amount }), {});
  const KIND = { bump: t('माथि ल्याउने'), highlight: t('विशेष पोस्ट'), premium: t('प्रिमियम'), business: t('व्यापारिक खाता'), ad: t('टोल विज्ञापन') };

  const cards = [
    { label: t('यो हप्ताका नयाँ पोस्ट'), value: ne(weekly), goal: t('लक्ष्य: टोलमा १,०००/हप्ता') },
    { label: t('च्याट आएका सक्रिय पोस्ट'), value: `${ne(chatRate)}%`, goal: t('लक्ष्य: ६०%') },
    { label: t('खुला रिपोर्ट'), value: ne(open.length), goal: t('लक्ष्य: २ घण्टाभित्र कारबाही') },
    { label: t('कुल आम्दानी (डेमो)'), value: rs(revenue), goal: t('विज्ञापन + प्रिमियम + माथि ल्याउने') },
  ];

  const target = (r) => (r.kind === 'product' ? state.products.find((p) => p.id === r.targetId)?.title : state.users[r.targetId]?.nickname || r.targetId);

  return (
    <div className="page"><TopBar back title={t('सञ्चालन ड्यासबोर्ड (डेमो)')} />
      <p className="pad-x meta mt">{t('यो पेज सञ्चालन टोलका लागि हो। वास्तविक सेवामा प्रशासक अनुमतिसहित अलग प्रणालीमा राख्नुहोस्।')}</p>
      <div className="kpi-grid">{cards.map((c) => (
        <div key={c.label} className="kpi"><span className="meta">{t(c.label)}</span><strong>{c.value}</strong><small>{c.goal}</small></div>))}</div>

      <section className="pad section">
        <h3 className="section-title">{t('रिपोर्ट र गुनासो (')}{ne(open.length)} {t('खुला)')}</h3>
        {state.reports.length === 0 ? <p className="meta">{t('कुनै रिपोर्ट छैन।')}</p> : (
          <ul className="report-list">{state.reports.map((r) => {
            const late = r.status === 'open' && now - r.at > SLA;
            return (
              <li key={r.id} className={r.status !== 'open' ? 'is-done' : ''}>
                <div>
                  <p><strong>{r.kind === 'product' ? t('पोस्ट') : r.kind === 'grievance' ? t('गुनासो') : t('प्रयोगकर्ता')}</strong> · {t(r.reason)}</p>
                  <p className="meta">{r.kind === 'product' ? <Link to={`/products/${r.targetId}`} className="underline">{target(r)}</Link> : r.kind === 'grievance' ? r.text : target(r)} · {ago(r.at)} {late && <span className="late">{t('समय नाघ्यो')}</span>}</p>
                </div>
                {r.status === 'open' ? (
                  <div className="row">
                    {r.kind === 'product' && <button className="btn sm" onClick={() => { dispatch({ type: 'DELETE_PRODUCT', id: r.targetId }); dispatch({ type: 'RESOLVE_REPORT', id: r.id, status: 'removed' }); showToast(t('पोस्ट हटाइयो')); }}>{t('हटाउनुहोस्')}</button>}
                    <button className="btn sm ghost" onClick={() => { if (r.kind === 'product') dispatch({ type: 'UNHIDE', id: r.targetId }); dispatch({ type: 'RESOLVE_REPORT', id: r.id, status: 'dismissed' }); showToast(t('समाधान गरियो')); }}>{r.kind === 'grievance' ? t('समाधान भयो') : t('ठीक छ')}</button>
                  </div>
                ) : <span className="meta">{r.status === 'removed' ? t('हटाइयो') : t('समाधान')}</span>}
              </li>);
          })}</ul>)}
      </section>

      <section className="pad section">
        <h3 className="section-title">{t('आम्दानी विवरण')}</h3>
        {Object.keys(byKind).length === 0 ? <p className="meta">{t('अहिलेसम्म भुक्तानी छैन।')}</p> :
          <table className="mini-table"><tbody>{Object.entries(byKind).map(([k, v]) => <tr key={k}><td>{KIND[k] || k}</td><td>{rs(v)}</td></tr>)}</tbody></table>}
      </section>

      <section className="pad section">
        <h3 className="section-title">{t('टोल विस्तार (प्रतीक्षा सूची)')}</h3>
        <table className="mini-table"><tbody>{Object.entries(REGION_INFO).map(([r, info]) => (
          <tr key={r}><td>{t(r)}</td><td>{info.open ? t('सेवा सुरु') : t('छिट्टै')}</td><td>{state.waitlist.includes(r) ? t('प्रतीक्षा सूचीमा +१') : ''}</td></tr>))}</tbody></table>
      </section>
    </div>
  );
}
