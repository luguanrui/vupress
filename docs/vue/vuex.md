## vuex原理
## 如何开启Vuex的严格模式？它有什么作用？

开启严格模式，仅需在创建 store 的时候传入strict: true

```js
const store = new Vuex.Store({
   state,
   strict:true//开启严格模式后，只能通过mutation来改变状态（不支持异步）否则会报错
})
```

## Vuex的Mutation和Action有哪些区别

- mutation是修改store中state的唯一途径
- mutation必须是同步的
- action可以是异步的，但是不能直接操作state，需要通过提交 mutation 间接更变状态

## 请谈谈你对Vuex的理解

Vuex 是一个专为 Vue.js 应用程序开发的状态管理模式。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化