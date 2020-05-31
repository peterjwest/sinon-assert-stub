# sinon-assert-stub [![npm version][npm-badge]][npm-url] [![build status][circle-badge]][circle-url] [![coverage status][coverage-badge]][coverage-url]

Nice assertions for sinon stubs.

## Installation

```bash
npm install sinon-assert-stub
```
or
```bash
yarn add sinon-assert-stub
```

## Usage

Pass a sinon stub to the assertion function to check it, for example this checks that a stub function is called twice with specific arguments:

```js
import { calledWith } from 'sinon-assert-stub';
import * as sinon from 'sinon';

const stub = sinon.stub();
stub('foo');
stub('bar', 'zim');

calledWith(stub, [['foo'], ['bar', 'zim']]);
```

## Methods

### calledOnce

Asserts the stub was called exactly once:

```js
const stub = sinon.stub();
stub('foo');

calledOnce(stub);
```

### notCalled

Asserts the stub was never called:

```js
const stub = sinon.stub();

notCalled(stub);
```

### calledWith

Asserts the stub was called an exact number of times with specified arguments:

```js
const stub = sinon.stub();

stub('foo');
stub('bar', 'zim');

calledWith(stub, [['foo'], ['bar', 'zim']]);
```

### calledOnceWith

Asserts the stub was called an once with specified arguments:

```js
const stub = sinon.stub();

stub('bar', 'zim');

calledOnceWith(stub, ['bar', 'zim']);
```

### calledStartingWith

Asserts that the stub was called an exact number of times _starting_ with specified arguments:

```js
const stub = sinon.stub();

stub('foo', 1, 2, 3);
stub('bar', 'zim');

calledStartingWith(stub, [['foo'], ['bar', 'zim']]);
```

### calledOnceStartingWith

Asserts that the stub was called once _starting_ with specified arguments:

```js
const stub = sinon.stub();

stub('foo', 1, 2, 3);

calledOnceStartingWith(stub, ['foo']);
```

### notOtherwiseCalled

Asserts the stub was not called with unexpected arguments. This assertion is a bit different because it is designed to be used with `withArgs` and needs to be called _before_ the test case:

```js
const stub = sinon.stub();
stub.withArgs('foo').returns(true);
stub.withArgs('bar', 'zim').returns(true);

notOtherwiseCalled(stub, 'stub');

stub('foo');
stub('bar', 'zim');
```


[npm-badge]: https://badge.fury.io/js/sinon-assert-stub.svg
[npm-url]: https://www.npmjs.com/package/sinon-assert-stub

[circle-badge]: https://circleci.com/gh/peterjwest/sinon-assert-stub.svg?style=shield
[circle-url]: https://circleci.com/gh/peterjwest/sinon-assert-stub

[coverage-badge]: https://coveralls.io/repos/peterjwest/sinon-assert-stub/badge.svg?branch=master&service=github
[coverage-url]: https://coveralls.io/github/peterjwest/sinon-assert-stub?branch=master
