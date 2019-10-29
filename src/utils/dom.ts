type Style = Partial<CSSStyleDeclaration>;

export interface ElementOptions {
  id?: string;
  style?: Style;
  innerText?: string;
  innerHTML?: string;
  insertTo?: Element;
  insertPosition?: InsertPosition;
  onClick?: (ev: MouseEvent) => void;
}

/**
 * Apply inline style to an element
 */
export function applyStyle<T extends HTMLElement>(elem: T, style: Style): T {
  Object.keys(style).forEach(key => {
    elem.style[key] = style[key];
  });

  return elem;
}

/**
 * Create an element and perform common operations in one call
 */
export function createElement<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  options?: ElementOptions
): HTMLElementTagNameMap[K] {
  const elem = document.createElement(tagName);
  const insertPosition = (options && options.insertPosition) || 'beforeend';

  if (options.id) {
    elem.id = options.id;
  }
  if (options.style) {
    applyStyle(elem, options.style);
  }
  if (options.innerText) {
    elem.innerText = options.innerText;
  } else if (options.innerHTML) {
    elem.innerHTML = options.innerHTML;
  }
  if (options.onClick) {
    elem.addEventListener('click', options.onClick);
  }
  if (options.insertTo) {
    options.insertTo.insertAdjacentElement(insertPosition, elem);
  }

  return elem;
}

/**
 * Return a child of an HTMLElement as a HTMLElement
 */
export function getChild<T extends HTMLElement = HTMLElement>(elem: HTMLElement, n: number): T {
  return elem.children[n] as T;
}
