# 对象

## 自定义new和instanceof工具函数

### 自定义new工具函数

- 语法: newInstance(Fn, ...args)
- 功能: 创建Fn构造函数的实例对象
- 实现: 创建空对象obj, 调用Fn指定this为obj, 返回obj

```js
function newInstance(Fn, ...args) {
  
  // 创建一个空对象
  const obj = {}
  // 调用Fn函数, 且指定this是新创建对象
  const result = Fn.apply(obj, args)
  // 如果Fn执行返回的是对象类型, 最终的结果就是这个对象
  if (result instanceof Object) {
    return result
  }

  // 让原型对象是空的object对象, 且constructor属性为Fn
  /* 
  obj.__proto__ = {}
  obj.__proto__.constructor = Fn
  问题: 创建每个实例的原型对象不是同一个(实际要求的是同一个)
  */
  obj.__proto__ = Fn.prototype  // 将构造函数的显示原型属性值赋值实例对象的隐式原型属性

  // 返回新建的对象
  return obj
}
```

### 自定义instanceof工具函数

- 语法: myInstanceOf(obj, Type)
- 功能: 判断obj是否是Type类型的实例
- 实现: Type的原型对象是否是obj的原型链上的某个对象, 如果是返回tru, 否则返回false

```js
function myInstanceOf(obj, Type) {
  // 得到一个原型对象
  let protoObj = obj.__proto__
  while (protoObj !== null) { // 存在原型对象
    // 如果就是Type的原型对象, 直接返回true
    if (protoObj === Type.prototype) {
      return true
    } 
    // 取出下一个原型对象, 并保存
    protoObj = protoObj.__proto__
  }
  // 出了循环, 说明类型不匹配
  return false
}
```

## 合并多个对象

- 语法: object mergeObject(...objs)
- 功能: 合并多个对象, 返回一个合并后对象(不改变原对象)
  
```js
import { concat } from '../array/concat'
function mergeObject(...objs) {
  const result = {}

  objs.forEach(obj => {
    Object.keys(obj).forEach(key => {
      const value = obj[key]
      // result中没有key属性
      if (!result.hasOwnProperty(key)) {
        result[key] = value
      } else { // result中有key属性
        // 对原值与value进行合并生成新的数组
        result[key] = concat([], result[key], value)
      }
    })
  })

  return result
}
```

##  对象/数组拷贝

1. 区别浅拷贝与深拷贝
- 纯语言表达:
  - 浅拷贝: 只是复制了对象属性或数组元素本身(只是引用地址值)
  - 深拷贝: 不仅复制了对象属性或数组元素本身, 还复制了指向的对象(使用递归)
- 举例说明: persons拷贝
  - 浅拷贝: 只是拷贝了每个person对象的引用地址值, 每个person对象只有一份
  - 深拷贝: 每个person对象也被复制了一份新的
2. 实现浅拷贝
- 方法一: 利用ES6语法
- 方法二: 利用ES5语法
3. 实现深拷贝
- 1). 大众乞丐版
  - 问题1: 函数属性会丢失
  - 问题2: 循环引用会出错
- 2). 面试基础版本
  - 解决问题1: 函数属性还没丢失
- 3). 面试加强版本
  - 解决问题2: 循环引用正常
- 4). 面试加强版本2(优化遍历性能)
  - 数组: while | for | forEach() 优于 for-in | keys()&forEach() 
  - 对象: for-in 与 keys()&forEach() 差不多

### 浅拷贝

利用ES6语法:

```js
 clone1 (target) {
  if (target instanceof Array) {
    // return [...target]
    // return target.slice()
    // return [].concat(target)
    // return Array.from(target)
    // return target.filter(value => true)
    // return target.map(item => item)
    return target.reduce((pre, item) => {
      pre.push(item)
      return pre
    }, [])
  } else if (target!==null && typeof target==='object') {
    return {...target}
  } else {// 如果不是数组或对象, 直接返回
    return target
  }
}
```

利用ES5语法: for...in

```js
clone2 (target) {
  // 被处理的目标是数组/对象
  if (target instanceof Array || (target!==null && typeof target==='object')) {
    const cloneTarget = target instanceof Array ? [] : {}
    for (const key in target) {
      if (target.hasOwnProperty(key)) {
        cloneTarget[key] = target[key]
      }
    }
    return cloneTarget
  } else {
    return target
  }
}
```

### 深拷贝

deepClone1
```js
function deepClone1 (target) {
  return JSON.parse(JSON.stringify(target))
}
```

deepClone2
```js
deepClone2 (target) {
  // 被处理的目标是数组/对象
  if (target instanceof Array || (target!==null && typeof target==='object')) {
    const cloneTarget = target instanceof Array ? [] : {}
    for (const key in target) {
      if (target.hasOwnProperty(key)) { // 只遍历对象自身的属性
        cloneTarget[key] = deepClone2(target[key])  // 对属性值进行递归处理
      }
    }
    return cloneTarget
  } else {
    return target
  }
}
```
::: warning
解决了: 函数属性会丢失
问题: 循环引用会出错
:::

deepClone3
```js
function deepClone3 (target, map=new Map()) {
  // 被处理的目标是数组/对象
  if (target instanceof Array || (target!==null && typeof target==='object')) {
    // map中存在对应的克隆对象, 直接将其返回
    let cloneTarget = map.get(target)
    if (cloneTarget) {
      return cloneTarget // 不要对同一个对象进行多次clone
    }
    // 创建克隆对象
    cloneTarget = target instanceof Array ? [] : {}
    // 保存到map容器
    map.set(target, cloneTarget)

    for (const key in target) {
      if (target.hasOwnProperty(key)) {
        cloneTarget[key] = deepClone3(target[key], map)  // 对属性值进行递归处理
      }
    }
    return cloneTarget
  } else {
    return target
  }
}
```

::: warning
解决了: 函数属性会丢失
解决: 循环引用会出错    
解决思路:
    目标: 同一个对旬/数组只能被克隆1次
    创建克隆对象前:　如果克隆对象已经存在, 直接返回
    创建克隆对象后: 保存克隆对象 
    缓存容器结构: Map  key: target, value: cloneTaget
:::

deepClone4:
```js
deepClone4 (target, map=new Map()) {
  // 被处理的目标是数组/对象
  if (target instanceof Array || (target!==null && typeof target==='object')) {
    // map中存在对应的克隆对象, 直接将其返回
    let cloneTarget = map.get(target)
    if (cloneTarget) {
      return cloneTarget // 不要对同一个对象进行多次clone
    }
    // 创建克隆对象
    if (target instanceof Array) {
      cloneTarget = []
      // 保存到map容器
      map.set(target, cloneTarget)
      // 向数组添加元素
      target.forEach((item, index) => {
        cloneTarget[index] = deepClone4(item, map)
      })
    } else {
      cloneTarget = {}
      // 保存到map容器
      map.set(target, cloneTarget)
      // 向对象添加属性
      for (const key in target) {
        if (target.hasOwnProperty(key)) {
          cloneTarget[key] = deepClone4(target[key], map)  // 对属性值进行递归处理
        }
      }
    }
    
    return cloneTarget
  } else {
    return target
  }
}
```
::: warning
优化数组的遍历: 不用for...in, 而用forEach
:::