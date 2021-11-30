export type AppMessage = {
  action: 'openOptionsPage';
};

/**
 * Just a wrapper over `runtime.sendMessage` to provide types
 */
export function sendMessage(message: AppMessage): void {
  chrome.runtime.sendMessage(message);
}
