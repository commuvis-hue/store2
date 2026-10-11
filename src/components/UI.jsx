import { useState } from 'react';
import { useRouter, Link } from '../store/router';
import { useStore } from '../store/Store';
import { tempColor, tempFace, priceLabel, ago, STATUS, ne } from '../utils';
import { IBack, IHeart, IChat, IHome, ICommunity, IMap, IUser, IPlus } from './Icons';

const placeholder = () =>
  'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"><rect width="300" height="300" fill="#F1ECE6"/><path d="M60 210l55-70 35 40 30-30 60 60z" fill="#D9CFC4"/><circle cx="200" cy="105" r="16" fill="#D9CFC4"/></svg>');

// वास्तविक फोटो लोडर: मुख्य फोटो → सोही प्रकारको अर्को फोटो → picsum → प्लेसहोल्डर
export function Img({ src, fallback, alt = '', seed, className, ...rest }) {
  const [stage, setStage] = useState(0);
  const sources = [src, fallback, `https://picsum.photos/seed/${encodeURIComponent(seed || 'x')}/800/800`, placeholder()].filter(Boolean);
  return <img src={sources[Math.min(stage, sources.length - 1)]} alt={alt} loading="lazy" className={className}
    onError={() => setStage((s) => Math.min(s + 1, sources.length - 1))} {...rest} />;
}

export function Avatar({ user, size = 40 }) {
  if (!user) return null;
  return <span className="avatar" style={{ width: size, height: size, background: user.color, fontSize: size * 0.4 }} aria-hidden="true">
    {Array.from(user.nickname)[0]}
  </span>;
}

export function MannerTemp({ temp, compact }) {
  const c = tempColor(temp);
  if (compact) return <span className="temp-chip" style={{ color: c }}>{ne(temp.toFixed(1))}°C {tempFace(temp)}</span>;
  return (
    <div className="temp">
      <div className="temp-row"><strong style={{ color: c }}>{ne(temp.toFixed(1))}°C</strong><span className="temp-face">{tempFace(temp)}</span></div>
      <div className="temp-bar"><span style={{ width: `${Math.min(100, temp)}%`, background: c }} /></div>
      <small>भरोसा तापक्रम</small>
    </div>
  );
}

export function TopBar({ title, back, right, transparent }) {
  const { navigate } = useRouter();
  return (
    <header className={`topbar ${transparent ? 'is-clear' : ''}`}>
      {back && <button className="icon-btn" onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/'))} aria-label="पछाडि जानुहोस्"><IBack /></button>}
      <h1 className="topbar-title">{title}</h1>
      <div className="topbar-right">{right}</div>
    </header>
  );
}

export function StatusBadge({ status }) {
  if (status === 'selling') return null;
  return <span className={`badge badge-${status}`}>{STATUS[status]}</span>;
}

export function ProductCard({ p }) {
  const { likeCount } = useStore();
  const likes = likeCount(p);
  return (
    <Link to={`/products/${p.id}`} className={`pcard ${p.status === 'sold' ? 'is-sold' : ''}`}>
      <div className="pcard-img"><Img src={p.images[0]} fallback={p.fb} alt={p.title} seed={p.id} /></div>
      <div className="pcard-body">
        <h3 className="pcard-title">{p.title}</h3>
        <p className="meta">{p.region} · {p.bumpedAt ? `माथि ल्याइएको ${ago(p.bumpedAt)}` : ago(p.createdAt)}</p>
        <p className="pcard-price"><StatusBadge status={p.status} />{priceLabel(p)}</p>
        <div className="pcard-counts">
          {p.chatCount > 0 && <span><IChat size={15} />{ne(p.chatCount)}</span>}
          {likes > 0 && <span><IHeart size={15} />{ne(likes)}</span>}
        </div>
      </div>
    </Link>
  );
}

export function Empty({ icon = '🌱', title, desc, action }) {
  return <div className="empty"><div className="empty-icon">{icon}</div><p className="empty-title">{title}</p>{desc && <p className="meta">{desc}</p>}{action}</div>;
}

export function Sheet({ open, onClose, items, title }) {
  if (!open) return null;
  return (
    <div className="sheet-wrap" onClick={onClose} role="dialog" aria-modal="true">
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        {title && <p className="sheet-title">{title}</p>}
        <div className="sheet-group">
          {items.map((it) => (
            <button key={it.label} className={`sheet-item ${it.danger ? 'is-danger' : ''}`} onClick={() => { onClose(); it.onClick(); }}>{it.label}</button>
          ))}
        </div>
        <button className="sheet-item sheet-cancel" onClick={onClose}>बन्द गर्नुहोस्</button>
      </div>
    </div>
  );
}

export function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="sheet-wrap" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {title && <h2 className="modal-title">{title}</h2>}
        {children}
      </div>
    </div>
  );
}

export function Toast() {
  const { toast } = useStore();
  if (!toast) return null;
  return <div className="toast" key={toast.k} role="status">{toast.msg}</div>;
}

const NAV = [
  { to: '/', label: 'होम', Icon: IHome, match: (p) => p === '/' },
  { to: '/community', label: 'छिमेक', Icon: ICommunity, match: (p) => p.startsWith('/community') },
  { to: '/nearby', label: 'नजिकै', Icon: IMap, match: (p) => p.startsWith('/nearby') },
  { to: '/chats', label: 'च्याट', Icon: IChat, match: (p) => p.startsWith('/chats') },
  { to: '/my', label: 'मेरो', Icon: IUser, match: (p) => p.startsWith('/my') },
];

export function BottomNav() {
  const { pathname } = useRouter();
  const { state } = useStore();
  const unread = state.chats.reduce((n, c) => n + c.unread, 0);
  return (
    <nav className="bottomnav" aria-label="मुख्य मेनु">
      {NAV.map(({ to, label, Icon, match }) => (
        <Link key={to} to={to} className={`nav-item ${match(pathname) ? 'is-active' : ''}`} aria-current={match(pathname) ? 'page' : undefined}>
          <span className="nav-icon"><Icon size={24} />{to === '/chats' && unread > 0 && <i className="dot">{ne(unread)}</i>}</span>
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
}

export function Fab({ to, label = 'पोस्ट गर्नुहोस्' }) {
  return <Link to={to} className="fab"><IPlus size={22} /><span>{label}</span></Link>;
}

export function LikeButton({ id }) {
  const { isLiked, dispatch, showToast } = useStore();
  const on = isLiked(id);
  return (
    <button className={`like-btn ${on ? 'is-on' : ''}`} aria-pressed={on} aria-label="मनपर्ने"
      onClick={() => { dispatch({ type: 'TOGGLE_LIKE', id }); showToast(on ? 'मनपर्ने सूचीबाट हटाइयो' : 'मनपर्ने सूचीमा थपियो'); }}>
      <IHeart filled={on} size={26} />
    </button>
  );
}
