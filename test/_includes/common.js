const { expect } = require('chai');

module.exports = (flow$) => {
  const ERR1 = {};
  const ERR2 = {};
  const task1 = () => 1;
  const task2 = () => 2;
  const taskRejects = () => Promise.reject(ERR1);
  const taskThrow = () => { throw ERR2 }

  it('should reject if any task error', async () => {
    await flow$([task1, task2, taskRejects])
      .then(expect.fail, err => expect(err).to.equal(ERR1));
    await flow$([task1, taskThrow, task2])
      .then(expect.fail, err => expect(err).to.equal(ERR2));
  });

  it('should reject if tasks is non-iterable', async () => {
    ['text', 13, {}, Promise.resolve(), []].map(tasks => async () => {
      await flow$(tasks).then(expect.fail, err => {
        expect(err).to.be.an.instanceof(TypeError);
      });
    });
  });

  it('should reject if task is non-function', async () => {
    ['text', 13, {}, Promise.resolve(), []].map(task => async () => {
      await flow$([task1, task, task2]).then(expect.fail, err => {
        expect(err).to.be.an.instanceof(TypeError);
      });
    });
  });
}