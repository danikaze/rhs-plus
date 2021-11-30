import { AppMessage } from './utils/send-message';

chrome.runtime.onMessage.addListener(({ action }: AppMessage) => {
  if (action === 'openOptionsPage') {
    chrome.runtime.openOptionsPage();
    return;
  }
});
