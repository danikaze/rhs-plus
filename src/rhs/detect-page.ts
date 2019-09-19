import { Page } from '../interfaces';

/**
 * Detect the current page
 */
export function detectPage(): Page {
  if (document.getElementById('APPROVALGRD')) return 'list';
  if (document.querySelector('select[name="KNMCDS"]')) return 'input';
  if (document.getElementById('KNMCDS')) return 'confirm';
  const contents = document.getElementById('maincontentsbody');
  if (contents && contents.innerText.indexOf('TimeOut') !== -1) return 'logout';
  if (contents && contents.innerText.indexOf('NullPointerException') !== -1) return 'error';
}
