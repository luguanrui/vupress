# 响应式原理

简单概述：

vue.js 采用**数据劫持结合发布-订阅模式**,通过 `Object.defineProperty` 来劫持各个属性的 `setter`,`getter`,在数据变动时发布消息给订阅者,触发相应的监听回调

详细描述：

当创建 Vue 实例时,vue 会遍历 data 选项的属性,利用 `Object.defineProperty` 为属性添加 `getter` 和 `setter` 对数据的读取进行劫持（`getter` 用来依赖收集,`setter` 用来派发更新）,并且在内部追踪依赖,在属性被访问和修改时通知变化。

每个组件实例会有相应的 `watcher` 实例,会在组件渲染的过程中记录依赖的所有数据属性（进行依赖收集,还有 `computed watcher`,`user watcher` 实例）,之后依赖项被改动时,`setter` 方法会通知依赖与此 data 的 watcher 实例重新计算（派发更新）,从而使它关联的组件重新渲染。

实现响应式有三个核心类：

- Observe：数据的观察者
- Watcher：数据的订阅者，数据变化会通知watcher，然后由watcher进行相应的操作，例如更新视图
- Dep：Observe和Watcher的纽带，当数据发生变化时，会被Observe观察到，然后又Dep通知到Watcher

## Observe

概述：

使用[Object.defineProperty](./component/defineProperty.md)是给对象的属性添加 `getter` 和 `setter`，用于**依赖收集**和**派发更新**

[Observe对象实现](./component/Observer.md)关键步骤：

1. 实例化Dep
2. 调用[def()](./component/def.md)把自身实例添加到数据对象 `value` 的 `__ob__` 属性上
3. 遍历对象属性调用[defineReactive()](./component/defineReactive.md)，遍历数组调用[observe()](./component/observe.md)

[Observe的简单实现](./component/my-observe.md)

## Dep

- 用于收集当前响应式对象的依赖关系
- 每个响应式对象包括子对象都拥有一个 Dep 实例（里面 subs 是 Watcher 实例数组
- 当数据有变更时,会通过 dep.notify()通知各个 watcher（Dep 实际上就是对 Watcher 的一种管理）

[Dep类](./dep/dep.md)主要是定义了一些属性和方法：

```js
addSub (sub: Watcher) {
    this.subs.push(sub)
}
removeSub (sub: Watcher) {
    remove(this.subs, sub)
}
// 添加依赖
depend () {
    if (Dep.target) {
      // 调用 watcher对象的 addDep()方法
      Dep.target.addDep(this)
    }
}
// 通知订阅者
notify () {
    // stabilize the subscriber list first
    // 复制subs数组，而不改变原数组
    const subs = this.subs.slice()
    if (process.env.NODE_ENV !== 'production' && !config.async) {
      // subs aren't sorted in scheduler if not running async
      // we need to sort them now to make sure they fire in correct
      // order
      subs.sort((a, b) => a.id - b.id) // 根据id从小到大顺序排序
    }
    // 遍历subs，然后调用每一个watcher的update方法
    for (let i = 0, l = subs.length; i < l; i++) {
      // 调用watcher对象的update方法
      subs[i].update()
    }
}
```

## Watcher

观察者对象 , 实例分为如下三种：

- 渲染 watcher (render watcher)
- 计算属性 watcher (computed watcher)
- 侦听器 watcher（user watcher）