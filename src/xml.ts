type XmlObject = { [key: string]: XmlValue };
type XmlValue = string | number | boolean | null | XmlObject | XmlValue[];

interface XmlFrame {
  name: string;
  value: XmlObject;
}

function createObject(): XmlObject {
  return Object.create(null) as XmlObject;
}

function decodeEntities(value: string): string {
  return value.replace(/&([^;]*);|&/g, function (match: string, entity: string): string {
    switch (entity) {
      case 'amp': return '&';
      case 'lt': return '<';
      case 'gt': return '>';
      case 'quot': return '"';
      case 'apos': return "'";
    }

    if (entity && /^#(?:[0-9]+|x[0-9a-fA-F]+)$/.test(entity)) {
      const hexadecimal = entity.charAt(1) === 'x';
      const codePoint = parseInt(entity.substring(hexadecimal ? 2 : 1), hexadecimal ? 16 : 10);
      const valid =
        codePoint === 0x09 ||
        codePoint === 0x0a ||
        codePoint === 0x0d ||
        (codePoint >= 0x20 && codePoint <= 0xd7ff) ||
        (codePoint >= 0xe000 && codePoint <= 0xfffd) ||
        (codePoint >= 0x10000 && codePoint <= 0x10ffff);

      if (valid) {
        return String.fromCodePoint(codePoint);
      }
    }

    throw new Error('Invalid or unsupported XML entity: ' + match);
  });
}

function escapeXml(value: string): string {
  return value.replace(/[&<>"']/g, function (character: string): string {
    switch (character) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      default: return '&apos;';
    }
  });
}

export function toJson(
  xml: string,
  options?: { arrayNotation?: boolean; reversible?: boolean }
): string {
  const arrayNotation = !!(options && options.arrayNotation);
  const reversible = !!(options && options.reversible);
  const result = createObject();
  const stack: XmlFrame[] = [];
  const source = xml.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
  let position = 0;
  let rootCount = 0;
  let hasDoctype = false;

  function fail(message: string): never {
    throw new Error(message + ' at XML position ' + position);
  }

  function skipWhitespace(): void {
    while (position < source.length && /[ \t\n\r]/.test(source.charAt(position))) {
      position++;
    }
  }

  function readName(): string {
    const start = position;
    while (
      position < source.length &&
      !/[ \t\n\r/<>="'?!]/.test(source.charAt(position))
    ) {
      position++;
    }

    const name = source.substring(start, position);
    if (!name || /^[0-9.\-]/.test(name)) {
      fail('Expected XML name');
    }
    return name;
  }

  function addElement(parent: XmlObject, name: string, value: XmlValue): void {
    if (!Object.prototype.hasOwnProperty.call(parent, name)) {
      parent[name] = arrayNotation ? [value] : value;
    } else {
      const previous = parent[name];
      if (Array.isArray(previous)) {
        previous.push(value);
      } else {
        parent[name] = [previous, value];
      }
    }
  }

  function appendText(text: string): void {
    if (stack.length === 0) {
      if (text.trim() !== '') {
        fail('Text outside the root element');
      }
      return;
    }

    const value = stack[stack.length - 1].value;
    if (Object.prototype.hasOwnProperty.call(value, '$t')) {
      value.$t = String(value.$t) + text;
    } else if (text.trim() !== '') {
      value.$t = text;
    }
  }

  function finishElement(frame: XmlFrame): void {
    if (typeof frame.value.$t === 'string') {
      const text = frame.value.$t.trim();
      if (text) {
        frame.value.$t = text;
      } else {
        delete frame.value.$t;
      }
    }

    let value: XmlValue = frame.value;
    if (
      !reversible &&
      Object.keys(frame.value).length === 1 &&
      typeof frame.value.$t === 'string'
    ) {
      value = frame.value.$t;
    }

    const parent = stack.length > 0 ? stack[stack.length - 1].value : result;
    addElement(parent, frame.name, value);
  }

  function skipDoctype(): void {
    position += '<!DOCTYPE'.length;
    let quote = '';
    let bracketDepth = 0;

    while (position < source.length) {
      const character = source.charAt(position);

      if (quote) {
        if (character === quote) {
          quote = '';
        }
        position++;
        continue;
      }

      if (source.substring(position, position + 4) === '<!--') {
        const end = source.indexOf('-->', position + 4);
        if (end === -1) {
          fail('Unterminated DOCTYPE comment');
        }
        position = end + 3;
        continue;
      }

      if (source.substring(position, position + 2) === '<?') {
        const end = source.indexOf('?>', position + 2);
        if (end === -1) {
          fail('Unterminated DOCTYPE processing instruction');
        }
        position = end + 2;
        continue;
      }

      position++;
      if (character === '"' || character === "'") {
        quote = character;
      } else if (character === '[') {
        bracketDepth++;
      } else if (character === ']') {
        bracketDepth--;
        if (bracketDepth < 0) {
          fail('Invalid DOCTYPE');
        }
      } else if (character === '>' && bracketDepth === 0) {
        return;
      }
    }

    fail('Unterminated DOCTYPE');
  }

  while (position < source.length) {
    if (source.charAt(position) !== '<') {
      const next = source.indexOf('<', position);
      const end = next === -1 ? source.length : next;
      const text = source.substring(position, end);
      if (text.indexOf(']]>') !== -1) {
        fail('Invalid XML text');
      }
      appendText(decodeEntities(text));
      position = end;
      continue;
    }

    if (source.substring(position, position + 4) === '<!--') {
      const end = source.indexOf('-->', position + 4);
      if (end === -1) {
        fail('Unterminated XML comment');
      }
      position = end + 3;
      continue;
    }

    if (source.substring(position, position + 2) === '<?') {
      const end = source.indexOf('?>', position + 2);
      if (end === -1) {
        fail('Unterminated processing instruction');
      }
      position = end + 2;
      continue;
    }

    if (source.substring(position, position + 9) === '<![CDATA[') {
      if (stack.length === 0) {
        fail('CDATA outside the root element');
      }
      const end = source.indexOf(']]>', position + 9);
      if (end === -1) {
        fail('Unterminated CDATA section');
      }
      appendText(source.substring(position + 9, end));
      position = end + 3;
      continue;
    }

    if (source.substring(position, position + 9) === '<!DOCTYPE') {
      if (hasDoctype || rootCount > 0 || !/[ \t\n\r]/.test(source.charAt(position + 9))) {
        fail('Invalid DOCTYPE placement');
      }
      hasDoctype = true;
      skipDoctype();
      continue;
    }

    if (source.substring(position, position + 2) === '</') {
      position += 2;
      const name = readName();
      skipWhitespace();
      if (source.charAt(position) !== '>') {
        fail('Expected closing tag terminator');
      }
      position++;

      const frame = stack.pop();
      if (!frame || frame.name !== name) {
        fail('Mismatched closing tag: ' + name);
      }
      finishElement(frame);
      continue;
    }

    if (source.substring(position, position + 2) === '<!') {
      fail('Unsupported XML declaration');
    }

    position++;
    const name = readName();
    const value = createObject();
    let selfClosing = false;

    while (true) {
      const beforeWhitespace = position;
      skipWhitespace();

      if (source.substring(position, position + 2) === '/>') {
        position += 2;
        selfClosing = true;
        break;
      }

      if (source.charAt(position) === '>') {
        position++;
        break;
      }

      if (position >= source.length) {
        fail('Unterminated opening tag');
      }
      if (position === beforeWhitespace) {
        fail('Expected whitespace before attribute');
      }

      const attribute = readName();
      if (Object.prototype.hasOwnProperty.call(value, attribute)) {
        fail('Duplicate attribute: ' + attribute);
      }

      skipWhitespace();
      if (source.charAt(position) !== '=') {
        fail('Expected attribute equals sign');
      }
      position++;
      skipWhitespace();

      const quote = source.charAt(position);
      if (quote !== '"' && quote !== "'") {
        fail('Expected quoted attribute value');
      }
      position++;

      const end = source.indexOf(quote, position);
      if (end === -1) {
        fail('Unterminated attribute value');
      }

      const rawValue = source.substring(position, end);
      if (rawValue.indexOf('<') !== -1) {
        fail('Unescaped less-than sign in attribute');
      }
      value[attribute] = decodeEntities(rawValue.replace(/[\t\n\r]/g, ' '));
      position = end + 1;
    }

    if (stack.length === 0) {
      rootCount++;
      if (rootCount > 1) {
        fail('Multiple root elements');
      }
    }

    const frame: XmlFrame = { name: name, value: value };
    if (selfClosing) {
      finishElement(frame);
    } else {
      stack.push(frame);
    }
  }

  if (stack.length !== 0) {
    fail('Unclosed element: ' + stack[stack.length - 1].name);
  }
  if (rootCount === 0) {
    fail('Missing root element');
  }

  return JSON.stringify(result);
}

export function toXml(json: string, options?: { sanitize?: boolean }): string {
  const sanitize = !options || options.sanitize !== false;
  const document: XmlValue = JSON.parse(json);

  function format(value: XmlValue): string {
    const text = value === null ? '' : String(value);
    return sanitize ? escapeXml(text) : text;
  }

  function writeElement(name: string, value: XmlValue): string {
    if (Array.isArray(value)) {
      return value.map(function (item: XmlValue): string {
        return writeElement(name, item);
      }).join('');
    }

    let attributes = '';
    let content = '';

    if (value !== null && typeof value === 'object') {
      Object.keys(value).forEach(function (key: string): void {
        const item = value[key];

        if (key === '$t') {
          content += format(item);
        } else if (item !== null && typeof item === 'object') {
          content += writeElement(key, item);
        } else if (item !== null) {
          attributes += ' ' + key + '="' + format(item) + '"';
        }
      });
    } else if (value !== null) {
      content = format(value);
    }

    return '<' + name + attributes + '>' + content + '</' + name + '>';
  }

  if (document === null || typeof document !== 'object' || Array.isArray(document)) {
    throw new Error('Expected a JSON object containing XML elements');
  }

  return Object.keys(document).map(function (name: string): string {
    return writeElement(name, document[name]);
  }).join('');
}
