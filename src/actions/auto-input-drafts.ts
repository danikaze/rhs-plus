import { updateState } from '../utils/state';
import { getDaysByState } from '../utils/state-queries';

export async function autoInputDrafts() {
  const drafted = getDaysByState('draft');

  if (drafted.length === 0) {
    await updateState({ action: 'waiting' });
    return;
  }

  drafted.forEach(({ checkbox }) => {
    checkbox.checked = true;
  });

  await updateState({ action: 'autoinput' });
  document.getElementById('DCMLTSBMT').click();
}

export async function autoInputDraftsConfirm() {
  await updateState({ action: 'waiting' });
  document.getElementById('btnExec1').click();
}
