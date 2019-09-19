const { toPromise, toArray, isFunction } = require('./utils');
const { COLLECTION_ERROR, FUNCTION_ERROR } = require('./constants');

const createSeries = (_each) => (tasks, initialValue) => new Promise((resolve, reject) => {
  tasks = toArray(tasks);

  if (tasks === null) {
    reject(new TypeError('[tasks] ' + COLLECTION_ERROR + tasks));
    return;  
  }

  let index = 0;
  let count = tasks.length;
  let results = _each ? [] : initialValue;

  const next = () => {
    if (index === count) {
      resolve(results);
      return
    }

    const task = tasks[index++];

    if (!isFunction(task)) {
      reject(new TypeError(FUNCTION_ERROR + task));
      return;
    }

    const input = _each ? void 0 : results;

    toPromise(task(input)).then(value => {
      if (_each) {
        results.push(value);
      } else {
        results = value;
      }
      next();
    }).catch(reject);
  }

  next();
});

module.exports = createSeries;