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

// Write output
writeOutput(args, output);
