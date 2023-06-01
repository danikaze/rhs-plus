import { applyStyle, createElement, Style } from './dom';
import { LogLevel, readLogs, StoredLog } from './log';

const LOG_STYLE: { [level in LogLevel]: Style } = {
  log: { color: '#00f' },
  warn: { color: '#f90' },
  error: { color: '#f00' },
};

const LOGS_MODAL_ID = 'rhs-logs';
let modalContainer: HTMLDivElement;
let modalInstance: {
  open: () => { $overlay?: HTMLDivElement[] };
  close: () => void;
  destroy: () => void;
};

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById(LOGS_MODAL_ID);
  modalInstance = M.Modal.init(container, {
    dismissible: true,
  });

  modalContainer = container.querySelector('.modal-content');

  const modalHeader = container.parentElement.querySelector<HTMLDivElement>('.modal-header');
  const modalFooter = container.parentElement.querySelector<HTMLDivElement>('.modal-footer');

  applyStyle(modalContainer, { padding: '0 24px' });
  applyStyle(modalHeader, { position: 'sticky', top: '0', background: '#fafafa' });
  applyStyle(modalFooter, { position: 'sticky', bottom: '0' });

  const closeButton = container.querySelector('.modal-close');
  closeButton.addEventListener('click', () => modalInstance.close());
});

export async function showLogs(): Promise<void> {
  await renderLogs();
  const res = modalInstance.open();
  const overlay = res?.$overlay[0];
  if (overlay) {
    const closeModal = () => {
      modalInstance.close();
      overlay.removeEventListener('click', closeModal);
    };
    overlay.addEventListener('click', closeModal);
  }
}

async function renderLogs(): Promise<HTMLElement> {
  modalContainer.innerHTML = '';

  const logs = await readLogs();
  if (!logs || logs.length === 0) {
    return createElement('div', {
      innerHTML: 'No logs to display',
    });
  }

  const logList = logs.map((log) => renderLogLine(log));
  return createElement('ul', {
    children: logList,
    insertTo: modalContainer,
  });
}

function renderLogLine<K extends keyof HTMLElementTagNameMap>(
  log: StoredLog,
  elem?: K
): HTMLElement {
  return createElement(elem || 'li', {
    style: LOG_STYLE[log.level],
    children: [
      createElement('span', {
        innerText: `${time2string(log.time)}: `,
      }),
      ...log.args.map(renderLogArgument),
    ],
  });
}

function time2string(timestamp: number): string {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  const secs = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hour}:${min}:${secs}`;
}

function renderLogArgument(data: unknown): HTMLElement {
  const style = { marginRight: '8px' };
  if (typeof data !== 'object') {
    return createElement('span', { style, innerText: data.toString() });
  }

  return createElement('span', { style, children: [renderObject(data)] });
}

function renderData(data: unknown): HTMLElement {
  const type = typeof data;
  if (type === 'boolean') return renderBoolean(data as boolean);
  if (type === 'string') return renderString(data as string);
  if (type === 'number') return renderNumber(data as number);
  if (type === 'object') return renderObject(data as {});
}

function renderString(data: string): HTMLElement {
  return createElement('span', { style: { color: 'red' }, innerText: `"${data}"` });
}

function renderNumber(data: number): HTMLElement {
  return createElement('span', { style: { color: 'blue' }, innerText: String(data) });
}

function renderBoolean(data: boolean): HTMLElement {
  return createElement('span', { style: { color: 'blue' }, innerText: String(data) });
}

function renderKey(data: string): HTMLElement {
  return createElement('span', {
    style: { color: 'purple', fontWeight: 'bold' },
    innerText: `${data}: `,
  });
}

function renderObject<T extends {}>(data: T): HTMLElement {
  const desc = Array.isArray(data) ? `Array(${data.length})` : `Object`;
  const textClosed = `▶︎ ${desc}`;
  const textOpen = `▼ ${desc}`;

  const content = createElement('div', {
    style: { display: 'none' },
  });
  const expand = createElement('span', {
    innerText: textClosed,
    style: { cursor: 'pointer' },
    onClick: () => {
      if (expand.innerText === textClosed) {
        expand.innerText = textOpen;
        applyStyle(content, {
          display: '',
          paddingLeft: '8px',
          whiteSpace: '',
          overflow: '',
        });
        if (content.innerHTML === '') {
          // lazy-render the object to the 1st time is opened
          content.append(...renderObjectContent(data));
        }
      } else {
        expand.innerText = textClosed;
        applyStyle(content, {
          display: 'none',
          paddingLeft: '',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
        });
      }
    },
  });

  return createElement('span', {
    children: [expand, content],
  });
}

function renderObjectContent<T extends {}>(data: T): HTMLElement[] {
  return Object.entries(data).map(([key, value]) =>
    createElement('div', { children: [renderKey(key), renderData(value)] })
  );
}
