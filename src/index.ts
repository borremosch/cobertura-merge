#!/usr/bin/env node
import 'source-map-support/register';
import parseArgs from 'minimist';
import { validateArgs, getInputDataFromArgs } from './input';
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
  writeOutput(args.o, output);
}
