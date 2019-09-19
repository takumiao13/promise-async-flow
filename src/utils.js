const toPromise = (v) => Promise.resolve(v);

const toArray = (v) => {
  if (Array.isArray(v)) return v;
  if (v != null && typeof v[Symbol.iterator] === 'function') return Array.from(v);
  return null;
}

const isFunction = (v) => typeof v === 'function';

const isNumber = (v) => typeof v === 'number';

const isInteger = Number.isInteger || function(value) {
  return typeof value === 'number' && 
    isFinite(value) && 
    Math.floor(value) === value;
};

const isPositiveInteger = (v) => v > 0 && isInteger(v)

module.exports = {
  toPromise,
  toArray,
  isFunction,
  isNumber,
  isPositiveInteger,
}