### 算法类

1. 排序
    
- 快速排序：https://segmentfault.com/a/1190000009426421
- 选择排序：https://segmentfault.com/a/1190000009366805
- 希尔排序：https://segmentfault.com/a/1190000009461832
- 冒泡排序：

2. 堆栈、队列、链表

- 堆栈
- 队列
- 链表
    
3. 递归

- 递归：https://segmentfault.com/a/1190000009857470

4. 波兰式和逆波兰类

- 波兰式和逆波兰式

5. 浅拷贝和深拷贝

    浅拷贝只复制一层对象的属性，而深拷贝则递归复制了所有层级
    
- 浅拷贝的实现方案：
    - `Oject.assign()`
    ```js
    let a = { age: 1}
    let b = Object.assign({}, a) a.age = 2
    console.log(b.age) // 1
    ```
    - 展开运算符 `...`
    ```js
    let a = { age: 1}
    let b = { ...a }
    a.age = 2 console.log(b.age) // 1
    ```
- 深拷贝的实现方案

    - `JSON.parse(JSON.stringify(object))`
    ```js
    let a = {
        age: undefined,
        sex: Symbol('male'), 
        jobs: function() {},
        name: 'yck'
    }
    let b = JSON.parse(JSON.stringify(a)) console.log(b) // {name: "yck"}
    ```
    
    问题：（1）会忽略 `undefined` （2）会忽略 `symbol` （3）不能序列化函数 （4）不能解决循环引用的对象
    - 方法
    
6. 数组去重