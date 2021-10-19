## promisify

- [ajax](promisify/ajax.js)
```javascript
ajax({
  url: '/ajax/login',
  method: 'post',
  data: {username: 'qq', password: 'pp'}
}).then((res) => { }).catch((err) => { });
```
- [sleep](promisify/sleep.js)

- readFile
  - [promise](promisify/read-file-promise.js)([demo](promisify/read-file-promise.example.js))
  - [async/await](promisify/read-file-async.js)([demo](promisify/read-file-async.example.js))
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

后来学习了 Event Loop 之后才明白二者之前的区别。而且不是所有的函数都有对应的同步版本，但可以通过 `async/await` 编写类似同步风格的代码。

<del>
还有一点，`async`函数返回的永远是一个`Promise`，即使你[在函数内部写了`retrun`](#async-retrun)，它仍然会雷打不动的返回一个`Promise`对象给你，所以只能这样写

```javascript
const path = './README.md';
readFileSync(path, 'utf-8').then(data => {
    console.log(data);
});
```

其实到这里不难看出:`async`就是一个语法糖而已。

因此，我觉得`async/await`是用来处理一堆有关联的异步操作的，比如依次读取多个文本，写入一个新的文本。

</del>
