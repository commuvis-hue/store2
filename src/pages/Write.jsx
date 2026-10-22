import { useState } from 'react';
import { useStore } from '../store/Store';
import { useRouter } from '../store/router';
import { CATEGORIES, SAMPLE_PHOTOS, PROHIBITED, PRICES, PREMIUM_CATEGORIES, REGION_INFO } from '../data/mock';
import { TopBar, Img, Empty, Checkout } from '../components/UI';
import { Link } from '../store/router';
import { ICamera, IClose } from '../components/Icons';
import { fileToDataUrl, ne } from '../utils';

export default function Write({ editId }) {
  const { state, dispatch, addProduct, showToast, pay } = useStore();
  const [premiumFor, setPremiumFor] = useState(null);
  const { navigate } = useRouter();
  const editing = editId ? state.products.find((p) => p.id === editId) : null;
  const [f, setF] = useState(() => editing ? {
    images: editing.images, title: editing.title, category: editing.category, nanum: editing.nanum,
    price: editing.price ? String(editing.price) : '', offerable: editing.offerable, desc: editing.desc, place: editing.place || '', abroad: !!editing.abroad, wantPremium: false,
  } : { images: [], title: '', category: '', nanum: false, price: '', offerable: true, desc: '', place: '', abroad: false, wantPremium: false });
  const [showSamples, setShowSamples] = useState(false);
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));

  if (!state.auth.loggedIn) return (
    <div className="page"><TopBar back title="सामान बेच्नुहोस्" />
      <Empty icon="📱" title="पोस्ट गर्न लगइन चाहिन्छ" desc="मोबाइल नम्बर (+977) प्रमाणित गरेपछि मात्र सामान राख्न सकिन्छ। यसले नक्कली खाता र ठगी रोक्छ।"
        action={<Link to="/login?next=/write" className="btn mt">मोबाइल नम्बरबाट लगइन</Link>} />
    </div>
  );
  if (REGION_INFO[state.me.region]?.open === false) return (
    <div className="page"><TopBar back title="सामान बेच्नुहोस्" />
      <Empty icon="⏳" title={`${state.me.region} मा सेवा छिट्टै सुरु हुँदैछ`} desc="अहिले सेवा सुरु भएका टोलमा मात्र पोस्ट गर्न सकिन्छ।" action={<Link to="/my/region" className="btn mt">टोल परिवर्तन गर्नुहोस्</Link>} />
    </div>
  );
  if (editId && (!editing || editing.sellerId !== 'me')) return <div className="page"><TopBar back title="पोस्ट सम्पादन" /><Empty title="यो पोस्ट सम्पादन गर्न मिल्दैन" /></div>;

  const onFiles = async (e) => {
    const files = [...e.target.files].slice(0, 10 - f.images.length);
    const urls = await Promise.all(files.map((x) => fileToDataUrl(x)));
    set('images', [...f.images, ...urls]);
    e.target.value = '';
  };

  const missing = [];
  if (!f.title.trim()) missing.push('शीर्षक');
  if (!f.category) missing.push('वर्ग');
  if (!f.nanum && !f.price) missing.push('मूल्य');
  if (!f.desc.trim()) missing.push('विवरण');

  const banned = PROHIBITED.find((w) => `${f.title} ${f.desc}`.toLowerCase().includes(w.toLowerCase()));

  const submit = () => {
    if (missing.length) { showToast(`${missing.join(', ')} भर्नुहोस्`); return; }
    if (banned) { showToast(`"${banned}" जस्ता प्रतिबन्धित सामान राख्न पाइँदैन`); return; }
    const data = {
      title: f.title.trim(), category: f.category, nanum: f.nanum, price: f.nanum ? 0 : +f.price,
      offerable: f.nanum ? false : f.offerable, desc: f.desc.trim(), place: f.place.trim(), abroad: f.abroad,
      images: f.images.length ? f.images : [SAMPLE_PHOTOS[Math.floor(Math.random() * SAMPLE_PHOTOS.length)]],
    };
    if (editing) {
      dispatch({ type: 'UPDATE_PRODUCT', id: editing.id, patch: data });
      showToast('परिवर्तन सुरक्षित भयो');
      navigate(`/products/${editing.id}`, { replace: true });
    } else {
      const p = addProduct(data);
      showToast('पोस्ट प्रकाशित भयो');
      if (f.wantPremium && PREMIUM_CATEGORIES.includes(f.category)) { setPremiumFor(p.id); return; }
      navigate(`/products/${p.id}`, { replace: true });
    }
  };

  return (
    <div className="page has-actionbar">
      <TopBar back title={editing ? 'पोस्ट सम्पादन' : 'आफ्नो सामान बेच्नुहोस्'} />
      <div className="pad form">
        <div className="photo-row">
          <label className="photo-add">
            <ICamera /><span>{ne(f.images.length)}/१०</span>
            <input type="file" accept="image/*" multiple hidden onChange={onFiles} disabled={f.images.length >= 10} />
          </label>
          {f.images.map((src, i) => (
            <div className="photo-thumb" key={i}>
              <Img src={src} alt={`फोटो ${ne(i + 1)}`} seed={`w${i}`} />
              {i === 0 && <span className="photo-main">मुख्य फोटो</span>}
              <button className="photo-del" onClick={() => set('images', f.images.filter((_, j) => j !== i))} aria-label="फोटो हटाउनुहोस्"><IClose size={14} /></button>
            </div>
          ))}
        </div>
        <button className="text-btn" onClick={() => setShowSamples((v) => !v)}>{showSamples ? 'नमुना फोटो बन्द गर्नुहोस्' : 'परीक्षणका लागि नमुना फोटो छान्नुहोस्'}</button>
        {showSamples && (
          <div className="sample-row">
            {SAMPLE_PHOTOS.map((s) => <button key={s} className="sample" onClick={() => f.images.length < 10 && set('images', [...f.images, s])}><Img src={s} alt="नमुना फोटो" seed={s} /></button>)}
          </div>
        )}

        <label className="field"><span>शीर्षक</span>
          <input className="input" value={f.title} onChange={(e) => set('title', e.target.value)} placeholder="जस्तै: Honda Dio स्कुटर २०२२" maxLength={60} /></label>

        <label className="field"><span>वर्ग</span>
          <select className="input" value={f.category} onChange={(e) => set('category', e.target.value)}>
            <option value="">वर्ग छान्नुहोस्</option>{CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select></label>

        <div className="field"><span>कारोबारको प्रकार</span>
          <div className="seg">
            <button className={!f.nanum ? 'is-on' : ''} onClick={() => set('nanum', false)}>बेच्ने</button>
            <button className={f.nanum ? 'is-on' : ''} onClick={() => set('nanum', true)}>निःशुल्क दिने</button>
          </div>
        </div>

        {!f.nanum && <>
          <label className="field"><span>मूल्य</span>
            <div className="input-wrap"><span>रू</span><input className="input" inputMode="numeric" value={f.price ? Number(f.price).toLocaleString('en-IN') : ''} onChange={(e) => set('price', e.target.value.replace(/\D/g, ''))} placeholder="मूल्य लेख्नुहोस्" /></div></label>
          <label className="check"><input type="checkbox" checked={f.offerable} onChange={(e) => set('offerable', e.target.checked)} />मूल्य प्रस्ताव स्वीकार गर्ने</label>
        </>}

        <label className="field"><span>विस्तृत विवरण</span>
          <textarea className="input" rows={7} value={f.desc} onChange={(e) => set('desc', e.target.value)}
            placeholder={`${state.me.region} का छिमेकीका लागि सामानको अवस्था, किनेको मिति, बिल/वारेन्टी आदि लेख्नुहोस्।\n\nप्रतिबन्धित सामान राख्न पाइँदैन।`} /></label>

        {banned && <div className="warn-box">⛔ "{banned}" प्रतिबन्धित सामानको सूचीमा पर्छ। औषधि, हतियार, लागूपदार्थ र वन्यजन्तुका अङ्ग बेच्न पाइँदैन।</div>}

        <label className="check"><input type="checkbox" checked={f.abroad} onChange={(e) => set('abroad', e.target.checked)} />✈️ विदेश जाँदै/घर सर्दै सबै सामान बेच्दैछु (विदेश जाँदै सेलमा देखिन्छ)</label>

        {!editing && PREMIUM_CATEGORIES.includes(f.category) && (
          <label className="check premium-opt"><input type="checkbox" checked={f.wantPremium} onChange={(e) => set('wantPremium', e.target.checked)} />
            प्रिमियम विज्ञापन: ७ दिनसम्म सूचीको माथि र "प्रिमियम" चिन्ह (रू {PRICES.premium})</label>
        )}

        <label className="field"><span>भेट्ने ठाउँ</span>
          <input className="input" value={f.place} onChange={(e) => set('place', e.target.value)} placeholder="जस्तै: ठमेल चोक, नारायणहिटी गेट अगाडि" /></label>
      </div>
      <Checkout open={!!premiumFor} title="प्रिमियम विज्ञापन (७ दिन)" amount={PRICES.premium}
        onClose={() => { const id = premiumFor; setPremiumFor(null); navigate(`/products/${id}`, { replace: true }); }}
        onPaid={(method, ref) => {
          pay('premium', PRICES.premium, method, ref);
          dispatch({ type: 'UPDATE_PRODUCT', id: premiumFor, patch: { premium: true, highlightUntil: Date.now() + 7 * 86400000 } });
          const id = premiumFor; setPremiumFor(null); showToast('प्रिमियम विज्ञापन सक्रिय भयो ✓'); navigate(`/products/${id}`, { replace: true });
        }} />
      <div className="actionbar"><button className="btn block" onClick={submit}>{editing ? 'सम्पादन सकियो' : 'पोस्ट गर्नुहोस्'}</button></div>
    </div>
  );
}
