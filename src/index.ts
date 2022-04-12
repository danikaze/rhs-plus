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
import { loadSettings } from './utils/settings';
import { translateWages } from './actions/translate-wages';
import { enableMultiCheck } from './actions/enable-multi-check';
import { alignCheckboxes } from './actions/align-checkboxes';
import { fixButtonLayout } from './actions/fix-button-layout';

window.onload = async () => {
  log(`Extension loaded (v${APP_VERSION})`);
  injectFavicon();
  const settings = await loadSettings();
  let state = await initState();

  switch (state.page) {
    case 'list':
      state = await updateState({ days: getHoursPerDay(state.days) });
      hideColumns(settings.columns);
      alignCheckboxes();
      enableMultiCheck();
      fixButtonLayout();
      injectUi(state, settings.updateLegend);
      if (isAutoFilling()) {
        autoFillList();
      }
      break;

    case 'batch':
      injectUi(state, settings.updateLegend);
      if (isAutoDraftInput()) {
        autoInputDraftsConfirm();
      }
      break;

    case 'input':
      injectUi(state, settings.updateLegend);
      if (isAutoFilling()) {
        autoFillInput();
      }
      break;

    case 'confirm':
      injectUi(state, settings.updateLegend);
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
      if (settings.translate) {
        translateWages();
      }
      break;
  }
};
