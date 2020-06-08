# vue

## 什么是MVVM

MVVM是`Model-View-ViewModel`缩写，也就是把MVC中的Controller演变成ViewModel

- `Model`【模型】层代表数据模型
- `View`【视图】代表UI组件
- `ViewModel`【视图模型】是View和Model层的桥梁

数据会绑定到`ViewModel`层并自动将数据渲染到页面中，视图变化的时候会通知`ViewModel`层更新数据。

MVVM模式有两个方向：

- 将`Model`转化为`View`，实现方式：`数据绑定`（即将后端传递的数据转化成所看到的页面）
- 将`View`转化为`Model`，实现方式：`DOM 事件监听`（即将所看到的页面转化成后端的数据）
- 这两个方向都实现的，我们称之为数据的双向绑定

总结：在MVVM的框架下，`View`和`Model`是不能直接通信的。它们通过`ViewModel`来通信，`ViewModel`通常要实现一个`observer`观察者，当数据发生变化，`ViewModel`能够监听到数据的这种变化，然后通知到对应的视图做自动更新，而当用户操作视图，`ViewModel`也能监听到视图的变化，然后通知数据做改动，这实际上就实现了数据的双向绑定。

## Vue2.x数据绑定与响应式数据原理

<img src="../public/vue-obj.png"/>

Vue在初始化数据时，会使用`Object.defineProperty`重新定义data中的所有属性，当页面使用对应属性时，首先会进行`依赖收集`(收集当前组件的watcher)，如果属性发生变化会通知相关依赖进行更新操作(`发布订阅`)

采用`数据劫持`结合`发布者-订阅者模式`的方式，通过`Object.defineProperty()`来劫持各个属性的`setter`，`getter`，在数据变动时发布消息给订阅者，触发相应的监听回调

具体步骤：

第一步：需要observe的数据对象进行递归遍历，包括子属性对象的属性，都加上 setter和getter
这样的话，给这个对象的某个值赋值，就会触发setter，那么就能监听到了数据变化

第二步：compile解析模板指令，将模板中的变量替换成数据，然后初始化渲染页面视图，并将每个指令对应的节点绑定更新函数，添加监听数据的订阅者，一旦数据有变动，收到通知，更新视图

第三步：Watcher订阅者是Observer和Compile之间通信的桥梁，主要做的事情是:
1、在自身实例化时往属性订阅器(dep)里面添加自己
2、自身必须有一个update()方法
3、待属性变动dep.notice()通知时，能调用自身的update()方法，并触发Compile中绑定的回调，则功成身退。

第四步：MVVM作为数据绑定的入口，整合Observer、Compile和Watcher三者，通过Observer来监听自己的model数据变化，通过Compile来解析编译模板指令，最终利用Watcher搭起Observer和Compile之间的通信桥梁，达到数据变化 -> 视图更新；视图交互变化(input) -> 数据model变更的双向绑定效果。

## Vue3.x响应式数据原理

Vue3.x改用`Proxy`替代`Object.defineProperty`。因为`Proxy`可以直接监听对象和数组的变化，并且有多达13种拦截方法。并且作为新标准将受到浏览器厂商重点持续的性能优化

### Object.defineProperty()

缺点：

- 无法检测到对象属性的新增或删除，解决方案：Vue.set(obj, propertName/index, value)
- 不能监听数组的变化，因此vue重写了数组操作的方法，比如push，pop，shift，unshift，splice，sort，reverse

Proxy是ES6提供的一个新的API，用于修改某些操作的默认行为

- Proxy直接代理整个对象而非对象属性
- Proxy也可以监听数组的变化

## Proxy只会代理对象的第一层，那么Vue3又是怎样处理这个问题的

判断当前`Reflect.get`的返回值是否为`Object`，如果是则再通过`reactive`方法做代理， 这样就实现了`深度观测`

## 监测数组的时候如何防止触发多次get/set

我们可以判断`key`是否为当前被代理对象`target`自身属性，也可以判断`旧值与新值`是否相等，只有满足以上两个条件之一时，才有可能执行`trigger`

## vue2.x中如何监测数组变化

<img src="../public/vue-array.png"/>

使用了函数劫持的方式，`重写了数组的方法`，Vue将data中的数组进行了原型链重写，指向了自己定义的数组原型方法，包含如下方法：

- push
- pop
- shift
- unshift
- splice
- sort
- reverse

这样当调用数组api时，可以通知依赖更新。如果数组中包含着引用类型，会对数组中的引用类型再次递归遍历进行监控。这样就实现了监测数组变化

## vue为什么采用异步渲染

因为不采用异步渲染，那么每次更新数据都会对当前组件进行重新渲染，所以为了性能考虑，vue会在本轮数据更新后，再去更新试图

## 生命周期

生命周期图：

<img class="img" src="../public/vue-lifecycle.png" width="400">

8个阶段：Vue 实例的创建到组件销毁的一个的过程

- 创建前/后：beforeCreate/created
- 挂载前/后：beforeMount/mounted
- 更新前/后：beforeUpdate/updated
- 销毁前/后：beforeDestory/destoryed

描述：

<img class="img" src="../public/vue-lifecycle2.jpeg" width="600" />

组件加载渲染过程：**beforeCreate-->created-->beforeMount-->mounted**

## 父子组件的渲染过程

父子组件加载渲染过程：（子组件先走mounted,父组件在mounted）:

**父级beforeCreate-->父级created-->父级beforeMount**-->子级beforeCreate->子级created-->子级beforeMount-->子级mounted-->**父级mounted**

## 父子组件的更新过程

父子组件更新过程：（子级先updated,父级再updated）:

**父级beforeUpdate**-->子级beforeUpdate-->子级updated-->**父级updated**

## 父子组件的销毁过程

销毁过程：（子级先destoryed,父级再destoryed）：

**父级beforeDestory**-->子级beforeDestory-->子级destoryed-->**父级destoryed**

## keep-alive的作用

- keep-alive可以实现`组件缓存`，当组件切换时不会对当前组件进行卸载。
- 常用的两个属性`include`/`exclude`，允许组件有条件的进行缓存。
- 两个生命周期`activated`/`deactivated`，用来得知当前组件是否处于活跃状态。
- keep-alive的中还运用了LRU(Least Recently Used)算法。

## keep-alive的生命周期钩子

1.activated：当组件激活时，钩子触发的顺序是`created->mounted->activated`

2.deactivated: 组件停用时会触发deactivated，当再次前进或者后退的时候只触发activated

页面第一次进入，钩子的触发顺序`created-> mounted-> activated`，退出时触发deactivated。当再次进入（前进或者后退）时，只触发`activated`

## v-if和v-show的区别

当条件不成立时，v-if不会渲染DOM元素，v-show操作的是样式(display)，切换当前DOM的显示和隐藏。

## computed与watch的区别

1. computed本质是一个`具备缓存的watcher`，依赖的属性发生变化就会更新视图，并且计算属性默认只有`getter`，不过在需要时你也可以提供一个 `setter`

适用于场景：
- 计算比较消耗性能的计算场景
- 当表达式过于复杂时，在模板中放入过多逻辑会让模板难以维护，可以将复杂的逻辑放入计算属性中处理。

2. watch没有缓存性，更多的是观察的作用，可以监听某些数据执行回调。当我们需要深度监听对象中的属性时，可以打开`deep：true`选项，这样便会对对象中的每一项进行监听。这样会带来性能问题，优化的话可以使用字符串形式监听，如果没有写到组件中，不要忘记使用unWatch手动注销

## 组件通信

1. 父子组件通信
    
- 父->子`props`，子->父 `$on、$emit`
- 获取父子组件实例 `$parent`、`$children`
- `ref` 获取实例的方式调用组件的属性或者方法
- `provide`、`inject` 官方不推荐使用，但是写组件库时很常用

2. 兄弟组件通信

- `Event Bus` 实现跨组件通信 `Vue.prototype.$bus = new Vue`
- `vuex`

3. 跨级组件通信

- `vuex`
- `$attrs`、`$listeners`
- `provide`、`inject`

## vue-loader是什么？使用它的用途有哪些

解析`.vue`文件的一个加载器，将template/js/style转换成js模块。

用途：js可以写es6、style样式可以scss或less、template可以加jade等

## Vue.nextTick()

在`下次 DOM 更新循环结束之后`执行`延迟回调`（简单的理解是：当数据更新了，在DOM中渲染后，自动执行该函数）。nextTick主要使用了`宏任务`和`微任务`。根据执行环境分别尝试采用：

- Promise
- MutationObserver
- setImmediate
- 如果以上都不行则采用setTimeout

定义了一个异步方法，多次调用nextTick会将方法存入队列中，通过这个异步方法清空当前队列

使用场景：

1. 在`created钩子函数`中使用，因为此时DOM并未渲染
2. 更改数据后当你想`立即使用js操作新的视图`的时候需要使用它

原理：

Vue是异步执行DOM更新的，一旦观察到数据变化，Vue就会开启一个队列，然后把在同一个事件循环 (event loop) 当中观察到数据变化的 watcher 推送进这个队列。如果这个watcher被触发多次，只会被推送到队列一次。这种缓冲行为可以有效的去掉重复数据造成的不必要的计算和DOM操作。而在下一个事件循环时，Vue会清空队列，并进行必要的DOM更新

## 在Vue渲染模板时，如何才能保留模板中的HTML注释

`comments`当设为 `true`

```vue
<template comments="true">
    <!--这里是注释-->
<template>
```

## 在Vue中，当数据对象的属性和methods选项中的方法同名时，会怎么样

会报错。名字不能重复

## 为什么要避免同时使用v-for和v-if两条指令

v-for比v-if的优先级高，一般会采用computed计算属性

## 如何自定义Vue的指令

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

```js
Directives: {
 Demo:  Opt
}
```

## Vue中元素的key特性有什么作用

主要是为了高效，准确的更新虚拟DOM

- diff算法，就地复用

1. key能够决定节点是否应该被`删除`、`添加`、`修改`，当节点被`删除`、`添加`时，会发生以下事件:
   - 完整地触发组件的生命周期钩子
   - 触发过渡
2. 对比两个子节点数组时，建立 key-index映射代替遍历查找 sameNode,提高性能

## 请列举你所知的v-on指令的修饰符

- .stop：阻止事件冒泡
- .prevent：阻止默认事件
- .capture：把默认的冒泡变为捕获
- .self：只当事件是从侦听器绑定的元素本身触发时才触发回调（比如：冒泡时，如果不是点击该元素不会触发他的click事件）
- .{keyCode | keyAlias}：用特定按键触发事件
- .native：监听组件根元素的原生事件
- .once：只触发一次回调
- .left | .middle | .right：鼠标的左键 中键 右键触发的事件
```html
<div v-on:mousedown.left="myfn">AAA</div>
<div v-on:mousedown.middle="myfn">BBB</div>
<div v-on:mousedown.right="myfn">CCC</div>
```
- .passive

## v-model指令提供了哪些修饰符

- .lazy：懒加载修饰符
- .number：转为数字类型
- .trim：过滤首尾空格

## .native修饰符有什么作用

作用就是把一个vue组件转化为一个普通的HTML标签，并且该修饰符对普通HTML标签是没有任何作用的。

## .sync修饰符有什么作用

对prop进行“双向绑定”，使得子组件可以修改父组件的数据

## class可接收哪几种类型的值

对象:

```html
<div class="static" :class="{ active: isActive, 'text-danger': hasError }"></div>
```

数组:

```html
<div :class="[isActive ? activeClass : '', errorClass]"></div>
<!-- 或者数组中写对象 -->
<div :class="[{ active: isActive }, errorClass]"></div>
```

## style可接收哪几种类型的值

对象：

```html
<div :style="styleObject"></div>
```

```js
data: {
  styleObject: {
    color: 'red',
    fontSize: '13px'
  }
}
```

数组:

```html
<div v-bind:style="[baseStyles, overridingStyles]"></div>
```

```js
data: {
  baseStyles: {
    color: 'red',
    fontSize: '13px'
  },
  overridingStyles: {
    color: 'red',
    fontSize: '13px'
  }
}
```

## 什么是Vue的单文件组件

vuejs 自定义了一种.vue文件，可以把html, css, js 写到一个文件中，从而实现了对一个组件的封装， 一个.vue 文件就是一个单独的组件。

## Vue.extend()方法有什么作用

extend是vue提供的一个全局方法，使用基础 Vue 构造器，创建一个“子类”。参数是一个包含组件选项的对象。

## 在Vue中，组件的命名方式有哪些

- 短横线分割命名：component-name
- 驼峰命名: componentName
- 帕斯卡命名: ComponentName

## 组件的props能校验哪些值类型

- String
- Number
- Boolean
- Array
- Object
- Date
- Function
- Symbol

## 在Vue中，如何能直接访问父组件、子组件和根实例

访问父组件`$parent`,访问子组件`$children`,访问根实例`$root`

## Vue中的`ref`和`$refs`有什么作用

ref 被用来给元素或子组件注册引用信息。引用信息将会注册在父组件的 $refs 对象上。如果在普通的 DOM 元素上使用，引用指向的就是 DOM 元素

## 请谈谈你对slot元素的理解

slot插槽，分为匿名插槽，具名插槽，作用域插槽：

- 匿名插槽：无name属性，在组件中只可以使用一次，父组件提供样式和内容
- 具名插槽：有name属性，在组件中可以用多次，父组件可以通过html模板上slot关联具名插槽
- 作用域插槽：父组件提供样式，子组件提供提供内容，在slot上绑定数据，子组件的值可以传给父组件使用，父组件展示子组件有三种，flex显示，列表显示，直接显示，使用slot-scope必须使用template。scope返回值是slot标签上放回所有属性值，并且是一个对象形式保存起来的，slot有两个属性，一个row，一个index

## 如何理解Vue的函数式组件

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

## 组件中的data为什么是一个函数

一个组件被复用多次的话，也就会创建多个实例。本质上，这些实例用的都是同一个构造函数。如果data是对象的话，对象属于引用类型，会影响到所有的实例。所以为了保证组件不同的实例之间data不冲突，data必须是一个函数

## 说一下v-model的原理

v-model本质就是一个语法糖，可以看成是value + input方法的语法糖。 可以通过model属性的prop和event属性来进行自定义。原生的v-model，会根据标签的不同生成不同的事件和属性。

v-model会把它关联的响应式数据，动态地绑定到表单元素的value属性上，然后监听表单元素的input事件：当v-model绑定的响应数据发生变化时，表单元素的value值也会同步变化；当表单元素接受用户的输入时，input事件会触发，input的回调逻辑会把表单元素value最新值同步赋值给v-model绑定的响应式数据。

[参考](https://segmentfault.com/a/1190000021039085?utm_source=tag-newest#item-4-1)

## Vue事件绑定原理

原生事件绑定是通过`addEventListener`绑定给真实元素的，组件事件绑定是通过Vue自定义的`$on`实现的。

## Vue模版编译原理

简单说，Vue的编译过程就是将`template`转化为`render函数`的过程。会经历以下阶段：

- 生成AST树
- 优化
- codegen
首先解析模版，生成`AST语法树`(一种用JavaScript对象的形式来描述整个模板)。
使用大量的正则表达式对模板进行解析，遇到标签、文本的时候都会执行对应的钩子进行相关处理。

Vue的数据是响应式的，但其实模板中并不是所有的数据都是响应式的。有一些数据首次渲染后就不会再变化，对应的DOM也不会变化。那么优化过程就是深度遍历AST树，按照相关条件对树节点进行标记。这些被标记的节点(静态节点)我们就可以跳过对它们的比对，对运行时的模板起到很大的优化作用。

编译的最后一步是将优化后的AST树转换为可执行的代码

## Vue2.x和Vue3.x渲染器的diff算法分别说一下

简单来说，diff算法有以下过程:

- 同级比较，再比较子节点
- 先判断一方有子节点一方没有子节点的情况(如果新的children没有子节点，将旧的子节点移除)
- 比较都有子节点的情况(核心diff)
- 递归比较子节点

正常Diff两个树的时间复杂度是O(n^3)，但实际情况下我们很少会进行跨层级的移动DOM，所以Vue将Diff进行了优化，从O(n^3) -> O(n)，只有当新旧children都为多个子节点时才需要用核心的Diff算法进行同层级比较。

Vue2.x的核心Diff算法采用了双端比较的算法，同时从新旧children的两端开始进行比较，借助key值找到可复用的节点，再进行相关操作。相比React的Diff算法，同样情况下可以减少移动节点次数，减少不必要的性能损耗，更加的优雅

Vue3.x借鉴了`ivi算法`和 `inferno算法`：在创建VNode时就确定其类型，以及在mount/patch的过程中采用位运算来判断一个VNode的类型，在这个基础之上再配合核心的Diff算法，使得性能上较Vue2.x有了提升；该算法中还运用了动态规划的思想求解最长递归子序列

## 什么是虚拟DOM

用JavaScript的树形结构对象来描述真实dom结构

## 什么是DOM diff

比对(diff)渲染更新前后产生的两个虚拟dom对象的差异，并产出差异补丁对象，再将差异补丁对象应用到真实dom节点上

## 再说一下虚拟Dom以及key属性的作用

虚拟Dom的产生原因：由于在浏览器中操作DOM是很昂贵的。频繁的操作DOM，会产生一定的性能问题

- Vue2的Virtual DOM借鉴了开源库`snabbdom`的实现
- Virtual DOM本质就是用一个原生的JS对象去描述一个DOM节点。是对真实DOM的一层抽象。(也就是源码中的VNode类，它定义在src/core/vdom/vnode.js中。)
- VirtualDOM映射到真实DOM要经历VNode的create、diff、patch等阶段。

「key的作用是尽可能的复用 DOM 元素。」

新旧 children 中的节点只有顺序是不同的时候，最佳的操作应该是通过移动元素的位置来达到更新的目的。

需要在新旧 children 的节点中保存映射关系，以便能够在旧 children 的节点中找到可复用的节点。key也就是children中节点的唯一标识。

## SSR(Serve Side Render)

SSR也就是服务端渲染，也就是将Vue在客户端把标签渲染成HTML的工作放在服务端完成，然后再把html直接返回给客户端。

优点：

- SPA 框架 SEO 的解决方案（nuxt）
- 首屏加载速度更快等优点

缺点：

- 开发条件会受到限制，服务器端渲染只支持beforeCreate和created两个钩子
- 当我们需要一些外部扩展库时需要特殊处理
- 服务端渲染应用程序也需要处于Node.js的运行环境
- 服务器会有更大的负载需求

## Vue的性能优化

1. 编码阶段

- 尽量减少data中的数据，data中的数据都会增加getter和setter，会收集对应的watcher
- v-if和v-for不能连用
- 如果需要使用v-for给每项元素绑定事件时使用事件代理
- SPA 页面采用`keep-alive`缓存组件在
- 更多的情况下，使用`v-if`替代`v-show`
- `key`保证唯一
- 使用`路由懒加载`、异步组件
- 防抖、节流
- 第三方模块按需导入
- 长列表滚动到可视区域动态加载
- 图片懒加载

2. SEO优化

- 预渲染
- 服务端渲染SSR

3. 打包优化

- 压缩代码
- Tree Shaking/Scope Hoisting
- 使用cdn加载第三方模块
- 多线程打包happypack
- splitChunks抽离公共文件
- sourceMap优化
  
4. 用户体验

- 骨架屏
- PWA
- 还可以使用缓存(客户端缓存、服务端缓存)优化、服务端开启gzip压缩等

[参考](https://juejin.im/post/5e04411f6fb9a0166049a073#heading-7)

## vue原理（手写代码，实现数据劫持）

```js
```

## 实现a===1 && a===2 && a===3返回true

```js
var  _a = 1;
Object.defineProperty(this,'a',{
    get:function(){
        return _a++
    }
})
console.log(a===1 && a===2 && a===3)
```

## 实现一个虚拟DOM

[实现](https://github.com/luguanrui/virtualDOM)

index.js
```js
import { createElement,render,renderDOM } from './element'
import diff from  './diff'
import patch from './patch'

// 创建虚拟DOM
let vdom = createElement('ul', { class: 'list' }, [
  createElement('li', { class: 'item' }, ['a']),
  createElement('li', { class: 'item' }, ['b']),
  createElement('li', { class: 'item' }, ['c'])
])
console.log('创建虚拟DOM：' ,vdom)

// 将虚拟DOM转化为真实DOM
let el = render(vdom)
console.log('真实DOM：',el)

// 将真实DOM挂载到页面上
renderDOM(el, document.getElementById('app'))

let vdom2 = createElement('ul', { class: 'list'}, [
    createElement('li', { class: 'item'}, ['1']),
    createElement('li', { class: 'item' }, ['b']),
    createElement('li', { class: 'item' }, ['c'])
])
// diff，比较两个虚拟DOM，生成补丁
let patches = diff(vdom, vdom2)
console.log('补丁包：', patches)

// 将补丁包挂载到真实DOM树上
patch(el, patches)
```

element.js
```js
// 定义Element类
class Element {
  constructor(tagName, props, children) {
    this.tagName = tagName
    this.props = props
    this.children = children
  }
}
// 1. 创建虚拟DOM
function createElement(tagName, props, children) {
  return new Element(tagName, props, children)
}
// 2. 将虚拟DOM转化为真实的DOM
function render(vdom) {
  // 创建父级的真是DOM元素
  let el = document.createElement(vdom.tagName)
  // 将虚拟DOM中的父级属性添加到真实DOM上
  for (let key in vdom.props) {
    setAttrs(el, key, vdom.props[key])
  }
  // 遍历子元素，递归调用render生成子级真是DOM，并挂载到父级DOM上
  vdom.children.forEach(child => {
    child = child instanceof Element ? render(child) : document.createTextNode(child)
    el.appendChild(child)
  })
  return el
}
// 设置属性
function setAttrs(node, key, value) {
  switch (key) {
    case 'value':
      if (node.tagName.toUpperCase() === 'INPUT' || node.tagName.toUpperCase() === 'TEXTAREA') {
        node.value = value
      } else {
        node.setAttribute(key, value)
      }
      break
    case 'style':
      node.style.cssText = value
      break
    default:
      node.setAttribute(key, value)
      break
  }
}
// 3. 将真实DOM挂载到页面上
function renderDOM(el, target) {
  target.appendChild(el)
}
export { createElement, render, renderDOM, setAttrs }
```

diff.js
```js
/**
 * diff算法
 * @param {*} oldVTree 老的虚拟DOM
 * @param {*} newVTree 新的虚拟DOM
 * @return {patches} 返回计算后的 补丁对象
 */
function diff(oldVTree, newVTree) {
  let patches = {} // 定义补丁
  let index = 0 // 记录是哪一层的改变
  walk(oldVTree, newVTree, index, patches) // 递归遍历新旧虚拟DOM树，将比较后的结果返回到patches
  return patches // 返回补丁
}

// diff算法的规则
const REMOVE = 'REMOVE'
const ATTRS = 'ATTRS'
const TEXT = 'TEXT'
const REPLACE = 'REPLACE'

/**
 *
 * @param {*} oldVNode
 * @param {*} newVNode
 * @param {*} index
 * @param {*} patches
 */
function walk(oldVNode, newVNode, index, patches) {
  let currentPatch = [] // 每个元素都有一个补丁对象

  if (!newVNode) {
    // 1. 如果新的节点不存在，认为节点被删除
    currentPatch.push({ type: REMOVE, index })
  } else if (isString(oldVNode) && isString(newVNode)) {
    // //如果说老节点的新的节点都是文本节点的话
    if (oldVNode !== newVNode) {
      // 2. 如果新的字符符值和旧的不一样，文本更改
      currentPatch.push({ type: TEXT, text: newVNode })
    }
  } else if (oldVNode.tagName === newVNode.tagName) {
    //比较新旧元素的属性对象
    // 3. 如果节点类型相同，比较属性，返回改变后的属性或者新增的属性（如果没有改变或者新增返回一个空对象）
    let attrs = diffAttr(oldVNode.props, newVNode.props)
    //如果新旧元素有差异 的属性的话
    if (Object.keys(attrs).length > 0) {
      currentPatch.push({ type: ATTRS, attrs })
    }
    // 比较子节点
    diffChildren(oldVNode.children, newVNode.children, index, patches)
  } else {
    // 4. 节点替换
    currentPatch.push({ type: REPLACE, newVNode })
  }

  // 如果有更新才返回补丁
  if (currentPatch.length > 0) {
    patches[index] = currentPatch
    // console.log(patches)
  }
}
// 比较属性
function diffAttr(oldAttrs, newAttrs) {
  let patch = {}
  // 属性改变
  for (let key in oldAttrs) {
    if (oldAttrs[key] !== newAttrs[key]) {
      // 获取改变后的新的属性
      patch[key] = newAttrs[key]
    }
  }
  // 新增属性
  for (let key in newAttrs) {
    // 老的属性没有新的属性
    if (!oldAttrs.hasOwnProperty(key)) {
      // 获取新增的属性
      patch[key] = newAttrs[key]
    }
  }
  return patch
}

// 比较子节点，其实就是遍历子节点，继续递归比较
let Index = 0 // 子节点的标识
function diffChildren(oldChildren, newChildren, index, patches) {
  oldChildren.forEach((child, idx) => {
    walk(child, newChildren[idx], ++Index, patches)
  })
}

function isString(node) {
  return Object.prototype.toString.call(node) === '[object String]'
}

export default diff
```

patch.js
```js
import { Element, render, setAttrs } from './element'

let allPatches // 所有补丁包
let index = 0
/**
 * 将补丁打到真实DOM节点上
 * @param {*} node 真实DOM节点
 * @param {*} patches 补丁对象
 */
function patch(node, patches) {
  allPatches = patches
  walk(node)
}
function walk(node) {
  let currentPatches = allPatches[index++]
  let childNodes = node.childNodes
  childNodes.forEach(child => {
    walk(child)
  })
  // 如果有补丁
  if (currentPatches) {
    doPatch(node, currentPatches)
  }
}

function doPatch(node, patches) {
  patches.forEach(patch => {
    switch (patch.type) {
      case 'ATTRS':
        for (let key in patch.attrs) {
          let value = patch.attrs[key]
          if (value) {
            setAttrs(node, key, value)
          } else {
            node.removeAttribute(key)
          }
        }
        break
      case 'TEXT':
        node.textContent = patch.text
        break
      case 'REPLACE':
        let newNode = patch.newNode instanceof Element ? render(patch.newNode) : document.createTextNode(patch.newNode)
        node.parentNode.replaceChild(newNode, node)
        break
      case 'REMOVE':
        node.parentNode.removeChild(node)
        break
    }
  })
}

export default patch
```