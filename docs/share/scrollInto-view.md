# scrollIntoView

## 业务场景

- 页面底部有两个tab页面
- 进入页面中时，要求tab切换到某一个tab，并且tab页面自动吸顶

## 技术实现

```js
Element.scrollIntoView()
```

## 说明
[scrollIntoView()](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/scrollIntoView)

- 让当前的元素滚动到浏览器窗口的可视区域内
- el.scrollIntoView()
- el.scrollIntoView(alignToTop)
    - true: 元素的顶端将和其所在滚动区的可视区域的顶端对齐
    - false: 元素的底端将和其所在滚动区的可视区域的底端对齐
- el.scrollIntoView(scrollIntoViewOptions)
    - behavior: 定义动画过渡效果， "auto"或 "smooth" 之一
    - block: 定义垂直方向的对齐， "start", "center", "end", 或 "nearest"之一。默认为 "start"
    - inline: 定义水平方向的对齐， "start", "center", "end", 或 "nearest"之一。默认为 "nearest"
