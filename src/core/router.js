const routeAliases = new Map([
  ['/', 'home'], ['/home', 'home'],
  ['/menu', 'menu'], ['/wypieki', 'menu'],
  ['/order', 'order'], ['/zamow', 'order'], ['/zamów', 'order'],
  ['/contact', 'contact'], ['/kontakt', 'contact'], ['/o-nas', 'contact'],
]);
const routeListeners = new Set();
let currentRoute = null;

function normalizePath(pathname) {
  const path = decodeURIComponent(pathname).replace(/\/+$/, '').toLowerCase();
  return path || '/';
}

function resolveRoute(pathname = window.location.pathname) {
  return routeAliases.get(normalizePath(pathname)) ?? null;
}

function emitRoute() {
  currentRoute = resolveRoute() ?? 'home';
  for (const listener of routeListeners) listener(currentRoute);
}

export const router = {
  get route() {
    return currentRoute ?? resolveRoute() ?? 'home';
  },

  resolve(pathname) {
    return resolveRoute(pathname);
  },

  navigate(pathname, { replace = false } = {}) {
    const url = new URL(pathname, window.location.origin);
    const route = resolveRoute(url.pathname);
    if (!route) return false;
    const canonicalPath = route === 'home' ? '/' : `/${route}`;
    window.history[replace ? 'replaceState' : 'pushState']({}, '', `${canonicalPath}${url.search}${url.hash}`);
    emitRoute();
    return true;
  },

  subscribe(listener) {
    if (typeof listener !== 'function') throw new TypeError('A route listener function is required.');
    routeListeners.add(listener);
    return () => routeListeners.delete(listener);
  },

  start() {
    window.addEventListener('popstate', emitRoute);
    const initialRoute = resolveRoute();
    if (initialRoute && window.location.pathname !== (initialRoute === 'home' ? '/' : `/${initialRoute}`)) {
      const canonicalPath = initialRoute === 'home' ? '/' : `/${initialRoute}`;
      window.history.replaceState({}, '', `${canonicalPath}${window.location.search}${window.location.hash}`);
    }
    emitRoute();
  },
};
