题目：提升页面性能的方法有哪些
    
- 资源压缩合并，减少HTTP请求
- 非核心代码异步加载->异步加载的方式->异步加载的区别
- 利用浏览器缓存->缓存的分类->缓存的原理
- 使用CDN
- 预解析DNS
```html
<meta http-equiv="x-dns-prefetch-control" content="on">
<link rel="dns-prefetch" href="//host_name_to_prefetch.com">
```
    
## 异步加载的方式
1. 动态脚本加载；
2. defer；
3. async
    
## 异步加载的区别：
    
- defer是在HTML解析完之后才会执行，如果是多个，按照加载的顺序依次执行
- async是在加载完之后立即执行，如果是多个，执行顺序和加载顺序无关
    
## 浏览器缓存：

优点：
- 减少了冗余的数据传输，节省了网费
- 减少了服务器的负担，大大提升了网站的性能
- 加快了客户端加载网页的速度

### 缓存分类

缓存分类:

1. 强缓存

不会向服务器发送请求，直接从缓存中读取资源，在chrome控制台的network选项中可以看到该请求返回200的状态码;

```bash
Expires:Thu,21 Jan 2017 23:39:02 GMT
Cache-Control Cache-Control:max-age=3600
```

2. 协商缓存

向服务器发送请求，服务器会根据这个请求的request header的一些参数来判断是否命中协商缓存，如果命中，则返回304状态码并带上新的response header通知浏览器从缓存中读取资源；

```bash
Last-Modified/If-Modified-Since Last-Modified:Wed,26 Jan 2017 00:35:11 GMT
Etag If-None-Match
```

::: tip 区别
都是从客户端缓存中读取资源；区别是强缓存不会发请求，协商缓存会发请求
:::