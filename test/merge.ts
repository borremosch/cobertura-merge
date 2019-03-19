import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import chaiArrays from 'chai-arrays';
import { mergeInputs } from '../src/merge';
import { EMPTY_INPUT_FILE, INPUT_FILE1, INPUT_FILE2 } from './data';

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
    expect(output.coverage[0].sources!.length).to.equal(0);
    expect(output.coverage[0].packages).to.be.array();
    expect(output.coverage[0].packages.length).to.equal(1);
    expect(output.coverage[0].packages[0].package).to.be.array();
    expect(output.coverage[0].packages[0].package.length).to.equal(0);
  });

  it('should merge a single file with a single package', () => {
    const output = mergeInputs([INPUT_FILE1, INPUT_FILE2]);

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
    expect(output.coverage[0].sources!.length).to.equal(0);
    expect(output.coverage[0].packages).to.be.array();
    expect(output.coverage[0].packages.length).to.equal(1);
    expect(output.coverage[0].packages[0].package).to.be.array();
    expect(output.coverage[0].packages[0].package.length).to.equal(2);
    expect(output.coverage[0].packages[0].package[0].name).to.equal(
      `${INPUT_FILE1.packageName}.${INPUT_FILE1.data.coverage[0].packages[0].package[0].name}`
    );
    expect(output.coverage[0].packages[0].package[0]['line-rate']).to.equal(
      INPUT_FILE1.data.coverage[0].packages[0].package[0]['line-rate']
    );
    expect(output.coverage[0].packages[0].package[0]['branch-rate']).to.equal(
      INPUT_FILE1.data.coverage[0].packages[0].package[0]['branch-rate']
    );
    expect(output.coverage[0].packages[0].package[0].complexity).to.equal(
      INPUT_FILE1.data.coverage[0].packages[0].package[0].complexity
    );
  });
});
