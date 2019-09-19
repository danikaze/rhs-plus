import { log } from '../utils/log';
import { createElement } from '../utils/dom';
import { classes } from './styles';
import { getStats } from '../rhs/get-stats';
import { autoFillList, stopAutoFill } from '../actions/auto-fill';
import { autoInputDrafts } from '../actions/auto-input-drafts';
import { State } from '../interfaces';

interface Ui {
  container: HTMLDivElement;
  autoFillButton: HTMLDivElement;
  inputDraftsButton: HTMLDivElement;
  stats: HTMLDivElement;
}

const ui: Partial<Ui> = {};

/** Inject the UI in the page */
export function injectUi(state: State) {
  log('Injecting UI');

  ui.container = createElement('div', {
    style: classes.uiContainer,
    insertTo: document.body,
    innerHTML: ``,
  });

  updateUi(state);

  document.body.appendChild(ui.container);
}

/** Modify the UI based on the current state */
export function updateUi(state: State) {
  if (!ui.container) return;

  updateUiElement(state, 'stats', createStats);
  updateUiElement(state, 'autoFillButton', createAutoFillButton);
  updateUiElement(state, 'inputDraftsButton', createInputDraftsButtons);
}

/** Recreate a UI element */
function updateUiElement(state: State, element: keyof Ui, fn: (state: State) => HTMLDivElement) {
  if (ui[element]) {
    ui[element].parentElement.removeChild(ui[element]);
  }
  ui[element] = fn(state);
}

function createStats(state: State): HTMLDivElement {
  const { summary, average } = getStats(state);
  // tslint:disable-next-line: no-magic-numbers
  const avgH = String(Math.floor(average / 60)).padStart(2, '0');
  // tslint:disable-next-line: no-magic-numbers
  const avgM = String(Math.floor(average) % 60).padStart(2, '0');
  const html = `
    <span style="color: #cccc99" title="Number of inputted days">${summary.inputted}</span> /
    <span style="color: #d584e0" title="Number of holidays">${summary.holiday}</span> /
    <span style="color: #49bd49" title="Number of drafted days">${summary.draft}</span> /
    <span style="color: #a2a2a2" title="Number of pending days">${summary.pending}</span>
    <span title="Average worked hours per day">(${avgH}:${avgM})</span>
  `;

  return createElement('div', {
    insertTo: ui.container,
    innerHTML: html,
  });
}

function createAutoFillButton(state: State): HTMLDivElement {
  return createElement('div', {
    insertTo: ui.container,
    onClick: state.action === 'autofill' ? stopAutoFill : autoFillList,
    innerText: state.action === 'autofill' ? 'Stop Auto Fill' : 'Auto Fill',
    style: classes.buttonLink,
  });
}

function createInputDraftsButtons(state: State): HTMLDivElement {
  const drafted = state.days.filter(day => day.state === 'draft');
  if (drafted.length === 0) {
    return;
  }
  return createElement('div', {
    insertTo: ui.container,
    onClick: autoInputDrafts,
    innerText: 'Auto input drafts',
    style: classes.buttonLink,
  });
}
