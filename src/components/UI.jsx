import { t, LANGS, getLang } from '../i18n';
import { useState } from 'react';
import { useRouter, Link } from '../store/router';
import { useStore } from '../store/Store';
import { tempColor, tempFace, priceLabel, ago, STATUS, ne, rs } from '../utils';
import { IBack, IHeart, IChat, IHome, ICommunity, IMap, IUser, IPlus } from './Icons';
import { PAY_METHODS } from '../data/mock';

const placeholder = () =>
  'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"><rect width="300" height="300" fill="#F1ECE6"/><path d="M60 210l55-70 35 40 30-30 60 60z" fill="#D9CFC4"/><circle cx="200" cy="105" r="16" fill="#D9CFC4"/></svg>');

// वास्तविक फोटो लोडर: मुख्य फोटो → सोही प्रकारको अर्को फोटो → picsum → प्लेसहोल्डर
// 데이터 절약 모드: 사진을 저해상도(320px)로 요청
const liteUrl = (url) => (typeof url === 'string' && url.includes('unsplash.com') ? url.replace(/w=\d+/, 'w=320').replace('q=75', 'q=50') : url);

export function Img({ src, fallback, alt = '', seed, className, ...rest }) {
  const [stage, setStage] = useState(0);
  const store = useStore();
  const lite = store?.state.settings?.lite;
  const size = lite ? 320 : 800;
  const sources = [src, fallback, `https://picsum.photos/seed/${encodeURIComponent(seed || 'x')}/${size}/${size}`, placeholder()].filter(Boolean).map((x) => (lite ? liteUrl(x) : x));
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
      <small>{t('भरोसा तापक्रम')}</small>
    </div>
  );
}

export function TopBar({ title, back, right, transparent }) {
  const { navigate } = useRouter();
  return (
    <header className={`topbar ${transparent ? 'is-clear' : ''}`}>
      {back && <button className="icon-btn" onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/'))} aria-label={t('पछाडि जानुहोस्')}><IBack /></button>}
      <h1 className="topbar-title">{t(title)}</h1>
      <div className="topbar-right">{right}</div>
    </header>
  );
}

export function StatusBadge({ status }) {
  if (status === 'selling') return null;
  return <span className={`badge badge-${status}`}>{STATUS[status]}</span>;
}

export const isHighlighted = (p) => Boolean(p.highlightUntil && p.highlightUntil > Date.now());

export function Tags({ p }) {
  const { user } = useStore();
  const seller = user(p.sellerId);
  return (
    <span className="tags">
      {isHighlighted(p) && <span className="tag-mini tag-hl">{t('⭐ विशेष')}</span>}
      {p.premium && <span className="tag-mini tag-premium">{t('प्रिमियम')}</span>}
      {p.abroad && <span className="tag-mini tag-abroad">{t('✈️ विदेश जाँदै')}</span>}
      {seller?.business && <span className="tag-mini tag-biz">{t('व्यापारी')}</span>}
    </span>
  );
}

export function ProductCard({ p }) {
  const { likeCount } = useStore();
  const likes = likeCount(p);
  return (
    <Link to={`/products/${p.id}`} className={`pcard ${p.status === 'sold' ? 'is-sold' : ''} ${isHighlighted(p) ? 'is-hl' : ''}`}>
      <div className="pcard-img"><Img src={p.images[0]} fallback={p.fb} alt={p.title} seed={p.id} /></div>
      <div className="pcard-body">
        <h3 className="pcard-title">{t(p.title)}</h3>
        <Tags p={p} />
        <p className="meta">{t(p.region)} · {p.bumpedAt ? t('माथि ल्याइएको {when}', { when: ago(p.bumpedAt) }) : ago(p.createdAt)}</p>
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
  return <div className="empty"><div className="empty-icon">{icon}</div><p className="empty-title">{t(title)}</p>{desc && <p className="meta">{t(desc)}</p>}{action}</div>;
}

export function Sheet({ open, onClose, items, title }) {
  if (!open) return null;
  return (
    <div className="sheet-wrap" onClick={onClose} role="dialog" aria-modal="true">
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        {title && <p className="sheet-title">{t(title)}</p>}
        <div className="sheet-group">
          {items.map((it) => (
            <button key={it.label} className={`sheet-item ${it.danger ? 'is-danger' : ''}`} onClick={() => { onClose(); it.onClick(); }}>{t(it.label)}</button>
          ))}
        </div>
        <button className="sheet-item sheet-cancel" onClick={onClose}>{t('बन्द गर्नुहोस्')}</button>
      </div>
    </div>
  );
}

export function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="sheet-wrap" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {title && <h2 className="modal-title">{t(title)}</h2>}
        {children}
      </div>
    </div>
  );
}

export function Toast() {
  const { toast } = useStore();
  if (!toast) return null;
  return <div className="toast" key={toast.k} role="status">{t(toast.msg)}</div>;
}

const NAV = [
  { to: '/', label: t('होम'), Icon: IHome, match: (p) => p === '/' },
  { to: '/community', label: t('छिमेक'), Icon: ICommunity, match: (p) => p.startsWith('/community') },
  { to: '/nearby', label: t('नजिकै'), Icon: IMap, match: (p) => p.startsWith('/nearby') },
  { to: '/chats', label: t('च्याट'), Icon: IChat, match: (p) => p.startsWith('/chats') },
  { to: '/my', label: t('मेरो'), Icon: IUser, match: (p) => p.startsWith('/my') },
];

export function BottomNav() {
  const { pathname } = useRouter();
  const { state } = useStore();
  const unread = state.chats.reduce((n, c) => n + c.unread, 0);
  return (
    <nav className="bottomnav" aria-label={t('मुख्य मेनु')}>
      {NAV.map(({ to, label, Icon, match }) => (
        <Link key={to} to={to} className={`nav-item ${match(pathname) ? 'is-active' : ''}`} aria-current={match(pathname) ? 'page' : undefined}>
          <span className="nav-icon"><Icon size={24} />{to === '/chats' && unread > 0 && <i className="dot">{ne(unread)}</i>}</span>
          <span>{t(label)}</span>
        </Link>
      ))}
    </nav>
  );
}

export function Fab({ to, label }) {
  return <Link to={to} className="fab"><IPlus size={22} /><span>{label ? t(label) : t('पोस्ट गर्नुहोस्')}</span></Link>;
}

export function LikeButton({ id }) {
  const { isLiked, dispatch, showToast } = useStore();
  const on = isLiked(id);
  return (
    <button className={`like-btn ${on ? 'is-on' : ''}`} aria-pressed={on} aria-label={t('मनपर्ने')}
      onClick={() => { dispatch({ type: 'TOGGLE_LIKE', id }); showToast(on ? t('मनपर्ने सूचीबाट हटाइयो') : t('मनपर्ने सूचीमा थपियो')); }}>
      <IHeart filled={on} size={26} />
    </button>
  );
}

// ───────── v2 ─────────

// 피드 안 동네가게 광고
export function AdCard({ ad, store }) {
  return (
    <Link to={`/stores/${store.id}`} className="adcard">
      <div className="pcard-img"><Img src={store.image} alt={store.name} seed={store.id} /></div>
      <div className="pcard-body">
        <span className="ad-label">{t('प्रायोजित · छिमेकी पसल')}</span>
        <h3 className="pcard-title">{t(ad.headline)}</h3>
        <p className="meta">{t(store.name)} · {t(store.region)} · {t(store.distance)}</p>
        <span className="coupon">{t('🎟️ कुपन हेर्नुहोस्')}</span>
      </div>
    </Link>
  );
}

// 결제창 (데모). 실서비스에서는 eSewa/Khalti/Fonepay 게이트웨이로 교체
export function Checkout({ open, onClose, title, amount, onPaid }) {
  const [method, setMethod] = useState('esewa');
  const [busy, setBusy] = useState(false);
  if (!open) return null;
  const go = () => {
    setBusy(true);
    setTimeout(() => { setBusy(false); onPaid(method, `TXN${Date.now().toString(36).toUpperCase()}`); }, 1200);
  };
  return (
    <Modal open={open} onClose={busy ? () => {} : onClose} title={t('भुक्तानी')}>
      <div className="pay-summary"><span>{t(title)}</span><strong>{rs(amount)}</strong></div>
      <div className="pay-methods" role="radiogroup" aria-label={t('भुक्तानी माध्यम')}>
        {PAY_METHODS.map((m) => (
          <button key={m.id} role="radio" aria-checked={method === m.id} className={`pay-method ${method === m.id ? 'is-on' : ''}`} onClick={() => setMethod(m.id)}>
            <span className="pay-dot" style={{ background: m.color }} />{t(m.name)}
          </button>
        ))}
      </div>
      <p className="meta mt">{t('डेमो भुक्तानी हो — वास्तविक पैसा काटिँदैन।')}</p>
      <button className="btn block mt" onClick={go} disabled={busy}>{busy ? t('प्रक्रियामा…') : t('{amount} तिर्नुहोस्', { amount: rs(amount) })}</button>
    </Modal>
  );
}

// 로그인이 필요한 동작 앞에 사용
export function useRequireLogin() {
  const { state, showToast } = useStore();
  const { navigate, pathname } = useRouter();
  return (fn) => {
    if (!state.auth.loggedIn) { showToast(t('पहिले मोबाइल नम्बरबाट लगइन गर्नुहोस्')); navigate(`/login?next=${encodeURIComponent(pathname)}`); return; }
    fn();
  };
}

// 언어 선택 (네팔어 기본 / 영어)
export function LangToggle({ compact }) {
  const { dispatch } = useStore();
  const cur = getLang();
  if (compact) {
    const next = cur === 'ne' ? 'en' : 'ne';
    return (
      <button className="lang-chip" onClick={() => dispatch({ type: 'SETTINGS', patch: { lang: next } })} aria-label={cur === 'ne' ? 'Switch to English' : 'नेपालीमा हेर्नुहोस्'}>
        {cur === 'ne' ? 'EN' : 'ने'}
      </button>
    );
  }
  return (
    <div className="seg lang-seg" role="radiogroup" aria-label="Language / भाषा">
      {LANGS.map((l) => (
        <button key={l.id} role="radio" aria-checked={cur === l.id} className={cur === l.id ? 'is-on' : ''} onClick={() => dispatch({ type: 'SETTINGS', patch: { lang: l.id } })}>{l.label}</button>
      ))}
    </div>
  );
}
