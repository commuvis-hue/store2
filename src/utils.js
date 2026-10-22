import { t, isEn } from './i18n';

// 숫자: 네팔어 모드는 데바나가리 숫자, 영어 모드는 아라비아 숫자
const NE_DIGITS = '०१२३४५६७८९';
export const ne = (v) => (isEn() ? String(v) : String(v).replace(/\d/g, (d) => NE_DIGITS[d]));

// 루피, 라크 단위 쉼표: 1,50,000
export const rs = (n) => `${isEn() ? 'Rs.' : 'रू'} ${Number(n).toLocaleString('en-IN')}`;
export const priceLabel = (p) => (p.nanum ? t('निःशुल्क 🎁') : rs(p.price));
export function lakh(n) {
  const cur = isEn() ? 'Rs.' : 'रू';
  if (n >= 10000000) return `${cur} ${+(n / 10000000).toFixed(2)} ${isEn() ? 'crore' : 'करोड'}`;
  if (n >= 100000) return `${cur} ${+(n / 100000).toFixed(1)} ${isEn() ? 'lakh' : 'लाख'}`;
  return rs(n);
}

export function ago(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return t('भर्खरै');
  const m = Math.floor(s / 60); if (m < 60) return t('{n} मिनेट अघि', { n: ne(m) });
  const h = Math.floor(m / 60); if (h < 24) return t('{n} घण्टा अघि', { n: ne(h) });
  const d = Math.floor(h / 24); if (d < 7) return t('{n} दिन अघि', { n: ne(d) });
  if (d < 30) return t('{n} हप्ता अघि', { n: ne(Math.floor(d / 7)) });
  return dateLabel(ts);
}

export const clock = (ts) => {
  const d = new Date(ts); let h = d.getHours(); const m = String(d.getMinutes()).padStart(2, '0');
  if (isEn()) return `${h % 12 || 12}:${m} ${h < 12 ? 'AM' : 'PM'}`;
  const part = h < 4 ? 'राति' : h < 12 ? 'बिहान' : h < 17 ? 'दिउँसो' : h < 20 ? 'साँझ' : 'राति';
  h = h % 12 || 12;
  return `${part} ${ne(h)}:${ne(m)}`;
};

const MONTHS = ['जनवरी', 'फेब्रुअरी', 'मार्च', 'अप्रिल', 'मे', 'जुन', 'जुलाई', 'अगस्ट', 'सेप्टेम्बर', 'अक्टोबर', 'नोभेम्बर', 'डिसेम्बर'];
const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['आइतबार', 'सोमबार', 'मङ्गलबार', 'बुधबार', 'बिहीबार', 'शुक्रबार', 'शनिबार'];
const DAYS_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const dateLabel = (ts, withDay) => {
  const d = new Date(ts);
  if (isEn()) return `${withDay ? `${DAYS_EN[d.getDay()]}, ` : ''}${MONTHS_EN[d.getMonth()]} ${d.getDate()}`;
  return `${MONTHS[d.getMonth()]} ${ne(d.getDate())}${withDay ? `, ${DAYS[d.getDay()]}` : ''}`;
};

export function tempColor(v) {
  if (v < 30) return '#5C7CFA';
  if (v < 36.5) return '#4DABF7';
  if (v < 40) return '#2F9E44';
  if (v < 50) return '#E8A100';
  return '#E8590C';
}
export function tempFace(v) {
  if (v < 30) return '😟'; if (v < 36.5) return '🙂'; if (v < 40) return '😊'; if (v < 50) return '😄'; return '😆';
}

const STATUS_NE = { selling: 'बिक्रीमा', reserved: 'बुक भएको', sold: 'बिक्री सम्पन्न' };
// STATUS[k] 형태로 계속 쓸 수 있도록 언어에 따라 바뀌는 객체
export const STATUS = new Proxy(STATUS_NE, { get: (o, k) => (k in o ? t(o[k]) : undefined), ownKeys: (o) => Reflect.ownKeys(o), getOwnPropertyDescriptor: (o, k) => ({ ...Reflect.getOwnPropertyDescriptor(o, k), value: t(o[k]) }) });

export const fileToDataUrl = (file, max = 900) => new Promise((res, rej) => {
  const r = new FileReader();
  r.onerror = rej;
  r.onload = () => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = img.width * scale; c.height = img.height * scale;
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      res(c.toDataURL('image/jpeg', 0.8));
    };
    img.onerror = rej;
    img.src = r.result;
  };
  r.readAsDataURL(file);
});
