# h5吸顶

## 业务场景

页面滚动到一定位置时，tab页固定到页面的顶部

## 技术实现

第一种：给需要固定到顶部的元素设置如下样式：

```css
.tab {
    position: sticky;
    top: 0;
}
```

::: warning  注意
1. 使用`position:sticky`属性，父级元素不能有任何overflow:visible以外的overflow设置，否则没有粘滞效果
2. 在`antd-mobile`的`tab`标签上使用时，需要注意父级存在overflow属性
:::

第二种：滚动事件

