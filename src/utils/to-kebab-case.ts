export function toKebabCase(str: string): string {
  return str.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);
}
