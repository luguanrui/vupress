# JavaScript

## 根据图片url，下载图片

```js
function urlDownloadIamge(imgsrc, name) { //要下载图片地址和图片名
    let image = new Image();
    // 解决跨域 Canvas 污染问题
    image.setAttribute("crossOrigin", "anonymous");
    image.onload = function() {
      let canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      let context = canvas.getContext("2d");
      context.drawImage(image, 0, 0, image.width, image.height);
      let url = canvas.toDataURL("image/png"); //得到图片的base64编码数据
      let a = document.createElement("a"); // 生成一个a元素
      let event = new MouseEvent("click"); // 创建一个单击事件
      a.download = name || "photo"; // 设置图片名称
      a.href = url; // 将生成的URL设置为a.href属性
      a.dispatchEvent(event); // 触发a的单击事件
    };
    image.src = imgsrc;
  }
  
```

## 获取某年某个月的最后一天

### 业务场景

- 父组件有一个日期选择器，只能选择到月，不可以选择具体的天
- 子组件接收父组件传入的日期，回显出本月的开始天和结束天

### 技术实现

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

## scrollIntoView

### 业务场景

- 页面底部有两个tab页面
- 进入页面中时，要求tab切换到某一个tab，并且tab页面自动吸顶

### 技术实现

```js
Element.scrollIntoView()
```

### 说明
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

## parseInt的正确使用

[parseInt(string, radix)](http://www.w3school.com.cn/jsref/jsref_parseInt.asp)

### 作用

解析一个字符串，并返回一个整数

### 参数解析

* string

    被解析的字符串
    
* radix

    1、要解析的数字的基数（理解为进制），该值介于 2 ~ 36 之间
    
    2、该参数可以不写，默认是10进制
    
    3、如果该参数小于 2 或者大于 36，则 parseInt() 将返回 NaN
    
### 案例

```js
parseInt("10")=1 \* 10<sup>1</sup>+0 \* 10<sup>0</sup> = 10

parseInt("19",10)=1 \* 10<sup>1</sup>+9 \* 10<sup>0</sup> = 19


parseInt("11",2)=1 \* 2<sup>1</sup>+1 \* 2<sup>0</sup> = 3


parseInt("17",8)=1 \* 8<sup>1</sup>+7 \* 8<sup>0</sup> = 15


parseInt("1f",16)=1 \* 16<sup>1</sup>+15 \* 16<sup>0</sup> = 31

parseInt("0x1f")=1 \* 16<sup>1</sup>+15 \* 16<sup>0</sup> = 31

parseInt("010"); //未定：返回 10 或 8（2013 年以前的 JavaScript 实现结果是8）

parseInt('11.abc'); // 返回 11
parseInt('abc11'); // 返回 NaN
```
:::tip 说明
1. 从左至右解析字符串
2. 如果字符串中包含非数字，解析到非数字的位置即停止解析
:::

### parseFloat

[parseFloat(string)](http://www.w3school.com.cn/jsref/jsref_parseFloat.asp)

内置函数 parseFloat()，用以解析浮点数字符串，与parseInt()不同的地方是，parseFloat()只应用于解析十进制数字。
