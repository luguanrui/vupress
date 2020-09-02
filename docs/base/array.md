## 数组

### 数组声明式系列方法

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