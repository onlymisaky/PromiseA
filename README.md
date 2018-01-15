- [ajax](ajax-promise.js)
```javascript
let options = {
    type: "post",
    url: "##",
    data: {},
    dataType: "json"
};
ajax(option)
    .then((response) => { })
    .catch((e) => { });
```
- readFile
    - [promise](read-file-promise.js)([demo](read-file-promise.example.js))
    - [async/await](read-file-async.js)([demo](read-file-async.example.js))
<br>
<br>
<br>

之前对`async`函数理解有误，误以为它是可以进行高度封装的，例如把`fs.readFile`封装成像下面这样使用。

```javascript
const path = './README.md';
let text = readFileSync(path, 'utf-8');
console.log(text); // README.md 的文本内容
```
但是`fs`模块不是已经提供了`fs.readFileSync`函数了吗，为什么还要多此一举呢，即使封装出来了，这和同步读取有什么区别呢？

还有一点，`async`函数返回的永远是一个`Promise`，即使你[在函数内部写了`retrun`](#async-retrun)，它仍然会雷打不动的返回一个`Promise`对象给你，所以只能这样写
```javascript
const path = './README.md';
readFileSync(path, 'utf-8').then(data => {
    console.log(data);
});
```
其实到这里不难看出:`async`就是一个语法糖而已。

因此，我觉得`async/await`是用来处理一堆有关联的异步操作的，比如依次读取多个文本，写入一个新的文本。

<span id="async-retrun"></span>
另外还需要补充说明，关于`async`函数内部`retrun`的结果将会挂在返回的`Promise`对象的`resolve`的形参上面，如果不理解这段话，请看代码

```javascript
// 没有 retrun
async function readFileAsync(path) {
    await readFilePromise(path);
}

readFileAsync('./README.md').then(data => {
    console.log(data);  // undefined
});

// 有 retrun
async function readFileAsync(path) {
    retrun await readFilePromise(path);
}

readFileAsync('./README.md').then(data => {
    console.log(data);  // README.md 的文本内容
});

async function readFileAsync(path) {
    await readFilePromise(path);
    retrun '123'
}

readFileAsync('./README.md').then(data => {
    console.log(data);  // 123
});
```
