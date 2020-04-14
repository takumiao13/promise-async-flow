
const { settled } = require('../../src');

settled([
  () => 1,
  () => Promise.reject(2),
  async () => { throw 3 }
]).then(console.log);