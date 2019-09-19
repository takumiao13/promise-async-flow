promise-async-flow
==================
lightly async flow control based on Promise

## Installing and use

```bash
$ npm install promise-async-flow --save
```
then

```js
// cjs
const flow$ = require('promise-async-flow');
const { parallel } = require('promise-async-flow');
const parallel$ = require('promise-async-flow/parallel');

// esm
import flow$ from 'promise-async-flow'
import { parallel } from 'promise-async-flow'
import parallel$ from 'promise-async-flow/parallel'
```

## API

- [`#parallel`](#parallel)
- [`#settled`](#settled)
- [`#series`](#series)
- [`#waterfall`](#waterfall)

### Parallel

```js
parallel(
  tasks: Iterable<Task:() => Promise<any> | any>,
  concurrency?: int = Infinity
): Promise<Array<any>>
```
Run each task in parallel and resolve with an array of results.

```js
flow$.parallel([
  () => 1,
  () => Promise.resolve(2),
  async () => (1 + await Promise.resolve(3))
]).then(console.log);
// => [ 1, 2, 4 ]
```

### Settled

```js
settled(
  tasks: Iterable<Task:() => Promise<any> | any>,
  concurrency?: int = Infinity
): Promise<Array<settlementobject>>
```
Run each task in parallel and resolve with an array of objects that each describe the outcome of each promise.

```js
flow$.settled([
  () => 1,
  () => Promise.reject(2),
  async () => { throw 3 }
]).then(console.log);
// => 
// [
//  { status: 'fulfilled', value: 1},
//  { status: 'rejected',  reason: 2}
//  { status: 'rejected',  reason: 3}
// ]
```

### Series

```js
series(
  tasks: Iterable<Task:() => Promise<any> | any>
): Promise<Array<any>>
```
Run each task in series and resolve with an array of results.

```js
flow$.series([
  () => 1,
  () => Promise.resolve(2),
  async () => (1 + await Promise.resolve(3))
]).then(console.log);
// => [ 1, 2, 4 ]
```

### Waterfall

```js
waterfall(
  tasks: Iterable<Task:() => Promise<any> | any>,
  initialValue?: any = undefined
): Promise<any>
```
Run each task in series, could pass the return to the next task and resolve with the last of result.

```js
flow$.waterfall([
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
```

**NOTE:** 

- `Task` should be a promise-returning function.
- `parallel` `series` `waterfall` will reject if any task throw error or return a promise that rejects.

## Test

```bash
npm run test
```

## License

MIT