# 防抖和节流

1. 事件频繁触发可能造成的问题?
   - 一些浏览器事件:window.onresize、window.mousemove等，触发的频率非常高，会造成浏览器性能问题
   - 如果向后台发送请求，频繁触发，对服务器造成不必要的压力

2. 如何限制事件处理函数频繁调用
   - 函数节流
   - 函数防抖

## 防抖debounce

### 概念

- 概念： 触发事件后，在n秒内函数只执行一次（在函数需要频繁触发时: **在规定时间内，只让最后一次生效**，前面的不生效；适合多次事件一次响应的情况）
- 如果在 n 秒内，又触发了事件，则重新计算函数执行时间
- 单位时间内，操作n次，选中最后一次
- 特点：延迟->无限后延
- 原理：不断刷新定时器

实现：

```js
function debounce(fn, delay = 200) {
    let timer = null
    return (...arg) => {
        clearTimeout(timer)
        timer = setTimeout(()=> {
            fn.apply(this, arg)
        }, delay)
    }
}
```

其他实现方式：
```js
/* 
用来返回防抖函数的工具函数
*/
function debounce(callback, delay) {
  return function (event) {

    // 如果上次事件还没有真正处理, 取消它
    // if (callback.timeoutId) { // 会查找原型链
    if (callback.hasOwnProperty('timeoutId')) { // 不会查找原型链
      // 清除
      clearTimeout(callback.timeoutId)
    }

    // 发事件发生指定事件后才调用处理事件的回调函数
    // 启动定时器, 只是准备真正处理
    callback.timeoutId = setTimeout(() => {
      // 正在处理事件
      callback.call(this, event)
      // 删除准备处理的标记
      delete callback.timeoutId
    }, delay)
  }
}
```

### 应用场景

- 输入框实时搜索联想（keyup/input）

## 节流throttle

### 概念

- 概念：连续触发事件，但是在n秒中只执行一次函数，节流会稀释函数的执行频率（在函数需要频繁触发时: 函数执行一次后，只有大于设定的执行周期后才会执行第二次；**适合多次事件按时间做平均分配触发**）
- 单位时间内，操作n次，选中第一次
- 特点：只执行一次
- 原理：设置标识位，看能不能触发

实现：
```js
function throttle(fn, delay = 200) {
    let flag = true
    return (...args) => {
        if (!flag) return
        flag = false
        setTimeout(() => {
            fn.apply(this, args)
            flag = true
        }, delay) 
    }
}
```

### 应用场景
- 窗口调整（resize）
- 页面滚动（scroll）
- DOM 元素的拖拽功能实现（mousemove）
- 抢购疯狂点击（click）

其他实现方式：

```js
/* 
用来返回节流函数的工具函数
*/
function throttle(callback, delay) {
  let pre = 0 // 默认值不要是Date.now() ==> 第1次事件立即调用
  return function (event) { // 节流函数/真正的事件回调函数   this是发生事件的标签
    console.log('事件 throttle')
    const current = Date.now()
    if (current - pre > delay) { // 只有离上一次调用callback的时间差大于delay
      // 调用真正处理事件的函数, this是事件源, 参数是event
      callback.call(this, event) // 立即
      // 记录此次调用的时间
      pre = current
    }
  }
}
````