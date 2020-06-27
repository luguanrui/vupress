# 移动端1px解决方案

## Sass实现

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
## less实现

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

## stylus实现

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