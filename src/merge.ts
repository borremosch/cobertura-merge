import { InputData } from './input';
import { CoberturaJson } from './types/cobertura';
import { flatten } from './util';

export function mergeInputs(inputs: InputData[]): CoberturaJson {
  return {
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
}
