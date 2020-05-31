import * as assert from 'assert';
import * as sinon from 'sinon';

/** Asserts that a spy was not called */
export function notCalled(spy: sinon.SinonSpy) {
  assert.strictEqual(spy.callCount, 0, `Called ${spy.callCount} times`);
}

/** Asserts that a spy was called exactly once */
export function calledOnce(spy: sinon.SinonSpy) {
  assert.strictEqual(spy.callCount, 1, `Called ${spy.callCount} times`);
}

/** Asserts that a spy was called exactly once with the arguments `args` */
export function calledOnceWith<Type>(spy: sinon.SinonSpy, args: Type[]) {
  calledOnce(spy);
  assert.deepStrictEqual(spy.getCall(0).args, args);
}

/** Asserts that a spy was called exactly with the arguments specified in each entry of `calls` */
export function calledWith<Type>(spy: sinon.SinonSpy, calls: Type[][]) {
  assert.deepStrictEqual(spy.getCalls().map((call) => call.args), calls);
}

/** Asserts that a spy was called starting with the arguments specified in each entry of `calls` */
export function calledStartingWith<Type>(spy: sinon.SinonSpy, calls: Type[][]) {
  const actualCalls = spy.getCalls().map((call) => call.args);
  const startingWithCalls = actualCalls.map((args, i) => calls[i] ? args.slice(0, calls[i].length) : args);
  assert.deepStrictEqual(startingWithCalls, calls);
}

/** Asserts that a spy was called exactly once starting with the arguments `args` */
export function calledOnceStartingWith<Type>(spy: sinon.SinonSpy, args: Type[]) {
  calledOnce(spy);
  assert.deepStrictEqual(spy.getCall(0).args.slice(0, args.length), args);
}

/**
 * Asserts that a stub is not called, expected to be used in combination
 * with `withArgs` so that any other calls fall through to this.
 * This should be called before calling the function under test
 */
export function notOtherwiseCalled(stub: sinon.SinonStub, name: string) {
  stub.callsFake((...args) => {
    throw new assert.AssertionError({ message: `Unexpected call to ${name} with args ${JSON.stringify(args)}` });
  });
}

export default {
  notCalled,
  calledOnce,
  calledOnceWith,
  calledWith,
  calledStartingWith,
  calledOnceStartingWith,
  notOtherwiseCalled,
};
