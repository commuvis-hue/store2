import { createContext, useContext, useEffect, useState } from 'react';

const RouterCtx = createContext(null);

export function RouterProvider({ children }) {
  const [path, setPath] = useState(window.location.pathname + window.location.search);
  useEffect(() => {
    const onPop = () => setPath(window.location.pathname + window.location.search);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  const navigate = (to, { replace = false } = {}) => {
    if (to === -1) return window.history.back();
    window.history[replace ? 'replaceState' : 'pushState']({}, '', to);
    setPath(to);
    window.scrollTo(0, 0);
  };
  const [pathname, search = ''] = path.split('?');
  return <RouterCtx.Provider value={{ pathname, query: new URLSearchParams(search), navigate }}>{children}</RouterCtx.Provider>;
}

export const useRouter = () => useContext(RouterCtx);

export function matchRoute(pattern, pathname) {
  const a = pattern.split('/').filter(Boolean);
  const b = pathname.split('/').filter(Boolean);
  if (a.length !== b.length) return null;
  const params = {};
  for (let i = 0; i < a.length; i++) {
    if (a[i].startsWith(':')) params[a[i].slice(1)] = decodeURIComponent(b[i]);
    else if (a[i] !== b[i]) return null;
  }
  return params;
}

export function Link({ to, children, className, ...rest }) {
  const { navigate } = useRouter();
  return (
    <a href={to} className={className} onClick={(e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault(); navigate(to);
    }} {...rest}>{children}</a>
  );
}
