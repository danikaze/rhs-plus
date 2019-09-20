import { error, log } from '../utils/log';
import { updateState, getState } from '../utils/state';
import { getNextDayToFill, getDayInfo } from '../utils/state-queries';

/**
 * From the list page, set the state action to auto-filling and
 * get the first day to fill, and start with it
 */
export async function autoFillList() {
  const day = getNextDayToFill();

  if (!day) {
    log('Nothing to autofill in the list. Stopping');
    await updateState({ action: 'waiting' });
    return;
  }

  log('Autofilling day hours from the list');
  await updateState({ action: 'autofill' });
  day.inputButton.click();
}

/**
 * In the input page, insert the data and submit it
 */
export async function autoFillInput() {
  if (getState().action !== 'autofill') return;
  log('Autofilling day hours');

  const dayDate = document.querySelector<HTMLElement>('#HD > tbody > tr > td').innerText;
  const match = /(\d+)\/(\d+)\/(\d+)/.exec(dayDate);
  const year = Number(match[1]);
  const month = Number(match[2]);
  // tslint:disable-next-line: no-magic-numbers
  const day = Number(match[3]);

  const data = getDayInfo(year, month, day);

  if (!data) {
    error('Day not found');
    await updateState({ action: 'waiting' });
  }

  if (data.gateRecording) {
    (document.getElementById('KNMTMRNGSTH') as HTMLInputElement).value = String(
      data.gateRecording.entryH
    );
    (document.getElementById('KNMTMRNGSTM') as HTMLInputElement).value = String(
      data.gateRecording.entryM
    );
    (document.getElementById('KNMTMRNGETH') as HTMLInputElement).value = String(
      data.gateRecording.exitH
    );
    (document.getElementById('KNMTMRNGETM') as HTMLInputElement).value = String(
      data.gateRecording.exitM
    );

    // if there's no gate recording data and it's not a weekday, we don't touch it
  } else if (!data.isHoliday) {
    data.state = 'unknown';
    await updateState();

    (document.querySelector('[name="btnGoBack0"]') as HTMLElement).click();
    return;
  }

  document.getElementById('btnNext0').click();
}

/**
 * In the input confirmation page, submit the data
 */
export function autoFillConfirm() {
  const state = getState();
  if (state.action !== 'autofill') return;

  log('Confirming day hours');

  const button =
    INPUT_TYPE === 'draft'
      ? document.getElementById('dSave0')
      : document.getElementById('dSubmission0');
  button.click();
}

/**
 *
 */
export async function stopAutoFill() {
  if (getState().action !== 'autofill') return;
  log('Stopping autofill');
  await updateState({ action: 'waiting' });
}
