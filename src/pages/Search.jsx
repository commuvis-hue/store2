import { useMemo, useState } from 'react';
import { useStore } from '../store/Store';
import { useRouter } from '../store/router';
import { ProductCard, Empty } from '../components/UI';
import { IBack, IClose } from '../components/Icons';
import { CATEGORIES, POPULAR_SEARCHES } from '../data/mock';

const SORTS = { recent: 'नयाँ पहिले', low: 'सस्तो पहिले', high: 'महँगो पहिले', popular: 'लोकप्रिय' };

export default function Search() {
  const { state, dispatch, showToast } = useStore();
  const { query, navigate } = useRouter();
  const [q, setQ] = useState(query.get('q') || '');
  const [done, setDone] = useState(query.get('q') || '');
  const [sort, setSort] = useState('recent');
  const [cat, setCat] = useState('');
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');
  const [onlySelling, setOnlySelling] = useState(true);

  const submit = (term) => {
    const t = (term ?? q).trim();
    if (!t) return;
    setQ(t); setDone(t);
    dispatch({ type: 'SEARCHED', q: t });
    navigate(`/search?q=${encodeURIComponent(t)}`, { replace: true });
  };

  const results = useMemo(() => {
    if (!done) return [];
    const t = done.toLowerCase();
    let r = state.products.filter((p) => !state.hidden.includes(p.id) && (p.title.toLowerCase().includes(t) || p.desc.toLowerCase().includes(t) || (t === 'निःशुल्क' && p.nanum)));
    if (cat) r = r.filter((p) => p.category === cat);
    if (onlySelling) r = r.filter((p) => p.status !== 'sold');
    if (min) r = r.filter((p) => p.price >= +min);
    if (max) r = r.filter((p) => p.price <= +max);
    const by = { recent: (a, b) => b.createdAt - a.createdAt, low: (a, b) => a.price - b.price, high: (a, b) => b.price - a.price, popular: (a, b) => b.baseLikes + b.chatCount - (a.baseLikes + a.chatCount) };
    return [...r].sort(by[sort]);
  }, [done, state.products, state.hidden, cat, onlySelling, min, max, sort]);

  return (
    <div className="page">
      <header className="topbar search-top">
        <button className="icon-btn" onClick={() => navigate(-1)} aria-label="पछाडि जानुहोस्"><IBack /></button>
        <form className="search-field" onSubmit={(e) => { e.preventDefault(); submit(); }}>
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder={`${state.me.region} नजिक खोज्नुहोस्`} aria-label="खोज शब्द" />
          {q && <button type="button" className="icon-btn sm" onClick={() => { setQ(''); setDone(''); }} aria-label="मेटाउनुहोस्"><IClose size={18} /></button>}
        </form>
      </header>

      {!done ? (
        <section className="pad">
          <div className="row-between"><h2 className="section-title">हालैका खोजहरू</h2>
            {state.recentSearches.length > 0 && <button className="text-btn" onClick={() => dispatch({ type: 'CLEAR_SEARCHES' })}>सबै मेटाउनुहोस्</button>}</div>
          {state.recentSearches.length === 0 ? <p className="meta">हालै केही खोज्नुभएको छैन।</p> :
            <div className="tag-wrap">{state.recentSearches.map((s) => <button key={s} className="tag" onClick={() => submit(s)}>{s}</button>)}</div>}
          <h2 className="section-title mt">धेरै खोजिएका</h2>
          <div className="tag-wrap">{POPULAR_SEARCHES.map((s) => <button key={s} className="tag" onClick={() => submit(s)}>{s}</button>)}</div>
        </section>
      ) : (
        <>
          <div className="filters">
            <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="क्रम">{Object.entries(SORTS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
            <select value={cat} onChange={(e) => setCat(e.target.value)} aria-label="वर्ग"><option value="">सबै वर्ग</option>{CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
            <input inputMode="numeric" placeholder="न्यूनतम रू" value={min} onChange={(e) => setMin(e.target.value.replace(/\D/g, ''))} aria-label="न्यूनतम मूल्य" />
            <input inputMode="numeric" placeholder="अधिकतम रू" value={max} onChange={(e) => setMax(e.target.value.replace(/\D/g, ''))} aria-label="अधिकतम मूल्य" />
            <label className="check"><input type="checkbox" checked={onlySelling} onChange={(e) => setOnlySelling(e.target.checked)} />उपलब्ध मात्र</label>
          </div>
          <div className="keyword-cta">
            <span>"{done}" को नयाँ पोस्ट आउँदा सूचना चाहिन्छ?</span>
            <button className="text-btn strong" onClick={() => { dispatch({ type: 'ADD_KEYWORD', k: done }); showToast(`"${done}" किवर्डको सूचना पाउनुहुनेछ`); }}>
              {state.keywords.includes(done) ? 'सूचना सक्रिय छ' : 'सूचना पाउनुहोस्'}
            </button>
          </div>
          {results.length === 0
            ? <Empty icon="🔍" title={`"${done}" भेटिएन`} desc="फिल्टर हटाएर वा अर्को शब्दले खोज्नुहोस्।" />
            : <div className="plist">{results.map((p) => <ProductCard key={p.id} p={p} />)}</div>}
        </>
      )}
    </div>
  );
}
