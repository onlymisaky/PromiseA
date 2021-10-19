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
}

// 测试 catch 中返回非 Promise
new PromiseA((resolve, reject) => {
  setTimeout(() => {
    resolve(123);
  }, 2000);
}).then((res) => {
  console.log(res);
  const promise2 = new PromiseA((resolve, reject) => {
    setTimeout(() => {
      reject(321)
    }, 2000);
  });
  return promise2;
}).catch((err) => {
  console.log(err);
  return 777;
}).then((res) => {
  console.log(res);
});
