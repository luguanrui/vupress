# vue-lazyload源码阅读

## 如何调试vue-lazy的源码

1. 首先到github上将[vue-lazyload](https://github.com/hilongjw/vue-lazyload)源码clone下来
2. 创建一个vue项目,这里我使用[vue-cli](https://cli.vuejs.org/)脚手架创建

```bash
vue create lazy

cd lazy

yarn serve
```

3. 将vue-lazyload源码中的src目录copy到自己的项目中，并src目录改名为`vue-lazyload`(可以自己随便定义)
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

## 前置知识

1. 首先我们需要了解[rollupjs](https://www.rollupjs.com/)打包工具的相关知识
2. 由于vue-lazyload是使用插件的形式让我们使用的，不了解vue插件相关知识的同学，可以先看下官网[vue插件](https://cn.vuejs.org/v2/guide/plugins.html)的内容

使用插件：
```js
Vue.use(MyPlugin, { someOption: true })
```

开发插件：

```js
MyPlugin.install = function (Vue, options) {
  // 1. 添加全局方法或 property
  Vue.myGlobalMethod = function () {
    // 逻辑...
  }

  // 2. 添加全局资源
  Vue.directive('my-directive', {
    bind (el, binding, vnode, oldVnode) {
      // 逻辑...
    }
    ...
  })

  // 3. 注入组件选项
  Vue.mixin({
    created: function () {
      // 逻辑...
    }
    ...
  })

  // 4. 添加实例方法
  Vue.prototype.$myMethod = function (methodOptions) {
    // 逻辑...
  }
}
```

3. [vue自定指令](https://cn.vuejs.org/v2/guide/custom-directive.html)

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

钩子函数：

- bind：只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。
- inserted：被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)。
- update：所在组件的 VNode 更新时调用，但是可能发生在其子 VNode 更新之前。指令的值可能发生了改变，也可能没有。但是你可以通过比较更新前后的值来忽略不必要的模板更新 (详细的钩子函数参数见下)。
- componentUpdated：指令所在组件的 VNode 及其子 VNode 全部更新后调用。
- unbind：只调用一次，指令与元素解绑时调用。

钩子函数的参数：

- el：指令所绑定的元素，可以用来直接操作 DOM。
- binding：一个对象，包含以下 property：
    - name：指令名，不包括 v- 前缀。
    - value：指令的绑定值，例如：v-my-directive="1 + 1" 中，绑定值为 2。
    - oldValue：指令绑定的前一个值，仅在 update 和 componentUpdated 钩子中可用。无论值是否改变都可用。
    - expression：字符串形式的指令表达式。例如 v-my-directive="1 + 1" 中，表达式为 "1 + 1"。
    - arg：传给指令的参数，可选。例如 v-my-directive:foo 中，参数为 "foo"。
    - modifiers：一个包含修饰符的对象。例如：v-my-directive.foo.bar 中，修饰符对象为 { foo: true, bar: true }。
- vnode：Vue 编译生成的虚拟节点。移步 VNode API 来了解更多详情。
- oldVnode：上一个虚拟节点，仅在 update 和 componentUpdated 钩子中可用。
  
## 入口文件