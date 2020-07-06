# 防抖和节流

## 防抖

- 概念： 触发事件后，在n秒内函数只执行一次
- 如果在 n 秒内，又触发了事件，则重新计算函数执行时间
- 单位时间内，操作n次，选中最后一次
- 特点：延迟->无限后延
- 原理：不断刷新定时器

实现：

```js
function debounce(fn, delay = 200) {
    let timer = null
    return (...arg) => {
        clearTimeout(timer)
        timer = setTimeout(()=> {
            fn.apply(this, arg)
        }, delay)
    }
}
```

应用场景：
- scroll事件滚动触发事件
- 按钮提交事件
- 浏览器窗口缩放，resize事件

## 节流

- 概念：连续触发事件，但是在n秒中只执行一次函数，节流会稀释函数的执行频率
- 单位时间内，操作n次，选中第一次
- 特点：只执行一次
- 原理：设置标识位，看能不能触发

实现：
```js
function throttle(fn, delay = 200) {
    let flag = true
    return (...args) => {
        if (!flag) return
        flag = false
        setTimeout(() => {
            fn.apply(this, args)
            flag = true
        }, delay) 
    }
}
```

应用场景：
- DOM 元素的拖拽功能实现
- 搜索联想
- 计算鼠标移动的距离

//评测题目: 无
以下数据结构中，id 代表部门编号，name 是部门名称，parentId 是父部门编号，为 0 代表一级部门，
现在要求实现一个 convert 方法，
把原始 list 转换成树形结构，parentId 为多少就挂载在该 id 的属性 children 数组下，结构如下：

// 原始 list 如下
let list =[
    {id:1,name:'部门A',parentId:0},
    {id:2,name:'部门B',parentId:0},
    {id:3,name:'部门C',parentId:1},
    {id:4,name:'部门D',parentId:1},
    {id:5,name:'部门E',parentId:2},
    {id:6,name:'部门F',parentId:3},
    {id:7,name:'部门G',parentId:2},
    {id:8,name:'部门H',parentId:4}
];
const result = convert(list, ...);



// 转换后的结果如下
let result = [
    {
      id: 1,
      name: '部门A',
      parentId: 0,
      children: [
        {
          id: 3,
          name: '部门C',
          parentId: 1,
          children: [
            {
              id: 6,
              name: '部门F',
              parentId: 3
            }, {
              id: 16,
              name: '部门L',
              parentId: 3
            }
          ]
        },
        {
          id: 4,
          name: '部门D',
          parentId: 1,
          children: [
            {
              id: 8,
              name: '部门H',
              parentId: 4
            }
          ]
        }
      ]
    },
  ···
];