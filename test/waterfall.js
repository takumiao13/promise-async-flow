
const waterfall$ = require('../waterfall');
const commonCase = require('./_includes/common');
const { expect } = require('chai');

describe('waterfall', () => {
  let task1, task2, task3, task4;
  const callOrder = [];

  before(() => {
    task1 = function(v) {
      callOrder.push(1);
      return v+1
    };

    task2 = function(v) { 
      callOrder.push(2);
      return Promise.resolve(v+1);
    };

    task3 = function(v) {
      callOrder.push(3);
      return new Promise((r) => {
        setTimeout(_ => r([v+1, 'foo']), 100);
      })
    };

    task4 = async function([v, foo]) {
      callOrder.push(4);
      await Promise.resolve();
      return [foo+(v+1)];
    };

    taskError = function() { throw ERROR }
  });

  it('should call each task in series and resolve with the last result', async () => {
    await waterfall$([task1, task2, task3, task4], 1)
      .then(results => {
        expect(callOrder).to.eql([1,2,3,4]);
        expect(results).to.eql(['foo5']);
      }, expect.fail);
  });

  it('should resolve with initialValue when passes an empty tasks', async () => {
    const obj = {}
    await waterfall$([])
      .then(results => expect(results).to.equal(void 0), expect.fail);
    await waterfall$([], 5)
      .then(results => expect(results).to.equal(5), expect.fail);
    await waterfall$([], obj)
      .then(results => expect(results).to.equal(obj), expect.fail);
  });

  commonCase(waterfall$);
});