# vue-lazyload源码阅读

## 为什么要阅读vue-lazyload

我们都知道，当一个页面中需要加载的图片太多，如果一次性加载完，会浪费网络资源，而且页面加载也会很慢，用户体验非常的不好。因此，我们需要图片懒加载这种技术手段来帮助我们处理这个问题，那么这个时候呢，不明白图片懒加载原理的同学，可能就要开始网上冲浪...

那么今天，我就找来了一款，github上star还挺多的一款插件，带同学来分析分析他的具体实现，可能从此你会爱上写插件

## 预备知识

1. 打包工具[rollupjs](https://www.rollupjs.com/)
2. [vue插件系统](https://cn.vuejs.org/v2/guide/plugins.html)

使用插件：
```js
Vue.use(MyPlugin, { someOption: true })
```

开发插件：

```js
MyPlugin.install = function (Vue, options) {
  // 1. 添加全局方法或 property
  Vue.myGlobalMethod = function () { /* 逻辑... */ }
  // 2. 添加全局指令
  Vue.directive('my-directive', {
    // 指令第一次绑定到元素时调用，做初始化设置
    bind (el, binding, vnode, oldVnode) { /* 逻辑... */ }, 
    // 被绑定元素插入父节点时调用
    inserted (el, binding, vnode, oldVnode) { /* 逻辑... */ },
    // 所在组件的 虚拟DOM 更新时调用
    update (el, binding, vnode, oldVnode) { /* 逻辑... */ },
    // 指令所在组件的 虚拟DOM 及其子 虚拟DOM 全部更新后调用
    componentUpdated (el, binding, vnode, oldVnode) { /* 逻辑... */ },
    // 指令与元素解绑时调用
    unbind (el, binding, vnode, oldVnode) { /* 逻辑... */ }
  })
  // 3. 注入组件选项
  Vue.mixin({
    created: function () { /* 逻辑... */ }
    ...
  })
  // 4. 添加实例方法
  Vue.prototype.$myMethod = function (methodOptions) { /* 逻辑... */ }
  // 5. 添加全局组件
  Vue.component('', function() {})
}
```
指令钩子函数的四个参数如下：

- el：指令所绑定的DOM元素
- binding：一个对象，包含以下属性：
    - name：指令名，不包括 `v-` 前缀。
    - value：指令的绑定值，例如`v-my-directive="1 + 1"` 中，绑定值为 `2`。
    - oldValue：指令绑定的前一个值，仅在 `update` 和 `componentUpdated` 钩子中可用
    - expression：字符串形式的指令表达式。例如 `v-my-directive="1 + 1"` 中，表达式为 `"1 + 1"`。
    - arg：传给指令的参数，可选。例如 `v-my-directive:foo` 中，参数为 `"foo`"。
    - modifiers：一个包含修饰符的对象。例如 `v-my-directive.foo.bar` 中，修饰符对象为 `{ foo: true, bar: true }`
- vnode：Vue 编译生成的虚拟节点
- oldVnode：上一个虚拟节点，仅在 update 和 componentUpdated 钩子中可用

3. [vue自定义指令](https://cn.vuejs.org/v2/guide/custom-directive.html)

注册全局指令`v-focus`：
```js
Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    // 聚焦元素
    el.focus()
  }
})
```

注册局部指令`v-focus`：
```js
directives: {
  focus: {
    // 指令的定义
    inserted: function (el) {
      el.focus()
    }
  }
}
```

指令的使用：

```vue
<input v-focus>
```

了解完了指令的注册使用，接下来重点就是怎么自己写指令了，vue官方给指令提供了`钩子函数`，方便开发者来自定义指令。

4. 全局组件注册

```js
Vue.component('my-component-name', {
  // ... 选项 ...
})
```

```js
import ComponentA from '@/components/ComponentA'
Vue.component('my-component-name', ComponentA)
```
  
5. 图片懒加载的原理
   
一句话概括：当图片出现在视口中时，再去加载图片

如何判断图片是否出现在视口中：

- 事件监听
- [IntersectionObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/IntersectionObserver)

## 如何调试vue-lazyload的源码

1. 首先到`github`上将[vue-lazyload](https://github.com/hilongjw/vue-lazyload)源码clone下来
2. 创建一个vue项目,这里我使用[vue-cli](https://cli.vuejs.org/)脚手架创建

```bash
vue create lazy

cd lazy

yarn serve
```

3. 将`vue-lazyload`源码中的`src`目录copy到自己的项目中，并`src`目录改名为`vue-lazyload`(可以自己随便定义)
4. 在`main.js`文件中引入该项目

```js
import Vue from 'vue'
import App from './App.vue'
import Lazyload from './vue-lazyload'

Vue.config.productionTip = false

Vue.use(Lazyload, { 
  preLoad: 1.3, 
  attempt: 2 ,
})

new Vue({
  render: (h) => h(App),
}).$mount('#app')

```
::: warning
由于`vue-lazyload`项目中引入插件`assign-deep`,所以我们需要手动去安装这个插件, 执行命令`yarn install assign-deep`即可
:::

5. 以上步骤完成之后，我们就可以在自己的项目随便的调试源码了，是不是so easy

## 概要

项目目录如下：

```bash
├── src
│   ├── index.js
│   ├── lazy-component.js
│   ├── lazy-container.js
│   ├── lazy-image.js
│   ├── lazy.js
│   ├── listener.js
│   └── util.js
```

看了这个项目目录你是不是很觉得，**自定义指令这么简单的嘛,不管你是不是这样想，反正我看了是信心倍增，距离赢取白富美又近了一步...,下面就正式开始对这七个文件进行逐一分析

## index

首先，我们当然是从入口文件`index.js`开始下手, 其中包含了一些`vue1.0`版本相关的兼容性代码，`vue3.0`即将在8月份来临，还有人在用`vue1.0`？因此，我们注释掉`vue1.0`相关的兼容性代码，代码也会显得更加的简单明了。

源码及逐行解析如下：
```js
import Lazy from './lazy'
import LazyComponent from './lazy-component'
import LazyContainer from './lazy-container'
import LazyImage from './lazy-image'

export default {
  // 插件提供install方法用于注册使用，传入两个参数`Vue`, `options`(自定义参数)
  install (Vue, options = {}) {
    // 执行`Lazy`函数，传入了唯一的参数`Vue`，并返回了`LazyClass`类
    const LazyClass = Lazy(Vue)
    // 实例化`LazyClass`类，传入自定义参数`options`, 得到实例`lazy`,图片懒加载的重要逻辑都在这个类中实现
    const lazy = new LazyClass(options)
    
    // 实例化`LazyContainer`得到实例`lazyContainer`,传入实例`{ lazy }`
    const lazyContainer = new LazyContainer({ lazy })

    // 将实例`lazy`挂载到`Vue`的原型属性`$Lazyload`上
    Vue.prototype.$Lazyload = lazy

    // 注册全局组件
    if (options.lazyComponent) {
      // 注册全局组件`lazy-component`
      // 执行 LazyComponent() 传入 `lazy`实例，返回一个对象
      Vue.component('lazy-component', LazyComponent(lazy))
    }
    if (options.lazyImage) {
      // 注册全局组件`lazy-image`
      // 执行 LazyImage() 传入 `lazy`实例，返回一个对象
      Vue.component('lazy-image', LazyImage(lazy))
    }

    // 注册全局
    // 注册全局指令`lazy`
    Vue.directive('lazy', {
      // 指令第一次绑定到元素时，执行 lazy.add
      bind: lazy.add.bind(lazy),
      // 所在组件的 虚拟dom更新时，执行初始化，执行 lazy.update
      update: lazy.update.bind(lazy),
      // 指令所在的虚拟dom及其子虚拟dom全部更新后，执行 lazy.lazyLoadHandler
      componentUpdated: lazy.lazyLoadHandler.bind(lazy), 
      // 指令与元素解绑时, 执行 lazy.remove
      unbind: lazy.remove.bind(lazy) 
    })

    // 注册全局指令`lazy-container`
    Vue.directive('lazy-container', {
      // 指令第一次绑定到元素时，执行 lazyContainer.bind
      bind: lazyContainer.bind.bind(lazyContainer),
      // 指令所在的虚拟dom及其子虚拟dom全部更新后，执行 lazyContainer.update
      componentUpdated: lazyContainer.update.bind(lazyContainer),
      // 指令与元素解绑时, 执行 lazyContainer.unbind
      unbind: lazyContainer.unbind.bind(lazyContainer)
    })
  }
}
```

由上面的分析，可以看出来，入口文件做了如下几件事：

- 提供了注册插件的方法
- 注册 `lazy-component`, `lazy-image` 全局组件
- 注册 `v-lazy`, `v-lazy-container` 全局指令

使用如下的方式来使用自定义指令：

注册插件：
```js
import VueLazyload from 'vue-lazyload'

Vue.use(Lazyload, { /* 自定义参数 */ })
```

使用指令：
```vue
<img v-lazy="img.src" />
```

当我们使用`v-lazy`指令的时候，首先会触发定义的钩子函数`bind`，也就是`lazy.add`方法，而这个方法是定义在`Lazy`类当中的，因此接下来，我们来分析下`Lazy`类的实现

## lazy

## listener

## util

## lazy-component

## lazy-container

## lazy-image