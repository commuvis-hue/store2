import { t } from '../i18n';
import { useState } from 'react';
import { useStore } from '../store/Store';
import { Link, useRouter } from '../store/router';
import { REGIONS, MANNER_TAGS, REGION_INFO } from '../data/mock';
import { CompanyInfo } from './Legal';
import { Avatar, MannerTemp, TopBar, ProductCard, Empty, Sheet, LangToggle } from '../components/UI';
import { IChevron, IReceipt, IBag, IHeart, ITag, IMap, IShield, ISettings, IBell, IStar } from '../components/Icons';
import { ago, STATUS, ne } from '../utils';

export default function My() {
  const { state, user } = useStore();
  const me = user('me');
  const reviews = state.reviews.filter((r) => r.toId === 'me');
  const tiles = [
    { to: '/my/sales', Icon: IReceipt, label: t('बेचेका'), n: state.products.filter((p) => p.sellerId === 'me').length },
    { to: '/my/purchases', Icon: IBag, label: t('किनेका'), n: state.purchases.length },
    { to: '/my/likes', Icon: IHeart, label: t('मनपर्ने'), n: state.likes.length },
  ];
  return (
    <div className="page">
      <header className="topbar"><h1 className="topbar-title left">{t('मेरो पेज')}</h1><div className="topbar-right"><LangToggle compact /><Link to="/my/settings" className="icon-btn" aria-label={t('सेटिङ')}><ISettings /></Link></div></header>
      {!state.auth.loggedIn && (
        <div className="notice">
          <strong>{t('मोबाइल नम्बरबाट लगइन गर्नुहोस्')}</strong>
          <span className="meta">{t('लगइन गरेपछि सामान बेच्न, च्याट गर्न र टोल प्रमाणीकरण गर्न सकिन्छ।')}</span>
          <Link to="/login?next=/my" className="btn sm">{t('लगइन / दर्ता')}</Link>
        </div>
      )}
      <Link to="/users/me" className="profile-card">
        <Avatar user={me} size={60} />
        <div className="profile-name"><strong>{me.nickname}</strong><span className="meta">{t(me.region)} · {state.me.verified ? t('टोल प्रमाणित ✓') : t('टोल प्रमाणीकरण बाँकी')}</span></div>
        <IChevron />
      </Link>
      <div className="pad"><MannerTemp temp={me.temp} /></div>
      <div className="my-tiles">{tiles.map(({ to, Icon, label, n }) => (
        <Link key={to} to={to} className="my-tile"><span className="my-tile-icon"><Icon /></span>{label}<small>{ne(n)}</small></Link>))}</div>
      <ul className="menu-list">
        <li><Link to="/my/region"><IMap />{t('मेरो टोल · टोल प्रमाणीकरण')}</Link></li>
        <li><Link to="/my/keywords"><ITag />{t('किवर्ड सूचना')} <span className="meta">{ne(state.keywords.length)} {t('वटा')}</span></Link></li>
        <li><Link to="/my/reviews"><IStar />{t('प्राप्त समीक्षा')} <span className="meta">{ne(reviews.length)} {t('वटा')}</span></Link></li>
        <li><Link to="/notifications"><IBell />{t('सूचनाहरू')}</Link></li>
        <li><Link to="/my/blocked"><IShield />{t('ब्लक र लुकाइएका पोस्ट')}</Link></li>
        <li><Link to="/my/settings"><ISettings />{t('प्रोफाइल र सेटिङ')}</Link></li>
      </ul>
      <ul className="menu-list">
        <li><Link to="/business">{t('🏪 व्यापार केन्द्र')} <span className="meta">{state.business.active ? t('सक्रिय') : t('पसल विज्ञापन')}</span></Link></li>
        <li><Link to="/help">{t('💬 सहायता र गुनासो')}</Link></li>
        <li><Link to="/legal/rules">{t('📜 समुदायका नियम')}</Link></li>
        <li><Link to="/legal/terms">{t('📄 सेवाका सर्त')}</Link></li>
        <li><Link to="/legal/privacy">{t('🔒 गोपनीयता नीति')}</Link></li>
        <li><Link to="/admin">{t('📊 सञ्चालन ड्यासबोर्ड')} <span className="meta">{t('डेमो')}</span></Link></li>
      </ul>
      <CompanyInfo />
    </div>
  );
}

export function MySales() {
  const { state, dispatch, showToast } = useStore();
  const [tab, setTab] = useState('selling');
  const mine = state.products.filter((p) => p.sellerId === 'me');
  const list = tab === 'hidden' ? mine.filter((p) => state.hidden.includes(p.id))
    : mine.filter((p) => !state.hidden.includes(p.id) && (tab === 'sold' ? p.status === 'sold' : p.status !== 'sold'));
  const emptyTitle = { selling: t('बिक्रीमा कुनै सामान छैन'), sold: t('बिक्री सम्पन्न सामान छैन'), hidden: t('लुकाइएको पोस्ट छैन') }[tab];
  return (
    <div className="page">
      <TopBar back title={t('बेचेका सामान')} />
      <div className="tabs">{[['selling', t('बिक्रीमा')], ['sold', t('बिक्री सम्पन्न')], ['hidden', t('लुकाइएको')]].map(([k, v]) =>
        <button key={k} className={`tab ${tab === k ? 'is-on' : ''}`} onClick={() => setTab(k)}>{v}</button>)}</div>
      {list.length === 0 ? <Empty icon="📦" title={emptyTitle} action={tab === 'selling' && <Link to="/write" className="btn mt">{t('सामान बेच्नुहोस्')}</Link>} /> :
        list.map((p) => (
          <div key={p.id} className="sale-item">
            <ProductCard p={p} />
            <div className="sale-actions">
              {tab === 'hidden' ? <button onClick={() => { dispatch({ type: 'UNHIDE', id: p.id }); showToast(t('पोस्ट फेरि देखिनेछ')); }}>{t('लुकाउन छोड्नुहोस्')}</button> : <>
                {p.status !== 'sold' && <button onClick={() => dispatch({ type: 'UPDATE_PRODUCT', id: p.id, patch: { status: p.status === 'reserved' ? 'selling' : 'reserved' } })}>{p.status === 'reserved' ? t('बिक्रीमा राख्नुहोस्') : t('बुक भएको बनाउनुहोस्')}</button>}
                <button onClick={() => dispatch({ type: 'UPDATE_PRODUCT', id: p.id, patch: { status: p.status === 'sold' ? 'selling' : 'sold' } })}>{p.status === 'sold' ? t('बिक्रीमा राख्नुहोस्') : t('बिक्री सम्पन्न')}</button>
                {p.status !== 'sold' && <button onClick={() => { dispatch({ type: 'UPDATE_PRODUCT', id: p.id, patch: { bumpedAt: Date.now() } }); showToast(t('पोस्ट माथि ल्याइयो')); }}>{t('माथि ल्याउनुहोस्')}</button>}
              </>}
            </div>
          </div>))}
    </div>
  );
}

export function MyPurchases() {
  const { state } = useStore();
  const list = state.products.filter((p) => state.purchases.includes(p.id));
  return <div className="page"><TopBar back title={t('किनेका सामान')} />
    {list.length === 0 ? <Empty icon="🛍️" title={t('अहिलेसम्म केही किन्नुभएको छैन')} desc={t('च्याटमा \'खरिद पक्का\' गरेपछि यहाँ देखिन्छ।')} /> : <div className="plist">{list.map((p) => <ProductCard key={p.id} p={p} />)}</div>}
  </div>;
}

export function MyLikes() {
  const { state } = useStore();
  const list = state.products.filter((p) => state.likes.includes(p.id));
  return <div className="page"><TopBar back title={t('मनपर्ने सामान')} />
    {list.length === 0 ? <Empty icon="🤍" title={t('मनपर्ने सूची खाली छ')} desc={t('मुटुको चिन्ह थिचेर सामान सुरक्षित गर्नुहोस्।')} /> : <div className="plist">{list.map((p) => <ProductCard key={p.id} p={p} />)}</div>}
  </div>;
}

export function Keywords() {
  const { state, dispatch, showToast } = useStore();
  const [k, setK] = useState('');
  const add = (e) => { e.preventDefault(); const kw = k.trim(); if (!kw) return; if (state.keywords.length >= 30) return showToast(t('बढीमा ३० वटा किवर्ड राख्न सकिन्छ')); dispatch({ type: 'ADD_KEYWORD', k: kw }); setK(''); };
  return (
    <div className="page"><TopBar back title={t('किवर्ड सूचना')} />
      <form className="pad row" onSubmit={add}>
        <input className="input" value={k} onChange={(e) => setK(e.target.value)} placeholder={t('जस्तै: स्कुटर, iPhone, साडी')} />
        <button className="btn" disabled={!k.trim()}>{t('थप्नुहोस्')}</button>
      </form>
      <p className="pad-x meta">{t(state.me.region)} {t('नजिक यी शब्द भएको नयाँ पोस्ट आउनेबित्तिकै सूचना पाउनुहुनेछ। (')}{ne(state.keywords.length)}{t('/३०)')}</p>
      <div className="pad tag-wrap">{state.keywords.map((x) => (
        <span key={x} className="tag is-on">{t(x)}<button onClick={() => dispatch({ type: 'DEL_KEYWORD', k: x })} aria-label={t('{x} हटाउनुहोस्', { x })}>✕</button></span>))}</div>
    </div>
  );
}

export function RegionSettings() {
  const { state, dispatch, showToast } = useStore();
  const [checking, setChecking] = useState(false);
  const regions = state.me.regions;
  const toggle = (r) => {
    if (regions.includes(r)) {
      if (regions.length === 1) return showToast(t('कम्तीमा एउटा टोल हुनुपर्छ'));
      const next = regions.filter((x) => x !== r);
      dispatch({ type: 'ME', patch: { regions: next, region: next.includes(state.me.region) ? state.me.region : next[0] } });
    } else {
      if (regions.length >= 2) return showToast(t('बढीमा २ वटा टोल छान्न सकिन्छ'));
      dispatch({ type: 'ME', patch: { regions: [...regions, r] } });
    }
  };
  const { navigate } = useRouter();
  const verify = () => {
    if (!state.auth.loggedIn) { showToast(t('पहिले मोबाइल नम्बरबाट लगइन गर्नुहोस्')); navigate('/login?next=/my/region'); return; }
    if (REGION_INFO[state.me.region]?.open === false) { showToast(t('{region} मा सेवा अझै सुरु भएको छैन', { region: t(state.me.region) })); return; }
    setChecking(true);
    const done = () => { setChecking(false); dispatch({ type: 'ME', patch: { verified: true } }); showToast(t('{region} टोल प्रमाणीकरण सफल भयो', { region: t(state.me.region) })); };
    if (navigator.geolocation) navigator.geolocation.getCurrentPosition(done, done, { timeout: 5000 });
    else setTimeout(done, 800);
  };
  return (
    <div className="page"><TopBar back title={t('मेरो टोल')} />
      <section className="pad">
        <h2 className="section-title">{t('टोल छान्नुहोस्')} <span className="meta">{t('बढीमा २ वटा')}</span></h2>
        <div className="tag-wrap">{REGIONS.map((r) => <button key={r} className={`tag ${regions.includes(r) ? 'is-on' : ''}`} onClick={() => toggle(r)}>{t(r)}{REGION_INFO[r]?.open === false && <small className="soon">{t('छिट्टै')}</small>}</button>)}</div>
        <p className="meta mt">{t('पहिलो चरणमा काठमाडौं उपत्यकाका केही टोलमा मात्र सेवा सुरु भएको छ। "छिट्टै" लेखिएका टोलमा प्रतीक्षा सूचीमा नाम लेखाउन सकिन्छ।')}</p>
      </section>
      <section className="pad">
        <h2 className="section-title">{t('कति टाढासम्म देखाउने')}</h2>
        <input type="range" min="1" max="4" value={state.me.radius} onChange={(e) => dispatch({ type: 'ME', patch: { radius: +e.target.value } })} className="range" aria-label={t('दूरी')} />
        <div className="row-between meta"><span>{t('मेरो टोल')}</span><span>{t('नजिकका टोल')}</span><span>{t('टाढाका टोल')}</span></div>
        <p className="meta mt">{t('छानिएको दूरीभित्रका छिमेकीले मात्र तपाईंको पोस्ट देख्नेछन्।')}</p>
      </section>
      <section className="pad verify-card">
        <h2 className="section-title">{t('टोल प्रमाणीकरण')}</h2>
        <p className="meta">{t('तपाईं अहिले')} {t(state.me.region)} {t('मै हुनुहुन्छ कि भनेर जाँच गरिन्छ। प्रमाणीकरणपछि छिमेकीसँग च्याट गर्न सकिन्छ।')}</p>
        <button className="btn block mt" onClick={verify} disabled={checking || state.me.verified}>{state.me.verified ? t('प्रमाणित ✓') : checking ? t('स्थान जाँच हुँदैछ…') : t('हालको स्थानबाट प्रमाणित गर्नुहोस्')}</button>
      </section>
    </div>
  );
}

function ReviewList({ list, user }) {
  return <ul className="review-list">{list.map((r) => { const f = user(r.fromId); return (
    <li key={r.id}><Avatar user={f} size={36} /><div><strong>{f?.nickname}</strong> <span className="meta">{ago(r.at)}</span><p>{t(r.text)}</p>{r.tags.length > 0 && <div className="tag-wrap sm">{r.tags.map((x) => <span key={x} className="tag">{t(x)}</span>)}</div>}</div></li>); })}</ul>;
}

export function Reviews() {
  const { state, user } = useStore();
  const list = state.reviews.filter((r) => r.toId === 'me');
  return <div className="page"><TopBar back title={t('प्राप्त समीक्षा')} />
    {list.length === 0 ? <Empty icon="📝" title={t('अहिलेसम्म समीक्षा आएको छैन')} /> : <ReviewList list={list} user={user} />}
  </div>;
}

export function UserProfile({ id }) {
  const { state, user, dispatch, showToast } = useStore();
  const [tab, setTab] = useState('products');
  const [menu, setMenu] = useState(false);
  const u = user(id);
  if (!u) return <div className="page"><TopBar back /><Empty title={t('प्रयोगकर्ता भेटिएन')} /></div>;
  const products = state.products.filter((p) => p.sellerId === id && !(id !== 'me' && state.hidden.includes(p.id)));
  const reviews = state.reviews.filter((r) => r.toId === id);
  const tagCounts = MANNER_TAGS.map((x) => [x, reviews.filter((r) => r.tags.includes(x)).length + (id === 'me' ? 0 : (u.temp > 40 ? 3 : 1))]).filter(([, n]) => n > 0);
  const isBlocked = state.blocked.includes(id);
  return (
    <div className="page"><TopBar back title={t('प्रोफाइल')} right={id !== 'me' && <button className="icon-btn" onClick={() => setMenu(true)} aria-label={t('थप')}>⋯</button>} />
      <div className="profile-card static"><Avatar user={u} size={64} /><div className="profile-name"><strong>{u.nickname}</strong><span className="meta">{t(u.region)} · {t('{year} देखि सदस्य', { year: ne(u.joined?.slice(0, 4)) })}</span></div></div>
      <div className="pad"><MannerTemp temp={u.temp} />{u.responseRate && <p className="meta mt">{t('जवाफ दर')} {ne(u.responseRate)}{t('% · प्रायः १ घण्टाभित्र जवाफ')}</p>}</div>
      {id === 'me' && <div className="pad"><Link to="/my/settings" className="btn ghost block">{t('प्रोफाइल सम्पादन')}</Link></div>}
      <div className="tabs">{[['products', t('सामान {n}', { n: ne(products.length) })], ['manner', t('प्रशंसा')], ['reviews', t('समीक्षा {n}', { n: ne(reviews.length) })]].map(([k, v]) =>
        <button key={k} className={`tab ${tab === k ? 'is-on' : ''}`} onClick={() => setTab(k)}>{v}</button>)}</div>
      {tab === 'products' && (products.length ? <div className="plist">{products.map((p) => <ProductCard key={p.id} p={p} />)}</div> : <Empty icon="📦" title={t('बिक्रीमा कुनै सामान छैन')} />)}
      {tab === 'manner' && (tagCounts.length ? <ul className="manner-list">{tagCounts.map(([x, n]) => <li key={x}><span>👥 {ne(n)}</span>{t(x)}</li>)}</ul> : <Empty icon="🤝" title={t('अहिलेसम्म प्रशंसा पाइएको छैन')} />)}
      {tab === 'reviews' && (reviews.length ? <ReviewList list={reviews} user={user} /> : <Empty icon="📝" title={t('अहिलेसम्म समीक्षा छैन')} />)}
      <Sheet open={menu} onClose={() => setMenu(false)} items={[
        { label: isBlocked ? t('अनब्लक गर्नुहोस्') : t('ब्लक गर्नुहोस्'), danger: true, onClick: () => { dispatch({ type: isBlocked ? 'UNBLOCK' : 'BLOCK', userId: id }); showToast(isBlocked ? t('अनब्लक गरियो') : t('ब्लक गरियो')); } },
        { label: t('रिपोर्ट गर्नुहोस्'), danger: true, onClick: () => showToast(t('रिपोर्ट प्राप्त भयो')) },
      ]} />
    </div>
  );
}

export function WriteReview({ userId }) {
  const { state, dispatch, user, uid, showToast } = useStore();
  const { query, navigate } = useRouter();
  const productId = query.get('product');
  const p = state.products.find((x) => x.id === productId);
  const u = user(userId);
  const [rating, setRating] = useState('good');
  const [tags, setTags] = useState([]);
  const [text, setText] = useState('');
  if (!u) return <div className="page"><TopBar back /><Empty title={t('प्रयोगकर्ता भेटिएन')} /></div>;
  return (
    <div className="page has-actionbar"><TopBar back title={t('समीक्षा लेख्नुहोस्')} />
      <div className="pad">
        <p className="lead">{p ? t('{name} सँग "{item}" को कारोबार कस्तो रह्यो?', { name: u.nickname, item: t(p.title) }) : t('{name} सँग कारोबार कस्तो रह्यो?', { name: u.nickname })}</p>
        <div className="seg mt">{[['bad', t('राम्रो भएन 😞')], ['good', t('राम्रो 🙂')], ['best', t('एकदम राम्रो 😍')]].map(([k, v]) =>
          <button key={k} className={rating === k ? 'is-on' : ''} onClick={() => setRating(k)}>{v}</button>)}</div>
        {rating !== 'bad' && <>
          <h3 className="section-title mt">{t('के कुरा राम्रो लाग्यो?')}</h3>
          <div className="check-list">{MANNER_TAGS.map((tag) => (
            <label key={tag} className="check"><input type="checkbox" checked={tags.includes(tag)} onChange={() => setTags((s) => (s.includes(tag) ? s.filter((x) => x !== tag) : [...s, tag]))} />{t(tag)}</label>))}</div>
        </>}
        <textarea className="input mt" rows={4} value={text} onChange={(e) => setText(e.target.value)} placeholder={t('आफ्नो अनुभव लेख्नुहोस्। यो समीक्षा उहाँको प्रोफाइलमा देखिनेछ।')} />
      </div>
      <div className="actionbar"><button className="btn block" onClick={() => {
        dispatch({ type: 'ADD_REVIEW', review: { id: uid('r'), fromId: 'me', toId: userId, productId, text: text.trim() || (rating === 'bad' ? t('अलि असन्तुष्ट कारोबार भयो।') : t('राम्रो कारोबार, धन्यवाद! 🙏')), tags: rating === 'bad' ? [] : tags, at: Date.now() } });
        showToast(t('समीक्षा पठाइयो')); navigate(`/users/${userId}`, { replace: true });
      }}>{t('समीक्षा पठाउनुहोस्')}</button></div>
    </div>
  );
}

export function Settings() {
  const { state, dispatch, showToast } = useStore();
  const [nick, setNick] = useState(state.me.nickname);
  return (
    <div className="page"><TopBar back title={t('प्रोफाइल र सेटिङ')} />
      <div className="pad form">
        <div className="field"><span>{t('भाषा')} / Language</span><LangToggle /></div>
        <label className="field"><span>{t('उपनाम')}</span><input className="input" value={nick} onChange={(e) => setNick(e.target.value)} maxLength={16} /></label>
        <button className="btn block" disabled={nick.trim().length < 2} onClick={() => { dispatch({ type: 'ME', patch: { nickname: nick.trim() } }); showToast(t('प्रोफाइल सुरक्षित भयो')); }}>{t('सुरक्षित गर्नुहोस्')}</button>
        <hr className="hr" />
        <label className="check"><input type="checkbox" checked={state.settings.lite} onChange={(e) => dispatch({ type: 'SETTINGS', patch: { lite: e.target.checked } })} />
          <span><strong>{t('डेटा बचत मोड')}</strong><br /><span className="meta">{t('फोटो सानो आकारमा लोड हुन्छ — मोबाइल डेटा कम खर्च हुन्छ।')}</span></span></label>
        <p className="meta">{t('लगइन:')} {state.auth.loggedIn ? `+977 ${state.auth.phone}` : t('लगइन गरिएको छैन')}</p>
        {state.auth.loggedIn && <button className="btn ghost block" onClick={() => { dispatch({ type: 'LOGOUT' }); showToast(t('लगआउट भयो')); }}>{t('लगआउट')}</button>}
        <hr className="hr" />
        <button className="btn ghost block" onClick={() => { if (confirm(t('सबै डेटा सुरुको अवस्थामा फर्काउने?'))) { dispatch({ type: 'RESET' }); showToast(t('डेटा रिसेट भयो')); } }}>{t('डेमो डेटा रिसेट गर्नुहोस्')}</button>
        <p className="meta">{t('यो साइटको डेटा तपाईंको ब्राउजर (localStorage) मा मात्र सुरक्षित हुन्छ।')}</p>
      </div>
    </div>
  );
}

export function Blocked() {
  const { state, dispatch, user } = useStore();
  const hidden = state.products.filter((p) => state.hidden.includes(p.id) && p.sellerId !== 'me');
  return (
    <div className="page"><TopBar back title={t('ब्लक र लुकाइएका पोस्ट')} />
      <section className="pad"><h2 className="section-title">{t('ब्लक गरिएका प्रयोगकर्ता')}</h2>
        {state.blocked.length === 0 ? <p className="meta">{t('कसैलाई ब्लक गरिएको छैन।')}</p> : state.blocked.map((id) => { const u = user(id); return (
          <div key={id} className="row-between line"><span className="row"><Avatar user={u} size={32} />{u?.nickname}</span><button className="btn sm ghost" onClick={() => dispatch({ type: 'UNBLOCK', userId: id })}>{t('अनब्लक')}</button></div>); })}
      </section>
      <section className="pad"><h2 className="section-title">{t('लुकाइएका पोस्ट')}</h2>
        {hidden.length === 0 ? <p className="meta">{t('कुनै पोस्ट लुकाइएको छैन।')}</p> : hidden.map((p) => (
          <div key={p.id} className="row-between line"><span>{t(p.title)} <span className="meta">{STATUS[p.status]}</span></span><button className="btn sm ghost" onClick={() => dispatch({ type: 'UNHIDE', id: p.id })}>{t('देखाउनुहोस्')}</button></div>))}
      </section>
    </div>
  );
}

export function Notifications() {
  const { state, dispatch } = useStore();
  const { navigate } = useRouter();
  const [tab, setTab] = useState('activity');
  const list = state.notifications.filter((n) => n.type === tab);
  return (
    <div className="page"><TopBar back title={t('सूचनाहरू')} right={<button className="text-btn" onClick={() => dispatch({ type: 'READ_NOTI' })}>{t('सबै पढियो')}</button>} />
      <div className="tabs">{[['activity', t('गतिविधि')], ['keyword', t('किवर्ड')]].map(([k, v]) => <button key={k} className={`tab ${tab === k ? 'is-on' : ''}`} onClick={() => setTab(k)}>{v}</button>)}</div>
      {list.length === 0 ? <Empty icon="🔔" title={t('नयाँ सूचना छैन')} /> :
        <ul className="noti-list">{list.map((n) => (
          <li key={n.id} className={n.read ? '' : 'is-new'}>
            <button className="noti" onClick={() => n.link && navigate(n.link)}><span>{n.type === 'keyword' ? '🏷️' : '🔔'}</span><div><p>{t(n.text, n.vars)}</p><p className="meta">{ago(n.at)}</p></div></button>
            <button className="icon-btn sm" onClick={() => dispatch({ type: 'DELETE_NOTI', id: n.id })} aria-label={t('सूचना हटाउनुहोस्')}>✕</button>
          </li>))}</ul>}
    </div>
  );
}
