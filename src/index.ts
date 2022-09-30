import { log } from './utils/log';
import { injectUi } from './ui';
import { injectFavicon } from './ui/favicon';
import { injectLogo } from './ui/logo';
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
import { loadSettings } from './utils/settings';
import { translateWages } from './actions/translate-wages';
import { enableMultiCheck } from './actions/enable-multi-check';
import { alignCheckboxes } from './actions/align-checkboxes';
import { fixButtonLayout } from './actions/fix-button-layout';

window.onload = async () => {
  log(`Extension loaded (v${APP_VERSION})`);
  injectFavicon();
  injectLogo();
  const settings = await loadSettings();
  let state = await initState();

  switch (state.page) {
    case 'list':
      state = await updateState(settings, { days: getHoursPerDay(state.days) });
      hideColumns(settings.columns);
      alignCheckboxes();
      enableMultiCheck();
      fixButtonLayout();
      injectUi(settings, state);
      if (isAutoFilling()) {
        autoFillList(settings);
      }
      break;

    case 'batch':
      injectUi(settings, state);
      if (isAutoDraftInput()) {
        autoInputDraftsConfirm(settings);
      }
      break;

    case 'input':
      injectUi(settings, state);
      if (isAutoFilling()) {
        autoFillInput(settings);
      }
      break;

    case 'confirm':
      injectUi(settings, state);
      if (isAutoFilling()) {
        autoFillConfirm(settings);
      }
      break;

    case 'error':
      if (!isWaiting()) {
        resetStateAction(settings);
        (document.querySelector('#maincontentsbody > form > a') as HTMLElement).click();
      }
      break;

    case 'wagedetail':
    case 'bonusdetail':
      if (settings.translate) {
        translateWages();
      }
      break;
  }
};
