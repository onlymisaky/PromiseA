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
      if (this.state === 'pending') {
        this.state = 'fulfilled';
        this.value = value;
        // 取出依赖
        this.onFulfilledList.forEach((fn) => fn());
      }
    };

    let reject = (reason) => {
      if (reason instanceof PromiseA) {
        return reason.then(resolve, reject);
      }
      if (this.state === 'pending') {
        this.state = 'rejected';
        this.reason = reason;
        this.onRejectedList.forEach((fn) => fn());
      }
    }

    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }

  then(onFulfilled, onRejected) {

    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    onRejected = typeof onRejected === 'function' ? onRejected : err => err;

    let promise2 = new PromiseA((resolve, reject) => {
      let x;
      if (this.state === 'pending') {
        // 收集依赖
        this.onFulfilledList.push(() => {
          x = onFulfilled(this.value);
          resolve(x);
        });
        this.onRejectedList.push(() => {
          x = onRejected(this.reason);
          reject(x);
        });
      }
      if (this.state === 'fulfilled') {
        x = onFulfilled(this.value);
        resolve(x);
      }
      if (this.state === 'rejected') {
        x = onRejected(this.reason);
        reject(x);
      }
    });

    return promise2;
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }
}

// 测试返回一个 promise
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
  const promise3 = new PromiseA((resolve, reject) => {
    setTimeout(() => {
      resolve(777)
    }, 2000);
  });
  return promise3;
}).then((res) => {
  console.log(res);
});
