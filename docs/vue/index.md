## 什么是MVVM

## 生命周期

答：总共分为8个阶段创建前/后，载入前/后，更新前/后，销毁前/后。

创建前/后： 在beforeCreated阶段，vue实例的挂载元素$el和数据对象data都为undefined，还未初始化。在created阶段，vue实例的数据对象data有了，$el还没有。

载入前/后：在beforeMount阶段，vue实例的$el和data都初始化了，但还是挂载之前为虚拟的dom节点，data.message还未替换。在mounted阶段，vue实例挂载完成，data.message成功渲染。

更新前/后：当data变化时，会触发beforeUpdate和updated方法。

销毁前/后：在执行destroy方法后，对data的改变不会再触发周期函数，说明此时vue实例已经解除了事件监听以及和dom的绑定，但是dom结构依然存在

## 数据绑定原理

答：vue.js 是采用数据劫持结合发布者-订阅者模式的方式，通过Object.defineProperty()来劫持各个属性的setter，getter，在数据变动时发布消息给订阅者，触发相应的监听回调。

具体步骤：

第一步：需要observe的数据对象进行递归遍历，包括子属性对象的属性，都加上 setter和getter
这样的话，给这个对象的某个值赋值，就会触发setter，那么就能监听到了数据变化

第二步：compile解析模板指令，将模板中的变量替换成数据，然后初始化渲染页面视图，并将每个指令对应的节点绑定更新函数，添加监听数据的订阅者，一旦数据有变动，收到通知，更新视图

第三步：Watcher订阅者是Observer和Compile之间通信的桥梁，主要做的事情是:
1、在自身实例化时往属性订阅器(dep)里面添加自己
2、自身必须有一个update()方法
3、待属性变动dep.notice()通知时，能调用自身的update()方法，并触发Compile中绑定的回调，则功成身退。

第四步：MVVM作为数据绑定的入口，整合Observer、Compile和Watcher三者，通过Observer来监听自己的model数据变化，通过Compile来解析编译模板指令，最终利用Watcher搭起Observer和Compile之间的通信桥梁，达到数据变化 -> 视图更新；视图交互变化(input) -> 数据model变更的双向绑定效果。

## 路由原理

## vuex原理

## keep-alive的作用

## v-if和v-show的区别

## computed与watch的区别

## 虚拟dom与diff算法

## 组件通信

## vue-loader是什么？使用它的用途有哪些

答：解析.vue文件的一个加载器，跟template/js/style转换成js模块。

用途：js可以写es6、style样式可以scss或less、template可以加jade等

## Vue.nextTick()
理解：

在下次 DOM 更新循环结束之后执行延迟回调。简单的理解是：当数据更新了，在dom中渲染后，自动执行该函数

使用场景：

1. 在created钩子函数中使用，因为此时DOM并未渲染
2. 更改数据后当你想立即使用js操作新的视图的时候需要使用它

原理：

Vue是异步执行dom更新的，一旦观察到数据变化，Vue就会开启一个队列，然后把在同一个事件循环 (event loop) 当中观察到数据变化的 watcher 推送进这个队列。如果这个watcher被触发多次，只会被推送到队列一次。这种缓冲行为可以有效的去掉重复数据造成的不必要的计算和DOm操作。而在下一个事件循环时，Vue会清空队列，并进行必要的DOM更新

## 请介绍一下Vue的侦听器

侦听器是用来检测数据变化从而添加自己自定义逻辑的代码

## 什么是Vue CLI？

vue-cli是vue.js的脚手架，用于自动生成vue.js+webpack的项目模板

## 在Vue中，有几个生命周期钩子与<keep-alive>元素有关？

1.activated：当组件激活时，钩子触发的顺序是created->mounted->activated

2.deactivated: 组件停用时会触发deactivated，当再次前进或者后退的时候只触发activated

> 页面第一次进入，钩子的触发顺序created-> mounted-> activated，退出时触发deactivated。当再次进入（前进或者后退）时，只触发activated


## 在Vue渲染模板时，如何才能保留模板中的HTML注释？

`comments`当设为 true

```
<template comments="true">
    <!--这里是注释-->
<template>
```
## 在Vue中，当数据对象的属性和methods选项中的方法同名时，会怎么样？

会报错。名字不能重复

## Vue和React有哪些不同？
## 为什么要避免同时使用v-for和v-if两条指令？

v-for比v-if的优先级高，一般会采用computed计算属性

## 如何自定义Vue的指令？

声明自定义指令的两种方式：
1. 全局
```js
let Opt = {
    bind:function(el,binding,vnode){ },
    inserted:function(el,binding,vnode){ },
    update:function(el,binding,vnode){ },
    componentUpdated:function(el,binding,vnode){ },
    unbind:function(el,binding,vnode){ },
}
Vue.directive('指令名称', Opt)
```
2. 局部：钩子函数directives中进行声明
```
Directives: {
 Demo:  Opt
}
```

## Vue中元素的key特性有什么作用

主要是为了高效，准确的更新虚拟dom

## 请列举你所知的v-on指令的修饰符

- .stop：阻止事件冒泡
- .prevent：阻止默认事件
- .capture：把默认的冒泡变为捕获
- .self：只当事件是从侦听器绑定的元素本身触发时才触发回调（比如：冒泡时，如果不是点击该元素不会触发他的click事件）
- .{keyCode | keyAlias}：用特定按键触发事件
- .native：监听组件根元素的原生事件
- .once：只触发一次回调
- .left | .middle | .right：鼠标的左键 中键 右键触发的事件
```
<div v-on:mousedown.left="myfn">AAA</div>
<div v-on:mousedown.middle="myfn">BBB</div>
<div v-on:mousedown.right="myfn">CCC</div>
```
- passive

## Vue为v-model指令提供了哪些修饰符

- .lazy：懒加载修饰符
- .number:转为数字类型
- .trim:过滤首尾空格

## Vue的:class可接收哪几种类型的值

对象，数组

## Vue的:style可接收哪几种类型的值

对象，数组

## 什么是Vue的单文件组件

vuejs 自定义了一种.vue文件，可以把html, css, js 写到一个文件中，从而实现了对一个组件的封装， 一个.vue 文件就是一个单独的组件。

## Vue.extend()方法有什么作用

组件构造器,使用基础Vue构造器，创建一个“子类”，参数是一个包含组件选项的对相关

## 在Vue中，组件的命名方式有哪些

- 短横线分割命名：component-name
- 驼峰命名: componentName
- 帕斯卡命名: ComponentName

## 组件的props能校验哪些值类型

- String
- Number
- Boolean
- Function
- Object
- Array
- Symbol

## <keep-alive>元素有什么作用

keep-alive是vue内置的一个组件，缓存，有两个属性，include，包含，exclude不包含

## .native修饰符有什么作用

作用就是把一个vue组件转化为一个普通的HTML标签，并且该修饰符对普通HTML标签是没有任何作用的。

## .sync修饰符有什么作用

对prop进行“双向绑定”，使得子组件可以修改父组件的数据

## 在Vue中，如何能直接访问父组件、子组件和根实例？

访问父组件$parent,访问子组件$children,访问根实例$root

## Vue中的ref和$refs有什么作用？

ref 被用来给元素或子组件注册引用信息。引用信息将会注册在父组件的 $refs 对象上。如果在普通的 DOM 元素上使用，引用指向的就是 DOM 元素

## 请谈谈你对<slot>元素的理解

slot插槽，分为匿名插槽，具名插槽，作用域插槽：

- 匿名插槽：无name属性，在组件中只可以使用一次，父组件提供样式和内容
- 具名插槽：有name属性，在组件中可以用多次，父组件可以通过html模板上slot关联具名插槽
- 作用域插槽：父组件提供样式，子组件提供提供内容，在slot上绑定数据，子组件的值可以传给父组件使用，父组件展示子组件有三种，flex显示，列表显示，直接显示，使用slot-scope必须使用template。scope返回值是slot标签上放回所有属性值，并且是一个对象形式保存起来的，slot有两个属性，一个row，一个index

## 如何理解Vue的函数式组件？
函数式组件特点：

- 没有管理任何状态
- 没有监听任何传递给它的状态
- 没有生命周期方法
- 它只是接收一些prop的函

我们将这样的组件标记为functional：

- 无状态 == 无响应式数据
- 无实例 == 无this上下文

函数式组件的优点：

- 渲染开销低，因为函数式组件只是函数

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

## Vue为什么要求在组件的模板中只能有一个根元素？
