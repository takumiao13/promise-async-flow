const series = require('../../series');

series([
  () => 1,
  () => Promise.resolve(2),
  async () => (1 + await Promise.resolve(3))
]).then(console.log);
// => [ 1, 2, 4 ]