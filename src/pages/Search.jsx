import { t } from '../i18n';
import { useMemo, useState } from 'react';
import { useStore } from '../store/Store';
import { useRouter } from '../store/router';
import { ProductCard, Empty } from '../components/UI';
import { IBack, IClose } from '../components/Icons';
import { CATEGORIES, POPULAR_SEARCHES, ROMAN_MAP } from '../data/mock';

const SORTS = { recent: t('नयाँ पहिले'), low: t('सस्तो पहिले'), high: t('महँगो पहिले'), popular: t('लोकप्रिय') };

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
    const term2 = (term ?? q).trim();
    if (!term2) return;
    setQ(term2); setDone(term2);
    dispatch({ type: 'SEARCHED', q: term2 });
    navigate(`/search?q=${encodeURIComponent(term2)}`, { replace: true });
  };

  const results = useMemo(() => {
    if (!done) return [];
    const qq = done.toLowerCase().trim();
    // 로마자 네팔어·영어 → 데바나가리 키워드도 함께 검색 (예: scooter → स्कुटर)
    const terms = [qq, ROMAN_MAP[qq], ...qq.split(/\s+/).map((w) => ROMAN_MAP[w])].filter(Boolean).map((x) => x.toLowerCase());
    const hit = (p) => terms.some((x) => p.title.toLowerCase().includes(x) || p.desc.toLowerCase().includes(x) || (x === 'निःशुल्क' && p.nanum) || (x === 'विदेश' && p.abroad));
    let r = state.products.filter((p) => !state.hidden.includes(p.id) && hit(p));
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
        <button className="icon-btn" onClick={() => navigate(-1)} aria-label={t('पछाडि जानुहोस्')}><IBack /></button>
        <form className="search-field" onSubmit={(e) => { e.preventDefault(); submit(); }}>
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('{region} नजिक खोज्नुहोस्', { region: t(state.me.region) })} aria-label={t('खोज शब्द')} />
          {q && <button type="button" className="icon-btn sm" onClick={() => { setQ(''); setDone(''); }} aria-label={t('मेटाउनुहोस्')}><IClose size={18} /></button>}
        </form>
      </header>

      {!done ? (
        <section className="pad">
          <div className="row-between"><h2 className="section-title">{t('हालैका खोजहरू')}</h2>
            {state.recentSearches.length > 0 && <button className="text-btn" onClick={() => dispatch({ type: 'CLEAR_SEARCHES' })}>{t('सबै मेटाउनुहोस्')}</button>}</div>
          {state.recentSearches.length === 0 ? <p className="meta">{t('हालै केही खोज्नुभएको छैन।')}</p> :
            <div className="tag-wrap">{state.recentSearches.map((s) => <button key={s} className="tag" onClick={() => submit(s)}>{s}</button>)}</div>}
          <p className="meta mt">{t('रोमन अक्षरमा पनि खोज्न सकिन्छ:')} <em>scooter, saree, momo, kotha</em></p>
          <h2 className="section-title mt">{t('धेरै खोजिएका')}</h2>
          <div className="tag-wrap">{POPULAR_SEARCHES.map((s) => <button key={s} className="tag" onClick={() => submit(s)}>{t(s)}</button>)}</div>
        </section>
      ) : (
        <>
          <div className="filters">
            <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label={t('क्रम')}>{Object.entries(SORTS).map(([k, v]) => <option key={k} value={k}>{t(v)}</option>)}</select>
            <select value={cat} onChange={(e) => setCat(e.target.value)} aria-label={t('वर्ग')}><option value="">{t('सबै वर्ग')}</option>{CATEGORIES.map((c) => <option key={c.id} value={c.id}>{t(c.name)}</option>)}</select>
            <input inputMode="numeric" placeholder={t('न्यूनतम रू')} value={min} onChange={(e) => setMin(e.target.value.replace(/\D/g, ''))} aria-label={t('न्यूनतम मूल्य')} />
            <input inputMode="numeric" placeholder={t('अधिकतम रू')} value={max} onChange={(e) => setMax(e.target.value.replace(/\D/g, ''))} aria-label={t('अधिकतम मूल्य')} />
            <label className="check"><input type="checkbox" checked={onlySelling} onChange={(e) => setOnlySelling(e.target.checked)} />{t('उपलब्ध मात्र')}</label>
          </div>
          <div className="keyword-cta">
            <span>"{done}{t('" को नयाँ पोस्ट आउँदा सूचना चाहिन्छ?')}</span>
            <button className="text-btn strong" onClick={() => { dispatch({ type: 'ADD_KEYWORD', k: done }); showToast(t('"{k}" किवर्डको सूचना पाउनुहुनेछ', { k: done })); }}>
              {state.keywords.includes(done) ? t('सूचना सक्रिय छ') : t('सूचना पाउनुहोस्')}
            </button>
          </div>
          {results.length === 0
            ? <Empty icon="🔍" title={t('"{q}" भेटिएन', { q: done })} desc={t('फिल्टर हटाएर वा अर्को शब्दले खोज्नुहोस्।')} />
            : <div className="plist">{results.map((p) => <ProductCard key={p.id} p={p} />)}</div>}
        </>
      )}
    </div>
  );
}
