import { coalesce } from '../utils/coalesce';
import { createElement } from '../utils/dom';
import { log, warn } from '../utils/log';

interface LegendItem {
  color: string;
  text: string;
  className: string;
}

/*
 * Legend improvement detects the position based on other elements (the actions buttons)
 * Sometimes this button changes depending on the context (i.e. when a holiday is applied but not approved)
 * This is why the IDs are a list of possible values and not unique
 */
// Id of the first button over the legend
const TOP_FIRST_BUTTONS_ID = ['BTNCLC0', 'TFIGRD']; // [Calculate, Approver table]
// Id of the last button over the legend
const TOP_LAST_BUTTONS_ID = ['BTNSBMT0', 'MLTDLT0', 'TFIGRD']; // [, Clear draft, Approver table]
// Id of the first button below the legend
const BOTTOM_FIRST_BUTTONS_ID = ['BTN_CHECK_ALL_UPPER']; // [Check all]

export function replaceLegend(): void {
  log('Injecting improved legend');

  const items = getLegendItems(TOP_LAST_BUTTONS_ID, BOTTOM_FIRST_BUTTONS_ID);
  removeOldLegend(TOP_LAST_BUTTONS_ID, BOTTOM_FIRST_BUTTONS_ID);
  createNewLegend(items, TOP_LAST_BUTTONS_ID);
}

function removeOldLegend(firstIds: readonly string[], lastIds: readonly string[]): void {
  const firstId = getExistingElementId(firstIds);
  const lastId = getExistingElementId(lastIds);
  const parent = document.getElementById(firstId)?.parentElement;

  if (!parent || document.getElementById(lastId)?.parentElement !== parent) {
    warn(`#${firstId} and #${lastId} should have the same parents`);
    return;
  }

  let children = Array.from(parent.childNodes) as HTMLElement[];
  let remove = false;
  for (const child of children) {
    if (child.id === lastId) break;
    if (child.id === firstId) {
      remove = true;
      continue;
    }
    if (remove) {
      parent.removeChild(child);
    }
  }

  // remove the extra "<br>" elements left
  const topFirstId = getExistingElementId(TOP_FIRST_BUTTONS_ID);
  const afterBr = document.getElementById(topFirstId);
  children = Array.from(parent.childNodes) as HTMLElement[];
  let elemBrIndex = children.indexOf(afterBr);
  while (children[elemBrIndex - 1].tagName?.toUpperCase() === 'BR') {
    elemBrIndex--;
    parent.removeChild(children[elemBrIndex]);
  }
  // but leave two of them /shrug
  createElement('br', {
    insertTo: afterBr,
    insertPosition: 'beforebegin',
  });
  createElement('br', {
    insertTo: afterBr,
    insertPosition: 'beforebegin',
  });
}

function getLegendItems(firstIds: readonly string[], lastIds: readonly string[]): LegendItem[] {
  const firstId = getExistingElementId(firstIds);
  const lastId = getExistingElementId(lastIds);
  const parent = document.getElementById(firstId)?.parentElement;

  if (!parent || document.getElementById(lastId)?.parentElement !== parent) {
    warn(`#${firstId} and #${lastId} should have the same parents`);
    return;
  }

  // get the text of the desired content only
  const clonedParent = parent.cloneNode(true);
  for (;;) {
    const firstChild = clonedParent.firstChild as HTMLElement;
    clonedParent.removeChild(clonedParent.firstChild);
    if (firstChild.id === firstId) break;
  }

  for (;;) {
    const lastChild = clonedParent.lastChild as HTMLElement;
    clonedParent.removeChild(clonedParent.lastChild);
    if (lastChild.id === lastId) break;
  }

  const colors = Array.from(parent.querySelectorAll('span[class^="mg_"]')).map((elem) => ({
    color: getComputedStyle(elem).backgroundColor,
    className: elem.className,
  }));
  const texts = ((text) => {
    const re = /([^[]*)\[\s*\]/g;
    const res: string[] = [];
    let match = re.exec(text);
    while (match) {
      const preIndex = match[0].indexOf('>');
      const desc = (preIndex === -1 ? match[0] : match[0].substring(preIndex + 1))
        .replace('Background color of ', '')
        .replace(/\[\s+\]/, '')
        .trim();
      res.push(desc);
      match = re.exec(text);
    }
    return res;
  })(clonedParent.textContent);

  if (colors.length !== texts.length) {
    warn('Mismatching number of legend elements');
    return;
  }

  return colors.map((colorData, i) => ({
    ...colorData,
    text: texts[i],
  }));
}

function createNewLegend(items: LegendItem[], lastIds: readonly string[]): HTMLElement {
  const preButton = getElementByIds(lastIds);

  const title = createElement('div', {
    innerHTML: `Row color legend <img src="${chrome.runtime.getURL(
      'icons/icon128.png'
    )}" height="22px">`,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      flexBasis: '100%',
      fontSize: 'larger',
      borderBottom: '1px solid rgba(0,0,0,0.5)',
      marginBottom: '8px',
    },
  });

  const legendItems = items.map(({ color, text, className }) => {
    const box = createElement('div', {
      style: {
        backgroundColor: color,
        width: '13px',
        height: '13px',
        marginRight: '10px',
        border: '1px solid rgba(0,0,0,0.5)',
      },
    });

    const label = createElement('div', {
      innerText: text,
      style: {
        textTransform: 'capitalize',
        opacity: document.querySelector(`.${className}`) ? '1' : '0.5',
      },
    });

    return createElement('div', {
      children: [box, label],
      style: {
        display: 'flex',
        alignItems: 'center',
        width: '33.3%',
      },
    });
  });

  return createElement('div', {
    children: [title, ...legendItems],
    id: 'rhs-plus-legend',
    insertTo: preButton,
    insertPosition: 'afterend',
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      width: '750px',
      margin: '10px',
      padding: '10px',
      border: '1px solid rgba(0,0,0,0.5)',
    },
  });
}

function getElementByIds<E extends HTMLElement = HTMLElement>(ids: readonly string[]): E | null {
  return coalesce(...ids.map((id) => document.getElementById(id))) as E | null;
}

function getExistingElementId<T extends string>(ids: readonly T[]): T | null {
  return coalesce(...ids.map((id) => (document.getElementById(id) ? id : null)));
}
