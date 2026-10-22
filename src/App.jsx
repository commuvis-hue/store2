import { useRouter, matchRoute } from './store/router';
import { BottomNav, Toast } from './components/UI';
import Home from './pages/Home';
import Categories from './pages/Categories';
import Search from './pages/Search';
import ProductDetail from './pages/ProductDetail';
import Write from './pages/Write';
import Community, { PostDetail, CommunityWrite } from './pages/Community';
import Nearby from './pages/Nearby';
import Chats, { ChatRoom } from './pages/Chats';
import Login from './pages/Auth';
import { StorePage, BusinessCenter } from './pages/Business';
import Admin from './pages/Admin';
import { LegalDoc, Help } from './pages/Legal';
import My, { MySales, MyPurchases, MyLikes, Keywords, RegionSettings, Reviews, UserProfile, WriteReview, Settings, Blocked, Notifications } from './pages/My';

const ROUTES = [
  ['/', () => <Home />, true],
  ['/categories', () => <Categories />],
  ['/search', () => <Search />],
  ['/write', () => <Write />],
  ['/products/:id', ({ id }) => <ProductDetail key={id} id={id} />],
  ['/products/:id/edit', ({ id }) => <Write editId={id} />],
  ['/community', () => <Community />, true],
  ['/community/write', () => <CommunityWrite />],
  ['/community/:id', ({ id }) => <PostDetail id={id} />],
  ['/nearby', () => <Nearby />, true],
  ['/chats', () => <Chats />, true],
  ['/chats/:id', ({ id }) => <ChatRoom key={id} id={id} />],
  ['/my', () => <My />, true],
  ['/my/sales', () => <MySales />],
  ['/my/purchases', () => <MyPurchases />],
  ['/my/likes', () => <MyLikes />],
  ['/my/keywords', () => <Keywords />],
  ['/my/region', () => <RegionSettings />],
  ['/my/reviews', () => <Reviews />],
  ['/my/settings', () => <Settings />],
  ['/my/blocked', () => <Blocked />],
  ['/users/:id', ({ id }) => <UserProfile key={id} id={id} />],
  ['/review/:userId', ({ userId }) => <WriteReview userId={userId} />],
  ['/notifications', () => <Notifications />],
  ['/login', () => <Login />],
  ['/stores/:id', ({ id }) => <StorePage key={id} id={id} />],
  ['/business', () => <BusinessCenter />],
  ['/admin', () => <Admin />],
  ['/help', () => <Help />],
  ['/legal/:kind', ({ kind }) => <LegalDoc key={kind} kind={kind} />],
];

export default function App() {
  const { pathname } = useRouter();
  let page = null; let nav = false;
  for (const [pattern, render, withNav] of ROUTES) {
    const params = matchRoute(pattern, pathname);
    if (params) { page = render(params); nav = !!withNav; break; }
  }
  if (!page) { page = <Home />; nav = true; }
  return (
    <div className={`app ${nav ? 'with-nav' : ''}`}>
      <main>{page}</main>
      {nav && <BottomNav />}
      <Toast />
    </div>
  );
}
