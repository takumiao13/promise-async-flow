(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.asyncFlow = factory());
}(this, function () { 'use strict';

  const toPromise = (v) => Promise.resolve(v);

  const toArray = (v) => {
    if (Array.isArray(v)) return v;
    if (v != null && typeof v[Symbol.iterator] === 'function') return Array.from(v);
    return null;
  };

  const isFunction = (v) => typeof v === 'function';

  const isNumber = (v) => typeof v === 'number';

  const isInteger = Number.isInteger || function(value) {
    return typeof value === 'number' && 
      isFinite(value) && 
      Math.floor(value) === value;
  };

  const isPositiveInteger = (v) => v > 0 && isInteger(v);

  var utils = {
    toPromise,
    toArray,
    isFunction,
    isNumber,
    isPositiveInteger,
  };

  const POSITIVE_INTEGER_ERROR = 'expecting a positive integer but got ';
  const COLLECTION_ERROR = 'expecting an array or an iterable object but got ';
  const OBJECT_ERROR = 'expecting an object but got ';
  const FUNCTION_ERROR = 'expecting a function but got ';
  const PROPS_TYPE_ERROR = 'cannot await properties of a non-object';

  var constants = {
    POSITIVE_INTEGER_ERROR,
    COLLECTION_ERROR,
    OBJECT_ERROR,
    FUNCTION_ERROR,
    PROPS_TYPE_ERROR
  };

  const { toPromise: toPromise$1, toArray: toArray$1, isFunction: isFunction$1, isPositiveInteger: isPositiveInteger$1 } = utils;
  const { COLLECTION_ERROR: COLLECTION_ERROR$1, FUNCTION_ERROR: FUNCTION_ERROR$1, POSITIVE_INTEGER_ERROR: POSITIVE_INTEGER_ERROR$1 } = constants;

  const createAll = (_settled) => (tasks, concurrency) => new Promise((resolve, reject) => {
    tasks = toArray$1(tasks);

    if (tasks === null) {
      reject(new TypeError('[tasks] ' + COLLECTION_ERROR$1 + tasks));
      return;
    }

    concurrency = concurrency === void 0 ? Infinity : +concurrency;

    if (concurrency !== Infinity && !isPositiveInteger$1(concurrency)) {
      reject(new TypeError('[concurrency] ' + POSITIVE_INTEGER_ERROR$1 + concurrency));
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

      if (!isFunction$1(task)) {
        reject(new TypeError(FUNCTION_ERROR$1 + task));
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
      };

      toPromise$1(task())
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
    };

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

  var createAll_1 = createAll;

  const parallel = createAll_1();
  var parallel_1 = parallel;
  var _default = parallel;
  parallel_1.default = _default;

  const settled = createAll_1(true);
  var settled_1 = settled;
  var _default$1 = settled;
  settled_1.default = _default$1;

  const { toPromise: toPromise$2, toArray: toArray$2, isFunction: isFunction$2 } = utils;
  const { COLLECTION_ERROR: COLLECTION_ERROR$2, FUNCTION_ERROR: FUNCTION_ERROR$2 } = constants;

  const createSeries = (_each) => (tasks, initialValue) => new Promise((resolve, reject) => {
    tasks = toArray$2(tasks);

    if (tasks === null) {
      reject(new TypeError('[tasks] ' + COLLECTION_ERROR$2 + tasks));
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

      if (!isFunction$2(task)) {
        reject(new TypeError(FUNCTION_ERROR$2 + task));
        return;
      }

      const input = _each ? void 0 : results;

      toPromise$2(task(input)).then(value => {
        if (_each) {
          results.push(value);
        } else {
          results = value;
        }
        next();
      }).catch(reject);
    };

    next();
  });

  var createSeries_1 = createSeries;

  const series = createSeries_1(true);
  var series_1 = series;
  var _default$2 = series;
  series_1.default = _default$2;

  const waterfall = createSeries_1();
  var waterfall_1 = waterfall;
  var _default$3 = waterfall;
  waterfall_1.default = _default$3;

  const asyncFlow = {
    parallel: parallel_1,
    settled: settled_1,
    series: series_1,
    waterfall: waterfall_1
  };

  var src = asyncFlow;
  var _default$4 = asyncFlow;
  src.default = _default$4;

  return src;

}));
