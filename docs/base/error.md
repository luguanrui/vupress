## 前端错误的分类

- 即时运行错误：代码错误
- 资源加载错误：js，css，图片加载等错误

## 错误的捕获方式

1. 即时运行错误的捕获方式：
   - try...catch
   - window.onerror

2. 资源加载错误的捕获方式：
   - object.onerror
   - performance.getEntries()，返回一个数组
   - Error事件捕获
    ```js
    window.addEventListener('error',function(e){
        console.log('捕获错误',e)
    },true)
    ```

问：跨域的js运行错误可以捕获嘛，错误提示什么，应该怎么处理？

答：可以捕获到错误信息，拿不到如下信息：出错文件，出错行号，出错列号，错误信息

## 处理方式

1. 在script标签增加`crossorigin`属性
2. 设置js资源响应头`Access-Control-Allow-Origin:*`

## 上报错误的基本原理

1. 采用Ajax通信的方式上报
2. 利用Image对象上报（所有的监控系统都是基于此来做的）
