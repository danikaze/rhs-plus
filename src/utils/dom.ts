export type Style = Partial<CSSStyleDeclaration> | false | null | undefined;

export interface ElementOptions {
  id?: string;
  style?: Style | Style[];
  innerText?: string;
  innerHTML?: string;
  children?: HTMLElement[];
  insertTo?: Element;
  insertPosition?: InsertPosition;
  attributes?: Record<string, string>;
  onClick?: (ev: MouseEvent) => void;
}

/**
 * Apply inline style to an element
 */
export function applyStyle<T extends HTMLElement>(elem: T, style: Style | Style[]): T {
  const styles = Array.isArray(style) ? style : [style];
  for (const s of styles) {
    if (!s) continue;
    Object.entries(s).forEach(([key, value]) => {
      elem.style[key] = value;
    });
  }

  return elem;
}

/**
 * Create an element and perform common operations in one call
 */
export function createElement<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  options: ElementOptions = {}
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

  if (options.attributes) {
    Object.entries(options.attributes).forEach(([attr, value]) => {
      elem.setAttribute(attr, value);
    });
  }

  if (options.children) {
    options.children.forEach((child) => elem.appendChild(child));
  }

  return elem;
}

/**
 * Return a child of an HTMLElement as the desired HTMLElement subtype
 */
export function getChild<T extends HTMLElement = HTMLElement>(elem: HTMLElement, n: number): T {
  return elem.children[n] as T;
}
