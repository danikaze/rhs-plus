import { log } from '../utils/log';
import { createElement } from '../utils/dom';
import { classes } from './styles';
import { getStats } from '../rhs/get-stats';
import { autoFillList, stopAutoFill } from '../actions/auto-fill';
import { autoInputDrafts } from '../actions/auto-input-drafts';
import { State } from '../interfaces';
import { getDaysByState, getNextDayToFill } from '../utils/state-queries';

interface Ui {
  container: HTMLDivElement;
  buttons: HTMLDivElement;
  stats: HTMLDivElement;
}

const ui: Partial<Ui> = {};

/**
 * Inject the UI in the page
 */
export function injectUi(state: State) {
  log('Injecting UI');

  ui.container = createElement('div', {
    style: classes.uiContainer,
    insertTo: document.body,
    innerHTML: ``,
  });

  updateUi(state, true);

  document.body.appendChild(ui.container);
}

/**
 * Modify the UI based on the current state
 */
export function updateUi(state: State, silence: boolean = false) {
  if (!ui.container) return;
  if (!silence) log('Updating UI');

  updateUiElement(state, 'stats', createStats);
  updateUiElement(state, 'buttons', createButtons);
}

/** Recreate a UI element */
function updateUiElement(state: State, element: keyof Ui, fn: (state: State) => HTMLDivElement) {
  if (ui[element]) {
    ui[element].parentElement.removeChild(ui[element]);
  }
  ui[element] = fn(state);
}

/**
 *
 */
function createStats(state: State): HTMLDivElement {
  const { summary, average } = getStats(state);
  // tslint:disable-next-line: no-magic-numbers
  const avgH = String(Math.floor(average / 60)).padStart(2, '0');
  // tslint:disable-next-line: no-magic-numbers
  const avgM = String(Math.floor(average) % 60).padStart(2, '0');
  const html = `
    <div>
      <span style="color: #cccc99" title="Number of inputted days">${summary.inputted}</span> /
      <span style="color: #d584e0" title="Number of holidays">${summary.holiday}</span> /
      <span style="color: #49bd49" title="Number of drafted days">${summary.draft}</span> /
      <span style="color: #a2a2a2" title="Number of pending days">${summary.pending}</span>
    </div>
    <div style="font-size: smaller">
      Average worked hours per day:
      <b>${avgH}:${avgM}</b>
    </div>
  `;

  return createElement('div', {
    insertTo: ui.container,
    innerHTML: html,
  });
}

/**
 *
 */
function createButtons(state: State): HTMLDivElement {
  const container = createElement('div', {
    insertTo: ui.container,
    style: classes.buttonsContainer,
  });

  createAutoFillButton(state, container);
  createInputDraftsButtons(container);

  return container;
}

/**
 *
 */
function createAutoFillButton(state: State, parent: HTMLDivElement): HTMLDivElement {
  const dayToFill = getNextDayToFill();
  const isActive = state.action === 'autofill';
  const container = createElement('div', {
    insertTo: parent,
    style: classes.autoFillContainer,
  });

  createElement('span', {
    insertTo: container,
    onClick: isActive ? stopAutoFill : dayToFill ? autoFillList : undefined,
    innerText: isActive ? `Stop auto ${INPUT_TYPE}` : `Auto ${INPUT_TYPE} hours`,
    style: !isActive && !dayToFill ? classes.buttonLinkDisabled : classes.buttonLink,
  });

  return container;
}

/**
 *
 */
function createInputDraftsButtons(parent: HTMLDivElement): HTMLDivElement {
  const drafted = getDaysByState('draft');
  const container = createElement('div', {
    insertTo: parent,
    style: classes.inputDraftContainer,
  });

  createElement('span', {
    insertTo: container,
    onClick: drafted.length ? autoInputDrafts : undefined,
    innerText: 'Auto input drafts',
    style: drafted.length ? classes.buttonLink : classes.buttonLinkDisabled,
  });

  return container;
}
