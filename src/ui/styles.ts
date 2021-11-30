// This function definition takes an object and types all its values as `E`
// but preserving the list of their keys (instead of being an open list like `string`)
type closedObject<E> = <T>(et: { [K in keyof T]: E }) => { [K in keyof T]: E };

const styleDefinitions: closedObject<Partial<CSSStyleDeclaration>> = (e) => e;

export const classes = styleDefinitions({
  uiContainer: {
    position: 'fixed',
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid grey',
    borderRadius: '5px',
    top: '-10px',
    right: '120px',
    background: 'white',
    boxShadow: '0 0 5px 0px rgba(0,0,0,0.25)',
    overflow: 'hidden',
    transition: 'top 300ms ease',
  },
  uiContainerHidden: {
    top: '-106px',
  },
  uiContainerTop: {
    padding: '15px 5px 5px 5px',
  },
  uiContainerBottom: {
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'center',
    height: '7px',
    fontSize: '6px',
    background: '#dddddd',
    cursor: 'pointer',
  },
  uiSettingsButton: {
    cursor: 'pointer',
    position: 'absolute',
    top: '6px',
    right: '8px',
    fontWeight: 'bold',
    fontSize: '20px',
    color: 'grey',
  },
  uiToggleButton: {
    width: '100%',
  },
  summaryInputted: {
    color: '#cccc99',
  },
  summaryHoliday: {
    color: '#d584e0',
  },
  summaryDraft: {
    color: '#49bd49',
  },
  summaryPending: {
    color: '#a2a2a2',
  },
  buttonsContainer: {
    minWidth: '230px',
    marginTop: '5px',
  },
  buttonLink: {
    cursor: 'pointer',
    color: 'blue',
    textDecoration: 'underline',
  },
  buttonLinkDisabled: {
    color: 'grey',
  },
  dateCol: {
    display: 'flex',
    alignItems: 'center',
  },
  dateCheckbox: {
    margin: '0 5px',
  },
  dateLabel: {
    flexGrow: '1',
    textAlign: 'center',
  },
  listGreyButtons: {
    margin: '5px',
    padding: '1px 5px',
  },
});
