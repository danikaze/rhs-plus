import { log } from '../utils/log';
import { createElement } from '../utils/dom';
import { classes } from './styles';
import { getStats } from '../rhs/get-stats';
import { autoFillList, resetStateAction } from '../actions/auto-fill';
import { autoInputDrafts } from '../actions/auto-input-drafts';
import { State } from '../interfaces';
import { getDaysByState, isAutoFilling, getDraftableDays } from '../utils/state-queries';

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
  if (state.page === 'list') {
    createInputDraftsButtons(container);
  }

  return container;
}

/**
 *
 */
function createAutoFillButton(state: State, parent: HTMLDivElement): HTMLDivElement {
  const daysList = getDraftableDays();

  const container = createElement('div', {
    insertTo: parent,
  });

  function startAutoFill() {
    daysList.forEach(day => {
      day.autoInput = true;
    });
    autoFillList();
  }

  // already auto-filling

  if (isAutoFilling()) {
    createElement('span', {
      insertTo: container,
      onClick: resetStateAction,
      innerText: `Stop auto ${INPUT_TYPE}`,
      style: classes.buttonLink,
    });
    // waiting to auto-fill (or nothing to autofill)
  } else {
    createElement('span', {
      insertTo: container,
      onClick: daysList.length > 0 ? startAutoFill : undefined,
      innerText: `Auto ${INPUT_TYPE} hours`,
      style: daysList.length > 0 ? classes.buttonLink : classes.buttonLinkDisabled,
    });
  }

  return container;
}

/**
 *
 */
function createInputDraftsButtons(parent: HTMLDivElement): HTMLDivElement {
  const drafted = getDaysByState('draft');
  const container = createElement('div', {
    insertTo: parent,
  });

  createElement('span', {
    insertTo: container,
    onClick: drafted.length ? autoInputDrafts : undefined,
    innerText: 'Auto input drafts',
    style: drafted.length ? classes.buttonLink : classes.buttonLinkDisabled,
  });

  return container;
}
