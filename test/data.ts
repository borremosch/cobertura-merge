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
        sources: [
          {
            source: [
              {
                $t: 'source'
              }
            ]
          }
        ],
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
        sources: [
          {
            source: [
              {
                $t: 'source1.1'
              },
              {
                $t: 'source1.2'
              }
            ]
          }
        ],
        packages: [
          {
            package: [
              {
                'branch-rate': '1',
                'line-rate': '1',
                name: 'package1',
                classes: [
                  {
                    class: [
                      {
                        name: 'main',
                        filename: 'main.ts',
                        'line-rate': '0,5',
                        'branch-rate': '0.5',
                        methods: [],
                        lines: []
                      }
                    ]
                  }
                ]
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
        sources: [
          {
            source: [
              {
                $t: 'source2.1'
              },
              {
                $t: 'source2.2'
              }
            ]
          }
        ],
        packages: [
          {
            package: [
              {
                'branch-rate': '1',
                'line-rate': '1',
                name: '.',
                classes: [
                  {
                    class: [
                      {
                        name: 'index',
                        filename: 'index.ts',
                        'line-rate': '1',
                        'branch-rate': '1',
                        methods: [],
                        lines: []
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
};

export const INPUT_FILE_WITH_ROOT_CLASSES: InputData = {
  packageName: 'input3',
  fileName: 'inputfile3',
  data: {
    coverage: [
      {
        'line-rate': '0.7',
        'branch-rate': '0.7',
        'lines-covered': '21',
        'lines-valid': '30',
        'branches-covered': '7',
        'branches-valid': '10',
        complexity: '0',
        version: '1',
        timestamp: '0',
        sources: [
          {
            source: [
              {
                $t: 'source_with_root_classes'
              }
            ]
          }
        ],
        packages: [
          {
            class: [
              {
                name: 'util',
                filename: 'util.ts',
                'line-rate': '0.8',
                'branch-rate': '0.8',
                methods: [],
                lines: []
              }
            ]
          }
        ]
      }
    ]
  }
};
