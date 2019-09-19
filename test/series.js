
const series$ = require('../series');
const commonCase = require('./_includes/common');
const { expect } = require('chai');

describe('series', () => {
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

    taskRejects = function() { return Promise.reject(ERROR) }
  });

  it('should call each task in series and resolve with an array of results', async () => {
    await series$([task1, task2, task3, task4])
      .then(results => {
        expect(callOrder).to.eql([1,2,3,4]);
        expect(results).to.eql([1,2,3,[4]]);
      }, expect.fail)
  });

  it('should resolve empty tasks', async () => {
    await series$([])
      .then(results => {
        expect(results).to.eql([]);
      }, expect.fail);
  });

  commonCase(series$);
});