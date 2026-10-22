import { t } from '../i18n';
import { useState } from 'react';
import { useStore } from '../store/Store';
import { STORES, JOBS, HOMES, CARS } from '../data/mock';
import { Img, Modal } from '../components/UI';
import { IStar } from '../components/Icons';
import { ago, lakh, ne } from '../utils';

const TABS = [
  { id: 'stores', label: t('पसलहरू'), icon: '🏪' },
  { id: 'jobs', label: t('काम/जागिर'), icon: '💼' },
  { id: 'homes', label: t('घर/कोठा'), icon: '🏠' },
  { id: 'cars', label: t('गाडी'), icon: '🚗' },
];
const CTA = { store: t('नियमित ग्राहक बन्नुहोस्'), job: t('आवेदन दिनुहोस्'), home: t('सोधपुछ गर्नुहोस्'), car: t('सोधपुछ गर्नुहोस्') };
const DONE = { store: t('नियमित ग्राहक सूचीमा थपियो'), job: t('आवेदन पठाइयो'), home: t('सोधपुछ पठाइयो'), car: t('बिक्रेतालाई सोधपुछ पठाइयो') };

export default function Nearby() {
  const { state, showToast } = useStore();
  const [tab, setTab] = useState('stores');
  const [detail, setDetail] = useState(null);
  const [saved, setSaved] = useState([]);
  const toggleSave = (id) => setSaved((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <div className="page">
      <header className="topbar"><h1 className="topbar-title left">{t('मेरो नजिकै')}</h1><span className="meta">{t(state.me.region)} {t('वरपर')}</span></header>

      <div className="map-card">
        <svg viewBox="0 0 400 160" preserveAspectRatio="xMidYMid slice" role="img" aria-label={t('{region} वरपरको नक्सा', { region: t(state.me.region) })}>
          <rect width="400" height="160" fill="#EFE9E1" />
          <path d="M0 132 C70 118 120 150 200 136 S330 112 400 124 V160 H0z" fill="#CFE0EA" />
          <path d="M0 40 L60 18 L110 34 L170 8 L230 30 L290 4 L350 26 L400 12 V0 H0z" fill="#E2DBD1" />
          <path d="M150 8 l20 -8 l20 8z M270 4 l20 -8 l20 8z" fill="#fff" opacity=".8" />
          <g stroke="#fff" strokeWidth="7" fill="none"><path d="M0 70 C120 60 260 84 400 66" /><path d="M120 30 V160" /><path d="M290 30 L262 160" /></g>
          <g stroke="#fff" strokeWidth="3" fill="none"><path d="M40 40 V160" /><path d="M205 40 V125" /><path d="M350 40 V115" /><path d="M0 104 H400" /></g>
          {[[155, 60, '☕'], [232, 82, '🥟'], [318, 58, '🍛'], [92, 92, '💼'], [182, 108, '🏠']].map(([x, y, e], i) => (
            <g key={i} transform={`translate(${x} ${y})`}><circle r="13" fill="#fff" stroke="#B3261E" strokeWidth="2" /><text textAnchor="middle" dy="5" fontSize="13">{e}</text></g>
          ))}
          <g transform="translate(205 78)"><circle r="9" fill="#B3261E" opacity=".25" /><circle r="5" fill="#B3261E" /></g>
        </svg>
      </div>

      <div className="tabs" role="tablist">
        {TABS.map((x) => <button key={x.id} role="tab" aria-selected={tab === x.id} className={`tab ${tab === x.id ? 'is-on' : ''}`} onClick={() => setTab(x.id)}>{x.icon} {t(x.label)}</button>)}
      </div>

      {tab === 'stores' && <div className="rows">{STORES.map((s) => (
        <button key={s.id} className="row-card" onClick={() => setDetail({ kind: 'store', ...s })}>
          <div className="row-img"><Img src={s.image} alt={s.name} seed={s.id} /></div>
          <div className="row-body">
            <strong>{t(s.name)}</strong>
            <p className="meta">{t(s.category)} · {t(s.region)} · {t(s.distance)}</p>
            <p className="rating"><IStar size={14} /> {ne(s.rating)} <span className="meta">{t('समीक्षा')} {ne(s.reviews)}</span></p>
            {s.coupon && <span className="coupon">🎟️ {t(s.coupon)}</span>}
          </div>
        </button>))}</div>}

      {tab === 'jobs' && <div className="rows">{JOBS.map((j) => (
        <button key={j.id} className="row-card" onClick={() => setDetail({ kind: 'job', ...j })}>
          <div className="row-body">
            <strong>{t(j.title)}</strong>
            <p className="meta">{t(j.place)} · {t(j.region)} · {ago(j.createdAt)}</p>
            <p className="pay">{t(j.pay)}</p><p className="meta">{t(j.schedule)}</p>
          </div>
        </button>))}</div>}

      {tab === 'homes' && <div className="rows">{HOMES.map((h) => (
        <button key={h.id} className="row-card" onClick={() => setDetail({ kind: 'home', ...h })}>
          <div className="row-img"><Img src={h.image} alt={h.type} seed={h.id} /></div>
          <div className="row-body">
            <strong>{t(h.deal)} · {t(h.price)}</strong>
            <p>{t(h.type)} · {t(h.floor)}</p>
            <p className="meta">{t(h.size)} · {t(h.region)} · {ago(h.createdAt)}</p>
          </div>
        </button>))}</div>}

      {tab === 'cars' && <div className="rows">{CARS.map((c) => (
        <button key={c.id} className="row-card" onClick={() => setDetail({ kind: 'car', ...c })}>
          <div className="row-img"><Img src={c.image} alt={c.title} seed={c.id} /></div>
          <div className="row-body">
            <strong>{t(c.title)}</strong>
            <p className="meta">{t(c.km)} · {t(c.fuel)} · {t(c.region)}</p>
            <p className="pay">{lakh(c.price)}</p>
          </div>
        </button>))}</div>}

      <Modal open={!!detail} onClose={() => setDetail(null)} title={detail?.name || detail?.title || detail?.type}>
        {detail?.image && <div className="modal-img"><Img src={detail.image} alt="" seed={detail.id} /></div>}
        {detail?.kind === 'store' && <><p>{t(detail.desc)}</p><p className="meta">{t(detail.distance)} {t('· समीक्षा')} {ne(detail.reviews)}</p></>}
        {detail?.kind === 'job' && <><p className="pay">{t(detail.pay)}</p><p>{t(detail.schedule)}</p><p className="meta">{t(detail.place)} · {t(detail.region)}</p></>}
        {detail?.kind === 'home' && <><p className="pay">{t(detail.deal)} · {t(detail.price)}</p><p>{t(detail.floor)} · {t(detail.size)}</p><p className="meta">{t(detail.region)}</p></>}
        {detail?.kind === 'car' && <><p className="pay">{lakh(detail.price)}</p><p>{t(detail.km)} · {t(detail.fuel)}</p><p className="meta">{t('ब्लुबुक र नामसारी कागजात जाँच गरेर मात्र कारोबार गर्नुहोस्।')}</p></>}
        {detail && <div className="modal-actions">
          <button className="btn ghost" onClick={() => { toggleSave(detail.id); showToast(saved.includes(detail.id) ? t('सुरक्षित सूचीबाट हटाइयो') : t('सुरक्षित गरियो')); }}>
            {saved.includes(detail.id) ? t('सुरक्षित छ') : t('सुरक्षित गर्नुहोस्')}
          </button>
          <button className="btn" onClick={() => { showToast(t(DONE[detail.kind])); setDetail(null); }}>{t(CTA[detail.kind])}</button>
        </div>}
      </Modal>
    </div>
  );
}
