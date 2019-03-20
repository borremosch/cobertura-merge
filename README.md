Utility to merge multiple cobertura xml files into one.

## Usage

It can be installed through `npm` and used locally:

```
npm install cobertura-merge
cobertura -merge -o output.xml package1=input1.xml package2=input2.xml
```

Or it can be used directly without installing through `npx`:

```
npx cobertura-merge -o output.xml package1=input1.xml package2=input2.xml
```

## Options

| option      | description                                                  |
| ----------- | ------------------------------------------------------------ |
| -o FILE     | Outputs the generated xml to the specified file              |
| -p, --print | Prints a summary of the code coverage to the standard output |
