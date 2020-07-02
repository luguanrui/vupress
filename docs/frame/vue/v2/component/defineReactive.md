作用：

1. 利用 Object.defineProperty 给数据添加了 getter 和 setter
2. getter 做的事情是依赖收集 - `dep.depend()`
3. setter 做的事情是派发更新 - `dep.notify()`

关键步骤：

1. 实例化Dep
2. 获取 obj 的属性描述符 property
  
    ```js
    // 常规的对象
    {
        configurable: true,
        enumerable: true,
        value: 1,
        writable: true
    }
    // vue data中定义的数据
    {
        configurable: true,
        enumerable: true,
        get: f proxyGetter(),
        set: f proxySetter()
    }
    ```

3. 对子对象递归调用 observe 方法
4. Object.defineProperty 去给 obj 的属性 key 添加 getter 和 setter

源码：
```js
export function defineReactive (
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
  // 初始化依赖
  const dep = new Dep()
  // 获取 obj 的属性描述符 property
  const property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  // 获取对象属性预定义的get，set函数
  const getter = property && property.get
  const setter = property && property.set

  // 如果对象属性的getter和setter只存在一个
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key]
  }

  // 给非 VNode 的对象类型数据 val 添加一个 Observer
  let childOb = !shallow && observe(val)

  // 给对象属性设置 属性描述符对象
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      // 如果getter存在，调用obj的getter；否则使用val
      const value = getter ? getter.call(obj) : val
      if (Dep.target) {
        dep.depend()
        if (childOb) {
          // 收集依赖，由Vue.set通知ob.dep.notify触发依赖通知
          childOb.dep.depend()

          // 如果value是个数组，就通过 dependArray 把数组每个元素也去做依赖收集
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      // 如果getter存在，则调用getter
      const value = getter ? getter.call(obj) : val
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter()
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) return
      // 如果对象属性的set存在，则直接调用对象属性的set
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      childOb = !shallow && observe(newVal) // 如果shallow为false的情况，会对新设置的值变成一个响应式对象
      dep.notify() // 通知所有的订阅者
    }
  })
}
```