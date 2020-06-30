```js
/* @flow */

import {
  warn,
  remove,
  isObject,
  parsePath,
  _Set as Set,
  handleError,
  noop
} from '../util/index'

import { traverse } from './traverse'
import { queueWatcher } from './scheduler'
import Dep, { pushTarget, popTarget } from './dep'

import type { SimpleSet } from '../util/index'

let uid = 0

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
export default class Watcher {
  vm: Component;
  expression: string;
  cb: Function;
  id: number;
  deep: boolean;
  user: boolean;
  lazy: boolean;
  sync: boolean;
  dirty: boolean;
  active: boolean;
  deps: Array<Dep>;
  newDeps: Array<Dep>;
  depIds: SimpleSet;
  newDepIds: SimpleSet;
  before: ?Function;
  getter: Function;
  value: any;

  constructor (
    vm: Component,
    expOrFn: string | Function,
    cb: Function,
    options?: ?Object,
    isRenderWatcher?: boolean
  ) {
    this.vm = vm
    if (isRenderWatcher) {
      vm._watcher = this
    }
    vm._watchers.push(this)
    // options
    if (options) {
      this.deep = !!options.deep
      this.user = !!options.user
      this.lazy = !!options.lazy
      this.sync = !!options.sync
      this.before = options.before
    } else {
      this.deep = this.user = this.lazy = this.sync = false
    }
    this.cb = cb
    this.id = ++uid // uid for batching
    this.active = true
    this.dirty = this.lazy // for lazy watchers
    this.deps = []
    this.newDeps = []
    this.depIds = new Set() // Set实例，不会添加重复的值
    this.newDepIds = new Set() // Set实例
    this.expression = process.env.NODE_ENV !== 'production'
      ? expOrFn.toString()
      : ''
    // parse expression for getter
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
      this.getter = parsePath(expOrFn)
      if (!this.getter) {
        this.getter = noop
        process.env.NODE_ENV !== 'production' && warn(
          `Failed watching path: "${expOrFn}" ` +
          'Watcher only accepts simple dot-delimited paths. ' +
          'For full control, use a function instead.',
          vm
        )
      }
    }
    this.value = this.lazy
      ? undefined
      : this.get()
  }

  /**
   * 依赖收集相关的方法,获取新的属性值
   * Evaluate the getter, and re-collect dependencies.
   */
  get () {
    // 将watcher实例赋值给 Dep的target属性，并将 Dep.target 入栈 ，存入 targetStack 数组中
    pushTarget(this)
    let value
    const vm = this.vm
    try {
      // 获取属性初始值
      value = this.getter.call(vm, vm)
    } catch (e) {
      if (this.user) {
        handleError(e, vm, `getter for watcher "${this.expression}"`)
      } else {
        throw e
      }
    } finally {
      // "touch" every property so they are all tracked as
      // dependencies for deep watching
      if (this.deep) {
        traverse(value)
      }
      // 出站
      popTarget()
      this.cleanupDeps()
    }
    // 返回属性的值
    return value
  }

  /**
   * 依赖收集相关的方法，
   * dep.depend()中调用 watcher.addDep(dep),
   * watcher.addDep(dep)中调用 dep.addSub(watcher)
   *
   * Add a dependency to this directive.
   */
  addDep (dep: Dep) { // 参数为 Dep
    const id = dep.id
    // 如果在 newDepIds 实例中不存在 id
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id) // newDepIds添加 id
      this.newDeps.push(dep) // newDeps数组中入栈dep
      if (!this.depIds.has(id)) { // 如果depIds实例中不存在 id
        // 将当前 watcher 实例添加到 dep 的 subs 数组中
        dep.addSub(this)
      }
    }
  }

  /**
   * 依赖收集相关的方法
   * Clean up for dependency collection.
   */
  cleanupDeps () {
    let i = this.deps.length
    while (i--) {
      const dep = this.deps[i]
      if (!this.newDepIds.has(dep.id)) {
        dep.removeSub(this)
      }
    }
    let tmp = this.depIds
    this.depIds = this.newDepIds
    this.newDepIds = tmp
    this.newDepIds.clear()
    tmp = this.deps
    this.deps = this.newDeps
    this.newDeps = tmp
    this.newDeps.length = 0
  }

  /**
   * 派发更新
   * Subscriber interface.
   * Will be called when a dependency changes.
   */
  update () {
    /* istanbul ignore else */
    if (this.lazy) {
      this.dirty = true
    } else if (this.sync) {
      this.run()
    } else {
      // queueWatcher 内部也是执行的 watcher实例的 run 方法，只不过内部调用了 nextTick 做性能优化。
      // 它会将当前 watcher 实例放入一个队列，在下一次事件循环时，遍历队列并执行每个 watcher实例的run() 方法
      queueWatcher(this)
    }
  }

  /**
   * Scheduler job interface.
   * Will be called by the scheduler.
   */
  run () {
    if (this.active) {
      // 获取新的属性值
      const value = this.get()
      if (
        // 如果新值不等于旧值
        value !== this.value ||
        // Deep watchers and watchers on Object/Arrays should fire even
        // when the value is the same, because the value may
        // have mutated.
        // 或者如果新值是一个引用类型的值
        isObject(value) ||
        // 或者是深度监听
        this.deep
      ) {
        // set new value
        const oldValue = this.value
        this.value = value
        // this.user 是一个标志符，如果开发者添加的 watch 选项，这个值默认为 true
        if (this.user) {
          // 如果是用户自己添加的 watch ，就加一个 try catch。方便用户调试。否则直接执行回调
          try {
            // 触发回调，并将 新值和旧值 作为参数
            // 这也是为什么我们写 watch 时，可以这样写： function (newVal, oldVal) { // do }
            this.cb.call(this.vm, value, oldValue)
          } catch (e) {
            handleError(e, this.vm, `callback for watcher "${this.expression}"`)
          }
        } else {
          this.cb.call(this.vm, value, oldValue)
        }
      }
    }
  }

  /**
   * Evaluate the value of the watcher.
   * This only gets called for lazy watchers.
   */
  evaluate () {
    this.value = this.get()
    this.dirty = false
  }

  /**
   * Depend on all deps collected by this watcher.
   */
  depend () {
    let i = this.deps.length
    while (i--) {
      this.deps[i].depend()
    }
  }

  /**
   * Remove self from all dependencies' subscriber list.
   */
  teardown () {
    if (this.active) {
      // remove self from vm's watcher list
      // this is a somewhat expensive operation so we skip it
      // if the vm is being destroyed.
      if (!this.vm._isBeingDestroyed) {
        remove(this.vm._watchers, this)
      }
      let i = this.deps.length
      while (i--) {
        this.deps[i].removeSub(this)
      }
      this.active = false
    }
  }
}

```