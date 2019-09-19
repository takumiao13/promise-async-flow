
const parallel$ = require('../parallel');
const commonCase = require('./_includes/common');
const allCommonCase = require('./_includes/allCommon');
const { expect } = require('chai');

describe('parallel', () => {
  let task1, task2, task3, task4;
  const callOrder = [];

  before(() => {
    task1 = function() { 
      callOrder.push(1);
      return 1 
    };

    task2 = function() { 
      callOrder.push(2);
      return Promise.resolve(2);
    };

    task3 = function() {
      return new Promise((r) => {
        setTimeout(_ => {
          callOrder.push(3);
          r(3)
        }, 100);
      })
    };

    task4 = async function() {
      callOrder.push(4);
      await Promise.resolve();
      return [4];
    };
  });

  it('should call each task in parallel and resolve with an array of results', async () => {
    await parallel$([task1, task2, task3, task4])
      .then(results => {
        expect(callOrder).to.eql([1,2,4,3]);
        expect(results).to.eql([1,2,3,[4]]);
      }, expect.fail)
  });

  allCommonCase(parallel$);
  commonCase(parallel$);
});