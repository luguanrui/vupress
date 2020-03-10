## 路由原理

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
const Home = () => import('@/components/home'
```
- webpack的require,ensure()
```js
{
  path: '/home',
  name: 'home',
  component: r => require.ensure([], () => r(require('@/components/home')), 'demo')
},
```
## 在Vue Router中，什么是导航守卫

导航守卫就是路由从开始变化到结束变化的钩子函数。包括三种：全局的，单个路由独享的，或者组件级的

全局：
- router.beforeEach(to,from,next)
- router.afterEach(to,from,next)

路由独享的守卫：
- beforeEnter(to,from,next)

组件内的守卫：
- beforeRouterEnter(to,from,next)
- beforeRouterUpdate(to,from,next)
- beforeRouterLeave(to,from,next)

## Vue Router有几种路由模式

两种模式：hash和history模式