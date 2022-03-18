import { log } from '../utils/log';

export function injectFavicon() {
  log('Injecting favicon');

  const link =
    document.querySelector<HTMLLinkElement>('link[rel*="icon"]') || document.createElement('link');
  link.type = 'image/png';
  link.rel = 'shortcut icon';
  link.href = chrome.runtime.getURL('icons/icon128.png');

  document.head.insertAdjacentElement('afterbegin', link);
}
