# 事件循环机制

[浏览器是多进程的](https://www.infoq.cn/article/CS9-WZQlNR5h05HHDo1b)，每个tab页都相当于是一个浏览器的进程（进程（process）是cpu资源分配的最小单位，线程（thread）是cpu调度的最小单位，线程是建立在进程的基础上的一次程序运行单位，一个进程中可以有多个线程）

浏览器有哪些进程：

- Browser Process
- GPU Process
- Plugin Process
- Renderer Process
- Device Process
- Storage Process
- Network Process
- UI Process

JavaScript是**单线程**执行的，所谓的单线程就是指一次只能完成一个任务，如果是多个任务就必须要排队执行，前面一个任务执行完毕之后，再执行后面一个任务。（因为js引擎的主线程负责代码的运行，有且只有一个主线程）

缺点：如果一个任务耗时较长，后面的任务就必须排队等着，容易造成浏览器无响应（假死）

解决方案：JavaScript将执行模式分为两种：同步任务（Synchronous）和异步任务（Asynchronous）

同步任务：后一个任务等待前一个任务执行结束在执行

异步任务：每个异步任务都有一个或多个回调函数（callback），前一个任务结束后，不是执行后一个任务，而是执行后一个任务的回到函数。异步任务相关的回调函数会被放入任务队列（callback queue），当主线程中的执行栈被清空时，去任务队列中取任务到执行栈中执行


- javascript是单线程语言，一个线程里只有一个调用栈（call stack）
- 单线程：一次只能做一件事
- js执行，任务进入调用栈，同步任务进入主线程，异步任务进入事件队列，待主线程中的同步任务执行完毕之后，清空调用栈，事件循环检测主线程是否清空，如果清空，依次从执行任务队列中取任务到调用栈中执行，执行完毕，清空调用栈

1. JavaScript 引擎是单线程，也就是说每次只能执行一项任务，其他任务都得按照顺序排队等待被执行，只有当前的任务执行完成之后才会往下执行下一个任务。

2. js又分为同步任务和异步任务
3. 同步任务：在主线程(这里的主线程就是JS引擎线程)上执行，会形成一个执行栈
4. 异步任务：宏任务（macrotask，也被成为task）和微任务（microtask，也被成为jobs）

    宏任务包括：
    - 主代码块
    - setTimeout
    - setInterval
    - setImmediate ()-Node
    - requestAnimationFrame ()-浏览器
    
    微任务包括：
    - process.nextTick ()-Node
    - Promise.then()
    - catch
    - finally
    - Object.observe
    - MutationObserver

题目：同步任务和异步任务的执行顺序
    
```js
console.log(1)
setTimeout(function() {console.log(3)},0)
console.log(2)

结果：1，2，3
```
    
单线程：同一个时间只能做一个事情
    
任务队列：包括同步任务（console）、异步任务（setTimeout，setInterval），同步任务处理完之后执行异步任务
        
题目：
    
```js
console.log('A')
while(true){}
console.log('B')
// 结果: A
```
    
题目：
    
```js
console.log('A')
setTimeout(function() {console.log('B')},0)
while(true){}
// 结果: A
```
    
题目：
    
```js
for(var i=0;i<4;i++){
    setTimeout(function() {console.log(i)},1000)
}

// 或者
 for(var i=0;i<4;i++){
    setTimeout(function() {console.log(i)},0)
}
结果：打印四次4
```
    
解析：队列插入时间，for循环执行到setTimeout时，并没有将setTimeout放置到异步队列中去，只有当定时器的时间到了，才会将setTimeout放置到异步队列，等待事件循环，执行setTimeout，此时i已经变为4
    
- 如何理解js的单线程：一个时间之内，js只能做一件事
    
- 什么是任务队列：同步任务和异步任务
    
- 什么是Event Loop
    
- 异步任务：
        
    - setTimeout和setInterval
        
    - DOM事件
        
    -  ES6中的Promise

题目：

```js
console.log('script start')

async function async1() {
  await async2()
  console.log('async1 end')
}
async function async2() {
  console.log('async2 end')
}
async1()

setTimeout(function() {
  console.log('setTimeout')
}, 0)

new Promise(resolve => {
  console.log('Promise')
  resolve()
})
  .then(function() {
    console.log('promise1')
  })
  .then(function() {
    console.log('promise2')
  })

console.log('script end')

// script start => async2 end => Promise => script end => promise1 => promise2 => async1 end => setTimeout

// 新版本浏览器的执行顺序如下：因为 await 变快了
// script start => async2 end => Promise => script end => async1 end => promise1 => promise2 =>setTimeout
```