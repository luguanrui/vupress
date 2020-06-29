# Observe类的简单实现

```js
let myVue = new MyVue({
    el: '#app',
    data: {
        school: '安庆师范大学',
        info: {
            name: '小明',
            age: 12
        }
    }
})

function MyVue(options = {}) {
  this.$options = options;
  var data = (this._data = this.$options.data);
  observe(data);

  // 数据代理，用this代理 this._data，可以使用this直接访问data中的属性
  for (let key in data) {
    Object.defineProperty(this, key, {
      enumerable: true,
      get() {
        return this._data[key]; // 会走到Observe方法中的get
      },
      set() {
        this._data[key] = newValue; // 会走到Observe方法中的set
      },
    });
  }
}

// 观察对象
function observe(data) {
  if (typeof data !== "object") return;
  return new Observe(data);
}

function Observe(data) {
  for (let key in data) {
    let val = data[key];
    observe(val); // 递归观察对象
    Object.defineProperty(data, key, {
      enumerable: true,
      get() {
        return val;
      },
      set(newValue) {
        if (newValue === val) {
          return;
        }
        val = newValue;
        observe(newValue); // 深度响应式，更改数据后，新数据没有get set
      },
    });
  }
}

```