# 改变函数对象中的this指向

## 箭头函数与普通函数的区别

- 箭头函数语法上更简洁
- 箭头函数没有自己的this，它里面的this继承函数所处的上下文中的this（使用call，apply,bind并不会改变箭头函数的this指向）
- 箭头函数中的没有`arguments`（类数组），只能基于`...arg`获取传的参数集合(数组)
- 箭头函数不能被new执行，因为箭头函数没有`this`，也没有`prototype`

## call/apply/bind

使用案例：

```js
// 定义函数
function fn(a,b) {
    this.xxx = 3
    console.log(a, b, this)
    return a + b
}

fn(1,2)                     // 1,2,Window
console.log(xxx)  

const obj = {m: 0}

// 改变this指向
// call参数平铺
fn.call(obj, 1,2)            // 1,2, obj
fn.call(undefined, 1,2)      // 1,2, Window
fn.call(null,1,2)            // 1,2, Window
// apply参数为数组
fn.apply(obj, [1,2])         // 1,2, obj

// bind返回一个新的函数，为了看到结果，我们去执行下函数
fn.bind(obj)(3,4)            // 3,4, obj
fn.bind(obj, 5)(3,4)         // 5,3, obj
fn.bind(obj, 5, 6)(3,4)      // 5,6, obj

```

### 区别

api | 函数是否执行 | this指向 | 参数
---|---|---|---
call | 执行 | 指向第一个参数 | call(obj, param1,param1...)
apply | 执行 | 指向第一个参数 | apply(obj, [param1,param1...])
bind | 返回一个新的函数 <br>（新函数内部会调用原来的函数） | 指向第一个参数 | bind(obj, param1,param1...)

::: warning

如果 obj 为 `undefined` 或 `null`，`this` 指向 `Window`对象

:::

### 应用

- call/bind：根据伪数组生成真数组
- bind：react中组件的自定义方法 / vue中的事件回调函数内部

### 自定义call、apply

1. 给obj添加一个临时方法，方法名任意，值为当前函数
2. 通过obj调用这个临时方法，并将接收的参数传入
3. 删除obj上的这个临时方法属性

call():
```js
Function.prototype.call = function(obj, ...args) {
  // console.log('call()')
  // 执行函数
  // this(...args)

  // 处理obj是undefined或者null的情况
  if (obj===undefined || obj===null) {
    obj = window
  }

  // 给obj添加一个方法: tempFn: this
  obj.tempFn = this
  // 调用obj的tempFn方法, 传入rags参数, 得到返回值
  const result = obj.tempFn(...args)
  // 删除obj上的temFn
  delete obj.tempFn
  // 返回方法的返回值
  return result
}
```

apply():
```js
Function.prototype.apply = function(obj, args) {
  // 处理obj是undefined或者null的情况
  if (obj===undefined || obj===null) {
    obj = window
  }

  // 给obj添加一个方法: tempFn: this
  obj.tempFn = this
  // 调用obj的tempFn方法, 传入rags参数, 得到返回值
  const result = obj.tempFn(...args)
  // 删除obj上的temFn
  delete obj.tempFn
  // 返回方法的返回值
  return result
}
```

### 自定义bind

1. 返回一个新函数
2. 在新函数内部通过原函数对象的call方法来执行原函数，指定this为obj，指定参数为bind调用的参数和后面新函数调用的参数

```js
Function.prototype.bind = function(obj, ...args) {
  // 返回一个新函数
  return (...args2) => {
    // 调用原来函数, 指定this为obj, 参数列表由args和args2依次组成
    return this.call(obj, ...args, ...args2)
  }
}
```

## 其他自定义实现方式
### call

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

### apply

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

### bind

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