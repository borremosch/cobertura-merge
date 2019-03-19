import { InputData } from './input';
import { CoberturaJson } from './types/cobertura';
import { flatten } from './util';

const VERSION = '0.1';

export function mergeInputs(inputs: InputData[]): CoberturaJson {
  const totalBranchesCovered = sumCoverageProperty(inputs, 'branches-covered');
  const totalBranchesValid = sumCoverageProperty(inputs, 'branches-valid');
  const totalLinesCovered = sumCoverageProperty(inputs, 'lines-covered');
  const totalLinesValid = sumCoverageProperty(inputs, 'lines-valid');

  return {
    coverage: [
      {
        'branch-rate': (totalBranchesCovered / totalBranchesValid || 0).toString(),
        'branches-covered': totalBranchesCovered.toString(),
        'branches-valid': totalBranchesValid.toString(),
        complexity: Math.max(...inputs.map(input => parseInt(input.data.coverage[0].complexity, 10))).toString(),
        'line-rate': (totalLinesCovered / totalLinesValid || 0).toString(),
        'lines-covered': totalLinesCovered.toString(),
        'lines-valid': totalLinesValid.toString(),
        version: VERSION,
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
}

function sumCoverageProperty(
  inputs: InputData[],
  property: 'lines-covered' | 'lines-valid' | 'branches-covered' | 'branches-valid'
) {
  return inputs.reduce((count: number, input: InputData) => count + parseInt(input.data.coverage[0][property], 10), 0);
}
