const parallel = require('../parallel');
const settled = require('../settled');
const series = require('../series');
const waterfall = require('../waterfall');

const asyncFlow = {
  parallel,
  settled,
  series,
  waterfall
};

module.exports = asyncFlow;
module.exports.default = asyncFlow;