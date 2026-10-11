// नेपाली अङ्क र मूल्य ढाँचा
const NE_DIGITS = '०१२३४५६७८९';
export const ne = (v) => String(v).replace(/\d/g, (d) => NE_DIGITS[d]);

// लाख/करोड समूहमा: 1,50,000
export const rs = (n) => `रू ${Number(n).toLocaleString('en-IN')}`;
export const priceLabel = (p) => (p.nanum ? 'निःशुल्क 🎁' : rs(p.price));
export function lakh(n) {
  if (n >= 10000000) return `रू ${+(n / 10000000).toFixed(2)} करोड`;
  if (n >= 100000) return `रू ${+(n / 100000).toFixed(1)} लाख`;
  return rs(n);
}

export function ago(t) {
  const s = Math.floor((Date.now() - t) / 1000);
  if (s < 60) return 'भर्खरै';
  const m = Math.floor(s / 60); if (m < 60) return `${ne(m)} मिनेट अघि`;
  const h = Math.floor(m / 60); if (h < 24) return `${ne(h)} घण्टा अघि`;
  const d = Math.floor(h / 24); if (d < 7) return `${ne(d)} दिन अघि`;
  if (d < 30) return `${ne(Math.floor(d / 7))} हप्ता अघि`;
  return dateLabel(t);
}

export const clock = (t) => {
  const d = new Date(t); let h = d.getHours(); const m = String(d.getMinutes()).padStart(2, '0');
  const part = h < 4 ? 'राति' : h < 12 ? 'बिहान' : h < 17 ? 'दिउँसो' : h < 20 ? 'साँझ' : 'राति';
  h = h % 12 || 12;
  return `${part} ${ne(h)}:${ne(m)}`;
};

const MONTHS = ['जनवरी', 'फेब्रुअरी', 'मार्च', 'अप्रिल', 'मे', 'जुन', 'जुलाई', 'अगस्ट', 'सेप्टेम्बर', 'अक्टोबर', 'नोभेम्बर', 'डिसेम्बर'];
const DAYS = ['आइतबार', 'सोमबार', 'मङ्गलबार', 'बुधबार', 'बिहीबार', 'शुक्रबार', 'शनिबार'];
export const dateLabel = (t, withDay) => {
  const d = new Date(t);
  return `${MONTHS[d.getMonth()]} ${ne(d.getDate())}${withDay ? `, ${DAYS[d.getDay()]}` : ''}`;
};

export function tempColor(t) {
  if (t < 30) return '#5C7CFA';
  if (t < 36.5) return '#4DABF7';
  if (t < 40) return '#2F9E44';
  if (t < 50) return '#E8A100';
  return '#E8590C';
}
export function tempFace(t) {
  if (t < 30) return '😟'; if (t < 36.5) return '🙂'; if (t < 40) return '😊'; if (t < 50) return '😄'; return '😆';
}

export const STATUS = { selling: 'बिक्रीमा', reserved: 'बुक भएको', sold: 'बिक्री सम्पन्न' };

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
