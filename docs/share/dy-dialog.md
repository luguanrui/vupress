# 仿抖音评论区移动端弹出框

## 需求

- 从底部向上滑动，页面内容不跟随弹窗的滑动而滑动,滚动到页面的2/3的高度
- 背景有个透明的弹窗弹出
- 弹窗内容太多，可以滑动

![效果图](https://raw.githubusercontent.com/luguanrui/dialog/master/src/imgs/result.gif)

## 思路

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

## 机型测试

ios，andriod，微信

## Q&A

- overflow: auto在ios端滑动不流畅

解决：
```css
overflow: auto;
-webkit-overflow-scrolling: touch;
```



