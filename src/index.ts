#!/usr/bin/env node
import parseArgs from 'minimist';
import 'source-map-support/register';
import { getInputDataFromArgs, validateArgs } from './input';
import { mergeInputs } from './merge';
import { writeOutput } from './output';

// Validate input arguments
const args = parseArgs(process.argv);
validateArgs(args);
const inputs = getInputDataFromArgs(args);

// Generate output
const output = mergeInputs(inputs);

if (args.p || args.print) {
  // Print summary to output
  const lineCoverage = parseFloat(output.coverage[0]['line-rate']) * 100;
  const branchCoverage = parseFloat(output.coverage[0]['branch-rate']) * 100;

  console.log(`Total line Coverage: ${lineCoverage.toFixed(2)}%`);
  console.log(`Total branch Coverage: ${branchCoverage.toFixed(2)}%`);
  console.log(`Total average Coverage: ${((lineCoverage + branchCoverage) / 2).toFixed(2)}%`);
}

if (args.o) {
  // Write resulting xml to file
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  writeOutput(args.o, output);
}
