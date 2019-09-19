const { toPromise, toArray, isFunction, isPositiveInteger } = require('./utils');
const { COLLECTION_ERROR, FUNCTION_ERROR, POSITIVE_INTEGER_ERROR } = require('./constants');

const createAll = (_settled) => (tasks, concurrency) => new Promise((resolve, reject) => {
  tasks = toArray(tasks);

  if (tasks === null) {
    reject(new TypeError('[tasks] ' + COLLECTION_ERROR + tasks));
    return;
  }

  concurrency = concurrency === void 0 ? Infinity : +concurrency;

  if (concurrency !== Infinity && !isPositiveInteger(concurrency)) {
    reject(new TypeError('[concurrency] ' + POSITIVE_INTEGER_ERROR + concurrency));
    return;
  }

  const count = tasks.length;
  const results = [];

  let i = 0;
  let completedCount = count;
  let isRejected = false;

  const next = () => {
    if (!_settled && isRejected) return;

    let currentIndex = i++;
    const task = tasks[currentIndex];

    if (!isFunction(task)) {
      reject(new TypeError(FUNCTION_ERROR + task));
      return;
    }

    const done = () => {
      // when completed decrease completed count
      if (--completedCount === 0) {
        resolve(results); 
      } else {
        // if tasks loop done don't call `next()`
        (i !== count) && next();  
      }
    }

    toPromise(task())
      .then(value => {
        results[currentIndex] = _settled ? createFulfillment(value) :value;
        done();
      }, (err) => {
        if (_settled) {
          results[currentIndex] = createRejection(err);
          done();
        } else {
          isRejected = true;
          reject(err);
        }
      });
  }

  if (count === 0) {
    resolve(results);
  } else {
    for (let i = 0; i < Math.min(concurrency, count); i++) {
      next();
    }
  }
});

const createFulfillment = (value) => ({
  status: 'fulfilled',
  value
});

const createRejection = (reason) => ({
  status: 'rejected',
  reason
});

module.exports = createAll;