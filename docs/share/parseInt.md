# parseInt

[parseInt(string, radix)](http://www.w3school.com.cn/jsref/jsref_parseInt.asp)

## 作用

解析一个字符串，并返回一个整数

## 参数解析

* string

    被解析的字符串
    
* radix

    1、要解析的数字的基数（理解为进制），该值介于 2 ~ 36 之间
    
    2、该参数可以不写，默认是10进制
    
    3、如果该参数小于 2 或者大于 36，则 parseInt() 将返回 NaN
    
## 案例

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

## parseFloat

[parseFloat(string)](http://www.w3school.com.cn/jsref/jsref_parseFloat.asp)

内置函数 parseFloat()，用以解析浮点数字符串，与parseInt()不同的地方是，parseFloat()只应用于解析十进制数字。
