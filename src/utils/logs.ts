import { createElement, Style } from './dom';
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
  const time = time2string(log.time);
  const text = log.args;
  const html = `
    <span class="log-time">[${time}]<span>
    <span class="log-content">${text}</span>
  `;
  return createElement(elem || 'li', {
    innerHTML: html,
    style: LOG_STYLE[log.level],
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
