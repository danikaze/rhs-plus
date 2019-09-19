// This function definition takes an object and types all its values as `E`
// but preserving the list of their keys (instead of being an open list like `string`)
type closedObject<E> = <T>(et: { [K in keyof T]: E }) => { [K in keyof T]: E };

const styleDefinitions: closedObject<Partial<CSSStyleDeclaration>> = e => e;

export const classes = styleDefinitions({
  uiContainer: {
    position: 'fixed',
    padding: '15px 5px 5px 5px',
    border: '1px solid grey',
    borderRadius: '5px',
    top: '-10px',
    right: '120px',
    background: 'white',
    boxShadow: '0 0 5px 0px rgba(0,0,0,0.25)',
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
    height: '20px',
  },
  buttonLink: {
    cursor: 'pointer',
    color: 'blue',
    textDecoration: 'underline',
  },
  buttonLinkDisabled: {
    color: 'grey',
  },
  autoFillContainer: {
    position: 'absolute',
    left: '5px',
    bottom: '5px',
  },
  inputDraftContainer: {
    position: 'absolute',
    right: '5px',
    bottom: '5px',
  },
});
