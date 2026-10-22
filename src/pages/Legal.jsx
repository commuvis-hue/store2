import { t, isEn } from '../i18n';
import { useState } from 'react';
import { useStore } from '../store/Store';
import { TopBar } from '../components/UI';
import { COMPANY, PROHIBITED } from '../data/mock';

// 주의: 아래 약관·정책 문구는 초안입니다. 출시 전 네팔 현지 변호사 검토가 필요합니다.
const DOCS = {
  terms: {
    title: t('सेवाका सर्त'),
    body: [
      ['सेवा', 'छिमेकी बजार छिमेकीबीच पुराना सामान किनबेच, छिमेकका कुरा र स्थानीय पसलको जानकारी आदानप्रदान गर्ने प्लेटफर्म हो। किनबेच प्रयोगकर्ताबीच सिधै हुन्छ।'],
      ['खाता', 'एउटा मोबाइल नम्बरबाट एउटा खाता मात्र खोल्न सकिन्छ। गलत जानकारी दिएमा वा अरूको नाममा खाता खोलेमा खाता बन्द गरिन्छ।'],
      ['प्रयोगकर्ताको जिम्मेवारी', 'सामानको विवरण सही राख्नुपर्छ। प्रतिबन्धित सामान र चोरीको सामान बेच्न पाइँदैन। कानुन विपरीत कारोबारको जिम्मेवारी सम्बन्धित प्रयोगकर्ताको हुन्छ।'],
      ['सशुल्क सेवा', 'विशेष पोस्ट, प्रिमियम विज्ञापन, व्यापारिक खाता र टोल विज्ञापन सशुल्क सेवा हुन्। भुक्तानी स्वीकृत भुक्तानी माध्यमबाट मात्र लिइन्छ।'],
      ['विवाद', 'प्रयोगकर्ताबीचको विवादमा हामी गुनासो सुन्ने र मध्यस्थता गर्ने प्रयास गर्छौं। समाधान नभए सम्बन्धित निकायमा पठाइन्छ।'],
    ],
  },
  privacy: {
    title: t('गोपनीयता नीति'),
    body: [
      ['सङ्कलन गरिने जानकारी', 'मोबाइल नम्बर, उपनाम, टोल, तपाईंले राखेका पोस्ट र च्याट, टोल प्रमाणीकरणका लागि अनुमानित स्थान।'],
      ['प्रयोग', 'खाता प्रमाणीकरण, ठगी रोकथाम, नजिकका सामान देखाउन र गुनासो समाधान गर्न मात्र प्रयोग गरिन्छ।'],
      ['सुरक्षा', 'व्यक्तिगत जानकारी इन्क्रिप्ट गरेर राखिन्छ। मोबाइल नम्बर अरू प्रयोगकर्तालाई देखाइँदैन।'],
      ['तपाईंको अधिकार', 'आफ्नो जानकारी हेर्न, सच्याउन र खाता मेटाउन अनुरोध गर्न सक्नुहुन्छ।'],
    ],
  },
  rules: {
    title: t('समुदायका नियम'),
    body: [
      ['सम्मानजनक व्यवहार', 'गाली, घृणा फैलाउने, जात/धर्म/लिङ्गका आधारमा अपमान गर्ने सामग्री राख्न पाइँदैन।'],
      ['प्रतिबन्धित सामान', 'औषधि, हतियार, लागूपदार्थ, वन्यजन्तुका अङ्ग, नक्कली नोट आदि। स्वचालित फिल्टरले रोक्ने शब्दका केही उदाहरण: {ex}।'],
      ['ठगीबाट बच्नुहोस्', 'सामान नदेखी eSewa/Khalti मा अग्रिम भुक्तानी नगर्नुहोस्। सार्वजनिक ठाउँमा दिउँसो भेट्नुहोस्।'],
      ['व्यापारी', 'नियमित रूपमा धेरै सामान बेच्नुहुन्छ भने व्यापारिक खाता प्रयोग गर्नुहोस्।'],
      ['कारबाही', 'रिपोर्ट आएको सामग्री २ घण्टाभित्र जाँच गरिन्छ। नियम उल्लङ्घनमा पोस्ट हटाउने वा खाता बन्द गर्ने कारबाही हुन्छ।'],
    ],
  },
};

export function LegalDoc({ kind }) {
  const d = DOCS[kind];
  if (!d) return null;
  return (
    <div className="page"><TopBar back title={d.title} />
      <article className="pad legal">
        {d.body.map(([h, body], i) => <section key={h}><h3>{i + 1}. {t(h)}</h3><p>{t(body, { ex: (isEn() ? PROHIBITED.filter((w) => /[a-z]/.test(w)) : PROHIBITED).slice(0, 8).join(', ') })}</p></section>)}
        <p className="meta mt">{t('यो मस्यौदा हो। सेवा सुरु गर्नुअघि कानुनी परामर्श लिएर अद्यावधिक गरिनेछ।')}</p>
      </article>
      <CompanyInfo />
    </div>
  );
}

// 전자상거래법상 사업자 정보 표시
export function CompanyInfo() {
  return (
    <footer className="company">
      <strong>{t(COMPANY.name)}</strong>
      <span>{t(COMPANY.address)}</span>
      <span>{t(COMPANY.reg)} · {t(COMPANY.pan)}</span>
      <span>{t(COMPANY.ecom)}</span>
      <span>{t('गुनासो:')} {COMPANY.email} · {COMPANY.phone}</span>
    </footer>
  );
}

// 고객센터 + 온라인 민원 접수
export function Help() {
  const { state, dispatch, uid, showToast } = useStore();
  const [type, setType] = useState('');
  const [text, setText] = useState('');
  const [done, setDone] = useState(null);
  const FAQ = [
    ['ठगी भयो भने के गर्ने?', 'च्याट र भुक्तानीको स्क्रिनसट राखेर तल गुनासो दर्ता गर्नुहोस्। आवश्यक परे नजिकको प्रहरी कार्यालयमा पनि उजुरी दिनुहोस्।'],
    ['टोल प्रमाणीकरण किन चाहिन्छ?', 'नजिकका वास्तविक छिमेकीसँग मात्र किनबेच होस् र ठगी कम होस् भनेर।'],
    ['सशुल्क सेवाको पैसा फिर्ता पाइन्छ?', 'भुक्तानी भएर पनि सेवा सक्रिय नभएमा ७ दिनभित्र फिर्ता गरिन्छ।'],
  ];
  return (
    <div className="page"><TopBar back title={t('सहायता र गुनासो')} />
      <section className="pad">
        <h3 className="section-title">{t('बारम्बार सोधिने प्रश्न')}</h3>
        {FAQ.map(([q, a]) => <details key={q} className="faq"><summary>{t(q)}</summary><p>{t(a)}</p></details>)}
      </section>
      <section className="pad section form">
        <h3 className="section-title">{t('गुनासो दर्ता')}</h3>
        {done ? <div className="coupon-box"><p><strong>{t('गुनासो दर्ता भयो ✓')}</strong></p><p>{t('सन्दर्भ नं.')} <strong>{done}</strong></p><p className="meta">{t('३ कार्यदिनभित्र जवाफ दिइनेछ।')}</p></div> : <>
          <select className="input" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">{t('गुनासोको प्रकार छान्नुहोस्')}</option>
            {['ठगी/धोखा', 'भुक्तानी समस्या', 'खाता समस्या', 'अनुचित सामग्री', 'अन्य'].map((x) => <option key={x} value={x}>{t(x)}</option>)}
          </select>
          <textarea className="input" rows={5} value={text} onChange={(e) => setText(e.target.value)} placeholder={t('के भयो, कहिले भयो, सम्बन्धित पोस्ट वा प्रयोगकर्ता — सकेसम्म विस्तृत लेख्नुहोस्।')} />
          <button className="btn block" disabled={!type || text.trim().length < 10} onClick={() => {
            const id = uid('g').toUpperCase();
            dispatch({ type: 'REPORT', report: { id, kind: 'grievance', reason: type, text: text.trim(), by: state.auth.phone || 'guest' } });
            setDone(id); showToast(t('गुनासो दर्ता भयो'));
          }}>{t('गुनासो पठाउनुहोस्')}</button>
        </>}
      </section>
      <CompanyInfo />
    </div>
  );
}
