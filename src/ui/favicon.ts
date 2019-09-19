import { log } from '../utils/log';

export function injectFavicon() {
  const link =
    document.querySelector<HTMLLinkElement>('link[rel*="icon"]') || document.createElement('link');
  link.type = 'image/png';
  link.rel = 'shortcut icon';
  link.href = chrome.extension.getURL('icons/icon128.png');

  document.head.insertAdjacentElement('afterbegin', link);
  log('Favicon injected');
}
