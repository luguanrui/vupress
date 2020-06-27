# 让子元素水平垂直居中的方法

## position 

适用的情况：子元素宽高已知(position:absolute )
      
子元素
```css
position: absolute; 
left: 50%;
top: 50%;
margin-left:-自身一半宽度;
margin-top: -自身一半高度; 
```

## table-cell

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

## translate

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

## flex

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