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
2. 由于vue-lazyload是以插件的形式提供给使用者使用，不了解vue插件相关知识的同学，可以先看下官网[vue插件](https://cn.vuejs.org/v2/guide/plugins.html)的内容

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

  // 2. 添加全局指令
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
  // 5. 添加全局
  Vue.component('', function() {})
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
  
4. 图片懒加载的原理
   
  图片出现在视口中在加载图片

实现方式：

- 事件监听
- IntersectionObserver

## 分析

### 项目目录

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

### 入口文件

`index.js`是入口文件, 包含了一些vue1.0版本相关的兼容性代码，vue3.0即将在8月份来临，还有人在用vue1.0？因此，我们注释掉vue1.0相关的兼容性代码，直接看vue2.0相关的代码如下：

```js
import Lazy from './lazy'
import LazyComponent from './lazy-component'
import LazyContainer from './lazy-container'
import LazyImage from './lazy-image'

export default {
  install (Vue, options = {}) {
    const LazyClass = Lazy(Vue)
    const lazy = new LazyClass(options)
    const lazyContainer = new LazyContainer({ lazy })
    Vue.prototype.$Lazyload = lazy
    if (options.lazyComponent) {
      Vue.component('lazy-component', LazyComponent(lazy))
    }
    if (options.lazyImage) {
      Vue.component('lazy-image', LazyImage(lazy))
    }
    Vue.directive('lazy', {
      bind: lazy.add.bind(lazy),
      update: lazy.update.bind(lazy),
      componentUpdated: lazy.lazyLoadHandler.bind(lazy),
      unbind: lazy.remove.bind(lazy)
    })
    Vue.directive('lazy-container', {
      bind: lazyContainer.bind.bind(lazyContainer),
      componentUpdated: lazyContainer.update.bind(lazyContainer),
      unbind: lazyContainer.unbind.bind(lazyContainer)
    })
  }
}
```
入口文件做了以下工作：

- 提供vue注册插件的入口方法`install`
- 实例化lazy类
- 将lazy类绑定到vue的原型方法`$Lazyload`上
- 全局注册组件：`lazy-component`,`lazy-image`
- 全局注册指令：`v-lazy`, `v-lazy-container`

### lazy

```js
import {
  inBrowser,
  CustomEvent,
  remove,
  some,
  find,
  _,
  throttle,
  supportWebp,
  getDPR,
  scrollParent,
  getBestSelectionFromSrcset,
  // assign,
  isObject,
  hasIntersectionObserver,
  modeType,
  ImageCache,
} from './util'

import ReactiveListener from './listener'
const DEFAULT_URL = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
const DEFAULT_EVENTS = ['scroll', 'wheel', 'mousewheel', 'resize', 'animationend', 'transitionend', 'touchmove']
const DEFAULT_OBSERVER_OPTIONS = {
  rootMargin: '0px',
  threshold: 0,
}

export default function(Vue) {
  return class Lazy {
    constructor({
      preLoad, // 预载高度比例
      error, // error url
      throttleWait, // 节流时长
      preLoadTop, // 预加载高度
      dispatchEvent, // 是否触发dom事件
      loading, //loading url
      attempt, // 尝试加载次数
      silent = true, // 是否打印debug信息,默认是true
      scale, // devicePixelRatio
      listenEvents, // 监听的事件,数组
      // hasbind, // 无用字段 ？？？
      filter, // 图片监听事件过滤
      adapter, // 动态修改元素的属性
      observer, // 是否使用 IntersectionObserver api
      observerOptions, // IntersectionObserver 的参数
    }) {
      this.version = '__VUE_LAZYLOAD_VERSION__' // 版本号
      this.mode = modeType.event // 事件模式
      this.ListenerQueue = [] // modeType.observer 使用监听队列，存放listerner对象
      this.TargetIndex = 0 // 目标index
      this.TargetQueue = [] // modeType.event 使用目标队列

      // 参数
      this.options = {
        silent: silent, //  是否打印debug信息
        dispatchEvent: !!dispatchEvent, // 是否触发dom事件
        throttleWait: throttleWait || 200, // 节流默认200ms
        preLoad: preLoad || 1.3, // 预载高度比例1.3
        preLoadTop: preLoadTop || 0, // 默认是0
        error: error || DEFAULT_URL, // img error url
        loading: loading || DEFAULT_URL, // img loading url
        attempt: attempt || 3, // 默认尝试3次
        scale: scale || getDPR(scale), // devicePixelRatio
        ListenEvents: listenEvents || DEFAULT_EVENTS, // 监听的事件
        // hasbind: false, // 无用字段
        supportWebp: supportWebp(), // 是否支持webp
        filter: filter || {}, // 图片监听事件过滤
        adapter: adapter || {}, // 动态修改元素的属性

        observer: !!observer, //  是否使用 IntersectionObserver api
        observerOptions: observerOptions || DEFAULT_OBSERVER_OPTIONS, // IntersectionObserver 的参数
      }

      this._initEvent() // 初始化事件$on,$off,$once，$emit
      this._imageCache = new ImageCache({ max: 200 }) // 缓存图片，最多200张

      // 懒加载方法赋值，但是不执行
      this.lazyLoadHandler = throttle(this._lazyLoadHandler.bind(this), this.options.throttleWait)

      // 设置模式初始化
      // 1. modeType.event, 遍历ListenerQueue, 取消观察; 遍历TargetQueue，给自定义事件，添加监听
      // 2. modeType.observer,遍历TargetQueue，给自定义事件，移除监听；创建IntersectionObserver实例，遍历ListenerQueue，开始观察
      this.setMode(this.options.observer ? modeType.observer : modeType.event)
    }

    /**
     * 更新options，无用
     * update config
     * @param  {Object} config params
     * @return
     */
    // config(options = {}) {
    //   assign(this.options, options)
    // }

    /**
     * 性能测试
     * output listener's load performance
     * @return {Array}
     */
    performance() {
      let list = []

      this.ListenerQueue.map((item) => {
        list.push(item.performance())
      })

      return list
    }

    /*
     * add lazy component to queue
     * @param  {Vue} vm lazy component instance
     * @return
     */
    addLazyBox(vm) {
      this.ListenerQueue.push(vm)
      if (inBrowser) {
        this._addListenerTarget(window)
        this._observer && this._observer.observe(vm.el)
        if (vm.$el && vm.$el.parentNode) {
          this._addListenerTarget(vm.$el.parentNode)
        }
      }
    }

    /*
     * add image listener to queue
     * @param  {DOM} el
     * @param  {object} binding vue directive binding
     * @param  {vnode} vnode vue directive vnode
     * @return
     */
    add(el, binding, vnode) {
      console.log('add')
      // 如果已存在则更新
      if (some(this.ListenerQueue, (item) => item.el === el)) {
        this.update(el, binding)
        return Vue.nextTick(this.lazyLoadHandler)
      }
      /**
       * binding
       * {
          def: {bind: ƒ, update: ƒ, componentUpdated: ƒ, unbind: ƒ}
          expression: "img.src"
          modifiers: {aa: true}
          name: "lazy"
          rawName: "v-lazy.aa"
          value: "https://dss2.bdstatic.com/01.jpg"
       * }
       */
      // 根据binding.value，获取图片的真是src, loading, error
      // cors获取不到，因为_valueFormatter没有返回cors
      let { src, loading, error, cors } = this._valueFormatter(binding.value)

      // 下一次DOM更新循环的时候执行
      Vue.nextTick(() => {
        debugger
        //  如果el不是img标签 或者 该dom不包含属性data-srcset使用src
        src = getBestSelectionFromSrcset(el, this.options.scale) || src

        // 如果使用了交叉观察者模式，则开始观察
        this._observer && this._observer.observe(el)

        // 获取修饰符
        const container = Object.keys(binding.modifiers)[0]
        let $parent
        // 如果修饰符存在 ???
        if (container) {
          $parent = vnode.context.$refs[container]
          // if there is container passed in, try ref first, then fallback to getElementById to support the original usage
          $parent = $parent ? $parent.$el || $parent : document.getElementById(container)
        }

        if (!$parent) {
          // 返回window对象
          $parent = scrollParent(el)
        }

        const newListener = new ReactiveListener({
          bindType: binding.arg, // ？？？
          $parent, // 父级dom元素
          el, // 当前dom元素
          loading, // 图片loading地址
          error, // 图片error地址
          src, // 图片真实src地址
          cors, // 获取不到
          elRenderer: this._elRenderer.bind(this),
          options: this.options, // 参数
          imageCache: this._imageCache, // 图片缓存实例
        })

        // ListenerQueue 添加 Listener
        this.ListenerQueue.push(newListener)

        if (inBrowser) {
          // TargetQueue 添加 target，为DOM元素（el）遍历监听事件，添加事件监听，el分别设置为：window，$parent
          this._addListenerTarget(window)
          this._addListenerTarget($parent)
        }
        // 调用两次lazyLoadHandler方法？？？？
        this.lazyLoadHandler()
        // 下次dom更新循环时调用一次
        Vue.nextTick(() => this.lazyLoadHandler())
      })
    }

    /**
     * update image src
     * @param  {DOM} el
     * @param  {object} vue directive binding
     * @return
     */
    update(el, binding, vnode) {
      console.log('update')
      let { src, loading, error } = this._valueFormatter(binding.value)
      src = getBestSelectionFromSrcset(el, this.options.scale) || src

      const exist = find(this.ListenerQueue, (item) => item.el === el)
      if (!exist) {
        this.add(el, binding, vnode)
      } else {
        exist.update({
          src,
          loading,
          error,
        })
      }
      if (this._observer) {
        this._observer.unobserve(el)
        this._observer.observe(el)
      }
      this.lazyLoadHandler()
      Vue.nextTick(() => this.lazyLoadHandler())
    }

    /**
     * remove listener form list
     * @param  {DOM} el
     * @return
     */
    remove(el) {
      console.log('remove')
      if (!el) return
      this._observer && this._observer.unobserve(el)
      const existItem = find(this.ListenerQueue, (item) => item.el === el)
      if (existItem) {
        this._removeListenerTarget(existItem.$parent)
        this._removeListenerTarget(window)
        remove(this.ListenerQueue, existItem)
        existItem.$destroy()
      }
    }

    /*
     * remove lazy components form list
     * @param  {Vue} vm Vue instance
     * @return
     */
    removeComponent(vm) {
      if (!vm) return
      remove(this.ListenerQueue, vm)
      this._observer && this._observer.unobserve(vm.el)
      if (vm.$parent && vm.$el.parentNode) {
        this._removeListenerTarget(vm.$el.parentNode)
      }
      this._removeListenerTarget(window)
    }

    /**
     * 设置模式
     * @param {modeType} mode
     */
    setMode(mode) {
      // 如果不支持IntersectionObserver api
      // 即使modeType设置为observer模式，还是强制使用event模式
      if (!hasIntersectionObserver && mode === modeType.observer) {
        mode = modeType.event
      }

      // 设置模式
      this.mode = mode // event or observer

      // 1. 事件模式
      if (mode === modeType.event) {
        // 并且使用IntersectionObserver模式
        if (this._observer) {
          
          // 遍历ListenerQueue, 取消观察
          this.ListenerQueue.forEach((listener) => {
            this._observer.unobserve(listener.el)
          })
          // _observer设置为null
          this._observer = null
        }

        // 遍历TargetQueue，给自定义事件，添加监听
        this.TargetQueue.forEach((target) => {
          this._initListen(target.el, true)
        })

      } else {
        // 2. observer模式

        // 遍历TargetQueue，给自定义事件，移除事件监听
        this.TargetQueue.forEach((target) => {
          this._initListen(target.el, false)
        })

        // 使用 IntersectionObserver
        this._initIntersectionObserver()
      }
    }

    /*
     *** Private functions ***
     */

    /*
     * TargetQueue 添加 target，为DOM元素（window）遍历监听事件，添加事件监听
     * add listener target
     * @param  {DOM} el listener target window对象
     * @return
     */
    _addListenerTarget(el) {
      if (!el) return
      // 查询TargetQueue，target是否已存在，根据el来查询
      let target = find(this.TargetQueue, (target) => target.el === el)

      // 如果TargetQueue中target不存在，TargetQueue中push{el, id: ++TargetIndex, childrenCount: 1, listened: true}
      if (!target) {
        target = {
          el: el,
          id: ++this.TargetIndex,
          childrenCount: 1,
          listened: true,
        }
        // modeType.event 为DOM元素（window）遍历监听事件，添加事件监听
        this.mode === modeType.event && this._initListen(target.el, true)

        // TargetQueue添加
        this.TargetQueue.push(target)
      } else {
        // 如果目标已经存在，childrenCount ++
        target.childrenCount++
      }

      return this.TargetIndex
    }

    /*
     * remove listener target or reduce target childrenCount
     * @param  {DOM} el or window
     * @return
     */
    _removeListenerTarget(el) {
      this.TargetQueue.forEach((target, index) => {
        if (target.el === el) {
          target.childrenCount--
          if (!target.childrenCount) {
            this._initListen(target.el, false)
            this.TargetQueue.splice(index, 1)
            target = null
          }
        }
      })
    }

    /*
     * 为自定义事件 或者 ['scroll', 'wheel', 'mousewheel', 'resize', 'animationend', 'transitionend', 'touchmove']添加或移除事件监听
     * add or remove eventlistener
     * @param  {DOM} el DOM or Window
     * @param  {boolean} start flag
     * 
     * on(el, type, 懒加载函数) {
     *  el.addEventListener(type, 懒加载函数)
     * }
     
     * off(el, type, 懒加载函数) {
     *  el.removeEventListener(type, 懒加载函数)
     * }
     * @return
     */
    _initListen(el, start) {
      // 遍历监听事件，执行添加或移除事件监听
      this.options.ListenEvents.forEach((evt) =>
        // 
        _[start ? 'on' : 'off'](el, evt, this.lazyLoadHandler)
      )
    }

    // 初始化事件
    _initEvent() {
      // 图片有如下三种状态 loading，loaded，error
      this.Event = {
        listeners: {
          loading: [], // 加载中
          loaded: [], // 已加载
          error: [], // 加载错误
        },
      }

      /**
       *  定义监听事件 $on, 将不同状态的图片push到对应状态的数组中，方便管理
       * @param {*} event
       * @param {*} func
       */
      this.$on = (event, func) => {
        if (!this.Event.listeners[event]) this.Event.listeners[event] = []
        this.Event.listeners[event].push(func)
      }

      /**
       * 定义一次监听事件 $once
       * @param {*} event
       * @param {*} func
       */
      this.$once = (event, func) => {
        const vm = this
        function on() {
          vm.$off(event, on)
          func.apply(vm, arguments)
        }
        this.$on(event, on)
      }

      /**
       * 定义取消事件 $off
       * @param {*} event
       * @param {*} func
       */
      this.$off = (event, func) => {
        if (!func) {
          if (!this.Event.listeners[event]) return
          this.Event.listeners[event].length = 0
          return
        }
        remove(this.Event.listeners[event], func)
      }

      /**
       * 定义触发事件 $emit
       * @param {*} event
       * @param {*} context
       * @param {*} inCache
       */
      this.$emit = (event, context, inCache) => {
        if (!this.Event.listeners[event]) return
        this.Event.listeners[event].forEach((func) => func(context, inCache))
      }
    }

    /**
     * 判断listener是否出现在视口当中，如果是就执行load，触发懒加载
     * find nodes which in viewport and trigger load
     * @return
     */
    _lazyLoadHandler() {

      // 存放dom元素不存在，dom元素的父节点不存在的listener
      const freeList = []
      // 遍历ListenerQueue
      this.ListenerQueue.forEach((listener, index) => {
        // 如果当前dom元素不存或者当前元素的父节点不存在
        if (!listener.el || !listener.el.parentNode) {
          freeList.push(listener)
        }
        // 是否出现在视口当中
        const catIn = listener.checkInView()

        if (!catIn) return

        // 出现在视口当中，加载图片
        listener.load()
      })
      freeList.forEach((item) => {
        remove(this.ListenerQueue, item)
        item.$destroy()
      })
    }
    /**
     * init IntersectionObserver
     * set mode to observer
     * https://developer.mozilla.org/zh-CN/docs/Web/API/IntersectionObserver
     * observe(el)开始观察
     * unobserve(el)停止观察
     * @return
     */
    _initIntersectionObserver() {
      if (!hasIntersectionObserver) return
      // 实例化IntersectionObserver，new IntersectionObserver(callback, options)
      this._observer = new IntersectionObserver(this._observerHandler.bind(this), this.options.observerOptions)
      if (this.ListenerQueue.length) {
        // 遍历ListenerQueue，开始观察
        this.ListenerQueue.forEach((listener) => {
          this._observer.observe(listener.el)
        })
      }
    }

    /**
     * init IntersectionObserver
     * @return
     */
    /**
     *
     * @param {
     *  boundingClientRect: DOMRectReadOnly {x: 8, y: 8, width: 359, height: 359, top: 8, …} // 目标元素的矩形区域的信息
     *  intersectionRatio: 1 // 目标元素的可见比例，即intersectionRect占boundingClientRect的比例，完全可见时为1，完全不可见时小于等于0
     *  intersectionRect: DOMRectReadOnly {x: 8, y: 8, width: 359, height: 359, top: 8, …} // 目标元素与视口（或根元素）的交叉区域的信息
     *  isIntersecting: true // 如果目标元素与交叉区域观察者对象(intersection observer) 的根相交，则返回 true .如果返回 true, 则 IntersectionObserverEntry 描述了变换到交叉时的状态; 如果返回 false, 那么可以由此判断,变换是从交叉状态到非交叉状态.
     *  isVisible: false
     *  rootBounds: DOMRectReadOnly {x: 0, y: 0, width: 375, height: 667, top: 0, …} // 根元素的矩形区域的信息，getBoundingClientRect()方法的返回值，如果没有根元素（即直接相对于视口滚动），则返回null
     *  target: img // 被观察的目标元素，是一个 DOM 节点对象
     *  time: 483.7899999693036 // 可见性发生变化的时间，是一个高精度时间戳，单位为毫秒
     * } entries
     * @param {*} observer
     */
    _observerHandler(entries, observer) {
      entries.forEach((entry) => {
        console.log(entry)
        if (entry.isIntersecting) {
          // 遍历监听队列
          this.ListenerQueue.forEach((listener) => {
            // 如果监听队列的dom === entry的dom
            if (listener.el === entry.target) {
              // 停止观察
              if (listener.state.loaded) return this._observer.unobserve(listener.el)
              listener.load()
            }
          })
        }
      })
    }

    /**
     * set element attribute with image'url and state
     * @param  {object} lazyload listener object
     * @param  {string} state will be rendered
     * @param  {bool} inCache  is rendered from cache
     * @return
     */
    _elRenderer(listener, state, cache) {
      // 如果el不存在，直接返回
      if (!listener.el) return
      // 获取dom元素和绑定类型
      const { el, bindType } = listener
      // 定义 src
      let src
      // 判断当前状态 state
      switch (state) {
        case 'loading':
          // 取loading图片地址
          src = listener.loading
          break
        case 'error':
          // 取error图片地址
          src = listener.error
          break
        default:
          // 取真是图片地址
          src = listener.src
          break
      }

      if (bindType) {
        el.style[bindType] = 'url("' + src + '")'
      } else if (el.getAttribute('src') !== src) {
        // 如果当前元素的src属性不等于 src，则赋值
        el.setAttribute('src', src)
      }

      // 给dom元素设置 lazy属性为 state的状态
      el.setAttribute('lazy', state)

      // 触发事件 loading，error，loaded
      this.$emit(state, listener, cache)
      // 动态修改元素的属性
      this.options.adapter[state] && this.options.adapter[state](listener, this.options)

      // 是否触发事件loading，error，loaded
      if (this.options.dispatchEvent) {
        // 自定义事件
        const event = new CustomEvent(state, {
          detail: listener,
        })
        el.dispatchEvent(event)
      }
    }

    /**
     * 生成图片的三个状态地址，src，loading，error
     * generate loading loaded error image url
     * @param {string} image's src
     * @return {object} image's loading, loaded, error url
     */
    _valueFormatter(value) {
      let src = value // img的真实url
      let loading = this.options.loading // loading图片
      let error = this.options.error // error图片

      // value is object
      // 图片的真是地址是对象形式 {src: '', loading: '',error: ''}
      if (isObject(value)) {
        // 如果对象中的src不存在，打印错误信息
        if (!value.src && !this.options.silent) console.error('Vue Lazyload warning: miss src with ' + value)
        src = value.src
        loading = value.loading || this.options.loading
        error = value.error || this.options.error
      }
      return {
        src,
        loading,
        error,
      }
    }
  }
}

```

### listener

```js
import {
  loadImageAsync,
  ObjectKeys,
  noop
} from './util'

export default class ReactiveListener {
  constructor ({ 
    el, // 当前dom元素
    src, // 图片的真实url
    error, // 图片加载错误的url
    loading,  // 图片加载中的url
    bindType, // 绑定类型
    $parent, // 父元素 
    options, // 参数
    cors,  // 跨域
    elRenderer, // dom元素渲染
    imageCache  // 图片缓存
  }) {
    this.el = el// 当前dom元素
    this.src = src// 图片的真实url
    this.error = error// 图片加载错误的url
    this.loading = loading// 图片加载中的url
    this.bindType = bindType // 绑定类型
    this.attempt = 0 // 尝试加载次数
    this.cors = cors// 跨域

    this.naturalHeight = 0 // 真实高度
    this.naturalWidth = 0 // 真实宽度

    this.options = options// 参数
 
    this.rect = null // getBoundingClientRect对象

    this.$parent = $parent // 父元素
    this.elRenderer = elRenderer// dom元素渲染
    this._imageCache = imageCache // 图片缓存

    // 性能
    this.performanceData = {
      init: Date.now(),
      loadStart: 0,
      loadEnd: 0
    }
    
    // 过滤事件
    this.filter()
    // 初始化状态loading，error，loaded，rendered都为false
    this.initState()
    // loading渲染
    this.render('loading', false)
  }

  /*
   * init listener state
   * @return
   */
  initState () {
    if ('dataset' in this.el) {// 如果dom元素的属性中存在dataset
      // 设置 dataset.src = src
      this.el.dataset.src = this.src 
    } else {// 设置 data-src = src
      this.el.setAttribute('data-src', this.src)
    }

    // 初始化状态
    this.state = {
      loading: false,
      error: false,
      loaded: false,
      rendered: false
    }
  }

  /*
   * record performance
   * @return
   */
  record (event) {
    this.performanceData[event] = Date.now()
  }

  /*
   * update image listener data
   * @param  {String} image uri
   * @param  {String} loading image uri
   * @param  {String} error image uri
   * @return
   */
  update ({ src, loading, error }) {
    const oldSrc = this.src
    this.src = src
    this.loading = loading
    this.error = error
    this.filter()
    if (oldSrc !== this.src) {
      this.attempt = 0
      this.initState()
    }
  }

  /*
   * get el node rect
   * @return
   */
  getRect () {
    // https://developer.mozilla.org/zh-CN/docs/Web/API/Element/getBoundingClientRect
    this.rect = this.el.getBoundingClientRect()
  }

  /*
   * 当前元素是否出现在视口中, true-是，false-否
   *  check el is in view
   * @return {Boolean} el is in view
   */
  checkInView () {
    this.getRect()
    return (this.rect.top < window.innerHeight * this.options.preLoad && this.rect.bottom > this.options.preLoadTop) &&
            (this.rect.left < window.innerWidth * this.options.preLoad && this.rect.right > 0)
  }

  /*
   * 过滤传入的事件
   * listener filter
   */
  filter () {
    ObjectKeys(this.options.filter).map(key => {
      this.options.filter[key](this, this.options)
    })
  }

  /*
   * 渲染loading
   * render loading first
   * @params cb:Function
   * @return
   */
  renderLoading (cb) {

    // 图片的loading状态更改为true
    this.state.loading = true

    // 异步渲染图片
    loadImageAsync({
      src: this.loading,
      cors: this.cors
    }, data => {
      this.render('loading', false)
      // 图片的loading状态更改为false
      this.state.loading = false
      cb()
    }, () => {
      // handler `loading image` load failed
      cb()
      // 图片的loading状态更改为false
      this.state.loading = false
      if (!this.options.silent) console.warn(`VueLazyload log: load failed with loading image(${this.loading})`)
    })
  }

  /*
   * 加载图片，并渲染出来
   * try load image and  render it
   * @return
   */
  load (onFinish = noop) {
    // 尝试加载次数大于自定义的尝试加载次数，并his.state.error
    if ((this.attempt > this.options.attempt - 1) && this.state.error) {
      if (!this.options.silent) console.log(`VueLazyload log: ${this.src} tried too more than ${this.options.attempt} times`)
      onFinish()
      return
    }

    // 图片已加载并渲染
    if (this.state.rendered && this.state.loaded) return

    // 图片已缓存
    if (this._imageCache.has(this.src)) {
      this.state.loaded = true // 加载图片
      this.render('loaded', true)
      this.state.rendered = true // 渲染图片
      return onFinish()
    }

    // 渲染加载中的状态
    this.renderLoading(() => {
      this.attempt++

      this.options.adapter['beforeLoad'] && this.options.adapter['beforeLoad'](this, this.options)

      // 性能测试-loadStart
      this.record('loadStart')

      loadImageAsync({
        src: this.src,
        cors: this.cors
      }, data => {
        this.naturalHeight = data.naturalHeight
        this.naturalWidth = data.naturalWidth
        this.state.loaded = true// 图片的loaded状态更改为true
        this.state.error = false// 图片的error状态更改为false
        this.record('loadEnd')// 性能测试-loadEnd
        this.render('loaded', false)
        this.state.rendered = true// 图片的rendered状态更改为true
        this._imageCache.add(this.src) // 将图片url缓存
        onFinish()
      }, err => {
        // 图片加载出错
        !this.options.silent && console.error(err)
        this.state.error = true// 图片的error状态更改为true
        this.state.loaded = false// 图片的loaded状态更改为false
        this.render('error', false)
      })
    })
  }

  /*
   * 渲染图片
   * render image
   * @param  {String} state to render // ['loading', 'src', 'error']
   * @param  {String} is form cache
   * @return
   */
  render (state, cache) {
    this.elRenderer(this, state, cache)
  }

  /*
   * 性能测试
   * output performance data
   * @return {Object} performance data
   */
  performance () {
    let state = 'loading'
    let time = 0

    if (this.state.loaded) {
      state = 'loaded'
      time = (this.performanceData.loadEnd - this.performanceData.loadStart) / 1000
    }

    if (this.state.error) state = 'error'

    return {
      src: this.src,
      state,
      time
    }
  }

  /*
   * $destroy
   * @return
   */
  $destroy () {
    this.el = null
    this.src = null
    this.error = null
    this.loading = null
    this.bindType = null
    this.attempt = 0
  }
}

```

### util

```js
import assign from 'assign-deep' // 深度赋值

// 是否是浏览器
const inBrowser = typeof window !== 'undefined' && window !== null

// 是否存在IntersectionObserver对象
export const hasIntersectionObserver = checkIntersectionObserver()

function checkIntersectionObserver () {
  if (inBrowser &&
    'IntersectionObserver' in window &&
    'IntersectionObserverEntry' in window &&
    'intersectionRatio' in window.IntersectionObserverEntry.prototype) {
  // Minimal polyfill for Edge 15's lack of `isIntersecting`
  // See: https://github.com/w3c/IntersectionObserver/issues/211
    if (!('isIntersecting' in window.IntersectionObserverEntry.prototype)) {
      Object.defineProperty(window.IntersectionObserverEntry.prototype,
        'isIntersecting', {
          get: function () {
            return this.intersectionRatio > 0
          }
        })
    }
    return true
  }
  return false
}

// 事件模式还是监听模式
export const modeType = {
  event: 'event',
  observer: 'observer'
}

// 自定义事件对象CustomEvent
// CustomEvent polyfill
const CustomEvent = (function () {
  if (!inBrowser) return
  if (typeof window.CustomEvent === 'function') return window.CustomEvent
  function CustomEvent (event, params) {
    params = params || { bubbles: false, cancelable: false, detail: undefined }
    var evt = document.createEvent('CustomEvent')
    // 该api已弃用
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail)
    return evt
  }
  CustomEvent.prototype = window.Event.prototype
  return CustomEvent
})()

// 删除数组中的指定元素
function remove (arr, item) {
  if (!arr.length) return
  const index = arr.indexOf(item)
  if (index > -1) return arr.splice(index, 1)
}

// 判断数组中是否存在某个函数
function some (arr, fn) {
  let has = false
  for (let i = 0, len = arr.length; i < len; i++) {
    if (fn(arr[i])) {
      has = true
      break
    }
  }
  return has
}

/**
 * 
 * @param {DOM} el 
 * @param {devicePixelRatio} scale 
 */
function getBestSelectionFromSrcset (el, scale) {
  
  // 如果el不是img标签 或者 该dom不包含属性data-srcset，直接返回
  if (el.tagName !== 'IMG' || !el.getAttribute('data-srcset')) return

  // 
  let options = el.getAttribute('data-srcset')
  const result = []
  const container = el.parentNode
  const containerWidth = container.offsetWidth * scale

  let spaceIndex
  let tmpSrc
  let tmpWidth

  options = options.trim().split(',')

  options.map(item => {
    item = item.trim()
    spaceIndex = item.lastIndexOf(' ')
    if (spaceIndex === -1) {
      tmpSrc = item
      tmpWidth = 999998
    } else {
      tmpSrc = item.substr(0, spaceIndex)
      tmpWidth = parseInt(item.substr(spaceIndex + 1, item.length - spaceIndex - 2), 10)
    }
    result.push([tmpWidth, tmpSrc])
  })

  result.sort(function (a, b) {
    if (a[0] < b[0]) {
      return 1
    }
    if (a[0] > b[0]) {
      return -1
    }
    if (a[0] === b[0]) {
      if (b[1].indexOf('.webp', b[1].length - 5) !== -1) {
        return 1
      }
      if (a[1].indexOf('.webp', a[1].length - 5) !== -1) {
        return -1
      }
    }
    return 0
  })
  let bestSelectedSrc = ''
  let tmpOption

  for (let i = 0; i < result.length; i++) {
    tmpOption = result[i]
    bestSelectedSrc = tmpOption[1]
    const next = result[i + 1]
    if (next && next[0] < containerWidth) {
      bestSelectedSrc = tmpOption[1]
      break
    } else if (!next) {
      bestSelectedSrc = tmpOption[1]
      break
    }
  }

  return bestSelectedSrc
}

// 查询数组中的某个函数
function find (arr, fn) {
  let item
  for (let i = 0, len = arr.length; i < len; i++) {
    if (fn(arr[i])) {
      item = arr[i]
      break
    }
  }
  return item
}

// 获取devicePixelRatio
const getDPR = (scale = 1) => inBrowser ? (window.devicePixelRatio || scale) : scale

// 判断是否支持Webp
function supportWebp () {
  if (!inBrowser) return false

  let support = true
  const d = document

  try {
    // https://developer.mozilla.org/zh-CN/docs/Web/API/Document/createElement
    // 创建一个html标签
    let el = d.createElement('object')
    el.type = 'image/webp'
    el.style.visibility = 'hidden'
    el.innerHTML = '!'
    d.body.appendChild(el)
    support = !el.offsetWidth
    d.body.removeChild(el)
  } catch (err) {
    support = false
  }

  return support
}

// 节流函数
function throttle (action, delay) {
  let timeout = null
  let lastRun = 0
  return function () {
    if (timeout) {
      return
    }
    let elapsed = Date.now() - lastRun
    let context = this
    let args = arguments
    let runCallback = function () {
      lastRun = Date.now()
      timeout = false
      action.apply(context, args)
    }
    if (elapsed >= delay) {
      runCallback()
    } else {
      timeout = setTimeout(runCallback, delay)
    }
  }
}

// 判断addEventListener 是否支持 passive
function testSupportsPassive () {
  if (!inBrowser) return
  let support = false
  try {
    let opts = Object.defineProperty({}, 'passive', {
      get: function () {
        support = true
      }
    })
    window.addEventListener('test', null, opts)
  } catch (e) {}
  return support
}

const supportsPassive = testSupportsPassive()

const _ = {
  // 添加事件
  on (el, type, func, capture = false) {
    if (supportsPassive) {
      el.addEventListener(type, func, {
        capture: capture,
        passive: true
      })
    } else {
      el.addEventListener(type, func, capture)
    }
  },
  // 移出事件
  off (el, type, func, capture = false) {
    el.removeEventListener(type, func, capture)
  }
}

/**
 * 异步懒加载图片
 * @param {*} item
 * @param {*} resolve
 * @param {*} reject
 */
const loadImageAsync = (item, resolve, reject) => {
  let image = new Image()
  if (!item || !item.src) {
    const err = new Error('image src is required')
    return reject(err)
  }

  // 设置src
  image.src = item.src

  if (item.cors) {
    // 设置跨域
    image.crossOrigin = item.cors
  }

  // 加载
  image.onload = function () {
    resolve({
      naturalHeight: image.naturalHeight,
      naturalWidth: image.naturalWidth,
      src: image.src
    })
  }

  // 加载错误
  image.onerror = function (e) {
    reject(e)
  }
}

// 获取具体DOM元素的样式属性值
// https://developer.mozilla.org/zh-CN/docs/Web/API/Window/getComputedStyle
const style = (el, prop) => {
  return typeof getComputedStyle !== 'undefined'
    ? getComputedStyle(el, null).getPropertyValue(prop)
    : el.style[prop]
}

// 获取DOM元素的overflow，overflow-y，overflow-x的值
const overflow = (el) => {
  return style(el, 'overflow') + style(el, 'overflow-y') + style(el, 'overflow-x')
}

// 返回window对象
const scrollParent = (el) => {
  
  // 如果不是浏览器端，undefined
  if (!inBrowser) return

  // 如果el的实例不是HTMLElement，返回window对象
  if (!(el instanceof HTMLElement)) {
    return window
  }

  // 定义parent
  let parent = el

  // 循环parent,查询父级节点
  while (parent) {

    // 如果找到body，跳出循环，返回window对象
    if (parent === document.body || parent === document.documentElement) {
      break
    }

    // 如果父级节点不存在，跳出循环，返回window对象
    if (!parent.parentNode) {
      break
    }

    if (/(scroll|auto)/.test(overflow(parent))) {
      return parent
    }

    // parent父级DOM节点
    parent = parent.parentNode
  }

  return window
}

// 是否是object
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

// 获取对象的keys，组成数组
function ObjectKeys (obj) {
  if (!(obj instanceof Object)) return []
  if (Object.keys) {
    return Object.keys(obj)
  } else {
    let keys = []
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        keys.push(key)
      }
    }
    return keys
  }
}

// 将类数组转化数组
function ArrayFrom (arrLike) {
  let len = arrLike.length
  const list = []
  for (let i = 0; i < len; i++) {
    list.push(arrLike[i])
  }
  return list
}

// 空函数
function noop () {}

// 定义ImageCache用来存储图片
class ImageCache {
  constructor ({ max }) {
    this.options = {
      max: max || 100 // 存储的最大长度，默认100
    }
    this._caches = []
  }

  // 是否已存在
  has (key) {
    return this._caches.indexOf(key) > -1
  }

  // 添加
  add (key) {
    if (this.has(key)) return
    this._caches.push(key)
    if (this._caches.length > this.options.max) {
      this.free()
    }
  }
  // 把数组的第一个元素从其中删除，并返回第一个元素的值。
  free () {
    this._caches.shift()
  }
}

export {
  ImageCache,
  inBrowser,
  CustomEvent,
  remove,
  some,
  find,
  assign,
  noop,
  ArrayFrom,
  _,
  isObject,
  throttle,
  supportWebp,
  getDPR,
  scrollParent,
  loadImageAsync,
  getBestSelectionFromSrcset,
  ObjectKeys
}

```

### lazy-component

### lazy-container

### lazy-image