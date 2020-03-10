## BFC及其工作原理

BFC（Block Formatting Context）：**格式化上下文**，页面中的一块渲染区域，并且有一套渲染规则，它决定了其子元素将如何定位，以及和其他元素的关系和相互作用

BFC的规则：
- BFC内部的盒子Box会在垂直方向，一个接一个地放置。
- Box垂直方向的距离由margin决定。属于同一个BFC的两个相邻Box的垂直margin会发生重叠。
- 每个元素的margin box的左边， 与包含块border box的左边相接触(对于从左往右的格式化，否则相反)。即使存在浮动也是如此。
- BFC的区域不会与浮动盒子float box重叠。
- BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。反之也如此。
- 计算BFC的高度时，浮动元素也参与计算。

如何生成BFC：
- 根元素html
- float属性不为none
- position不为static或relative
- display为inline-block, table-cell, table-caption, flex, inline-flex
- overflow不为visible

BFC的作用：
- 防止垂直 margin 重叠
- 避免浮动元素和其他元素重叠
- 清除内部浮动

## 盒模型
盒模型包括：实际内容（content）、内边距（padding）、边框（border）、外边距（margin）

**标准盒模型**和**IE盒模型**的区别：

**标准盒模型**：设置的width或height是对 实际内容（content）的width或height进行设置，内容周围的border和padding另外设置
```
盒子模型的width（height）=设置的content的宽高+padding+border+margin
```

**IE盒模型**：设置的width或height是对 实际内容（content）+内边距（padding）+边框（border）之和的width和height进行设置的
```
盒模型的width（height）=设置的width（height）+外边距margin
```

**box-sizing**的应用:
- box-sizing:border-box;是怪异盒模型
- box-sizing:content-box;是标准盒模型（默认值）

> 如果不想因为改变padding的时候盒子的大小也会跟着变化的话就可以使用怪异盒模型,而如果想让盒子的大小被padding撑开的话就可以使用标准盒模型


## 清除浮动

1. 额外标签法：给谁清除浮动，就在其后面额外增加一个个空白标签，并设置样式为设置`clear: both`
2. 创建BFC：父级添加样式`overflow: hidden`
3. 浮动元素使用after伪元素，请设置如何
```
.clearfix:after{
    content: "";
    display: block;
    clear: both;
    height: 0;
    visibility: hidden;
}
.clearfix{
    *zoom: 1;/*ie6清除浮动的方式 *号只有IE6-IE7执行，其他浏览器不执行*/
}

```
4. 使用before和after双伪元素清除浮动
```
.clearfix:after,.clearfix:before{
    content: "";
    display: table;
}
.clearfix:after{
    clear: both;
}
.clearfix{
    *zoom: 1;
}
```

## display:none、visibile:hidden、opacity:0的区别


类型|是否隐藏 | 是否在文档中占用空间 | 是否会触发事件
---|---|---|---
display:none | 是 | 否 | 否
visibile:hidden | 是 | 是 | 否
opacity:0 | 是 | 是 | 是

## 水平垂直居中的方式

1. flex
```
// 父容器
display: flex;
justify-content: center;
align-items: center;
```
2. position
```
// 父容器
position: relative;

// 子容器
position:absolute;
margin:auto;
top:0;
bottom:0;
left:0;
right:0;
```
3. position+transform
```
// 父容器
position: relative;

// 子容器
position: absolute;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
```
4. table-cell
```
<div class="box">
    <div class="content">
        <div class="inner"></div>
    </div>
</div>

html, body {
    height: 100%;
    width: 100%;
    margin: 0;
}
.box {
    display: table;
    height: 100%;
    width: 100%;
}
.content {
    display: table-cell;
    vertical-align: middle;
    text-align: center;
}
.inner {
    background-color: #000;
    display: inline-block;
    width: 200px;
    height: 200px;
}
```

## 文本超出部分显示省略号
单行
```
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
```
多行
```
display: -webkit-box;
-webkit-box-orient: vertical;
-webkit-line-clamp: 3; // 最多显示几行
overflow: hidden;
```

## 盒模型

题目：谈谈你对CSS盒模型的认识

1. 基本概念：标准模型+IE模型

2. 标准模型和IE模型的区别（计算宽度和高度的不同）

3. CSS如何设置这两种模型

    ```css
    
    box-sizing: content-box; // 浏览器默认的标准模型
    box-sizing: border-box; // IE模型
    
    ```

4. JS如何设置获取盒模型对应的宽和高

    ```js
    
    dom.style.width/height只能取内联样式的宽高
    
    dom.currentStyle.width/height: 只有ie支持
    
    window.getComputedStyle(dom).width/height
    
    dom.getBoundingClientRect().width/height
    
    ```

5. 实例题（根据盒模型解释边距重叠）

6. 父子元素边距重叠，兄弟元素的边距重叠

7. BFC（Block Formatting Contexts：边距重叠解决方案）
    
    基本概念：块级格式化上下文，（IFC是啥）
    
    原理（即BFC的渲染规则是）：BFC元素垂直方向的边距会发生重叠；BFC的区域不会与浮动元素的box重叠；BFC在页面上是一个独立的容器，外面的元素不会影响里面的元素，里面的元素也不会影响外面的元素；计算BFC高度的时候，浮动元素不参与计算

8. 如何创建BFC：float值不为none的值;position的值不为static或者是relative；display为table，table-cell，display: table-caption；overflow的值不为visible的值

9. BFC使用场景有哪些：