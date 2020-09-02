# 数组

## 数组声明式系列方法

1. 区别命令式与声明式
2. 使用数组声明式系列方法

- map()
- reduce()
- filter()
- find()
- findIndex()
- every()
- some()

```js
const arr = [1,3,6,9,15,19,16]

// 1. 产生一个每个元素都比原来大10的新数组
console.log(arr.map((item, index) => item + 10))

// 2. 得到所有奇数的和
console.log(arr.reduce((preTotal, item, index)=> preTotal + (item % 2 === 1 ? item : 0),0))

// 3. 得到值大于8且下标是偶数位的元素组成的数组
console.log(arr.filter((item, index)=> index % 2 === 0 && index > 8))

// 4. 找到一个值大于8且下标是偶数位的元素
console.log(arr.find((item, index)=> index % 2 === 0 && item > 8))

// 5. 找出一个值大于8且下标是偶数位的元素的下标
console.log(arr.findIndex((item, index)=> index % 2 === 0 && item > 8))

// 6. 判断下标为偶数的元素是否都是奇数
console.log(arr.every((item, index) => index % 2 === 1 || (index % 2 === 0 && item % 2 === 1)))

// 7. 判断是否有下标为偶数的元素值为奇数
console.log(arr.some((item, index) => index % 2 === 1 || (index % 2 === 0 && item % 2 === 1))
```

3. 自定义数组声明式系列方法
   
```js
Array.prototype.map = function(callback) {
   const arr = []
   // 遍历当前数组每个元素，调用callback得到一个结果数据，添加arr
   for (let index = 0;index < this.length; index++) {
       const element = this[index]
       const result = callback(element, index)
       arr.push(result)
   } 
   return arr
}

Array.prototype.reduce = function(callback, initValue) {
    // 结果初始值
    let total = initValue
   // 遍历当前数组每个元素，调用callback得到一个累加的结果数据
   for (let index = 0;index < this.length; index++) {
       const element = this[index]
       total = callback(total, element, index)
   } 
   // 返回结果
   return total
}

Array.prototype.filter = function(callback) {
   const arr = []
   // 遍历当前数组每个元素，调用callback得到一个 布尔值， 如果为true，将当前element添加到arr
   for (let index = 0;index < this.length; index++) {
       const element = this[index]
       const result = callback(element, index)
       if (result) {
            arr.push(result)
       }
   } 
   return arr
}

Array.prototype.find = function(callback) {
   // 遍历当前数组每个元素，调用callback得到一个 布尔值， 如果为true，返回当前元素
   for (let index = 0;index < this.length; index++) {
       const element = this[index]
       const result = callback(element, index)
       if (result) {
            return element
       }
   } 
   return undefined
}

Array.prototype.findIndex = function(callback) {
   // 遍历当前数组每个元素，调用callback得到一个 布尔值， 如果为true，返回当前元素的下标
   for (let index = 0;index < this.length; index++) {
       const element = this[index]
       const result = callback(element, index)
       if (result) {
            return index
       }
   } 
   return -1
}

Array.prototype.every = function(callback) {
   // 遍历当前数组每个元素，调用callback得到一个 布尔值，一旦是false,返回false
   for (let index = 0;index < this.length; index++) {
       const element = this[index]
       const result = callback(element, index)
       if (!result) {
            return false
       }
   } 
   return true
}

Array.prototype.some = function(callback) {
   // 遍历当前数组每个元素，调用callback得到一个 布尔值，一旦是true,返回true
   for (let index = 0;index < this.length; index++) {
       const element = this[index]
       const result = callback(element, index)
       if (result) {
            return true
       }
   } 
   return false
}
```

## 数组去重(unique)

根据当前数组产生一个去除重复元素后的新数组

### 利用forEach()和indexOf()

```js
unique1(array) {
  console.log('unique1()')
  const arr = []
  // 遍历原数组
  array.forEach(item => {
    // 只有当item不在arr中, 才添加
    if (arr.indexOf(item)===-1) {// 内部包含隐式遍历
      arr.push(item)
    }
  })

  return arr
}
```

::: warning
本质是双重遍历, 效率差些
:::

### 利用forEach() + 对象容器

```js
function unique2(array) {
  const arr = []
  const contain = {} // 属性名是item, 属性值true
  // 遍历原数组
  array.forEach(item => {
    // 只有当item不在arr中, 才添加
    // if (!contain[item]) {
    if (!contain.hasOwnProperty(item)) { // 不需要遍历
      arr.push(item)
      contain[item] = true
    }
  })

  return arr
}
```
::: warning
 只需一重遍历, 效率高些
:::

### 利用ES6语法: from + Set 或者 ... + Set

```js
function unique3(array) {
  // return Array.from(new Set(array))
  return [...new Set(array)]
}
```
::: warning
编码简洁
:::

## 数组合并(concat)与切片(slice)

### 合并concat()

- 语法: var new_array = concat(array, value1[, value2[, ...[, valueN]]]) 
- 功能: 将n个数组或值与当前数组合并生成一个新数组, 原始数组不会被改变 

```js
function concat (array, ...values) {
  const arr = [...array]
  // 遍历values, 将value或者value中的元素添加arr中
  values.forEach(value => {
    if (Array.isArray(value)) {
      arr.push(...value)
    } else {
      arr.push(value)
    }
  })
  
  return arr
}
```

### 切片slice()

- 语法: var new_array = slice(array, [begin[, end]])
- 功能: 返回一个由 begin 和 end 决定的原数组的浅拷贝, 原始数组不会被改变

```js
function slice(array, begin, end) {
  const arr = []

  // 如果原数组是空组件, 直接返回
  if (array.length===0) {
    return arr
  }
  // 处理没有指定
  begin = begin || 0
  end = end || array.length
  // 范围的限制
  if (begin<0) {
    begin = 0
  }
  if (end>array.length) {
    end = array.length
  }

  // 先实现主体操作
  for (let index = begin; index < end; index++) {
    arr.push(array[index])
  }

  return arr
}
```

## 数组扁平化(flatten)

### 理解

- 取出嵌套数组(多维)中的所有元素放到一个新数组(一维)中
- 如: [1, [3, [2, 4]]]  ==>  [1, 3, 2, 4]

### 实现
    
- 方法一: 递归 + reduce() + concat()

```js
function flatten1 (array) {
  return reduce(array, (pre, item) => {
    if (!Array.isArray(item)) {
      pre.push(item)
    } else {
      pre = concat(pre, flatten1(item))
    }
    return pre
  }, [])
}
```  

- 方法二: ... + some() + concat()

```js
function flatten2 (array) {
  let arr = concat([], ...array)
  while(some(arr, item => Array.isArray(item))) { // arr中有元素是数组
    arr = concat([], ...arr)
  }

  return arr
} 
```

## 数组取真与分块

### compact(array)

返回数组中所有真值元素组成的新数组

```js
function compact (array) {
  return filter(array, item => item)
}
```   

### chunk(array, size)

将数组拆分成多个 size 长度的区块，每个区块组成小数组,整体组成一个二维数组

```js
function chunk(array, size=1) {
  const bigArr = []
  let smallArr = []
  // 如果是空数组, 直接返回空数组
  if (array.length===0) {
    return bigArr
  }
  // 处理size
  if (size<1) {
    size = 1
  } /* else if (size>array.length) {
    size = array.length
  } */

  array.forEach(item => {

    // 将小数组bigArr中(只能放一次)
    if (smallArr.length===0) {
      bigArr.push(smallArr)
    }

    // 将元素添加到小数组
    smallArr.push(item)

    // 限制smallArr的最大长度是size
    if (smallArr.length===size) {
      smallArr = []
    }
  })

  return bigArr
}
``` 

## 数组取差异与合并

### difference(arr1, arr2)

- 得到当前数组中所有不在arr中的元素组成的数组(不改变原数组)

- 如: difference([1,3,5,7], [5, 8])  ==> [1, 3, 7]

```js
import {filter} from './declares'

export function difference(arr1, arr2) {

  // 处理特别情况
  if (arr1.length===0) {
    return []
  } else if (arr2.length===0) {
    return [...arr1]
  }
  
  // 对数组进行过滤
  return filter(arr1, item => arr2.indexOf(item)===-1)
}

export function differences(arr1, ...arrays) {

  // 处理特别情况
  if (arr1.length===0) {
    return []
  } else if (arrays.length===0) {
    return [...arr1]
  }
  
  // 对数组进行过滤
  return filter(arr1, item => {
    let result = true // 假设当前元素在后面的所有数组都不存在
    /* arrays.forEach(array => {
      const index = array.indexOf(item)
      if (index!==-1) {
        result = false
      }
    }) */
    for (let index = 0; index < arrays.length; index++) {
      const array = arrays[index];
      if (array.indexOf(item)!==-1) {
        result = false
        break // 结束当前for循环
      }
    }
    return result
  })
}
```

### mergeArray(arr1, arr2)

- 将arr2与arr1的元素进行合并组成一个新的数组(不改变原数组)
  
- 如: mergeArray([1,3,5,7,5], [5, 8]) ==> [1, 3, 5, 7, 5, 8]
  
```js
function mergeArray(array, ...arrays) {
  const result = [...array]

  if (arrays.length===0) {
    return result
  }

  arrays.forEach(itemArr => {
    itemArr.forEach(item => {
      if (result.indexOf(item)===-1) {
        result.push(item)
      }
    })
  })

  return result
}
```

##  删除数组中部分元素

### pull(array, ...values)

- 删除原数组中与value相同的元素, 返回所有删除元素的数组
- 说明: 原数组发生了改变
- 如: pull([1,3,5,3,7], 2, 7, 3, 7) ===> 原数组变为[1, 5], 返回值为[3,3,7]

```js
function pull(array, ...values) {
  const result = []

  for (let index = 0; index < array.length; index++) {
    const item = array[index];
    if (values.indexOf(item)!==-1) {// 如果有
      // 删除item
      array.splice(index, 1)
      // 将item添加到result数组
      result.push(item)
      index-- // 如果不做, 下一个元素就没有得到遍历
    }
  }

  return result
}
```
### pullAll(array, values)
- 功能与pull一致, 只是参数变为数组
- 如: pullAll([1,3,5,3,7], [2, 7, 3, 7]) ===> 数组1变为[1, 5], 返回值为[3,3,7] 

```js
function pullAll(array, values) {
  return pull(array, ...values) // 自定义函数
}
```

## 得到数组的部分元素

### drop(array, count)

- 得到当前数组过滤掉左边count个后剩余元素组成的数组
- 说明: 不改变当前数组, count默认是1
- 如: drop([1,3,5,7], 2) ===> [5, 7]

```js
function drop(array, count=1) {
  if (array.length==0) {
    return []
  }
  if (count<1) {
    count = 1
  }
  
  return array.filter((item, index) => index>=count)
}
```
### dropRight(array, count) 
- 得到当前数组过滤掉右边count个后剩余元素组成的数组
- 说明: 不改变当前数组, count默认是1
- 如: dropRight([1,3,5,7], 2) ===> [1, 3]

```js
function dropRight(array, count=1) {
  if (array.length==0) {
    return []
  }
  if (count<1) {
    count = 1
  }
  
  return array.filter((item, index) => index<array.length-count)
}
```