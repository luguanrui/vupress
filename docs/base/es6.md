# es6

## Symbol

1. 什么是Symbol

- ES6 引入的一种新的原始数据类型Symbol，表示独一无二的值
- 通过`Symbol()`函数生成实例，不能使用new创建

```js
let sym = Symbol() // 创建Symbol实例，不可以使用new来创建

let sym1 = Symbol('a')
let sym2 = Symbol('b')

typeof sym // symbol
sym1 === sym2 // false
```

2. 它的使用场景是什么

- 作为对象的属性名

```js
let symObj = {
    name: '小王'
}

const Age = Symbol()
const ClassName = Symbol()
symObj[Age] = 12
symObj[ClassName] = '一年级'

symObj[Age] // 12
symObj[ClassName] // "一年级"
```

::: tip
1. 使用`for...in`, `Object.keys()`枚举对象时，是获取不到Symbol类型的key的
2. 使用`JSON.stringify()`将对象转换成JSON字符串也是会忽略Symbol属性的
3. 获取以Symbol方式定义的对象属性：`Object.getOwnPropertySymbols(obj)`或者`Reflect.ownKeys(obj)`
:::


- 代替常量

```js
const COURSE_TYPE = Symbol()
const SKU_TYPE = Symbol()
const LIVE_TYPE = Symbol()
```

- 定义私有属性/方法

a.js
```js
const PASSWORD = Symbol()

class Login {
  constructor(username, password) {
    this.username = username
    this[PASSWORD] = password
  }

  checkPassword(pwd) {
      return this[PASSWORD] === pwd
  }
}

export default Login
```
b.js
```js
import Login from './a'

const login = new Login('admin', '123456')

login.checkPassword('123456')  // true

login.PASSWORD  // oh!no!
login[PASSWORD] // oh!no!
login["PASSWORD"] // oh!no
```

- 注册和获取全局Symbol
```js
let gs1 = Symbol.for('global_symbol_1')  //注册一个全局Symbol
let gs2 = Symbol.for('global_symbol_1')  //获取全局Symbol

gs1 === gs2  // true
```

## Map和Weakmap的区别

1. Map

字符串作为key， 和JS对象类似
```js
var map = new Map()
// set
map.set('name', 'John')
map.set('age', 29)
// get
map.get('name') // John
map.get('age')  // 29
```

key可以是任意类型
```js
// 对象作为key演示
var xy = {x: 10, y: 20}   // 坐标
var wh = {w: 100, h: 200} // 宽高
var map = new Map()
// set
map.set(xy, '坐标')
map.set(wh, '宽高')
// get
map.get(xy) // '坐标'
map.get(wh) // '宽高'
```

传数组方式

```js
var map = new Map([["name", "John"], ["age", "29"]])
 
// 遍历key
for (var key of map.keys()) {
    console.log(key) // name, age
}
```

迭代器

```js
var map = new Map()
// set
map.set('name', 'John')
map.set('age', 29)
// get
map.get('name') // 'John'
map.get('age')  // 29

// 遍历key
for (var key of map.keys()) {
    console.log(key)
}
 
// 遍历value
for (var val of map.values()) {
    console.log(val)
}
 
// 遍历实体
for (var arr of map.entries()) {
    console.log('key: ' + arr[0] + ', value: ' + arr[1])
}
 
// 遍历实体的简写
for (var [key, val] of map.entries()) {
    console.log('key: ' + key + ', value: ' + val)
}
```

方法和属性：
- clear
- delete
- entries
- forEach
- get
- set
- has
- keys
- size
- values

2. WeakMap

与Map的区别

- 不接受基本类型的值作为键名
- 没有keys、values、entries和size

属性和方法：

- clear
- delete
- get
- set
- has


## Promise

三种状态

状态 | 说明
--- | ---
pending | 初始状态
fulfilled | 完成状态
rejected | 失败状态

### reject和catch

- reject后的东西，一定会进入then中的第二个回调，如果then中没有写第二个回调，则进入catch
- resolve的东西，一定会进入then的第一个回调，肯定不会进入catch

### 手写promise

```js
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

function MyPromise(executor) {
    this.state = PENDING;
    this.value = null;
    this.reason = null;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = value => {
        if (this.state === PENDING) {
            this.state === FULFILLED;
            this.value === value;
            this.onFulfilledCallbacks.forEach(fuc =>{
                fuc();
            });
        }
    };

    const reject = reason => {
        if (this.state === PENDING) {
            this.state = REJECTED;
            this.reason === reason;
            this.onRejectedCallbacks.forEach(fuc =>{
                fuc();
            })
        }
    };

    try {
        executor(resolve, reject);
    } catch (reason) {
        reject(reason);
    }
}

/*
- then方法接受两个参数onFulfilled、onRejected，它们分别在状态由PENDING改变为FULFILLED、REJECTED后调用
- 一个promise可绑定多个then方法
- then方法可以同步调用也可以异步调用
- 同步调用：状态已经改变，直接调用onFulfilled方法
- 异步调用：状态还是PENDING，将onFulfilled、onRejected分别加入两个函数- 
- 数组onFulfilledCallbacks、onRejectedCallbacks，
- 当异步调用resolve和reject时，将两个数组中绑定的事件循环执行。
*/

MyPromise.prototype.then = function(onFulfilled,onRejected){
    switch(this.state){
        case FULFILLED:
            onFulfilled(this.value);
            break;
        case REJECTED:
            onRejected(this.reason);
            break;
        case PENDING:
            this.onFulfilledCallbacks.push(()=>{
                onFulfilled(this.value);
            });
            this.onRejectedCallbacks.push(() => {
                onRejected(this.reason);
            })
            break;
            
    }
}

// 由于catch方法是then(null, onRejected)的语法糖，所以这里也很好实现
MyPromise.prototype.catch = function(onRejected){
    return this.then(null, onRejected);
}
```