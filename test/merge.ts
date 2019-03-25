import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import chaiArrays from 'chai-arrays';
import { mergeInputs } from '../src/merge';
import { EMPTY_INPUT_FILE, INPUT_FILE1, INPUT_FILE2, INPUT_FILE_WITH_ROOT_CLASSES } from './data';
import { Package, Class } from './types/cobertura';

chai.use(chaiAlmost(100));
chai.use(chaiArrays);

describe('mergeInputs', () => {
  it('should merge a single empty file', () => {
    const output = mergeInputs([EMPTY_INPUT_FILE]);

    expect(output.coverage.length).to.equal(1);
    expect(output.coverage[0]['line-rate']).to.equal(EMPTY_INPUT_FILE.data.coverage[0]['line-rate']);
    expect(output.coverage[0]['branch-rate']).to.equal(EMPTY_INPUT_FILE.data.coverage[0]['branch-rate']);
    expect(output.coverage[0]['lines-covered']).to.equal(EMPTY_INPUT_FILE.data.coverage[0]['lines-covered']);
    expect(output.coverage[0]['lines-valid']).to.equal(EMPTY_INPUT_FILE.data.coverage[0]['lines-valid']);
    expect(output.coverage[0]['branches-covered']).to.equal(EMPTY_INPUT_FILE.data.coverage[0]['branches-covered']);
    expect(output.coverage[0]['branches-valid']).to.equal(EMPTY_INPUT_FILE.data.coverage[0]['branches-valid']);
    expect(output.coverage[0].complexity).to.equal(EMPTY_INPUT_FILE.data.coverage[0].complexity);
    expect(parseInt(output.coverage[0].timestamp, 10)).to.be.almost(Date.now(), 100);
    expect(output.coverage[0].sources).to.be.array();
    expect(output.coverage[0].sources!.length).to.equal(1);
    expect(output.coverage[0].sources![0].source.length).to.equal(1);
    expect(output.coverage[0].sources![0].source[0].$t).to.equal(process.cwd());
    expect(output.coverage[0].packages).to.be.array();
    expect(output.coverage[0].packages.length).to.equal(1);
    expect((output.coverage[0].packages[0] as Package).package).to.be.array();
    expect((output.coverage[0].packages[0] as Package).package.length).to.equal(0);
  });

  it('should merge two files into a single file', () => {
    const output = mergeInputs([INPUT_FILE1, INPUT_FILE2]);

    const totalLinesCovered =
      parseInt(INPUT_FILE1.data.coverage[0]['lines-covered'], 10) +
      parseInt(INPUT_FILE2.data.coverage[0]['lines-covered'], 10);
    const totalLinesValid =
      parseInt(INPUT_FILE1.data.coverage[0]['lines-valid'], 10) +
      parseInt(INPUT_FILE2.data.coverage[0]['lines-valid'], 10);
    const totalBranchesCovered =
      parseInt(INPUT_FILE1.data.coverage[0]['branches-covered'], 10) +
      parseInt(INPUT_FILE2.data.coverage[0]['branches-covered'], 10);
    const totalBranchesValid =
      parseInt(INPUT_FILE1.data.coverage[0]['branches-valid'], 10) +
      parseInt(INPUT_FILE2.data.coverage[0]['branches-valid'], 10);

    const complexity = Math.max(
      parseInt(INPUT_FILE1.data.coverage[0].complexity, 10),
      parseInt(INPUT_FILE2.data.coverage[0].complexity, 10)
    );

    expect(output.coverage.length).to.equal(1);
    expect(output.coverage[0]['line-rate']).to.equal((totalLinesCovered / totalLinesValid).toString());
    expect(output.coverage[0]['branch-rate']).to.equal((totalBranchesCovered / totalBranchesValid).toString());
    expect(output.coverage[0]['lines-covered']).to.equal(totalLinesCovered.toString());
    expect(output.coverage[0]['lines-valid']).to.equal(totalLinesValid.toString());
    expect(output.coverage[0]['branches-covered']).to.equal(totalBranchesCovered.toString());
    expect(output.coverage[0]['branches-valid']).to.equal(totalBranchesValid.toString());
    expect(output.coverage[0].complexity).to.equal(complexity.toString());
    expect(parseInt(output.coverage[0].timestamp, 10)).to.be.almost(Date.now(), 100);
    expect(output.coverage[0].sources).to.be.array();
    expect(output.coverage[0].sources!.length).to.equal(1);
    expect(output.coverage[0].sources![0].source.length).to.equal(1);
    expect(output.coverage[0].sources![0].source[0].$t).to.equal(process.cwd());
    expect(output.coverage[0].packages).to.be.array();
    expect(output.coverage[0].packages.length).to.equal(1);
    expect((output.coverage[0].packages[0] as Package).package).to.be.array();
    expect((output.coverage[0].packages[0] as Package).package.length).to.equal(2);

    // Validate first output package
    expect((output.coverage[0].packages[0] as Package).package[0].name).to.equal(
      `${INPUT_FILE1.packageName}.${(INPUT_FILE1.data.coverage[0].packages[0] as Package).package[0].name}`
    );
    expect((output.coverage[0].packages[0] as Package).package[0]['line-rate']).to.equal(
      (INPUT_FILE1.data.coverage[0].packages[0] as Package).package[0]['line-rate']
    );
    expect((output.coverage[0].packages[0] as Package).package[0]['branch-rate']).to.equal(
      (INPUT_FILE1.data.coverage[0].packages[0] as Package).package[0]['branch-rate']
    );
    expect((output.coverage[0].packages[0] as Package).package[0].complexity).to.equal(
      (INPUT_FILE1.data.coverage[0].packages[0] as Package).package[0].complexity
    );
    expect((output.coverage[0].packages[0] as Package).package[0].classes).to.deep.equal(
      (INPUT_FILE1.data.coverage[0].packages[0] as Package).package[0].classes
    );

    // Validate second output package
    expect((output.coverage[0].packages[0] as Package).package[1].name).to.equal(INPUT_FILE2.packageName);
    expect((output.coverage[0].packages[0] as Package).package[1]['line-rate']).to.equal(
      (INPUT_FILE2.data.coverage[0].packages[0] as Package).package[0]['line-rate']
    );
    expect((output.coverage[0].packages[0] as Package).package[1]['branch-rate']).to.equal(
      (INPUT_FILE2.data.coverage[0].packages[0] as Package).package[0]['branch-rate']
    );
    expect((output.coverage[0].packages[0] as Package).package[1].complexity).to.equal(
      (INPUT_FILE2.data.coverage[0].packages[0] as Package).package[0].complexity
    );
    expect((output.coverage[0].packages[0] as Package).package[1].classes).to.deep.equal(
      (INPUT_FILE2.data.coverage[0].packages[0] as Package).package[0].classes
    );
  });

  it('should merge two files, one of which has no packages but classes at the root, into a single file', () => {
    const output = mergeInputs([INPUT_FILE2, INPUT_FILE_WITH_ROOT_CLASSES]);

    const totalLinesCovered =
      parseInt(INPUT_FILE2.data.coverage[0]['lines-covered'], 10) +
      parseInt(INPUT_FILE_WITH_ROOT_CLASSES.data.coverage[0]['lines-covered'], 10);
    const totalLinesValid =
      parseInt(INPUT_FILE2.data.coverage[0]['lines-valid'], 10) +
      parseInt(INPUT_FILE_WITH_ROOT_CLASSES.data.coverage[0]['lines-valid'], 10);
    const totalBranchesCovered =
      parseInt(INPUT_FILE2.data.coverage[0]['branches-covered'], 10) +
      parseInt(INPUT_FILE_WITH_ROOT_CLASSES.data.coverage[0]['branches-covered'], 10);
    const totalBranchesValid =
      parseInt(INPUT_FILE2.data.coverage[0]['branches-valid'], 10) +
      parseInt(INPUT_FILE_WITH_ROOT_CLASSES.data.coverage[0]['branches-valid'], 10);

    const complexity = Math.max(
      parseInt(INPUT_FILE2.data.coverage[0].complexity, 10),
      parseInt(INPUT_FILE_WITH_ROOT_CLASSES.data.coverage[0].complexity, 10)
    ).toString();

    const lineRate = (totalLinesCovered / totalLinesValid).toString();
    const brancheRate = (totalBranchesCovered / totalBranchesValid).toString();

    expect(output.coverage.length).to.equal(1);
    expect(output.coverage[0]['line-rate']).to.equal(lineRate);
    expect(output.coverage[0]['branch-rate']).to.equal(brancheRate);
    expect(output.coverage[0]['lines-covered']).to.equal(totalLinesCovered.toString());
    expect(output.coverage[0]['lines-valid']).to.equal(totalLinesValid.toString());
    expect(output.coverage[0]['branches-covered']).to.equal(totalBranchesCovered.toString());
    expect(output.coverage[0]['branches-valid']).to.equal(totalBranchesValid.toString());
    expect(output.coverage[0].complexity).to.equal(complexity);
    expect(parseInt(output.coverage[0].timestamp, 10)).to.be.almost(Date.now(), 100);
    expect(output.coverage[0].sources![0].source.length).to.equal(1);
    expect(output.coverage[0].sources![0].source[0].$t).to.equal(process.cwd());
    expect(output.coverage[0].packages).to.be.array();
    expect(output.coverage[0].packages.length).to.equal(1);
    expect((output.coverage[0].packages[0] as Package).package).to.be.array();
    expect((output.coverage[0].packages[0] as Package).package.length).to.equal(2);

    // Validate first package
    expect((output.coverage[0].packages[0] as Package).package[0].name).to.equal(INPUT_FILE2.packageName);
    expect((output.coverage[0].packages[0] as Package).package[0]['line-rate']).to.equal(
      (INPUT_FILE2.data.coverage[0].packages[0] as Package).package[0]['line-rate']
    );
    expect((output.coverage[0].packages[0] as Package).package[0]['branch-rate']).to.equal(
      (INPUT_FILE2.data.coverage[0].packages[0] as Package).package[0]['branch-rate']
    );
    expect((output.coverage[0].packages[0] as Package).package[0].complexity).to.equal(
      (INPUT_FILE2.data.coverage[0].packages[0] as Package).package[0].complexity
    );
    expect((output.coverage[0].packages[0] as Package).package[0].classes).to.deep.equal(
      (INPUT_FILE2.data.coverage[0].packages[0] as Package).package[0].classes
    );

    // Validate second package
    expect((output.coverage[0].packages[0] as Package).package[1].name).to.equal(
      INPUT_FILE_WITH_ROOT_CLASSES.packageName
    );
    expect((output.coverage[0].packages[0] as Package).package[1]['line-rate']).to.equal(lineRate);
    expect((output.coverage[0].packages[0] as Package).package[1]['branch-rate']).to.equal(brancheRate);
    expect((output.coverage[0].packages[0] as Package).package[1].complexity).to.equal(complexity);
    expect((output.coverage[0].packages[0] as Package).package[1].classes).to.deep.equal(
      (INPUT_FILE_WITH_ROOT_CLASSES.data.coverage[0].packages[0] as Class).class.map(jsonClass => ({
        class: [jsonClass]
      }))
    );
  });
});
