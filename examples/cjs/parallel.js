const asyncFlow = require('../../src');

asyncFlow.parallel([
  () => 1,
  () => Promise.resolve(2),
  async () => (1 + await Promise.resolve(3))
]).then(console.log);