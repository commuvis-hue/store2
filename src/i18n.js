// 다국어: 네팔어(기본) ↔ 영어
// t('네팔어 원문', {변수}) → 영어 모드면 EN 사전의 번역, 없으면 원문 그대로
import { EN } from './i18n.en';

let LANG = 'ne';
export const LANGS = [{ id: 'ne', label: 'नेपाली' }, { id: 'en', label: 'English' }];
export const getLang = () => LANG;
export const setLang = (l) => {
  LANG = l === 'en' ? 'en' : 'ne';
  if (typeof document !== 'undefined') document.documentElement.lang = LANG;
};
export const isEn = () => LANG === 'en';

export function t(key, vars) {
  if (key == null) return key;
  let s = LANG === 'en' && Object.prototype.hasOwnProperty.call(EN, key) ? EN[key] : key;
  if (vars) s = s.replace(/\{(\w+)\}/g, (m, k) => (vars[k] != null ? vars[k] : m));
  return s;
}
