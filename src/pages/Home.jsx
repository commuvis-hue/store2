import { useMemo, useState } from 'react';
import { useStore } from '../store/Store';
import { useRouter, Link } from '../store/router';
import { CATEGORIES } from '../data/mock';
import { ProductCard, Fab, Empty, Sheet } from '../components/UI';
import { ISearch, IBell, IDown, IMenu } from '../components/Icons';
import { ne } from '../utils';

export default function Home() {
  const { state, dispatch, showToast } = useStore();
  const { query, navigate } = useRouter();
  const cat = query.get('cat');
  const [hideSold, setHideSold] = useState(false);
  const [regionSheet, setRegionSheet] = useState(false);
  const unreadNoti = state.notifications.filter((n) => !n.read).length;

  const list = useMemo(() => state.products
    .filter((p) => !state.hidden.includes(p.id) && !state.blocked.includes(p.sellerId))
    .filter((p) => !cat || p.category === cat)
    .filter((p) => !hideSold || p.status !== 'sold')
    .sort((a, b) => (b.bumpedAt || b.createdAt) - (a.bumpedAt || a.createdAt)),
  [state.products, state.hidden, state.blocked, cat, hideSold]);

  const catName = CATEGORIES.find((c) => c.id === cat)?.name;

  return (
    <div className="page">
      <header className="topbar home-top">
        <button className="region-btn" onClick={() => setRegionSheet(true)}>{state.me.region}<IDown size={18} /></button>
        <div className="topbar-right">
          <Link to="/search" className="icon-btn" aria-label="खोज्नुहोस्"><ISearch /></Link>
          <Link to="/categories" className="icon-btn" aria-label="वर्गहरू"><IMenu /></Link>
          <Link to="/notifications" className="icon-btn" aria-label="सूचनाहरू"><IBell />{unreadNoti > 0 && <i className="pip" />}</Link>
        </div>
      </header>

      {!cat && (
        <Link to="/?cat=fashion" className="festival">
          <span className="festival-art" aria-hidden="true">🪔</span>
          <span><strong>दशैं–तिहार किनमेल</strong><br /><span className="meta">छिमेकीले बेच्दै गरेका साडी, सल र उपहार हेर्नुहोस्</span></span>
        </Link>
      )}

      <div className="chips" role="toolbar" aria-label="वर्ग छान्नुहोस्">
        <button className={`chip ${!cat ? 'is-on' : ''}`} onClick={() => navigate('/')}>सबै</button>
        {CATEGORIES.map((c) => (
          <button key={c.id} className={`chip ${cat === c.id ? 'is-on' : ''}`} onClick={() => navigate(`/?cat=${c.id}`)}>{c.icon} {c.name}</button>
        ))}
      </div>

      <div className="list-tools">
        <span className="meta">{catName ? `${catName} · ` : ''}{ne(list.length)} वटा सामान</span>
        <label className="check"><input type="checkbox" checked={hideSold} onChange={(e) => setHideSold(e.target.checked)} />उपलब्ध मात्र</label>
      </div>

      {list.length === 0
        ? <Empty title="यस वर्गमा अहिले कुनै सामान छैन" desc="पहिलो सामान तपाईं नै राख्नुहोस्।" />
        : <div className="plist">{list.map((p) => <ProductCard key={p.id} p={p} />)}</div>}

      <Fab to="/write" />

      <Sheet open={regionSheet} onClose={() => setRegionSheet(false)} title="टोल छान्नुहोस्"
        items={[
          ...state.me.regions.map((r) => ({ label: `${r === state.me.region ? '✓ ' : ''}${r}`, onClick: () => { dispatch({ type: 'ME', patch: { region: r } }); showToast(`${r} मा परिवर्तन भयो`); } })),
          { label: 'मेरो टोल सेटिङ', onClick: () => navigate('/my/region') },
        ]} />
    </div>
  );
}
