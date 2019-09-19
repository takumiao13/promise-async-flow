
const settled$ = require('../settled');
const allCommonCase = require('./_includes/allCommon');
const { expect } = require('chai');

describe('settled', () => {
  let task1, task2, task3, task4;
  const ERR = {};
  const callOrder = [];

  before(() => {
    task1 = function() { 
      callOrder.push(1);
      return 1 
    };

    task2 = function() { 
      callOrder.push(2);
      return Promise.reject(2);
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
      throw ERR;
    };
  });

  it('should call each task in parallel and resolve with an array of objects that each describe the outcome of each promise', async () => {
    await settled$([task1, task2, task3, task4])
      .then(results => {
        expect(callOrder).to.eql([1,2,4,3]);
        expect(results).to.deep.eql([
          { status: 'fulfilled', value: 1 },
          { status: 'rejected',  reason: 2 },
          { status: 'fulfilled', value: 3 },
          { status: 'rejected',  reason: ERR }
        ]);
      }, expect.fail);
  });

  allCommonCase(settled$);
});