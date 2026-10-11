import { useState } from 'react';
import { useStore } from '../store/Store';
import { Link, useRouter } from '../store/router';
import { REGIONS, MANNER_TAGS } from '../data/mock';
import { Avatar, MannerTemp, TopBar, ProductCard, Empty, Sheet } from '../components/UI';
import { IChevron, IReceipt, IBag, IHeart, ITag, IMap, IShield, ISettings, IBell, IStar } from '../components/Icons';
import { ago, STATUS, ne } from '../utils';

export default function My() {
  const { state, user } = useStore();
  const me = user('me');
  const reviews = state.reviews.filter((r) => r.toId === 'me');
  const tiles = [
    { to: '/my/sales', Icon: IReceipt, label: 'बेचेका', n: state.products.filter((p) => p.sellerId === 'me').length },
    { to: '/my/purchases', Icon: IBag, label: 'किनेका', n: state.purchases.length },
    { to: '/my/likes', Icon: IHeart, label: 'मनपर्ने', n: state.likes.length },
  ];
  return (
    <div className="page">
      <header className="topbar"><h1 className="topbar-title left">मेरो पेज</h1><div className="topbar-right"><Link to="/my/settings" className="icon-btn" aria-label="सेटिङ"><ISettings /></Link></div></header>
      <Link to="/users/me" className="profile-card">
        <Avatar user={me} size={60} />
        <div className="profile-name"><strong>{me.nickname}</strong><span className="meta">{me.region} · {state.me.verified ? 'टोल प्रमाणित ✓' : 'टोल प्रमाणीकरण बाँकी'}</span></div>
        <IChevron />
      </Link>
      <div className="pad"><MannerTemp temp={me.temp} /></div>
      <div className="my-tiles">{tiles.map(({ to, Icon, label, n }) => (
        <Link key={to} to={to} className="my-tile"><span className="my-tile-icon"><Icon /></span>{label}<small>{ne(n)}</small></Link>))}</div>
      <ul className="menu-list">
        <li><Link to="/my/region"><IMap />मेरो टोल · टोल प्रमाणीकरण</Link></li>
        <li><Link to="/my/keywords"><ITag />किवर्ड सूचना <span className="meta">{ne(state.keywords.length)} वटा</span></Link></li>
        <li><Link to="/my/reviews"><IStar />प्राप्त समीक्षा <span className="meta">{ne(reviews.length)} वटा</span></Link></li>
        <li><Link to="/notifications"><IBell />सूचनाहरू</Link></li>
        <li><Link to="/my/blocked"><IShield />ब्लक र लुकाइएका पोस्ट</Link></li>
        <li><Link to="/my/settings"><ISettings />प्रोफाइल र सेटिङ</Link></li>
      </ul>
    </div>
  );
}

export function MySales() {
  const { state, dispatch, showToast } = useStore();
  const [tab, setTab] = useState('selling');
  const mine = state.products.filter((p) => p.sellerId === 'me');
  const list = tab === 'hidden' ? mine.filter((p) => state.hidden.includes(p.id))
    : mine.filter((p) => !state.hidden.includes(p.id) && (tab === 'sold' ? p.status === 'sold' : p.status !== 'sold'));
  const emptyTitle = { selling: 'बिक्रीमा कुनै सामान छैन', sold: 'बिक्री सम्पन्न सामान छैन', hidden: 'लुकाइएको पोस्ट छैन' }[tab];
  return (
    <div className="page">
      <TopBar back title="बेचेका सामान" />
      <div className="tabs">{[['selling', 'बिक्रीमा'], ['sold', 'बिक्री सम्पन्न'], ['hidden', 'लुकाइएको']].map(([k, v]) =>
        <button key={k} className={`tab ${tab === k ? 'is-on' : ''}`} onClick={() => setTab(k)}>{v}</button>)}</div>
      {list.length === 0 ? <Empty icon="📦" title={emptyTitle} action={tab === 'selling' && <Link to="/write" className="btn mt">सामान बेच्नुहोस्</Link>} /> :
        list.map((p) => (
          <div key={p.id} className="sale-item">
            <ProductCard p={p} />
            <div className="sale-actions">
              {tab === 'hidden' ? <button onClick={() => { dispatch({ type: 'UNHIDE', id: p.id }); showToast('पोस्ट फेरि देखिनेछ'); }}>लुकाउन छोड्नुहोस्</button> : <>
                {p.status !== 'sold' && <button onClick={() => dispatch({ type: 'UPDATE_PRODUCT', id: p.id, patch: { status: p.status === 'reserved' ? 'selling' : 'reserved' } })}>{p.status === 'reserved' ? 'बिक्रीमा राख्नुहोस्' : 'बुक भएको बनाउनुहोस्'}</button>}
                <button onClick={() => dispatch({ type: 'UPDATE_PRODUCT', id: p.id, patch: { status: p.status === 'sold' ? 'selling' : 'sold' } })}>{p.status === 'sold' ? 'बिक्रीमा राख्नुहोस्' : 'बिक्री सम्पन्न'}</button>
                {p.status !== 'sold' && <button onClick={() => { dispatch({ type: 'UPDATE_PRODUCT', id: p.id, patch: { bumpedAt: Date.now() } }); showToast('पोस्ट माथि ल्याइयो'); }}>माथि ल्याउनुहोस्</button>}
              </>}
            </div>
          </div>))}
    </div>
  );
}

export function MyPurchases() {
  const { state } = useStore();
  const list = state.products.filter((p) => state.purchases.includes(p.id));
  return <div className="page"><TopBar back title="किनेका सामान" />
    {list.length === 0 ? <Empty icon="🛍️" title="अहिलेसम्म केही किन्नुभएको छैन" desc="च्याटमा 'खरिद पक्का' गरेपछि यहाँ देखिन्छ।" /> : <div className="plist">{list.map((p) => <ProductCard key={p.id} p={p} />)}</div>}
  </div>;
}

export function MyLikes() {
  const { state } = useStore();
  const list = state.products.filter((p) => state.likes.includes(p.id));
  return <div className="page"><TopBar back title="मनपर्ने सामान" />
    {list.length === 0 ? <Empty icon="🤍" title="मनपर्ने सूची खाली छ" desc="मुटुको चिन्ह थिचेर सामान सुरक्षित गर्नुहोस्।" /> : <div className="plist">{list.map((p) => <ProductCard key={p.id} p={p} />)}</div>}
  </div>;
}

export function Keywords() {
  const { state, dispatch, showToast } = useStore();
  const [k, setK] = useState('');
  const add = (e) => { e.preventDefault(); const t = k.trim(); if (!t) return; if (state.keywords.length >= 30) return showToast('बढीमा ३० वटा किवर्ड राख्न सकिन्छ'); dispatch({ type: 'ADD_KEYWORD', k: t }); setK(''); };
  return (
    <div className="page"><TopBar back title="किवर्ड सूचना" />
      <form className="pad row" onSubmit={add}>
        <input className="input" value={k} onChange={(e) => setK(e.target.value)} placeholder="जस्तै: स्कुटर, iPhone, साडी" />
        <button className="btn" disabled={!k.trim()}>थप्नुहोस्</button>
      </form>
      <p className="pad-x meta">{state.me.region} नजिक यी शब्द भएको नयाँ पोस्ट आउनेबित्तिकै सूचना पाउनुहुनेछ। ({ne(state.keywords.length)}/३०)</p>
      <div className="pad tag-wrap">{state.keywords.map((x) => (
        <span key={x} className="tag is-on">{x}<button onClick={() => dispatch({ type: 'DEL_KEYWORD', k: x })} aria-label={`${x} हटाउनुहोस्`}>✕</button></span>))}</div>
    </div>
  );
}

export function RegionSettings() {
  const { state, dispatch, showToast } = useStore();
  const [checking, setChecking] = useState(false);
  const regions = state.me.regions;
  const toggle = (r) => {
    if (regions.includes(r)) {
      if (regions.length === 1) return showToast('कम्तीमा एउटा टोल हुनुपर्छ');
      const next = regions.filter((x) => x !== r);
      dispatch({ type: 'ME', patch: { regions: next, region: next.includes(state.me.region) ? state.me.region : next[0] } });
    } else {
      if (regions.length >= 2) return showToast('बढीमा २ वटा टोल छान्न सकिन्छ');
      dispatch({ type: 'ME', patch: { regions: [...regions, r] } });
    }
  };
  const verify = () => {
    setChecking(true);
    const done = () => { setChecking(false); dispatch({ type: 'ME', patch: { verified: true } }); showToast(`${state.me.region} टोल प्रमाणीकरण सफल भयो`); };
    if (navigator.geolocation) navigator.geolocation.getCurrentPosition(done, done, { timeout: 5000 });
    else setTimeout(done, 800);
  };
  return (
    <div className="page"><TopBar back title="मेरो टोल" />
      <section className="pad">
        <h2 className="section-title">टोल छान्नुहोस् <span className="meta">बढीमा २ वटा</span></h2>
        <div className="tag-wrap">{REGIONS.map((r) => <button key={r} className={`tag ${regions.includes(r) ? 'is-on' : ''}`} onClick={() => toggle(r)}>{r}</button>)}</div>
      </section>
      <section className="pad">
        <h2 className="section-title">कति टाढासम्म देखाउने</h2>
        <input type="range" min="1" max="4" value={state.me.radius} onChange={(e) => dispatch({ type: 'ME', patch: { radius: +e.target.value } })} className="range" aria-label="दूरी" />
        <div className="row-between meta"><span>मेरो टोल</span><span>नजिकका टोल</span><span>टाढाका टोल</span></div>
        <p className="meta mt">छानिएको दूरीभित्रका छिमेकीले मात्र तपाईंको पोस्ट देख्नेछन्।</p>
      </section>
      <section className="pad verify-card">
        <h2 className="section-title">टोल प्रमाणीकरण</h2>
        <p className="meta">तपाईं अहिले {state.me.region} मै हुनुहुन्छ कि भनेर जाँच गरिन्छ। प्रमाणीकरणपछि छिमेकीसँग च्याट गर्न सकिन्छ।</p>
        <button className="btn block mt" onClick={verify} disabled={checking || state.me.verified}>{state.me.verified ? 'प्रमाणित ✓' : checking ? 'स्थान जाँच हुँदैछ…' : 'हालको स्थानबाट प्रमाणित गर्नुहोस्'}</button>
      </section>
    </div>
  );
}

function ReviewList({ list, user }) {
  return <ul className="review-list">{list.map((r) => { const f = user(r.fromId); return (
    <li key={r.id}><Avatar user={f} size={36} /><div><strong>{f?.nickname}</strong> <span className="meta">{ago(r.at)}</span><p>{r.text}</p>{r.tags.length > 0 && <div className="tag-wrap sm">{r.tags.map((t) => <span key={t} className="tag">{t}</span>)}</div>}</div></li>); })}</ul>;
}

export function Reviews() {
  const { state, user } = useStore();
  const list = state.reviews.filter((r) => r.toId === 'me');
  return <div className="page"><TopBar back title="प्राप्त समीक्षा" />
    {list.length === 0 ? <Empty icon="📝" title="अहिलेसम्म समीक्षा आएको छैन" /> : <ReviewList list={list} user={user} />}
  </div>;
}

export function UserProfile({ id }) {
  const { state, user, dispatch, showToast } = useStore();
  const [tab, setTab] = useState('products');
  const [menu, setMenu] = useState(false);
  const u = user(id);
  if (!u) return <div className="page"><TopBar back /><Empty title="प्रयोगकर्ता भेटिएन" /></div>;
  const products = state.products.filter((p) => p.sellerId === id && !(id !== 'me' && state.hidden.includes(p.id)));
  const reviews = state.reviews.filter((r) => r.toId === id);
  const tagCounts = MANNER_TAGS.map((t) => [t, reviews.filter((r) => r.tags.includes(t)).length + (id === 'me' ? 0 : (u.temp > 40 ? 3 : 1))]).filter(([, n]) => n > 0);
  const isBlocked = state.blocked.includes(id);
  return (
    <div className="page"><TopBar back title="प्रोफाइल" right={id !== 'me' && <button className="icon-btn" onClick={() => setMenu(true)} aria-label="थप">⋯</button>} />
      <div className="profile-card static"><Avatar user={u} size={64} /><div className="profile-name"><strong>{u.nickname}</strong><span className="meta">{u.region} · {ne(u.joined?.slice(0, 4))} देखि सदस्य</span></div></div>
      <div className="pad"><MannerTemp temp={u.temp} />{u.responseRate && <p className="meta mt">जवाफ दर {ne(u.responseRate)}% · प्रायः १ घण्टाभित्र जवाफ</p>}</div>
      {id === 'me' && <div className="pad"><Link to="/my/settings" className="btn ghost block">प्रोफाइल सम्पादन</Link></div>}
      <div className="tabs">{[['products', `सामान ${ne(products.length)}`], ['manner', 'प्रशंसा'], ['reviews', `समीक्षा ${ne(reviews.length)}`]].map(([k, v]) =>
        <button key={k} className={`tab ${tab === k ? 'is-on' : ''}`} onClick={() => setTab(k)}>{v}</button>)}</div>
      {tab === 'products' && (products.length ? <div className="plist">{products.map((p) => <ProductCard key={p.id} p={p} />)}</div> : <Empty icon="📦" title="बिक्रीमा कुनै सामान छैन" />)}
      {tab === 'manner' && (tagCounts.length ? <ul className="manner-list">{tagCounts.map(([t, n]) => <li key={t}><span>👥 {ne(n)}</span>{t}</li>)}</ul> : <Empty icon="🤝" title="अहिलेसम्म प्रशंसा पाइएको छैन" />)}
      {tab === 'reviews' && (reviews.length ? <ReviewList list={reviews} user={user} /> : <Empty icon="📝" title="अहिलेसम्म समीक्षा छैन" />)}
      <Sheet open={menu} onClose={() => setMenu(false)} items={[
        { label: isBlocked ? 'अनब्लक गर्नुहोस्' : 'ब्लक गर्नुहोस्', danger: true, onClick: () => { dispatch({ type: isBlocked ? 'UNBLOCK' : 'BLOCK', userId: id }); showToast(isBlocked ? 'अनब्लक गरियो' : 'ब्लक गरियो'); } },
        { label: 'रिपोर्ट गर्नुहोस्', danger: true, onClick: () => showToast('रिपोर्ट प्राप्त भयो') },
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
  if (!u) return <div className="page"><TopBar back /><Empty title="प्रयोगकर्ता भेटिएन" /></div>;
  return (
    <div className="page has-actionbar"><TopBar back title="समीक्षा लेख्नुहोस्" />
      <div className="pad">
        <p className="lead">{u.nickname} सँग {p ? `"${p.title}" को ` : ''}कारोबार कस्तो रह्यो?</p>
        <div className="seg mt">{[['bad', 'राम्रो भएन 😞'], ['good', 'राम्रो 🙂'], ['best', 'एकदम राम्रो 😍']].map(([k, v]) =>
          <button key={k} className={rating === k ? 'is-on' : ''} onClick={() => setRating(k)}>{v}</button>)}</div>
        {rating !== 'bad' && <>
          <h3 className="section-title mt">के कुरा राम्रो लाग्यो?</h3>
          <div className="check-list">{MANNER_TAGS.map((t) => (
            <label key={t} className="check"><input type="checkbox" checked={tags.includes(t)} onChange={() => setTags((s) => (s.includes(t) ? s.filter((x) => x !== t) : [...s, t]))} />{t}</label>))}</div>
        </>}
        <textarea className="input mt" rows={4} value={text} onChange={(e) => setText(e.target.value)} placeholder="आफ्नो अनुभव लेख्नुहोस्। यो समीक्षा उहाँको प्रोफाइलमा देखिनेछ।" />
      </div>
      <div className="actionbar"><button className="btn block" onClick={() => {
        dispatch({ type: 'ADD_REVIEW', review: { id: uid('r'), fromId: 'me', toId: userId, productId, text: text.trim() || (rating === 'bad' ? 'अलि असन्तुष्ट कारोबार भयो।' : 'राम्रो कारोबार, धन्यवाद! 🙏'), tags: rating === 'bad' ? [] : tags, at: Date.now() } });
        showToast('समीक्षा पठाइयो'); navigate(`/users/${userId}`, { replace: true });
      }}>समीक्षा पठाउनुहोस्</button></div>
    </div>
  );
}

export function Settings() {
  const { state, dispatch, showToast } = useStore();
  const [nick, setNick] = useState(state.me.nickname);
  return (
    <div className="page"><TopBar back title="प्रोफाइल र सेटिङ" />
      <div className="pad form">
        <label className="field"><span>उपनाम</span><input className="input" value={nick} onChange={(e) => setNick(e.target.value)} maxLength={16} /></label>
        <button className="btn block" disabled={nick.trim().length < 2} onClick={() => { dispatch({ type: 'ME', patch: { nickname: nick.trim() } }); showToast('प्रोफाइल सुरक्षित भयो'); }}>सुरक्षित गर्नुहोस्</button>
        <hr className="hr" />
        <button className="btn ghost block" onClick={() => { if (confirm('सबै डेटा सुरुको अवस्थामा फर्काउने?')) { dispatch({ type: 'RESET' }); showToast('डेटा रिसेट भयो'); } }}>डेमो डेटा रिसेट गर्नुहोस्</button>
        <p className="meta">यो साइटको डेटा तपाईंको ब्राउजर (localStorage) मा मात्र सुरक्षित हुन्छ।</p>
      </div>
    </div>
  );
}

export function Blocked() {
  const { state, dispatch, user } = useStore();
  const hidden = state.products.filter((p) => state.hidden.includes(p.id) && p.sellerId !== 'me');
  return (
    <div className="page"><TopBar back title="ब्लक र लुकाइएका पोस्ट" />
      <section className="pad"><h2 className="section-title">ब्लक गरिएका प्रयोगकर्ता</h2>
        {state.blocked.length === 0 ? <p className="meta">कसैलाई ब्लक गरिएको छैन।</p> : state.blocked.map((id) => { const u = user(id); return (
          <div key={id} className="row-between line"><span className="row"><Avatar user={u} size={32} />{u?.nickname}</span><button className="btn sm ghost" onClick={() => dispatch({ type: 'UNBLOCK', userId: id })}>अनब्लक</button></div>); })}
      </section>
      <section className="pad"><h2 className="section-title">लुकाइएका पोस्ट</h2>
        {hidden.length === 0 ? <p className="meta">कुनै पोस्ट लुकाइएको छैन।</p> : hidden.map((p) => (
          <div key={p.id} className="row-between line"><span>{p.title} <span className="meta">{STATUS[p.status]}</span></span><button className="btn sm ghost" onClick={() => dispatch({ type: 'UNHIDE', id: p.id })}>देखाउनुहोस्</button></div>))}
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
    <div className="page"><TopBar back title="सूचनाहरू" right={<button className="text-btn" onClick={() => dispatch({ type: 'READ_NOTI' })}>सबै पढियो</button>} />
      <div className="tabs">{[['activity', 'गतिविधि'], ['keyword', 'किवर्ड']].map(([k, v]) => <button key={k} className={`tab ${tab === k ? 'is-on' : ''}`} onClick={() => setTab(k)}>{v}</button>)}</div>
      {list.length === 0 ? <Empty icon="🔔" title="नयाँ सूचना छैन" /> :
        <ul className="noti-list">{list.map((n) => (
          <li key={n.id} className={n.read ? '' : 'is-new'}>
            <button className="noti" onClick={() => n.link && navigate(n.link)}><span>{n.type === 'keyword' ? '🏷️' : '🔔'}</span><div><p>{n.text}</p><p className="meta">{ago(n.at)}</p></div></button>
            <button className="icon-btn sm" onClick={() => dispatch({ type: 'DELETE_NOTI', id: n.id })} aria-label="सूचना हटाउनुहोस्">✕</button>
          </li>))}</ul>}
    </div>
  );
}
