import { updateState, getState } from '../utils/state';
import { error } from '../utils/log';

/**
 * From the list page, set the state action to auto-filling and
 * get the first day to fill, and start with it
 */
export async function autoFillList() {
  const state = await updateState({ action: 'autofill' });

  const day = state.days.find(day => day.state === 'pending');

  if (!day || (!day.gateRecording && !day.isHoliday)) {
    await updateState({ action: 'waiting' });
    return;
  }

  day.inputButton.click();
}

/**
 * In the input page, insert the data and submit it
 */
export async function autoFillInput() {
  const state = getState();
  if (state.action !== 'autofill') return;

  const dayDate = document.querySelector<HTMLElement>('#HD > tbody > tr > td').innerText;
  const match = /(\d+)\/(\d+)\/(\d+)/.exec(dayDate);
  const year = Number(match[1]);
  const month = Number(match[2]);
  // tslint:disable-next-line: no-magic-numbers
  const day = Number(match[3]);

  const data = state.days.find(
    ({ date }) => date.day === day && date.month === month && date.year === year
  );

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

  const button =
    INPUT_TYPE === 'draft'
      ? document.getElementById('dSave0')
      : document.getElementById('dSubmission0');
  button.click();
}

export async function stopAutoFill() {
  await updateState({ action: 'waiting' });
}
