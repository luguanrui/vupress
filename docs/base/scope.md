## 作用域

- 函数提升优先于变量提升，函数提升会把整个函数挪到作用域顶部，变量提升只会把声明挪到作用域顶部
- var 存在提升，我们能在声明之前使用。let、const 因为暂时性死区的原因，不能在声明前使用
- var 在全局作用域下声明变量会导致变量挂载在 window 上，其他两者不会
- let 和 const 作用基本一致，但是后者声明的变量不能再次赋值

## 闭包

闭包的定义其实很简单:函数 A 内部有一个函数 B，函数 B 可以访 问到函数 A 中的变量，那么函数 B 就是闭包。

在 JS 中，闭包存在的意义就是让我们可以间接访问函数内部的变量。

```js
for (var i = 1; i <= 5; i++) { 
    setTimeout(function() {
        console.log(i)
    }, i * 1000)
}
// 打印多次 6
```

方案一：使用闭包

```js
for (var i = 1; i <= 5; i++) { 
    (function(j) {
        setTimeout(function() { console.log(j)}, j *1000)
    })(i)
}
```

方案二：setTimeout多穿一个参数

```js
for (var i = 1; i <= 5; i++) { 
    setTimeout(function(j) {
         console.log(j)
    },i * 1000, i) 
}
```

方案三：使用let

```js
for (let i = 1; i <= 5; i++) { 
setTimeout(function() {
    console.log(i)
  }, i * 1000)
}
```

## let、var、const的区别

1. let/const定义的变量不会出现变量提升，而var定义的变量会提升
2. 相同作用域中，let和const不能出现重复声明。而var就可以
3. const后者声明的变量不能再次赋值
4. const声明的引用类型可以更改，因为const声明的引用类型的指针指向的地址不可以改变，指向地址的内容是可以改变的
