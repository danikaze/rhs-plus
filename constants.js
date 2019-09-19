const packageJson = require('./package.json');

module.exports = {
  APP_VERSION: packageJson.version,
  /** Time before making the stored state invalid (ms) */
  STATE_TIMEOUT: 1000 * 60 * 10, // 10 minutes,

  /** If true, it will output data to the console */
  VERBOSE: true,
  /** Type of input when auto-filling the day data from the gate recording (draft|input) */
  INPUT_TYPE: 'draft',
};
