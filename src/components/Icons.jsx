const S = ({ children, size = 24, fill = 'none', ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>{children}</svg>
);
export const IHome = (p) => <S {...p}><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" /></S>;
export const ICommunity = (p) => <S {...p}><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 8h8M8 12h8M8 16h5" /></S>;
export const IMap = (p) => <S {...p}><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></S>;
export const IChat = (p) => <S {...p}><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" /></S>;
export const IUser = (p) => <S {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></S>;
export const ISearch = (p) => <S {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></S>;
export const IBell = (p) => <S {...p}><path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8M10 21h4" /></S>;
export const IMenu = (p) => <S {...p}><path d="M4 6h16M4 12h16M4 18h16" /></S>;
export const IBack = (p) => <S {...p}><path d="m15 5-7 7 7 7" /></S>;
export const IMore = (p) => <S {...p}><circle cx="12" cy="5" r="1" fill="currentColor" /><circle cx="12" cy="12" r="1" fill="currentColor" /><circle cx="12" cy="19" r="1" fill="currentColor" /></S>;
export const IHeart = ({ filled, ...p }) => <S fill={filled ? 'currentColor' : 'none'} {...p}><path d="M12 20s-7.5-4.6-9.2-9.3C1.6 7.3 4 4 7.3 4c2 0 3.6 1.1 4.7 2.8C13.1 5.1 14.7 4 16.7 4 20 4 22.4 7.3 21.2 10.7 19.5 15.4 12 20 12 20z" /></S>;
export const IPlus = (p) => <S {...p}><path d="M12 5v14M5 12h14" /></S>;
export const IClose = (p) => <S {...p}><path d="M6 6l12 12M18 6 6 18" /></S>;
export const ICamera = (p) => <S {...p}><path d="M4 8h3l2-3h6l2 3h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></S>;
export const ISend = (p) => <S {...p}><path d="M4 12 20 4l-6 16-3-7z" /></S>;
export const IChevron = (p) => <S {...p}><path d="m9 6 6 6-6 6" /></S>;
export const IDown = (p) => <S {...p}><path d="m6 9 6 6 6-6" /></S>;
export const IEye = (p) => <S {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></S>;
export const IShare = (p) => <S {...p}><path d="M12 3v13M7 8l5-5 5 5M5 14v6h14v-6" /></S>;
export const IReceipt = (p) => <S {...p}><path d="M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6" /></S>;
export const IBag = (p) => <S {...p}><path d="M5 8h14l-1 13H6zM9 8V6a3 3 0 0 1 6 0v2" /></S>;
export const IStar = (p) => <S fill="currentColor" stroke="none" {...p}><path d="m12 3 2.8 5.8 6.2.9-4.5 4.4 1 6.2L12 17.4 6.5 20.3l1-6.2L3 9.7l6.2-.9z" /></S>;
export const ITag = (p) => <S {...p}><path d="M3 12V4h8l10 10-8 8z" /><circle cx="7.5" cy="8.5" r="1.3" /></S>;
export const IShield = (p) => <S {...p}><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z" /><path d="m9 12 2 2 4-4" /></S>;
export const ISettings = (p) => <S {...p}><circle cx="12" cy="12" r="3" /><path d="M19 12a7 7 0 0 0-.1-1.2l2-1.6-2-3.4-2.4 1a7 7 0 0 0-2-1.2L14 3h-4l-.4 2.6a7 7 0 0 0-2 1.2l-2.5-1-2 3.4 2 1.6A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.6 2 3.4 2.4-1a7 7 0 0 0 2 1.2L10 21h4l.4-2.6a7 7 0 0 0 2-1.2l2.5 1 2-3.4-2-1.6c0-.4.1-.8.1-1.2z" /></S>;
export const IImage = (p) => <S {...p}><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="2" /><path d="m21 16-5-5-9 9" /></S>;
