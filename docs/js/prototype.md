### 原型链

### 创建对象有几种方法

1. 字面量方法：`{}`,`new Object()`
    
    ```js
    var o1 = {name: 'o1'}
    var o2 = new Object({name: 'o2'}) // 也可以理解为通过构造函数来创建对象
    ``` 
2. 构造函数

    ```js
    var M = function(name){this.name = name}
    var o3 = new M('o3')
    ``` 
3. `Object.create()`
    
    ```js
    var p = {name: 'p'}
    var o4 = Object.create(p)
    ```
> 说明：Object.create(null) 创建的对象是一个空对象，在该对象上没有继承 Object.prototype 原型链上的属性或者方法

### 原型、构造函数、实例、原型链

<img src="https://note.youdao.com/yws/api/personal/file/WEBd244d38abd1db470324f76dadc1173fc?method=download&shareKey=476880ad86fa9baf2d8a9804b11a9ec4" />
 
说明：

1. 构造函数M的原型对象`M.prototype`的`constructor`等于`构造函数`（构造函数的显示原型constructor 等于 该构造函数 ）

    ```js
    M.prototype.constructor === M
    ```
2. 构造函数M的原型对象`M.prototype` 等于 构造函数M的实例的`__proto__`（构造函数的显式原型 等于 构造函数实例的隐式原型）

    ```js
    M.prototype === new M().__proto__
    ```
### instanceof的原理是什么

<img src="https://note.youdao.com/yws/api/personal/file/WEB011701df82f383c5b84ba0d992c9fda1?method=download&shareKey=2bd0ecabd74bb996d9d0c2480588d7a6"/>

```js
var obj = {}
obj instanceof Object
// obj.__proto__ === Object.prototype // true
```

原理：判断实例对象的`__proto__`和构造函数的`prototype`是否是同一个引用(new M().__proto__ === M.prototype)

### new运算符

问题：理解创建一个对象如何关联上一个实例对象？

工作原理：

1. 创建一个新对象（空对象），继承构造函数的原型对象（foo.prototype）
2. 构造函数foo被执行。执行的时候，相应的传参会被传入，同时上下文（this）会指定为这个新的实例。new foo等同于new foo()，只能用于在不传任何参数的情况
3. 如果构造函数返回一个“对象”，那么这个对象会取代整个new出来的结果。如果构造函数没有返回对象，那么new出来的结果为步骤1创建的对象

问题：如何模拟new运算符？

```js
var new2 = function(func) { // 参数构造函数
    // 第一步：创建一个新对象，继承构造函数的原型对象
    var o = Object.create(func.prototype) 
    // 第二步：执行构造函数，转移this到o对象上
    var k = func.call(o) 
    // 判断构造函数执行的结果是不是对象类型
    if (typeof k === 'object'){
        return k
    }else{
        return o
    }
}
// 验证
var o6 = new2(M)
o6 instanceof M // 判断o6是不是M构造函数的实例
o6 instanceof Object 
o6.__proto__.construtor === M // o6的原型对象是否等于M
M.prototype.walk = function(console.log('walk')) // 在M的原型上增加一个方法walk
o6.walk()
```

### 面向对象类oop

##### 类与实例

1. 类的声明：构造函数、es6的class
 
    ```js
    function Animal() {
        this.name = 'name'
    }
    
    class Animal2 {
        constructor() {
            this.name = ''
        }
    }
    ```
    
> 说明class 只是语法糖，本质还是函数，Animal2 instanceof Function // true

2. 生成实例（通过类实例化生成对象）

    ```js
    new Animal()
    new Animal2()
    ```

##### 类与继承(通过`原型链`实现继承)

- 如何实现继承

    当试图得到一个对象的某个属性时，如果这个对象本身没有这个属性，那么会去它的__proto__(即构造函数的prototype)中去找

- 继承的几种方式

1. 借助`构造函数`实现继承
    
    方法：子类构造函数中执行父类构造函数（` Parent1.call(this) `）

    缺点：继承不了父类构造函数原型对象`（Parent1.prototype）`上的属性和方法
    
    ```js
    function Parent1() {
        this.name = 'Parent1'
    }
    // 缺点：继承不了父类`原型对象（Parent1.prototype）`上的属性和方法
    Parent1.prototype.say = function() {}
    function Child1() {
        Parent1.call(this) // 或者使用apply
        this.type = 'Child1'
    }
    // 实例化Child1
    console.log(new Child1)
    ```
    
2. 借助`原型链`实现继承：弥补通过构造函数继承的缺点
    
    方法：将父类构造函数的实例赋值给子类构造函数的原型对象（`Child2.prototype = new Parent2()`）

    原因：子类Child2.prototype赋值父类的实例new Parent2()，当子类实例化时，`子类实例的__proto__`就等于`子类构造函数的prototype`，`子类实例的__proto__`等于`父类的实例`，因此实现了继承

    缺点：如果实例化两个子类构造函数，其中一个子类构造函数的原型上的方法和属性改变，另一个实例也会相应改变

    ```js
    function Parent2() {
        this.name = 'Parent2'
        this.play = [1,2,3]
    }
    function Child2() {
        this.type = 'Child2'
    }
    Child2.prototype = new Parent2()
    // 实例化Child1
    console.log(new Child2)
    
    // 缺点：改变s1原型对象上的属性和方法会影响到s2对象，原因是s1和s2的__proto__的指向相同（s1.__proto__ === s2.__proto__）
    var s1 = new Child2()
    var s2 = new Child2()
    console.log(s1.play,s2.play)
    s1.play.push(4)
    console.log(s1.play,s2.play)
    ```
    
3. 组合方式,组合构造函数和原型链两种方式
    
    方法：在子类构造函数中执行父类构造函数，然后将父类的构造函数的实例赋值给子类的原型对象

    缺点：父类构造函数执行了两次

    ```js
    function Parent3() {
        this.name = 'Parent3'
        this.play = [1,2,3]
    }
    function Child3() {
        Parent3.call(this) 
        this.type = 'Child3'
    }
    // 缺点：父级的构造函数执行了两次
    Child3.prototype = new Parent3()
    var s3 = new Child3()
    var s4 = new Child3()
    s3.play.push(4)
    console.log(s3.play,s4.play)
    ```
    
4. 优化方式1: 通过父类的`prototype`
    
    方法：子类构造函数中执行父类构造函数，然后将父类构造函数的原型对象赋值给子类构造函数的原型对对象

    缺点：区分不了一个对象是子类的实例化还是父类的实例化

    ```js
    function Parent4() {
        this.name = 'Parent4'
        this.play = [1,2,3]
    }
    function Child4() {
        Parent4.call(this) 
        this.type = 'Child4'
    } 
    // 缺点：区分不了一个对象是一个子类的实例化还是一个父类的实例化
    Child4.prototype = Parent4.prototype
    var s5 = new Child4()
    var s6 = new Child4()
    console.log(s5, s6)
    console.log(s5 instanceof Child4) // true
    console.log(s5 instanceof Parent4) // true
    ```
    
5. 优化方式2：通过`Object.create()`
    
    方法：在子类构造函数中执行父类构造函数，然后创建父类构造函数的实例继承赋值给子类构造函数的原型对象，最后将子类构造函数赋值给子类构造函数的原型对象的constructor
    
    ```js
    function Parent5() 
        this.name = 'Parent5'
        this.play = [1,2,3]
    }
    function Child5() {
        Parent5.call(this) 
        this.type = 'Child5'
    } 
    Child5.prototype = Object.create(Parent5.prototype)
    Child5.prototype.constructor = Child5
    
    var s7 = new Child5()
    console.log(s7 instanceof Child5, s7 instanceof Parent5)
    console.log(s5.constructor)
    ```
6. 使用es6的`extends`    
    
    ```js
    class Parent {
      constructor(value) {
        this.val = value
      }
      getValue() {
        console.log(this.val)
      }
    }
    class Child extends Parent {
      constructor(value) {
        super(value) // Parent.call(this, value)
        this.val = value
      }
    }
    let child = new Child(1)
    child.getValue() // 1
    child instanceof Parent // true
    ```

拓展：

`Object.prototype.toString方法`

`Object.prototype.toString.call(obj) === “[object Object]"`

```js
console.log(Object.prototype.toString.call("jerry"));   //[object String]
console.log(Object.prototype.toString.call(12));        //[object Number]
console.log(Object.prototype.toString.call(true));     //[object Boolean]
console.log(Object.prototype.toString.call(undefined));  //[object Undefined]
console.log(Object.prototype.toString.call(null));      //[object Null]
console.log(Object.prototype.toString.call({name: "jerry"}));  //[object Object]            
console.log(Object.prototype.toString.call(function(){}));    //[object Function]
console.log(Object.prototype.toString.call([]));        //[object Array]
console.log(Object.prototype.toString.call(new Date));   //[object Date]
console.log(Object.prototype.toString.call(/\d/));   //[object RegExp]
function Person(){};
console.log(Object.prototype.toString.call(new Person));//[object Object]
```