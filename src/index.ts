import { log } from './utils/log';
import { injectUi } from './ui/index';
import { injectFavicon } from './ui/favicon';
import { initState, updateState } from './utils/state';
import { getHoursPerDay } from './rhs/get-hours-per-day';
import { autoFillInput, autoFillList, autoFillConfirm } from './actions/auto-fill';
import { autoInputDraftsConfirm } from './actions/auto-input-drafts';

window.onload = async () => {
  log('Extension loaded');
  injectFavicon();
  const state = await initState();

  switch (state.page) {
    case 'list':
      updateState({ days: getHoursPerDay() });
      injectUi(state);
      if (state.action === 'autofill') {
        autoFillList();
      }
      break;

    case 'batch':
      injectUi(state);
      if (state.action === 'autoinput') {
        autoInputDraftsConfirm();
      }
      break;

    case 'input':
      injectUi(state);
      if (state.action === 'autofill') {
        autoFillInput();
      }
      break;

    case 'confirm':
      injectUi(state);
      if (state.action === 'autofill') {
        autoFillConfirm();
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
