import { InputData } from './input';
import { CoberturaJson, Package, Class, Text } from './types/cobertura';
import { flatten } from './util';
import * as path from 'path';

const VERSION = '0.1';

function rewriteBasedir(originalBaseDir: string, classes?: Class[]) {
  return (
    classes?.map((jsonClass) => ({
      class:
        jsonClass.class?.map((jsonInnerClass) => {
          return {
            ...jsonInnerClass,
            filename: path.relative(process.cwd(), path.join(originalBaseDir, jsonInnerClass.filename)),
          };
        }) ?? [],
    })) ?? []
  );
}

export function mergeInputs(inputs: InputData[]): CoberturaJson {
  const totalBranchesCovered = sumCoverageProperty(inputs, 'branches-covered');
  const totalBranchesValid = sumCoverageProperty(inputs, 'branches-valid');
  const totalLinesCovered = sumCoverageProperty(inputs, 'lines-covered');
  const totalLinesValid = sumCoverageProperty(inputs, 'lines-valid');
  const branchRate = (totalBranchesCovered / totalBranchesValid || 0).toString();
  const lineRate = (totalLinesCovered / totalLinesValid || 0).toString();
  const complexity = Math.max(...inputs.map((input) => parseInt(input.data.coverage[0].complexity, 10))).toString();

  return {
    coverage: [
      {
        'branch-rate': branchRate,
        'branches-covered': totalBranchesCovered.toString(),
        'branches-valid': totalBranchesValid.toString(),
        complexity,
        'line-rate': lineRate,
        'lines-covered': totalLinesCovered.toString(),
        'lines-valid': totalLinesValid.toString(),
        version: VERSION,
        timestamp: Date.now().toString(),
        sources: [
          {
            source: [
              {
                $t: process.cwd(),
              },
            ],
          },
        ],
        packages: [
          {
            package: flatten(
              inputs.map((input) => {
                const originalBaseDir = input.data.coverage[0].sources?.[0].source[0].$t ?? '';

                return flatten(
                  input.data.coverage[0].packages.map((packages) => {
                    if ((packages as Package).package) {
                      return (packages as Package).package.map((jsonPackage) => ({
                        name: jsonPackage.name === '.' ? input.packageName : `${input.packageName}.${jsonPackage.name}`,
                        'line-rate': jsonPackage['line-rate'],
                        'branch-rate': jsonPackage['branch-rate'],
                        complexity: jsonPackage.complexity,
                        classes: rewriteBasedir(originalBaseDir, jsonPackage.classes),
                      }));
                    } else if ((packages as Class).class) {
                      return [
                        {
                          name: input.packageName,
                          'line-rate': lineRate,
                          'branch-rate': branchRate,
                          complexity,
                          classes: rewriteBasedir(
                            originalBaseDir,
                            (packages as Class).class.map(
                              (jsonClass) =>
                                ({
                                  class: [jsonClass],
                                } as Class)
                            )
                          ),
                        },
                      ];
                    } else if ((packages as Text).$t !== undefined) {
                      // No packages
                      return [];
                    } else {
                      throw new Error('Unknown package format: ' + JSON.stringify(packages));
                    }
                  })
                );
              })
            ),
          },
        ],
      },
    ],
  };
}

function sumCoverageProperty(
  inputs: InputData[],
  property: 'lines-covered' | 'lines-valid' | 'branches-covered' | 'branches-valid'
) {
  return inputs.reduce((count: number, input: InputData) => count + parseInt(input.data.coverage[0][property], 10), 0);
}
