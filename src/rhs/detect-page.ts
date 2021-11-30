import { Page } from '../interfaces';

/**
 * Detect the current page
 */
export function detectPage(): Page {
  const sn = document.querySelector<HTMLInputElement>('[name="@SN"]');
  if (sn && sn.value === 'root.cws.wage.wagedetail') return 'wagedetail';
  if (sn && sn.value === 'root.cws.wage.bonusdetail') return 'bonusdetail';

  const table = document.getElementById('APPROVALGRD');
  if (table) {
    const cb = table.querySelector('input[type="checkbox"]') as HTMLInputElement;
    return cb?.disabled ? 'batch' : 'list';
  }
  if (document.querySelector('select[name="KNMCDS"]')) return 'input';
  if (document.getElementById('KNMCDS')) return 'confirm';
  const contents = document.getElementById('maincontentsbody');
  if (contents && contents.innerText.indexOf('TimeOut') !== -1) return 'logout';
  if (contents && contents.innerText.indexOf('NullPointerException') !== -1) return 'error';
}
