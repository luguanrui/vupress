# 防抖和节流

## 防抖

- 概念： 触发事件后，在n秒内函数只执行一次
- 如果在 n 秒内，又触发了事件，则重新计算函数执行时间
- 单位时间内，操作n次，选中最后一次
- 特点：延迟->无限后延
- 原理：不断刷新定时器

实现：

```js
function debounce(fn, delay) {
    let timer = null
    return (...arg) => {
        clearTimeout(timer)
        timer = setTimeout(()=> {
            fn.apply(this, arg)
        }, delay)
    }
}
```

## 节流

- 概念：连续触发事件，但是在n秒中只执行一次函数，节流会稀释函数的执行频率
- 单位时间内，操作n次，选中第一次
- 特点：只执行一次
- 原理：设置标识位，看能不能触发

实现：
```js
function throttle(fn delay) {
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
