import { ParsedArgs } from 'minimist';
import { isArray, isString } from 'util';
import { XMLParser } from 'fast-xml-parser';
import { CoberturaJson } from './types/cobertura';
import * as fs from 'fs';
import * as path from 'path';

interface PackageJson {
  version: string;
}

function printHelp() {
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../../package.json')).toString('utf-8')
  ) as PackageJson;

  console.log(`Version ${packageJson.version}`);
  console.log('Syntax:    cobertura-merge [options]... [package=input...]');
  console.log('');
  console.log('Examples:  cobertura-merge -o output.xml package1=output1.xml package2=output2.xml');
  console.log('           cobertura-merge -p package1=output1.xml package2=output2.xml');
  console.log('');
  console.log('Options');
  console.log('-o FILE         Specify output file');
  console.log('-p, --print     print coverage report summary');
  process.exit();
}

const KNOWN_ARGS = ['_', 'o', 'p', 'print'];

export function validateArgs(args: ParsedArgs): void {
  // Check for unknown arguments
  const unknownArg = Object.keys(args).find((arg) => KNOWN_ARGS.indexOf(arg) === -1);
  if (unknownArg) {
    console.log(`Unknown argument ${unknownArg}\n`);
    printHelp();
    process.exit(1);
  }

  if (args._.length < 3 || args.o === true || isArray(args.o) || isString(args.p) || isArray(args.p)) {
    // Input error
    printHelp();
  }
  const inputArgs = args._.slice(2);
  if (
    inputArgs.some((input) => {
      // Check to see if the input is in format package=input
      const matches = input.match(/=/g);
      return !matches || matches.length !== 1 || input.split('=').some((part) => !part.trim());
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
  return args._.slice(2).map((inputArg) => {
    const parts = inputArg.split('=');
    const packageName = parts[0];
    const fileName = parts[1];
    let data: CoberturaJson;
    try {
      data = JSON.parse(new XMLParser().parse(fs.readFileSync(fileName, 'utf-8'))) as CoberturaJson;
    } catch (e) {
      console.log(`Unable to read file ${fileName}`);
      process.exit(1);
    }
    return {
      packageName,
      fileName,
      data,
    };
  });
}
