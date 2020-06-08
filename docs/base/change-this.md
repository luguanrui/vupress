
# 改变this执行

## 箭头函数与普通函数的区别

- 箭头函数语法上更简洁
- 箭头函数没有自己的this，它里面的this继承函数所处的上下文中的this（使用call，apply,bind并不会改变箭头函数的this指向）
- 箭头函数中的没有`arguments`（类数组），只能基于`...arg`获取传的参数集合(数组)
- 箭头函数不能被new执行，因为箭头函数没有`this`，也没有`prototype`

call，apply,bind 特点：
- 都是改变当前this的指向
- call和apply立即执行当前函数
- bind并不执行当前函数,而是返回一个函数

## call

调用方法：
```js
func.call(thisArg, arg1, arg2, ...)
```

手写实现：
```js
Function.prototype._call = function(context) {
    // 赋值作用域参数,如果没有则默认为window对象
    context = context || window
    // 绑定当前调用函数
    context.fn = this
    // 获取传入的参数，args是一个数组
    const args = [...arguments].slice(1)
    // 执行当前调用函数，并传入参数（数组解构）
    const result = context.fn(...args)
    // 删除函数
    delete context.fn 
    // 返回执行函数
    return result
}
```

## apply

调用方法：
```js
func.apply(thisArg, [argsArray])
```

手写实现：
```js
Function.prototype._apply = function (context) {
    // 赋值作用域参数,如果没有则默认为window对象
    context = context || window
    // 绑定当前调用函数
    context.fn = this
    let result
    // 如果有参数，则传入参数
    if (arguments[1]){
        // 数组解构
        result = context.fn(...arguments[1])
    }else {
    // 如果没有参数，则直接执行当前的调用函数
        result = context.fn()
    }
    // 删除函数
    delete context.fn
    // 返回执行函数
    return result
}
```

## bind

调用方法：
```js
func.bind(thisArg[, arg1[, arg2[, ...]]])
```

手写实现：
```js
Function.prototype._bind = function(context) {
    // 保存原有函数
    const _this = this
    // 获取参数
    const args = [...arguments].slice(1)
    // 返回一个函数
    return function F() {
        if (this instanceof F){
        // new方式调用
            return new _this(...args, ...arguments)
        }
        // 直接调用
        return _this.apply(context, args.concat(...arguments))
    }
}
```