import { CoberturaJson } from './types/cobertura';
import * as fs from 'fs';
import { addSelfClosingTags } from './util';
import { XMLBuilder } from 'fast-xml-parser';

const XML_HEADER = '<?xml version="1.0" ?>\n';

export function writeOutput(outputFile: string, output: CoberturaJson): void {
  const outputXml = XML_HEADER + addSelfClosingTags(new XMLBuilder().build(JSON.stringify(output)));
  const outputFilename: string = outputFile;

  fs.writeFileSync(outputFilename, outputXml);
}
