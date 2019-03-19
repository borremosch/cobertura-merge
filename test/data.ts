import { InputData } from './input';

export const EMPTY_INPUT_FILE: InputData = {
  packageName: 'empty',
  fileName: 'emptyfile',
  data: {
    coverage: [
      {
        'line-rate': '0',
        'branch-rate': '0',
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
        'line-rate': '0.5',
        'branch-rate': '0.5',
        'lines-covered': '15',
        'lines-valid': '30',
        'branches-covered': '12',
        'branches-valid': '24',
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
        'line-rate': '0.8',
        'branch-rate': '0.8',
        'lines-covered': '16',
        'lines-valid': '20',
        'branches-covered': '32',
        'branches-valid': '40',
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
