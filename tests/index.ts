import { describe, it } from 'vitest';
import * as assert from 'assert';
import * as sinon from 'sinon';

import {
  calledOnce,
  calledOnceWith,
  calledOnceStartingWith,
  calledStartingWith,
  calledWith,
  notCalled,
  notOtherwiseCalled,
} from '../src/index';

/** Returns the error thrown by a callback */
export function captureError(callback: () => void): Error {
  try {
    callback();
  } catch (error: unknown) {
    if (error instanceof Error) {
      return error;
    }
    throw error;
  }
  throw new Error('Expected callback to throw an error');
}

/** Higher order function which checks errors match in `assert.throws` */
export function errorEquals(expectedError: Error) {
  return (error: Error | string) => {
    assert.deepStrictEqual(error, expectedError);
    return true;
  };
}

// "Quis custodiet ipsos custodes"
describe('sinon-assert-stub', () => {
  describe('captureError', () => {
    it('Returns the error thrown by the callback', () => {
      assert.deepStrictEqual(captureError(() => { throw new Error('Some error'); }), new Error('Some error'));
    });

    it('Throws an error if the callback did not throw an error', () => {
      assert.throws(() => captureError(() => undefined), errorEquals(new Error('Expected callback to throw an error')));
    });
  });

  describe('notCalled', () => {
    it('Throws an exception when a stub has been called', () => {
      const stub = sinon.stub();
      stub();

      const expectedError = captureError(() => assert.strictEqual(1, 0, 'Called 1 times'));

      assert.throws(
        () => notCalled(stub),
        errorEquals(expectedError),
      );
    });

    it('Does not throw an exception when a stub has not been called', () => {
      const stub = sinon.stub();
      notCalled(stub);
    });
  });

  describe('calledOnce', () => {
    it('Throws an exception when a stub has not been called', () => {
      const stub = sinon.stub();

      const expectedError = captureError(() => assert.strictEqual(0, 1, 'Called 0 times'));

      assert.throws(() => calledOnce(stub), errorEquals(expectedError));
    });

    it('Throws an exception when a stub has been called more than once', () => {
      const stub = sinon.stub();
      stub();
      stub();

      const expectedError = captureError(() => assert.strictEqual(2, 1, 'Called 2 times'));

      assert.throws(() => calledOnce(stub), errorEquals(expectedError));
    });

    it('Does not throw an exception when a stub has been called once', () => {
      const stub = sinon.stub();
      stub();
      calledOnce(stub);
    });
  });

  describe('calledOnceWith', () => {
    it('Throws an exception when a stub has not been called', () => {
      const stub = sinon.stub();

      const expectedError = captureError(() => assert.strictEqual(0, 1, 'Called 0 times'));

      assert.throws(() => calledOnceWith(stub, []), errorEquals(expectedError));
    });

    it('Throws an exception when a stub has been called more than once', () => {
      const stub = sinon.stub();
      stub();
      stub();

      const expectedError = captureError(() => assert.strictEqual(2, 1, 'Called 2 times'));

      assert.throws(() => calledOnceWith(stub, []), errorEquals(expectedError));
    });

    it('Does not throw an exception when a stub has been called once with the correct arguments (empty)', () => {
      const stub = sinon.stub();
      stub();
      calledOnceWith(stub, []);
    });

    it('Does not throw an exception when a stub has been called once with the correct arguments (non-empty)', () => {
      const stub = sinon.stub();
      stub('foo', 'bar', 'zim');
      calledOnceWith(stub, ['foo', 'bar', 'zim']);
    });
  });

  describe('calledWith', () => {
    it('Throws an exception when a stub has been called more times than expected', () => {
      const stub = sinon.stub();
      stub('foo');
      stub('bar');

      const expectedCalls = [['foo']];
      const actualCalls = [['foo'], ['bar']];
      const expectedError = captureError(() => assert.deepStrictEqual(actualCalls, expectedCalls));

      assert.throws(() => calledWith(stub, expectedCalls), errorEquals(expectedError));
    });

    it('Throws an exception when a stub has been called less times than expected', () => {
      const stub = sinon.stub();
      stub('foo');

      const expectedCalls = [['foo'], ['bar']];
      const actualCalls = [['foo']];
      const expectedError = captureError(() => assert.deepStrictEqual(actualCalls, expectedCalls));

      assert.throws(() => calledWith(stub, expectedCalls), errorEquals(expectedError));
    });

    it(
      'Throws an exception when a stub has been called the expected number of times with the wrong arguments',
      () => {
        const stub = sinon.stub();
        stub('foo');
        stub('bar', 'zim');

        const expectedCalls = [['foo'], ['bar']];
        const actualCalls = [['foo'], ['bar', 'zim']];
        const expectedError = captureError(() => assert.deepStrictEqual(actualCalls, expectedCalls));

        assert.throws(() => calledWith(stub, expectedCalls), errorEquals(expectedError));
      },
    );

    it(
      'Does not throw an exception when a stub has been called the expected number of times with the correct arguments',
      () => {
        const stub = sinon.stub();
        stub('foo');
        stub('bar', 'zim');

        calledWith(stub, [['foo'], ['bar', 'zim']]);
      },
    );
  });

  describe('calledStartingWith', () => {
    it('Throws an exception when a stub has been called more times than expected', () => {
      const stub = sinon.stub();
      stub('foo');
      stub('bar');

      const expectedCalls = [['foo']];
      const actualCalls = [['foo'], ['bar']];
      const expectedError = captureError(() => assert.deepStrictEqual(actualCalls, expectedCalls));

      assert.throws(() => calledStartingWith(stub, expectedCalls), errorEquals(expectedError));
    });

    it('Throws an exception when a stub has been called less times than expected', () => {
      const stub = sinon.stub();
      stub('foo');

      const expectedCalls = [['foo'], ['bar']];
      const actualCalls = [['foo']];
      const expectedError = captureError(() => assert.deepStrictEqual(actualCalls, expectedCalls));

      assert.throws(() => calledStartingWith(stub, expectedCalls), errorEquals(expectedError));
    });

    it(
      'Throws an exception when a stub has been called the expected number of times with the wrong arguments',
      () => {
        const stub = sinon.stub();
        stub('foo');
        stub('bar', 'zim');

        const expectedCalls = [['foo'], ['zim']];
        const actualCalls = [['foo'], ['bar']];
        const expectedError = captureError(() => assert.deepStrictEqual(actualCalls, expectedCalls));

        assert.throws(() => calledStartingWith(stub, expectedCalls), errorEquals(expectedError));
      },
    );

    it(
      'Does not throw an exception when a stub has been called the expected number of times with the correct arguments',
      () => {
        const stub = sinon.stub();
        stub('foo');
        stub('bar', 'zim');

        calledStartingWith(stub, [['foo'], ['bar', 'zim']]);
      },
    );

    it(
      'Does not throw an exception when a stub has been called the expected number of times, ' +
      'each time starting with the correct arguments',
      () => {
        const stub = sinon.stub();
        stub('foo');
        stub('bar', 'zim');
        stub('gir', 'zig', 'pew');

        calledStartingWith(stub, [['foo'], ['bar'], ['gir', 'zig']]);
      },
    );
  });

  describe('calledOnceStartingWith', () => {
    it('Throws an exception when a stub has been called more times than expected', () => {
      const stub = sinon.stub();
      stub('foo');
      stub('bar');

      const expectedError = captureError(() => assert.strictEqual(2, 1, 'Called 2 times'));

      assert.throws(() => calledOnceStartingWith(stub, ['foo']), errorEquals(expectedError));
    });

    it('Throws an exception when a stub has been called less times than expected', () => {
      const stub = sinon.stub();

      const expectedError = captureError(() => assert.strictEqual(0, 1, 'Called 0 times'));

      assert.throws(() => calledOnceStartingWith(stub, ['foo']), errorEquals(expectedError));
    });

    it(
      'Throws an exception when a stub has been called the expected number of times with the wrong arguments',
      () => {
        const stub = sinon.stub();
        stub('bar', 'zim');

        const expectedCalls = ['zim'];
        const actualCalls = ['bar'];
        const expectedError = captureError(() => assert.deepStrictEqual(actualCalls, expectedCalls));

        assert.throws(() => calledOnceStartingWith(stub, expectedCalls), errorEquals(expectedError));
      },
    );

    it(
      'Does not throw an exception when a stub has been called the expected number of times with the correct arguments',
      () => {
        const stub = sinon.stub();
        stub('bar', 'zim');

        calledOnceStartingWith(stub, ['bar', 'zim']);
      },
    );

    it(
      'Does not throw an exception when a stub has been called the expected number of times, ' +
      'each time starting with the correct arguments',
      () => {
        const stub = sinon.stub();
        stub('gir', 'zig', 'pew');

        calledOnceStartingWith(stub, ['gir', 'zig']);
      },
    );
  });

  describe('notOtherwiseCalled', () => {
    it('Throws an exception when a stub was called with unexpected args', () => {
      const stub = sinon.stub();
      stub.withArgs('foo').returns(true);
      stub.withArgs('bar', 'zim').returns(true);

      const expectedError = new assert.AssertionError({
        message: 'Unexpected call to stub with args ["gir","zig","pew"]',
      });

      assert.throws(
        () => {
          notOtherwiseCalled(stub, 'stub');
          stub('foo');
          stub('bar', 'zim');
          stub('gir', 'zig', 'pew');
        },
        errorEquals(expectedError),
      );
    });

    it('Does not throw an exception when a stub was only called with unexpected args', () => {
      const stub = sinon.stub();
      stub.withArgs('foo').returns(true);
      stub.withArgs('bar', 'zim').returns(true);
      stub.withArgs('gir', 'zig', 'pew').returns(true);

      notOtherwiseCalled(stub, 'stub');

      stub('foo');
      stub('bar', 'zim');
      stub('gir', 'zig', 'pew');
    });
  });
});
