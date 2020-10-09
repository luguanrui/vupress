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
