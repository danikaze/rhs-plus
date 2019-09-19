import { updateState } from '../utils/state';

export async function autoInputDrafts() {
  const state = await updateState({ action: 'autoinput' });
  const drafted = state.days.filter(day => day.state === 'draft');

  if (drafted.length === 0) {
    await updateState({ action: 'waiting' });
    return;
  }

  drafted.forEach(({ checkbox }) => {
    checkbox.checked = true;
  });

  document.getElementById('DCMLTSBMT').click();
}

export async function autoInputDraftsConfirm() {
  await updateState({ action: 'waiting' });
  document.getElementById('btnExec1').click();
}
