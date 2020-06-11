---
sidebar: auto
---

# VueRouter

## 路由原理

SPA(single page application):单一页面应用程序，有且只有一个完整的页面；当它在加载页面的时候，不会加载整个页面的内容，而只更新某个指定的容器中内容。

单页面应用(SPA)的核心之一是:
1. 更新试图但是不重新请求页面，而且替换当前页面
2. vue-router实现单页面路由跳转，提供了三种方式：`hash`模式、`history`模式，根据mode参数来决定采用哪一种方式。

## 如何在Vue Router中配置404页面？
```js
export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/newDetail',
      name: 'newDetail',
      component: na
    },
    {
      path: '*',
      name: 'notfount',
      component: notfount
    }
  ]
})
```

## 如何在Vue Router中切换路由时，保持原先的滚动位置

## 在Vue Router中，怎么实现路由懒加载

- vue异步组件
```js
{
  path: '/home',
  name: 'home',
  component: resolve => require(['@/components/home'],resolve)
}
```
- es提案的import()
```js
const Home = () => import('@/components/home'）

{
  path: '/home',
  name: 'home',
  component: Home
}
```
- webpack的require,ensure()
```js
{
  path: '/home',
  name: 'home',
  component: r => require.ensure([], () => r(require('@/components/home')), 'demo')
}
```
## 在Vue Router中，什么是导航守卫

导航守卫就是路由从开始变化到结束变化的钩子函数。包括三种：全局的，单个路由独享的，或者组件级的

全局：
- router.beforeEach(to, from, next)
- router.afterEach(to, from, next)

路由独享的守卫：
- beforeEnter(to, from, next)

组件内的守卫：
- beforeRouterEnter(to, from, next)
- beforeRouterUpdate(to, from, next)
- beforeRouterLeave(to, from, next)

## Vue Router有几种路由模式

两种模式：hash和history模式

## hash路由和history路由实现原理说一下

- hash路由通过`window.onhashchange`方法，来监听hash的变化触发路由对应的视图变化
```js
// hash变化包括：1.js修改url，2.手动修改url,3.浏览器前进后退
window.onhashchange = event => {
  console.log('old url', event.oldURL)
  console.log('new url', event.newURL)
}
// 页面初次加载获取 hash
document.addEventListener('DOMContentLoaded', () => {
  console.log('hash', location.hash)
})
```

表现：

1. hash变化会触发网页跳转，即浏览器的前进后退
2. hash变化不会刷新页面，spa必需的特点
3. hash永远不会提交到server端

- history实际采用了HTML5中提供的API来实现，主要有`history.pushState()`和`window.onpopstate()`，设置history模式需要后台支持

```js
// 页面初次加载获取 path
document.addEventListener('DOMContentLoaded', () => {
  console.log('load', location.pathname)
})
// 打开一个新的路由，使用pushState方式，浏览器不会刷新页面
document.getElementById('btn').addEventListener('click', () => {
  const state = {name: 'page1'}
  console.log('路由切换到', 'page1')
  history.pushState(state, '', 'page1')
})
// 监听浏览器前进后退
window.onpopstate = event => {
  console.log('onpopstate', event.state, event.pathname)
}
```

表现：

1. 用url规范的路由，但跳转时不刷新页面
2. 通过`history.pushState()`，`window.onpopstate()`来实现

## 动态路由

```js
const router = new Router({
  routes: [
    {
      path: '/user/:id', component: User
    }
  ]
})
```