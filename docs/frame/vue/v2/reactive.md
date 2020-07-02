# 响应式原理

简单概述：

vue.js 采用**数据劫持结合发布-订阅模式**,通过 `Object.defineProperty` 来劫持各个属性的 `setter`,`getter`,在数据变动时发布消息给订阅者,触发相应的监听回调

详细描述：

当创建 Vue 实例时,vue 会遍历 data 选项的属性,利用 `Object.defineProperty` 为属性添加 `getter` 和 `setter` 对数据的读取进行劫持（`getter` 用来**依赖收集**,`setter` 用来**派发更新**）,并且在内部追踪依赖,在属性被访问和修改时通知变化。

每个组件实例会有相应的 `watcher` 实例,会在组件渲染的过程中记录依赖的所有数据属性（进行依赖收集,还有 `computed watcher`,`user watcher` 实例）,之后依赖项被改动时,`setter` 方法会通知依赖与此 data 的 watcher 实例重新计算（派发更新）,从而使它关联的组件重新渲染。

实现响应式有三个核心类：

- Observe：数据的观察者
- Watcher：数据的订阅者，数据变化会通知Watcher，然后由Watcher进行相应的操作，例如更新视图
- Dep：Observe和Watcher的纽带，当数据发生变化时，会被Observe观察到，然后由Dep通知到Watcher

## Observe

概述：

使用[Object.defineProperty](./component/defineProperty.md)是给对象的属性添加 `getter` 和 `setter`，用于**依赖收集**和**派发更新**

[Observe对象实现](./component/Observer.md)关键步骤：

1. 实例化Dep
2. 调用[def()](./component/def.md)把自身实例添加到数据对象 `value` 的 `__ob__` 属性上
3. 属性如果是对象，则遍历对象属性调用[defineReactive()](./component/defineReactive.md)；如果数组，则遍历数组调用[observe()](./component/observe.md)

[Observe的简单实现](./component/my-observe.md)

## Dep

- 用于收集当前响应式对象的依赖关系
- 每个响应式对象包括子对象都拥有一个 Dep 实例（里面 subs 是 Watcher 实例数组
- 当数据有变更时,会通过 dep.notify()通知各个 watcher（Dep 实际上就是对 Watcher 的一种管理）

[Dep类](./dep/dep.md)主要是定义了一些属性和方法：

- addSub
- removeSub
- depend：添加依赖（实际上是调用Watcher的`addDep()`）
- notify：派发更新（通知订阅者）（实际上是调用Wathcer的`update()`方法）

::: tip 说明
Dep是Watcher实例的管理者。Dep 是一个类，用于依赖收集和派发更新，也就是存放`Watcher实例`和触发Watcher实例上的`update`
:::

## Watcher

观察者对象 , 实例分为如下三种：

- 渲染 watcher (render watcher)：负责视图渲染，数据变动了也执行这个watcher
- 计算属性 watcher (computed watcher)：
- 侦听器 watcher（user watcher）
  
[Watcher](./watcher/watcher.md)的关键步骤：

- 