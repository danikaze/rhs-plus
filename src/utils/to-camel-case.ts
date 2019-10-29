export function toCamelCase(str: string): string {
  return str.replace(/(-.)/g, ([dash, char]) => char.toUpperCase());
}
