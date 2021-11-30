import { classes } from '../ui/styles';
import { applyStyle } from '../utils/dom';

/**
 * Move the "Submit checked attendance data" near the "Check all" and
 * "Clear check" buttons.
 * Also, add some margins
 */
export function fixButtonLayout() {
  // Move the position of the buttons
  const clearCheckBtn = document.getElementById('BTN_RELEASE_ALL_LOWER');
  const submitButton = document.getElementById('DCMLTSBMT');
  if (clearCheckBtn && submitButton) {
    clearCheckBtn.insertAdjacentElement('afterend', submitButton);
  }

  // Add some margins
  [
    'BTN_CHECK_ALL_UPPER',
    'BTN_RELEASE_ALL_UPPER',
    'BTN_CHECK_ALL_LOWER',
    'BTN_RELEASE_ALL_LOWER',
    'DCMLTSBMT',
  ].forEach((id) => {
    const btn = document.getElementById(id);
    btn && applyStyle(btn, classes.listGreyButtons);
  });
}
