# 算法类

## 将数组转化为树形结构
- 以下数据结构中，id 代表部门编号，name 是部门名称，parentId 是父部门编号，为 0 代表一级部门，
现在要求实现一个 convert 方法，
把原始 list 转换成树形结构，parentId 为多少就挂载在该 id 的属性 children 数组下，结构如下：
```json
let list =[
    {id:1,name:'部门A',parentId:0},
    {id:2,name:'部门B',parentId:0},
    {id:3,name:'部门C',parentId:1},
    {id:4,name:'部门D',parentId:1},
    {id:5,name:'部门E',parentId:2},
    {id:6,name:'部门F',parentId:3},
    {id:7,name:'部门G',parentId:2},
    {id:8,name:'部门H',parentId:4}
];
const result = convert(list, ...);
```

转换后的结果如下：
```json
let result = [
    {
      id: 1,
      name: '部门A',
      parentId: 0,
      children: [
        {
          id: 3,
          name: '部门C',
          parentId: 1,
          children: [
            {
              id: 6,
              name: '部门F',
              parentId: 3
            }, {
              id: 16,
              name: '部门L',
              parentId: 3
            }
          ]
        },
        {
          id: 4,
          name: '部门D',
          parentId: 1,
          children: [
            {
              id: 8,
              name: '部门H',
              parentId: 4
            }
          ]
        }
      ]
    },
  ···
];
```

## 排序
    
  - 快速排序：https://segmentfault.com/a/1190000009426421
  - 选择排序：https://segmentfault.com/a/1190000009366805
  - 希尔排序：https://segmentfault.com/a/1190000009461832
  - 冒泡排序：

## 堆栈、队列、链表

- 堆栈
- 队列
- 链表
    
## 递归

  - 递归：https://segmentfault.com/a/1190000009857470

- 波兰式和逆波兰类

  - 波兰式和逆波兰式

## 浅拷贝和深拷贝
1. 基本类型--名值存储在栈内存中
2. 引用数据类型--名存在栈内存中，值存在于堆内存中，但是栈内存会提供一个引用的地址指向堆内存中的值
3. 浅拷贝复制的数组对象在栈内存中的引用地址
    
### 浅拷贝

1. Oject.assign

```js
// 对象
const clone = obj => Object.assign({}, obj)
```

2. 扩展运算符...

```js
// 对象
const clone = obj => {...obj}
// 数组
```

### 深拷贝

1. JSON.parse + JSON.stringify

```js
// 对象或数组
const deepClone = obj => typeof obj ==='undefined' ? JSON.parse(JSON.stringify(obj)) : null;
```
::: warning 问题
1. 会忽略 `undefined`
2. 会忽略 `symbol`
3. 不能序列化函数
4. 不能解决循环引用的对象
:::

2. for...in + 递归

```js
const deepClone = obj => {
    var target = {};
    for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            if (typeof obj[key] === "object") {
            target[key] = deepClone(obj[key]);
            } else {
            target[key] = obj[key];
            }
        }
    }
    return target;
};
```
3. Object.create
```js
const deepClone = obj => {
    var copy = Object.create(Object.getPrototypeOf(obj));
    var propNames = Object.getOwnPropertyNames(obj);

    propNames.forEach(name => {
    var desc = Object.getOwnPropertyDescriptor(obj, name);
    Object.defineProperty(copy, name, desc);
    });

    return copy;
};
```
## 数组去重

数组如下：
```js
const arr = [1,1,'true','true',true,true,15,15,false,false, undefined,undefined, null,null, NaN, NaN,'NaN', 0, 0, 'a', 'a',{},{}]
```

- Set
```js
const unique = arr => [...new Set(arr)]

// 或者
const unique = arr => Array.from(new Set(arr))

unique(arr)
// [1, "true", true, 15, false, undefined, null, NaN, "NaN", 0, "a", {}, {}]
```
::: warning 问题
{}无法去重
:::

- 双层for循环+splice
```js
const unique = (arr) => {
      for (var i = 0; i < arr.length; i++) {
        for (var j = i + 1; j < arr.length; j++) {
          if (arr[i] == arr[j]) {
            //第一个等同于第二个，splice方法删除第二个
            arr.splice(j, 1);
            j--;
          }
        }
      }
      return arr;
};
unique(arr)
// [1, "true", 15, false, undefined, NaN, NaN, "NaN", "a", {}, {}]
```
::: warning 问题
1. null会都去掉
2. NaN无法去重
3. 0都会去掉
4. {}无法去重
:::

- indexOf
```js
const unique = (arr) => {
    if (!Array.isArray(arr)) {
    console.log("type error!");
    return;
    }
    var array = [];
    for (var i = 0; i < arr.length; i++) {
    if (array.indexOf(arr[i]) === -1) {
        array.push(arr[i]);
    }
    }
    return array;
};

unique(arr)
// [1, "true", true, 15, false, undefined, null, NaN, NaN, "NaN", 0, "a", {}, {}]
```
::: warning 问题
1. NaN无法去重
2. {}无法去重
:::

- includes
```js
const unique = (arr) => {
    if (!Array.isArray(arr)) {
    console.log("type error!");
    return;
    }
    var array = [];
    for (var i = 0; i < arr.length; i++) {
    if (!array.includes(arr[i])) {
        //includes 检测数组是否有某个值
        array.push(arr[i]);
    }
    }
    return array;
};

unique(arr)
// [1, "true", true, 15, false, undefined, null, NaN, "NaN", 0, "a", {…}, {…}]
```
::: warning 问题
1. {}无法去重
:::

- hasOwnProperty
```js
const unique = (arr) => {
    var obj = {};
    return arr.filter((item) =>
    obj.hasOwnProperty(typeof item + item)
        ? false
        : (obj[typeof item + item] = true)
    );
};
unique(arr)
// [1, "true", true, 15, false, undefined, null, NaN, "NaN", 0, "a", {}]
```
::: tip 成功
全部去重
:::

- filter
```js
const unique = (arr) => {
    return arr.filter(function(item, index, arr) {
    //当前元素，在原始数组中的第一个索引==当前索引值，否则返回当前元素
    return arr.indexOf(item, 0) === index;
    });
};
unique(arr)
// [1, "true", true, 15, false, undefined, null, "NaN", 0, "a", {}, {}]
```
::: warning 问题
1. NaN会全部删除掉
2. {}无法去重
:::

- reduce+includes
```js
const unique = arr =>
    arr.reduce(
    (prev, cur) => (prev.includes(cur) ? prev : [...prev, cur]),
    []
    );
unique(arr)
// [1, "true", true, 15, false, undefined, null, NaN, "NaN", 0, "a", {}, {}]
```
::: warning 问题
1. {}无法去重
:::


## 实现36进制转换

- number转string：numberObject.toString( [ radix ] )，可选/Number类型指定的基数([2, 36])，默认为10。
- string转number：parseInt( numString [, radix ] )，参数radix可以是一个介于 [2, 36] 之间的数值, 如果没有提供radix参数，则parseInt()函数将会根据参数numString的前缀来决定转换的进制基数

## 数组展评

### 二维数组展开

```js
// [1,2,[3,4]]
function flattenOnce(arr){
    return [].concat(...arr)
}
```

### 多维数组展开(递归)

```js
// [[1,2],3,[[[4],5]]]
function flatten(arr) {
    return [].concat(
        ...arr.map(x => Array.isArray(x) ? flatten(x) : x)
    )
}
```

## 函数柯里化

把接受多个参数的函数变为接受单一参数的函数，并且返回接收余下的参数 且 返回的结果的 新函数

使用场景：
- 参数复用
- 提前确认，避免每次都重复判断
- 延迟计算/运行

```js
const curry = func => {
    const g = (...allArgs) => allArgs.length >= func.length ? func(...allArgs) 
    : (...args) => g(...allArgs, ...args)
    return g
}
```