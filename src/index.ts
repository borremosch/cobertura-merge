import parseArgs from 'minimist';
import { isArray } from 'util';
import * as fs from 'fs';
import { toJson, toXml } from 'xml2json';
import { addSelfClosingTags, flatten } from './util';
import { CoberturaJson } from './types/cobertura';

const XML_HEADER = '<?xml version="1.0" ?>\n';

function printHelp() {
  console.log('Usage: cobertura-merge -o output [package=input]...');
  process.exit();
}

// Validate input arguments
const args = parseArgs(process.argv);

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

// Get input
const inputs = inputArgs.map(inputArg => {
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

// Generate output
const output: CoberturaJson = {
  coverage: [
    {
      'branch-rate': inputs[0].data.coverage[0]['branch-rate'],
      'branches-covered': inputs[0].data.coverage[0]['branches-covered'],
      'branches-valid': inputs[0].data.coverage[0]['branches-valid'],
      complexity: inputs[0].data.coverage[0].complexity,
      'line-rate': inputs[0].data.coverage[0]['line-rate'],
      'lines-covered': inputs[0].data.coverage[0]['lines-covered'],
      'lines-valid': inputs[0].data.coverage[0]['lines-valid'],
      version: '0.1',
      timestamp: Date.now().toString(),
      sources: flatten(inputs.map(input => input.data.coverage[0].sources || [])),
      packages: [
        {
          package: flatten(
            inputs.map(input => {
              return input.data.coverage[0].packages[0].package.map(jsonPackage => ({
                name: jsonPackage.name === '.' ? input.packageName : `${input.packageName}.${jsonPackage.name}`,
                'line-rate': jsonPackage['line-rate'],
                'branch-rate': jsonPackage['branch-rate'],
                complexity: jsonPackage.complexity,
                classes: jsonPackage.classes
              }));
            })
          )
        }
      ]
    }
  ]
};

// Write output
const outputXml = XML_HEADER + addSelfClosingTags(toXml(JSON.stringify(output)));
const outputFilename: string = args.o;

fs.writeFileSync(outputFilename, outputXml);
