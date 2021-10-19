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
      if (this.state === 'pending') {
        this.state = 'fulfilled';
        this.value = value;
        // 取出依赖
        this.onFulfilledList.forEach((fn) => fn());
      }
    };

    let reject = (reason) => {
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

    if (this.state === 'pending') {
      // 收集依赖
      this.onFulfilledList.push(() => { onFulfilled(this.value); });
      this.onRejectedList.push(() => { onRejected(this.reason); });
    }
    if (this.state === 'fulfilled') {
      onFulfilled(this.value);
    }
    if (this.state === 'rejected') {
      onRejected(this.reason);
    }
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }
}

// 测试异步
new PromiseA((resolve, reject) => {
  setTimeout(() => {
    resolve(123);
  }, 3000);
}).then((res) => {
  console.log(res);
});

new PromiseA((resolve, reject) => {
  setTimeout(() => {
    reject(321);
  }, 5000);
}).catch((err) => {
  console.log(err);
});
