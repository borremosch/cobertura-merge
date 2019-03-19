import { ParsedArgs } from 'minimist';
import { CoberturaJson } from './types/cobertura';
import * as fs from 'fs';
import { addSelfClosingTags } from './util';
import { toXml } from 'xml2json';

const XML_HEADER = '<?xml version="1.0" ?>\n';

export function writeOutput(args: ParsedArgs, output: CoberturaJson) {
  const outputXml = XML_HEADER + addSelfClosingTags(toXml(JSON.stringify(output)));
  const outputFilename: string = args.o;

  fs.writeFileSync(outputFilename, outputXml);
}
