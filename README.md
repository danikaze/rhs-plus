# RHS Plus

Provide extra information and automatic actions for RHS pages

## How to install it in Chrome

1. Install the extension from the [Chrome Store](https://bit.ly/rhsplus)

## Change log

### Future features

- Better display of working hours (color-based)
- Set rules to input hours/ignore days based on criteria (_i.e. don't register work hours if the working time is less than 3 hours in a weekend_)
- Add anotations in the list page to be applied by the auto filler (_i.e. comments to be input in a day, etc._)

### 0.6.3

- Consider old salary/bonus statement pages the same as the latest salary/bonus ones to provide translations

### 0.6.2

- Update column definitions

### 0.6.1

- Fix: do not fail when required elements (i.e. checkboxes) don't exist
- Provide a button to display the options page from the UI (rather than the extension icon which is hidden depending on user settings)

### 0.6.0

- Delay the RhsTable initialization until needed to avoid accessing unexisting tables
- Button to toggle the UI panel in the attendance page
- Enable shift+click on attendance page checkboxes for multi-selection and other UI improvements

### 0.5.1

- Support new column in RHS: `Data of accumulated holidays` with a colspan of 3
- Bugfix: favicon (manifest declaration for accessing extension resources)

### 0.5.0

- Translate the wage details and bonus details pages from Japanese to English

### 0.4.1

- Store upgraded settings
- Bugfix: Days from previous months are auto-draftable now

### 0.4.0

- Handle the case where the entry and the exit day are not the same
- Clipping time is disabled by default. Can be enabled again in the options page

### 0.3.0

- Skip non draftable days due to an error (i.e. when you need to manually input rest-hours)
- Added options to display or hide columns

### 0.2.1

- Allow to re-auto-draft/input already drafted days
- Added a button in the Options page to reset the State, in case the application gets weird.

### 0.2.0

- Options page added with:

  - Can choose between draft or input when auto-filling information
  - Settings by day type or weekday
    - Can add an offset between starting/finishing work from the gate recording data
    - Clip start and end hours between the specified range

- Bugfix:
  - Sometimes the auto-filling process stopped when it shouldn't

### 0.1.0

First release with:

- Auto:
  - draft day hours
  - input drafted days
- Improved info:
  - Average worked hours per day
