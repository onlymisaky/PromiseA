// https://promisesaplus.com
// https://zhuanlan.zhihu.com/p/183801144
// https://zhuanlan.zhihu.com/p/21834559

function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) {
    return reject(new TypeError('Chaining cycle detected for promise!'))
  }

  let called = false;
  let then;
  if ((typeof x === 'object' && x != null) || typeof x === 'function') {
    try {
      then = x.then;
      if (typeof then === 'function') {
        then.call(x, (y) => {
          if (called) return;
          called = true;
          resolvePromise(promise2, y, resolve, reject);
        }, (err) => {
          if (called) return;
          called = true;
          reject(err);
        });
      } else {
        resolve(x);
      }
    } catch (err) {
      if (called) return;
      called = true;
      reject(err);
    }
  } else {
    resolve(x);
  }
}

class PromiseA {

  constructor(executor) {

    this.state = 'pending';
    this.value = undefined;
    this.reason = undefined;

    // 发布订阅模式
    this.onFulfilledList = [];
    this.onRejectedList = [];

    // 触发通知
    let resolve = (value) => {
      if (value instanceof PromiseA) {
        return value.then(resolve, reject);
      }
      setTimeout(() => {
        if (this.state === 'pending') {
          this.state = 'fulfilled';
          this.value = value;
          // 取出依赖
          this.onFulfilledList.forEach((fn) => fn());
        }
      }, 0);
    };

    let reject = (reason) => {
      if (reason instanceof PromiseA) {
        return reason.then(resolve, reject);
      }
      setTimeout(() => {
        if (this.state === 'pending') {
          this.state = 'rejected';
          this.reason = reason;
          this.onRejectedList.forEach((fn) => fn());
        }
      }, 0);
    }

    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }

  then(onFulfilled, onRejected) {

    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    onRejected = typeof onRejected === 'function' ? onRejected : (err) => { throw err };

    let promise2 = new PromiseA((resolve, reject) => {
      let x;
      if (this.state === 'pending') {
        // 收集依赖
        this.onFulfilledList.push(() => {
          setTimeout(() => {
            try {
              x = onFulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (err) {
              reject(err);
            }
          }, 0);
        });
        this.onRejectedList.push(() => {
          setTimeout(() => {
            try {
              x = onRejected(this.reason);
              resolvePromise(promise2, x, resolve, reject);
            } catch (err) {
              reject(err);
            }
          }, 0);
        });
      }
      if (this.state === 'fulfilled') {
        setTimeout(() => {
          try {
            x = onFulfilled(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (err) {
            reject(err);
          }
        }, 0);
      }
      if (this.state === 'rejected') {
        setTimeout(() => {
          try {
            x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (err) {
            reject(err);
          }
        }, 0);
      }
    });

    return promise2;
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }

  finally() {
    return this.then((value) => {
      PromiseA.resolve(value);
    });
  }

  static resolve(value) {
    return new PromiseA((resolve) => {
      resolve(value);
    });
  }

  static reject(reason) {
    return new PromiseA((resolve, reject) => {
      reject(reason);
    });
  }

  static all(values) {
    let results = [];
    return new PromiseA((resolve, reject) => {
      let fulfilledCount = 0;
      for (let index = 0; index < values.length; index++) {
        ((n) => {
          const promise = values[n];
          promise.then((res) => {
            results[n] = res;
            fulfilledCount++;
            if (fulfilledCount === values.length) {
              resolve(results);
            }
          }).catch((err) => {
            reject(err);
          });
        })(index);
      }
    });
  }

  static allSettled(values) {
    let results = [];
    return new PromiseA((resolve) => {
      let fulfilledCount = 0;
      let rejectedCount = 0;
      for (let index = 0; index < values.length; index++) {
        ((n) => {
          const promise = values[n];
          promise.then((res) => {
            results[n] = { status: 'fulfilled', value: res };
            fulfilledCount++;
            if (fulfilledCount + rejectedCount === values.length) {
              resolve(results);
            }
          }).catch((err) => {
            results[n] = { status: 'rejected', reason: err };
            rejectedCount++;
            if (fulfilledCount + rejectedCount === values.length) {
              resolve(results);
            }
          });
        })(index);
      }
    });
  }

  static any(values) {
    return new PromiseA((resolve, reject) => {
      let rejectedCount = 0;
      let n = 0;
      while (n < values.length) {
        const promise = values[n];
        promise.then((res) => {
          resolve(res);
        }).catch((err) => {
          rejectedCount++;
          if (rejectedCount === values.length) {
            reject(err);
          }
        });
        n++;
      }
    });
  }

  static race(values) {
    return new PromiseA((resolve, reject) => {
      let n = 0;
      while (n < values.length) {
        const promise = values[n];
        promise.then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
        n++;
      }
    });
  }

  /**
   * 依次执行
   */
  static order(promiseFuncs) {
    let promise = PromiseA.resolve();
    let results = [];
    let arr = promiseFuncs.slice(0);
    arr.push(() => PromiseA.resolve());

    const resolve = (func) => func()
      .then((res) => ({ status: 'fulfilled', value: res, }))
      .catch((err) => ({ status: 'rejected', reason: err, }));

    if (typeof Array.prototype.reduce === 'function') {
      promise = arr.reduce((prev, func, index) => {
        return prev.then((res) => {
          if (index > 0) {
            results.push(res);
          }
          return resolve(func);
        });
      }, promise);
    } else {
      arr.forEach((func, index) => {
        promise = promise.then((res) => {
          if (index > 0) {
            results.push(res);
          }
          return resolve(func);
        });
      });
    }

    return promise.then(() => results);
  }
}
