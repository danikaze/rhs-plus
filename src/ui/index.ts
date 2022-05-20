import { log } from '../utils/log';
import { applyStyle, createElement } from '../utils/dom';
import { getStats } from '../rhs/get-stats';
import { autoFillList, resetStateAction } from '../actions/auto-fill';
import { autoInputDrafts } from '../actions/auto-input-drafts';
import { State } from '../interfaces';
import { getDaysByState, isAutoFilling, getDraftableDays } from '../utils/state-queries';
import { sendMessage } from '../utils/send-message';
import { Settings } from '../utils/settings';
import { replaceLegend } from './legend';
import { classes } from './styles';

type Ui = Record<
  'container' | 'top' | 'bottom' | 'settings' | 'buttons' | 'stats' | 'toggle',
  HTMLElement
>;

const ui: Partial<Ui> = {};
let uiShown = true;

/**
 * Inject the UI in the page
 * I want it so bad to migrate to ReactJS but it's not worth my time...
 * ...kill me please...
 */
export function injectUi(settings: Settings, state: State) {
  log('Injecting UI');
  const isProd = process.env.NODE_ENV === 'production';

  if (state.page === 'list' && settings.updateLegend) {
    replaceLegend();
  }

  ui.container = createElement('div', {
    style: [classes.uiContainer, !uiShown && classes.uiContainerHidden],
    insertTo: document.body,
    innerHTML: ``,
  });

  ui.top = createElement('div', {
    style: classes.uiContainerTop,
    insertTo: ui.container,
  });
  ui.bottom = createElement('div', {
    style: classes.uiContainerBottom,
    insertTo: ui.container,
    innerHTML: uiShown ? '△' : '▽',
    onClick: () => {
      uiShown = !uiShown;
      applyStyle(ui.container, [classes.uiContainer, !uiShown && classes.uiContainerHidden]);
      ui.bottom.innerHTML = uiShown ? '△' : '▽';
    },
  });

  ui.settings = createElement('div', {
    style: classes.uiSettingsButton,
    insertTo: ui.top,
    innerHTML: '⚙',
    onClick: () => sendMessage({ action: 'openOptionsPage' }),
    attributes: { title: 'Open options page' },
  });

  updateUi(settings, state, isProd);

  document.body.appendChild(ui.container);
}

/**
 * Modify the UI based on the current state
 */
export function updateUi(settings: Settings, state: State, silence: boolean = false) {
  if (!ui.container) return;
  if (!silence) log('Updating UI');

  updateUiElement(settings, state, 'stats', createStats);
  updateUiElement(settings, state, 'buttons', createButtons);
}

/** Recreate a UI element */
function updateUiElement(
  settings: Settings,
  state: State,
  element: keyof Ui,
  fn: (settings: Settings, state: State) => HTMLDivElement
) {
  if (ui[element]) {
    ui[element].parentElement.removeChild(ui[element]);
  }
  ui[element] = fn(settings, state);
}

/**
 *
 */
function createStats(settings: Settings, state: State): HTMLDivElement {
  const { summary, average } = getStats(state);
  // tslint:disable-next-line: no-magic-numbers
  const avgH = String(Math.floor(average / 60)).padStart(2, '0');
  // tslint:disable-next-line: no-magic-numbers
  const avgM = String(Math.floor(average) % 60).padStart(2, '0');
  const avgTime = avgH === 'NaN' || avgM === 'NaN' ? 'N/A' : `${avgH}:${avgM}`;
  const html = `
    <div>
      <span style="color: #cccc99" title="Number of inputted days">${summary.inputted}</span> /
      <span style="color: #d584e0" title="Number of holidays">${summary.holiday}</span> /
      <span style="color: #49bd49" title="Number of drafted days">${summary.draft}</span> /
      <span style="color: #a2a2a2" title="Number of pending days">${summary.pending}</span>
    </div>
    <div style="font-size: smaller">
      Average worked hours per day:
      <b>${avgTime}</b>
    </div>
  `;

  return createElement('div', {
    insertTo: ui.top,
    innerHTML: html,
  });
}

/**
 *
 */
function createButtons(settings: Settings, state: State): HTMLDivElement {
  const container = createElement('div', {
    insertTo: ui.top,
    style: classes.buttonsContainer,
  });

  createAutoFillButton(settings, state, container);
  if (state.page === 'list') {
    createInputDraftsButtons(settings, container);
  }

  return container;
}

/**
 *
 */
function createAutoFillButton(
  settings: Settings,
  state: State,
  parent: HTMLDivElement
): HTMLDivElement {
  const daysList = getDraftableDays(settings);

  const container = createElement('div', {
    insertTo: parent,
  });

  function startAutoFill() {
    daysList.forEach((day) => {
      day.autoInput = true;
    });
    autoFillList(settings);
  }

  // already auto-filling
  if (isAutoFilling()) {
    createElement('span', {
      insertTo: container,
      onClick: () => resetStateAction(settings),
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
function createInputDraftsButtons(settings: Settings, parent: HTMLDivElement): HTMLDivElement {
  const drafted = getDaysByState('draft');
  const container = createElement('div', {
    insertTo: parent,
  });

  createElement('span', {
    insertTo: container,
    onClick: drafted.length ? () => autoInputDrafts(settings) : undefined,
    innerText: 'Auto input drafts',
    style: drafted.length ? classes.buttonLink : classes.buttonLinkDisabled,
  });

  return container;
}
