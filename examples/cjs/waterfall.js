
const waterfall = require('../../waterfall');

waterfall([
  (arg) => {
    console.log(arg); //=> 1
    return arg + 1;
  },
  (arg) => {
    console.log(arg); //=> 2
    return arg * 2
  },
  (arg) => {
    console.log(arg); //=> 4
    return -1 * arg
  }
], 1).then(console.log); //=> -4