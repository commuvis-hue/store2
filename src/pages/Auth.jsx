import { t } from '../i18n';
import { useState } from 'react';
import { useStore } from '../store/Store';
import { useRouter, Link } from '../store/router';
import { REGIONS, REGION_INFO } from '../data/mock';
import { TopBar, LangToggle } from '../components/UI';
import { ne } from '../utils';

// +977 मोबाइल OTP लगइन (डेमो). वास्तविक सेवामा SMS गेटवे (Sparrow SMS, Aakash SMS आदि) जोड्नुहोस्।
export default function Login() {
  const { state, dispatch, showToast } = useStore();
  const { query, navigate } = useRouter();
  const next = query.get('next') || '/';
  const [step, setStep] = useState(state.auth.loggedIn ? 'done' : 'phone');
  const [phone, setPhone] = useState('');
  const [sent, setSent] = useState('');
  const [code, setCode] = useState('');
  const [nick, setNick] = useState(state.me.nickname === 'नयाँ छिमेकी' ? '' : state.me.nickname);
  const [region, setRegion] = useState(REGION_INFO[state.me.region]?.open ? state.me.region : t('ठमेल'));
  const [agree, setAgree] = useState(false);

  const validPhone = /^9[78]\d{8}$/.test(phone);

  const sendOtp = () => {
    const c = String(Math.floor(100000 + Math.random() * 900000));
    setSent(c); setStep('otp');
    showToast(t('डेमो OTP: {code}', { code: c }));
  };

  if (step === 'done') return (
    <div className="page"><TopBar back title={t('लगइन')} />
      <div className="pad"><p className="lead">{t('तपाईं +977')} {state.auth.phone} {t('बाट लगइन हुनुहुन्छ।')}</p>
        <Link to="/" className="btn block mt">{t('होममा जानुहोस्')}</Link></div>
    </div>
  );

  return (
    <div className="page"><TopBar back title={t('लगइन / दर्ता')} right={<LangToggle compact />} />
      <div className="pad form">
        <div className="auth-hero"><span aria-hidden="true">🏘️</span><p className="lead">{t('छिमेकी बजारमा स्वागत छ')}</p><p className="meta">{t('आफ्नै टोलका प्रमाणित छिमेकीसँग भरोसामा किनबेच गर्नुहोस्।')}</p></div>

        {step === 'phone' && <>
          <label className="field"><span>{t('मोबाइल नम्बर')}</span>
            <div className="input-wrap"><span>+977</span>
              <input className="input" inputMode="numeric" maxLength={10} value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} placeholder="98XXXXXXXX" autoFocus /></div></label>
          {phone.length === 10 && !validPhone && <p className="meta err">{t('९७ वा ९८ बाट सुरु हुने १० अङ्कको नम्बर लेख्नुहोस्।')}</p>}
          <button className="btn block" disabled={!validPhone} onClick={sendOtp}>{t('OTP पठाउनुहोस्')}</button>
          <p className="meta">{t('एउटा नम्बरबाट एउटा मात्र खाता खोल्न सकिन्छ। तपाईंको नम्बर अरू प्रयोगकर्तालाई देखाइँदैन।')}</p>
        </>}

        {step === 'otp' && <>
          <p>+977 {phone} {t('मा पठाइएको ६ अङ्कको कोड लेख्नुहोस्।')}</p>
          <div className="demo-otp">{t('डेमो OTP:')} <strong>{sent}</strong></div>
          <input className="input otp" inputMode="numeric" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} placeholder="______" autoFocus aria-label={t('OTP कोड')} />
          <button className="btn block" disabled={code.length !== 6} onClick={() => (code === sent ? setStep('profile') : showToast(t('कोड मिलेन, फेरि प्रयास गर्नुहोस्')))}>{t('प्रमाणित गर्नुहोस्')}</button>
          <button className="text-btn" onClick={sendOtp}>{t('कोड फेरि पठाउनुहोस्')}</button>
        </>}

        {step === 'profile' && <>
          <label className="field"><span>{t('उपनाम')}</span><input className="input" value={nick} onChange={(e) => setNick(e.target.value)} maxLength={16} placeholder={t('जस्तै: पाटनको_दिदी')} /></label>
          <div className="field"><span>{t('मेरो टोल')}</span>
            <div className="tag-wrap">{REGIONS.map((r) => {
              const open = REGION_INFO[r]?.open !== false;
              return <button key={r} className={`tag ${region === r ? 'is-on' : ''}`} disabled={!open} onClick={() => setRegion(r)}>{t(r)}{!open && ` · ${t('छिट्टै')}`}</button>;
            })}</div>
            <p className="meta">{t('पहिलो चरणमा काठमाडौं उपत्यकाका केही टोलमा मात्र सेवा सुरु भएको छ।')}</p>
          </div>
          <label className="check"><input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
            <span><Link to="/legal/terms" className="underline">{t('सेवाका सर्त')}</Link>, <Link to="/legal/privacy" className="underline">{t('गोपनीयता नीति')}</Link> {t('र')} <Link to="/legal/rules" className="underline">{t('समुदायका नियम')}</Link> {t('स्वीकार गर्छु।')}</span></label>
          <button className="btn block" disabled={nick.trim().length < 2 || !agree} onClick={() => {
            dispatch({ type: 'LOGIN', phone, patch: { nickname: nick.trim(), region, regions: [region] } });
            showToast(t('स्वागत छ! अब टोल प्रमाणीकरण गर्नुहोस्'));
            navigate(next === '/' ? '/my/region' : next, { replace: true });
          }}>{t('सुरु गर्नुहोस्')}</button>
        </>}

        <p className="meta center">{t('चरण')} {ne(step === 'phone' ? 1 : step === 'otp' ? 2 : 3)}{t('/३')}</p>
      </div>
    </div>
  );
}
