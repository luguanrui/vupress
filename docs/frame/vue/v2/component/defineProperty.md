`Object.defineProperty()`字面理解是：对象定义属性

1. 定义一个对象
```js
let obj = {}
Object.defineProperty(obj, 'school', {
    configurable: true, 
    writable: true, 
    enumerable: true,
    value: '安庆师范大学',
})
console.log(obj)
```

::: tip
1. configurable：可配置属性，默认是false，如果不设置为true，使用delete obj.school删除不了对象属性
2. writable：可写属性，默认是false，如果不设置为true， obj.school = "淮北师范大学" 改变不了对象属性的值
3. enumerable：可枚举属性，默认是false如果不设置为true，使用for...in获取不到对象的属性
4. value：属性的值，通常使用get和set函数来代替value
:::

2. 使用get,set重写value

```js
let obj = {}
Object.defineProperty(obj, 'school', {
    configurable: true,
    enumerable: true,
    get() {
        console.log('获取 obj.school 属性值时，触发')
        return '安庆师范大学'
    },
    set(val) {
        console.log('设置 obj.school 属性值时，触发')
        console.log(val)
    }
})
console.log(obj) // 不会触发get和set
console.log(obj.school) // 触发 get
obj.school = '淮北师范大学' // 触发 set
```
::: warning
get和set不能同时与 value和writable使用，会报错
:::