import { log } from './utils/log';
import { injectUi } from './ui/index';
import { initState, updateState } from './utils/state';
import { getHoursPerDay } from './rhs/get-hours-per-day';
import { autoFillInput, autoFillList, autoFillConfirm } from './actions/auto-fill';

window.onload = async () => {
  log('Extension loaded');
  const state = await initState();

  switch (state.page) {
    case 'list':
      updateState({ days: getHoursPerDay() });
      injectUi(state);
      if (state.action === 'autofill') {
        autoFillList();
        return;
      }

      break;

    case 'input':
      injectUi(state);
      if (state.action === 'autofill') {
        autoFillInput();
        return;
      }
      autoFillInput();
      break;

    case 'confirm':
      injectUi(state);
      if (state.action === 'autofill') {
        autoFillConfirm();
        return;
      }
      break;

    case 'error':
      if (state.action !== 'waiting') {
        updateState({ action: 'waiting' });
        (document.querySelector('#maincontentsbody > form > a') as HTMLElement).click();
      }
      break;
  }
};
