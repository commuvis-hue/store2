import { useState } from 'react';
import { useStore } from '../store/Store';
import { STORES, JOBS, HOMES, CARS } from '../data/mock';
import { Img, Modal } from '../components/UI';
import { IStar } from '../components/Icons';
import { ago, lakh, ne } from '../utils';

const TABS = [
  { id: 'stores', label: 'पसलहरू', icon: '🏪' },
  { id: 'jobs', label: 'काम/जागिर', icon: '💼' },
  { id: 'homes', label: 'घर/कोठा', icon: '🏠' },
  { id: 'cars', label: 'गाडी', icon: '🚗' },
];
const CTA = { store: 'नियमित ग्राहक बन्नुहोस्', job: 'आवेदन दिनुहोस्', home: 'सोधपुछ गर्नुहोस्', car: 'सोधपुछ गर्नुहोस्' };
const DONE = { store: 'नियमित ग्राहक सूचीमा थपियो', job: 'आवेदन पठाइयो', home: 'सोधपुछ पठाइयो', car: 'बिक्रेतालाई सोधपुछ पठाइयो' };

export default function Nearby() {
  const { state, showToast } = useStore();
  const [tab, setTab] = useState('stores');
  const [detail, setDetail] = useState(null);
  const [saved, setSaved] = useState([]);
  const toggleSave = (id) => setSaved((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <div className="page">
      <header className="topbar"><h1 className="topbar-title left">मेरो नजिकै</h1><span className="meta">{state.me.region} वरपर</span></header>

      <div className="map-card">
        <svg viewBox="0 0 400 160" preserveAspectRatio="xMidYMid slice" role="img" aria-label={`${state.me.region} वरपरको नक्सा`}>
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
        {TABS.map((t) => <button key={t.id} role="tab" aria-selected={tab === t.id} className={`tab ${tab === t.id ? 'is-on' : ''}`} onClick={() => setTab(t.id)}>{t.icon} {t.label}</button>)}
      </div>

      {tab === 'stores' && <div className="rows">{STORES.map((s) => (
        <button key={s.id} className="row-card" onClick={() => setDetail({ kind: 'store', ...s })}>
          <div className="row-img"><Img src={s.image} alt={s.name} seed={s.id} /></div>
          <div className="row-body">
            <strong>{s.name}</strong>
            <p className="meta">{s.category} · {s.region} · {s.distance}</p>
            <p className="rating"><IStar size={14} /> {ne(s.rating)} <span className="meta">समीक्षा {ne(s.reviews)}</span></p>
            {s.coupon && <span className="coupon">🎟️ {s.coupon}</span>}
          </div>
        </button>))}</div>}

      {tab === 'jobs' && <div className="rows">{JOBS.map((j) => (
        <button key={j.id} className="row-card" onClick={() => setDetail({ kind: 'job', ...j })}>
          <div className="row-body">
            <strong>{j.title}</strong>
            <p className="meta">{j.place} · {j.region} · {ago(j.createdAt)}</p>
            <p className="pay">{j.pay}</p><p className="meta">{j.schedule}</p>
          </div>
        </button>))}</div>}

      {tab === 'homes' && <div className="rows">{HOMES.map((h) => (
        <button key={h.id} className="row-card" onClick={() => setDetail({ kind: 'home', ...h })}>
          <div className="row-img"><Img src={h.image} alt={h.type} seed={h.id} /></div>
          <div className="row-body">
            <strong>{h.deal} · {h.price}</strong>
            <p>{h.type} · {h.floor}</p>
            <p className="meta">{h.size} · {h.region} · {ago(h.createdAt)}</p>
          </div>
        </button>))}</div>}

      {tab === 'cars' && <div className="rows">{CARS.map((c) => (
        <button key={c.id} className="row-card" onClick={() => setDetail({ kind: 'car', ...c })}>
          <div className="row-img"><Img src={c.image} alt={c.title} seed={c.id} /></div>
          <div className="row-body">
            <strong>{c.title}</strong>
            <p className="meta">{c.km} · {c.fuel} · {c.region}</p>
            <p className="pay">{lakh(c.price)}</p>
          </div>
        </button>))}</div>}

      <Modal open={!!detail} onClose={() => setDetail(null)} title={detail?.name || detail?.title || detail?.type}>
        {detail?.image && <div className="modal-img"><Img src={detail.image} alt="" seed={detail.id} /></div>}
        {detail?.kind === 'store' && <><p>{detail.desc}</p><p className="meta">{detail.distance} · समीक्षा {ne(detail.reviews)}</p></>}
        {detail?.kind === 'job' && <><p className="pay">{detail.pay}</p><p>{detail.schedule}</p><p className="meta">{detail.place} · {detail.region}</p></>}
        {detail?.kind === 'home' && <><p className="pay">{detail.deal} · {detail.price}</p><p>{detail.floor} · {detail.size}</p><p className="meta">{detail.region}</p></>}
        {detail?.kind === 'car' && <><p className="pay">{lakh(detail.price)}</p><p>{detail.km} · {detail.fuel}</p><p className="meta">ब्लुबुक र नामसारी कागजात जाँच गरेर मात्र कारोबार गर्नुहोस्।</p></>}
        {detail && <div className="modal-actions">
          <button className="btn ghost" onClick={() => { toggleSave(detail.id); showToast(saved.includes(detail.id) ? 'सुरक्षित सूचीबाट हटाइयो' : 'सुरक्षित गरियो'); }}>
            {saved.includes(detail.id) ? 'सुरक्षित छ' : 'सुरक्षित गर्नुहोस्'}
          </button>
          <button className="btn" onClick={() => { showToast(DONE[detail.kind]); setDetail(null); }}>{CTA[detail.kind]}</button>
        </div>}
      </Modal>
    </div>
  );
}
