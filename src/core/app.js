import { router } from './router.js';
import { loadShell, loadView } from './view-loader.js';

const main = document.querySelector('#main-content');
let loadId = 0;
const shellReady = loadShell().catch((error) => console.error('Unable to load shared page components.', error));

async function renderRoute(route) {
  const requestId = ++loadId;
  try {
    await shellReady;
    await loadView(route, main, () => requestId === loadId);
    document.querySelectorAll('#nav-root a').forEach((link) => {
      const linkUrl = new URL(link.href, window.location.href);
      const linkRoute = router.resolve(linkUrl.pathname);
      if (linkRoute) {
        link.dataset.link = '';
        if (linkRoute === route) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
      }
    });
  } catch (error) {
    if (requestId !== loadId) return;
    main.removeAttribute('aria-busy');
    main.innerHTML = '<section class="section"><div class="container"><h1>Nie udało się załadować strony</h1><p>Odśwież stronę lub spróbuj ponownie za chwilę.</p></div></section>';
    console.error(error);
  }
}

router.subscribe(renderRoute);
router.start();

document.addEventListener('click', (event) => {
  const link = event.target.closest('a[href]');
  if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const url = new URL(link.href, window.location.href);
  if (url.origin !== window.location.origin) return;
  if (url.pathname === window.location.pathname && url.hash) return;
  if (!router.resolve(url.pathname)) return;
  event.preventDefault();
  router.navigate(`${url.pathname}${url.search}`);
});
