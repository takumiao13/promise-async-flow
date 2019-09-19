const { expect } = require('chai');

module.exports = (flow$) => {
  const ERR1 = {};
  const ERR2 = {};
  const task1 = () => 1;
  const task2 = () => 2;
  const taskRejects = () => Promise.reject(ERR1);
  const taskThrow = () => { throw ERR2 }

  it('should resolve empty tasks', async () => {
    await flow$([])
      .then(results => {
        expect(results).to.eql([]);
      }, expect.fail);
  });

  it('should reject if concurrency is non-positive integer', async () => {
    const concurrency = [-1, 2.5, 0/0, NaN];
    for (let i = 0; i < concurrency.length; i++) {
      await flow$([], concurrency[i]).then(expect.fail, err => {
        expect(err).to.be.an.instanceof(TypeError);
      });
    }
  });
}