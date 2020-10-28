# css相关

## 控制div内的元素自动换行

- 含有中文、数字、字母文案换行

### 业务场景

- 在h5页面中，比如课程名称，包含中文，数字，字母
- 数字字母文案太长，导致不换行

### 技术实现

添加如下的`css`:
```css
word-wrap: break-word; // 在长单词或 URL 地址内部进行换行
word-break: break-all;  // 允许在单词内换行
```

- [word-wrap](https://www.w3school.com.cn/cssref/pr_word-wrap.asp)

默认值：normal，允许内容顶开指定的容器边界；break-word，内容将在边界内换行

- [work-break](https://www.w3school.com.cn/cssref/pr_word-break.asp)

## 文字超出隐藏并显示省略号

单行

```css
width:200rpx;
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
```

多行

```css
word-break: break-all;
display: -webkit-box;
-webkit-line-clamp: 2;
-webkit-box-orient: vertical;
overflow: hidden;
```

## 设置input 的placeholder的字体样式

```css
input::-webkit-input-placeholder {    /* Chrome/Opera/Safari */
    color: red;
}
input::-moz-placeholder { /* Firefox 19+ */  
    color: red;
}
input:-ms-input-placeholder { /* IE 10+ */
    color: red;
}
input:-moz-placeholder { /* Firefox 18- */
    color: red;
}
```

## 取消input的边框

```css
border: none;
outline: none;
```

## 隐藏滚动条或更改滚动条样式

```css
/*css主要部分的样式*//*定义滚动条宽高及背景，宽高分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar {
    width: 10px; /*对垂直流动条有效*/
    height: 10px; /*对水平流动条有效*/
}

/*定义滚动条的轨道颜色、内阴影及圆角*/
::-webkit-scrollbar-track{
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
    background-color: rosybrown;
    border-radius: 3px;
}

/*定义滑块颜色、内阴影及圆角*/
::-webkit-scrollbar-thumb{ 
    border-radius: 7px;
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
    background-color: #E8E8E8;
}

/*定义两端按钮的样式*/
::-webkit-scrollbar-button {
    background-color:cyan;
}

/*定义右下角汇合处的样式*/
::-webkit-scrollbar-corner {
    background:khaki;
}
```

## CSS选择器last-child与last-of-type

### last-child

定义：匹配父元素中的最后一个子元素

匹配不到：

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"> 
<title>菜鸟教程(runoob.com)</title> 
<style> 
.my-class:last-child
{
	background:#ff0000;
}
</style>
</head>
<body>

    <h1>This is a heading</h1>
    <p class="my-class">The first paragraph.</p>
    <p class="my-class">The second paragraph.</p>
    <p class="my-class">The third paragraph.</p>
    <p class="my-class">The fourth paragraph.</p>
    <div>匹配不到</div>

</body>
</html>
```

可以匹配到：

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"> 
<title>菜鸟教程(runoob.com)</title> 
<style> 
.my-class:last-child
{
	background:#ff0000;
}
</style>
</head>
<body>

    <h1>This is a heading</h1>
    <p class="my-class">The first paragraph.</p>
    <p class="my-class">The second paragraph.</p>
    <p class="my-class">The third paragraph.</p>
    <p class="my-class">The fourth paragraph.</p>

</body>
</html>
```

### last-of-type

定义：匹配`父级`中最后一个`特定元素`的一个子元素

匹配不到：
```html
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"> 
<title>菜鸟教程(runoob.com)</title> 
<style> 
.my-class:last-of-type{
	background:#ff0000;
}
</style>
</head>
<body>

    <h1>This is a heading</h1>
    <div class="my-class">The first paragraph.</div>
    <div class="my-class">The second paragraph.</div>
    <div class="my-class">The third paragraph.</div>
    <div class="my-class">The fourth paragraph.</div>
    <div>匹配不到</div>

</body>
</html>
```

可以匹配到：

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"> 
<title>菜鸟教程(runoob.com)</title> 
<style> 
.my-class:last-of-type{
	background:#ff0000;
}
</style>
</head>
<body>

    <h1>This is a heading</h1>
    <p class="my-class">The first paragraph.</p>
    <p class="my-class">The second paragraph.</p>
    <p class="my-class">The third paragraph.</p>
    <p class="my-class">The fourth paragraph.</p>
    <div>测试</div>

</body>
</html>
```

## h5吸顶

### 业务场景

页面滚动到一定位置时，tab页固定到页面的顶部

### 技术实现

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

## 让子元素水平垂直居中的方法

### position 

适用的情况：子元素宽高已知(position:absolute )
      
子元素
```css
position: absolute; 
left: 50%;
top: 50%;
margin-left:-自身一半宽度;
margin-top: -自身一半高度; 
```

### table-cell

适用的情况：子元素宽高未知，能实现垂直居中
父元素：
```css  
display: table-cell;
vertical-align: middle; 
```
子元素： 
```css   
margin: 0 auto;
```

### translate

适用的情况：子元素宽高未知(定位 + transform:translate(-50%,-50%))

子元素
```css    
position: relative / absolute; 

/*top和left偏移各为50%*/
top: 50%; 
left: 50%; 

/*translate(-50%,-50%) 偏移自身的宽和高的-50%*/ 
transform: translate(-50%, -50%); 
``` 

### flex

适用的情况：子元素宽高未知
父元素：
```css
display: flex;
align-items: center; 
justify-content: center; 
```


案例：
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>水平垂直居中</title>
    <style>
        .content{
            margin: 50px;
        }
        .parent1{
            position: relative;
            width: 300px;
            height: 300px;
            border: 1px solid #000;
        }
        .child1{
            width: 150px;
            height: 100px;
            border: 1px solid #000;
            position: absolute;
            top: 50% ;
            left: 50%;
            margin-left: -75px;
            margin-top: -50px;
        }

        .parent2{
            display: table-cell;
            vertical-align: middle;
            width: 300px;
            height: 300px;
            border: 1px solid #000;
        }
        .child2{
            width: 100px;
            height: 100px;
            border: 1px solid #000;
            margin:0 auto;
        }

        .parent3{
            position: relative;
            width: 300px;
            height: 300px;
            border: 1px solid #000;
        }
        .child3{
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
            width: 150px;
            height: 100px;
            border: 1px solid #000;
        }

        .parent4{
            display: flex;
            align-items: center;
            justify-content: center;
            width: 300px;
            height: 300px;
            border: 1px solid #000;
        }
    </style>
</head>
<body>
<div class="content">
    <div class="parent1">
        <div class="child1"></div>
    </div>
    <fieldset>
        <legend>position+margin负值</legend>
        <ul>
            <li>
                使用position+margin负值来实现子元素的居中
            </li>
            <li>前提是子元素知道宽高</li>
            <li>子元素设置：position: absolute;top: 50% ;left: 50%;margin-left: -75px;margin-top: -50px;</li>
        </ul>
    </fieldset>
</div>

<div class="content">
    <div class="parent2">
        <div class="child2"></div>
    </div>
    <fieldset>
        <legend>父元素css属性：display: table-cell</legend>
        <ul>
            <li>父元素: display: table-cell实现垂直居中</li>
            <li>子元素：margin:0 auto;</li>
        </ul>
    </fieldset>
</div>

<div class="content">
    <div class="parent3">
        <div class="child3"></div>
    </div>
    <fieldset>
        <legend>子元素position+transform: translate(-50%,-50%);</legend>
        <ul>
            <li>父元素position:relative</li>
            <li>子元素css属性：
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%,-50%);
            </li>
        </ul>
    </fieldset>
</div>

<div class="content">
    <div class="parent4">
        <div class="child4">
            qqqq
        </div>
    </div>
    <fieldset>
        <legend>父元素使用flex</legend>
        <ul>
            <li>
                父元素css属性：
                display: flex;
                align-items: center;
                justify-content: center;
            </li>
            <li>子元素不需要知道宽高</li>
        </ul>
    </fieldset>
</div>
</body>
</html>
```

## 移动端1px解决方案

### Sass实现

1. mixin.scss文件：

```css
@mixin border-1px($color) {
    position: relative;
    &::after {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    content: " ";
    border-bottom: 1px solid $color;
    }
}
```
2. base.scss文件：
```css
@import 'mixin.scss';
@import "common.scss";

.border-bottom {
    @include border-1px(#eee);
    @media (-webkit-min-device-pixel-ratio: 2), (min-device-pixel-ratio: 2) {
    &::after {
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
    }
    }
    @media (-webkit-min-device-pixel-ratio: 3), (min-device-pixel-ratio: 3) {
    &::after {
        -webkit-transform: scaleY(0.33);
        transform: scaleY(0.33);
    }
    }
}
```
### Less实现

1. mixin.less文件：
```css
.border-1px(@color: #e4e4e4){
    position: relative;
    &::after {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    content: ' ';
    border-bottom: 1px solid @color;
    }
}
```

2. base.less文件：
```css
@import "common";
@import "mixin";
@media (-webkit-min-device-pixel-ratio: 2),(min-device-pixel-ratio: 2) {
    .border-1px::after {
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    }
}
@media (-webkit-min-device-pixel-ratio: 3),(min-device-pixel-ratio: 3) {
    .border-1px::after {
    -webkit-transform: scaleY(0.33);
    transform: scaleY(0.33);
    }
}
.border-bottom{
    .border-1px(red)
}
```

### Stylus实现

1. mixin.styl文件：

```css
border-1px($color)
    position: relative
    &:after
    display: block
    position: absolute
    left: 0
    bottom: 0
    width: 100%
    border-top: 1px solid $color
    content: ''
```

2. base.styl文件：
```css
// 1.5倍屏
@media (-webkit-min-device-pixel-ratio: 1.5),(min-device-pixel-ratio: 1.5)
    .border-1px
    &::after
        -webkit-transform: scaleY(0.7)
        transform: scaleY(0.7)

// 2倍屏
@media (-webkit-min-device-pixel-ratio: 2),(min-device-pixel-ratio: 2)
    .border-1px
    &::after
        -webkit-transform: scaleY(0.5)
        transform: scaleY(0.5)

// 3倍屏
@media (-webkit-min-device-pixel-ratio: 3),(min-device-pixel-ratio: 3)
    .border-1px
    &::after
        -webkit-transform: scaleY(0.33)
        transform: scaleY(0.33)
```

## 仿抖音评论区移动端弹出框

### 需求

- 从底部向上滑动，页面内容不跟随弹窗的滑动而滑动,滚动到页面的2/3的高度
- 背景有个透明的弹窗弹出
- 弹窗内容太多，可以滑动

![效果图](https://raw.githubusercontent.com/luguanrui/dialog/master/src/imgs/result.gif)

### 思路

1. 为了方便测试，本地起一个服务，这里我选择了gulp

具体配置可以[参考](https://github.com/AveVlad/gulp-connect)

初始化一个package.json文件

```bash
npm init -y 
```

安装gulp和gulp-connect插件

```bash
npm i gulp gulp-connect -D
```

在项目的根目录下新建一个gulpfile.js配置文件如下：

```js
var gulp = require('gulp');
var connect = require('gulp-connect');

gulp.task('webserver', function () {

    connect.server({
        host: '192.168.1.109',// 本地的ip
        livereload: true,
        port: 8080
    });

});

gulp.task('default', ['webserver']);
```

启动
```bash
gulp
```

2. 样式选择less

```bash
npm i gulp-less -D
```

配置less解析

```js
gulp.task('less2css', function () {
    gulp.src('src/*.less')
        .pipe(less())
        .pipe(gulp.dest('src'))
})
// 监听less文件变化，随时执行less任务
gulp.task('lessAuto2css', function () {
    gulp.watch('src/*.less', ['less2css'])
})
```
添加前缀
```bash
npm i gulp-autoprefixer -D
```

3. 使用flex布局

使用css3的 **animation** 属性

```css
animation: name duration timing-function delay iteration-count direction;
```

实现

```css
animation: up 1s ease;
@keyframes up {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}
    
animation: down 1s ease;
 @keyframes down {
   from {
     transform: translateY(0);
   }
   to {
     transform: translateY(100%);
   }
}  
```
说明：translateY()的百分比是跟自身的高度的比例

### 机型测试

ios，andriod，微信

### Q&A

- overflow: auto在ios端滑动不流畅

解决：
```css
overflow: auto;
-webkit-overflow-scrolling: touch;
```