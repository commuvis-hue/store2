import { t } from '../i18n';
import { useEffect, useRef, useState } from 'react';
import { useStore } from '../store/Store';
import { useRouter, Link } from '../store/router';
import { CATEGORIES, REPORT_REASONS, PRICES, HIGHLIGHT_DAYS, PREMIUM_CATEGORIES } from '../data/mock';
import { Img, Avatar, MannerTemp, TopBar, LikeButton, Sheet, Modal, Empty, StatusBadge, Tags, Checkout, useRequireLogin, isHighlighted } from '../components/UI';
import { IMore, IShare, IHome } from '../components/Icons';
import { ago, priceLabel, rs, STATUS, ne } from '../utils';

export default function ProductDetail({ id }) {
  const { state, dispatch, user, showToast, likeCount, openChat, send, pay, report: fileReport } = useStore();
  const requireLogin = useRequireLogin();
  const [shareOpen, setShareOpen] = useState(false);
  const [checkout, setCheckout] = useState(null);
  const { navigate } = useRouter();
  const p = state.products.find((x) => x.id === id);
  const [idx, setIdx] = useState(0);
  const [menu, setMenu] = useState(false);
  const [offer, setOffer] = useState(false);
  const [offerPrice, setOfferPrice] = useState('');
  const [soldPick, setSoldPick] = useState(false);
  const [report, setReport] = useState(false);
  const viewed = useRef(false);

  useEffect(() => { if (p && !viewed.current) { viewed.current = true; dispatch({ type: 'VIEW_PRODUCT', id }); } }, [p, id, dispatch]);

  if (!p) return <div className="page"><TopBar back title="" /><Empty icon="🫥" title={t('यो पोस्ट हटाइएको छ वा भेटिएन')} action={<Link to="/" className="btn">{t('होममा जानुहोस्')}</Link>} /></div>;

  const seller = user(p.sellerId);
  const mine = p.sellerId === 'me';
  const cat = CATEGORIES.find((c) => c.id === p.category);
  const others = state.products.filter((x) => x.sellerId === p.sellerId && x.id !== p.id).slice(0, 4);
  const similar = state.products.filter((x) => x.category === p.category && x.id !== p.id && x.sellerId !== p.sellerId).slice(0, 4);
  const buyers = state.chats.filter((c) => c.productId === p.id);

  const url = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `${t(p.title)} — ${priceLabel(p)} | ${t('छिमेकी बजार')} ${url}`;
  const shareItems = [
    { label: t('Viber मा पठाउनुहोस्'), onClick: () => window.open(`viber://forward?text=${encodeURIComponent(shareText)}`) },
    { label: t('WhatsApp मा पठाउनुहोस्'), onClick: () => window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank') },
    { label: t('लिङ्क कपी गर्नुहोस्'), onClick: async () => { try { await navigator.clipboard.writeText(url); showToast(t('लिङ्क कपी भयो')); } catch { showToast(t('कपी गर्न सकिएन')); } } },
    ...(typeof navigator !== 'undefined' && navigator.share ? [{ label: t('अन्य एपमा सेयर'), onClick: () => navigator.share({ title: p.title, url }).catch(() => {}) }] : []),
  ];

  // 끌어올리기: 하루 1회 무료, 이후 유료
  const today = new Date().toDateString();
  const freeBumpUsed = state.freeBumps[p.id] === today;
  const bump = () => {
    if (!freeBumpUsed) {
      dispatch({ type: 'FREE_BUMP', id: p.id, day: today });
      dispatch({ type: 'UPDATE_PRODUCT', id: p.id, patch: { bumpedAt: Date.now() } });
      showToast(t('आजको निःशुल्क माथि ल्याउने सुविधा प्रयोग भयो'));
      return;
    }
    setCheckout({ kind: 'bump', title: t('पोस्ट माथि ल्याउने (अतिरिक्त)'), amount: PRICES.bump });
  };
  const onPaid = (method, ref) => {
    const c = checkout;
    pay(c.kind, c.amount, method, ref);
    if (c.kind === 'bump') dispatch({ type: 'UPDATE_PRODUCT', id: p.id, patch: { bumpedAt: Date.now() } });
    if (c.kind === 'highlight') dispatch({ type: 'UPDATE_PRODUCT', id: p.id, patch: { highlightUntil: Date.now() + HIGHLIGHT_DAYS * 86400000, bumpedAt: Date.now() } });
    if (c.kind === 'premium') dispatch({ type: 'UPDATE_PRODUCT', id: p.id, patch: { premium: true, highlightUntil: Date.now() + 7 * 86400000 } });
    setCheckout(null);
    showToast(t('भुक्तानी सफल भयो ✓'));
  };

  const setStatus = (status) => {
    if (status === 'sold') { setSoldPick(true); return; }
    dispatch({ type: 'UPDATE_PRODUCT', id: p.id, patch: { status } });
    showToast(t('"{status}" मा परिवर्तन भयो', { status: STATUS[status] }));
  };

  const chat = () => requireLogin(() => {
    if (!state.me.verified) { showToast(t('च्याट गर्न पहिले टोल प्रमाणीकरण गर्नुहोस्')); navigate('/my/region'); return; }
    navigate(`/chats/${openChat(p)}`);
  });

  const sendOffer = () => {
    const n = +offerPrice;
    if (!n) return;
    const cid = openChat(p);
    send(cid, t('{price} मा दिन मिल्छ?', { price: rs(n) }), { kind: 'offer', amount: n, partnerId: p.sellerId });
    setOffer(false);
    navigate(`/chats/${cid}`);
  };

  const myMenu = [
    { label: t('पोस्ट सम्पादन'), onClick: () => navigate(`/products/${p.id}/edit`) },
    { label: freeBumpUsed ? t('माथि ल्याउनुहोस् ({price})', { price: rs(PRICES.bump) }) : t('माथि ल्याउनुहोस् (आज निःशुल्क)'), onClick: bump },
    { label: isHighlighted(p) ? t('⭐ विशेष पोस्ट सक्रिय छ') : t('⭐ विशेष पोस्ट बनाउनुहोस् — {days} दिन ({price})', { days: ne(HIGHLIGHT_DAYS), price: rs(PRICES.highlight) }), onClick: () => !isHighlighted(p) && setCheckout({ kind: 'highlight', title: `विशेष पोस्ट (${HIGHLIGHT_DAYS} दिन)`, amount: PRICES.highlight }) },
    ...(PREMIUM_CATEGORIES.includes(p.category) && !p.premium ? [{ label: t('प्रिमियम विज्ञापन — ७ दिन माथि ({price})', { price: rs(PRICES.premium) }), onClick: () => setCheckout({ kind: 'premium', title: t('प्रिमियम विज्ञापन (७ दिन)'), amount: PRICES.premium }) }] : []),
    { label: t('लुकाउनुहोस्'), onClick: () => { dispatch({ type: 'HIDE', id: p.id }); showToast(t('पोस्ट लुकाइयो')); } },
    { label: t('मेटाउनुहोस्'), danger: true, onClick: () => { if (confirm(t('यो पोस्ट मेटाउने?'))) { dispatch({ type: 'DELETE_PRODUCT', id: p.id }); showToast(t('पोस्ट मेटाइयो')); navigate('/', { replace: true }); } } },
  ];
  const otherMenu = [
    { label: t('यो पोस्ट लुकाउनुहोस्'), onClick: () => { dispatch({ type: 'HIDE', id: p.id }); showToast(t('यो पोस्ट अब होममा देखिँदैन')); navigate(-1); } },
    { label: t('रिपोर्ट गर्नुहोस्'), danger: true, onClick: () => setReport(true) },
    { label: t('{name} लाई ब्लक गर्नुहोस्', { name: seller.nickname }), danger: true, onClick: () => { dispatch({ type: 'BLOCK', userId: seller.id }); showToast(t('ब्लक गरियो। उहाँका पोस्ट अब देखिँदैनन्')); navigate('/'); } },
  ];

  return (
    <div className="page has-actionbar">
      <TopBar back transparent right={<>
        <Link to="/" className="icon-btn" aria-label={t('होम')}><IHome /></Link>
        <button className="icon-btn" onClick={() => setShareOpen(true)} aria-label={t('सेयर गर्नुहोस्')}><IShare /></button>
        <button className="icon-btn" onClick={() => setMenu(true)} aria-label={t('थप')}><IMore /></button>
      </>} />

      <div className="gallery">
        <div className="gallery-track" onScroll={(e) => setIdx(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}>
          {p.images.map((src, i) => <div className="gallery-slide" key={i}><Img src={src} fallback={p.fb} alt={t('{title} फोटो {n}', { title: t(p.title), n: ne(i + 1) })} seed={`${p.id}-${i}`} /></div>)}
        </div>
        {p.images.length > 1 && <div className="dots">{p.images.map((_, i) => <i key={i} className={i === idx ? 'is-on' : ''} />)}</div>}
      </div>

      <Link to={`/users/${seller.id}`} className="seller">
        <Avatar user={seller} size={44} />
        <div className="seller-info"><strong>{seller.nickname}</strong><span className="meta">{t(p.region)}</span></div>
        <MannerTemp temp={seller.temp} />
      </Link>

      <article className="pad detail">
        {mine && (
          <select className="status-select" value={p.status} onChange={(e) => setStatus(e.target.value)} aria-label={t('बिक्री अवस्था')}>
            {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        )}
        <h2 className="detail-title"><StatusBadge status={p.status} />{t(p.title)}</h2>
        <Tags p={p} />
        <p className="meta"><Link to={`/?cat=${p.category}`} className="underline">{t(cat?.name)}</Link> · {p.bumpedAt ? t('माथि ल्याइएको {when}', { when: ago(p.bumpedAt) }) : ago(p.createdAt)}</p>
        <p className="detail-desc">{t(p.desc)}</p>
        {p.category === 'vehicles' && (
          <div className="warn-box">🚦 <strong>{t('सवारी किन्नुअघि:')}</strong> {t('ब्लुबुक (सवारी दर्ता प्रमाणपत्र), कर र बीमा अद्यावधिक छ कि हेर्नुहोस्। नामसारी यातायात कार्यालयमा दुवै पक्ष उपस्थित भएर मात्र गर्नुहोस्। सामान नदेखी अग्रिम भुक्तानी नगर्नुहोस्।')}</div>
        )}
        {p.place && <p className="place">{t('📍 भेट्ने ठाउँ ·')} {t(p.place)}</p>}
        <p className="meta">{t('च्याट')} {ne(p.chatCount)} {t('· मनपर्ने')} {ne(likeCount(p))} {t('· हेरिएको')} {ne(p.views)}</p>
        {!mine && <button className="text-btn mt" onClick={() => setReport(true)}>{t('यो पोस्ट रिपोर्ट गर्नुहोस्')}</button>}
      </article>

      {others.length > 0 && (
        <section className="pad section">
          <div className="row-between"><h3 className="section-title">{seller.nickname} {t('का अन्य सामान')}</h3><Link to={`/users/${seller.id}`} className="text-btn">{t('सबै हेर्नुहोस्')}</Link></div>
          <div className="grid2">{others.map((x) => <MiniCard key={x.id} p={x} />)}</div>
        </section>
      )}
      {similar.length > 0 && (
        <section className="pad section">
          <h3 className="section-title">{t('यस्तै सामानहरू')}</h3>
          <div className="grid2">{similar.map((x) => <MiniCard key={x.id} p={x} />)}</div>
        </section>
      )}

      <div className="actionbar">
        <LikeButton id={p.id} />
        <div className="actionbar-price">
          <strong>{priceLabel(p)}</strong>
          {!mine && !p.nanum && (p.offerable
            ? <button className="text-btn strong" onClick={() => requireLogin(() => setOffer(true))}>{t('मूल्य प्रस्ताव गर्नुहोस्')}</button>
            : <span className="meta">{t('मूल्य मोलमोलाइ हुँदैन')}</span>)}
        </div>
        {mine
          ? <Link to="/chats" className="btn">{t('च्याटहरू')} {ne(buyers.length)}</Link>
          : <button className="btn" onClick={chat} disabled={p.status === 'sold'}>{p.status === 'sold' ? t('बिक्री सम्पन्न') : t('च्याट गर्नुहोस्')}</button>}
      </div>

      <Sheet open={menu} onClose={() => setMenu(false)} items={mine ? myMenu : otherMenu} />
      <Sheet open={shareOpen} onClose={() => setShareOpen(false)} title={t('छिमेकीलाई सेयर गर्नुहोस्')} items={shareItems} />
      <Checkout open={!!checkout} onClose={() => setCheckout(null)} title={checkout?.title} amount={checkout?.amount} onPaid={onPaid} />

      <Modal open={offer} onClose={() => setOffer(false)} title={t('मूल्य प्रस्ताव')}>
        <p className="meta">{t('बिक्री मूल्य')} {rs(p.price)}</p>
        <input className="input" inputMode="numeric" placeholder={t('तपाईंको प्रस्ताव (रू)')} value={offerPrice} onChange={(e) => setOfferPrice(e.target.value.replace(/\D/g, ''))} autoFocus />
        {offerPrice && <p className="meta">{rs(offerPrice)}</p>}
        <button className="btn block mt" onClick={sendOffer} disabled={!offerPrice}>{t('प्रस्ताव पठाउनुहोस्')}</button>
      </Modal>

      <Modal open={soldPick} onClose={() => setSoldPick(false)} title={t('कोसँग कारोबार भयो?')}>
        {buyers.length === 0 && <p className="meta">{t('कसैसँग च्याट भएको छैन। बिक्री सम्पन्न मात्र देखाइनेछ।')}</p>}
        <div className="pick-list">
          {buyers.map((c) => { const u = user(c.partnerId); return (
            <button key={c.id} className="pick" onClick={() => {
              dispatch({ type: 'UPDATE_PRODUCT', id: p.id, patch: { status: 'sold', buyerId: u.id } });
              setSoldPick(false); navigate(`/review/${u.id}?product=${p.id}`);
            }}><Avatar user={u} size={32} />{u.nickname}</button>); })}
        </div>
        <button className="btn ghost block mt" onClick={() => { dispatch({ type: 'UPDATE_PRODUCT', id: p.id, patch: { status: 'sold' } }); setSoldPick(false); showToast(t('बिक्री सम्पन्न भयो')); }}>
          {t('अन्यत्र बेचें')}
        </button>
      </Modal>

      <Modal open={report} onClose={() => setReport(false)} title={t('रिपोर्टको कारण छान्नुहोस्')}>
        <div className="pick-list">
          {REPORT_REASONS.map((r) => (
            <button key={r} className="pick" onClick={() => { setReport(false); fileReport('product', p.id, r); dispatch({ type: 'HIDE', id: p.id }); showToast(t('रिपोर्ट प्राप्त भयो। जाँच गरेर कारबाही गरिनेछ')); }}>{r}</button>
          ))}
        </div>
      </Modal>
    </div>
  );
}

export function MiniCard({ p }) {
  return (
    <Link to={`/products/${p.id}`} className="mini">
      <div className="mini-img"><Img src={p.images[0]} fallback={p.fb} alt={p.title} seed={p.id} /></div>
      <p className="mini-title">{t(p.title)}</p>
      <strong>{priceLabel(p)}</strong>
    </Link>
  );
}
