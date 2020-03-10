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