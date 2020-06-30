```js
let uid = 0
export default class Dep {
  static target: ?Watcher; // target是全局的 Watcher
  id: number;
  subs: Array<Watcher>; // Watcher数组

  constructor () {
    this.id = uid++
    this.subs = []
  }
  // 添加watcher，将watcher压入数组中
  addSub (sub: Watcher) {
    this.subs.push(sub)
  }

  // 移出watcher
  /** remove的实现,从当前数组中移出对应的item
  export function remove (arr: Array<any>, item: any): Array<any> | void {
    if (arr.length) {
      const index = arr.indexOf(item)
      if (index > -1) {
        return arr.splice(index, 1)
      }
    }
  }
  */
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
}
```