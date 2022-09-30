import { log } from '../utils/log';
import { applyStyle, createElement } from '../utils/dom';
import { coalesce } from '../utils/coalesce';
import { getAncestor } from '../utils/get-ancestor';

export function injectLogo(): void {
  const img = coalesce(
    document.querySelector<HTMLImageElement>('img[src$="shuro_head_logo.gif"]'),
    document.querySelector<HTMLImageElement>('img[src$="head_bg1.gif"]')
  );
  if (!img) return;

  log('Injecting favicon');
  img.src = chrome.runtime.getURL('assets/rhs-logo.png');

  const parent = getAncestor(img, 'td');
  if (!parent) return;

  applyStyle(parent, { position: 'relative' });
  createElement('div', {
    insertTo: parent,
    innerText: APP_VERSION,
    style: {
      position: 'absolute',
      bottom: '1px',
      right: '37px',
      fontSize: '8px',
      opacity: '0.7',
    },
  });
}
