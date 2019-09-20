import { updateState, getState } from '../utils/state';
import { getDaysByState } from '../utils/state-queries';
import { log } from '../utils/log';

/**
 *
 */
export async function autoInputDrafts() {
  const drafted = getDaysByState('draft');

  if (drafted.length === 0) {
    log('No drafted days to input');
    await updateState({ action: 'waiting' });
    return;
  }

  log('Auto inputting drafted days from list');

  drafted.forEach(({ checkbox }) => {
    checkbox.checked = true;
  });

  await updateState({ action: 'autoinput' });
  document.getElementById('DCMLTSBMT').click();
}

/**
 *
 */
export async function autoInputDraftsConfirm() {
  if (getState().action !== 'autoinput') return;

  log('Confirming the bulk input');
  await updateState({ action: 'waiting' });
  document.getElementById('btnExec1').click();
}
