import { log, warn } from './utils/log';
import { AppMessage } from './utils/send-message';
import { loadSettings } from './utils/settings';
import { loadState } from './utils/state';
import { getNextWorkingDay } from './utils/state-queries';

type NotificationButton = chrome.notifications.ButtonOptions;

const ONE_DAY_MS = 86400000;
const NOTIFICATION_BUTTON_DISMISS: NotificationButton = { title: 'Dismiss' };
const NOTIFICATION_BUTTON_SNOOZE: NotificationButton = { title: 'Snooze' };
const NOTIFICATION_BUTTON_SETTINGS: NotificationButton = { title: 'Settings' };
const NOTIFICATION_BUTTONS = [
  NOTIFICATION_BUTTON_DISMISS,
  NOTIFICATION_BUTTON_SNOOZE,
  NOTIFICATION_BUTTON_SETTINGS,
];
const NOTIFICATION_SNOOZE_TIME = 10000; //15 * 60 * 1000;

let notificationTimerId: ReturnType<typeof setTimeout>;
let nextNotificationTime = 0;

setNotificationTimer(false);

chrome.runtime.onMessage.addListener((msg: AppMessage) => {
  const { action } = msg;

  if (action === 'openOptionsPage') {
    chrome.runtime.openOptionsPage();
    return true;
  }

  if (action === 'settingsUpdated' || action === 'stateUpdated') {
    setNotificationTimer(false);
    return true;
  }

  return false;
});

chrome.notifications.onButtonClicked.addListener((id, index) => {
  if (index === NOTIFICATION_BUTTONS.indexOf(NOTIFICATION_BUTTON_SNOOZE)) {
    setNotificationTimer(true);
  }
  // chrome bug? settings button is added automatically
  // and even if it's added manually, doesn't trigger the clicked
  if (index === NOTIFICATION_BUTTONS.indexOf(NOTIFICATION_BUTTON_SETTINGS)) {
    chrome.runtime.openOptionsPage();
  }
});

async function setNotificationTimer(snoozed: boolean) {
  const waitTime = await getNextNotificationTime(snoozed);
  if (waitTime === 'no-change') return;

  clearTimeout(notificationTimerId);
  if (waitTime === 'cancel') {
    log('Reminder cancelled');
    return;
  }

  if (isNaN(waitTime)) {
    warn(`Reminder cancelled due to invalid time: ${waitTime}`);
    return;
  }

  notificationTimerId = setTimeout(displayReminderNotification, waitTime);
  const nextTimeStr = new Date(nextNotificationTime).toLocaleString('ja');
  log(
    `Next reminder to be displayed in ${waitTime} ms. [${nextTimeStr}] (${
      snoozed ? 'snoozed' : 'planned'
    })`
  );
}

/**
 * If there are no changes to do, return `undefined`
 */
async function getNextNotificationTime(
  snoozed?: boolean
): Promise<number | 'no-change' | 'cancel'> {
  if (snoozed) return NOTIFICATION_SNOOZE_TIME;
  const settings = await loadSettings();

  if (!settings.reminderEnabled) return 'cancel';

  const state = await loadState();
  const now = new Date();
  let reminder = getNextWorkingDay(state, settings.reminderTime).getTime();
  if (reminder - now.getTime() <= 0) {
    reminder += ONE_DAY_MS;
  }

  if (Math.abs(reminder - nextNotificationTime) < 1000) return 'no-change';
  nextNotificationTime = reminder;

  return reminder - now.getTime();
}

function displayReminderNotification(): void {
  // by default, queue the next notification as planned
  // (if it's snoozed, it will be re-scheduled)
  setNotificationTimer(false);
  // display it
  chrome.notifications.create('rhs-reminder', {
    type: 'basic',
    title: 'RHS+',
    message: 'Reminder: Input hours',
    iconUrl: chrome.runtime.getURL('icons/icon256.png'),
    buttons: NOTIFICATION_BUTTONS,
  });
}
