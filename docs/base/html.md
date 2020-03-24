## 标签语义化

- 合理、正确的利用标签，来展示内容页面
- 有利于阅读和页面结构的清晰
- 有利于SEO
- 有利于开发和维护

## 浏览器中输入url回车发生了什么

1. 对URL地址进行DNS域名解析找到对应的IP地址
2. 建立TCP连接（三次握手）
3. 浏览器发送HTTP请求报文
4. 服务器返回HTTP响应报文
5. 关闭TCP连接（四次挥手）
6. 浏览器解析文档资源并渲染页面

## 浏览器的渲染过程

webkit渲染的主要过程:

![webkit渲染过程](../public/webkit-painting.png)

- `解析HTML生成DOM树`：当浏览器接收到服务器响应来的HTML文档后，会遍历文档节点，HTML Parser将HTML标记解析成DOM Tree
- `解析CSS生成CSSOM规则树`：CSS Parse将每个CSS文件都被解析成一个StyleSheet对象，每个对象都包含Style Rules，Style Rules也叫CSSOM（CSS Object Model）
- `将DOM树与CSSOM规则树合并在一起生成渲染树`：Render Tree的构建其实就是DOM Tree和CSSOM Attach的过程(每个 DOM 节点都有一个“attach”方法)
- `遍历渲染树开始布局，计算每个节点的位置大小信息`：创建渲染树后，下一步就是布局（Layout）,或者叫回流（reflow），这个过程就是通过渲染树中渲染对象的信息，计算出每一个渲染对象的位置和尺寸，将其安置在浏览器窗口的正确位置，而有些时候我们会在文档布局完成后对DOM进行修改，这时候可能需要重新进行布局，也可称其为回流，本质上还是一个布局的过程，每一个渲染对象都有一个布局或者回流方法，实现其布局或回流。
- `将渲染树每个节点绘制到屏幕`：在绘制阶段，系统会遍历渲染树，并调用渲染器的“paint”方法，将渲染器的内容显示在屏幕上

说明：

- 在构建DOM Tree的过程中可能会被css或者js的加载而执行阻塞
- 解析dom和解析css同时进行，但是与script执行是互斥的

## 浏览器的回流Reflow与重绘Repaint

1. 当涉及到DOM节点的**布局属性**发生变化时，就会重新计算该属性，浏览器会重新描绘相应的元素，此过程叫**Reflow（回流或重排）**
2. 当影响DOM元素**可见性的属性**发生变化 (如 color) 时, 浏览器会重新描绘相应的元素, 此过程称为**Repaint（重绘）**。因此**回流必然会引起重绘**

触发reflow：
    
- 增加、删除、修改DOM结点时，会导致Reflow和repaint
- 移动DOM的位置，或者搞个动画的时候
- 修改css样式的时候（改变宽高，显示隐藏）
- resize窗口的时候（移动端没有这个问题），或者是滚动的时候
- 修改网页的默认字体时

触发repaint：
    
- DOM改动
- css改动

## href和src区别

1. `href`（Hypertext Reference）标记超文本引用，用在link和a标签等元素上，用来建立当前元素和文档之间的链接，浏览器解析时会标记改文档为css文档，并行下载资源并且不会停止对改文档的处理（这是为什么建议使用link方式加载css，而不是使用@import）
2. `src`表示引用资源，替换当前元素，用在img，script，iframe等上，当浏览器解析到src时，会暂停其他资源的下载和处理（图片不会暂停其他资源的下载和处理），直到将该资源加载、编译、执行完毕，图片和框架等也如此，类似于将所指向资源应用到当前内容。（这也是为什么建议把 js 脚本放在底部而不是头部的原因）

## img标签中的`alt`和`title`属性的作用

1. `alt`：如果无法显示图像，浏览器将显示alt指定的内容
2. `title`：在鼠标移到元素上时显示title的内容

## DOCTYPE的作用

`DOCTYPE`（document type 文档类型）的作用:
- 告诉浏览器的解析器使用哪种HTML规范或者XHTML规范来解析页面（**声明文档类型**）
- DTD规范

> DTD（document type defination，文档类型定义）是一系列的语法规则，用来定义XML或(X)HTML的文件类型。浏览器会使用它来判断文档类型，决定使用何种协议来解析，以及切换浏览器模式。（告诉浏览器当前文档是什么文档类型，浏览器使用相应的引擎来解析和渲染）
    
常见的DOCTYPE有哪些？
    
- HTML5
    
```html
<!DOCTYPE html>
```

- HTML4.01 Strict（严格模式）
    
该DTD包含所有HTML元素和属性，但是不包含展示类的和弃用类的元素（比如font）
    
```html
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
```

- HTML4.01 Transitional（传统模式）

该DTD包含所有HTML元素和属性，包含展示类的和弃用类的元素（比如font）

```html
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
```