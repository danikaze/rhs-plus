export function getAncestor<E extends HTMLElement>(
  from: HTMLElement,
  query: string,
  includeFrom?: boolean
): E | null {
  let elem = includeFrom ? from : from.parentElement;

  while (elem && elem.parentElement) {
    const options = Array.from(elem.parentElement.querySelectorAll(query));
    if (options.includes(elem)) {
      return elem as E;
    }
    elem = elem.parentElement;
  }

  return null;
}
