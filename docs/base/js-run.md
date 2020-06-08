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