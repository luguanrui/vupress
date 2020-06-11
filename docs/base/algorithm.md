# 算法类

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

## 实现36进制转换

- number转string：numberObject.toString( [ radix ] )，可选/Number类型指定的基数([2, 36])，默认为10。
- string转number：parseInt( numString [, radix ] )，参数radix可以是一个介于 [2, 36] 之间的数值, 如果没有提供radix参数，则parseInt()函数将会根据参数numString的前缀来决定转换的进制基数

## 树的遍历有几种方式，实现下层次遍历

## 判断对称二叉树

## 合并乱序区间

## 算法题：老师分饼干，每个孩子只能得到一块饼干，但每个孩子想要的饼干大小不尽相同。
目标是尽量让更多的孩子满意。 如孩子的要求是 1, 3, 5, 4, 2，饼干是1, 1，
最多能让1个孩子满足。如孩子的要求是 10, 9, 8, 7, 6，饼干是7, 6, 5，最多能
让2个孩子满足。

## 算法题：给定一个正整数数列a, 对于其每个区间, 我们都可以计算一个X值;
X值的定义如下: 对于任意区间, 其X值等于区间内最小的那个数乘上区间内所有数和;
现在需要你找出数列a的所有区间中, X值最大的那个区间;
如数列a为: 3 1 6 4 5 2; 则X值最大的区间为6, 4, 5, X = 4 * (6+4+5) = 60;

## 两个有序链表和并成一个有序链表

## 深拷贝与浅拷贝

1. 基本类型--名值存储在栈内存中
2. 引用数据类型--名存在栈内存中，值存在于堆内存中，但是栈内存会提供一个引用的地址指向堆内存中的值
3. 浅拷贝复制的数组对象在栈内存中的引用地址