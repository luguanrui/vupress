# CSS选择器last-child与last-of-type

## last-child

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

## last-of-type

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
