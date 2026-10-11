import { useEffect, useRef, useState } from 'react';
import { useStore } from '../store/Store';
import { Link, useRouter } from '../store/router';
import { Img, Avatar, Empty, TopBar, MannerTemp, Sheet, Modal, StatusBadge } from '../components/UI';
import { ISend, IPlus, IMore } from '../components/Icons';
import { ago, clock, priceLabel, rs, fileToDataUrl, dateLabel, ne } from '../utils';

export default function Chats() {
  const { state, user } = useStore();
  const [filter, setFilter] = useState('all');
  const chats = state.chats.filter((c) => {
    const p = state.products.find((x) => x.id === c.productId);
    if (filter === 'sell') return p?.sellerId === 'me';
    if (filter === 'buy') return p?.sellerId !== 'me';
    if (filter === 'unread') return c.unread > 0;
    return true;
  });
  return (
    <div className="page">
      <header className="topbar"><h1 className="topbar-title left">च्याट</h1></header>
      <div className="chips">
        {[['all', 'सबै'], ['sell', 'बेच्दै'], ['buy', 'किन्दै'], ['unread', 'नपढिएका']].map(([k, v]) =>
          <button key={k} className={`chip ${filter === k ? 'is-on' : ''}`} onClick={() => setFilter(k)}>{v}</button>)}
      </div>
      {chats.length === 0 ? <Empty icon="💬" title="कुनै च्याट छैन" desc="मन परेको सामान फेला पारेर च्याट सुरु गर्नुहोस्।" action={<Link to="/" className="btn mt">सामान हेर्नुहोस्</Link>} /> :
        <ul className="chat-list">{chats.map((c) => {
          const u = user(c.partnerId); const p = state.products.find((x) => x.id === c.productId); const last = c.messages[c.messages.length - 1];
          return (
            <li key={c.id}><Link to={`/chats/${c.id}`} className="chat-row">
              <Avatar user={u} size={48} />
              <div className="chat-mid">
                <p><strong>{u.nickname}</strong> <span className="meta">{u.region} · {ago(c.updatedAt)}</span></p>
                <p className="chat-last">{last ? (last.image ? 'फोटो पठाउनुभयो' : last.kind === 'appt' ? '📅 भेटघाट तय भयो' : last.text) : 'कुराकानी सुरु गर्नुहोस्'}</p>
              </div>
              {c.unread > 0 && <span className="unread">{ne(c.unread)}</span>}
              {p && <div className="chat-thumb"><Img src={p.images[0]} fallback={p.fb} alt="" seed={p.id} /></div>}
            </Link></li>);
        })}</ul>}
    </div>
  );
}

export function ChatRoom({ id }) {
  const { state, dispatch, user, send, showToast } = useStore();
  const { navigate } = useRouter();
  const [text, setText] = useState('');
  const [menu, setMenu] = useState(false);
  const [plus, setPlus] = useState(false);
  const [appt, setAppt] = useState(false);
  const [when, setWhen] = useState('');
  const [where, setWhere] = useState('');
  const endRef = useRef(null);
  const fileRef = useRef(null);
  const chat = state.chats.find((c) => c.id === id);

  useEffect(() => { if (chat?.unread) dispatch({ type: 'READ_CHAT', id }); }, [chat?.unread, id, dispatch]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chat?.messages.length]);

  if (!chat) return <div className="page"><TopBar back /><Empty icon="💬" title="च्याट भेटिएन" /></div>;
  const u = user(chat.partnerId);
  const p = state.products.find((x) => x.id === chat.productId);
  const iAmSeller = p?.sellerId === 'me';
  const blocked = state.blocked.includes(u.id);
  const reviewed = state.reviews.some((r) => r.fromId === 'me' && r.toId === u.id && r.productId === p?.id);

  const submit = (e) => { e.preventDefault(); if (!text.trim()) return; send(id, text.trim()); setText(''); };

  return (
    <div className="page chat-page">
      <TopBar back title={<span className="chat-title">{u.nickname} <MannerTemp temp={u.temp} compact /></span>} right={<button className="icon-btn" onClick={() => setMenu(true)} aria-label="च्याट मेनु"><IMore /></button>} />
      {p && (
        <div className="chat-product">
          <Link to={`/products/${p.id}`} className="chat-product-link">
            <div className="chat-thumb"><Img src={p.images[0]} fallback={p.fb} alt="" seed={p.id} /></div>
            <div><p className="chat-product-title"><StatusBadge status={p.status} />{p.title}</p><strong>{priceLabel(p)}</strong></div>
          </Link>
          <div className="chat-product-actions">
            <button className="btn sm ghost" onClick={() => setAppt(true)}>📅 भेटघाट तय गर्नुहोस्</button>
            {!iAmSeller && p.status !== 'sold' && <button className="btn sm ghost" onClick={() => {
              dispatch({ type: 'PURCHASE', id: p.id }); dispatch({ type: 'UPDATE_PRODUCT', id: p.id, patch: { status: 'sold', buyerId: 'me' } }); showToast('खरिद पक्का भयो');
            }}>खरिद पक्का गर्नुहोस्</button>}
            {p.status === 'sold' && !reviewed && <button className="btn sm" onClick={() => navigate(`/review/${u.id}?product=${p.id}`)}>समीक्षा लेख्नुहोस्</button>}
          </div>
        </div>
      )}

      <div className="messages">
        <p className="safety">🛡️ कारोबार अघि बिक्रेताको भरोसा तापक्रम र समीक्षा हेर्नुहोस्। सामान नदेखी eSewa/Khalti मा अग्रिम भुक्तानी नगर्नुहोस् — ठगी हुन सक्छ।</p>
        {chat.messages.map((m, i) => {
          const mine = m.from === 'me';
          const showDate = i === 0 || new Date(m.at).toDateString() !== new Date(chat.messages[i - 1].at).toDateString();
          return (
            <div key={m.id}>
              {showDate && <p className="msg-date">{dateLabel(m.at, true)}</p>}
              <div className={`msg ${mine ? 'is-mine' : ''}`}>
                {!mine && <Avatar user={u} size={32} />}
                {m.kind === 'appt'
                  ? <div className="bubble appt"><strong>📅 भेटघाट तय भयो</strong><p>{m.when}</p><p>{m.where}</p></div>
                  : m.image ? <div className="bubble img"><img src={m.image} alt="पठाइएको फोटो" /></div>
                    : <div className={`bubble ${m.kind === 'offer' ? 'offer' : ''}`}>{m.kind === 'offer' && <small>मूल्य प्रस्ताव {rs(m.amount)}</small>}{m.text}</div>}
                <time className="msg-time">{clock(m.at)}</time>
              </div>
            </div>);
        })}
        <div ref={endRef} />
      </div>

      {blocked ? <div className="actionbar"><p className="meta">तपाईंले यो प्रयोगकर्तालाई ब्लक गर्नुभएको छ। <button className="text-btn strong" onClick={() => dispatch({ type: 'UNBLOCK', userId: u.id })}>अनब्लक गर्नुहोस्</button></p></div> :
        <form className="actionbar composer" onSubmit={submit}>
          <button type="button" className="icon-btn" onClick={() => setPlus(true)} aria-label="थप विकल्प"><IPlus /></button>
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="सन्देश लेख्नुहोस्" aria-label="सन्देश" />
          <button className="icon-btn send" disabled={!text.trim()} aria-label="पठाउनुहोस्"><ISend /></button>
        </form>}

      <Sheet open={plus} onClose={() => setPlus(false)} items={[
        { label: '📷 फोटो पठाउनुहोस्', onClick: () => fileRef.current?.click() },
        { label: '📅 भेटघाट तय गर्नुहोस्', onClick: () => setAppt(true) },
        { label: '📍 ठाउँ पठाउनुहोस्', onClick: () => send(id, `📍 ${p?.place || `${state.me.region} वडा कार्यालय अगाडि`} भेटौं`) },
        { label: 'छिटो सन्देश: अझै उपलब्ध छ?', onClick: () => send(id, 'नमस्ते, यो सामान अझै उपलब्ध छ?') },
      ]} />
      <input ref={fileRef} type="file" accept="image/*" hidden onChange={async (e) => { if (e.target.files[0]) send(id, '', { image: await fileToDataUrl(e.target.files[0], 600) }); e.target.value = ''; }} />

      <Sheet open={menu} onClose={() => setMenu(false)} items={[
        { label: `${u.nickname} को प्रोफाइल`, onClick: () => navigate(`/users/${u.id}`) },
        { label: blocked ? 'अनब्लक गर्नुहोस्' : 'ब्लक गर्नुहोस्', danger: !blocked, onClick: () => { dispatch({ type: blocked ? 'UNBLOCK' : 'BLOCK', userId: u.id }); showToast(blocked ? 'अनब्लक गरियो' : 'ब्लक गरियो'); } },
        { label: 'रिपोर्ट गर्नुहोस्', danger: true, onClick: () => showToast('रिपोर्ट प्राप्त भयो') },
        { label: 'च्याटबाट बाहिरिनुहोस्', danger: true, onClick: () => { if (confirm('बाहिरिँदा सबै सन्देश मेटिनेछन्।')) { dispatch({ type: 'LEAVE_CHAT', id }); navigate('/chats', { replace: true }); } } },
      ]} />

      <Modal open={appt} onClose={() => setAppt(false)} title="भेटघाट तय गर्नुहोस्">
        <label className="field"><span>मिति र समय</span><input type="datetime-local" className="input" value={when} onChange={(e) => setWhen(e.target.value)} /></label>
        <label className="field"><span>ठाउँ</span><input className="input" value={where} onChange={(e) => setWhere(e.target.value)} placeholder="जस्तै: पाटन दरबार स्क्वायर अगाडि" /></label>
        <button className="btn block mt" disabled={!when || !where} onClick={() => {
          const label = `${dateLabel(new Date(when).getTime(), true)}, ${clock(new Date(when).getTime())}`;
          send(id, 'भेटघाट', { kind: 'appt', when: label, where });
          if (p && iAmSeller && p.status === 'selling') dispatch({ type: 'UPDATE_PRODUCT', id: p.id, patch: { status: 'reserved' } });
          setAppt(false); setWhen(''); setWhere('');
        }}>तय गर्नुहोस्</button>
      </Modal>
    </div>
  );
}
