## 引子
今年（2017）,国产的前端mvvm框架[vue](https://cn.vuejs.org/)已经红的发紫了，网上的相关教程遍地都是，于是就在github上clone了几个学习一下，却发现都是ES6语法，之前对ES6的掌握只停留在了解和浅度会使用这个层面。因此觉得有必要系统的看一下ES6了。于是就先写了一个用promise实现的ajax方法。参数设计参看jQuery.ajax
## 示例
```javascript
var options = {
	type: "post",
	url: "##",
	data: {},
	dataType: "json"
};
ajax(option)
	.then((response) => {})
  	.catch((e) => {});
```
