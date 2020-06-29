# 获取某年某个月的最后一天

## 业务场景

- 父组件有一个日期选择器，只能选择到月，不可以选择具体的天
- 子组件接收父组件传入的日期，回显出本月的开始天和结束天

## 技术实现

```js
// 年
let year = new Date(this.date).getFullYear()
// 月
let month = new Date(this.date).getMonth() + 1

// 开始天
let startDay = new Date(year, month, 1).getDate()
// 结束天
let endDay = new Date(year, month, 0).getDate()
```