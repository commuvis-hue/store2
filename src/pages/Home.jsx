import { t } from '../i18n';
import { useMemo, useState } from 'react';
import { useStore } from '../store/Store';
import { useRouter, Link } from '../store/router';
import { CATEGORIES, AD_SLOTS, STORES, REGION_INFO } from '../data/mock';
import { ProductCard, Fab, Empty, Sheet, AdCard, isHighlighted, LangToggle } from '../components/UI';
import { ISearch, IBell, IDown, IMenu } from '../components/Icons';
import { ne } from '../utils';

export default function Home() {
  const { state, dispatch, showToast } = useStore();
  const { query, navigate } = useRouter();
  const cat = query.get('cat');
  const abroad = query.get('tag') === 'abroad';
  const [hideSold, setHideSold] = useState(false);
  const [regionSheet, setRegionSheet] = useState(false);
  const unreadNoti = state.notifications.filter((n) => !n.read).length;

  const list = useMemo(() => state.products
    .filter((p) => !state.hidden.includes(p.id) && !state.blocked.includes(p.sellerId))
    .filter((p) => !cat || p.category === cat)
    .filter((p) => !abroad || p.abroad)
    .filter((p) => !hideSold || p.status !== 'sold')
    // 유료 'विशेष' 게시물은 노출 기간 동안 위로
    .sort((a, b) => (Number(isHighlighted(b)) - Number(isHighlighted(a))) || ((b.bumpedAt || b.createdAt) - (a.bumpedAt || a.createdAt))),
  [state.products, state.hidden, state.blocked, cat, abroad, hideSold]);

  // 상품 6개마다 동네가게 광고 1개 (내가 집행 중인 광고 우선)
  const ads = [...state.myAds.filter((a) => a.active).map((a) => ({ id: a.id, storeId: 'mine', headline: a.headline, mine: a })), ...AD_SLOTS];
  const storeOf = (ad) => (ad.storeId === 'mine'
    ? { id: 'mine', name: state.business.shopName || t('मेरो पसल'), region: state.me.region, distance: t('नजिकै'), image: STORES[0].image }
    : STORES.find((x) => x.id === ad.storeId));
  const feed = [];
  list.forEach((p, i) => {
    feed.push(<ProductCard key={p.id} p={p} />);
    if ((i + 1) % 6 === 0 && ads.length) { const ad = ads[((i + 1) / 6 - 1) % ads.length]; feed.push(<AdCard key={`ad-${i}`} ad={ad} store={storeOf(ad)} />); }
  });
  const regionOpen = REGION_INFO[state.me.region]?.open !== false;

  const catName = CATEGORIES.find((c) => c.id === cat)?.name;

  return (
    <div className="page">
      <header className="topbar home-top">
        <button className="region-btn" onClick={() => setRegionSheet(true)}>{t(state.me.region)}<IDown size={18} /></button>
        <div className="topbar-right">
          <LangToggle compact />
          <Link to="/search" className="icon-btn" aria-label={t('खोज्नुहोस्')}><ISearch /></Link>
          <Link to="/categories" className="icon-btn" aria-label={t('वर्गहरू')}><IMenu /></Link>
          <Link to="/notifications" className="icon-btn" aria-label={t('सूचनाहरू')}><IBell />{unreadNoti > 0 && <i className="pip" />}</Link>
        </div>
      </header>

      {!regionOpen && (
        <div className="notice">
          <strong>{t(state.me.region)} {t('मा छिट्टै आउँदैछ')}</strong>
          <span className="meta">{t('अहिले काठमाडौं उपत्यकाका केही टोलमा मात्र सेवा छ। सूचना पाउन प्रतीक्षा सूचीमा नाम लेखाउनुहोस्।')}</span>
          <button className="btn sm" onClick={() => { dispatch({ type: 'WAITLIST', region: state.me.region }); showToast(t('प्रतीक्षा सूचीमा थपियो')); }} disabled={state.waitlist.includes(state.me.region)}>
            {state.waitlist.includes(state.me.region) ? t('सूचीमा छ ✓') : t('प्रतीक्षा सूचीमा थप्नुहोस्')}
          </button>
        </div>
      )}

      {!cat && !abroad && (
        <Link to="/?cat=fashion" className="festival">
          <span className="festival-art" aria-hidden="true">🪔</span>
          <span><strong>{t('दशैं–तिहार किनमेल')}</strong><br /><span className="meta">{t('छिमेकीले बेच्दै गरेका साडी, सल र उपहार हेर्नुहोस्')}</span></span>
        </Link>
      )}

      <div className="chips" role="toolbar" aria-label={t('वर्ग छान्नुहोस्')}>
        <button className={`chip ${!cat && !abroad ? 'is-on' : ''}`} onClick={() => navigate('/')}>{t('सबै')}</button>
        <button className={`chip ${abroad ? 'is-on' : ''}`} onClick={() => navigate('/?tag=abroad')}>{t('✈️ विदेश जाँदै सेल')}</button>
        {CATEGORIES.map((c) => (
          <button key={c.id} className={`chip ${cat === c.id ? 'is-on' : ''}`} onClick={() => navigate(`/?cat=${c.id}`)}>{c.icon} {t(c.name)}</button>
        ))}
      </div>

      <div className="list-tools">
        <span className="meta">{catName ? `${catName} · ` : abroad ? t('विदेश जाँदै सेल · ') : ''}{ne(list.length)} {t('वटा सामान')}</span>
        <label className="check"><input type="checkbox" checked={hideSold} onChange={(e) => setHideSold(e.target.checked)} />{t('उपलब्ध मात्र')}</label>
      </div>

      {list.length === 0
        ? <Empty title={t('यस वर्गमा अहिले कुनै सामान छैन')} desc={t('पहिलो सामान तपाईं नै राख्नुहोस्।')} />
        : <div className="plist">{feed}</div>}

      <Fab to="/write" />

      <Sheet open={regionSheet} onClose={() => setRegionSheet(false)} title={t('टोल छान्नुहोस्')}
        items={[
          ...state.me.regions.map((r) => ({ label: `${r === state.me.region ? '✓ ' : ''}${t(r)}`, onClick: () => { dispatch({ type: 'ME', patch: { region: r } }); showToast(t('{region} मा परिवर्तन भयो', { region: t(r) })); } })),
          { label: t('मेरो टोल सेटिङ'), onClick: () => navigate('/my/region') },
        ]} />
    </div>
  );
}
