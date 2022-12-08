import * as fs from 'fs';
import { toXml } from 'xml2json';
import { CoberturaJson } from './types/cobertura';
import { addSelfClosingTags } from './util';

const XML_HEADER = '<?xml version="1.0" ?>\n';

export function writeOutput(outputFile: string, output: CoberturaJson): void {
  const outputXml = XML_HEADER + addSelfClosingTags(toXml(JSON.stringify(output), { sanitize: true }));
  const outputFilename: string = outputFile;

  fs.writeFileSync(outputFilename, outputXml);
}
