export interface CoberturaJson {
  coverage: Coverage[];
}

export interface Coverage {
  'line-rate': string;
  'branch-rate': string;
  'lines-covered': string;
  'lines-valid': string;
  'branches-covered': string;
  'branches-valid': string;
  complexity: string;
  version: string;
  timestamp: string;
  sources?: Source[];
  packages: Array<Package | Class | Text>;
}

interface Source {
  source: Array<{
    $t: string;
  }>;
}

export interface Package {
  package: Array<{
    name: string;
    'line-rate': string;
    'branch-rate': string;
    complexity?: string;
    classes?: Class[];
  }>;
}

export interface Class {
  class: Array<{
    name: string;
    filename: string;
    'line-rate': string;
    'branch-rate': string;
    complexity?: string;
    methods: Method[];
    lines: Line[];
  }>;
}

export interface Text {
  $t: string;
}

interface Method {
  method: Array<{
    name: string;
    signature: string;
    'line-rate': string;
    'branch-rate': string;
    complexity?: string;
  }>;
}

interface Line {
  line: Array<{
    hits: string;
    number: string;
    branch?: boolean;
    'condition-coverage'?: string;
    conditions?: Condition[];
  }>;
}

interface Condition {
  condition: Array<{
    number: string;
    type: string;
    coverage: string;
  }>;
}
