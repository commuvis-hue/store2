import { createContext, useContext, useEffect, useReducer, useRef, useState, useCallback } from 'react';
import { USERS, PRODUCTS, POSTS, INITIAL_CHATS, INITIAL_NOTIFICATIONS, AUTO_REPLIES, OFFER_REPLIES } from '../data/mock';

const KEY = 'chhimeki-bazar-np-v2';
const uid = (p) => `${p}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

const initial = () => ({
  me: { ...USERS.me, verified: false, regions: ['ठमेल'], radius: 2 },
  users: USERS,
  products: PRODUCTS,
  posts: POSTS,
  chats: INITIAL_CHATS,
  notifications: INITIAL_NOTIFICATIONS,
  likes: ['p7'],
  postLikes: [],
  hidden: [],
  blocked: [],
  keywords: ['स्कुटर'],
  purchases: [],
  reviews: [
    { id: 'r1', fromId: 'u4', toId: 'me', text: 'एकदम राम्रो कारोबार भयो, धन्यवाद! 🙏', tags: ['विनम्र र राम्रो व्यवहार'], at: Date.now() - 5 * 86400000 },
  ],
  recentSearches: [],
  // v2 (사업기획서 반영)
  auth: { loggedIn: false, phone: '' },
  settings: { lite: false },
  business: { active: false, shopName: '', since: null },
  payments: [],
  reports: [],
  waitlist: [],
  coupons: [],
  myAds: [],
  freeBumps: {},
});

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...initial(), ...JSON.parse(raw) };
  } catch {}
  return initial();
}

function reducer(s, a) {
  switch (a.type) {
    case 'RESET': return initial();
    case 'ME': return { ...s, me: { ...s.me, ...a.patch } };
    case 'TOGGLE_LIKE':
      return { ...s, likes: s.likes.includes(a.id) ? s.likes.filter((x) => x !== a.id) : [...s.likes, a.id] };
    case 'TOGGLE_POST_LIKE': {
      const liked = s.postLikes.includes(a.id);
      return {
        ...s,
        postLikes: liked ? s.postLikes.filter((x) => x !== a.id) : [...s.postLikes, a.id],
        posts: s.posts.map((p) => (p.id === a.id ? { ...p, likes: p.likes + (liked ? -1 : 1) } : p)),
      };
    }
    case 'ADD_PRODUCT': return { ...s, products: [a.product, ...s.products] };
    case 'UPDATE_PRODUCT': return { ...s, products: s.products.map((p) => (p.id === a.id ? { ...p, ...a.patch } : p)) };
    case 'DELETE_PRODUCT': return { ...s, products: s.products.filter((p) => p.id !== a.id), likes: s.likes.filter((x) => x !== a.id) };
    case 'VIEW_PRODUCT': return { ...s, products: s.products.map((p) => (p.id === a.id ? { ...p, views: p.views + 1 } : p)) };
    case 'HIDE': return { ...s, hidden: [...new Set([...s.hidden, a.id])] };
    case 'UNHIDE': return { ...s, hidden: s.hidden.filter((x) => x !== a.id) };
    case 'BLOCK': return { ...s, blocked: [...new Set([...s.blocked, a.userId])] };
    case 'UNBLOCK': return { ...s, blocked: s.blocked.filter((x) => x !== a.userId) };
    case 'ADD_POST': return { ...s, posts: [a.post, ...s.posts] };
    case 'DELETE_POST': return { ...s, posts: s.posts.filter((p) => p.id !== a.id) };
    case 'ADD_COMMENT': return { ...s, posts: s.posts.map((p) => (p.id === a.postId ? { ...p, comments: [...p.comments, a.comment] } : p)) };
    case 'OPEN_CHAT': return { ...s, chats: [a.chat, ...s.chats] };
    case 'SEND':
      return {
        ...s,
        chats: s.chats
          .map((c) => (c.id === a.chatId ? { ...c, messages: [...c.messages, a.message], updatedAt: a.message.at, unread: a.message.from === 'me' ? c.unread : c.unread + 1 } : c))
          .sort((x, y) => y.updatedAt - x.updatedAt),
      };
    case 'READ_CHAT': return { ...s, chats: s.chats.map((c) => (c.id === a.id ? { ...c, unread: 0 } : c)) };
    case 'LEAVE_CHAT': return { ...s, chats: s.chats.filter((c) => c.id !== a.id) };
    case 'NOTIFY': return { ...s, notifications: [{ id: uid('n'), read: false, at: Date.now(), ...a.n }, ...s.notifications] };
    case 'READ_NOTI': return { ...s, notifications: s.notifications.map((n) => ({ ...n, read: true })) };
    case 'DELETE_NOTI': return { ...s, notifications: s.notifications.filter((n) => n.id !== a.id) };
    case 'ADD_KEYWORD': return s.keywords.includes(a.k) ? s : { ...s, keywords: [...s.keywords, a.k] };
    case 'DEL_KEYWORD': return { ...s, keywords: s.keywords.filter((k) => k !== a.k) };
    case 'SEARCHED': return { ...s, recentSearches: [a.q, ...s.recentSearches.filter((q) => q !== a.q)].slice(0, 10) };
    case 'CLEAR_SEARCHES': return { ...s, recentSearches: [] };
    case 'PURCHASE': return { ...s, purchases: [...new Set([a.id, ...s.purchases])] };
    case 'ADD_REVIEW': {
      const users = { ...s.users };
      const t = users[a.review.toId];
      if (t) users[a.review.toId] = { ...t, temp: Math.min(99, +(t.temp + 0.1 * (a.review.tags.length || 1)).toFixed(1)) };
      return { ...s, users, reviews: [a.review, ...s.reviews] };
    }
    // ── v2 ──
    case 'LOGIN': return { ...s, auth: { loggedIn: true, phone: a.phone }, me: { ...s.me, ...(a.patch || {}) } };
    case 'LOGOUT': return { ...s, auth: { loggedIn: false, phone: '' }, me: { ...s.me, verified: false } };
    case 'SETTINGS': return { ...s, settings: { ...s.settings, ...a.patch } };
    case 'BUSINESS': return { ...s, business: { ...s.business, ...a.patch } };
    case 'PAY': return { ...s, payments: [a.payment, ...s.payments] };
    case 'REPORT': return { ...s, reports: [{ status: 'open', at: Date.now(), ...a.report }, ...s.reports] };
    case 'RESOLVE_REPORT': return { ...s, reports: s.reports.map((r) => (r.id === a.id ? { ...r, status: a.status, resolvedAt: Date.now() } : r)) };
    case 'WAITLIST': return s.waitlist.includes(a.region) ? s : { ...s, waitlist: [...s.waitlist, a.region] };
    case 'CLAIM_COUPON': return s.coupons.includes(a.id) ? s : { ...s, coupons: [...s.coupons, a.id] };
    case 'ADD_AD': return { ...s, myAds: [a.ad, ...s.myAds] };
    case 'UPDATE_AD': return { ...s, myAds: s.myAds.map((x) => (x.id === a.id ? { ...x, ...a.patch } : x)) };
    case 'FREE_BUMP': return { ...s, freeBumps: { ...s.freeBumps, [a.id]: a.day } };
    default: return s;
  }
}

const Ctx = createContext(null);

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, load);
  const [toast, setToast] = useState(null);
  const timers = useRef([]);

  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {} }, [state]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const showToast = useCallback((msg) => {
    setToast({ msg, k: Date.now() });
    timers.current.push(setTimeout(() => setToast(null), 2200));
  }, []);

  const api = {
    state, dispatch, toast, showToast, uid,
    user: (id) => (id === 'me' ? { ...state.users.me, ...state.me } : state.users[id]),
    isLiked: (id) => state.likes.includes(id),
    likeCount: (p) => p.baseLikes + (state.likes.includes(p.id) ? 1 : 0),

    loggedIn: state.auth.loggedIn,
    // 결제 기록 (실서비스: eSewa/Khalti/Fonepay 게이트웨이 콜백에서 생성)
    pay(item, amount, method, ref) {
      const payment = { id: uid('pay'), item, amount, method, ref, at: Date.now(), status: 'paid' };
      dispatch({ type: 'PAY', payment });
      return payment;
    },
    report(kind, targetId, reason) {
      dispatch({ type: 'REPORT', report: { id: uid('rp'), kind, targetId, reason, by: 'me' } });
    },

    addProduct(data) {
      const product = { id: uid('p'), sellerId: 'me', region: state.me.region, createdAt: Date.now(), status: 'selling', views: 0, baseLikes: 0, chatCount: 0, ...data };
      dispatch({ type: 'ADD_PRODUCT', product });
      state.keywords.filter((k) => product.title.includes(k)).forEach((k) =>
        dispatch({ type: 'NOTIFY', n: { type: 'keyword', text: `किवर्ड "${k}" सम्बन्धी नयाँ पोस्ट: ${product.title}`, link: `/products/${product.id}` } }));
      return product;
    },

    openChat(product) {
      const found = state.chats.find((c) => c.productId === product.id && c.partnerId === product.sellerId);
      if (found) return found.id;
      const chat = { id: uid('ch'), productId: product.id, partnerId: product.sellerId, unread: 0, updatedAt: Date.now(), messages: [] };
      dispatch({ type: 'OPEN_CHAT', chat });
      dispatch({ type: 'UPDATE_PRODUCT', id: product.id, patch: { chatCount: product.chatCount + 1 } });
      return chat.id;
    },

    send(chatId, text, extra = {}) {
      const { partnerId: pid, ...rest } = extra;
      const partnerId = state.chats.find((c) => c.id === chatId)?.partnerId || pid;
      dispatch({ type: 'SEND', chatId, message: { id: uid('m'), from: 'me', text, at: Date.now(), ...rest } });
      if (!partnerId || state.blocked.includes(partnerId)) return;
      // बिक्रेताको स्वचालित जवाफ (डेमो)
      timers.current.push(setTimeout(() => {
        const reply = extra.kind === 'offer'
          ? OFFER_REPLIES[Math.random() > 0.5 ? 0 : 1]
          : AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)];
        dispatch({ type: 'SEND', chatId, message: { id: uid('m'), from: partnerId, text: reply, at: Date.now() } });
      }, 1400 + Math.random() * 1200));
    },
  };

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export const useStore = () => useContext(Ctx);
