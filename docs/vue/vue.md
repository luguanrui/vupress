## 什么是MVVM

- Model【模型】指的是后端传递的数据
- View【视图】指的是所看到的页面
- ViewModel【视图模型】连接view和model的桥梁

MVVM模式有两个方向：
- 将`Model`【模型】转化为`View`【视图】。即将后端传递的数据转化成所看到的页面。实现的方式是：`数据绑定`
- 将`View`【视图】转化为`Model`【模型】。即将所看到的页面转化成后端的数据。实现的方式是：`DOM 事件监听`

这两个方向都实现的，我们称之为数据的双向绑定

总结：在MVVM的框架下，`View`【视图和`Model`【模型】是不能直接通信的。它们通过`ViewModel`【视图模型】来通信，ViewModel通常要实现一个observer观察者，当数据发生变化，ViewModel能够监听到数据的这种变化，然后通知到对应的视图做自动更新，而当用户操作视图，ViewModel也能监听到视图的变化，然后通知数据做改动，这实际上就实现了数据的双向绑定。并且MVVM中的View 和 ViewModel可以互相通信。MVVM流程图如下：

## 生命周期

生命周期图：
<img class="img" src="../public/vue-lifecycle.png" width="400">

8个阶段：
- 创建前/后：beforeCreate/created
- 载入前/后：beforeMount/mounted
- 更新前/后：beforeUpdate/updated
- 销毁前/后：beforeDestory/destoryed

生命周期 | 描述
---|---
beforeCreate | 组件实例被创建之初，组件的属性生效之前
created | 组件实例已经完全创建，属性也绑定，但真实dom还没有生成，$el还不可用
beforeMount | 在挂载开始之前被调用：相关的 render 函数首次被调用
mounted | el 被新创建的 vm.$el 替换，并挂载到实例上去之后调用该钩子
beforeUpdate | 组件数据更新之前调用，发生在虚拟 DOM 打补丁之前
updated | 组件数据更新之后
beforeDestory | 组件销毁前调用
destoryed | 组件销毁后调用
activited | keep-alive专属，组件被激活时调用
deadctivated | keep-alive专属，组件被销毁时调用

组件加载渲染过程：**beforeCreate-->created-->beforeMount-->mounted**

父子组件加载渲染过程：（子组件先走mounted,父组件在mounted）:

**父级beforeCreate-->父级created-->父级beforeMount-->子级beforeCreate->子级created-->子级beforeMount-->子级mounted-->父mounted**

父子组件更新过程：（子级先updated,父级再updated）:

**父级beforeUpdate-->子级beforeUpdate-->子级updated-->父级updated**

销毁过程：（子级先destoryed,父级再destoryed）：

**父级beforeDestory-->子级beforeDestory-->子级destoryed-->父级destoryed**

## 数据绑定原理

采用数据劫持结合发布者-订阅者模式的方式，通过Object.defineProperty()来劫持各个属性的setter，getter，在数据变动时发布消息给订阅者，触发相应的监听回调

具体步骤：

第一步：需要observe的数据对象进行递归遍历，包括子属性对象的属性，都加上 setter和getter
这样的话，给这个对象的某个值赋值，就会触发setter，那么就能监听到了数据变化

第二步：compile解析模板指令，将模板中的变量替换成数据，然后初始化渲染页面视图，并将每个指令对应的节点绑定更新函数，添加监听数据的订阅者，一旦数据有变动，收到通知，更新视图

第三步：Watcher订阅者是Observer和Compile之间通信的桥梁，主要做的事情是:
1、在自身实例化时往属性订阅器(dep)里面添加自己
2、自身必须有一个update()方法
3、待属性变动dep.notice()通知时，能调用自身的update()方法，并触发Compile中绑定的回调，则功成身退。

第四步：MVVM作为数据绑定的入口，整合Observer、Compile和Watcher三者，通过Observer来监听自己的model数据变化，通过Compile来解析编译模板指令，最终利用Watcher搭起Observer和Compile之间的通信桥梁，达到数据变化 -> 视图更新；视图交互变化(input) -> 数据model变更的双向绑定效果。

## keep-alive的作用

作用：keep-alive是Vue.js的一个内置组件。它能够把不活动的组件实例保存在内存中，而不是直接将其销毁，它是一个抽象组件，不会被渲染到真实DOM中，也不会出现在父组件链中。

它提供了include与exclude两个属性，允许组件有条件地进行缓存。

Vue.js内部将DOM节点抽象成了一个个的VNode节点，keep-alive组件的缓存也是基于VNode节点的而不是直接存储DOM结构。它将满足条件（include与exclude）的组件在cache对象中缓存起来，在需要重新渲染的时候再将vnode节点从cache对象中取出并渲染。

## v-if和v-show的区别

## computed与watch的区别

computed:

计算属性是基于它们的响应式依赖进行缓存的。只在相关响应式依赖发生改变时它们才会重新求值
计算属性默认只有 getter，不过在需要时你也可以提供一个 setter
watch:

当需要在数据变化时执行异步或开销较大的操作时,使用watch

## 虚拟dom与diff算法

## 组件通信

- 父子组件通信：props/$emit
- 兄弟组件通信：bus
- 跨级组件通信：provide / inject，bus，vuex，$attrs/$listeners，$parent / $children与 ref
  
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

## 在Vue中，有几个生命周期钩子与\<keep-alive>元素有关？

1.activated：当组件激活时，钩子触发的顺序是created->mounted->activated

2.deactivated: 组件停用时会触发deactivated，当再次前进或者后退的时候只触发activated

页面第一次进入，钩子的触发顺序created-> mounted-> activated，退出时触发deactivated。当再次进入（前进或者后退）时，只触发activated

## 在Vue渲染模板时，如何才能保留模板中的HTML注释？

comments当设为 true

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

## \<keep-alive>元素有什么作用

keep-alive是vue内置的一个组件，缓存，有两个属性，include，包含，exclude不包含

## .native修饰符有什么作用

作用就是把一个vue组件转化为一个普通的HTML标签，并且该修饰符对普通HTML标签是没有任何作用的。

## .sync修饰符有什么作用

对prop进行“双向绑定”，使得子组件可以修改父组件的数据

## 在Vue中，如何能直接访问父组件、子组件和根实例？

访问父组件$parent,访问子组件$children,访问根实例$root

## Vue中的ref和$refs有什么作用？

ref 被用来给元素或子组件注册引用信息。引用信息将会注册在父组件的 $refs 对象上。如果在普通的 DOM 元素上使用，引用指向的就是 DOM 元素

## 请谈谈你对\<slot>元素的理解

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

### Object.defineProperty()

Object.defineProperty()的缺点：
- 无法检测到对象属性的新增或删除，解决方案：Vue.set(obj, propertName/index, value)
- 不能监听数组的变化，因此vue重写了数组操作的方法，比如push，pop，shift，unshift，splice，sort，reverse

Proxy是ES6提供的一个新的API，用于修改某些操作的默认行为

- Proxy直接代理整个对象而非对象属性
- Proxy也可以监听数组的变化