import { useState } from 'react';
import { useStore } from '../store/Store';
import { Link } from '../store/router';
import { STORES, PRICES } from '../data/mock';
import { TopBar, Img, Empty, Checkout } from '../components/UI';
import { IStar } from '../components/Icons';
import { ne, rs } from '../utils';

// 동네가게 상세 + 쿠폰
export function StorePage({ id }) {
  const { state, dispatch, showToast } = useStore();
  const s = id === 'mine'
    ? (state.business.active ? { id: 'mine', name: state.business.shopName, category: state.business.category, region: state.me.region, distance: 'नजिकै', rating: 5, reviews: 0, image: STORES[0].image, desc: 'मेरो पसल (व्यापारिक खाता)', coupon: state.myAds[0]?.headline } : null)
    : STORES.find((x) => x.id === id);
  if (!s) return <div className="page"><TopBar back /><Empty icon="🏪" title="पसल भेटिएन" /></div>;
  const claimed = state.coupons.includes(s.id);
  const code = `CB-${s.id.toUpperCase()}-${(state.auth.phone || '0000').slice(-4)}`;
  return (
    <div className="page"><TopBar back title={s.name} />
      <div className="store-hero"><Img src={s.image} alt={s.name} seed={s.id} /></div>
      <div className="pad">
        <h2 className="detail-title">{s.name}</h2>
        <p className="meta">{s.category} · {s.region} · {s.distance}</p>
        <p className="rating mt"><IStar size={14} /> {ne(s.rating)} <span className="meta">समीक्षा {ne(s.reviews)}</span></p>
        <p className="detail-desc">{s.desc}</p>
        {s.coupon && (
          <div className="coupon-box">
            <p><strong>🎟️ {s.coupon}</strong></p>
            {claimed ? <p className="coupon-code">कुपन कोड: <strong>{code}</strong><br /><span className="meta">पसलमा यो कोड देखाउनुहोस्।</span></p>
              : <button className="btn mt" onClick={() => { dispatch({ type: 'CLAIM_COUPON', id: s.id }); showToast('कुपन सुरक्षित भयो'); }}>कुपन लिनुहोस्</button>}
          </div>
        )}
      </div>
    </div>
  );
}

// 사업자 센터: 사업자 계정 + 동네 광고 집행
export function BusinessCenter() {
  const { state, dispatch, showToast, pay, uid } = useStore();
  const [shop, setShop] = useState(state.business.shopName || '');
  const [category, setCategory] = useState(state.business.category || 'क्याफे');
  const [headline, setHeadline] = useState('');
  const [radius, setRadius] = useState(2);
  const [checkout, setCheckout] = useState(null);
  const b = state.business;

  if (!state.auth.loggedIn) return <div className="page"><TopBar back title="व्यापार केन्द्र" /><Empty icon="🏪" title="पहिले लगइन गर्नुहोस्" action={<Link to="/login?next=/business" className="btn mt">लगइन</Link>} /></div>;

  const onPaid = (method, ref) => {
    pay(checkout.kind, checkout.amount, method, ref);
    if (checkout.kind === 'business') {
      dispatch({ type: 'BUSINESS', patch: { active: true, shopName: shop.trim(), category, since: Date.now() } });
      dispatch({ type: 'ME', patch: { business: true } });
      showToast('व्यापारिक खाता सक्रिय भयो ✓');
    } else {
      dispatch({ type: 'ADD_AD', ad: { id: uid('ad'), headline: headline.trim(), radius, active: true, createdAt: Date.now(), budget: PRICES.adMonthly } });
      setHeadline('');
      showToast('विज्ञापन सुरु भयो — छिमेकीको फिडमा देखिनेछ');
    }
    setCheckout(null);
  };
  // 데모용 노출·클릭 수 (실서비스: 서버 집계)
  const stats = (ad) => { const m = Math.max(1, Math.floor((Date.now() - ad.createdAt) / 60000)); return { views: 120 + m * 7, clicks: 6 + Math.floor(m / 3) }; };

  return (
    <div className="page"><TopBar back title="व्यापार केन्द्र" />
      {!b.active ? (
        <div className="pad form">
          <p className="lead">छिमेकका ग्राहकसम्म सिधै पुग्नुहोस्</p>
          <ul className="bullets">
            <li>तपाईंको पसलका नजिकका १–३ कि.मि. भित्रका छिमेकीको फिडमा विज्ञापन</li>
            <li>कुपन दिएर नयाँ ग्राहक ल्याउनुहोस्</li>
            <li>सामानमा "व्यापारी" चिन्ह — ग्राहकले पारदर्शी रूपमा चिन्छन्</li>
          </ul>
          <label className="field"><span>पसलको नाम</span><input className="input" value={shop} onChange={(e) => setShop(e.target.value)} placeholder="जस्तै: दाइको मोमो पसल" /></label>
          <label className="field"><span>प्रकार</span>
            <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
              {['क्याफे', 'रेस्टुरेन्ट', 'किराना', 'मोबाइल पसल', 'कपडा पसल', 'सैलुन', 'ट्युसन/शिक्षा', 'मर्मत सेवा', 'अन्य'].map((c) => <option key={c}>{c}</option>)}
            </select></label>
          <button className="btn block" disabled={shop.trim().length < 2} onClick={() => setCheckout({ kind: 'business', title: 'व्यापारिक खाता (१ महिना)', amount: PRICES.business })}>
            व्यापारिक खाता खोल्नुहोस् ({rs(PRICES.business)}/महिना)</button>
          <p className="meta">व्यापारिक खाता बिना धेरै सामान बेच्ने खातालाई "व्यापारी जस्तो" भनी रिपोर्ट गर्न सकिन्छ।</p>
        </div>
      ) : (
        <>
          <div className="pad">
            <p className="lead">{b.shopName}</p>
            <p className="meta">{b.category} · {state.me.region} · व्यापारिक खाता सक्रिय</p>
            <Link to="/stores/mine" className="btn ghost mt">मेरो पसलको पेज हेर्नुहोस्</Link>
          </div>
          <section className="pad section form">
            <h3 className="section-title">नयाँ टोल विज्ञापन</h3>
            <label className="field"><span>विज्ञापनको सन्देश</span><input className="input" maxLength={60} value={headline} onChange={(e) => setHeadline(e.target.value)} placeholder="जस्तै: आज मात्र — चिया र सेलरोटी सेट रू १००" /></label>
            <div className="field"><span>कति टाढासम्म देखाउने</span>
              <div className="seg">{[1, 2, 3].map((r) => <button key={r} className={radius === r ? 'is-on' : ''} onClick={() => setRadius(r)}>{ne(r)} कि.मि.</button>)}</div></div>
            <button className="btn block" disabled={headline.trim().length < 5} onClick={() => setCheckout({ kind: 'ad', title: `टोल विज्ञापन (${ne(radius)} कि.मि., १ महिना)`, amount: PRICES.adMonthly })}>
              विज्ञापन सुरु गर्नुहोस् ({rs(PRICES.adMonthly)}/महिना)</button>
          </section>
          <section className="pad section">
            <h3 className="section-title">मेरा विज्ञापन</h3>
            {state.myAds.length === 0 ? <p className="meta">अहिलेसम्म विज्ञापन छैन।</p> : state.myAds.map((ad) => { const st = stats(ad); return (
              <div key={ad.id} className="ad-row">
                <div><strong>{ad.headline}</strong><p className="meta">{ne(ad.radius)} कि.मि. · देखिएको {ne(st.views)} · क्लिक {ne(st.clicks)}</p></div>
                <button className="btn sm ghost" onClick={() => dispatch({ type: 'UPDATE_AD', id: ad.id, patch: { active: !ad.active } })}>{ad.active ? 'रोक्नुहोस्' : 'सुरु गर्नुहोस्'}</button>
              </div>); })}
          </section>
        </>
      )}
      <Checkout open={!!checkout} onClose={() => setCheckout(null)} title={checkout?.title} amount={checkout?.amount} onPaid={onPaid} />
    </div>
  );
}
