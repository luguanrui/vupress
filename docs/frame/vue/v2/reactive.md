# 响应式原理

简单概述：

vue.js 采用**数据劫持结合发布-订阅模式**,通过 `Object.defineProperty` 来劫持各个属性的 `setter`,`getter`,在数据变动时发布消息给订阅者,触发相应的监听回调

详细描述：

当创建 Vue 实例时,vue 会遍历 data 选项的属性,利用 `Object.defineProperty` 为属性添加 `getter` 和 `setter` 对数据的读取进行劫持（`getter` 用来依赖收集,`setter` 用来派发更新）,并且在内部追踪依赖,在属性被访问和修改时通知变化。

每个组件实例会有相应的 `watcher` 实例,会在组件渲染的过程中记录依赖的所有数据属性（进行依赖收集,还有 `computed watcher`,`user watcher` 实例）,之后依赖项被改动时,`setter` 方法会通知依赖与此 data 的 watcher 实例重新计算（派发更新）,从而使它关联的组件重新渲染。

实现响应式有三个核心类：

- Observe
- Dep
- Watcher

## Observe

使用[Object.defineProperty](./component/defineProperty.md)是给对象的属性添加 `getter` 和 `setter`，用于**依赖收集**和**派发更新**

[简单实现](./component/observe.md)

## Dep

- 用于收集当前响应式对象的依赖关系
- 每个响应式对象包括子对象都拥有一个 Dep 实例（里面 subs 是 Watcher 实例数组
- 当数据有变更时,会通过 dep.notify()通知各个 watcher（Dep 实际上就是对 Watcher 的一种管理）

Dep类提供了如下几个方法：

- addSub
- removeSub
- depend
- notify

## Watcher

观察者对象 , 实例分为如下三种：

- 渲染 watcher (render watcher)
- 计算属性 watcher (computed watcher)
- 侦听器 watcher（user watcher）