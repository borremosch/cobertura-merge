/**
 * Replaces immediately-closing tags with self-closing tags, e.g replaces `<line></line>` with `<line/>`
 *
 * @param xml XML input
 */
export function addSelfClosingTags(xml: string) {
  return xml.replace(/(<([a-zA-Z0-9]+)(\s[^>]*)?)><\/\2>/g, '$1/>');
}

/**
 * flattens an array of arrays
 *
 * @param arr the arrays to merge
 */
export function flatten<T>(arr: T[][]) {
  return ([] as T[]).concat(...arr);
}
