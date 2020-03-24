## 三栏布局

题目：假设高度已知，请写出三栏布局，其中左栏，右栏宽度各300px，中间自适应

5种方案：

- flex布局
- 绝对定位布局absolute
- 浮动布局float
- 表格布局table
- 网格布局grid

### flex布局

```css
.content{
    display: flex;
}
.left {
    width: 300px;
}
.right {
    width: 300px;
}
.center {
    flex: 1;
}
```

### 绝对定位布局absolute

```css
.left,.right,.center {
    position: absolute;
}
.left {
    left: 0;
    width: 300px
}
.right {
    right: 0;
    width: 300px;
}
.center {
    left: 300px；
    right: 300px;
}
```

### 浮动布局float

```css
.left {
    float: left;
    width: 300px;
}
.right {
    float: right;
    width: 300px;
}
```

### 表格布局table

```css
.content {
    width: 100%;
    display: table;
    height: 100px;
}
.left,.right,.center {
    display: table-cell;
}
.left {
    width: 300px;
}
.right {
    width: 300px;
}
```

### 网格布局grid

```css
.content {
    display: grid;
    width: 100%;
    grid-template-rows: 100px;
    grid-template-columns: 300px auto 300px;
}
```

延伸：

1. 五种方案的优缺点：

- float: 需要清除浮动，因为浮动脱落文档流，优点是兼容性好
- 绝对定位：快捷，缺点：
- flex: 解决上述两个布局方式的问题
- 表格布局：兼容性好，缺点：
- 网格布局：css3新出的布局方式

2. 高度未知情况，哪个不再适用：

    float，绝对定位，网格布局不行，只有表格布局和flex布局通用

3.  兼容性如何，哪个最实用 ：

4. 页面布局的变通：

- 三栏布局：
    - 左右宽度固定，中间自适应
    - 上下高度固定，中间自适应（h5布局常用）
- 两栏布局
    - 左宽度固定，右自适应
    - 右宽度固定，左自适应
    - 上高度固定，下自适应
    - 下高度固定，上自适应