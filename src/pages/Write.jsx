import { useState } from 'react';
import { useStore } from '../store/Store';
import { useRouter } from '../store/router';
import { CATEGORIES, SAMPLE_PHOTOS } from '../data/mock';
import { TopBar, Img, Empty } from '../components/UI';
import { ICamera, IClose } from '../components/Icons';
import { fileToDataUrl, ne } from '../utils';

export default function Write({ editId }) {
  const { state, dispatch, addProduct, showToast } = useStore();
  const { navigate } = useRouter();
  const editing = editId ? state.products.find((p) => p.id === editId) : null;
  const [f, setF] = useState(() => editing ? {
    images: editing.images, title: editing.title, category: editing.category, nanum: editing.nanum,
    price: editing.price ? String(editing.price) : '', offerable: editing.offerable, desc: editing.desc, place: editing.place || '',
  } : { images: [], title: '', category: '', nanum: false, price: '', offerable: true, desc: '', place: '' });
  const [showSamples, setShowSamples] = useState(false);
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));

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

  const submit = () => {
    if (missing.length) { showToast(`${missing.join(', ')} भर्नुहोस्`); return; }
    const data = {
      title: f.title.trim(), category: f.category, nanum: f.nanum, price: f.nanum ? 0 : +f.price,
      offerable: f.nanum ? false : f.offerable, desc: f.desc.trim(), place: f.place.trim(),
      images: f.images.length ? f.images : [SAMPLE_PHOTOS[Math.floor(Math.random() * SAMPLE_PHOTOS.length)]],
    };
    if (editing) {
      dispatch({ type: 'UPDATE_PRODUCT', id: editing.id, patch: data });
      showToast('परिवर्तन सुरक्षित भयो');
      navigate(`/products/${editing.id}`, { replace: true });
    } else {
      const p = addProduct(data);
      showToast('पोस्ट प्रकाशित भयो');
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

        <label className="field"><span>भेट्ने ठाउँ</span>
          <input className="input" value={f.place} onChange={(e) => set('place', e.target.value)} placeholder="जस्तै: ठमेल चोक, नारायणहिटी गेट अगाडि" /></label>
      </div>
      <div className="actionbar"><button className="btn block" onClick={submit}>{editing ? 'सम्पादन सकियो' : 'पोस्ट गर्नुहोस्'}</button></div>
    </div>
  );
}
