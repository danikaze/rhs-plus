import { log } from './utils/log';
import { injectUi } from './ui/index';
import { injectFavicon } from './ui/favicon';
import { initState, updateState } from './utils/state';
import { getHoursPerDay } from './rhs/get-hours-per-day';
import {
  autoFillInput,
  autoFillList,
  autoFillConfirm,
  resetStateAction,
} from './actions/auto-fill';
import { autoInputDraftsConfirm } from './actions/auto-input-drafts';
import { isAutoFilling, isAutoDraftInput, isWaiting } from './utils/state-queries';
import { hideColumns } from './ui/hide-columns';
import { loadSettings, Settings } from './utils/settings';
import { translateWages } from './actions/translate-wages';

window.onload = async () => {
  log('Extension loaded');
  injectFavicon();
  let state = await initState();
  let settings: Settings;

  switch (state.page) {
    case 'list':
      state = await updateState({ days: getHoursPerDay(state.days) });
      settings = await loadSettings();
      hideColumns(settings.columns);
      injectUi(state);
      if (isAutoFilling()) {
        autoFillList();
      }
      break;

    case 'batch':
      injectUi(state);
      if (isAutoDraftInput()) {
        autoInputDraftsConfirm();
      }
      break;

    case 'input':
      injectUi(state);
      if (isAutoFilling()) {
        autoFillInput();
      }
      break;

    case 'confirm':
      injectUi(state);
      if (isAutoFilling()) {
        autoFillConfirm();
      }
      break;

    case 'error':
      if (!isWaiting()) {
        resetStateAction();
        (document.querySelector('#maincontentsbody > form > a') as HTMLElement).click();
      }
      break;

    case 'wagedetail':
    case 'bonusdetail':
      settings = await loadSettings();
      if (settings.translate) {
        translateWages();
      }
      break;
  }
};
