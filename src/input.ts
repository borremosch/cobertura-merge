import { ParsedArgs } from 'minimist';
import { isArray } from 'util';
import { toJson } from 'xml2json';
import { CoberturaJson } from './types/cobertura';
import * as fs from 'fs';

function printHelp() {
  console.log('Usage: cobertura-merge -o output [package=input]...');
  process.exit();
}

export function validateArgs(args: ParsedArgs) {
  if (args._.length < 3 || !args.o || isArray(args.o)) {
    // Input error
    printHelp();
  }
  const inputArgs = args._.slice(2);
  if (
    inputArgs.some(input => {
      // Check to see if the input is in format package=input
      const matches = input.match(/=/g);
      return !matches || matches.length !== 1 || input.split('=').some(part => !part.trim());
    })
  ) {
    // Input error
    printHelp();
  }
}

export interface InputData {
  packageName: string;
  fileName: string;
  data: CoberturaJson;
}

export function getInputDataFromArgs(args: ParsedArgs): InputData[] {
  return args._.slice(2).map(inputArg => {
    const parts = inputArg.split('=');
    const packageName = parts[0];
    const fileName = parts[1];
    let data = {};
    try {
      data = JSON.parse(
        toJson(fs.readFileSync(fileName, 'utf-8'), {
          arrayNotation: true,
          reversible: true
        })
      );
    } catch (e) {
      console.log(`Unable to read file ${fileName}`);
      process.exit(1);
    }
    return { packageName, fileName, data: data as CoberturaJson };
  });
}
