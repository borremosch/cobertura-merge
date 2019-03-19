import { InputData } from './input';

export const EMPTY_INPUT_FILE: InputData = {
  packageName: 'empty',
  fileName: 'emptyfile',
  data: {
    coverage: [
      {
        'line-rate': '1',
        'branch-rate': '1',
        'lines-covered': '0',
        'lines-valid': '0',
        'branches-covered': '0',
        'branches-valid': '0',
        complexity: '0',
        version: '1',
        timestamp: '0',
        packages: [{ package: [] }]
      }
    ]
  }
};

export const INPUT_FILE1: InputData = {
  packageName: 'input1',
  fileName: 'inputfile1',
  data: {
    coverage: [
      {
        'line-rate': '1',
        'branch-rate': '1',
        'lines-covered': '0',
        'lines-valid': '0',
        'branches-covered': '0',
        'branches-valid': '0',
        complexity: '0',
        version: '1',
        timestamp: '0',
        packages: [
          {
            package: [
              {
                'branch-rate': '1',
                'line-rate': '1',
                name: 'package1',
                classes: []
              }
            ]
          }
        ]
      }
    ]
  }
};

export const INPUT_FILE2: InputData = {
  packageName: 'input2',
  fileName: 'inputfile2',
  data: {
    coverage: [
      {
        'line-rate': '1',
        'branch-rate': '1',
        'lines-covered': '0',
        'lines-valid': '0',
        'branches-covered': '0',
        'branches-valid': '0',
        complexity: '0',
        version: '1',
        timestamp: '0',
        packages: [
          {
            package: [
              {
                'branch-rate': '1',
                'line-rate': '1',
                name: '.',
                classes: []
              }
            ]
          }
        ]
      }
    ]
  }
};
